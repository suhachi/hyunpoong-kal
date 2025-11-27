/**
 * 관리자 주문 API
 * USE_FIREBASE 플래그에 따라 Mock 또는 Firestore 사용
 */

import type { Order, OrderStatus, OrderLog } from '../../types/order';
import { ordersRepository } from '../orders.repository';

// 환경 플래그
import { USE_FIREBASE } from '../../config/env';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs, doc, getDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

// 샘플 데이터 제거: 초기 상태에서는 주문/로그 없음
let mockOrders: Order[] = [];
let mockLogs: OrderLog[] = [];

// 필터 옵션
export interface OrderFilters {
  status?: OrderStatus | 'all';
  paymentMethod?: string;
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
}

// 정렬 옵션
export type OrderSortField = 'createdAt' | 'amount';
export type OrderSortDirection = 'asc' | 'desc';

/**
 * 주문 목록 조회 (필터/정렬 지원)
 */
export async function fetchOrders(
  storeId: string,
  filters: OrderFilters = {},
  sortField: OrderSortField = 'createdAt',
  sortDirection: OrderSortDirection = 'desc'
): Promise<Order[]> {
  if (!USE_FIREBASE) {
    // Mock 데이터 필터링
    let filtered = mockOrders.filter((order) => order.storeId === storeId);
    // localStorage 기반 주문도 합치기
    try {
      const localOrders = await ordersRepository.listOrdersByStore(storeId);
      // convert to a map by orderId to override mockOrders with local orders if same id
      const map = new Map(filtered.map((o) => [o.orderId, o]));
      for (const o of localOrders) {
        map.set(o.orderId, o);
      }
      filtered = Array.from(map.values());
    } catch (e) {
      // ignore repository failure
    }

    // 상태 필터
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    // 결제수단 필터
    if (filters.paymentMethod) {
      filtered = filtered.filter((order) => order.payment.method === filters.paymentMethod);
    }

    // 기간 필터 (createdAt가 string 또는 FirebaseTimestamp 모두 지원)
    const getCreatedAtSeconds = (value: any): number => {
      if (!value) return 0;
      if (typeof value === 'string') {
        const ms = Date.parse(value);
        return isNaN(ms) ? 0 : Math.floor(ms / 1000);
      }
      if (typeof value === 'object') {
        if ('seconds' in value && typeof (value as any).seconds === 'number') return (value as any).seconds;
        if ('toDate' in value && typeof (value as any).toDate === 'function') return Math.floor((value as any).toDate().getTime() / 1000);
      }
      return 0;
    };

    if (filters.startDate) {
      const startTime = Math.floor(filters.startDate.getTime() / 1000);
      filtered = filtered.filter((order) => getCreatedAtSeconds(order.createdAt) >= startTime);
    }
    if (filters.endDate) {
      const endTime = Math.floor(filters.endDate.getTime() / 1000);
      filtered = filtered.filter((order) => getCreatedAtSeconds(order.createdAt) <= endTime);
    }

    // 검색어 필터
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(query) ||
          order.phone.includes(query) ||
          order.items.some((item) => item.menuName.toLowerCase().includes(query))
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      let aVal: number, bVal: number;
      if (sortField === 'createdAt') {
        aVal = getCreatedAtSeconds(a.createdAt);
        bVal = getCreatedAtSeconds(b.createdAt);
      } else {
        aVal = a.finalAmount;
        bVal = b.finalAmount;
      }
      return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
    });

    return new Promise((resolve) => setTimeout(() => resolve(filtered), 500));
  }

  // Firebase 모드: Firestore 쿼리
  // TODO(Phase3): admin/orders.api.ts도 storeOrdersCollection 헬퍼 사용으로 통일 필요
  // 현재는 루트 'orders' 컬렉션 사용 중 (스키마와 불일치)
  try {
    let q = query(
      collection(db, 'orders'), // TODO: storeOrdersCollection(storeId)로 교체 필요
      where('storeId', '==', storeId)
    );

    // 상태 필터
    if (filters.status && filters.status !== 'all') {
      q = query(q, where('status', '==', filters.status));
    }

    // 결제수단 필터
    if (filters.paymentMethod) {
      q = query(q, where('payment.method', '==', filters.paymentMethod));
    }

    // 정렬 추가
    q = query(q, orderBy('createdAt', sortDirection));

    const snapshot = await getDocs(q);
    let orders: Order[] = snapshot.docs.map((doc) => ({
      orderId: doc.id,
      ...doc.data(),
    } as Order));

    // 클라이언트 측 필터링 (복잡한 검색은 Firestore 쿼리로 처리 불가능할 수 있음)
    if (filters.startDate) {
      const startTime = Math.floor(filters.startDate.getTime() / 1000);
      orders = orders.filter((order) => {
        const createdAt = order.createdAt as any;
        const seconds = createdAt?.seconds || 0;
        return seconds >= startTime;
      });
    }

    if (filters.endDate) {
      const endTime = Math.floor(filters.endDate.getTime() / 1000);
      orders = orders.filter((order) => {
        const createdAt = order.createdAt as any;
        const seconds = createdAt?.seconds || 0;
        return seconds <= endTime;
      });
    }

    if (filters.searchQuery) {
      const queryStr = filters.searchQuery.toLowerCase();
      orders = orders.filter(
        (order) =>
          order.orderId.toLowerCase().includes(queryStr) ||
          order.phone.includes(queryStr) ||
          order.items.some((item) => item.menuName.toLowerCase().includes(queryStr))
      );
    }

    // amount 정렬이 필요한 경우 클라이언트에서 재정렬
    if (sortField === 'amount') {
      orders.sort((a, b) =>
        sortDirection === 'desc'
          ? b.finalAmount - a.finalAmount
          : a.finalAmount - b.finalAmount
      );
    }

    return orders;
  } catch (error) {
    console.error('Failed to fetch orders from Firestore:', error);
    return [];
  }
}
export async function fetchOrderById(orderId: string): Promise<Order | null> {
  if (!USE_FIREBASE) {
    const order = mockOrders.find((o) => o.orderId === orderId);
    return new Promise((resolve) => setTimeout(() => resolve(order || null), 300));
  }

  // Firestore 연동
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    if (orderSnap.exists()) {
      return {
        orderId: orderSnap.id,
        ...orderSnap.data(),
      } as Order;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch order from Firestore:', error);
    return null;
  }
}

