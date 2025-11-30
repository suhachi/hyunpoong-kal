# Types & Constants - Full Source Code

**Generated**: 2025-11-30-1558  
**Project**: hyunpoong-kal  
**Company**: KS Company (BRN: 553-17-00098)

---

## Overview

Complete source code of TypeScript type definitions and constants.

---
## src\types\adminSettings.ts

```typescript
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

```

---

## src\types\analytics.ts

```typescript
/**
 * 통합 리포트 및 분석 타입 정의
 * Phase 3-7: 통합 리포트
 */

// 기간 타입
export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'custom';

// 날짜 범위
export interface DateRange {
  start: Date;
  end: Date;
}

// 통합 KPI 데이터
export interface IntegratedKPI {
  // 매출 지표
  totalSales: number;
  averageOrderValue: number;
  totalOrders: number;
  
  // 고객 지표
  newCustomers: number;
  returningCustomers: number;
  customerRetentionRate: number; // %
  
  // 평점 지표
  averageRating: number;
  totalReviews: number;
  photoReviewRate: number; // %
  
  // 포인트 지표
  totalPointsEarned: number;
  totalPointsSpent: number;
  pointsRedemptionRate: number; // %
  
  // 쿠폰 지표
  totalCouponsIssued: number;
  totalCouponsUsed: number;
  couponUsageRate: number; // %
  totalDiscount: number;
  
  // 전환율 지표
  installRate: number; // A2HS 설치율 %
  cartConversionRate: number; // 장바구니 → 주문 전환율 %
  paymentSuccessRate: number; // 결제 성공률 %
}

// 시간대별 주문 분석
export interface HourlyAnalysis {
  hour: number;
  orders: number;
  sales: number;
  averageOrderValue: number;
}

// 요일별 분석
export interface DayOfWeekAnalysis {
  dayOfWeek: number; // 0 (일) ~ 6 (토)
  dayName: string;
  orders: number;
  sales: number;
  averageOrderValue: number;
}

// 메뉴별 성과
export interface MenuPerformance {
  menuId: string;
  menuName: string;
  category: string;
  totalOrders: number;
  totalSales: number;
  averageRating: number;
  reviewCount: number;
}

// 고객 행동 분석
export interface CustomerBehavior {
  userId: string;
  userName: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: Date;
  favoriteMenu: string;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'vip';
}

// 쿠폰 효과 분석
export interface CouponEffectiveness {
  couponType: string;
  totalIssued: number;
  totalUsed: number;
  usageRate: number; // %
  totalDiscount: number;
  averageOrderIncrease: number; // 쿠폰 사용 시 평균 주문 증가액
  roi: number; // 투자 대비 수익률
}

// 포인트 효과 분석
export interface PointsEffectiveness {
  totalEarned: number;
  totalSpent: number;
  totalExpired: number;
  activeUsers: number;
  averageBalance: number;
  redemptionRate: number; // %
  orderIncreaseWithPoints: number; // 포인트 사용 시 평균 주문 증가액
}

// 리뷰 분석
export interface ReviewAnalysis {
  totalReviews: number;
  averageRating: number;
  photoReviewCount: number;
  photoReviewRate: number; // %
  sentimentScore: number; // 감성 분석 점수 (1-5)
  topKeywords: Array<{ keyword: string; count: number }>;
  responseRate: number; // 답글 작성률 %
  responseTime: number; // 평균 답글 시간 (분)
}

// 배달 성과
export interface DeliveryPerformance {
  totalDeliveries: number;
  averageDeliveryTime: number; // 분
  onTimeRate: number; // 정시 배달률 %
  delayedOrders: number;
  averageDistance: number; // km
}

// 알림 효과
export interface NotificationEffectiveness {
  totalSent: number;
  totalRead: number;
  totalClicked: number;
  readRate: number; // %
  clickRate: number; // %
  conversionRate: number; // 알림 클릭 → 주문 전환율 %
  byType: Record<string, {
    sent: number;
    read: number;
    clicked: number;
  }>;
}

// 통합 리포트
export interface IntegratedReport {
  period: ReportPeriod;
  dateRange: DateRange;
  generatedAt: Date;
  
  kpi: IntegratedKPI;
  hourlyAnalysis: HourlyAnalysis[];
  dayOfWeekAnalysis: DayOfWeekAnalysis[];
  topMenus: MenuPerformance[];
  topCustomers: CustomerBehavior[];
  
  couponEffectiveness: CouponEffectiveness[];
  pointsEffectiveness: PointsEffectiveness;
  reviewAnalysis: ReviewAnalysis;
  deliveryPerformance: DeliveryPerformance;
  notificationEffectiveness: NotificationEffectiveness;
  
  // 추가 지표
  insights: string[]; // AI 인사이트 (선택)
  recommendations: string[]; // 개선 제안
}

// 차트 데이터 타입
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }>;
}

// 내보내기 형식
export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

// 리포트 설정
export interface ReportSettings {
  autoGenerate: boolean; // 자동 생성 여부
  frequency: 'daily' | 'weekly' | 'monthly';
  emailRecipients: string[]; // 이메일 수신자
  includeCharts: boolean; // 차트 포함 여부
  format: ExportFormat;
}

```

---

## src\types\cart.ts

```typescript
import type { CustomOption } from './menu';

export interface CartItem {
  menuId: string;
  menuName: string;
  menuImage: string;
  menuPrice: number;
  quantity: number;
  options: {
    noodle?: string;
    spicy?: string;
    toppings?: string[];
  };
  optionPrices: {
    noodle: number;
    toppings: number;
    custom?: number;  // 커스텀 옵션 총액
  };
  customOptions?: CustomOption[];  // 선택된 커스텀 옵션 목록
  subtotal: number;
}

export type DeliveryType = 'delivery' | 'pickup';

export interface DeliveryAddress {
  address: string;
  detail: string;
  lat?: number;
  lng?: number;
}

export interface CartState {
  items: CartItem[];
  deliveryType: DeliveryType;
  deliveryAddress?: DeliveryAddress;
  requests?: string;
  couponId?: string;
  couponDiscount: number;
}

export interface CartContextType extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryType: (type: DeliveryType) => void;
  setDeliveryAddress: (address: DeliveryAddress) => void;
  setRequests: (requests: string) => void;
  applyCoupon: (couponId: string, discount: number) => void;
  removeCoupon: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotalAmount: () => number;
  forceReload: () => void;
}

```

