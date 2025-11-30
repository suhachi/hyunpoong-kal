import type { Timestamp } from 'firebase/firestore';

export interface Review {
  id: string;
  orderId: string;
  userId: string;
  userName?: string;

  rating: number;  // 1-5
  content: string;
  images?: string[];

  menuNames: string[]; // 주문한 메뉴 이름들 (표시용)

  createdAt: Timestamp;
  updatedAt?: Timestamp;

  // 관리자 답글
  reply?: {
    content: string;
    createdAt: Timestamp;
  };

  isDeleted?: boolean;
}

export interface ReviewFormData {
  rating: number;
  content: string;
  images?: File[];
}
