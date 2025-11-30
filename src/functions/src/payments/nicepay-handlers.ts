/**
 * NICEPAY Firebase Functions 핸들러
 *
 * 클라이언트 src/lib/nicepay.ts에서 호출하는 Functions 엔드포인트 구현
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import type { PaymentRequest, PaymentResult } from "../types/payment";
import { db } from "../lib/firestore";

// NICEPAY 설정
const NICEPAY_CONFIG = {
  mid: process.env.NICEPAY_MID ?? "NICE_DEV_MID",
  clientKey: process.env.NICEPAY_CLIENT_KEY ?? "NICE_DEV_KEY",
  secretKey: process.env.NICEPAY_SECRET_KEY ?? "NICE_DEV_SECRET",
  apiUrl: process.env.NICEPAY_API_URL ?? "https://sandbox-api.nicepay.co.kr",
};

/**
 * SHA-256 해시 생성 (서버용)
 */
async function generateHash(data: string): Promise<string> {
  const crypto = await import("crypto");
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * 전문 생성일시 (YYYYMMDDhhmmss)
 */
function getEdiDate(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}${hh}${mi}${ss}`;
}

/**
 * createPayment 핸들러
 * NICEPAY Auth(결제창 URL) 요청 준비
 */
export async function createPaymentHandler(
  data: PaymentRequest,
  context: functions.https.CallableContext,
): Promise<{ authUrl: string; authToken: string }> {
  // 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "로그인이 필요합니다");
  }

  try {
    const { orderId, amount, goodsName } = data;

    console.log("[createPayment] Request:", { orderId, amount, goodsName });

    // Mock 응답 (실제 API 구현 시 교체)
    const ediDate = getEdiDate();
    // Hash generation placeholder usage
    await generateHash(
      `${NICEPAY_CONFIG.mid}${amount}${orderId}${ediDate}${NICEPAY_CONFIG.secretKey}`,
    );

    // Mock authUrl 및 authToken 생성
    const authToken = `MOCK_TOKEN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const authUrl = `https://sandbox.nicepay.co.kr/demo/auth?orderId=${orderId}&token=${authToken}`;

    // 주문 문서에 결제 정보 저장 (pending 상태)
    await db.collection("orders").doc(orderId).update({
      "payment.authToken": authToken,
      "payment.authUrl": authUrl,
      "payment.status": "pending",
      "payment.requestedAt": admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("[createPayment] Success:", { authUrl, authToken });

    return {
      authUrl,
      authToken,
    };
  } catch (error: unknown) {
    console.error("[createPayment] Error:", error);
    const message = error instanceof Error ? error.message : "결제 요청에 실패했습니다";
    throw new functions.https.HttpsError("internal", message);
  }
}

/**
 * approvePayment 핸들러
 * NICEPAY 승인 API 호출
 */
export async function approvePaymentHandler(
  data: { orderId: string; authToken: string },
  context: functions.https.CallableContext,
): Promise<PaymentResult> {
  // 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "로그인이 필요합니다");
  }

  try {
    const { orderId, authToken } = data;

    console.log("[approvePayment] Request:", { orderId, authToken });

    // Mock 응답 (실제 API 구현 시 교체)
    const orderDoc = await db.collection("orders").doc(orderId).get();
    if (!orderDoc.exists) {
      throw new functions.https.HttpsError("not-found", "주문을 찾을 수 없습니다");
    }

    const orderData = orderDoc.data();
    const amount = orderData?.finalAmount || orderData?.amount || 0;

    const mockResult: PaymentResult = {
      success: true,
      orderId,
      tid: `TID_${Date.now()}`,
      amount,
      resultCode: "0000",
      resultMsg: "결제가 완료되었습니다",
      authToken,
      cardName: "신한카드",
      cardNum: "1234-****-****-5678",
    };

    // 주문 상태 업데이트
    await db.collection("orders").doc(orderId).update({
      "payment.status": "authorized",
      "payment.tid": mockResult.tid,
      "payment.approvedAt": admin.firestore.FieldValue.serverTimestamp(),
      status: "accepted", // 주문 접수 완료
    });

    console.log("[approvePayment] Success:", mockResult);

    return mockResult;
  } catch (error: unknown) {
    console.error("[approvePayment] Error:", error);
    const message = error instanceof Error ? error.message : "결제 승인에 실패했습니다";
    throw new functions.https.HttpsError("internal", message);
  }
}

/**
 * getPaymentResult 핸들러
 * NICEPAY 결제 결과 조회
 */