---

## src\types\common.ts

```typescript
/**
 * 공통 타입 정의
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { Timestamp } from 'firebase/firestore';

/**
 * 기본 아이템 인터페이스 (주문/장바구니 공통)
 */
export interface BaseItem {
  menuId: string;
  menuName: string;
  menuImage?: string;
  quantity: number;
  price: number;
  options?: Record<string, any>;
}

/**
 * 타임스탬프 타입
 */
export type TimestampType = Timestamp | Date | { seconds: number; nanoseconds: number };

/**
 * 주소 정보
 */
export interface Address {
  address: string;
  detail?: string;
  zipCode?: string;
  lat?: number;
  lng?: number;
}

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * API 응답 기본 형식
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 기본 엔티티 (ID + 타임스탬프)
 */
export interface BaseEntity {
  id: string;
  createdAt: TimestampType;
  updatedAt: TimestampType;
}

/**
 * 필터 옵션
 */
export interface FilterOptions {
  search?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 통계 데이터
 */
export interface Stats {
  label: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease';
}

```

---

## src\types\coupon.ts

```typescript
// 쿠폰 시스템 타입 정의

export type CouponType = 'photo_review' | 'welcome' | 'event' | 'compensation' | 'admin';
export type CouponStatus = 'available' | 'used' | 'expired';

export interface Coupon {
  id?: string;
  uid: string;
  type: CouponType;
  amount: number; // 할인 금액 (원)
  minSpend: number; // 최소 주문 금액 (원)
  issuedAt: number;
  expiresAt: number;
  used: boolean;
  usedAt?: number;
  orderId?: string; // 사용된 주문 ID
  title?: string;
  description?: string;
}

export interface CouponStats {
  totalIssued: number;
  totalUsed: number;
  totalAmount: number;
  expiredCount: number;
}

// 관리자용 쿠폰 발급 데이터
export interface CouponIssue {
  type: CouponType;
  title: string;
  description: string;
  amount: number;
  minSpend: number;
  expiryDays: number; // 유효 기간 (일)
  targetUsers?: string[]; // 특정 사용자 타게팅
  issueLimit?: number; // 발급 상한
}

// 쿠폰 필터
export interface CouponFilters {
  status?: CouponStatus;
  type?: CouponType;
  sortBy?: 'issuedAt' | 'expiresAt' | 'amount';
}

// 쿠폰 타입 라벨
export const COUPON_TYPE_LABELS: Record<CouponType, string> = {
  photo_review: '사진 리뷰 보상',
  welcome: '신규 가입',
  event: '이벤트',
  compensation: '보상',
  admin: '관리자 발급',
};

// 쿠폰 상태 계산
export function getCouponStatus(coupon: Coupon): CouponStatus {
  if (coupon.used) {
    return 'used';
  }
  if (Date.now() > coupon.expiresAt) {
    return 'expired';
  }
  return 'available';
}

```

---

## src\types\delivery.ts

```typescript
/**
 * 배달 추적 관련 타입 정의
 * Phase 3-1: GPS Tracking
 */

export interface Coordinates {
  lat: number;
  lng: number;
  at: number; // timestamp
}

export type DeliveryStatus = 
  | 'assigned'      // 배정됨
  | 'picked_up'     // 픽업 완료
  | 'delivering'    // 배달 중
  | 'completed'     // 배달 완료
  | 'canceled';     // 취소됨

export interface DeliveryTask {
  taskId: string;
  orderId: string;
  driverId?: string;
  status: DeliveryStatus;
  eta?: number; // 예상 도착 시간 (분)
  lastCoord?: Coordinates;
  createdAt: number;
  updatedAt: number;
}

export type DriverStatus = 
  | 'idle'          // 대기 중
  | 'assigned'      // 배정됨
  | 'delivering'    // 배달 중
  | 'offline';      // 오프라인

export interface Driver {
  driverId: string;
  name?: string;
  phone?: string;
  lastCoord?: Coordinates;
  status: DriverStatus;
}

export interface PickupLocation {
  addr: string;
  lat: number;
  lng: number;
}

export interface DropoffLocation {
  addr: string;
  lat: number;
  lng: number;
}

export interface CreateTaskParams {
  orderId: string;
  pickup: PickupLocation;
  dropoff: DropoffLocation;
}

export interface CreateTaskResult {
  taskId: string;
}

/**
 * 배달 대행사 Provider 인터페이스
 */
export interface DeliveryProvider {
  /**
   * 배달 태스크 생성
   */
  createTask(params: CreateTaskParams): Promise<CreateTaskResult>;
  
  /**
   * 배달 태스크 조회
   */
  getTask(taskId: string): Promise<DeliveryTask>;
  
  /**
   * 배달 태스크 취소
   */
  cancelTask(taskId: string): Promise<void>;
}

/**
 * Webhook 이벤트 타입
 */
export type WebhookEventType = 
  | 'task.created'
  | 'task.assigned'
  | 'task.picked_up'
  | 'task.delivering'
  | 'task.completed'
  | 'task.canceled'
  | 'driver.location';

export interface WebhookEvent {
  type: WebhookEventType;
  taskId: string;
  timestamp: number;
  data: {
    status?: DeliveryStatus;
    driverId?: string;
    location?: Coordinates;
    eta?: number;
  };
}

```

---

## src\types\menu.ts

