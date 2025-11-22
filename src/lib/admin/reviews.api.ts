/**
 * 관리자 리뷰 관리 API
 * USE_FIREBASE=false: Mock 데이터 사용
 * USE_FIREBASE=true: Firestore 연동
 * v1.0 STEP 5: Firebase 전환
 */

import type { Review, ReviewReply, ReviewReport, ReviewReportReason, ReviewStats } from '../../types/review';
import { USE_FIREBASE, getEnv } from '../../config/env';
import { db } from '../firebase';
import {
  storeReviewsCollection,
  storeReviewDocRef,
  type ReviewDoc,
} from '../firebase/firestore-schema';
import {
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';

// ============================================================================
// Mock 모드 함수 (기존 로직 보전)
// ============================================================================

// Mock 리뷰 데이터 (샘플 데이터 제거)
const MOCK_REVIEWS: Review[] = [];

// Mock 신고 데이터
const mockReports: Map<string, ReviewReport[]> = new Map();

/**
 * Mock 모드: 리뷰 목록 조회
 */
async function getReviewsMock(params: {
  storeId: string;
  photoOnly?: boolean;
  reported?: boolean;
  sortBy?: 'latest' | 'rating_high' | 'rating_low';
  limit?: number;
  offset?: number;
}): Promise<{ reviews: Review[]; hasMore: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...MOCK_REVIEWS];

  if (params.photoOnly) {
    filtered = filtered.filter((r) => r.hasPhoto);
  }

  if (params.reported) {
    filtered = filtered.filter((r) => (r.reportedCount || 0) > 0);
  }

  switch (params.sortBy) {
    case 'rating_high':
      filtered.sort((a, b) => b.rating - a.rating || b.createdAt - a.createdAt);
      break;
    case 'rating_low':
      filtered.sort((a, b) => a.rating - b.rating || b.createdAt - a.createdAt);
      break;
    case 'latest':
    default:
      filtered.sort((a, b) => b.createdAt - a.createdAt);
      break;
  }

  const limit = params.limit || 10;
  const offset = params.offset || 0;
  const reviews = filtered.slice(offset, offset + limit);
  const hasMore = offset + limit < filtered.length;

  return { reviews, hasMore };
}

/**
 * Mock 모드: 리뷰 통계
 */
async function getReviewStatsMock(storeId: string): Promise<ReviewStats> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const reviews = MOCK_REVIEWS.filter((r) => r.storeId === storeId);
  
  if (!reviews.length) {
    return {
      totalCount: 0,
      averageRating: 0,
      photoCount: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const totalCount = reviews.length;
  const photoCount = reviews.filter((r) => r.hasPhoto).length;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const averageRating = totalCount > 0 ? sum / totalCount : 0;

  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return { totalCount, averageRating, photoCount, ratingDistribution };
}

/**
 * Mock 모드: 답글 작성/수정
 */
async function addReviewReplyMock(
  reviewId: string,
  reply: { text: string; by: string }
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const review = MOCK_REVIEWS.find((r) => r.id === reviewId);
  if (!review) throw new Error('Review not found');

  review.reply = {
    text: reply.text,
    by: reply.by,
    at: Date.now(),
  };
}

/**
 * Mock 모드: 답글 삭제
 */
async function deleteReviewReplyMock(reviewId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const review = MOCK_REVIEWS.find((r) => r.id === reviewId);
  if (!review) throw new Error('Review not found');

  delete review.reply;
}

/**
 * Mock 모드: 리뷰 신고
 */
async function reportReviewMock(
  reviewId: string,
  reason: ReviewReportReason,
  reportedBy: string,
  description?: string
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const reports = mockReports.get(reviewId) || [];
  const alreadyReported = reports.some((r) => r.reportedBy === reportedBy);
  if (alreadyReported) {
    throw new Error('이미 신고한 리뷰입니다.');
  }

  const report: ReviewReport = {
    id: `report-${Date.now()}`,
    reviewId,
    reportedBy,
    reason,
    description,
    createdAt: Date.now(),
  };

  reports.push(report);
  mockReports.set(reviewId, reports);

  const review = MOCK_REVIEWS.find((r) => r.id === reviewId);
  if (review) {
    review.reportedCount = (review.reportedCount || 0) + 1;
  }
}

/**
 * Mock 모드: 리뷰 숨김 처리
 */
async function hideReviewMock(reviewId: string, hidden: boolean): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const review = MOCK_REVIEWS.find((r) => r.id === reviewId);
  if (!review) throw new Error('Review not found');

  review.isHidden = hidden;
}

