/**
 * Firestore 스키마 정의 및 경로 헬퍼
 * v1.0: 메뉴/주문 중심 Firestore 스키마 1차 구현
 * v1.0 STEP 5: 포인트/쿠폰/리뷰 스키마 확장
 * 
 * 이 파일은 Firestore 컬렉션 경로와 문서 타입을 정의하여,
 * 이후 STEP 3~5에서 API 구현 시 재사용할 수 있는 스키마 레이어를 제공합니다.
 */

import { collection, doc, type Firestore, type Timestamp, type DocumentReference, type CollectionReference } from 'firebase/firestore';
import { db } from '../firebase';
import type { OrderStatus, PaymentMethod, PaymentStatus, OrderItem, DeliveryAddress } from '../../types/order';
import type { MenuCategory, MenuBadge, CustomOption } from '../../types/menu';

// ============================================================================
// Firestore 문서 타입 정의
// ============================================================================

/**
 * 매장 기본 정보 문서 타입
 * 컬렉션: stores/{storeId}
 */
export interface StoreDoc {
  storeId: string;
  name: string;
  address: {
    full: string;
    detail: string;
    lat?: number;
    lng?: number;
  };
  phone: string;
  businessHours: {
    open: string;
    close: string;
    days: string[]; // ["mon", "tue", ..., "sun"]
  };
  isOpen: boolean;
  deliveryAvailable: boolean;
  minOrderAmount: number;
  deliveryFee: number;
  settings: {
    pointsRate: number;
    pointsMinUse: number;
    // TODO: 추가 설정 필드
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * 메뉴 정보 문서 타입
 * 컬렉션: stores/{storeId}/menus/{menuId}
 */
export interface MenuDoc {
  menuId: string;
  storeId: string;
  category: MenuCategory;
  name: string;
  price: number;
  description: string;
  imageUrl?: string; // Firebase Storage URL
  imagePath?: string; // Storage 경로 (업로드용)
  badges: MenuBadge[];
  options?: {
    // 간단한 옵션 구조 (기존 호환성)
    noodle?: { label: string; price: number }[];
    spicy?: { label: string; price: number }[];
    toppings?: { label: string; price: number }[];
  };
  optionGroups?: string[]; // 옵션 그룹 ID 참조 (TODO: 추후 구현)
  customOptions?: CustomOption[]; // 커스텀 옵션 (메뉴별 직접 정의)
  allergens: string[];
  origin: string;
  isAvailable: boolean;
  availableHours?: {
    start: string; // "11:00"
    end: string; // "14:00"
  };
  order: number; // 정렬 순서
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * 주문 정보 문서 타입
 * 컬렉션: stores/{storeId}/orders/{orderId}
 */
export interface OrderDoc {
  orderId: string;
  storeId: string;
  userId: string; // Auth UID
  
  items: Array<{
    menuId: string;
    menuName: string;
    menuImage: string;
    quantity: number;
    options: {
      noodle?: string;
      spicy?: string;
      toppings?: string[];
    };
    price: number; // 단가
    subtotal: number; // 수량 * 단가 + 옵션
  }>;
  
  subtotal: number; // 상품 금액 합계
  discount: number; // 할인 금액
  couponId?: string; // 사용한 쿠폰 ID
  deliveryFee: number; // 배달비
  finalAmount: number; // 최종 결제 금액
  
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress?: DeliveryAddress;
  phone: string; // 주문자 전화번호
  email?: string; // 주문자 이메일
  requests?: string; // 요청 사항
  
  status: OrderStatus;
  
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    tid?: string; // 거래 ID
    authToken?: string;
    cardName?: string;
    cardNum?: string; // 마스킹된 카드번호
    amount: number;
    paidAt?: Timestamp;
    canceledAt?: Timestamp;
    cancelReason?: string;
  };
  
  timeline: {
    pending?: Timestamp; // 접수 대기
    accepted?: Timestamp; // 접수 확인
    cooking?: Timestamp; // 조리 중
    delivering?: Timestamp; // 배달 중
    completed?: Timestamp; // 완료
    canceled?: Timestamp; // 취소
  };
  
  cashReceipt?: {
    type: 'personal' | 'business';
    number: string;
  };
  taxInvoice?: {
    businessNumber: string;
    companyName: string;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * 포인트 잔액 문서 타입
 * 컬렉션: pointsBalances/{userId}
 * v1.0 STEP 5: 포인트 시스템 Firebase 전환
 */
export interface PointsBalanceDoc {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  totalExpired: number;
  updatedAt: Timestamp;
}

/**
 * 포인트 거래 타입
 */
export type PointsTransactionType = 'earn' | 'spend' | 'expire' | 'adjust';

/**
 * 포인트 거래 문서 타입
 * 컬렉션: stores/{storeId}/pointsTransactions/{txId}
 * v1.0 STEP 5: 포인트 시스템 Firebase 전환
 */
export interface PointsTransactionDoc {
  txId: string;
  storeId: string;
  userId: string;
  type: PointsTransactionType;
  amount: number; // earn: +, spend/expire: -, adjust: ±
  ref: {
    kind: 'order' | 'review' | 'admin';
    id: string; // orderId, reviewId, etc.
  };
  note: string;
  expiresAt?: Timestamp;
  at: Timestamp;
}

/**
 * 쿠폰 타입
 */
export type CouponType = 'percentage' | 'fixed';

/**
 * 쿠폰 문서 타입
 * 컬렉션: stores/{storeId}/coupons/{couponId}
 * v1.0 STEP 5: 쿠폰 시스템 Firebase 전환
 */
export interface CouponDoc {
  couponId: string;
  storeId: string;
  code: string;
  name: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: Timestamp;
  validUntil: Timestamp;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  userLimit?: number;
  // 발급 대상 (신규)
  targetType?: 'all' | 'user' | 'phone';
  targetUserId?: string;
  targetPhone?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * 리뷰 문서 타입
 * 컬렉션: stores/{storeId}/reviews/{reviewId}
 * v1.0 STEP 5: 리뷰 시스템 Firebase 전환
 */
export interface ReviewDoc {
  reviewId: string;
  storeId: string;
  orderId: string;
  userId: string;
  userName?: string;
  rating: number; // 1–5
  content: string;
  images: string[]; // Storage URL 배열
  imagePaths: string[]; // Storage 경로 배열
  menuRatings?: Array<{
    menuId: string;
    menuName: string;
    rating: number;
  }>;
  isVisible: boolean;
  ownerReply?: {
    content: string;
    repliedAt: Timestamp;
  };
  pointsEarned: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// Firestore 컬렉션/문서 경로 헬퍼
// ============================================================================

/**
 * stores 컬렉션 참조
 * @param dbInstance Firestore 인스턴스 (기본값: db)
 */
export const storesCollection = (dbInstance: Firestore = db) =>
  collection(dbInstance, 'stores');

/**
 * 매장 문서 참조
 * @param storeId 매장 ID
 * @param dbInstance Firestore 인스턴스 (기본값: db)
 */
export const storeDocRef = (storeId: string, dbInstance: Firestore = db) =>
  doc(storesCollection(dbInstance), storeId);

/**
 * 매장 메뉴 컬렉션 참조
 * @param storeId 매장 ID
 * @param dbInstance Firestore 인스턴스 (기본값: db)
 */
export const storeMenusCollection = (storeId: string, dbInstance: Firestore = db) =>
  collection(storeDocRef(storeId, dbInstance), 'menus');

/**
 * 매장 메뉴 문서 참조
 * @param storeId 매장 ID
 * @param menuId 메뉴 ID
 * @param dbInstance Firestore 인스턴스 (기본값: db)
 */
export const storeMenuDocRef = (storeId: string, menuId: string, dbInstance: Firestore = db) =>
  doc(storeMenusCollection(storeId, dbInstance), menuId);

/**
 * 매장 주문 컬렉션 참조
 * @param storeId 매장 ID
 * @param dbInstance Firestore 인스턴스 (기본값: db)
 */
export const storeOrdersCollection = (storeId: string, dbInstance: Firestore = db) =>
  collection(storeDocRef(storeId, dbInstance), 'orders');

/**
 * 매장 주문 문서 참조
 * @param storeId 매장 ID
 * @param orderId 주문 ID
 * @param dbInstance Firestore 인스턴스 (기본값: db)
 */
export const storeOrderDocRef = (storeId: string, orderId: string, dbInstance: Firestore = db) =>
  doc(storeOrdersCollection(storeId, dbInstance), orderId);

/**
 * 포인트 잔액 문서 참조
 * @param userId 사용자 ID
 * @param dbInstance Firestore 인스턴스 (기본값: db)
 */
export function pointsBalanceDocRef(userId: string, dbInstance: Firestore = db): DocumentReference<PointsBalanceDoc> {
  return doc(dbInstance, 'pointsBalances', userId) as DocumentReference<PointsBalanceDoc>;
}

/**
 * 매장 포인트 거래 컬렉션 참조
 * @param storeId 매장 ID
 * @param dbInstance Firestore 인스턴스 (기본값: db)
 */
export function storePointsTransactionsCollection(
  storeId: string,
  dbInstance: Firestore = db,
): CollectionReference<PointsTransactionDoc> {
  return collection(
    dbInstance,
    'stores',
    storeId,
    'pointsTransactions',
  ) as CollectionReference<PointsTransactionDoc>;
}

/**
 * 매장 포인트 거래 문서 참조
 * @param storeId 매장 ID
 * @param txId 거래 ID
 * @param dbInstance Firestore 인스턴스 (기본값: db)
 */
export function storePointsTransactionDocRef(
  storeId: string,
  txId: string,
  dbInstance: Firestore = db,
): DocumentReference<PointsTransactionDoc> {
  return doc(storePointsTransactionsCollection(storeId, dbInstance), txId) as DocumentReference<PointsTransactionDoc>;
}

/**
 * 매장 쿠폰 컬렉션 참조
 * @param storeId 매장 ID
 * @param dbInstance Firestore 인스턴스 (기본값: db)
 */
export function storeCouponsCollection(
  storeId: string,
  dbInstance: Firestore = db,
): CollectionReference<CouponDoc> {
  return collection(
    dbInstance,
    'stores',
    storeId,
    'coupons',
  ) as CollectionReference<CouponDoc>;
}

/**
 * 매장 쿠폰 문서 참조
 * @param storeId 매장 ID
 * @param couponId 쿠폰 ID
 * @param dbInstance Firestore 인스턴스 (기본값: db)
 */
export function storeCouponDocRef(
  storeId: string,
  couponId: string,
  dbInstance: Firestore = db,
): DocumentReference<CouponDoc> {
  return doc(
    dbInstance,
    'stores',
    storeId,
    'coupons',
    couponId,
  ) as DocumentReference<CouponDoc>;
}

/**
 * 매장 리뷰 컬렉션 참조
 * @param storeId 매장 ID
 * @param dbInstance Firestore 인스턴스 (기본값: db)
 */
export function storeReviewsCollection(
  storeId: string,
  dbInstance: Firestore = db,
): CollectionReference<ReviewDoc> {
  return collection(
    dbInstance,
    'stores',
    storeId,
    'reviews',
  ) as CollectionReference<ReviewDoc>;
}

/**
 * 매장 리뷰 문서 참조
 * @param storeId 매장 ID
 * @param reviewId 리뷰 ID
 * @param dbInstance Firestore 인스턴스 (기본값: db)
 */
export function storeReviewDocRef(
  storeId: string,
  reviewId: string,
  dbInstance: Firestore = db,
): DocumentReference<ReviewDoc> {
  return doc(
    dbInstance,
    'stores',
    storeId,
    'reviews',
    reviewId,
  ) as DocumentReference<ReviewDoc>;
}

// ============================================================================
// 타입 가드 및 유틸리티 함수 (향후 확장용)
// ============================================================================

/**
 * OrderDoc이 유효한지 확인
 * TODO: STEP 3에서 실제 검증 로직 구현
 */
export function isValidOrderDoc(doc: Partial<OrderDoc>): doc is OrderDoc {
  return (
    typeof doc.orderId === 'string' &&
    typeof doc.storeId === 'string' &&
    typeof doc.userId === 'string' &&
    Array.isArray(doc.items) &&
    typeof doc.finalAmount === 'number'
  );
}

/**
 * OrderDoc을 Order 도메인 타입으로 변환
 * v1.0 STEP 3: 주문 흐름 Firebase 전환
 */
import type { Order } from '../../types/order';

export function buildOrderFromDoc(orderId: string, doc: OrderDoc): Order {
  return {
    orderId,
    userId: doc.userId,
    storeId: doc.storeId,
    items: doc.items.map(item => ({
      menuId: item.menuId,
      menuName: item.menuName,
      menuImage: item.menuImage,
      quantity: item.quantity,
      options: item.options,
      price: item.price,
      subtotal: item.subtotal,
    })),
    subtotal: doc.subtotal,
    discount: doc.discount,
    couponId: doc.couponId,
    deliveryFee: doc.deliveryFee,
    finalAmount: doc.finalAmount,
    deliveryType: doc.deliveryType,
    deliveryAddress: doc.deliveryAddress,
    phone: doc.phone,
    email: doc.email,
    requests: doc.requests,
    status: doc.status,
    payment: {
      method: doc.payment.method,
      status: doc.payment.status,
      tid: doc.payment.tid,
      authToken: doc.payment.authToken,
      cardName: doc.payment.cardName,
      cardNum: doc.payment.cardNum,
      amount: doc.payment.amount,
      paidAt: doc.payment.paidAt,
      canceledAt: doc.payment.canceledAt,
      cancelReason: doc.payment.cancelReason,
    },
    timeline: {
      pending: doc.timeline.pending,
      accepted: doc.timeline.accepted,
      preparing: doc.timeline.cooking, // OrderDoc은 cooking, Order는 preparing
      completed: doc.timeline.completed,
      canceled: doc.timeline.canceled,
    },
    cashReceipt: doc.cashReceipt,
    taxInvoice: doc.taxInvoice,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

/**
 * MenuDoc이 유효한지 확인
 * TODO: STEP 3에서 실제 검증 로직 구현
 */
export function isValidMenuDoc(doc: Partial<MenuDoc>): doc is MenuDoc {
  return (
    typeof doc.menuId === 'string' &&
    typeof doc.storeId === 'string' &&
    typeof doc.name === 'string' &&
    typeof doc.price === 'number'
  );
}

