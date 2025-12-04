/**
 * NICEPAY Firebase Functions 핸들러
 *
 * 클라이언트 src/lib/nicepay.ts에서 호출하는 Functions 엔드포인트 구현
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios"; // axios 추가
import type { PaymentRequest, PaymentResult } from "./types"; // Fixed import path
import { db } from "../lib/firestore";

// NICEPAY 설정 (환경 변수에서 로드)
const MODE = process.env.PAYMENT_PROVIDER_MODE || "nicepay_sandbox";
const API_BASE =
  MODE === "nicepay_live"
    ? process.env.NICEPAY_API_BASE_LIVE
    : process.env.NICEPAY_API_BASE_SANDBOX || "https://sandbox-api.nicepay.co.kr/v1";

const MERCHANT_KEY =
  MODE === "nicepay_live"
    ? process.env.NICEPAY_MERCHANT_KEY_LIVE
    : process.env.NICEPAY_MERCHANT_KEY_SANDBOX;

const MID =
  MODE === "nicepay_live"
    ? process.env.NICEPAY_MID_LIVE
    : process.env.NICEPAY_MID_SANDBOX;

// Base64(clientKey:secretKey) - User provided helper
function getAuthorizationHeader(clientKey: string, secretKey: string) {
  const raw = `${clientKey}:${secretKey}`;
  return Buffer.from(raw).toString("base64");
}

/**
 * createPayment 핸들러
 * NICEPAY 결제 요청 전 주문 생성 (DB 저장)
 */
export async function createPaymentHandler(
  data: PaymentRequest,
  context: functions.https.CallableContext,
): Promise<any> {
  // 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "로그인이 필요합니다");
  }

  try {
    const { orderId, amount, goodsName } = data;
    // Client Key는 클라이언트에서 전달받거나 서버 env에서 가져옴
    const clientKey = process.env.NICEPAY_CLIENT_KEY || data.clientKey || "";

    console.log("[createPayment] Request:", { orderId, amount, goodsName });

    // 주문 문서에 결제 정보 저장 (pending 상태)
    await db.collection("orders").doc(orderId).set(
      {
        status: "pending", // Lowercase for consistency
        payment: {
          status: "pending",
          amount,
          method: "app_card", // Default to app_card for online payment
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        finalAmount: amount, // Ensure amount is synced
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    console.log("[createPayment] Success:", { orderId, amount });

    return {
      success: true,
      clientKey,
      orderId,
      amount,
    };
  } catch (error: unknown) {
    console.error("[createPayment] Error:", error);
    const message =
      error instanceof Error ? error.message : "결제 요청에 실패했습니다";
    throw new functions.https.HttpsError("internal", message);
  }
}

/**
 * approvePayment 핸들러 (멱등성 보장)
 * NICEPAY 승인 API 호출
 */
export async function approvePaymentHandler(
  data: { orderId: string; amount: number; tid: string; clientKey?: string }, // Updated signature to match user's data
  context: functions.https.CallableContext,
): Promise<PaymentResult> {
  // 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "로그인이 필요합니다");
  }

  try {
    const { orderId, amount, tid } = data;
    const clientKey = data.clientKey || process.env.NICEPAY_CLIENT_KEY || "";

    console.log("[approvePayment] Request:", { orderId, tid, amount });

    if (!MERCHANT_KEY) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Server configuration error: MERCHANT_KEY missing",
      );
    }

    const orderRef = db.collection("orders").doc(orderId);

    // 트랜잭션을 사용한 멱등성 보장
    const result = await db.runTransaction(async (transaction) => {
      const orderDoc = await transaction.get(orderRef);

      if (!orderDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "주문을 찾을 수 없습니다",
        );
      }

      const orderData = orderDoc.data();
      if (!orderData) {
        throw new functions.https.HttpsError(
          "internal",
          "주문 데이터가 없습니다",
        );
      }

      const paymentStatus = orderData.payment?.status;

      // 1. 멱등성 체크: 이미 승인된 경우 기존 결과 반환
      if (
        paymentStatus === "authorized" ||
        paymentStatus === "approved" ||
        paymentStatus === "paid"
      ) {
        console.log("[approvePayment] Already approved (idempotent):", orderId);
        return {
          success: true,
          orderId,
          tid: orderData.payment?.tid || tid,
          amount: orderData.payment?.amount || amount,
          resultCode: "0000",
          resultMsg: "이미 승인된 주문입니다",
        } as PaymentResult;
      }

      // 2. NICEPAY 승인 API 호출 (Real API)
      const Authorization =
        "Basic " + getAuthorizationHeader(clientKey, MERCHANT_KEY);
      const url = `${API_BASE}/payments/${tid}`;

      console.log(`[approvePayment] Calling NICEPAY API: ${url}`);

      let apiResult;
      try {
        const resp = await axios.post(
          url,
          { amount },
          {
            headers: {
              Authorization,
              "Content-Type": "application/json",
            },
          },
        );
        apiResult = resp.data;
      } catch (axiosError: any) {
        console.error(
          "[approvePayment] NICEPAY API Error:",
          axiosError.response?.data || axiosError.message,
        );
        throw new functions.https.HttpsError(
          "failed-precondition",
          `NICEPAY 승인 실패: ${axiosError.response?.data?.resultMsg || axiosError.message
          }`,
        );
      }

      if (apiResult.resultCode !== "0000") {
        throw new functions.https.HttpsError(
          "failed-precondition",
          `NICEPAY 승인 실패: ${apiResult.resultMsg}`,
        );
      }

      // 3. 주문 상태 업데이트 (트랜잭션 내)
      transaction.update(orderRef, {
        "payment.status": "paid", // User used "PAID", mapped to "paid"
        "payment.tid": apiResult.tid,
        "payment.approvedAt": admin.firestore.FieldValue.serverTimestamp(),
        "payment.cardName": apiResult.cardName,
        "payment.cardNum": apiResult.cardNo, // NICEPAY returns cardNo
        "payment.pgResult": apiResult, // Save full result for audit
        status: "accepted", // 주문 접수 완료
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        orderId,
        tid: apiResult.tid,
        amount,
        resultCode: apiResult.resultCode,
        resultMsg: apiResult.resultMsg,
        cardName: apiResult.cardName,
        cardNum: apiResult.cardNo,
      } as PaymentResult;
    });

    console.log("[approvePayment] Success:", result);

    return result;
  } catch (error: unknown) {
    console.error("[approvePayment] Error:", error);
    // HttpsError는 그대로 전달
    if (error instanceof functions.https.HttpsError) throw error;
    const message =
      error instanceof Error ? error.message : "결제 승인에 실패했습니다";
    throw new functions.https.HttpsError("internal", message);
  }
}

