import { FirestoreTimestamp } from "./common";

export enum OrderStatus {
  PENDING = "pending", // 접수대기
  ACCEPTED = "accepted", // 접수확인
  COOKING = "cooking", // 조리중
  DELIVERING = "delivering", // 배달중
  COMPLETED = "completed", // 완료
  CANCELLED = "cancelled", // 취소
}

export enum PaymentMethod {
  APP_CARD = "app_card", // 앱 내 카드 선결제
  MEET_CARD = "meet_card", // 만나서 카드 결제
  MEET_CASH = "meet_cash", // 만나서 현금 결제
}

export enum PaymentStatus {
  PENDING = "pending",
  AUTHORIZED = "authorized", // PG 인증 완료 (승인 전)
  APPROVED = "approved", // 결제 승인 완료 (PAID)
  FAILED = "failed",
  REFUNDED = "refunded",
  CANCELLED = "cancelled",
}

export interface OrderItem {
  menuId: string;
  menuName: string;
  menuImage: string;
  quantity: number;
  options: {
    noodle?: string;
    spicy?: string;
    toppings?: string[];
  };
  price: number;
  subtotal: number;
}

export interface DeliveryAddress {
  address: string;
  detail: string;
  lat?: number;
  lng?: number;
}

export interface OrderPaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  
  // PG 관련 정보 (App 결제 시)
  pgProvider?: 'nicepay' | 'mock';
  pgOrderId?: string; // PG 거래 ID (TID)
  pgTid?: string; // PG Transaction ID
  pgReceiptUrl?: string;
  
  // 카드 정보
  cardName?: string;
  cardNum?: string;
  
  // 타임스탬프
  requestedAt?: FirestoreTimestamp;
  approvedAt?: FirestoreTimestamp;
  cancelledAt?: FirestoreTimestamp;
  failedAt?: FirestoreTimestamp;
  
  // 실패/취소 사유
  failCode?: string;
  failReason?: string;
  cancelReason?: string;

  // 현금영수증/세금계산서 (기존 유지)
  cashReceipt?: {
    type: "personal" | "business";
    number: string;
    issuedAt?: FirestoreTimestamp;
    receiptNo?: string;
  };
  taxInvoice?: {
    businessNumber: string;
    companyName: string;
  };
}

// 하위 호환성을 위해 PaymentInfo Alias 유지 (필요시 deprecated 처리)
export type PaymentInfo = OrderPaymentInfo;

export interface Order {
  orderId: string;
  userId: string;
  storeId: string;

  items: OrderItem[];

  subtotal: number;
  discount: number;
  couponId: string | null;
  couponApplied: boolean;
  deliveryFee: number;
  finalAmount: number;

  deliveryType: "delivery" | "pickup";
  deliveryAddress: DeliveryAddress | null;
  phoneNumber: string;
  email?: string;
  requests?: string;

  status: OrderStatus;
  payment: OrderPaymentInfo;
  
  // 멱등성 키 (중복 결제 방지)
  clientOrderId?: string;

  timeline: {
    pending?: FirestoreTimestamp;
    accepted?: FirestoreTimestamp;
    preparing?: FirestoreTimestamp;
    completed?: FirestoreTimestamp;
    cancelled?: FirestoreTimestamp;
    [key: string]: FirestoreTimestamp | undefined;
  };

  // 리뷰 미러링
  reviewed?: boolean;
  reviewId?: string;
  reviewRating?: number;
  reviewContent?: string;

  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

// 주문 로그
export interface OrderLog {
  logId: string;
  orderId: string;
  action: "created" | "status_changed" | "canceled" | "refunded" | "note_added";
  by: string;
  byName?: string;
  at: FirestoreTimestamp;
  from?: OrderStatus;
  to?: OrderStatus;
  reason?: string;
  note?: string;
}

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.ACCEPTED, OrderStatus.CANCELLED],
  [OrderStatus.ACCEPTED]: [OrderStatus.COOKING, OrderStatus.CANCELLED],
  [OrderStatus.COOKING]: [OrderStatus.DELIVERING, OrderStatus.CANCELLED],
  [OrderStatus.DELIVERING]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
};
