// 공통 Fallback 유틸 (Pass-1 범위 한정)
// - 테스트/개발 안정화를 위해 localStorage 기반의 안전 파싱 제공

import type { Order } from "../types/order";

export function parseJSONSafe<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getMockUser<T = any>(): T | null {
  return parseJSONSafe<T>(typeof window !== "undefined" ? localStorage.getItem("mockUser") : null);
}

export function getOrdersFallback(): Order[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("orders") : null;
    const parsed = parseJSONSafe<any>(raw);
    if (!parsed) return [];
    if (Array.isArray(parsed)) return parsed as Order[];
    const values = Object.values(parsed);
    return Array.isArray(values) ? (values as Order[]) : [];
  } catch {
    return [];
  }
}
