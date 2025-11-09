# Phase 0-1: 프로젝트 정의 및 요구사항

## 🎯 목표

현풍닭칼국수 브랜드를 위한 **PWA 배달앱 시스템**의 전체 요구사항을 정의하고, 프로젝트 구조를 명확히 합니다.

---

## 📋 PRD (Product Requirements Document)

### 1. 프로젝트 개요

#### 1.1 비즈니스 배경
- **브랜드**: 현풍닭칼국수
- **업종**: 닭칼국수 전문 음식점
- **목표**: 자체 배달 주문 시스템 구축 (배달앱 수수료 절감)
- **고객 접점**: QR 코드 → PWA 설치 → 직접 주문

#### 1.2 개발사 정보
```
회사명: KS컴퍼니
사업자번호: 553-17-00098
대표: 석경선 / 배종수 (공동대표)
```

#### 1.3 기술 스택
```typescript
// Frontend
React 18 + TypeScript
Tailwind CSS v4
shadcn/ui
Vite

// Backend
Firebase (Firestore, Functions, Auth, FCM, Storage)

// Payment
NICEPAY 결제 연동

// Delivery
배달 대행사 API (Provider A)

// Testing
Playwright (E2E)
```

---

### 2. 시스템 구성

#### 2.1 주문자 PWA 앱
```
경로: /app/*
용도: 고객이 사용하는 모바일 웹앱
```

**핵심 플로우:**
```
1. QR 코드 스캔 → 웹사이트 접속
2. A2HS (Add to Home Screen) 프롬프트
3. PWA 설치 → 앱처럼 사용
4. 메뉴 선택 → 옵션 선택
5. 장바구니 → 주문서 작성
6. NICEPAY 결제
7. 실시간 주문 추적 (배달 대행사 연동)
8. 수령 완료 → 리뷰 작성
9. 포인트 적립 및 쿠폰 사용
```

**주요 기능:**
- 메뉴 조회 (카테고리별, 검색)
- 옵션 선택 (필수/선택, 단일/다중)
- 장바구니 관리
- 배송지 입력 (카카오맵 연동)
- 결제 (NICEPAY)
- 주문 추적 (실시간 위치, 예상 도착 시간)
- 주문 히스토리
- 리뷰 작성 및 조회
- 포인트 조회 및 사용
- 쿠폰 조회 및 사용
- 고객 지원 (실시간 채팅)
- 알림 설정 (FCM)
- 로그인/회원가입 (이메일, 소셜)

#### 2.2 가게 관리자 대시보드
```
경로: /admin/*
용도: 가게 주인이 사용하는 관리 시스템
```

**핵심 플로우:**
```
1. 관리자 로그인
2. 실시간 주문 알림 (FCM + 사운드)
3. 주문 접수/거부/완료 처리
4. 배달 대행사 호출
5. 배달 실시간 추적 (관제 화면)
6. 메뉴 관리 (CRUD, CSV 임포트)
7. 리뷰 관리 (답글, 신고)
8. 통계 분석 (매출, 주문, 고객)
9. 설정 (영업시간, 배달비, FCM, 결제)
```

**주요 기능:**
- 실시간 주문 대시보드
- 주문 관리 (접수, 조리중, 배달중, 완료)
- 프린트 영수증 출력
- 메뉴 관리 (카테고리, 옵션 그룹)
- CSV 대량 임포트
- 리뷰 관리 (답글, 신고 처리)
- 프로모션 관리 (할인, 쿠폰 발행)
- 통합 분석 대시보드
- 배달 관제 시스템
- 고객 지원 채팅 응답
- 포인트 관리
- 설정 센터 (결제, 배달, FCM, 지도, 운영)

#### 2.3 Firebase 백엔드

**Firestore Collections:**
```
- users (고객 정보)
- orders (주문 정보)
- menus (메뉴 정보)
- reviews (리뷰 정보)
- coupons (쿠폰 정보)
- points (포인트 이력)
- support (고객 지원 티켓)
- settings (시스템 설정)
```

