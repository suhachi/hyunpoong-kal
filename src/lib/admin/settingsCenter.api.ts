/**
 * 관리자 설정 센터 API
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { USE_FIREBASE, FEATURE_FLAGS } from '../../config/env';
import {
  AdminSettings,
  DEFAULT_DELIVERY_SETTINGS,
  DEFAULT_MAPS_SETTINGS,
  DEFAULT_FCM_SETTINGS,
  DEFAULT_OPERATIONS_SETTINGS,
  DEFAULT_POINTS_SETTINGS,
  FunctionsHealthCheck,
  DiagnosticResult,
  DiagnosticCheck,
} from '../../types/adminSettings';

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

const SETTINGS_DOC_PATH = 'adminSettings/core';
const ADMIN_SETTINGS_LS_KEY = 'hp_kal_admin_settings';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function getDefaultAdminSettings(): AdminSettings {
  return {
    delivery: DEFAULT_DELIVERY_SETTINGS,
    maps: DEFAULT_MAPS_SETTINGS,
    fcm: DEFAULT_FCM_SETTINGS,
    points: { ...DEFAULT_POINTS_SETTINGS, enabled: FEATURE_FLAGS.points },
    operations: DEFAULT_OPERATIONS_SETTINGS,
    updatedAt: new Date(),
    updatedBy: '',
    updatedByName: '',
  };
}

function loadSettingsFromLocalStorage(): AdminSettings {
  if (!isBrowser()) return getDefaultAdminSettings();
  try {
    const raw = localStorage.getItem(ADMIN_SETTINGS_LS_KEY);
    if (!raw) return getDefaultAdminSettings();
    const data = JSON.parse(raw);
    return {
      delivery: data.delivery || DEFAULT_DELIVERY_SETTINGS,
      maps: data.maps || DEFAULT_MAPS_SETTINGS,
      fcm: data.fcm || DEFAULT_FCM_SETTINGS,
      points: data.points || { ...DEFAULT_POINTS_SETTINGS, enabled: FEATURE_FLAGS.points },
      operations: data.operations || DEFAULT_OPERATIONS_SETTINGS,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      updatedBy: data.updatedBy || '',
      updatedByName: data.updatedByName || '',
    } as AdminSettings;
  } catch (e) {
    console.warn('[settingsCenter] Failed to parse local settings, using defaults', e);
    return getDefaultAdminSettings();
  }
}

function saveSettingsToLocalStorage(settings: AdminSettings): void {
  if (!isBrowser()) return;
  const payload = {
    ...settings,
    // serialize Date for storage
    updatedAt: settings.updatedAt?.toISOString?.() || new Date().toISOString(),
  };
  localStorage.setItem(ADMIN_SETTINGS_LS_KEY, JSON.stringify(payload));
}

/**
 * 관리자 설정 조회
 */
export async function getAdminSettings(): Promise<AdminSettings> {
  // Mock/LocalStorage 분기 (USE_FIREBASE=false)
  if (!USE_FIREBASE) {
    return loadSettingsFromLocalStorage();
  }

  try {
    const docRef = doc(db, SETTINGS_DOC_PATH);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() || {};
      return {
        delivery: data.delivery || DEFAULT_DELIVERY_SETTINGS,
        maps: data.maps || DEFAULT_MAPS_SETTINGS,
        fcm: data.fcm || DEFAULT_FCM_SETTINGS,
        points: data.points || { ...DEFAULT_POINTS_SETTINGS, enabled: FEATURE_FLAGS.points },
        operations: data.operations || DEFAULT_OPERATIONS_SETTINGS,
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        updatedBy: data.updatedBy || '',
        updatedByName: data.updatedByName || '',
      };
    }

    // 기본값 반환
    return getDefaultAdminSettings();
  } catch (error) {
    console.error('Failed to get admin settings:', error);
    throw new Error('설정을 불러오는데 실패했습니다');
  }
}

/**
 * 관리자 설정 저장
 */
