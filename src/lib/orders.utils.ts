/**
 * 주문 상태 관련 유틸리티 함수
 */

import { OrderStatus } from "../types/order";

/**
 * 관리자 화면용 주문 상태 라벨
 */
export function getOrderStatusLabelForAdmin(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return "접수대기";
    case OrderStatus.ACCEPTED:
      return "접수확인";
    case OrderStatus.COOKING:
      return "조리중";
    case OrderStatus.DELIVERING:
      return "배달중";
    case OrderStatus.COMPLETED:
      return "완료";
    case OrderStatus.CANCELLED:
      return "취소";
  }
}

/**
 * 고객 앱용 주문 상태 라벨
 */
export function getOrderStatusLabelForCustomer(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
    case OrderStatus.ACCEPTED:
      return "주문접수";
    case OrderStatus.COOKING:
      return "조리중";
    case OrderStatus.DELIVERING:
      return "배달중";
    case OrderStatus.COMPLETED:
      return "배달완료";
    case OrderStatus.CANCELLED:
      return "주문취소";
  }
}

/**
 * 주문 상태 색상 (뱃지용)
 */
export function getOrderStatusColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return "blue";
    case OrderStatus.ACCEPTED:
      return "blue";
    case OrderStatus.COOKING:
      return "orange";
    case OrderStatus.DELIVERING:
      return "purple";
    case OrderStatus.COMPLETED:
      return "green";
    case OrderStatus.CANCELLED:
      return "red";
  }
}

/**
 * 주문 상태 색상 (Tailwind 클래스)
 */
export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-gray-500 hover:bg-gray-600";
    case OrderStatus.ACCEPTED:
      return "bg-blue-600 hover:bg-blue-700";
    case OrderStatus.COOKING:
      return "bg-amber-500 hover:bg-amber-600";
    case OrderStatus.DELIVERING:
      return "bg-purple-600 hover:bg-purple-700";
    case OrderStatus.COMPLETED:
      return "bg-green-600 hover:bg-green-700";
    case OrderStatus.CANCELLED:
      return "bg-red-600 hover:bg-red-700";
    default:
      return "bg-gray-500";
  }
}

/**
 * 배달/포장 유형에 따른 상태 목록
 */
export function getStatusList(deliveryType: "delivery" | "pickup"): OrderStatus[] {
  if (deliveryType === "delivery") {
    return [
      OrderStatus.ACCEPTED,
      OrderStatus.COOKING,
      OrderStatus.DELIVERING,
      OrderStatus.COMPLETED,
    ];
  } else {
    return [OrderStatus.ACCEPTED, OrderStatus.COOKING, OrderStatus.COMPLETED]; // 포장은 'delivering' 제외 (또는 'ready'가 있다면 추가)
  }
}
