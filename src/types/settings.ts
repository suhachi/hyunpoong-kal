/**
 * 관리자 설정 타입
 */

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface BusinessHours {
  day: DayOfWeek;
  isOpen: boolean;
  openTime: string;   // "09:00"
  closeTime: string;  // "22:00"
}

export interface DeliveryFee {
  minDistance: number;  // km
  maxDistance: number;  // km
  fee: number;          // 원
}

export interface StoreSettings {
  storeId: string;
  
  // 영업시간
  businessHours: BusinessHours[];
  
  // 배달 설정
  deliveryFees: DeliveryFee[];
  deliveryRadius: number;     // 최대 배달 반경 (km)
  minDeliveryOrder: number;   // 최소 배달 주문 금액 (원)
  
  // 배달대행사 설정
  deliveryProvider?: DeliveryProviderSettings;
  
  // 포장 설정
  minPickupOrder: number;     // 최소 포장 주문 금액 (원)
  
  // 휴무일
  holidays: string[];         // ["2025-01-01", "2025-02-09"]
  
  // 업데이트 정보
  updatedAt: Date;
  updatedBy: string;
  updatedByName: string;
}

export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: '월요일',
  tue: '화요일',
  wed: '수요일',
  thu: '목요일',
  fri: '금요일',
  sat: '토요일',
  sun: '일요일',
};

export const DEFAULT_BUSINESS_HOURS: BusinessHours[] = [
  { day: 'mon', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'tue', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'wed', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'thu', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'fri', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'sat', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'sun', isOpen: true, openTime: '10:00', closeTime: '22:00' },
];

export const DEFAULT_DELIVERY_FEES: DeliveryFee[] = [
  { minDistance: 0, maxDistance: 2, fee: 3000 },
  { minDistance: 2, maxDistance: 4, fee: 4000 },
  { minDistance: 4, maxDistance: 6, fee: 5000 },
];

/**
 * 배달대행사 Provider 설정
 */
export type DeliveryProviderType = 'mock' | 'providerA' | 'custom';

export interface DeliveryProviderSettings {
  enabled: boolean;
  provider: DeliveryProviderType;
  
  // Provider A 설정
  providerA?: {
    apiUrl: string;
    apiKey: string;
    merchantId: string;
    webhookSecret?: string;
  };
  
  // Custom Provider 설정
  custom?: {
    name: string;
    apiUrl: string;
    apiKey: string;
    headers?: Record<string, string>;
    webhookSecret?: string;
  };
}

export const DEFAULT_DELIVERY_PROVIDER_SETTINGS: DeliveryProviderSettings = {
  enabled: false,
  provider: 'mock',
};
