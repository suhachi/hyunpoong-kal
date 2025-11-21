/**
 * 관리자 설정 센터 타입 정의
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

/**
 * 설정 상태
 */
export type ConfigStatus = 'connected' | 'not-set' | 'error' | 'unknown';

export interface ConfigStatusInfo {
  status: ConfigStatus;
  message?: string;
  lastChecked?: Date;
}

/**
 * Functions Config 헬스체크 응답
 */
export interface FunctionsHealthCheck {
  nicepay: {
    configured: boolean;
    fields: {
      endpoint: boolean;
      mid: boolean;
      key: boolean;
      returnUrl: boolean;
      cancelUrl: boolean;
    };
  };
  delivery: {
    configured: boolean;
    fields: {
      secret: boolean;
      allowedIps: boolean;
    };
  };
  fcm: {
    configured: boolean;
    fields: {
      serverKey: boolean;
    };
  };
}

/**
 * NICEPAY 설정
 */
export interface NicepaySettings {
  mode: 'test' | 'production';
  endpoint: string;
  mid: string;
  returnUrl: string;
  cancelUrl: string;
}

/**
 * 배달 대행사 설정
 */
export interface DeliverySettings {
  provider: 'mock' | 'providerA' | 'custom';
  maxDistanceKm: number;
  feeTable: DeliveryFeeZone[];
  nightSurcharge: number;
  nightStartHour: number; // 21
  nightEndHour: number;   // 6
}

export interface DeliveryFeeZone {
  toKm: number;
  fee: number;
}

/**
 * 지도/지오코딩 설정
 */
export interface MapsSettings {
  provider: 'kakao' | 'google' | 'both';
  kakaoApiKey?: string;
  googleApiKey?: string;
}

/**
 * FCM 설정
 */
export interface FCMSettings {
  enabled: boolean;
  vapidKey?: string;
  serviceWorkerPath: string;
}

/**
 * 포인트 설정
 */
export interface PointsSettings {
  enabled: boolean;
}

/**
 * 운영 설정
 */
export interface OperationsSettings {
  cors: {
    configured: boolean;
    allowedOrigins: string[];
  };
  firestoreRules: {
    lastDeployed?: Date;
    status: 'up-to-date' | 'outdated' | 'unknown';
  };
  firestoreIndexes: {
    lastDeployed?: Date;
    status: 'up-to-date' | 'outdated' | 'unknown';
  };
  storageRules: {
    lastDeployed?: Date;
    status: 'up-to-date' | 'outdated' | 'unknown';
  };
  hosting: {
    lastDeployed?: Date;
    status: 'deployed' | 'not-deployed' | 'unknown';
  };
}

/**
 * 관리자 설정 (Firestore 저장용 - 비밀 아님)
 */
export interface AdminSettings {
  delivery: DeliverySettings;
  maps: MapsSettings;
  fcm: FCMSettings;
  points: PointsSettings;
  operations: OperationsSettings;
  
  // 메타데이터
  updatedAt: Date;
  updatedBy: string;
  updatedByName: string;
}

/**
 * CLI 명령어 템플릿
 */
export interface CLICommand {
  title: string;
  description: string;
  command: string;
  variables?: Record<string, string>;
}

/**
 * .env 템플릿
 */
export interface EnvTemplate {
  section: string;
  variables: EnvVariable[];
}

export interface EnvVariable {
  key: string;
  value: string;
  required: boolean;
  description: string;
}

/**
 * 배포 스크립트
 */
export interface DeployScript {
  name: string;
  description: string;
  commands: string[];
  order: number;
}

/**
 * 진단 결과
 */
export interface DiagnosticResult {
  category?: string;
  checks: DiagnosticCheck[];
  overall: 'pass' | 'warning' | 'fail' | 'info';
}

export interface DiagnosticCheck {
  name: string;
  status: 'pass' | 'warning' | 'fail' | 'info';
  message: string;
  details?: string;
}

/**
 * 기본값
 */
export const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  provider: 'mock',
  maxDistanceKm: 5,
  feeTable: [
    { toKm: 1, fee: 2000 },
    { toKm: 3, fee: 3000 },
    { toKm: 5, fee: 4000 },
  ],
  nightSurcharge: 1000,
  nightStartHour: 21,
  nightEndHour: 6,
};

export const DEFAULT_MAPS_SETTINGS: MapsSettings = {
  provider: 'kakao',
};

export const DEFAULT_FCM_SETTINGS: FCMSettings = {
  enabled: false,
  serviceWorkerPath: '/firebase-messaging-sw.js',
};

export const DEFAULT_POINTS_SETTINGS: PointsSettings = {
  enabled: true,
};

export const DEFAULT_OPERATIONS_SETTINGS: OperationsSettings = {
  cors: {
    configured: false,
    allowedOrigins: ['https://hp-kal.web.app', 'https://hp-kal.firebaseapp.com'],
  },
  firestoreRules: {
    status: 'unknown',
  },
  firestoreIndexes: {
    status: 'unknown',
  },
  storageRules: {
    status: 'unknown',
  },
  hosting: {
    status: 'unknown',
  },
};
