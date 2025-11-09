# 🧠 Cursor AI - 현풍닭칼국수 PWA 프로젝트 완벽 이해 가이드

> **이 문서를 Cursor AI의 첫 번째 프롬프트로 제공하세요**  
> Cursor AI가 프로젝트를 완벽히 이해하고 실수 없이 작업할 수 있습니다.

---

## 📚 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [아키텍처 구조](#2-아키텍처-구조)
3. [핵심 규칙 (절대 위반 금지)](#3-핵심-규칙-절대-위반-금지)
4. [디렉토리 구조](#4-디렉토리-구조)
5. [타입 시스템](#5-타입-시스템)
6. [상태 관리](#6-상태-관리)
7. [라우팅 구조](#7-라우팅-구조)
8. [디자인 시스템](#8-디자인-시스템)
9. [Firebase 연동 포인트](#9-firebase-연동-포인트)
10. [코드 작성 규칙](#10-코드-작성-규칙)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 정보

```yaml
이름: 현풍닭칼국수 PWA 배달앱
버전: 1.0.0
개발사: KS컴퍼니
사업자번호: 553-17-00098
대표: 석경선/배종수(공동대표)

기술 스택:
  Frontend: React 18.2 + TypeScript
  Build: Vite 5.1
  Styling: Tailwind CSS v4.0
  UI: Shadcn UI
  Backend: Firebase (Firestore, Auth, Storage, Functions)
  Payment: NICEPAY
  State: Context API (AuthContext, CartContext)
  Router: React Router v6
```

### 1.2 프로젝트 목적

- **고객용 PWA 앱**: 메뉴 주문, 결제, 주문 추적, 리뷰
- **관리자 대시보드**: 주문 관리, 메뉴 관리, 통계, 설정
- **완전한 배달 주문 시스템**: QR → 설치 → 주문 → 결제 → 추적 → 리뷰

### 1.3 개발 완성도

```
✅ 프론트엔드: 99% (백엔드 연동만 필요)
✅ UI/UX: 100% (디자인 시스템 완성)
✅ 타입 시스템: 100% (모든 타입 정의 완료)
✅ 컴포넌트: 100% (60+ 컴포넌트)
⏳ Firebase 연동: 0% (Mock 데이터 사용 중)
⏳ 실제 API: 0% (NICEPAY, Google Maps 등)
```

---

## 2. 아키텍처 구조

### 2.1 레이어 구조

```
┌─────────────────────────────────────┐
│         Presentation Layer          │  ← pages/*, components/*
├─────────────────────────────────────┤
│         Business Logic Layer        │  ← hooks/*, contexts/*
├─────────────────────────────────────┤
│         Data Access Layer           │  ← lib/*.api.ts, lib/admin/*.api.ts
├─────────────────────────────────────┤
│         Integration Layer           │  ← lib/firebase.ts, lib/nicepay.ts
├─────────────────────────────────────┤
│         Backend (Firebase)          │  ← Firestore, Auth, Storage, Functions
└─────────────────────────────────────┘
```

### 2.2 데이터 흐름

```
사용자 액션
   ↓
페이지 컴포넌트 (pages/*)
   ↓
Context 또는 Hook (contexts/*, hooks/*)
   ↓
API 함수 (lib/*.api.ts)
   ↓
Firebase SDK (lib/firebase.ts)
   ↓
Firestore / Auth / Storage
```

---

## 3. 핵심 규칙 (절대 위반 금지!)

### 3.1 디자인 시스템 규칙

```typescript
// ❌ 절대 금지
<div className="text-xl font-bold bg-red-500">

// ✅ 올바른 방법
<div className="bg-primary">  // 브랜드 컬러 사용

// ❌ 절대 금지 - Tailwind 폰트 클래스
text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl
font-thin, font-light, font-normal, font-medium, font-semibold, font-bold
leading-tight, leading-normal, leading-relaxed

// ✅ globals.css에 이미 정의되어 있음
h1, h2, h3, h4, h5, h6, p, span { /* 모든 타이포그래피 정의됨 */ }
```

**이유**: `styles/globals.css`에 완벽한 타이포그래피 시스템이 구축되어 있음

### 3.2 브랜드 컬러 (필수 암기)

```css
/* 오직 이 3가지 색상만 사용! */
--color-primary: #D61C1C;      /* 현풍레드 */
--color-secondary: #F37021;    /* 신칼오렌지 */
--color-accent: #C7A45A;       /* 황동식기색 */

/* Tailwind 클래스 */
bg-primary, text-primary, border-primary
bg-secondary, text-secondary, border-secondary
bg-accent, text-accent, border-accent
```

### 3.3 TypeScript 규칙

```typescript
// ❌ 절대 금지
const data: any = ...
let result: any;

// ✅ 올바른 방법
import type { Order } from '../types/order';
const data: Order = ...

// ❌ 절대 금지 - Optional chaining 없이
const name = user.profile.name;

// ✅ 올바른 방법
const name = user?.profile?.name ?? 'Unknown';
```

### 3.4 Firebase 연동 규칙

```typescript
// ❌ 잘못된 방법 - 직접 import
import { getFirestore } from 'firebase/firestore';
const db = getFirestore();

// ✅ 올바른 방법 - 중앙화된 인스턴스 사용
import { db } from '../lib/firebase';
```

### 3.5 파일 수정 금지 목록

```
절대 수정 금지:
❌ /components/figma/ImageWithFallback.tsx
❌ /styles/globals.css (디자인 토큰)
❌ /components/ui/* (Shadcn UI)
❌ /types/* (타입 정의)
❌ /.env (Git에 커밋 금지)

주의해서 수정:
⚠️ /config/env.ts (환경변수 관리)
⚠️ /lib/firebase.ts (Firebase 초기화)
⚠️ /App.tsx (라우팅)
```

---

## 4. 디렉토리 구조

### 4.1 최상위 구조

```
/현풍닭칼국수-PWA/
├── components/          # 모든 React 컴포넌트
├── pages/              # 페이지 컴포넌트 (라우팅)
├── lib/                # API 함수, 유틸리티
├── types/              # TypeScript 타입 정의
├── contexts/           # React Context (전역 상태)
├── hooks/              # Custom Hooks
├── config/             # 환경 설정
├── constants/          # 상수
├── styles/             # CSS 파일
├── functions/          # Firebase Cloud Functions
├── public/             # 정적 파일
└── data/               # Mock 데이터
```

### 4.2 컴포넌트 구조

```
/components/
├── app/                # 고객 앱 전용 컴포넌트
│   ├── AppLayout.tsx       # 고객 앱 레이아웃
│   ├── AppHeader.tsx       # 상단 헤더
│   ├── BottomNav.tsx       # 하단 네비게이션
│   └── ...
├── admin/              # 관리자 전용 컴포넌트
│   ├── OrderTable.tsx      # 주문 테이블
│   ├── MenuTable.tsx       # 메뉴 테이블
│   ├── common/             # 관리자 공통 컴포넌트
│   └── ...
├── shared/             # 공통 컴포넌트
│   ├── EmptyState.tsx      # 빈 상태
│   ├── LoadingSkeleton.tsx # 로딩 스켈레톤
│   ├── OrderCard.tsx       # 주문 카드
│   └── ...
├── ui/                 # Shadcn UI (수정 금지)
├── figma/              # Figma 전용 (수정 금지)
└── icons/              # 커스텀 아이콘
```

### 4.3 페이지 구조

```
/pages/
├── app/                # 고객 앱 페이지
│   ├── Home.tsx            # 홈 (/)
│   ├── MenuList.tsx        # 메뉴 목록 (/menu)
│   ├── MenuDetail.tsx      # 메뉴 상세 (/menu/:id)
│   ├── Cart.tsx            # 장바구니 (/cart)
│   ├── Checkout.tsx        # 결제 (/checkout)
│   ├── OrderTracking.tsx   # 주문 추적 (/orders/:orderId)
│   ├── OrderHistory.tsx    # 주문 내역 (/order-history)
│   ├── ReviewWrite.tsx     # 리뷰 작성 (/review/:orderId)
│   ├── Login.tsx           # 로그인 (/login)
│   └── ...
├── admin/              # 관리자 페이지
│   ├── Dashboard.tsx       # 대시보드 (/admin)
│   ├── Orders.tsx          # 주문 관리 (/admin/orders)
│   ├── Menus.tsx           # 메뉴 관리 (/admin/menus)
│   ├── Reviews.tsx         # 리뷰 관리 (/admin/reviews)
│   ├── Settings/           # 설정 센터
│   │   ├── index.tsx           # 메인
│   │   ├── OperationsTab.tsx   # 운영 설정
│   │   ├── PaymentTab.tsx      # 결제 설정
│   │   └── ...
│   └── _layout/
│       └── AdminLayout.tsx # 관리자 레이아웃
└── DevTools.tsx        # 개발자 도구 (/dev) - 나중에 제거!
```

### 4.4 API 레이어

```
/lib/
├── firebase.ts         # Firebase 초기화 (중앙)
├── auth.ts             # 인증 API
├── orders.api.ts       # 고객용 주문 API
├── coupons.api.ts      # 쿠폰 API
├── nicepay.ts          # 결제 API
├── admin/              # 관리자 API
│   ├── orders.api.ts       # 관리자용 주문 API
│   ├── menus.api.ts        # 메뉴 관리 API
│   ├── reviews.api.ts      # 리뷰 관리 API
│   ├── settings.api.ts     # 설정 API
│   └── ...
├── delivery/           # 배달 대행사 API
│   ├── index.ts
│   ├── provider.ts
│   └── providers/
│       ├── mock.ts
│       └── providerA.ts
└── utils/              # 유틸리티
    ├── format.ts           # 포맷팅
    ├── date.ts             # 날짜
    ├── price.ts            # 가격
    └── ...
```

---

## 5. 타입 시스템

### 5.1 핵심 타입 위치

```
/types/
├── order.ts            # 주문 관련 (Order, OrderItem, OrderStatus)
├── menu.ts             # 메뉴 관련 (Menu, MenuOption, MenuCategory)
├── cart.ts             # 장바구니 (CartItem, Cart)
├── review.ts           # 리뷰 (Review, ReviewWithMenu)
├── coupon.ts           # 쿠폰 (Coupon, CouponType)
├── payment.ts          # 결제 (Payment, PaymentMethod)
├── delivery.ts         # 배달 (DeliveryInfo, DeliveryStatus)
├── settings.ts         # 설정 (StoreSettings, BusinessHours)
└── common.ts           # 공통 (Timestamp, WithId)
```

### 5.2 타입 사용 예시

```typescript
// ✅ 올바른 import
import type { Order, OrderStatus } from '../types/order';
import type { Menu } from '../types/menu';

// ✅ 함수 시그니처
export async function createOrder(
  userId: string,
  items: CartItem[]
): Promise<Order> {
  // ...
}

// ✅ 상태 타입
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
```

### 5.3 Firestore 타입 패턴

```typescript
// Firestore 문서 타입 (ID 없음)
export interface Order {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// UI에서 사용하는 타입 (ID 포함)
export interface OrderWithId extends Order {
  id: string;
}

// 또는 제네릭 사용
export type WithId<T> = T & { id: string };
```

---

## 6. 상태 관리

### 6.1 AuthContext

**위치**: `/contexts/AuthContext.tsx`

**역할**: 사용자 인증 상태 관리

```typescript
export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'admin' | 'owner';
  phone?: string;
}

// 사용법
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth();
  
  if (loading) return <LoadingSkeleton />;
  if (!user) return <Navigate to="/login" />;
  
  return <div>Welcome {user.displayName}</div>;
}
```

### 6.2 CartContext

**위치**: `/contexts/CartContext.tsx`

**역할**: 장바구니 상태 관리 (LocalStorage 연동)

```typescript
export interface CartItem {
  menuId: string;
  menuName: string;
  basePrice: number;
  quantity: number;
  options: CartItemOption[];
  subtotal: number;
}

// 사용법
import { useCart } from '../contexts/CartContext';

function Cart() {
  const { items, addItem, removeItem, clearCart, totalAmount } = useCart();
  
  return (
    <div>
      {items.map(item => <CartItemCard key={item.menuId} item={item} />)}
      <div>Total: {formatPrice(totalAmount)}</div>
    </div>
  );
}
```

---

## 7. 라우팅 구조

### 7.1 전체 라우트 맵

```typescript
// App.tsx
<Routes>
  {/* 고객 앱 (AppLayout) */}
  <Route path="/" element={<AppLayout />}>
    <Route index element={<Home />} />
    <Route path="menu" element={<MenuList />} />
    <Route path="menu/:id" element={<MenuDetail />} />
    <Route path="cart" element={<Cart />} />
    <Route path="checkout" element={<Checkout />} />
    <Route path="orders/:orderId" element={<OrderTracking />} />
    <Route path="order-history" element={<OrderHistory />} />
    <Route path="review/:orderId" element={<ReviewWrite />} />
    <Route path="reviews" element={<ReviewList />} />
    <Route path="my" element={<My />} />
  </Route>

  {/* 인증 (레이아웃 없음) */}
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />

  {/* 관리자 (AdminLayout + ProtectedRoute) */}
  <Route path="/admin" element={
    <ProtectedRoute requiredRole="owner">
      <AdminLayout />
    </ProtectedRoute>
  }>
    <Route index element={<Dashboard />} />
    <Route path="orders" element={<AdminOrders />} />
    <Route path="menus" element={<AdminMenus />} />
    <Route path="reviews" element={<AdminReviews />} />
    <Route path="settings" element={<AdminSettingsCenter />} />
  </Route>

  {/* 개발 도구 - 나중에 제거! */}
  <Route path="/dev" element={<DevTools />} />
</Routes>
```

### 7.2 레이아웃 구조

```
AppLayout (고객 앱)
├── AppHeader (상단 헤더)
├── <Outlet /> (페이지 내용)
└── BottomNav (하단 네비게이션)

AdminLayout (관리자)
├── TopBar (상단 헤더 + 알림)
├── SideNav (좌측 사이드바)
└── <Outlet /> (페이지 내용)
```

---

## 8. 디자인 시스템

### 8.1 CSS 변수 (globals.css)

```css
:root {
  /* 브랜드 컬러 */
  --color-primary: #D61C1C;          /* 현풍레드 */
  --color-primary-hover: #B01717;
  --color-primary-light: #FFE5E5;
  
  --color-secondary: #F37021;        /* 신칼오렌지 */
  --color-secondary-hover: #D85F1B;
  
  --color-accent: #C7A45A;           /* 황동식기색 */
  
  /* 텍스트 */
  --color-text-primary: #333333;
  --color-text-secondary: #8B7355;
  
  /* 배경 */
  --color-background: #F9F6F3;
  --color-surface: #FFFFFF;
  
  /* 간격 */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  
  /* 타이포그래피 - 이미 정의되어 있음! */
  /* h1, h2, h3, h4, h5, h6, p 등 */
}
```

### 8.2 Tailwind 클래스 사용

```html
<!-- ✅ 올바른 사용 -->
<button className="bg-primary hover:bg-primary-hover text-white">
  주문하기
</button>

<div className="p-md bg-surface rounded-lg">
  <h2>메뉴 목록</h2>
  <p className="text-text-secondary">설명...</p>
</div>

<!-- ❌ 잘못된 사용 -->
<h2 className="text-2xl font-bold">메뉴 목록</h2>
<button className="bg-red-500">주문하기</button>
```

---

## 9. Firebase 연동 포인트

### 9.1 현재 상태 (Mock)

```typescript
// config/env.ts
export const USE_FIREBASE = false;  // 현재 Mock 모드

// lib/firebase.ts
if (USE_FIREBASE) {
  // 실제 Firebase 초기화
} else {
  // Mock 데이터 사용
}
```

### 9.2 연동해야 할 곳

```typescript
// 1. Authentication (/lib/auth.ts)
export async function signIn(email: string, password: string) {
  // TODO: Firebase Auth 연동
  if (USE_FIREBASE) {
    return await signInWithEmailAndPassword(auth, email, password);
  }
  // Mock
  return mockUser;
}

// 2. Orders (/lib/orders.api.ts)
export async function createOrder(order: Order) {
  // TODO: Firestore 연동
  if (USE_FIREBASE) {
    return await addDoc(collection(db, 'orders'), order);
  }
  // Mock
  return { id: 'mock-order-1' };
}

// 3. Menus (/lib/admin/menus.api.ts)
export async function getMenus() {
  // TODO: Firestore 연동
  if (USE_FIREBASE) {
    const snapshot = await getDocs(collection(db, 'menus'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  // Mock
  return menusMockData;
}
```

### 9.3 연동 순서 (나중에 상세 프롬프트로 제공)

```
1. .env 파일 설정
2. USE_FIREBASE = true 변경
3. Authentication 연동
4. Firestore 연동 (컬렉션별)
5. Storage 연동 (이미지 업로드)
6. Cloud Functions 배포
7. 테스트 및 검증
```

---

## 10. 코드 작성 규칙

### 10.1 컴포넌트 작성

```typescript
// ✅ 올바른 컴포넌트 구조
import { useState, useEffect } from 'react';
import type { Menu } from '../types/menu';
import { getMenus } from '../lib/admin/menus.api';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { EmptyState } from '../components/shared/EmptyState';

export function MenuList() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const data = await getMenus();
      setMenus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <InlineError message={error} />;
  if (menus.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-2 gap-md">
      {menus.map(menu => (
        <MenuCard key={menu.id} menu={menu} />
      ))}
    </div>
  );
}
```

### 10.2 API 함수 작성

```typescript
// ✅ 올바른 API 함수
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { Order } from '../../types/order';
import { USE_FIREBASE } from '../../config/env';

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  if (!USE_FIREBASE) {
    // Mock 데이터 반환
    return mockOrders.filter(o => o.userId === userId);
  }

  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    console.error('[API] getOrdersByUserId 실패:', error);
    throw new Error('주문 목록을 불러오는데 실패했습니다.');
  }
}
```

### 10.3 에러 처리

```typescript
// ✅ 올바른 에러 처리
try {
  const result = await someAsyncFunction();
  // 성공 처리
  toast.success('작업이 완료되었습니다.');
} catch (error) {
  // 에러 로깅
  console.error('[Component] 에러 발생:', error);
  
  // 사용자 친화적 메시지
  const message = error instanceof Error 
    ? error.message 
    : '알 수 없는 오류가 발생했습니다.';
  
  toast.error(message);
  
  // 상태 업데이트
  setError(message);
}
```

### 10.4 주석 작성

```typescript
// ✅ 좋은 주석
/**
 * 주문을 생성하고 Firestore에 저장합니다.
 * 
 * @param userId - 사용자 ID
 * @param items - 장바구니 아이템 목록
 * @param deliveryInfo - 배달 정보
 * @returns 생성된 주문 객체
 * @throws {Error} 주문 생성 실패 시
 */
export async function createOrder(
  userId: string,
  items: CartItem[],
  deliveryInfo: DeliveryInfo
): Promise<Order> {
  // 구현...
}

// ❌ 나쁜 주석
// 주문 만들기
function createOrder() { ... }
```

---

## 📌 작업 시작 전 체크리스트

Cursor AI로 작업을 시작하기 전에 이것을 확인하세요:

```
[ ] 이 문서를 완전히 읽고 이해했는가?
[ ] 브랜드 컬러 3가지를 암기했는가? (#D61C1C, #F37021, #C7A45A)
[ ] Tailwind 폰트 클래스 사용 금지를 이해했는가?
[ ] TypeScript any 타입 사용 금지를 이해했는가?
[ ] Firebase Mock 모드가 현재 활성화되어 있음을 이해했는가?
[ ] 파일 수정 금지 목록을 확인했는가?
```

---

## 🎯 다음 단계

이 문서를 이해했다면, 다음 문서로 진행하세요:

**👉 [CURSOR-ATOMIC-프롬프트-완벽가이드.md](./CURSOR-ATOMIC-프롬프트-완벽가이드.md)**

이 문서는 Step 1부터 Step 20까지 단계별로 Firebase 연동을 완료하는 완벽한 프롬프트를 제공합니다.

---

**작성:** KS컴퍼니 (사업자번호 553-17-00098)  
**버전:** 1.0.0  
**최종 수정:** 2024-11-08