```typescript
export type MenuCategory =
  | 'noodle'        // 칼국수/메인메뉴
  | 'set'           // 세트메뉴
  | 'side'          // 사이드메뉴
  | 'drink'         // 음료
  | 'alcohol';      // 주류

export type MenuBadge =
  | 'best'      // 베스트
  | 'signature' // 시그니처
  | 'spicy'     // 매운맛
  | 'cold'      // 냉메뉴
  | 'seasonal'; // 계절메뉴

// 옵션 항목 (옵션명-수량-가격)
export interface OptionItem {
  id: string;
  name: string;       // 옵션 이름 (예: "보통", "곱빼기", "순한맛")
  quantity: number;   // 수량
  price: number;      // 추가 가격
}

// 옵션 그룹 (관리자가 생성)
export interface OptionGroup {
  id: string;
  name: string;           // 옵션 그룹 이름 (예: "면양", "맵기", "토핑")
  required: boolean;      // 필수 선택 여부
  multiSelect: boolean;   // 다중 선택 가능 여부
  maxSelect?: number;     // 최대 선택 개수 (multiSelect=true일 때)
  items: OptionItem[];    // 옵션 항목들
  order: number;          // 표시 순서
}

// 메뉴에 연결된 옵션 그룹
export interface MenuOptionGroup extends OptionGroup {
  // 메뉴별로 옵션 그룹을 커스터마이즈할 수 있도록
}

// 커스텀 옵션 (관리자가 메뉴별로 직접 정의)
export interface CustomOption {
  id: string;
  name: string;       // 옵션 이름 (예: "곱빼기", "순한맛", "계란 추가")
  price: number;      // 추가 가격
  quantity: number;   // 기본 수량 (대부분 1)
  category?: string;  // 옵션 카테고리 (예: "면양", "맵기", "토핑") - 선택사항
}

export interface Menu {
  menuId: string;
  category: MenuCategory;
  name: string;
  price: number;
  description: string;
  image: string;
  badges: MenuBadge[];
  options?: {               // 간단한 옵션 구조 (기존 호환성)
    noodle?: { label: string; price: number }[];
    spicy?: { label: string; price: number }[];
    toppings?: { label: string; price: number }[];
  };
  customOptions?: CustomOption[];    // 관리자가 직접 정의한 커스텀 옵션들 (신규)
  optionGroups?: MenuOptionGroup[];  // 이 메뉴에 적용된 옵션 그룹들 (고급)
  allergens: string[];      // 알레르기 유발 성분
  origin: string;           // 원산지
  isAvailable: boolean;     // 판매 가능 여부
  availableHours?: {        // 시간제 판매
    start: string;
    end: string;
  };
  order: number;            // 정렬 순서
}

export interface MenuItem extends Menu {
  selectedOptions?: {
    noodle?: string;
    spicy?: string;
    toppings?: string[];
  };
  quantity: number;
  subtotal: number;
}

// 관리자용 메뉴 필터
export interface MenuFilters {
  category?: MenuCategory | 'all';
  search?: string;
  sortBy?: 'name' | 'price-asc' | 'price-desc' | 'order';
  availableOnly?: boolean;
}

// 메뉴 수정 로그
export interface MenuLog {
  id: string;
  menuId: string;
  field: string;
  oldValue: any;
  newValue: any;
  by: string;
  byName: string;
  at: Date;
  reason?: string;
}

// 메뉴 상태 (시간제 판매 고려)
export type MenuStatus =
  | 'available'     // 판매 중
  | 'soldout'       // 품절
  | 'time-limited'  // 시간제 (현재 시간 밖)
  | 'hidden';       // 숨김

// 카테고리 라벨 맵
export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  noodle: '메인',
  set: '세트',
  side: '사이드',
  drink: '음료',
  alcohol: '주류',
};

// 배지 라벨 맵
export const BADGE_LABELS: Record<MenuBadge, string> = {
  best: '베스트',
  signature: '시그니처',
  spicy: '매운맛',
  cold: '냉메뉴',
  seasonal: '계절메뉴',
};

```

---

## src\types\notice.ts

```typescript
/**
 * 공지사항 타입 정의
 */

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'notice' | 'event' | 'promotion';
  isActive: boolean;
  priority: number; // 우선순위 (높을수록 먼저 표시)
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByName: string;
}

export interface NoticeFilters {
  type?: 'notice' | 'event' | 'promotion' | 'all';
  isActive?: boolean;
  search?: string;
}


```

---

## src\types\notification.ts

```typescript
/**
 * 알림(Notification) 타입 정의
 * Phase 3-6: 푸시 알림 시스템
 */

// 알림 타입
export type NotificationType =
  | 'order_received' // 주문 접수
  | 'order_cooking' // 조리 시작
  | 'order_ready' // 조리 완료 (픽업 준비)
  | 'order_delivering' // 배달 시작
  | 'order_completed' // 주문 완료
  | 'order_cancelled' // 주문 취소
  | 'coupon_issued' // 쿠폰 발급
  | 'points_earned' // 포인트 적립
  | 'review_reminder' // 리뷰 작성 요청
  | 'review_reply' // 리뷰 답글
  | 'promotion' // 프로모션/이벤트
  | 'system'; // 시스템 공지

// 알림 우선순위
export type NotificationPriority = 'high' | 'normal' | 'low';

// 알림 데이터
export interface Notification {
  id: string;
  userId: string; // 수신자 UID (빈 문자열이면 전체 발송)
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>; // 추가 데이터 (orderId, couponId 등)
  priority: NotificationPriority;
  read: boolean;
  clicked: boolean;
  createdAt: Date;
  expiresAt?: Date; // 만료일 (선택)
}

// 알림 설정
export interface NotificationSettings {
  userId: string;
  enabled: boolean; // 전체 알림 활성화
  orderUpdates: boolean; // 주문 상태 알림
  promotions: boolean; // 프로모션/이벤트 알림
  reviews: boolean; // 리뷰 관련 알림
  points: boolean; // 포인트 관련 알림
  sound: boolean; // 알림음
  vibration: boolean; // 진동
  updatedAt: Date;
}

// 푸시 메시지 페이로드
export interface PushPayload {
  notification?: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    image?: string;
    tag?: string;
    requireInteraction?: boolean;
  };
  data?: Record<string, string>;
}

// FCM 토큰
export interface FCMToken {
  userId: string;
  token: string;
  platform: 'web' | 'android' | 'ios';
  createdAt: Date;
  updatedAt: Date;
}

// 알림 템플릿
export interface NotificationTemplate {
  type: NotificationType;
  title: string;
  body: string;
  priority: NotificationPriority;
  data?: Record<string, any>;
}

// 알림 통계
export interface NotificationStats {
  totalSent: number;
  totalRead: number;
  totalClicked: number;
  readRate: number; // 읽은 비율 (%)
  clickRate: number; // 클릭 비율 (%)
  byType: Record<NotificationType, number>;
}

```