// ============================================================================
// Firebase 구현
// ============================================================================

/**
 * storeId 가져오기 헬퍼
 */
function getStoreId(): string {
  return getEnv('VITE_STORE_ID', 'hyunpoong_main');
}

/**
 * Timestamp → number (milliseconds) 변환
 */
function timestampToMs(ts: Timestamp | undefined): number {
  if (!ts) return Date.now();
  if (typeof ts === 'string') return Date.parse(ts);
  if (typeof ts.toDate === 'function') return ts.toDate().getTime();
  if ((ts as any).seconds && typeof (ts as any).seconds === 'number') {
    return (ts as any).seconds * 1000;
  }
  return Date.now();
}

/**
 * ReviewDoc → Review 변환
 */
function buildReviewFromDoc(doc: ReviewDoc & { reviewId: string }): Review {
  return {
    id: doc.reviewId,
    storeId: doc.storeId,
    orderId: doc.orderId,
    uid: doc.userId,
    userName: doc.userName,
    rating: doc.rating,
    text: doc.content,
    photos: doc.images || [],
    hasPhoto: (doc.images || []).length > 0,
    createdAt: timestampToMs(doc.createdAt),
    reply: doc.ownerReply ? {
      text: doc.ownerReply.content,
      by: 'owner', // TODO: 실제 답글 작성자 ID
      at: timestampToMs(doc.ownerReply.repliedAt),
    } : undefined,
    rewardIssued: doc.pointsEarned > 0,
    isHidden: !doc.isVisible,
  };
}

/**
 * Review → ReviewDoc 변환 (생성용)
 */
function buildReviewDocFromPayload(params: {
  storeId: string;
  orderId: string;
  userId: string;
  userName?: string;
  rating: number;
  content: string;
  images?: string[];
  imagePaths?: string[];
}): Omit<ReviewDoc, 'reviewId' | 'createdAt' | 'updatedAt'> {
  return {
    storeId: params.storeId,
    orderId: params.orderId,
    userId: params.userId,
    userName: params.userName,
    rating: params.rating,
    content: params.content,
    images: params.images || [],
    imagePaths: params.imagePaths || [],
    menuRatings: [],
    isVisible: true,
    pointsEarned: 0,
  };
}

/**
 * 리뷰 목록 조회
 */
export async function getReviews(params: {
  storeId: string;
  photoOnly?: boolean;
  reported?: boolean;
  sortBy?: 'latest' | 'rating_high' | 'rating_low';
  limit?: number;
  offset?: number;
}): Promise<{ reviews: Review[]; hasMore: boolean }> {
  if (!USE_FIREBASE) {
    return await getReviewsMock(params);
  }

  // Firebase 모드: Firestore stores/{storeId}/reviews에서 조회
  try {
    const colRef = storeReviewsCollection(params.storeId);
    const constraints: any[] = [where('isVisible', '==', true)];

    // 정렬
    if (params.sortBy === 'rating_high') {
      constraints.push(orderBy('rating', 'desc'));
      constraints.push(orderBy('createdAt', 'desc'));
    } else if (params.sortBy === 'rating_low') {
      constraints.push(orderBy('rating', 'asc'));
      constraints.push(orderBy('createdAt', 'desc'));
    } else {
      constraints.push(orderBy('createdAt', 'desc'));
    }

    const q = query(colRef, ...constraints);
    const snapshot = await getDocs(q);

    let reviews: Review[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as ReviewDoc;
      const reviewId = data.reviewId || docSnap.id;
      return buildReviewFromDoc({ ...data, reviewId });
    });

    // 클라이언트 측 필터링
    if (params.photoOnly) {
      reviews = reviews.filter((r) => r.hasPhoto);
    }

    // TODO: reported 필터는 신고 컬렉션과 조인 필요

    // 페이지네이션
    const limit = params.limit || 10;
    const offset = params.offset || 0;
    const paginatedReviews = reviews.slice(offset, offset + limit);
    const hasMore = offset + limit < reviews.length;

    return { reviews: paginatedReviews, hasMore };
  } catch (error) {
    console.error('Failed to fetch reviews from Firestore:', error);
    return { reviews: [], hasMore: false };
  }
}

