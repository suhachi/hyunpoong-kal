/**
 * 유효성 검증 상수
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

/**
 * 주문 관련 제한
 */
export const ORDER_LIMITS = {
  MIN_AMOUNT: 10000, // 최소 주문 금액
  MIN_AMOUNT_DELIVERY: 15000, // 배달 최소 주문 금액
  MIN_AMOUNT_PICKUP: 5000, // 픽업 최소 주문 금액
  MAX_AMOUNT: 500000, // 최대 주문 금액
  MIN_DELIVERY_TIME: 30, // 최소 배달 시간 (분)
  MAX_DELIVERY_TIME: 90, // 최대 배달 시간 (분)
} as const;

/**
 * 포인트 관련 제한
 */
export const POINT_LIMITS = {
  MIN_USE: 1000, // 최소 사용 포인트
  MAX_USE_RATE: 0.5, // 최대 사용 비율 (50%)
  EARN_RATE: 0.03, // 적립률 (3%)
  EXPIRE_DAYS: 365, // 유효기간 (일)
} as const;

/**
 * 리뷰 관련 제한
 */
export const REVIEW_LIMITS = {
  MIN_LENGTH: 10, // 최소 글자 수
  MAX_LENGTH: 500, // 최대 글자 수
  MAX_IMAGES: 5, // 최대 이미지 수
  MIN_RATING: 1, // 최소 별점
  MAX_RATING: 5, // 최대 별점
} as const;

/**
 * 쿠폰 관련 제한
 */
export const COUPON_LIMITS = {
  CODE_MIN_LENGTH: 6, // 쿠폰 코드 최소 길이
  CODE_MAX_LENGTH: 12, // 쿠폰 코드 최대 길이
  MAX_DISCOUNT_RATE: 0.5, // 최대 할인율 (50%)
  MAX_DISCOUNT_AMOUNT: 50000, // 최대 할인 금액
} as const;

/**
 * 배달 관련 제한
 */
export const DELIVERY_LIMITS = {
  MAX_DISTANCE: 5000, // 최대 배달 거리 (m)
  BASE_DISTANCE: 3000, // 기본 배달 거리 (m)
  BASE_FEE: 3000, // 기본 배달비
  EXTRA_FEE_PER_KM: 1000, // km당 추가 배달비
  NIGHT_FEE: 2000, // 야간 할증
} as const;

/**
 * 영업 시간
 */
export const BUSINESS_HOURS = {
  OPEN: "10:00",
  CLOSE: "21:00",
  BREAK_START: "15:00",
  BREAK_END: "17:00",
  NIGHT_START: "22:00",
  NIGHT_END: "06:00",
} as const;

/**
 * 정규식 패턴
 */
export const REGEX_PATTERNS = {
  PHONE: /^010-\d{4}-\d{4}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  BUSINESS_NUMBER: /^\d{3}-\d{2}-\d{5}$/,
  COUPON_CODE: /^[A-Z0-9]{6,12}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const;

/**
 * 파일 업로드 제한
 */
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
  MAX_FILES: 5,
} as const;

/**
 * 페이지네이션 기본값
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/**
 * 캐시 시간 (초)
 */
export const CACHE_DURATION = {
  SHORT: 60, // 1분
  MEDIUM: 300, // 5분
  LONG: 3600, // 1시간
  DAY: 86400, // 24시간
} as const;