---

## src\types\order.ts

```typescript
// Firebase Timestamp 타입 (선택적)
// Firebase 사용 시: Timestamp
// Mock 모드 시: { seconds: number; nanoseconds: number }
type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
  toDate?: () => Date;
};

export type OrderStatus = 
  | 'pending'     // 접수대기
  | 'accepted'    // 접수확인
  | 'cooking'     // 조리중
  | 'delivering'  // 배달중
  | 'completed'   // 완료
  | 'cancelled';  // 취소

export type PaymentMethod = 
  | 'app_card'   // 앱 내 카드 선결제 (PG 연동용, 지금은 준비 중)
  | 'meet_card'  // 만나서 카드 결제 (배달 기사 또는 매장에서 카드 단말기로 결제)
  | 'meet_cash'; // 만나서 현금 결제 (배달 기사 또는 매장에서 현금으로 결제)

export type PaymentStatus = 
  | 'pending'     // 결제 대기
  | 'authorized'  // 인증됨 (승인 전)
  | 'approved'    // 승인됨
  | 'failed'      // 실패
  | 'refunded';   // 환불

export interface OrderItem {
  menuId: string;
  menuName: string;
  menuImage: string;
  quantity: number;
  options: {
    noodle?: string;
    spicy?: string;
    toppings?: string[];
  };
  price: number;
  subtotal: number;
}

export interface DeliveryAddress {
  address: string;
  detail: string;
  lat?: number;
  lng?: number;
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  tid?: string;           // NICEPAY 거래 ID
  authToken?: string;     // 인증 토큰
  cardName?: string;      // 카드사명
  cardNum?: string;       // 카드번호 (마스킹)
  paidAt?: Timestamp;
  canceledAt?: Timestamp;
  cancelReason?: string;
  amount: number;
}

export interface Order {
  orderId: string;
  userId: string;
  storeId: string;
  
  items: OrderItem[];
  
  subtotal: number;
  discount: number;
  couponId?: string;
  deliveryFee: number;
  finalAmount: number;
  
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress?: DeliveryAddress;
  phone: string;
  email?: string;
  requests?: string;
  
  status: OrderStatus;
  payment: PaymentInfo;
  
  timeline: {
    pending?: Timestamp;
    accepted?: Timestamp;
    preparing?: Timestamp;
    completed?: Timestamp;
    canceled?: Timestamp;
  };
  
  // 현금영수증/세금계산서
  cashReceipt?: {
    type: 'personal' | 'business';
    number: string;
  };
  taxInvoice?: {
    businessNumber: string;
    companyName: string;
  };
  
  // Firestore uses FirebaseTimestamp, local mock uses ISO string
  createdAt: FirebaseTimestamp | string;
  updatedAt: FirebaseTimestamp | string;
}

// 주문 로그 (감사 추적)
export interface OrderLog {
  logId: string;
  orderId: string;
  action: 'created' | 'status_changed' | 'canceled' | 'refunded' | 'note_added';
  by: string;           // userId or 'system'
  byName?: string;      // 사용자 이름
  at: Timestamp;
  from?: OrderStatus;
  to?: OrderStatus;
  reason?: string;      // 취소/환불 사유
  note?: string;        // 추가 메모
}

// 주문 상태 전이 가드
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['accepted', 'cancelled'],
  accepted: ['cooking', 'cancelled'],
  cooking: ['delivering', 'cancelled'],
  delivering: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

```

---

## src\types\payment.ts

```typescript
// NICEPAY 결제 요청 파라미터
export interface NicePayAuthRequest {
  MID: string;              // 상점 ID
  Amt: string;              // 결제 금액
  Moid: string;             // 주문번호 (orderId)
  GoodsName: string;        // 상품명
  BuyerName: string;        // 구매자명
  BuyerTel: string;         // 구매자 전화번호
  BuyerEmail: string;       // 구매자 이메일
  ReturnURL: string;        // 결제 결과 수신 URL
  VbankExpDate?: string;    // 가상계좌 입금마감일
  EdiDate: string;          // 전문 생성일시 (YYYYMMDDhhmmss)
  SignData: string;         // 해시값 (위변조 검증)
}

// NICEPAY 결제 승인 요청
export interface NicePayApproveRequest {
  TID: string;              // 거래 ID
  AuthToken: string;        // 인증 토큰
  Amt: string;              // 결제 금액
  MID: string;              // 상점 ID
  Moid: string;             // 주문번호
  SignData: string;         // 해시값
  EdiDate: string;          // 전문 생성일시
}

// NICEPAY 응답
export interface NicePayResponse {
  ResultCode: string;       // 결과코드 (0000: 성공)
  ResultMsg: string;        // 결과메시지
  TID?: string;             // 거래 ID
  Moid?: string;            // 주문번호
  Amt?: string;             // 결제 금액
  AuthToken?: string;       // 인증 토큰
  CardName?: string;        // 카드사명
  CardQuota?: string;       // 할부개월
  CardNum?: string;         // 카드번호 (마스킹)
  PayMethod?: string;       // 결제수단
  GoodsName?: string;       // 상품명
  BuyerName?: string;       // 구매자명
  BuyerTel?: string;        // 구매자 전화번호
  BuyerEmail?: string;      // 구매자 이메일
  AuthDate?: string;        // 승인일시
}

// NICEPAY 취소 요청
export interface NicePayCancelRequest {
  TID: string;              // 거래 ID
  MID: string;              // 상점 ID
  Moid: string;             // 주문번호
  CancelAmt: string;        // 취소 금액
  CancelMsg: string;        // 취소 사유
  PartialCancelCode?: string; // 부분취소 코드
  EdiDate: string;          // 전문 생성일시
  SignData: string;         // 해시값
}

// 클라이언트 결제 요청 데이터
export interface PaymentRequest {
  orderId: string;
  amount: number;
  goodsName: string;
  buyerName: string;
  buyerTel: string;
  buyerEmail: string;
}

// 결제 결과
export interface PaymentResult {
  success: boolean;
  orderId: string;
  tid?: string;
  amount?: number;
  resultCode?: string;
  resultMsg?: string;
  authToken?: string;
  cardName?: string;
  cardNum?: string;
}

```

