/**
 * 브랜드 컬러 상수
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

/**
 * 브랜드 메인 컬러
 */
export const BRAND_COLORS = {
  primary: "#D61C1C", // 현풍레드
  secondary: "#F37021", // 신칼오렌지
  accent: "#C7A45A", // 황동식기색

  // 그레이스케일
  black: "#1A1A1A",
  darkGray: "#4A4A4A",
  gray: "#8B7355",
  lightGray: "#D4C5B9",
  background: "#F8F6F3",
  white: "#FFFFFF",
} as const;

/**
 * 상태 컬러
 */
export const STATUS_COLORS = {
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
} as const;

/**
 * 주문 상태별 컬러
 */
export const ORDER_STATUS_COLORS = {
  pending: "#F59E0B", // 주황
  accepted: "#3B82F6", // 파랑
  preparing: "#8B5CF6", // 보라
  ready: "#06B6D4", // 청록
  delivering: "#10B981", // 녹색
  completed: "#22C55E", // 연녹
  canceled: "#EF4444", // 빨강
} as const;

/**
 * 배달 상태별 컬러
 */
export const DELIVERY_STATUS_COLORS = {
  pending: "#F59E0B",
  assigned: "#3B82F6",
  pickupReady: "#8B5CF6",
  pickedUp: "#06B6D4",
  delivering: "#10B981",
  delivered: "#22C55E",
  failed: "#EF4444",
} as const;

/**
 * 차트 컬러 팔레트
 */
export const CHART_COLORS = [
  "#D61C1C", // 현풍레드
  "#F37021", // 신칼오렌지
  "#C7A45A", // 황동식기색
  "#8B5CF6", // 보라
  "#10B981", // 녹색
  "#3B82F6", // 파랑
  "#F59E0B", // 주황
  "#EF4444", // 빨강
] as const;