**Functions:**
```typescript
// 주문 처리
- createOrder (주문 생성)
- updateOrderStatus (상태 업데이트)
- sendOrderNotification (FCM 푸시)

// 결제
- verifyPayment (NICEPAY 검증)
- processRefund (환불 처리)

// 배달
- callDelivery (배달 대행사 호출)
- webhookDelivery (배달 상태 업데이트)

// 포인트/쿠폰
- earnPoints (포인트 적립)
- useCoupon (쿠폰 사용)

// 리뷰
- createReview (리뷰 작성)
- reportReview (신고 처리)
```

---

### 3. 브랜드 아이덴티티

#### 3.1 컬러 시스템
```css
/* Primary Colors */
--hyunpung-red: #D61C1C;      /* 현풍레드 - 메인 브랜드 */
--sinkal-orange: #F37021;      /* 신칼오렌지 - 보조 */
--brass-bowl: #C7A45A;         /* 황동식기색 - 포인트 */

/* Semantic Colors */
--success: #10b981;            /* 성공, 완료 */
--warning: #f59e0b;            /* 경고, 대기 */
--error: #ef4444;              /* 에러, 취소 */
--info: #3b82f6;               /* 정보, 안내 */
```

#### 3.2 타이포그래피
```css
/* Font Family */
font-family: 'Pretendard', -apple-system, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
```

#### 3.3 아이콘 시스템
```typescript
// lucide-react 사용
import { 
  ShoppingCart,   // 장바구니
  Receipt,        // 주문
  Star,           // 리뷰
  Gift,           // 쿠폰
  Coins,          // 포인트
  Truck,          // 배달
  MessageCircle,  // 지원
  Bell,           // 알림
} from 'lucide-react';

// 커스텀 아이콘 (SVG)
- BowlIcon (그릇)
- ChickenIcon (닭)
- NoodleIcon (국수)
- ChiliIcon (고추)
- SteamIcon (김)
```

---

### 4. 핵심 비즈니스 로직

#### 4.1 주문 상태 관리
```typescript
enum OrderStatus {
  PENDING = 'pending',           // 결제 대기
  PAID = 'paid',                // 결제 완료 (가게 확인 대기)
  CONFIRMED = 'confirmed',      // 가게 접수
  PREPARING = 'preparing',      // 조리 중
  READY = 'ready',              // 조리 완료 (픽업 대기)
  DELIVERING = 'delivering',    // 배달 중
  DELIVERED = 'delivered',      // 배달 완료
  COMPLETED = 'completed',      // 수령 확인
  CANCELLED = 'cancelled',      // 취소
  REFUNDED = 'refunded',        // 환불
}
```

#### 4.2 배달비 계산
```typescript
interface DeliveryFeeRules {
  baseDistance: number;        // 기본 거리 (2km)
  baseFee: number;            // 기본 배달비 (3,000원)
  extraPerKm: number;         // km당 추가비 (500원)
  freeOrderMin: number;       // 무료 배달 최소 주문금액 (30,000원)
  minOrderAmount: number;     // 최소 주문 금액 (12,000원)
  maxDistance: number;        // 최대 배달 거리 (5km)
}
```

#### 4.3 포인트 적립
```typescript
interface PointsRules {
  earnRate: number;           // 적립률 (3%)
  minUse: number;             // 최소 사용 포인트 (1,000원)
  expireDays: number;         // 유효 기간 (365일)
  maxUsePercent: number;      // 최대 사용 비율 (50%)
}
```

#### 4.4 쿠폰 시스템
```typescript
enum CouponType {
  FIXED = 'fixed',            // 정액 할인
  PERCENT = 'percent',        // 정률 할인
  DELIVERY_FREE = 'delivery_free', // 배달비 무료
}

interface Coupon {
  code: string;               // 쿠폰 코드
  type: CouponType;
  discount: number;           // 할인 금액 또는 비율
  minOrderAmount: number;     // 최소 주문 금액
  maxDiscount?: number;       // 최대 할인 금액 (정률일 때)
  expiresAt: Date;           // 유효 기간
}
```

---

### 5. 보안 요구사항

#### 5.1 API 키 관리
```typescript
// ❌ 절대 금지: 클라이언트에 비밀키 노출
const NICEPAY_SECRET_KEY = "sk_live_xxxxx";

// ✅ 필수: Functions Config 사용
// Firebase Functions에서만 접근 가능
functions.config().nicepay.secret_key
```