---

## src\types\points.ts

```typescript
/**
 * 포인트 리워드 시스템 타입 정의
 * Phase 3-3: Points System
 */

export type PointsTransactionType = 
  | 'earn'      // 적립
  | 'spend'     // 사용
  | 'expire'    // 만료
  | 'adjust';   // 관리자 조정

export type PointsRefKind = 
  | 'order'     // 주문
  | 'review'    // 리뷰
  | 'admin'     // 관리자
  | 'promotion'; // 프로모션

export interface PointsReference {
  kind: PointsRefKind;
  id: string;
}

/**
 * 포인트 원장 (불변)
 */
export interface PointsLedger {
  id: string;
  uid: string;
  type: PointsTransactionType;
  amount: number; // 양수: 증가, 음수: 감소
  ref?: PointsReference;
  at: number;
  note?: string;
  expiresAt?: number; // 만료 일시 (적립 시에만)
}

/**
 * 포인트 잔액 (캐시)
 */
export interface PointsBalance {
  uid: string;
  balance: number;
  updatedAt: number;
}

/**
 * 포인트 적립 요청
 */
export interface EarnPointsParams {
  uid: string;
  amount: number;
  ref: PointsReference;
  note?: string;
}

/**
 * 포인트 사용 요청
 */
export interface SpendPointsParams {
  uid: string;
  amount: number;
  ref: PointsReference;
  note?: string;
}

/**
 * 포인트 정책
 */
export interface PointsPolicy {
  // 적립률 (주문 금액의 %)
  earnRate: number; // 0.03 = 3%
  
  // 최소 사용 금액
  minUse: number; // 1000 = 1,000원부터 사용 가능
  
  // 만료 기간 (일)
  expireDays: number; // 365 = 1년
  
  // 리뷰 사진 추가 적립
  reviewPhotoBonus: number; // 200 = 200포인트
  
  // 리뷰 텍스트 기본 적립
  reviewTextBonus: number; // 100 = 100포인트
}

/**
 * 포인트 내역 조회 결과
 */
export interface PointsHistory {
  ledger: PointsLedger[];
  balance: number;
  expiringPoints: {
    amount: number;
    expiresAt: number;
  }[];
}

```

---

## src\types\review.ts

```typescript
// 리뷰 시스템 타입 정의

export interface Review {
  id?: string;
  storeId: string;
  orderId: string;
  uid: string;
  userName?: string;
  rating: number; // 1-5
  text: string;
  photos: string[]; // Storage download URLs
  hasPhoto: boolean;
  createdAt: number;
  reply?: ReviewReply;
  rewardIssued: boolean;
  reportedCount?: number; // 신고 횟수
  isHidden?: boolean; // 관리자가 숨김 처리
}

export interface ReviewReply {
  text: string;
  by: string; // 답글 작성자 (관리자/사장님)
  at: number; // timestamp
}

export interface ReviewFormData {
  rating: number;
  text: string;
  photos: File[];
}

export interface ReviewStats {
  totalCount: number;
  averageRating: number;
  photoCount: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export type ReviewSortOption = 'latest' | 'rating_high' | 'rating_low';

export interface ReviewFilters {
  storeId: string;
  photoOnly?: boolean;
  minRating?: number;
  sortBy?: ReviewSortOption;
  reported?: boolean; // 신고된 리뷰만
}

// 리뷰 신고
export interface ReviewReport {
  id?: string;
  reviewId: string;
  reportedBy: string; // uid
  reason: ReviewReportReason;
  description?: string;
  createdAt: number;
}

export type ReviewReportReason = 'spam' | 'abuse' | 'advertisement' | 'other';

export const REPORT_REASON_LABELS: Record<ReviewReportReason, string> = {
  spam: '스팸',
  abuse: '욕설/비방',
  advertisement: '광고',
  other: '기타',
};

```

---

## src\types\settings.ts

```typescript
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

```

---

## src\types\support.ts

```typescript
/**
 * 고객센터 채팅 관련 타입 정의
 * Phase 3-2: Support Chat
 */

export interface ChatSession {
  id: string;
  userId: string;
  userName?: string;
  userPhone?: string;
  open: boolean;
  lastAt: number;
  lastMessage?: string;
  assignedTo?: string; // 담당 관리자 UID
  createdAt: number;
  updatedAt: number;
}

export type MessageSender = 'user' | 'admin' | 'bot';

export type MessageType = 'text' | 'image';

export interface ChatMessage {
  id: string;
  sessionId: string;
  from: MessageSender;
  type: MessageType;
  text?: string;
  imageUrl?: string;
  at: number;
  readByAdmin?: boolean;
  readByUser?: boolean;
}

export interface SendMessageParams {
  sessionId: string;
  from: MessageSender;
  type: MessageType;
  text?: string;
  imageUrl?: string;
}

/**
 * 운영 시간 체크
 */
export interface BusinessHours {
  start: string; // "09:00"
  end: string;   // "21:00"
}

export interface AutoReply {
  enabled: boolean;
  message: string;
  businessHours: BusinessHours;
}

```

