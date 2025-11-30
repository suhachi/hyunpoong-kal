/**
 * NICEPAY 결제 연동
 * DEV/STG/PRD 환경별 엔드포인트 관리
 */

import * as functions from "firebase-functions";
import fetch from "node-fetch";

// NICEPAY 환경 설정
const NICEPAY_CONFIG = {
  dev: {
    endpoint: "https://sandbox-api.nicepay.co.kr",
    mid: functions.config().nice?.mid || "NICE_DEV_MID",
    key: functions.config().nice?.key || "NICE_DEV_KEY",
    siteCode: functions.config().nice?.site || "NICE_DEV_SITE_CODE",
  },
  prod: {
    endpoint: "https://api.nicepay.co.kr",
    mid: functions.config().nice?.mid_prod || "",
    key: functions.config().nice?.key_prod || "",
    siteCode: functions.config().nice?.site_prod || "",
  },
};

const ENV = (functions.config().app?.env as "dev" | "prod") || "dev";

export interface PaymentResponse {
  success: boolean;
  tid: string;
  amount: number;
  orderId: string;
  approvedAt: string;
  error?: string;
}

export interface PaymentCancelResponse {
  success: boolean;
  tid: string;
  canceledAt: string;
  reason: string;
  error?: string;
}

export interface CashReceiptResponse {
  success: boolean;
  tid: string;
  receiptNo: string;
  issuedAt: string;
  error?: string;
}

/**
 * 결제 승인
 */
export async function authorizePayment(data: {
  amount: number;
  orderId: string;
  cardInfo?: unknown;
  [key: string]: unknown;
}): Promise<PaymentResponse> {
  const config = NICEPAY_CONFIG[ENV];

  try {
    console.log("NICEPAY authorize request:", {
      mid: config.mid,
      amount: data.amount,
      orderId: data.orderId,
    });

    // Simulated Payment Authorization
    return {
      success: true,
      tid: `TID${Date.now()}`,
      amount: data.amount,
      orderId: data.orderId,
      approvedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("NICEPAY authorize error:", error);
    throw new Error("결제 승인에 실패했습니다");
  }
}

/**
 * 결제 취소 (망취소)
 */
export async function cancelPayment(data: {
  tid: string;
  reason: string;
  amount?: number;
}): Promise<PaymentCancelResponse> {
  const config = NICEPAY_CONFIG[ENV];

  try {
    console.log("NICEPAY cancel request:", {
      mid: config.mid,
      tid: data.tid,
      reason: data.reason,
    });

    // Simulated Payment Cancellation
    return {
      success: true,
      tid: data.tid,
      canceledAt: new Date().toISOString(),
      reason: data.reason,
    };
  } catch (error) {
    console.error("NICEPAY cancel error:", error);
    throw new Error("결제 취소에 실패했습니다");
  }
}

/**
 * 현금영수증 발급
 */
export async function issueCashReceipt(data: {
  tid: string;
  phoneOrBizNo: string;
  amount: number;
}): Promise<CashReceiptResponse> {
  const config = NICEPAY_CONFIG[ENV];

  try {
    console.log("NICEPAY cash receipt request:", {
      mid: config.mid,
      tid: data.tid,
      phoneOrBizNo: data.phoneOrBizNo,
    });

    // Simulated Cash Receipt Issuance
    return {
      success: true,
      tid: data.tid,
      receiptNo: `CR${Date.now()}`,
      issuedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("NICEPAY cash receipt error:", error);
    throw new Error("현금영수증 발급에 실패했습니다");
  }
}
