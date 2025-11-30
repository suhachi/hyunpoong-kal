// NICEPAY 결제 요청 파라미터
export interface PaymentRequest {
  orderId: string;
  amount: number;
  goodsName: string;
  buyerName: string;
  buyerTel: string;
  buyerEmail: string;
}

// 결제 결과
export interface PaymentResult {
  success: boolean;
  orderId: string;
  tid?: string;
  amount?: number;
  resultCode?: string;
  resultMsg?: string;
  authToken?: string;
  cardName?: string;
  cardNum?: string;
}