---

## src\constants\colors.ts

```typescript
/**
 * 브랜드 컬러 상수
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

/**
 * 브랜드 메인 컬러
 */
export const BRAND_COLORS = {
  primary: '#D61C1C',      // 현풍레드
  secondary: '#F37021',    // 신칼오렌지
  accent: '#C7A45A',       // 황동식기색
  
  // 그레이스케일
  black: '#1A1A1A',
  darkGray: '#4A4A4A',
  gray: '#8B7355',
  lightGray: '#D4C5B9',
  background: '#F8F6F3',
  white: '#FFFFFF',
} as const;

/**
 * 상태 컬러
 */
export const STATUS_COLORS = {
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

/**
 * 주문 상태별 컬러
 */
export const ORDER_STATUS_COLORS = {
  pending: '#F59E0B',      // 주황
  accepted: '#3B82F6',     // 파랑
  preparing: '#8B5CF6',    // 보라
  ready: '#06B6D4',        // 청록
  delivering: '#10B981',   // 녹색
  completed: '#22C55E',    // 연녹
  canceled: '#EF4444',     // 빨강
} as const;

/**
 * 배달 상태별 컬러
 */
export const DELIVERY_STATUS_COLORS = {
  pending: '#F59E0B',
  assigned: '#3B82F6',
  pickupReady: '#8B5CF6',
  pickedUp: '#06B6D4',
  delivering: '#10B981',
  delivered: '#22C55E',
  failed: '#EF4444',
} as const;

/**
 * 차트 컬러 팔레트
 */
export const CHART_COLORS = [
  '#D61C1C',  // 현풍레드
  '#F37021',  // 신칼오렌지
  '#C7A45A',  // 황동식기색
  '#8B5CF6',  // 보라
  '#10B981',  // 녹색
  '#3B82F6',  // 파랑
  '#F59E0B',  // 주황
  '#EF4444',  // 빨강
] as const;

```

---

## src\constants\design-tokens.ts

```typescript
/**
 * 🔒 디자인 토큰 TypeScript 정의
 * 
 * 이 파일은 디자인 시스템을 TypeScript 레벨에서 강제합니다.
 * - 타입 안전성 보장
 * - 잘못된 값 사용 방지
 * - 자동완성 지원
 * 
 * ⚠️ 주의: 이 파일의 값을 변경하지 마세요!
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

/* ============================================
   브랜드 컬러 (절대 변경 금지)
   ============================================ */

export const BRAND_COLORS = {
  hyunpungRed: '#D61C1C',
  shinkalOrange: '#F37021',
  darkBrown: '#2E1C10',
  creamBg: '#F9F6F3',
  brassGold: '#C7A45A',
} as const;

export type BrandColor = typeof BRAND_COLORS[keyof typeof BRAND_COLORS];

/* ============================================
   시맨틱 컬러 매핑
   ============================================ */

export const SEMANTIC_COLORS = {
  primary: BRAND_COLORS.hyunpungRed,
  primaryHover: '#b71616',
  primaryLight: 'rgba(214, 28, 28, 0.1)',
  
  secondary: BRAND_COLORS.shinkalOrange,
  secondaryHover: '#d45e1a',
  secondaryLight: 'rgba(243, 112, 33, 0.1)',
  
  accent: BRAND_COLORS.brassGold,
  accentHover: '#b08f4a',
  accentLight: 'rgba(199, 164, 90, 0.1)',
  
  textPrimary: BRAND_COLORS.darkBrown,
  textSecondary: '#5a5a68',
  textWhite: '#ffffff',
  
  background: '#ffffff',
  backgroundMuted: BRAND_COLORS.creamBg,
  foreground: BRAND_COLORS.darkBrown,
} as const;

export type SemanticColor = typeof SEMANTIC_COLORS[keyof typeof SEMANTIC_COLORS];

/* ============================================
   타이포그래피 토큰
   ============================================ */

export const FONT_FAMILY = {
  sans: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Segoe UI', 'Malgun Gothic', 'Noto Sans KR', sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
} as const;

export const FONT_SIZES = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem',// 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
} as const;

export type FontSize = typeof FONT_SIZES[keyof typeof FONT_SIZES];

export const FONT_WEIGHTS = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export type FontWeight = typeof FONT_WEIGHTS[keyof typeof FONT_WEIGHTS];

export const LINE_HEIGHTS = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
} as const;

export type LineHeight = typeof LINE_HEIGHTS[keyof typeof LINE_HEIGHTS];

/* ============================================
   Border Radius 토큰
   ============================================ */

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  full: '9999px',
} as const;

export type BorderRadius = typeof BORDER_RADIUS[keyof typeof BORDER_RADIUS];

/* ============================================
   Shadow 토큰
   ============================================ */

export const SHADOWS = {
  soft1: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  soft2: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  soft3: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  medium: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
  large: '0 20px 40px -10px rgba(0, 0, 0, 0.2)',
} as const;

export type Shadow = typeof SHADOWS[keyof typeof SHADOWS];

/* ============================================
   Spacing 토큰
   ============================================ */

export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const;

export type Spacing = typeof SPACING[keyof typeof SPACING];

/* ============================================
   Z-Index 토큰
   ============================================ */

export const Z_INDEX = {
  base: 0,
  dropdown: 50,
  sticky: 100,
  fixed: 200,
  modalBackdrop: 900,
  modal: 1000,
  popover: 1050,
  toast: 1100,
  tooltip: 1200,
} as const;

export type ZIndex = typeof Z_INDEX[keyof typeof Z_INDEX];

/* ============================================
   Breakpoint 토큰
   ============================================ */

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type Breakpoint = typeof BREAKPOINTS[keyof typeof BREAKPOINTS];

/* ============================================
   Duration 토큰
   ============================================ */

export const DURATIONS = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const;

export type Duration = typeof DURATIONS[keyof typeof DURATIONS];

/* ============================================
   Easing 토큰
   ============================================ */

export const EASINGS = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export type Easing = typeof EASINGS[keyof typeof EASINGS];

/* ============================================
   유틸리티 함수
   ============================================ */

/**
 * CSS 변수로 컬러 사용
 */
export const cssVar = (token: string): string => `var(--${token})`;

/**
 * 브랜드 컬러를 CSS 변수로 변환
 */
export const brandColor = (color: keyof typeof BRAND_COLORS): string => {
  const mapping: Record<keyof typeof BRAND_COLORS, string> = {
    hyunpungRed: 'color-hyunpung-red',
    shinkalOrange: 'color-shinkal-orange',
    darkBrown: 'color-dark-brown',
    creamBg: 'color-cream-bg',
    brassGold: 'color-brass-gold',
  };
  return cssVar(mapping[color]);
};

/**
 * 시맨틱 컬러를 CSS 변수로 변환
 */
export const semanticColor = (color: keyof typeof SEMANTIC_COLORS): string => {
  const mapping: Record<keyof typeof SEMANTIC_COLORS, string> = {
    primary: 'color-primary',
    primaryHover: 'color-primary-hover',
    primaryLight: 'color-primary-light',
    secondary: 'color-secondary',
    secondaryHover: 'color-secondary-hover',
    secondaryLight: 'color-secondary-light',
    accent: 'color-accent',
    accentHover: 'color-accent-hover',
    accentLight: 'color-accent-light',
    textPrimary: 'color-text-primary',
    textSecondary: 'color-text-secondary',
    textWhite: 'color-text-white',
    background: 'background',
    backgroundMuted: 'muted',
    foreground: 'foreground',
  };
  return cssVar(mapping[color]);
};

/**
 * 타입 안전한 스타일 객체 생성
 */
export const createStyle = <T extends React.CSSProperties>(style: T): T => style;

/**
 * 디자인 토큰 검증
 */
export const validateDesignToken = (category: string, value: string): boolean => {
  const categories = {
    color: Object.values(BRAND_COLORS),
    fontSize: Object.values(FONT_SIZES),
    fontWeight: Object.values(FONT_WEIGHTS),
    spacing: Object.values(SPACING),
    borderRadius: Object.values(BORDER_RADIUS),
  };
  
  return categories[category as keyof typeof categories]?.includes(value as any) ?? false;
};

/* ============================================
   전체 디자인 토큰 Export
   ============================================ */

export const DESIGN_TOKENS = {
  brand: BRAND_COLORS,
  semantic: SEMANTIC_COLORS,
  fontFamily: FONT_FAMILY,
  fontSize: FONT_SIZES,
  fontWeight: FONT_WEIGHTS,
  lineHeight: LINE_HEIGHTS,
  borderRadius: BORDER_RADIUS,
  shadow: SHADOWS,
  spacing: SPACING,
  zIndex: Z_INDEX,
  breakpoint: BREAKPOINTS,
  duration: DURATIONS,
  easing: EASINGS,
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;

/* ============================================
   타입 가드
   ============================================ */

export const isBrandColor = (value: string): value is BrandColor => {
  return Object.values(BRAND_COLORS).includes(value as BrandColor);
};

export const isSemanticColor = (value: string): value is SemanticColor => {
  return Object.values(SEMANTIC_COLORS).includes(value as SemanticColor);
};

export const isFontSize = (value: string): value is FontSize => {
  return Object.values(FONT_SIZES).includes(value as FontSize);
};

export const isFontWeight = (value: number): value is FontWeight => {
  return Object.values(FONT_WEIGHTS).includes(value as FontWeight);
};

/* ============================================
   상수 Export (기존 호환성)
   ============================================ */

export {
  BRAND_COLORS as COLORS,
  SEMANTIC_COLORS as THEME_COLORS,
  FONT_SIZES as TYPOGRAPHY_SIZES,
  SPACING as SPACE,
  Z_INDEX as ZINDEX,
};

```

