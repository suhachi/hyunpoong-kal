// Firebase Timestamp 타입 (선택적)
// Firebase 사용 시: Timestamp
// Mock 모드 시: { seconds: number; nanoseconds: number }
type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
  toDate?: () => Date;
};

export type OrderStatus = 
  | 'pending'     // 접수대기
  | 'accepted'    // 접수확인
  | 'cooking'     // 조리중
  | 'delivering'  // 배달중
  | 'completed'   // 완료
  | 'cancelled';  // 취소

export type PaymentMethod = 
  | 'app_card'   // 앱 내 카드 선결제 (PG 연동용, 지금은 준비 중)
  | 'meet_card'  // 만나서 카드 결제 (배달 기사 또는 매장에서 카드 단말기로 결제)
  | 'meet_cash'; // 만나서 현금 결제 (배달 기사 또는 매장에서 현금으로 결제)

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
  pending: ['accepted', 'cancelled'],
  accepted: ['cooking', 'cancelled'],
  cooking: ['delivering', 'cancelled'],
  delivering: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};
