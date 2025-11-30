import { PaymentProvider } from "./interface";
import { 
  PaymentRequestPayload, 
  PaymentInitResult, 
  PaymentConfirmPayload, 
  PaymentResult 
} from "../types";
import * as admin from "firebase-admin";

// Mock Provider for Sandbox/Dev
export class MockPaymentProvider implements PaymentProvider {
  async initPayment(payload: PaymentRequestPayload): Promise<PaymentInitResult> {
    console.log("[MockPayment] initPayment:", payload);
    const pgOrderId = `MOCK_OID_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Mock: 프론트에서 바로 승인 요청을 보낼 수 있도록 redirectUrl 시뮬레이션
    // 실제로는 PG 결제창 URL이어야 함
    const redirectUrl = `${payload.returnUrl}?orderId=${payload.orderId}&pgOrderId=${pgOrderId}&resultCode=0000`;

    return {
      redirectUrl,
      pgOrderId,
      paymentData: {
        mockAuthToken: "mock_token_12345"
      }
    };
  }

  async confirmPayment(payload: PaymentConfirmPayload): Promise<PaymentResult> {
    console.log("[MockPayment] confirmPayment:", payload);
    
    // 80% 확률로 성공, 20% 확률로 실패 시뮬레이션 (필요시 조절)
    const isSuccess = true; // 항상 성공으로 고정 (개발 편의성)

    if (isSuccess) {
      return {
        success: true,
        approvedAt: new Date().toISOString(),
        approvedAmount: payload.amount || 0,
        pgOrderId: payload.pgOrderId || `MOCK_OID_${Date.now()}`,
        pgTid: `MOCK_TID_${Date.now()}`,
        pgReceiptUrl: "https://mock.pg.com/receipt/12345",
        cardName: "현풍카드",
        cardNum: "1234-****-****-5678"
      };
    } else {
      return {
        success: false,
        failCode: "MOCK_ERR_001",
        failReason: "테스트 결제 실패 시뮬레이션"
      };
    }
  }

  async cancelPayment(payload: { orderId: string; tid: string; reason: string; amount: number }): Promise<PaymentResult> {
    console.log("[MockPayment] cancelPayment:", payload);
    return {
      success: true,
      pgTid: payload.tid,
      approvedAmount: payload.amount,
      approvedAt: new Date().toISOString() // Cancelled at
    };
  }
}

