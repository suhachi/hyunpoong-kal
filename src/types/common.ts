/**
 * 공통 타입 정의
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { Timestamp } from 'firebase/firestore';

/**
 * 기본 아이템 인터페이스 (주문/장바구니 공통)
 */
export interface BaseItem {
  menuId: string;
  menuName: string;
  menuImage?: string;
  quantity: number;
  price: number;
  options?: Record<string, any>;
}

/**
 * 타임스탬프 타입
 */
export type TimestampType = Timestamp | Date | { seconds: number; nanoseconds: number };

/**
 * 주소 정보
 */
export interface Address {
  address: string;
  detail?: string;
  zipCode?: string;
  lat?: number;
  lng?: number;
}

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * API 응답 기본 형식
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 기본 엔티티 (ID + 타임스탬프)
 */
export interface BaseEntity {
  id: string;
  createdAt: TimestampType;
  updatedAt: TimestampType;
}

/**
 * 필터 옵션
 */
export interface FilterOptions {
  search?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 통계 데이터
 */
export interface Stats {
  label: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease';
}
