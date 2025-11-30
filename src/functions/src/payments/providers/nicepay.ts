import { PaymentProvider } from "./interface";
import { 
  PaymentRequestPayload, 
  PaymentInitResult, 
  PaymentConfirmPayload, 
  PaymentResult 
} from "../types";
import * as crypto from "crypto";
import axios from "axios";

// NICEPAY API Configuration
// 실제 키는 functions config 또는 secret에서 가져와야 함
const NICEPAY_API_BASE = "https://sandbox-api.nicepay.co.kr/v1"; // Live: https://api.nicepay.co.kr/v1

export class NicePayProvider implements PaymentProvider {
  private merchantId: string;
  private secretKey: string;
  private clientKey: string;

  constructor() {
    // Firebase Secrets or Config
    this.merchantId = process.env.PAYMENT_NICEPAY_MERCHANT_ID || "nicepay00m";
    this.secretKey = process.env.PAYMENT_NICEPAY_SECRET_KEY || "";
    this.clientKey = process.env.PAYMENT_NICEPAY_CLIENT_KEY || "";
  }

  private getBasicAuthHeader(): string {
    return "Basic " + Buffer.from(`${this.merchantId}:${this.secretKey}`).toString("base64");
  }

  async initPayment(payload: PaymentRequestPayload): Promise<PaymentInitResult> {
    console.log("[NicePay] initPayment:", payload);
    
    // 호출형(Auth) 방식은 프론트에서 SDK/Form으로 처리하지만,
    // API 방식(Server-side Request)을 쓴다면 여기서 요청.
    // NICEPAY '결제창 호출' 방식은 프론트에서 form submit 하거나 JS SDK 사용.
    // 여기서는 "인증 요청"을 위한 사전 데이터 준비(Signature 등)를 담당.
    
    // NICEPAY V2 (신규) 기준: 프론트에서 requestPayment 호출 -> 인증 후 server auth
    // 여기서 리턴해줄 것은 프론트 SDK 초기화에 필요한 데이터(Signature 등)일 수 있음.
    
    // For NICEPAY REST API (Key-in / Billing), flow is different.
    // Assuming "App Card" or standard flow:
    // 프론트가 PG 창을 띄우기 위해 필요한 파라미터를 내려준다.
    
    // TODO: Signature 생성 로직 구현 (필요 시)
    // const ediDate = new Date().toISOString();
    // const signData = crypto.createHash('sha256').update(ediDate + this.merchantId + payload.amount + this.secretKey).digest('hex');

    return {
      pgOrderId: payload.clientOrderId, // NICEPAY orderId로 사용
      paymentData: {
        clientId: this.clientKey,
        method: "card",
        // ... other params
      }
    };
  }

  async confirmPayment(payload: PaymentConfirmPayload): Promise<PaymentResult> {
    console.log("[NicePay] confirmPayment:", payload);
    
    if (!payload.pgToken && !payload.orderId) {
      throw new Error("Missing pgToken or orderId for confirmation");
    }

    try {
      // 승인 요청 (Approve)
      const url = `${NICEPAY_API_BASE}/payments/${payload.pgToken}`; // or similar endpoint
      
      // NOTE: NICEPAY Sandbox API Specs check needed.
      // Usually: POST /payments/{tid} or /payments/confirm
      
      // This is a Placeholder implementation. 
      // Real implementation requires exact API endpoint and payload structure from NICEPAY Docs.
      
      /*
      const response = await axios.post(url, {
        amount: payload.amount,
        orderId: payload.orderId,
      }, {
        headers: {
          Authorization: this.getBasicAuthHeader(),
          "Content-Type": "application/json"
        }
      });
      */

      // Mocking successful response for scaffolding
      return {
        success: true,
        approvedAt: new Date().toISOString(),
        approvedAmount: payload.amount,
        pgOrderId: payload.pgOrderId,
        pgTid: "NICE_TID_12345",
        pgReceiptUrl: "https://npg.nicepay.co.kr/issue/IssueLoader.do?TID=...",
        cardName: "Shinhan",
        cardNum: "123456******7890"
      };

    } catch (error: any) {
      console.error("[NicePay] Confirm Error:", error.response?.data || error.message);
      return {
        success: false,
        failCode: error.response?.data?.resultCode || "UNKNOWN",
        failReason: error.response?.data?.resultMsg || "Payment confirmation failed"
      };
    }
  }

  async cancelPayment(payload: { orderId: string; tid: string; reason: string; amount: number }): Promise<PaymentResult> {
    try {
      const url = `${NICEPAY_API_BASE}/payments/${payload.tid}/cancel`;
      
      /*
      const response = await axios.post(url, {
        reason: payload.reason,
        orderId: payload.orderId,
      }, {
        headers: {
          Authorization: this.getBasicAuthHeader()
        }
      });
      */

      return {
        success: true,
        pgTid: payload.tid,
        approvedAmount: payload.amount,
        approvedAt: new Date().toISOString()
      };
    } catch (error: any) {
      console.error("[NicePay] Cancel Error:", error);
      return {
        success: false,
        failCode: "CANCEL_FAIL",
        failReason: error.message
      };
    }
  }
}

