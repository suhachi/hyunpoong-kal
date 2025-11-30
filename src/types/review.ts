import type { FTimestamp } from "./common";

export interface Review {
  id: string;
  orderId: string;
  userId: string;
  userName?: string;

  rating: number; // 1-5
  content: string;
  images?: string[];

  menuNames: string[]; // 주문한 메뉴 이름들 (표시용)

  createdAt: FTimestamp;
  updatedAt?: FTimestamp;

  // 관리자 답글
  reply?: {
    content: string;
    createdAt: FTimestamp;
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
  createdAt: FTimestamp;
  status: "pending" | "resolved" | "dismissed";
}

export interface ReviewReply {
  content: string;
  createdAt: FTimestamp;
  updatedAt?: FTimestamp;
}

export interface ReviewStats {
  total: number;
  averageRating: number;
  byRating: Record<number, number>;
  withPhotos: number;
}