/**
 * 주문 상태 변경
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  if (!USE_FIREBASE) {
    // Try localStorage repo first
    const localOrder = await ordersRepository.updateStatus(orderId, newStatus);
    if (localOrder) {
      return { success: true };
    }

    const order = mockOrders.find((o) => o.orderId === orderId);
    if (!order) {
      return { success: false, error: '주문을 찾을 수 없습니다' };
    }

    // 상태 전이 검증은 컴포넌트에서 처리
    order.status = newStatus;
    order.timeline[newStatus] = { seconds: Date.now() / 1000, nanoseconds: 0 } as any;
    order.updatedAt = { seconds: Date.now() / 1000, nanoseconds: 0 } as any;

    if (newStatus === 'cancelled' && reason) {
      order.payment.cancelReason = reason;
      order.payment.canceledAt = { seconds: Date.now() / 1000, nanoseconds: 0 } as any;
    }

    // 로그 추가
    mockLogs.push({
      logId: `log-${Date.now()}`,
      orderId,
      action: newStatus === 'cancelled' ? 'canceled' : 'status_changed',
      by: 'owner-001', // TODO: 실제 사용자 ID
      byName: '석경선',
      at: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      from: order.status,
      to: newStatus,
      reason,
    });

    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
  }

  // Firebase 모드: Firestore 주문 상태 업데이트
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return { success: false, error: '주문을 찾을 수 없습니다' };
    }

    const updateData: any = {
      status: newStatus,
      updatedAt: serverTimestamp(),
      [`timeline.${newStatus}`]: serverTimestamp(),
    };

    if (newStatus === 'cancelled' && reason) {
      updateData['payment.cancelReason'] = reason;
      updateData['payment.canceledAt'] = serverTimestamp();
    }

    await updateDoc(orderRef, updateData);

    return { success: true };
  } catch (error) {
    console.error('Failed to update order status in Firestore:', error);
    return { success: false, error: '상태 업데이트 중 오류가 발생했습니다' };
  }
}

/**
 * 주문 로그 조회 (Firestore 연동)
 * logs 서브컬렉션 기준
 */
