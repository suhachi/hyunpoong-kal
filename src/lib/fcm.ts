/**
 * FCM (Firebase Cloud Messaging) 클라이언트
 * 푸시 알림 권한 요청 및 토큰 관리
 * Phase 3-6: 푸시 알림 시스템
 */

import { USE_FIREBASE, ENV } from '../config/env';
import type { NotificationSettings } from '../types/notification';

// 안전한 환경 변수 접근 (Figma Make 호환)
const getMetaEnv = (key: string): string | undefined => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key];
    }
    return undefined;
  } catch {
    return undefined;
  }
};

/**
 * FCM 권한 요청 및 토큰 저장
 */
export async function requestNotificationPermission(
  userId: string
): Promise<string | null> {
  if (!USE_FIREBASE) {
    console.log('[Mock] Notification permission requested for user:', userId);
    
    // Mock: localStorage에 권한 상태 저장
    localStorage.setItem('notification_permission', 'granted');
    const mockToken = `mock-fcm-token-${userId}-${Date.now()}`;
    localStorage.setItem(FCM_TOKEN_KEY, mockToken);
    
    return mockToken;
  }

  try {
    // 브라우저 알림 권한 요청
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Firebase Messaging 설정
    const { getToken, getMessaging, isSupported } = await import('firebase/messaging');
    const firebaseApp = (await import('./firebase')).default;
    const vapidKey = getMetaEnv('VITE_FCM_VAPID_KEY') || getMetaEnv('VITE_FIREBASE_VAPID_KEY');
    
    if (!vapidKey) {
      console.error('VAPID key not configured');
      return null;
    }
    if (!(await isSupported())) {
      console.error('FCM is not supported in this browser');
      return null;
    }
    if (!firebaseApp) {
      console.error('Firebase app is not initialized');
      return null;
    }
    const messaging = getMessaging(firebaseApp as any);

    const token = await getToken(messaging, {
      vapidKey,
    });
    // 로컬에도 저장 (개발 편의)
    localStorage.setItem(FCM_TOKEN_KEY, token);

    // Firestore에 토큰 저장
    // TODO(Phase3): users/{userId}/meta/fcm 경로 스키마 확정 후 구현
    // 현재는 users 컬렉션이 스키마에 정의되어 있지 않으므로,
    // Firebase 모드에서도 실제 Firestore 쓰기는 비활성화
    // (Mock 모드는 localStorage만 사용)
    if (USE_FIREBASE) {
      // Phase 3에서 users 컬렉션 스키마 확정 후 활성화 예정
      // const { doc, setDoc } = await import('firebase/firestore');
      // const { db } = await import('./firebase');
      // await setDoc(
      //   doc(db, `users/${userId}/meta/fcm`),
      //   {
      //     token,
      //     platform: 'web',
      //     updatedAt: new Date(),
      //   },
      //   { merge: true }
      // );
      console.warn('[FCM] Firestore 저장은 Phase 3에서 users 스키마 확정 후 활성화 예정');
    }

    return token;
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
}

// T2-9: FCM 토큰 발급 보장(모크 우선) + localStorage 저장
// FCM 토큰 키는 이 상수 하나만 사용 (다른 파일에서 하드코딩 금지)
export const FCM_TOKEN_KEY = 'hp_kal_fcm_token';

export async function ensureFcmToken(): Promise<string | null> {
  try {
    const existing = localStorage.getItem(FCM_TOKEN_KEY);
    if (existing) return existing;

    if (!('Notification' in window)) {
      console.warn('[FCM] Notification API not supported');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[FCM] Notification permission not granted:', permission);
      return null;
    }

    if (!USE_FIREBASE) {
      const mock = `mock-fcm-token-${Date.now()}`;
      localStorage.setItem(FCM_TOKEN_KEY, mock);
      console.info('[FCM] Mock token stored:', mock);
      return mock;
    }

    const { getToken, getMessaging, isSupported } = await import('firebase/messaging');
    const firebaseApp = (await import('./firebase')).default;
    if (!(await isSupported())) {
      console.warn('[FCM] Messaging not supported in this browser');
      return null;
    }
    if (!firebaseApp) {
      console.warn('[FCM] Firebase app not initialized');
      return null;
    }
    const messaging = getMessaging(firebaseApp as any);
    const vapidKey = getMetaEnv('VITE_FCM_VAPID_KEY') || getMetaEnv('VITE_FIREBASE_VAPID_KEY');
    if (!vapidKey) {
      console.warn('[FCM] VAPID key not configured');
      return null;
    }
    const token = await getToken(messaging, { vapidKey });
    if (token) {
      localStorage.setItem(FCM_TOKEN_KEY, token);
      console.info('[FCM] Token stored:', token);
    }
    return token ?? null;
  } catch (err) {
    console.error('[FCM] ensureFcmToken error:', err);
    return null;
  }
}

/**
 * 포그라운드 메시지 리스너 설정
 */
export async function setupForegroundMessageListener(
  onMessage: (payload: any) => void
): Promise<(() => void) | null> {
  if (!USE_FIREBASE) {
    console.log('[Mock] Foreground message listener setup');
    
    // Mock: 개발 환경에서 테스트 알림 시뮬레이션
    if (ENV === 'development') {
      // 10초마다 Mock 알림 생성 (테스트용)
      const interval = setInterval(() => {
        const mockMessages = [
          {
            notification: {
              title: '🚚 배달 출발',
              body: '주문하신 메뉴가 배달을 시작했습니다.',
            },
            data: { type: 'order_delivering', orderId: 'mock-order-1' },
          },
          {
            notification: {
              title: '🎁 쿠폰 발급',
              body: '감사 쿠폰이 발급되었습니다!',
            },
            data: { type: 'coupon_issued' },
          },
        ];
        
        // 랜덤하게 가끔 알림 발송 (20% 확률)
        if (Math.random() < 0.2) {
          const mockMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
          console.log('[Mock] Foreground message:', mockMessage);
          onMessage(mockMessage);
        }
      }, 10000);
      
      return () => clearInterval(interval);
    }
    
    return null;
  }

  try {
    const { onMessage: onFCMMessage, getMessaging, isSupported } = await import('firebase/messaging');
    const firebaseApp = (await import('./firebase')).default;
    if (!(await isSupported()) || !firebaseApp) {
      console.warn('[FCM] Messaging not supported or app not initialized');
      return null;
    }
    const messaging = getMessaging(firebaseApp as any);
    const unsubscribe = onFCMMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      onMessage(payload);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Failed to setup message listener:', error);
    return null;
  }
}

/**
 * 알림 권한 상태 확인
 */
export function checkNotificationPermission(): NotificationPermission | null {
  if (!('Notification' in window)) {
    return null;
  }

  return Notification.permission;
}

/**
 * 알림 권한이 있는지 확인
 */
export function hasNotificationPermission(): boolean {
  return checkNotificationPermission() === 'granted';
}

/**
 * 브라우저가 알림을 지원하는지 확인
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * 알림 설정 저장
 */
export async function saveNotificationSettings(
  userId: string,
  settings: NotificationSettings
): Promise<void> {
  if (!USE_FIREBASE) {
    console.log('[Mock] Saving notification settings:', settings);
    localStorage.setItem(`notification_settings_${userId}`, JSON.stringify(settings));
    return;
  }

  try {
    const { doc, setDoc } = await import('firebase/firestore');
    // TODO(Phase3): users/{userId}/settings/notifications 경로 스키마 확정 후 구현
    // 현재는 users 컬렉션이 스키마에 정의되어 있지 않으므로,
    // Firebase 모드에서도 실제 Firestore 쓰기는 비활성화
    // (Mock 모드는 localStorage만 사용)
    if (USE_FIREBASE) {
      // Phase 3에서 users 컬렉션 스키마 확정 후 활성화 예정
      // const { doc, setDoc } = await import('firebase/firestore');
      // const { db } = await import('./firebase');
      // await setDoc(
      //   doc(db, `users/${userId}/settings/notifications`),
      //   {
      //     ...settings,
      //     updatedAt: new Date(),
      //   }
      // );
      console.warn('[FCM] Firestore 저장은 Phase 3에서 users 스키마 확정 후 활성화 예정');
    }
  } catch (error) {
    console.error('Failed to save notification settings:', error);
    throw error;
  }
}

/**
 * 알림 설정 조회
 */
export async function getNotificationSettings(
  userId: string
): Promise<NotificationSettings> {
  if (!USE_FIREBASE) {
    console.log('[Mock] Getting notification settings');
    const stored = localStorage.getItem(`notification_settings_${userId}`);
    
    if (stored) {
      return JSON.parse(stored);
    }
    
    // 기본 설정
    return {
      userId,
      enabled: true,
      orderUpdates: true,
      promotions: true,
      reviews: true,
      points: true,
      sound: true,
      vibration: true,
      updatedAt: new Date(),
    };
  }

  // TODO(Phase3): users/{userId}/settings/notifications 경로 스키마 확정 후 구현
  // 현재는 users 컬렉션이 스키마에 정의되어 있지 않으므로,
  // Firebase 모드에서도 실제 Firestore 읽기는 비활성화
  // (Mock 모드는 localStorage만 사용)
  if (USE_FIREBASE) {
    // Phase 3에서 users 컬렉션 스키마 확정 후 활성화 예정
    // try {
    //   const { doc, getDoc } = await import('firebase/firestore');
    //   const { db } = await import('./firebase');
    //   const docSnap = await getDoc(doc(db, `users/${userId}/settings/notifications`));
    //   if (docSnap.exists()) {
    //     return docSnap.data() as NotificationSettings;
    //   }
    // } catch (error) {
    //   console.error('Failed to fetch notification settings from Firestore:', error);
    // }
    console.warn('[FCM] Firestore 조회는 Phase 3에서 users 스키마 확정 후 활성화 예정');
  }
  
  // 기본 설정 반환 (Firebase 모드에서도 스키마 미확정 시)
  return {
    userId,
    enabled: true,
    orderUpdates: true,
    promotions: true,
    reviews: true,
    points: true,
    sound: true,
    vibration: true,
    updatedAt: new Date(),
  };
}

/**
 * 테스트 푸시 알림 전송 (Mock 전용)
 */
export function sendTestNotification(): void {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  new Notification('현풍닭칼국수', {
    body: '테스트 알림입니다 🍜',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'test-notification',
    requireInteraction: false,
  });
}