#### 5.2 Firebase Rules
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 주문: 본인만 읽기, 생성은 모두, 수정은 관리자만
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.userId || isAdmin();
      allow create: if request.auth != null;
      allow update: if isAdmin();
    }
    
    // 사용자 정보: 본인만 읽기/쓰기
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // 메뉴: 모두 읽기, 관리자만 쓰기
    match /menus/{menuId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

#### 5.3 HTTPS 필수
```typescript
// Cloud Functions는 모두 HTTPS
export const createOrder = functions.https.onCall(async (data, context) => {
  // 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '로그인이 필요합니다.');
  }
  
  // 로직 처리
});
```

---

### 6. 성능 요구사항

#### 6.1 로딩 시간
- 초기 로딩: < 3초
- 페이지 전환: < 1초
- API 응답: < 2초

#### 6.2 PWA 요구사항
- Lighthouse Score: 90+ (Performance, Accessibility, Best Practices, SEO)
- Service Worker 등록
- Offline Fallback 페이지
- 앱 매니페스트 (manifest.json)
- 아이콘 (192x192, 512x512)

#### 6.3 최적화
```typescript
// 이미지 최적화
- WebP 포맷 사용
- Lazy Loading
- CDN 활용 (Firebase Storage)

// 코드 최적화
- Code Splitting (React.lazy)
- Tree Shaking
- Minification

// 캐싱
- Service Worker 캐싱
- Firestore 오프라인 모드
```

---

### 7. 접근성 요구사항

#### 7.1 WCAG 2.1 AA 준수
- 키보드 네비게이션 지원
- 스크린 리더 지원 (ARIA)
- 명도 대비 4.5:1 이상
- 포커스 인디케이터
- 의미론적 HTML

#### 7.2 반응형 디자인
```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

---

## 💬 프롬프트

**아래 프롬프트를 AI에게 그대로 입력하세요:**

```
현풍닭칼국수 PWA 배달앱 프로젝트를 시작합니다.

## 프로젝트 정보
- 브랜드: 현풍닭칼국수 (닭칼국수 전문점)
- 개발사: KS컴퍼니 (사업자번호: 553-17-00098, 대표: 석경선/배종수)
- 목표: QR 스캔 → PWA 설치 → 주문 → 결제 → 배달 추적 전체 플로우 구현

## 시스템 구성
1. 주문자 PWA 앱 (/app/*)
2. 가게 관리자 대시보드 (/admin/*)
3. Firebase 백엔드 (Firestore, Functions, Auth, FCM)
4. NICEPAY 결제 연동
5. 배달 대행사 API 연동

## 브랜드 컬러
- 현풍레드: #D61C1C (Primary)
- 신칼오렌지: #F37021 (Secondary)
- 황동식기색: #C7A45A (Accent)

## 기술 스택
- React 18 + TypeScript
- Tailwind CSS v4
- shadcn/ui
- Vite
- Firebase
- Playwright (E2E Testing)

## 핵심 원칙
1. ✅ 100% 구현 (플레이스홀더 금지)
2. ✅ 보안 (비밀키는 Functions Config에만)
3. ✅ 개발사 정보 모든 곳에 삽입
4. ✅ 브랜드 컬러 일관성
5. ✅ 접근성 WCAG 2.1 AA 준수

이 프로젝트의 전체 구조와 요구사항을 이해했다고 확인해주세요.
다음 단계에서 디자인 시스템 구축을 시작합니다.
```

---

## ✅ 검증 체크리스트

- [ ] 프로젝트 목표와 범위를 명확히 이해했는가?
- [ ] 브랜드 아이덴티티 (컬러, 타이포, 아이콘)를 숙지했는가?
- [ ] 기술 스택 선정 이유를 이해했는가?
- [ ] 주문자 앱과 관리자 대시보드의 차이를 알고 있는가?
- [ ] Firebase 백엔드 구조를 이해했는가?
- [ ] 보안 요구사항 (API 키 관리)을 숙지했는가?
- [ ] 성능 및 접근성 기준을 알고 있는가?

---

## 📌 다음 단계

**02-design-system.md** - 디자인 시스템 및 토큰 구축

---

**작성일**: 2025-10-31  
**작성자**: 현풍닭칼국수 개발팀  
**개발사**: KS컴퍼니