export async function getPaymentResultHandler(
  data: { orderId: string },
  context: functions.https.CallableContext,
): Promise<PaymentResult> {
  // 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "로그인이 필요합니다");
  }

  try {
    const { orderId } = data;

    console.log("[getPaymentResult] Request:", { orderId });

    const orderDoc = await db.collection("orders").doc(orderId).get();
    if (!orderDoc.exists) {
      throw new functions.https.HttpsError("not-found", "주문을 찾을 수 없습니다");
    }

    const orderData = orderDoc.data();
    const payment = orderData?.payment || {};

    // 결제 상태 확인
    if (payment.status === "authorized" || payment.status === "completed") {
      return {
        success: true,
        orderId,
        tid: payment.tid,
        amount: payment.amount || orderData?.finalAmount,
        resultCode: "0000",
        resultMsg: "결제가 완료되었습니다",
        authToken: payment.authToken,
      };
    }

    // 아직 처리 중
    return {
      success: false,
      orderId,
      resultCode: "PENDING",
      resultMsg: "결제 처리 중입니다",
    };
  } catch (error: unknown) {
    console.error("[getPaymentResult] Error:", error);
    const message = error instanceof Error ? error.message : "결제 결과 조회에 실패했습니다";
    throw new functions.https.HttpsError("internal", message);
  }
}

/**
 * cancelPayment 핸들러
 * NICEPAY 취소 API 호출
 */
export async function cancelPaymentHandler(
  data: { orderId: string; tid: string; cancelReason?: string },
  context: functions.https.CallableContext,
): Promise<PaymentResult> {
  // 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "로그인이 필요합니다");
  }

  try {
    const { orderId, tid, cancelReason } = data;

    console.log("[cancelPayment] Request:", { orderId, tid, cancelReason });

    // Mock 응답 (실제 API 구현 시 교체)
    const orderDoc = await db.collection("orders").doc(orderId).get();
    if (!orderDoc.exists) {
      throw new functions.https.HttpsError("not-found", "주문을 찾을 수 없습니다");
    }

    const orderData = orderDoc.data();
    const amount = orderData?.payment?.amount || orderData?.finalAmount || 0;

    const mockResult: PaymentResult = {
      success: true,
      orderId,
      tid,
      amount,
      resultCode: "0000",
      resultMsg: "결제가 취소되었습니다",
    };

    // 주문 상태 업데이트
    await db
      .collection("orders")
      .doc(orderId)
      .update({
        "payment.status": "cancelled",
        "payment.cancelledAt": admin.firestore.FieldValue.serverTimestamp(),
        "payment.cancelReason": cancelReason || "사용자 취소",
        status: "cancelled",
      });

    console.log("[cancelPayment] Success:", mockResult);

    return mockResult;
  } catch (error: unknown) {
    console.error("[cancelPayment] Error:", error);
    const message = error instanceof Error ? error.message : "결제 취소에 실패했습니다";
    throw new functions.https.HttpsError("internal", message);
  }
}

/**
 * createOnSitePaymentOrder 핸들러
 * 만나서 결제용 주문 생성
 */
export async function createOnSitePaymentOrderHandler(
  data: PaymentRequest,
  context: functions.https.CallableContext,
): Promise<{ orderId: string }> {
  // 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "로그인이 필요합니다");
  }

  try {
    const { orderId, amount, goodsName, buyerName, buyerTel, buyerEmail } = data;

    console.log("[createOnSitePaymentOrder] Request:", { orderId, amount, goodsName });

    // 주문 문서 생성 또는 업데이트 (pending 상태)
    const orderRef = db.collection("orders").doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      // 새 주문 생성
      await orderRef.set({
        orderId,
        userId: context.auth.uid,
        finalAmount: amount,
        status: "pending",
        payment: {
          method: "meet_card",
          status: "pending",
          amount,
        },
        customerInfo: {
          name: buyerName,
          phone: buyerTel,
          email: buyerEmail,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // 기존 주문 업데이트
      await orderRef.update({
        "payment.method": "meet_card",
        "payment.status": "pending",
        "payment.amount": amount,
        status: "pending",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    console.log("[createOnSitePaymentOrder] Success:", { orderId });

    return { orderId };
  } catch (error: unknown) {
    console.error("[createOnSitePaymentOrder] Error:", error);
    const message = error instanceof Error ? error.message : "주문 생성에 실패했습니다";
    throw new functions.https.HttpsError("internal", message);
  }
}
