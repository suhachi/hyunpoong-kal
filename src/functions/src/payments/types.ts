export type PaymentMethod = "app_card" | "meet_card" | "meet_cash";

export interface PaymentRequestPayload {
  orderId: string;
  amount: number;
  method: PaymentMethod;
  clientOrderId: string;
  returnUrl: string;
  cancelUrl: string;
  goodsName: string;
  buyerName?: string;
  buyerTel?: string;
  buyerEmail?: string;
}

export interface PaymentInitResult {
  redirectUrl?: string;
  htmlForm?: string;
  pgOrderId: string;
  paymentData?: any;
}

export interface PaymentConfirmPayload {
  orderId: string;
  pgOrderId?: string;
  pgToken?: string;
  pgTxId?: string;
  amount?: number;
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

