/**
 * 관리자 리뷰 관리 API
 * USE_FIREBASE=false: Mock 데이터 사용
 * USE_FIREBASE=true: Firestore 연동
 */

import type { Review, ReviewReply, ReviewReport, ReviewReportReason, ReviewStats } from '../../types/review';

import { USE_FIREBASE } from '../../config/env';

// Mock 리뷰 데이터 (샘플 데이터 제거)
const MOCK_REVIEWS: Review[] = [];

// Mock 신고 데이터
const mockReports: Map<string, ReviewReport[]> = new Map();

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
  if (USE_FIREBASE) {
    // TODO: Firestore 쿼리
    throw new Error('Firebase not implemented');
  }

  // Mock 데이터 필터링
  await new Promise((resolve) => setTimeout(resolve, 300)); // 네트워크 지연 시뮬레이션

  let filtered = [...MOCK_REVIEWS];

  // 필터: 사진 리뷰만
  if (params.photoOnly) {
    filtered = filtered.filter((r) => r.hasPhoto);
  }

  // 필터: 신고된 리뷰만
  if (params.reported) {
    filtered = filtered.filter((r) => (r.reportedCount || 0) > 0);
  }

  // 정렬
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

  // 페이지네이션
  const limit = params.limit || 10;
  const offset = params.offset || 0;
  const reviews = filtered.slice(offset, offset + limit);
  const hasMore = offset + limit < filtered.length;

  return { reviews, hasMore };
}

/**
 * 리뷰 통계
 */
export async function getReviewStats(storeId: string): Promise<ReviewStats> {
  if (USE_FIREBASE) {
    // TODO: Firestore aggregation
    throw new Error('Firebase not implemented');
  }

  await new Promise((resolve) => setTimeout(resolve, 200));

  const reviews = MOCK_REVIEWS.filter((r) => r.storeId === storeId);
  
  // 빈 배열일 때 기본값 반환
  if (!reviews.length) {
    return {
      totalCount: 0,
      averageRating: 0,
      photoCount: 0,
      ratingDistribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
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

  return {
    totalCount,
    averageRating,
    photoCount,
    ratingDistribution,
  };
}

/**
 * 답글 작성/수정
 */
export async function addReviewReply(
  reviewId: string,
  reply: { text: string; by: string }
): Promise<void> {
  if (USE_FIREBASE) {
    // TODO: Firestore update
    throw new Error('Firebase not implemented');
  }

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
 * 답글 삭제
 */
export async function deleteReviewReply(reviewId: string): Promise<void> {
  if (USE_FIREBASE) {
    // TODO: Firestore update
    throw new Error('Firebase not implemented');
  }

  await new Promise((resolve) => setTimeout(resolve, 300));

  const review = MOCK_REVIEWS.find((r) => r.id === reviewId);
  if (!review) throw new Error('Review not found');

  delete review.reply;
}

/**
 * 리뷰 신고
 */
export async function reportReview(
  reviewId: string,
  reason: ReviewReportReason,
  reportedBy: string,
  description?: string
): Promise<void> {
  if (USE_FIREBASE) {
    // TODO: Firestore create reviews_reports
    throw new Error('Firebase not implemented');
  }

  await new Promise((resolve) => setTimeout(resolve, 300));

  // 중복 신고 체크
  const reports = mockReports.get(reviewId) || [];
  const alreadyReported = reports.some((r) => r.reportedBy === reportedBy);
  if (alreadyReported) {
    throw new Error('이미 신고한 리뷰입니다.');
  }

  // 신고 추가
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

  // 리뷰의 신고 카운트 증가
  const review = MOCK_REVIEWS.find((r) => r.id === reviewId);
  if (review) {
    review.reportedCount = (review.reportedCount || 0) + 1;
  }
}

/**
 * 리뷰 숨김 처리
 */
export async function hideReview(reviewId: string, hidden: boolean): Promise<void> {
  if (USE_FIREBASE) {
    // TODO: Firestore update
    throw new Error('Firebase not implemented');
  }

  await new Promise((resolve) => setTimeout(resolve, 300));

  const review = MOCK_REVIEWS.find((r) => r.id === reviewId);
  if (!review) throw new Error('Review not found');

  review.isHidden = hidden;
}