export async function fetchOrderLogs(orderId: string): Promise<OrderLog[]> {
  if (!USE_FIREBASE) {
    const logs = mockLogs.filter((log) => log.orderId === orderId);
    return new Promise((resolve) => setTimeout(() => resolve(logs), 300));
  }
  // Firestore 연동: orders/{orderId}/logs 서브컬렉션
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const logsRef = collection(db, 'orders', orderId, 'logs');
    const snapshot = await getDocs(logsRef);
    return snapshot.docs.map(doc => ({
      logId: doc.id,
      ...doc.data(),
    })) as OrderLog[];
  } catch (error) {
    console.error('Failed to fetch order logs from Firestore:', error);
    return [];
  }
}
export interface OrderStats {
  total: number;
  pending: number;
  accepted: number;
  cooking: number;
  completed: number;
  cancelled: number;
  todayRevenue: number;
  todayOrders: number;
}
export async function fetchOrderStats(storeId: string): Promise<OrderStats> {
  if (!USE_FIREBASE) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime() / 1000;
    const orders: Order[] = mockOrders.filter((o) => o.storeId === storeId);
    const todayOrders = orders.filter((o) => {
      const createdAt = o.createdAt as any;
      const seconds = createdAt?.seconds || 0;
      return seconds >= todayTimestamp;
    });
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            total: orders.length,
            pending: orders.filter((o) => o.status === 'pending').length,
            accepted: orders.filter((o) => o.status === 'accepted').length,
            cooking: orders.filter((o) => o.status === 'cooking' || o.status === 'delivering').length,
            completed: orders.filter((o) => o.status === 'completed').length,
            cancelled: orders.filter((o) => o.status === 'cancelled').length,
            todayRevenue: todayOrders
              .filter((o) => o.status !== 'cancelled')
              .reduce((sum, o) => sum + o.finalAmount, 0),
            todayOrders: todayOrders.length,
          }),
        300
      )
    );
  }
  // Firestore 연동: storeId 기준 전체 주문 조회 후 클라이언트 집계
  try {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime() / 1000;
    const q = query(collection(db, 'orders'), where('storeId', '==', storeId));
    const snapshot = await getDocs(q);
    const orders: Order[] = snapshot.docs.map(doc => ({ orderId: doc.id, ...doc.data() }));
    const todayOrders = orders.filter((o) => {
      const createdAt = o.createdAt as any;
      const seconds = createdAt?.seconds || 0;
      return seconds >= todayTimestamp;
    });

    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      accepted: orders.filter((o) => o.status === 'accepted').length,
      cooking: orders.filter((o) => o.status === 'cooking' || o.status === 'delivering').length,
      completed: orders.filter((o) => o.status === 'completed').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
      todayRevenue: todayOrders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.finalAmount, 0),
      todayOrders: todayOrders.length,
    };
  } catch (error) {
    console.error('Failed to fetch order stats from Firestore:', error);
    return {
      total: 0,
      pending: 0,
      accepted: 0,
      preparing: 0,
      completed: 0,
      canceled: 0,
      todayRevenue: 0,
      todayOrders: 0,

    };
  }
}
