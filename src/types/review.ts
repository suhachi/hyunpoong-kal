import type { FirestoreTimestamp } from "./common";

export interface Review {
  id: string;
  orderId: string;
  userId: string;
  userName?: string;

  rating: number; // 1-5
  content: string;
  images?: string[];

  menuNames: string[]; // 주문한 메뉴 이름들 (표시용)

  createdAt: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;

  // 관리자 답글
  reply?: {
    content: string;
    createdAt: FirestoreTimestamp;
  };

  isDeleted?: boolean;
}

export interface ReviewFormData {
  rating: number;
  content: string;
  images?: File[];
}

// 리뷰 신고 관련
export type ReviewReportReason = "spam" | "abuse" | "advertisement" | "other";

export const REPORT_REASON_LABELS: Record<ReviewReportReason, string> = {
  spam: "스팸/홍보",
  abuse: "욕설/비방",
  advertisement: "광고성 내용",
  other: "기타",
};

export interface ReviewReport {
  id: string;
  reviewId: string;
  reportedBy: string;
  reason: ReviewReportReason;
  description?: string;
  createdAt: FirestoreTimestamp;
  status: "pending" | "resolved" | "dismissed";
}

export interface ReviewReply {
  content: string;
  createdAt: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

export type ReviewSortOption = "latest" | "rating_high" | "rating_low";

export interface ReviewStats {
  total: number;
  withPhotos: number;
  averageRating: number;
  byRating: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
