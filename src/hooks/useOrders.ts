/**
 * 주문 관리 Custom Hook
 * 주문 목록 조회, 필터링, 상태 관리를 처리
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useState, useEffect, useCallback } from "react";
import { getOrdersByUser, filterOrdersByStatus } from "../lib/orders.api";
import type { Order, OrderStatus } from "../types/order";

interface UseOrdersOptions {
  userId?: string;
  autoLoad?: boolean;
  initialFilter?: OrderStatus | "all";
}

export function useOrders(options: UseOrdersOptions = {}) {
  const { userId, autoLoad = true, initialFilter = "all" } = options;

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<OrderStatus | "all">(initialFilter);

  // 주문 목록 로드
  const loadOrders = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getOrdersByUser(userId);
      setOrders(data);
    } catch (err) {
      console.error("주문 목록 로딩 실패:", err);
      setError(err instanceof Error ? err : new Error("주문 목록 로딩 실패"));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // 필터 적용
  const applyFilter = useCallback(() => {
    if (filter === "all") {
      setFilteredOrders(orders);
    } else {
      const filtered = filterOrdersByStatus(orders, filter);
      setFilteredOrders(filtered);
    }
  }, [orders, filter]);

  // 주문 새로고침
  const refreshOrders = useCallback(() => {
    return loadOrders();
  }, [loadOrders]);

  // 초기 로드
  useEffect(() => {
    if (autoLoad && userId) {
      loadOrders();
    }
  }, [autoLoad, userId, loadOrders]);

  // 필터 변경 시 적용
  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  return {
    orders,
    filteredOrders,
    loading,
    error,
    filter,
    setFilter,
    refreshOrders,
    loadOrders,
  };
}
