// Firebase Timestamp 타입 (선택적)
// Firebase 사용 시: Timestamp
// Mock 모드 시: { seconds: number; nanoseconds: number }
type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
  toDate?: () => Date;
};

export type OrderStatus = 
  | 'pending'        // 주문 접수 대기
  | 'placed'         // 주문 생성 / 접수 대기 (간헐적 표현 존재)
  | 'accepted'       // 접수 확인
  | 'preparing'      // 조리 중 (legacy)
  | 'cooking'        // 조리 중 (현재 일부 페이지에서 사용)
  | 'out_for_delivery' // 배달 중
  | 'pickup_ready'   // 포장 완료 (픽업 준비됨)
  | 'completed'      // 완료
  | 'done'           // 완료 (legacy/alternate)
  | 'canceled'       // 취소
  | 'payment_failed'; // 결제 실패 (edge case)

export type PaymentMethod = 
  | 'card'        // 신용/체크카드
  | 'transfer'    // 계좌이체
  | 'easy_pay'    // 간편결제
  | 'on_site';    // 만나서 결제

export type PaymentStatus = 
  | 'pending'     // 결제 대기
  | 'authorized'  // 인증됨 (승인 전)
  | 'approved'    // 승인됨
  | 'failed'      // 실패
  | 'refunded';   // 환불

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

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  tid?: string;           // NICEPAY 거래 ID
  authToken?: string;     // 인증 토큰
  cardName?: string;      // 카드사명
  cardNum?: string;       // 카드번호 (마스킹)
  paidAt?: Timestamp;
  canceledAt?: Timestamp;
  cancelReason?: string;
  amount: number;
}

export interface Order {
  orderId: string;
  userId: string;
  storeId: string;
  
  items: OrderItem[];
  
  subtotal: number;
  discount: number;
  couponId?: string;
  deliveryFee: number;
  finalAmount: number;
  
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress?: DeliveryAddress;
  phone: string;
  email?: string;
  requests?: string;
  
  status: OrderStatus;
  payment: PaymentInfo;
  
  timeline: {
    pending?: Timestamp;
    accepted?: Timestamp;
    preparing?: Timestamp;
    completed?: Timestamp;
    canceled?: Timestamp;
  };
  
  // 현금영수증/세금계산서
  cashReceipt?: {
    type: 'personal' | 'business';
    number: string;
  };
  taxInvoice?: {
    businessNumber: string;
    companyName: string;
  };
  
  // Firestore uses FirebaseTimestamp, local mock uses ISO string
  createdAt: FirebaseTimestamp | string;
  updatedAt: FirebaseTimestamp | string;
}

// 주문 로그 (감사 추적)
export interface OrderLog {
  logId: string;
  orderId: string;
  action: 'created' | 'status_changed' | 'canceled' | 'refunded' | 'note_added';
  by: string;           // userId or 'system'
  byName?: string;      // 사용자 이름
  at: Timestamp;
  from?: OrderStatus;
  to?: OrderStatus;
  reason?: string;      // 취소/환불 사유
  note?: string;        // 추가 메모
}

// 주문 상태 전이 가드
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['accepted', 'canceled', 'payment_failed'],
  placed: ['accepted', 'canceled'],
  accepted: ['preparing', 'cooking', 'out_for_delivery', 'canceled'],
  preparing: ['completed', 'canceled'],
  cooking: ['out_for_delivery', 'completed', 'canceled'],
  out_for_delivery: ['completed', 'canceled'],
  pickup_ready: ['completed', 'canceled'],
  completed: [],
  done: [],
  canceled: [],
  payment_failed: ['pending', 'canceled'],
};
