/**
 * 주문 상태 관련 유틸리티 함수
 */

import type { OrderStatus } from '../types/order';

/**
 * 관리자 화면용 주문 상태 라벨
 */
export function getOrderStatusLabelForAdmin(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return '접수대기';
    case 'accepted':
      return '접수확인';
    case 'cooking':
      return '조리중';
    case 'delivering':
      return '배달중';
    case 'completed':
      return '완료';
    case 'cancelled':
      return '취소';
  }
}

/**
 * 고객 앱용 주문 상태 라벨
 */
export function getOrderStatusLabelForCustomer(status: OrderStatus): string {
  switch (status) {
    case 'pending':
    case 'accepted':
      return '주문접수';
    case 'cooking':
      return '조리중';
    case 'delivering':
      return '배달중';
    case 'completed':
      return '배달완료';
    case 'cancelled':
      return '주문취소';
  }
}

/**
 * 주문 상태 색상 (뱃지용)
 */
export function getOrderStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'blue';
    case 'accepted':
      return 'blue';
    case 'cooking':
      return 'orange';
    case 'delivering':
      return 'purple';
    case 'completed':
      return 'green';
    case 'cancelled':
      return 'red';
  }
}

/**
 * 주문 상태 색상 (Tailwind 클래스)
 */
export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-gray-500 hover:bg-gray-600';
    case 'accepted':
      return 'bg-blue-600 hover:bg-blue-700';
    case 'cooking':
      return 'bg-amber-500 hover:bg-amber-600';
    case 'delivering':
      return 'bg-purple-600 hover:bg-purple-700';
    case 'completed':
      return 'bg-green-600 hover:bg-green-700';
    case 'cancelled':
      return 'bg-red-600 hover:bg-red-700';
    default:
      return 'bg-gray-500';
  }
}

/**
 * 배달/포장 유형에 따른 상태 목록
 */
export function getStatusList(deliveryType: 'delivery' | 'pickup'): OrderStatus[] {
  if (deliveryType === 'delivery') {
    return ['accepted', 'cooking', 'delivering', 'completed'];
  } else {
    return ['accepted', 'cooking', 'completed']; // 포장은 'delivering' 제외 (또는 'ready'가 있다면 추가)
  }
}
