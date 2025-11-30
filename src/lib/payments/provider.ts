import { PaymentMethod } from "@/types/order";

export interface PaymentRequestPayload {
  orderId: string;           // Firestore order document ID
  amount: number;
  method: PaymentMethod;     // Enum
  clientOrderId: string;     // 멱등 키(프론트 생성)
  returnUrl: string;
  cancelUrl: string;
  goodsName: string;
  buyerName?: string;
  buyerTel?: string;
  buyerEmail?: string;
}

export interface PaymentInitResult {
  redirectUrl?: string;      // PG 결제 페이지 URL (호출형)
  htmlForm?: string;         // 필요 시 PG HTML form string
  pgOrderId: string;         // PG에서 생성한 거래 ID
  paymentData?: any;         // 기타 PG별 필요 데이터
}

export interface PaymentConfirmPayload {
  orderId: string;
  pgOrderId?: string;        // PG Order ID
  pgToken?: string;          // PG Auth Token (NICEPAY 등)
  pgTxId?: string;           // PG Transaction ID
  amount?: number;           // 검증용 금액
}

export interface PaymentResult {
  success: boolean;
  approvedAt?: string;
  approvedAmount?: number;
  pgOrderId?: string;
  pgTid?: string;
  pgReceiptUrl?: string;
  cardName?: string;
  cardNum?: string;
  failReason?: string;
  failCode?: string;
}

export interface PaymentProvider {
  initPayment(payload: PaymentRequestPayload): Promise<PaymentInitResult>;
  confirmPayment(payload: PaymentConfirmPayload): Promise<PaymentResult>;
}

