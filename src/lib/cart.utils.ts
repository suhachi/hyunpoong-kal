import type { CartItem } from "../types/cart";

/**
 * 단일 장바구니 항목의 소계 계산
 */
export function calculateItemSubtotal(item: CartItem): number {
  const unitPrice =
    item.menuPrice +
    (item.optionPrices.noodle || 0) +
    (item.optionPrices.toppings || 0) +
    (item.optionPrices.custom || 0);
  return unitPrice * item.quantity;
}

/**
 * 장바구니 전체 소계 계산
 */
export function calculateCartSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + calculateItemSubtotal(item), 0);
}

/**
 * 배달비 계산
 * @param subtotal 장바구니 소계
 * @param deliveryType 배달/포장
 * @param minOrderDelivery 최소 배달 주문 금액
 * @param baseDeliveryFee 기본 배달비
 */
export function calculateDeliveryFee(
  subtotal: number,
  deliveryType: "delivery" | "pickup",
  minOrderDelivery: number,
  baseDeliveryFee: number
): number {
  if (deliveryType === "pickup") return 0;
  
  // 최소 주문 금액 미달 시 배달 불가 (배달비 0으로 처리하지만 결제 불가)
  if (subtotal < minOrderDelivery) return 0; 
  
  return baseDeliveryFee;
}

/**
 * 최종 결제 금액 계산
 */
export function calculateTotalAmount(
  subtotal: number,
  deliveryFee: number,
  discount: number
): number {
  return Math.max(0, subtotal + deliveryFee - discount);
}
