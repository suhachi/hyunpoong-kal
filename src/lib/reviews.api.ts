import {
    collection,
    doc,
    addDoc,
    updateDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    limit,
    runTransaction
} from 'firebase/firestore';
import { db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Review, ReviewFormData } from '../types/review';
import type { Order } from '../types/order';

const COLLECTION_NAME = 'reviews';

/**
 * 리뷰 작성 (이미지 업로드 포함)
 * 트랜잭션으로 리뷰 생성 + 주문 문서에 리뷰 정보 미러링
 */
export async function createReview(
    order: Order,
    userId: string,
    data: ReviewFormData
): Promise<{ success: boolean; error?: string }> {
    try {
        // 1. 이미지 업로드
        const imageUrls: string[] = [];
        if (data.images && data.images.length > 0) {
            for (const file of data.images) {
                const storageRef = ref(storage, `reviews/${order.orderId}/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                imageUrls.push(url);
            }
        }

        // 2. 트랜잭션 실행
        await runTransaction(db, async (transaction) => {
            // 주문 문서 참조
            const orderRef = doc(db, 'orders', order.orderId);
            const orderSnap = await transaction.get(orderRef);

            if (!orderSnap.exists()) {
                throw new Error('주문 정보를 찾을 수 없습니다.');
            }

            const orderData = orderSnap.data();
            if (orderData.reviewed) {
                throw new Error('이미 리뷰가 작성된 주문입니다.');
            }

            // 새 리뷰 문서 참조
            const reviewRef = doc(collection(db, COLLECTION_NAME));

            const reviewData = {
                id: reviewRef.id,
                orderId: order.orderId,
                userId,
                userName: orderData.customerName || '익명', // 주문자 이름 사용
                rating: data.rating,
                content: data.content,
                images: imageUrls,
                menuNames: order.items.map(item => item.menuName),
                createdAt: serverTimestamp(),
                isDeleted: false
            };

            // 리뷰 생성
            transaction.set(reviewRef, reviewData);

            // 주문 문서 업데이트 (미러링)
            transaction.update(orderRef, {
                reviewed: true,
                reviewRating: data.rating, // 정렬/필터링용
                reviewContent: data.content.slice(0, 100), // 미리보기용 (길이 제한)
                reviewId: reviewRef.id
            });
        });

        return { success: true };
    } catch (error: any) {
        console.error('Failed to create review:', error);
        return { success: false, error: error.message };
    }
}

/**
 * 특정 주문의 리뷰 조회
 */
export async function getReviewByOrderId(orderId: string): Promise<Review | null> {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('orderId', '==', orderId),
            limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;

        return snapshot.docs[0].data() as Review;
    } catch (error) {
        console.error('Failed to get review:', error);
        return null;
    }
}

/**
 * 내 리뷰 목록 조회
 */
export async function getMyReviews(userId: string): Promise<Review[]> {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('userId', '==', userId),
            where('isDeleted', '==', false),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Review);
    } catch (error) {
        console.error('Failed to get my reviews:', error);
        return [];
    }
}

/**
 * 전체 리뷰 목록 조회 (메인/메뉴판용)
 */
export async function getRecentReviews(limitCount = 10): Promise<Review[]> {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('isDeleted', '==', false),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Review);
    } catch (error) {
        console.error('Failed to get recent reviews:', error);
        return [];
    }
}
