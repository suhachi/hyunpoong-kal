/**
 * 레이블 상수
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

/**
 * 쿠폰 타입 레이블
 */
export const COUPON_TYPE_LABELS = {
  amount: "금액할인",
  percent: "퍼센트할인",
  freeDelivery: "무료배달",
  freeItem: "무료증정",
} as const;

/**
 * 주문 상태 레이블
 */
export const ORDER_STATUS_LABELS = {
  pending: "주문 대기",
  accepted: "접수 확인",
  preparing: "조리 중",
  ready: "배달 준비",
  delivering: "배달 중",
  completed: "배달 완료",
  canceled: "주문 취소",
} as const;

/**
 * 결제 상태 레이블
 */
export const PAYMENT_STATUS_LABELS = {
  pending: "결제 대기",
  completed: "결제 완료",
  failed: "결제 실패",
  canceled: "결제 취소",
  refunded: "환불 완료",
} as const;

/**
 * 배달 상태 레이블
 */
export const DELIVERY_STATUS_LABELS = {
  pending: "배달 대기",
  assigned: "배달원 배정",
  pickupReady: "픽업 준비",
  pickedUp: "픽업 완료",
  delivering: "배달 중",
  delivered: "배달 완료",
  failed: "배달 실패",
} as const;

/**
 * 리뷰 상태 레이블
 */
export const REVIEW_STATUS_LABELS = {
  pending: "대기",
  approved: "승인",
  rejected: "거부",
  reported: "신고됨",
} as const;

/**
 * 쿠폰 상태 레이블
 */
export const COUPON_STATUS_LABELS = {
  active: "사용 가능",
  used: "사용 완료",
  expired: "기간 만료",
  disabled: "사용 불가",
} as const;

/**
 * 포인트 타입 레이블
 */
export const POINT_TYPE_LABELS = {
  earn: "적립",
  use: "사용",
  refund: "환불",
  expire: "소멸",
  admin: "관리자 지급",
} as const;

/**
 * 알림 타입 레이블
 */
export const NOTIFICATION_TYPE_LABELS = {
  order: "주문",
  delivery: "배달",
  payment: "결제",
  review: "리뷰",
  promotion: "프로모션",
  system: "시스템",
} as const;

/**
 * 고객지원 상태 레이블
 */
export const SUPPORT_STATUS_LABELS = {
  open: "문의 접수",
  inProgress: "답변 중",
  resolved: "해결 완료",
  closed: "종료",
} as const;

/**
 * 고객지원 카테고리 레이블
 */
export const SUPPORT_CATEGORY_LABELS = {
  order: "주문 문의",
  delivery: "배달 문의",
  payment: "결제 문의",
  menu: "메뉴 문의",
  refund: "환불 문의",
  etc: "기타 문의",
} as const;

/**
 * 요일 레이블
 */
export const DAY_LABELS = {
  mon: "월",
  tue: "화",
  wed: "수",
  thu: "목",
  fri: "금",
  sat: "토",
  sun: "일",
} as const;

/**
 * 메뉴 카테고리 레이블
 */
export const MENU_CATEGORY_LABELS = {
  signature: "시그니처",
  kalguksu: "칼국수",
  side: "사이드",
  beverage: "음료",
} as const;