export async function saveAdminSettings(
  settings: Partial<AdminSettings>,
  userId: string,
  userName: string
): Promise<AdminSettings> {
  // Mock/LocalStorage 분기 (USE_FIREBASE=false)
  if (!USE_FIREBASE) {
    const current = loadSettingsFromLocalStorage();
    const updated: AdminSettings = {
      ...current,
      ...settings,
      // 부분 병합: 중첩 객체를 안전하게 병합
      delivery: { ...current.delivery, ...(settings.delivery || {}) },
      maps: { ...current.maps, ...(settings.maps || {}) },
      fcm: { ...current.fcm, ...(settings.fcm || {}) },
      points: { ...current.points, ...(settings.points || {}) },
      operations: { ...current.operations, ...(settings.operations || {}) },
      updatedAt: new Date(),
      updatedBy: userId,
      updatedByName: userName,
    };
    saveSettingsToLocalStorage(updated);
    return updated;
  }

  try {
    const docRef = doc(db, SETTINGS_DOC_PATH);
    
    const currentSettings = await getAdminSettings();
    
    const updatedSettings = {
      ...currentSettings,
      ...settings,
      // Firestore merge 시 중첩 병합 유지를 위한 얕은 병합 (필요 시 세부 병합 구현)
      updatedAt: serverTimestamp(),
      updatedBy: userId,
      updatedByName: userName,
    };

    await setDoc(docRef, updatedSettings, { merge: true });

    return {
      ...updatedSettings,
      updatedAt: new Date(),
    } as AdminSettings;
  } catch (error) {
    console.error('Failed to save admin settings:', error);
    throw new Error('설정을 저장하는데 실패했습니다');
  }
}

/**
 * Functions Config 헬스체크
 * 
 * Note: 실제 구현은 Cloud Functions에서 Callable Function으로 구현 필요
 * 현재는 Mock 데이터 반환
 */
export async function checkFunctionsHealth(): Promise<FunctionsHealthCheck> {
  // TODO: Firebase Functions의 checkHealth callable function 호출
  // const result = await httpsCallable(functions, 'admin-checkHealth')();
  
  // Mock 데이터 (개발용)
  return {
    nicepay: {
      configured: false,
      fields: {
        endpoint: false,
        mid: false,
        key: false,
        returnUrl: false,
        cancelUrl: false,
      },
    },
    delivery: {
      configured: false,
      fields: {
        secret: false,
        allowedIps: false,
      },
    },
    fcm: {
      configured: false,
      fields: {
        serverKey: false,
      },
    },
  };
}

/**
 * FCM 지원 여부 확인
 */
