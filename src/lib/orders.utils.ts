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

