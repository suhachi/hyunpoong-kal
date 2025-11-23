/**
 * FCM 토큰 관리 API
 * 사용자별 FCM 토큰 저장 및 관리
 */

import { USE_FIREBASE } from '../config/env';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';

const FCM_TOKENS_COLLECTION = 'fcmTokens';

/**
 * FCM 토큰 저장
 * @param userId 사용자 ID
 * @param token FCM 토큰
 */
export async function saveFcmToken(userId: string, token: string): Promise<void> {
  if (!USE_FIREBASE) {
    // Mock 모드: localStorage에만 저장
    localStorage.setItem(`fcm_token_${userId}`, token);
    console.log('[Mock] FCM token saved for user:', userId);
    return;
  }

  try {
    const tokenDocRef = doc(db, FCM_TOKENS_COLLECTION, userId);
    await setDoc(
      tokenDocRef,
      {
        token,
        userId,
        platform: 'web',
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log('[FCM] Token saved to Firestore for user:', userId);
  } catch (error) {
    console.error('Failed to save FCM token:', error);
    throw error;
  }
}

/**
 * FCM 토큰 조회
 * @param userId 사용자 ID
 * @returns FCM 토큰 또는 null
 */
export async function getFcmToken(userId: string): Promise<string | null> {
  if (!USE_FIREBASE) {
    // Mock 모드: localStorage에서 조회
    return localStorage.getItem(`fcm_token_${userId}`);
  }

  try {
    const tokenDocRef = doc(db, FCM_TOKENS_COLLECTION, userId);
    const tokenDoc = await getDoc(tokenDocRef);
    
    if (tokenDoc.exists()) {
      const data = tokenDoc.data();
      return data.token || null;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
}

/**
 * 관리자 알림 전송 함수 (스켈레톤)
 * TODO: Phase 3에서 실제 FCM 전송 로직 구현
 * @param userId 사용자 ID
 * @param payload 알림 페이로드
 */
export async function sendNotificationToUser(
  userId: string,
  payload: {
    title: string;
    body: string;
    data?: Record<string, string>;
  }
): Promise<void> {
  // TODO: Phase 3에서 Cloud Functions를 통해 FCM 전송 구현
  // 1. userId로 FCM 토큰 조회
  // 2. Firebase Admin SDK를 사용하여 FCM 전송
  // 3. 전송 실패 시 재시도 로직
  console.log('[FCM] sendNotificationToUser called (not implemented yet):', userId, payload);
}