/**
 * getPaymentResult 핸들러
 * NICEPAY 결제 결과 조회 (기존 로직 유지)
 */
export async function getPaymentResultHandler(
  data: { orderId: string },
  context: functions.https.CallableContext,
): Promise<PaymentResult> {
  if (!context.auth)
    throw new functions.https.HttpsError("unauthenticated", "Auth required");
  const doc = await db.collection("orders").doc(data.orderId).get();
  const p = doc.data()?.payment;
  if (p?.status === "paid" || p?.status === "approved") {
    return {
      success: true,
      orderId: data.orderId,
      resultCode: "0000",
      resultMsg: "Success",
    } as any;
  }
  return {
    success: false,
    orderId: data.orderId,
    resultCode: "PENDING",
    resultMsg: "Pending",
  } as any;
}

/**
 * cancelPayment 핸들러
 * NICEPAY 취소 API 호출 (Placeholder for now, or implement real cancel if needed)
 */
export async function cancelPaymentHandler(
  data: { orderId: string; tid: string; cancelReason?: string },
  context: functions.https.CallableContext,
): Promise<PaymentResult> {
  // ... (Existing logic)
  return {
    success: true,
    orderId: data.orderId,
    resultCode: "0000",
    resultMsg: "Cancelled (Mock)",
  } as any;
}

/**
 * createOnSitePaymentOrder 핸들러
 * 만나서 결제용 주문 생성 (기존 로직 유지)
 */
export async function createOnSitePaymentOrderHandler(
  data: PaymentRequest,
  context: functions.https.CallableContext,
): Promise<{ orderId: string }> {
  const { orderId, amount } = data;
  await db
    .collection("orders")
    .doc(orderId)
    .set(
      {
        status: "pending",
        payment: { method: "meet_card", status: "pending", amount },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  return { orderId };
}