---

## src\constants\index.ts

```typescript
/**
 * 상수 통합 Export
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

// 레이블
export * from './labels';

// 상태
export * from './status';

// 컬러
export * from './colors';

// 유효성 검증
export * from './validation';

```

---

## src\constants\labels.ts

```typescript
/**
 * 레이블 상수
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

/**
 * 쿠폰 타입 레이블
 */
export const COUPON_TYPE_LABELS = {
  amount: '금액할인',
  percent: '퍼센트할인',
  freeDelivery: '무료배달',
  freeItem: '무료증정',
} as const;

/**
 * 주문 상태 레이블
 */
export const ORDER_STATUS_LABELS = {
  pending: '주문 대기',
  accepted: '접수 확인',
  preparing: '조리 중',
  ready: '배달 준비',
  delivering: '배달 중',
  completed: '배달 완료',
  canceled: '주문 취소',
} as const;

/**
 * 결제 상태 레이블
 */
export const PAYMENT_STATUS_LABELS = {
  pending: '결제 대기',
  completed: '결제 완료',
  failed: '결제 실패',
  canceled: '결제 취소',
  refunded: '환불 완료',
} as const;

/**
 * 배달 상태 레이블
 */
export const DELIVERY_STATUS_LABELS = {
  pending: '배달 대기',
  assigned: '배달원 배정',
  pickupReady: '픽업 준비',
  pickedUp: '픽업 완료',
  delivering: '배달 중',
  delivered: '배달 완료',
  failed: '배달 실패',
} as const;

/**
 * 리뷰 상태 레이블
 */
export const REVIEW_STATUS_LABELS = {
  pending: '대기',
  approved: '승인',
  rejected: '거부',
  reported: '신고됨',
} as const;

/**
 * 쿠폰 상태 레이블
 */
export const COUPON_STATUS_LABELS = {
  active: '사용 가능',
  used: '사용 완료',
  expired: '기간 만료',
  disabled: '사용 불가',
} as const;

/**
 * 포인트 타입 레이블
 */
export const POINT_TYPE_LABELS = {
  earn: '적립',
  use: '사용',
  refund: '환불',
  expire: '소멸',
  admin: '관리자 지급',
} as const;

/**
 * 알림 타입 레이블
 */
export const NOTIFICATION_TYPE_LABELS = {
  order: '주문',
  delivery: '배달',
  payment: '결제',
  review: '리뷰',
  promotion: '프로모션',
  system: '시스템',
} as const;

/**
 * 고객지원 상태 레이블
 */
export const SUPPORT_STATUS_LABELS = {
  open: '문의 접수',
  inProgress: '답변 중',
  resolved: '해결 완료',
  closed: '종료',
} as const;

/**
 * 고객지원 카테고리 레이블
 */
export const SUPPORT_CATEGORY_LABELS = {
  order: '주문 문의',
  delivery: '배달 문의',
  payment: '결제 문의',
  menu: '메뉴 문의',
  refund: '환불 문의',
  etc: '기타 문의',
} as const;

/**
 * 요일 레이블
 */
export const DAY_LABELS = {
  mon: '월',
  tue: '화',
  wed: '수',
  thu: '목',
  fri: '금',
  sat: '토',
  sun: '일',
} as const;

/**
 * 메뉴 카테고리 레이블
 */
export const MENU_CATEGORY_LABELS = {
  signature: '시그니처',
  kalguksu: '칼국수',
  side: '사이드',
  beverage: '음료',
} as const;

```

