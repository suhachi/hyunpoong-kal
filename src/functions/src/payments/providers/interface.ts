import { 
  PaymentRequestPayload, 
  PaymentInitResult, 
  PaymentConfirmPayload, 
  PaymentResult 
} from "../types";

export interface PaymentProvider {
  initPayment(payload: PaymentRequestPayload): Promise<PaymentInitResult>;
  confirmPayment(payload: PaymentConfirmPayload): Promise<PaymentResult>;
  cancelPayment(payload: { orderId: string; tid: string; reason: string; amount: number }): Promise<PaymentResult>;
}

