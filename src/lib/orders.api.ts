/**
 * 고객용 주문 API
 * localStorage 또는 Firebase에서 주문 데이터 조회
 */

import { db } from './firebase';
import { USE_FIREBASE } from '../config/env';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import type { Order, OrderStatus } from '../types/order';

/**
 * 사용자의 주문 목록 조회
 */
export async function getOrdersByUser(userId: string): Promise<Order[]> {
  if (!USE_FIREBASE) {
    // Mock 모드: localStorage에서 조회
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '{}');
      
      // 객체를 배열로 변환하고 시간순 정렬
      const orderList = Object.values(orders) as Order[];
      
      // 최신순 정렬
      orderList.sort((a, b) => {
        const aTime = typeof a.createdAt === 'string' 
          ? new Date(a.createdAt).getTime()
          : a.createdAt.seconds * 1000;
        const bTime = typeof b.createdAt === 'string'
          ? new Date(b.createdAt).getTime()
          : b.createdAt.seconds * 1000;
        return bTime - aTime;
      });

      return Promise.resolve(orderList);
    } catch (error) {
      console.error('Failed to load orders from localStorage:', error);
      return Promise.resolve([]);
    }
  }

  // Firebase 모드: Firestore에서 조회
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      orderId: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Failed to fetch orders from Firestore:', error);
    return [];
  }
}

/**
 * 주문 상세 조회
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  if (!USE_FIREBASE) {
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '{}');
      return Promise.resolve(orders[orderId] || null);
    } catch (error) {
      console.error('Failed to load order from localStorage:', error);
      return Promise.resolve(null);
    }
  }

  // Firebase 모드: Firestore에서 조회
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        orderId: docSnap.id,
        ...docSnap.data()
      } as Order;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch order from Firestore:', error);
    return null;
  }
}

/**
 * 주문 상태별 필터링
 */
export function filterOrdersByStatus(orders: Order[], status: OrderStatus | 'all'): Order[] {
  if (status === 'all') {
    return orders;
  }
  return orders.filter(order => order.status === status);
}

/**
 * 리뷰 작성 가능한 주문 필터링
 */
export function getReviewableOrders(orders: Order[]): Order[] {
  return orders.filter(order => {
    // 완료된 주문 중 리뷰를 작성하지 않은 주문
    return (order.status === 'completed' || order.status === 'done') && !hasReview(order);
  });
}

/**
 * 주문에 리뷰가 있는지 확인
 */
function hasReview(order: Order): boolean {
  // TODO: 실제로는 reviews 컬렉션을 확인해야 함
  // 임시로 localStorage 확인
  try {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    return reviews.some((review: any) => review.orderId === order.orderId);
  } catch {
    return false;
  }
}

/**
 * 주문 통계
 */
export interface OrderStatistics {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  canceled: number;
  totalSpent: number;
}

export function calculateOrderStatistics(orders: Order[]): OrderStatistics {
  return {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => 
      o.status === 'accepted' || 
      o.status === 'preparing' || 
      o.status === 'cooking' || 
      o.status === 'out_for_delivery'
    ).length,
    completed: orders.filter(o => o.status === 'completed' || o.status === 'done').length,
    canceled: orders.filter(o => o.status === 'canceled').length,
    totalSpent: orders
      .filter(o => o.status !== 'canceled')
      .reduce((sum, o) => sum + o.finalAmount, 0),
  };
}
