/**
 * 환경 변수 설정
 * USE_FIREBASE 플래그를 통한 Mock/Real 전환
 */

// 환경 타입 (먼저 정의 - 순환 참조 방지)
// Figma Make 환경 등에서 import.meta가 없을 수 있으므로 방어적으로 처리
export const ENV = (() => {
  try {
    // import.meta 존재 여부 확인 (Figma Make 호환)
    if (typeof import.meta === 'undefined' || !import.meta.env) {
      console.log('[Env] Figma Make 또는 특수 환경 감지 - 개발 모드로 설정');
      return 'development';
    }
    return import.meta.env.MODE || 'development';
  } catch {
    return 'development';
  }
})();

// 디버그 모드 (먼저 정의 - 순환 참조 방지)
export const DEBUG = ENV === 'development';

// 환경 변수 로딩 상태 (최초 1회만 경고)
let envWarningShown = false;

// 환경 변수 안전 접근 헬퍼 (Figma Make 환경 호환)
export const getEnv = (key: string, defaultValue: string = '', required: boolean = false): string => {
  try {
    // import.meta 안전 체크 (Figma Make 등 특수 환경 대응)
    if (typeof import.meta === 'undefined' || !import.meta.env) {
      if (DEBUG && required) {
        console.warn(`[Env] ${key} 접근 불가 (Figma Make?), 기본값 사용: ${defaultValue}`);
      }
      return defaultValue;
    }
    
    const value = import.meta.env[key] || '';
    
    // 필수 변수인데 값이 없으면 오류
    if (!value && required && !defaultValue) {
      console.error(`[Env] Required environment variable ${key} is not set`);
      // 개발 환경에서는 경고만, 프로덕션에서는 에러 던지기
      if (ENV === 'production') {
        throw new Error(`Required environment variable ${key} is not set`);
      }
    }
    
    // 값이 설정되어 있으면 해당 값 사용, 없으면 기본값
    return value || defaultValue;
  } catch (error) {
    if (DEBUG) {
      console.warn(`[Env] ${key} 접근 에러, 기본값 사용:`, defaultValue, error);
    }
    return defaultValue;
  }
};

// v1.0: Firebase 모드 플래그 (환경 변수 기반)
// VITE_USE_FIREBASE 환경 변수를 읽어서 boolean으로 변환
// 기본값: false (Mock 모드)
// true: Firebase 실연동 모드
// false: Mock 모드 (localStorage)
export const USE_FIREBASE = (() => {
  const raw = getEnv('VITE_USE_FIREBASE', 'false');
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  // 기본값: false (Mock 모드)
  return false;
})();

// 디버그 로그 추가
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log('[env] USE_FIREBASE:', USE_FIREBASE, 'VITE_USE_FIREBASE:', getEnv('VITE_USE_FIREBASE'));
}

// 앱 설정
export const APP_CONFIG = {
  name: '현풍닭칼국수',
  version: '1.0.0',
  company: 'KS컴퍼니',
  bizNo: '553-17-00098',
  ceo: '석경선/배종수(공동대표)',
};

// v1.0: Store ID (환경 변수 기반)
// VITE_STORE_ID 환경 변수를 읽어서 사용
// 기본값: 'hyunpoong_main'
export const STORE_ID = getEnv('VITE_STORE_ID', 'hyunpoong_main');

// Google Maps API
// VITE_GOOGLE_MAP_API_KEY 환경 변수를 읽어서 사용
export const GOOGLE_MAP_API_KEY = getEnv('VITE_GOOGLE_MAP_API_KEY', '');

// Kakao Map JS SDK (Fallback)
// VITE_KAKAO_MAP_APP_KEY 환경 변수를 읽어서 사용
export const KAKAO_MAP_APP_KEY = getEnv('VITE_KAKAO_MAP_APP_KEY', '');

// Firebase 설정 (Firebase 사용 시)
export const FIREBASE_CONFIG = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID'),
  measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID'),
};

// NICEPAY 설정
export const NICEPAY_CONFIG = {
  mid: getEnv('VITE_NICEPAY_MID', 'NICE_DEV_MID'),
  clientKey: getEnv('VITE_NICEPAY_CLIENT_KEY', 'NICE_DEV_KEY'),
};

// 배달 대행사 Provider A 설정
export const PROVIDER_A_CONFIG = {
  apiUrl: getEnv('VITE_PROVIDER_A_API_URL', 'https://api.provider-a.example.com'),
  apiKey: getEnv('VITE_PROVIDER_A_API_KEY', 'YOUR_API_KEY_HERE'),
  merchantId: getEnv('VITE_PROVIDER_A_MERCHANT_ID', 'YOUR_MERCHANT_ID'),
};

// Phase 3 기능 토글
export const FEATURE_FLAGS = {
  // 배달 추적 기능 (개발 환경에서는 기본 활성화)
  delivery: getEnv('VITE_DELIVERY_ENABLED', ENV === 'development' ? 'true' : 'false') === 'true',
  deliveryProvider: getEnv('VITE_DELIVERY_PROVIDER', 'mock'),
  deliveryWebhookSecret: getEnv('VITE_DELIVERY_WEBHOOK_SECRET', 'change_me'),
  // 고객 지원 채팅 기능 (개발 환경에서는 기본 활성화)
  support: getEnv('VITE_SUPPORT_ENABLED', ENV === 'development' ? 'true' : 'false') === 'true',
  // 포인트 리워드 시스템 (개발 환경에서는 기본 활성화)
  points: getEnv('VITE_POINTS_ENABLED', ENV === 'development' ? 'true' : 'false') === 'true',
  pointsRate: parseFloat(getEnv('VITE_POINTS_RATE', '0.03')),
  pointsMinUse: parseInt(getEnv('VITE_POINTS_MIN_USE', '1000'), 10),
  pointsExpireDays: parseInt(getEnv('VITE_POINTS_EXPIRE_DAYS', '365'), 10),
  // 온라인 결제 기능 (Phase 3)
  // v0.9.0에서는 강제로 false (env 기본값도 false)
  onlinePayment: getEnv('VITE_ONLINE_PAYMENT_ENABLED', 'false') === 'true',
  onlinePaymentProvider: getEnv('VITE_ONLINE_PAYMENT_PROVIDER', 'none'),
};

// 로깅 유틸
export function log(...args: any[]) {
  if (DEBUG) {
    console.log('[App]', ...args);
  }
}

export function logError(...args: any[]) {
  console.error('[App Error]', ...args);
}

// (중복 export 제거)
export default {
  ENV,
  DEBUG,
  USE_FIREBASE,
  FIREBASE_CONFIG,
  FEATURE_FLAGS,
  log,
  logError,
  getEnv,
};
