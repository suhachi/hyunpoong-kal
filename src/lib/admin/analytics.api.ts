/**
 * 관제/메트릭 API
 * Phase 2-9: KPI 및 차트 데이터
 */

import { USE_FIREBASE } from '../../config/env';

// KPI 데이터
export interface KPIData {
  todaySales: number;
  todayOrders: number;
  avgRating: number;
  installRate: number; // A2HS 설치율 (%)
  conversionRate: number; // 주문 전환율 (%)
}

// 시간대별 주문
export interface HourlyOrders {
  hour: number;
  orders: number;
}

// 메뉴별 매출
export interface MenuSales {
  menuName: string;
  sales: number;
  orders: number;
}

// 일별 매출
export interface DailySales {
  date: string;
  sales: number;
  orders: number;
}

/**
 * KPI 데이터 조회
 */
export async function getKPIData(): Promise<KPIData> {
  if (USE_FIREBASE) {
    // TODO: Firestore aggregation
    throw new Error('Firebase not configured');
  }

  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    todaySales: 0,
    todayOrders: 0,
    avgRating: 0,
    installRate: 0,
    conversionRate: 0,
  };
}

/**
 * 시간대별 주문 (오늘)
 */
export async function getHourlyOrders(): Promise<HourlyOrders[]> {
  if (USE_FIREBASE) {
    // TODO: Firestore query
    throw new Error('Firebase not configured');
  }

  await new Promise(resolve => setTimeout(resolve, 300));

  return [];
}

/**
 * 메뉴별 매출 Top 5
 */
export async function getTopMenuSales(): Promise<MenuSales[]> {
  if (USE_FIREBASE) {
    // TODO: Firestore aggregation
    throw new Error('Firebase not configured');
  }

  await new Promise(resolve => setTimeout(resolve, 300));

  return [];
}

/**
 * 일별 매출 추이 (최근 7일)
 */
export async function getDailySales(): Promise<DailySales[]> {
  if (USE_FIREBASE) {
    // TODO: Firestore aggregation
    throw new Error('Firebase not configured');
  }

  await new Promise(resolve => setTimeout(resolve, 300));

  return [];
}
