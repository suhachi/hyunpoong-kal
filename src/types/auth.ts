import { FirestoreTimestamp } from "./common";

export type UserRole = "owner" | "admin" | "customer";

export interface AuthUser {
  uid: string;
  email: string | null;
  phoneNumber: string; // 필수
  displayName: string | null;
  photoURL: string | null;
  role: UserRole; // Enum 강제
  createdAt: FirestoreTimestamp;
  lastLoginAt: FirestoreTimestamp;
  
  // 마케팅 동의
  agreements?: {
    marketing: boolean;
    push: boolean;
  };
}