---

## src\constants\status.ts

```typescript
/**
 * 상태 상수
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

/**
 * 주문 상태
 */
export const ORDER_STATUSES = [
  'pending',
  'accepted',
  'preparing',
  'ready',
  'delivering',
  'completed',
  'canceled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/**
 * 결제 상태
 */
export const PAYMENT_STATUSES = [
  'pending',
  'completed',
  'failed',
  'canceled',
  'refunded',
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

/**
 * 배달 상태
 */
export const DELIVERY_STATUSES = [
  'pending',
  'assigned',
  'pickupReady',
  'pickedUp',
  'delivering',
  'delivered',
  'failed',
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

/**
 * 리뷰 상태
 */
export const REVIEW_STATUSES = [
  'pending',
  'approved',
  'rejected',
  'reported',
] as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

/**
 * 쿠폰 상태
 */
export const COUPON_STATUSES = [
  'active',
  'used',
  'expired',
  'disabled',
] as const;

export type CouponStatus = (typeof COUPON_STATUSES)[number];

/**
 * 고객지원 상태
 */
export const SUPPORT_STATUSES = [
  'open',
  'inProgress',
  'resolved',
  'closed',
] as const;

export type SupportStatus = (typeof SUPPORT_STATUSES)[number];

```

---

## src\constants\validation.ts

```typescript
/**
 * 유효성 검증 상수
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

/**
 * 주문 관련 제한
 */
export const ORDER_LIMITS = {
  MIN_AMOUNT: 10000,        // 최소 주문 금액
  MIN_AMOUNT_DELIVERY: 15000, // 배달 최소 주문 금액
  MIN_AMOUNT_PICKUP: 5000,    // 픽업 최소 주문 금액
  MAX_AMOUNT: 500000,       // 최대 주문 금액
  MIN_DELIVERY_TIME: 30,    // 최소 배달 시간 (분)
  MAX_DELIVERY_TIME: 90,    // 최대 배달 시간 (분)
} as const;

/**
 * 포인트 관련 제한
 */
export const POINT_LIMITS = {
  MIN_USE: 1000,            // 최소 사용 포인트
  MAX_USE_RATE: 0.5,        // 최대 사용 비율 (50%)
  EARN_RATE: 0.03,          // 적립률 (3%)
  EXPIRE_DAYS: 365,         // 유효기간 (일)
} as const;

/**
 * 리뷰 관련 제한
 */
export const REVIEW_LIMITS = {
  MIN_LENGTH: 10,           // 최소 글자 수
  MAX_LENGTH: 500,          // 최대 글자 수
  MAX_IMAGES: 5,            // 최대 이미지 수
  MIN_RATING: 1,            // 최소 별점
  MAX_RATING: 5,            // 최대 별점
} as const;

/**
 * 쿠폰 관련 제한
 */
export const COUPON_LIMITS = {
  CODE_MIN_LENGTH: 6,       // 쿠폰 코드 최소 길이
  CODE_MAX_LENGTH: 12,      // 쿠폰 코드 최대 길이
  MAX_DISCOUNT_RATE: 0.5,   // 최대 할인율 (50%)
  MAX_DISCOUNT_AMOUNT: 50000, // 최대 할인 금액
} as const;

/**
 * 배달 관련 제한
 */
export const DELIVERY_LIMITS = {
  MAX_DISTANCE: 5000,       // 최대 배달 거리 (m)
  BASE_DISTANCE: 3000,      // 기본 배달 거리 (m)
  BASE_FEE: 3000,           // 기본 배달비
  EXTRA_FEE_PER_KM: 1000,   // km당 추가 배달비
  NIGHT_FEE: 2000,          // 야간 할증
} as const;

/**
 * 영업 시간
 */
export const BUSINESS_HOURS = {
  OPEN: '10:00',
  CLOSE: '21:00',
  BREAK_START: '15:00',
  BREAK_END: '17:00',
  NIGHT_START: '22:00',
  NIGHT_END: '06:00',
} as const;

/**
 * 정규식 패턴
 */
export const REGEX_PATTERNS = {
  PHONE: /^010-\d{4}-\d{4}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  BUSINESS_NUMBER: /^\d{3}-\d{2}-\d{5}$/,
  COUPON_CODE: /^[A-Z0-9]{6,12}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const;

/**
 * 파일 업로드 제한
 */
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024,  // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 5,
} as const;

/**
 * 페이지네이션 기본값
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/**
 * 캐시 시간 (초)
 */
export const CACHE_DURATION = {
  SHORT: 60,          // 1분
  MEDIUM: 300,        // 5분
  LONG: 3600,         // 1시간
  DAY: 86400,         // 24시간
} as const;

```

---