/**
 * 리뷰 통계
 */
export async function getReviewStats(storeId: string): Promise<ReviewStats> {
  if (!USE_FIREBASE) {
    return await getReviewStatsMock(storeId);
  }

  // Firebase 모드: Firestore에서 집계
  try {
    const colRef = storeReviewsCollection(storeId);
    const q = query(colRef, where('isVisible', '==', true));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return {
        totalCount: 0,
        averageRating: 0,
        photoCount: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const reviews = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as ReviewDoc;
      const reviewId = data.reviewId || docSnap.id;
      return buildReviewFromDoc({ ...data, reviewId });
    });

    const totalCount = reviews.length;
    const photoCount = reviews.filter((r) => r.hasPhoto).length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = totalCount > 0 ? sum / totalCount : 0;

    const ratingDistribution = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    return { totalCount, averageRating, photoCount, ratingDistribution };
  } catch (error) {
    console.error('Failed to fetch review stats from Firestore:', error);
    return {
      totalCount: 0,
      averageRating: 0,
      photoCount: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }
}

/**
 * 답글 작성/수정
 */
export async function addReviewReply(
  reviewId: string,
  reply: { text: string; by: string },
  storeId?: string
): Promise<void> {
  if (!USE_FIREBASE) {
    return await addReviewReplyMock(reviewId, reply);
  }

  // Firebase 모드: Firestore stores/{storeId}/reviews/{reviewId} 업데이트
  try {
    const actualStoreId = storeId || getStoreId();
    const ref = storeReviewDocRef(actualStoreId, reviewId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      throw new Error('Review not found');
    }

    await updateDoc(ref, {
      ownerReply: {
        content: reply.text,
        repliedAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to add review reply in Firestore:', error);
    throw error;
  }
}

/**
 * 답글 삭제
 */
export async function deleteReviewReply(reviewId: string, storeId?: string): Promise<void> {
  if (!USE_FIREBASE) {
    return await deleteReviewReplyMock(reviewId);
  }

  // Firebase 모드: Firestore stores/{storeId}/reviews/{reviewId} 업데이트
  try {
    const actualStoreId = storeId || getStoreId();
    const ref = storeReviewDocRef(actualStoreId, reviewId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      throw new Error('Review not found');
    }

    await updateDoc(ref, {
      ownerReply: null,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to delete review reply in Firestore:', error);
    throw error;
  }
}

/**
 * 리뷰 신고
 * TODO: 향후 reviews/{reviewId}/reports 서브컬렉션으로 확장
 */
export async function reportReview(
  reviewId: string,
  reason: ReviewReportReason,
  reportedBy: string,
  description?: string,
  storeId?: string
): Promise<void> {
  if (!USE_FIREBASE) {
    return await reportReviewMock(reviewId, reason, reportedBy, description);
  }

  // Firebase 모드: TODO - reviews/{reviewId}/reports 서브컬렉션에 신고 문서 생성
  // 현재는 기본 구조만 제공
  try {
    // TODO: 실제 신고 컬렉션 구현
    console.warn('[reviews.api] reportReview Firebase 구현은 향후 확장 예정');
    throw new Error('Firebase report review not fully implemented yet');
  } catch (error) {
    console.error('Failed to report review in Firestore:', error);
    throw error;
  }
}

/**
 * 리뷰 숨김 처리
 */
export async function hideReview(reviewId: string, hidden: boolean, storeId?: string): Promise<void> {
  if (!USE_FIREBASE) {
    return await hideReviewMock(reviewId, hidden);
  }

  // Firebase 모드: Firestore stores/{storeId}/reviews/{reviewId} 업데이트
  try {
    const actualStoreId = storeId || getStoreId();
    const ref = storeReviewDocRef(actualStoreId, reviewId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      throw new Error('Review not found');
    }

    await updateDoc(ref, {
      isVisible: !hidden,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to hide review in Firestore:', error);
    throw error;
  }
}
