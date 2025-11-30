import {
    collection,
    query,
    where,
    getDocs,
    Timestamp,
    orderBy,
    limit
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Order } from '../../types/order';

export interface DashboardStats {
    todaySales: number;
    todayOrders: number;
    averageRating: number;
    installRate: number; // Placeholder
}

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        // 1. 오늘 주문 및 매출 조회
        const ordersQuery = query(
            collection(db, 'orders'),
            where('createdAt', '>=', Timestamp.fromDate(startOfDay)),
            where('createdAt', '<', Timestamp.fromDate(endOfDay))
        );

        const ordersSnapshot = await getDocs(ordersQuery);
        const todayOrders = ordersSnapshot.docs.map(doc => doc.data() as Order);

        // 취소되지 않은 주문만 집계
        const validOrders = todayOrders.filter(order => order.status !== 'cancelled' && order.status !== 'payment_failed');

        const todaySales = validOrders.reduce((sum, order) => sum + order.finalAmount, 0);
        const todayOrderCount = validOrders.length;

        // 2. 평균 평점 조회 (최근 100개 리뷰 기준)
        const reviewsQuery = query(
            collection(db, 'reviews'),
            where('isDeleted', '==', false),
            orderBy('createdAt', 'desc'),
            limit(100)
        );

        const reviewsSnapshot = await getDocs(reviewsQuery);
        const reviews = reviewsSnapshot.docs.map(doc => doc.data());

        let averageRating = 0;
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
            averageRating = totalRating / reviews.length;
        }

        return {
            todaySales,
            todayOrders: todayOrderCount,
            averageRating,
            installRate: 12.5 // Mock value for now
        };
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        return {
            todaySales: 0,
            todayOrders: 0,
            averageRating: 0,
            installRate: 0
        };
    }
}