export async function checkFCMSupport(): Promise<DiagnosticCheck> {
  try {
    if (!('Notification' in window)) {
      return {
        name: 'FCM 지원',
        status: 'fail',
        message: '브라우저가 알림을 지원하지 않습니다',
      };
    }

    if (!('serviceWorker' in navigator)) {
      return {
        name: 'FCM 지원',
        status: 'fail',
        message: '브라우저가 Service Worker를 지원하지 않습니다',
      };
    }

    if (!('PushManager' in window)) {
      return {
        name: 'FCM 지원',
        status: 'fail',
        message: '브라우저가 Push 알림을 지원하지 않습니다',
      };
    }

    return {
      name: 'FCM 지원',
      status: 'pass',
      message: '브라우저가 FCM을 완전히 지원합니다',
    };
  } catch (error) {
    return {
      name: 'FCM 지원',
      status: 'fail',
      message: 'FCM 지원 확인 중 오류가 발생했습니다',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Service Worker 상태 확인
 */
export async function checkServiceWorkerStatus(): Promise<DiagnosticCheck> {
  try {
    if (!('serviceWorker' in navigator)) {
      return {
        name: 'Service Worker',
        status: 'fail',
        message: 'Service Worker를 지원하지 않습니다',
      };
    }

    const registration = await navigator.serviceWorker.getRegistration();
    
    if (!registration) {
      return {
        name: 'Service Worker',
        status: 'warning',
        message: 'Service Worker가 등록되지 않았습니다',
      };
    }

    if (registration.active) {
      return {
        name: 'Service Worker',
        status: 'pass',
        message: 'Service Worker가 정상 작동 중입니다',
        details: `Scope: ${registration.scope}`,
      };
    }

    return {
      name: 'Service Worker',
      status: 'warning',
      message: 'Service Worker가 활성화되지 않았습니다',
    };
  } catch (error) {
    return {
      name: 'Service Worker',
      status: 'fail',
      message: 'Service Worker 확인 중 오류가 발생했습니다',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * VAPID 키 확인
 * 미설정과 실제 오류를 구분
 */
export function checkVAPIDKey(): DiagnosticCheck {
  const vapidKey = getMetaEnv('VITE_FCM_VAPID_KEY');
  
  if (!vapidKey) {
    return {
      name: 'VAPID 키',
      status: 'info', // 'fail' 대신 'info'로 변경하여 미설정 상태임을 명확히 표시
      message: '아직 FCM 웹 푸시용 VAPID 키가 설정되지 않았습니다. Firebase 콘솔에서 키 생성 후 .env에 VITE_FCM_VAPID_KEY를 추가해 주세요.',
    };
  }

  if (vapidKey.length < 80) {
    return {
      name: 'VAPID 키',
      status: 'warning',
      message: 'VAPID 키 형식이 올바르지 않을 수 있습니다',
      details: `길이: ${vapidKey.length} (일반적으로 80자 이상)`,
    };
  }

  return {
    name: 'VAPID 키',
    status: 'pass',
    message: 'VAPID 키가 설정되어 있습니다',
  };
}

/**
 * 환경 변수 확인
 */
export function checkEnvironmentVariables(): DiagnosticResult {
  const checks: DiagnosticCheck[] = [];

  // Firebase 설정
  const firebaseKeys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  firebaseKeys.forEach(key => {
    const value = getMetaEnv(key);
    checks.push({
      name: key,
      status: value ? 'pass' : 'fail',
      message: value ? '설정됨' : '미설정',
    });
  });

  // FCM VAPID
  checks.push(checkVAPIDKey());

  // NICEPAY (선택)
  const nicepayClientId = getMetaEnv('VITE_NICEPAY_CLIENT_ID');
  checks.push({
    name: 'VITE_NICEPAY_CLIENT_ID',
    status: nicepayClientId ? 'pass' : 'warning',
    message: nicepayClientId ? '설정됨' : '미설정 (결제 기능 비활성)',
  });

  // 지도 API (선택)
  const kakaoKey = getMetaEnv('VITE_KAKAO_MAP_KEY');
  const googleKey = getMetaEnv('VITE_GOOGLE_MAPS_API_KEY');
  
  if (!kakaoKey && !googleKey) {
    checks.push({
      name: '지도 API 키',
      status: 'warning',
      message: 'Kakao 또는 Google Maps API 키가 설정되지 않았습니다',
    });
  } else {
    if (kakaoKey) {
      checks.push({
        name: 'VITE_KAKAO_MAP_KEY',
        status: 'pass',
        message: '설정됨',
      });
    }
    if (googleKey) {
      checks.push({
        name: 'VITE_GOOGLE_MAPS_API_KEY',
        status: 'pass',
        message: '설정됨',
      });
    }
  }

  const failCount = checks.filter(c => c.status === 'fail').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;

  return {
    category: '환경 변수',
    checks,
    overall: failCount > 0 ? 'fail' : warningCount > 0 ? 'warning' : 'pass',
  };
}

/**
 * FCM 진단 실행
 */
export async function runFCMDiagnostics(): Promise<DiagnosticResult> {
  const checks: DiagnosticCheck[] = [];

  // FCM 지원 확인
  checks.push(await checkFCMSupport());

  // Service Worker 확인
  checks.push(await checkServiceWorkerStatus());

  // VAPID 키 확인
  checks.push(checkVAPIDKey());

  const failCount = checks.filter(c => c.status === 'fail').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  const infoCount = checks.filter(c => c.status === 'info').length;

  // overall 상태 결정: fail > warning > info > pass
  let overall: 'pass' | 'info' | 'warning' | 'fail' = 'pass';
  if (failCount > 0) {
    overall = 'fail';
  } else if (warningCount > 0) {
    overall = 'warning';
  } else if (infoCount > 0) {
    overall = 'info';
  }

  return {
    category: 'FCM 알림',
    checks,
    overall,
  };
}
