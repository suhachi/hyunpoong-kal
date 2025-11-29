# Mock 데이터 위치 보고서

**작성일**: 2025-01-28  
**프로젝트**: 현풍닭칼국수 v0.9.0  
**목적**: 프로젝트 내 모든 Mock 데이터 위치 및 구조 파악

---

## 📋 목차

1. [개요](#개요)
2. [Mock 데이터 파일 목록](#mock-데이터-파일-목록)
3. [상세 위치 및 구조](#상세-위치-및-구조)
4. [localStorage 저장 Mock 데이터](#localstorage-저장-mock-데이터)
5. [Mock 모드 전환 방법](#mock-모드-전환-방법)

---

## 1. 개요

현재 프로젝트는 **USE_FIREBASE=false** 모드로 동작하며, 모든 데이터는 Mock 데이터를 사용합니다. Mock 데이터는 크게 두 가지 형태로 저장됩니다:

1. **정적 JSON 파일**: 초기 데이터 소스
2. **인라인 Mock 배열**: 각 API 파일 내부에 정의
3. **localStorage**: 런타임 변경사항 저장

---

## 2. Mock 데이터 파일 목록

### 2.1 정적 JSON 파일

| 파일 경로 | 용도 | 데이터 타입 |
|----------|------|------------|
| `src/data/menus.json` | 메뉴 초기 데이터 | Menu[] |

### 2.2 API 파일 내 Mock 데이터

| 파일 경로 | Mock 데이터 변수명 | 용도 |
|----------|------------------|------|
| `src/lib/admin/menus.api.ts` | `mockMenus`, `mockMenuLogs` | 메뉴 관리 |
| `src/lib/admin/orders.api.ts` | `mockOrders`, `mockLogs` | 주문 관리 |
| `src/lib/admin/notices.api.ts` | `mockNotices` | 공지사항 관리 |
| `src/lib/admin/reviews.api.ts` | `MOCK_REVIEWS` | 리뷰 관리 |
| `src/lib/coupons.api.ts` | `mockCoupons` | 쿠폰 관리 |
| `src/contexts/AuthContext.tsx` | `MOCK_USERS` | 인증 사용자 |

### 2.3 설정 파일

| 파일 경로 | Mock 설정 위치 |
|----------|---------------|
| `src/config/env.ts` | `USE_FIREBASE = false` |
| `src/lib/admin/menus.api.ts` | `const USE_FIREBASE = false;` |
| `src/lib/admin/notices.api.ts` | `const USE_FIREBASE = false;` |
| `src/lib/admin/reviews.api.ts` | `const USE_FIREBASE = false;` |
| `src/lib/admin/optionGroups.api.ts` | `const USE_FIREBASE = false;` |
| `src/lib/admin/settings.api.ts` | `const USE_FIREBASE = false;` |
| `src/lib/admin/analytics.api.ts` | `const USE_FIREBASE = false;` |

---

## 3. 상세 위치 및 구조

### 3.1 메뉴 데이터 (`src/lib/admin/menus.api.ts`)

**위치**: `src/lib/admin/menus.api.ts` (12-44줄)

```typescript
// Mock 데이터 (menus.json 기반)
const STORAGE_KEY = 'hyunpoong_mock_menus';
let mockMenus: Menu[] = getStoredMenus(); // localStorage에서 로드
let mockMenuLogs: MenuLog[] = [];
```

**초기 데이터 소스**: `src/data/menus.json`
- 18개 메뉴 항목
- 카테고리: noodle, set, side, drink, alcohol
- 옵션, 배지, 알레르기 정보 포함

**localStorage 저장**: 
- 키: `hyunpoong_mock_menus`
- 저장 시점: `updateMenu`, `createMenu`, `deleteMenu`, `toggleMenuAvailability`, `updateMenuAvailableHours` 호출 시

---

### 3.2 주문 데이터 (`src/lib/admin/orders.api.ts`)

**위치**: `src/lib/admin/orders.api.ts` (14-238줄)

```typescript
const mockOrders: Order[] = [
  {
    orderId: 'ORD-20250128-001',
    userId: 'user-001',
    // ... 주문 상세 정보
  },
  // ... 더 많은 주문 데이터
];

const mockLogs: OrderLog[] = [
  // ... 주문 로그 데이터
];
```

**데이터 수**: 약 10개 이상의 샘플 주문

---

### 3.3 공지사항 데이터 (`src/lib/admin/notices.api.ts`)

**위치**: `src/lib/admin/notices.api.ts` (11-25줄)

```typescript
let mockNotices: Notice[] = [
  {
    id: 'notice-001',
    title: '사진 리뷰 쓰고 3,000원 쿠폰 받으세요!',
    type: 'event',
    isActive: true,
    // ... 기타 필드
  },
  // ... 더 많은 공지사항
];
```

**데이터 수**: 3개 (notice, event, promotion)

---

### 3.4 리뷰 데이터 (`src/lib/admin/reviews.api.ts`)

**위치**: `src/lib/admin/reviews.api.ts` (12-100줄)

```typescript
const MOCK_REVIEWS: Review[] = [
  {
    id: 'review-001',
    rating: 5,
    text: '진짜 맛있어요! ...',
    photos: [...],
    // ... 기타 필드
  },
  // ... 더 많은 리뷰
];
```

**데이터 수**: 약 10개 이상의 샘플 리뷰

---

### 3.5 쿠폰 데이터 (`src/lib/coupons.api.ts`)

**위치**: `src/lib/coupons.api.ts` (10-80줄)

```typescript
let mockCoupons: Coupon[] = [
  {
    id: 'coupon-001',
    type: 'photo_review',
    amount: 3000,
    // ... 기타 필드
  },
  // ... 더 많은 쿠폰
];
```

**데이터 수**: 약 4-5개 샘플 쿠폰

---

### 3.6 인증 사용자 데이터 (`src/contexts/AuthContext.tsx`)

**위치**: `src/contexts/AuthContext.tsx` (47-62줄)

```typescript
const MOCK_USERS = {
  'admin@hyunpoongkalguksu.com': {
    uid: 'admin-001',
    email: 'admin@hyunpoongkalguksu.com',
    displayName: '관리자',
    role: 'owner',
    storeId: 'store-hyunpung',
  },
  'customer@example.com': {
    uid: 'user-001',
    email: 'customer@example.com',
    displayName: '김고객',
    role: 'customer',
  },
};
```

**localStorage 저장**:
- 키: `mockUser`
- 저장 시점: 로그인, 회원가입, 프로필 업데이트 시

---

## 4. localStorage 저장 Mock 데이터

다음 Mock 데이터는 localStorage에 저장되어 새로고침해도 유지됩니다:

| localStorage 키 | 저장 위치 | 용도 |
|----------------|----------|------|
| `hyunpoong_mock_menus` | `src/lib/admin/menus.api.ts` | 메뉴 데이터 (수정/생성/삭제 반영) |
| `mockUser` | `src/contexts/AuthContext.tsx` | 현재 로그인한 사용자 정보 |
| `mockRole` | `src/pages/app/Home.tsx` | 사용자 역할 (owner, admin, customer) |

---

## 5. Mock 모드 전환 방법

### 5.1 전역 설정

**파일**: `src/config/env.ts`
```typescript
export const USE_FIREBASE = false; // Mock 모드
```

### 5.2 개별 API 파일 설정

각 API 파일 상단에 `USE_FIREBASE` 상수가 정의되어 있습니다:

```typescript
const USE_FIREBASE = false; // Mock 모드
```

**Firebase 연동 시 변경할 파일들**:
- `src/lib/admin/menus.api.ts`
- `src/lib/admin/orders.api.ts`
- `src/lib/admin/notices.api.ts`
- `src/lib/admin/reviews.api.ts`
- `src/lib/admin/optionGroups.api.ts`
- `src/lib/admin/settings.api.ts`
- `src/lib/admin/analytics.api.ts`
- `src/lib/coupons.api.ts`

### 5.3 환경 변수 설정

**파일**: `.env` 또는 `.env.production`
```bash
VITE_USE_FIREBASE=false  # Mock 모드
VITE_USE_FIREBASE=true   # Firebase 모드
```

---

## 6. Mock 데이터 초기화 방법

### 6.1 localStorage 초기화

브라우저 개발자 도구 콘솔에서:
```javascript
// 모든 Mock 데이터 삭제
localStorage.removeItem('hyunpoong_mock_menus');
localStorage.removeItem('mockUser');
localStorage.removeItem('mockRole');

// 또는 전체 초기화
localStorage.clear();
```

### 6.2 메뉴 데이터 초기화

`src/lib/admin/menus.api.ts`의 `getStoredMenus()` 함수는 localStorage에 데이터가 없으면 `menus.json`에서 초기 데이터를 로드합니다.

---

## 7. 주의사항

1. **localStorage 용량 제한**: 약 5-10MB (브라우저마다 다름)
   - Base64 이미지 저장 시 용량 증가 주의
   - 현재 메뉴 이미지는 Base64로 저장됨

2. **데이터 영구성**: 
   - localStorage는 브라우저별로 저장됨
   - 시크릿 모드에서는 세션 종료 시 삭제됨
   - 브라우저 데이터 삭제 시 모든 Mock 데이터 손실

3. **Firebase 전환 시**:
   - 모든 Mock 데이터를 Firestore로 마이그레이션 필요
   - localStorage 데이터는 수동으로 Firestore에 업로드 필요

---

## 8. 요약

| 항목 | 개수 | 저장 위치 |
|------|------|----------|
| 정적 JSON 파일 | 1개 | `src/data/menus.json` |
| API 파일 내 Mock 데이터 | 7개 | 각 `*.api.ts` 파일 |
| localStorage 저장 데이터 | 3개 | 브라우저 localStorage |
| Mock 모드 설정 파일 | 8개 | 각 API 파일 + `config/env.ts` |

**총 Mock 데이터 파일**: 약 16개 파일

---

**작성자**: AI Assistant  
**최종 수정일**: 2025-01-28

