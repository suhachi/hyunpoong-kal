/**
 * 가격 계산 유틸리티
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { formatPrice } from "./format";

/**
 * 배달비 계산
 */
export function calculateDeliveryFee(distance: number, nightTime: boolean = false): number {
  let baseFee = 3000;

  // 거리별 추가 요금
  if (distance > 3000) {
    const extraKm = Math.ceil((distance - 3000) / 1000);
    baseFee += extraKm * 1000;
  }

  // 야간 할증 (22:00-06:00)
  if (nightTime) {
    baseFee += 2000;
  }

  return baseFee;
}

/**
 * 할인 금액 계산
 */
export function applyDiscount(
  price: number,
  discountType: "amount" | "percent",
  discountValue: number,
): number {
  if (discountType === "amount") {
    return Math.max(0, price - discountValue);
  }

  if (discountType === "percent") {
    const discountAmount = Math.floor(price * discountValue);
    return Math.max(0, price - discountAmount);
  }

  return price;
}

/**
 * 포인트 적립 계산
 */
export function calculatePointsEarned(amount: number, rate: number = 0.03): number {
  return Math.floor(amount * rate);
}

/**
 * 최소 주문 금액 검증
 */
export function isMinimumOrderMet(amount: number, minimum: number = 10000): boolean {
  return amount >= minimum;
}

/**
 * 포인트 사용 가능 여부
 */
export function canUsePoints(
  points: number,
  orderAmount: number,
  minUse: number = 1000,
): {
  canUse: boolean;
  message?: string;
} {
  if (points < minUse) {
    return {
      canUse: false,
      message: `최소 ${formatPrice(minUse)} 이상 사용 가능합니다`,
    };
  }

  // 주문 금액의 50%까지만 사용 가능
  const maxUse = Math.floor(orderAmount * 0.5);
  if (points > maxUse) {
    return {
      canUse: false,
      message: `주문 금액의 50%까지만 사용 가능합니다 (최대 ${formatPrice(maxUse)})`,
    };
  }

  return { canUse: true };
}

/**
 * 총 결제 금액 계산
 */
export function calculateTotalAmount(
  subtotal: number,
  deliveryFee: number,
  discount: number = 0,
  pointsUsed: number = 0,
): number {
  const total = subtotal + deliveryFee - discount - pointsUsed;
  return Math.max(0, total);
}

/**
 * 할인율 계산
 */
export function calculateDiscountRate(original: number, discounted: number): number {
  if (original <= 0) return 0;
  return ((original - discounted) / original) * 100;
}

/**
 * VAT 계산 (10%)
 */
export function calculateVAT(amount: number): number {
  return Math.floor(amount * 0.1);
}

/**
 * 공급가액 계산 (VAT 제외)
 */
export function calculateSupplyAmount(totalAmount: number): number {
  return Math.floor(totalAmount / 1.1);
}

/**
 * 환불 금액 계산
 */
export function calculateRefundAmount(
  totalPaid: number,
  refundPolicy: {
    fullRefundMinutes: number;
    partialRefundRate: number;
  },
  elapsedMinutes: number,
): {
  refundAmount: number;
  refundRate: number;
} {
  // 전액 환불 기간
  if (elapsedMinutes <= refundPolicy.fullRefundMinutes) {
    return {
      refundAmount: totalPaid,
      refundRate: 100,
    };
  }

  // 부분 환불
  const refundAmount = Math.floor(totalPaid * refundPolicy.partialRefundRate);
  const refundRate = refundPolicy.partialRefundRate * 100;

  return {
    refundAmount,
    refundRate,
  };
}
