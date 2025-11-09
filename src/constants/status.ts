/**
 * 상태 상수
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

/**
 * 주문 상태
 */
export const ORDER_STATUSES = [
  'pending',
  'accepted',
  'preparing',
  'ready',
  'delivering',
  'completed',
  'canceled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/**
 * 결제 상태
 */
export const PAYMENT_STATUSES = [
  'pending',
  'completed',
  'failed',
  'canceled',
  'refunded',
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

/**
 * 배달 상태
 */
export const DELIVERY_STATUSES = [
  'pending',
  'assigned',
  'pickupReady',
  'pickedUp',
  'delivering',
  'delivered',
  'failed',
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

/**
 * 리뷰 상태
 */
export const REVIEW_STATUSES = [
  'pending',
  'approved',
  'rejected',
  'reported',
] as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

/**
 * 쿠폰 상태
 */
export const COUPON_STATUSES = [
  'active',
  'used',
  'expired',
  'disabled',
] as const;

export type CouponStatus = (typeof COUPON_STATUSES)[number];

/**
 * 고객지원 상태
 */
export const SUPPORT_STATUSES = [
  'open',
  'inProgress',
  'resolved',
  'closed',
] as const;

export type SupportStatus = (typeof SUPPORT_STATUSES)[number];
