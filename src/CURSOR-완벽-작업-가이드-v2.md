# 🎯 Cursor AI - 현풍닭칼국수 PWA 완벽 작업 가이드 v2

> **이 문서 하나로 로컬 개발 완성!**  
> 프로젝트 이해 → 환경 설정 → Firebase 연동 → 프로덕션 배포

**작성:** KS컴퍼니 (사업자번호: 553-17-00098)  
**버전:** 2.0 (2024-11-08 업데이트)

---

## 📚 목차

1. [프로젝트 완벽 이해](#1-프로젝트-완벽-이해)
2. [핵심 규칙 (절대 위반 금지!)](#2-핵심-규칙-절대-위반-금지)
3. [디렉토리 구조](#3-디렉토리-구조)
4. [ATOMIC 프롬프트 (Step-by-Step)](#4-atomic-프롬프트-step-by-step)
5. [디자인 보호 시스템](#5-디자인-보호-시스템)
6. [프로덕션 준비](#6-프로덕션-준비)

---

## 1. 프로젝트 완벽 이해

### 1.1 프로젝트 개요

```yaml
프로젝트명: 현풍닭칼국수 PWA 배달앱
목적: QR 스캔 → 설치 → 주문 → 결제 → 추적 → 리뷰 (완전한 배달앱)
완성도: 프론트엔드 99% (백엔드 연동만 필요)

브랜드:
  - 현풍레드: #D61C1C (메인 컬러)
  - 신칼오렌지: #F37021 (포인트 컬러)
  - 황동식기색: #C7A45A (엑센트 컬러)

기술 스택:
  Frontend: React 18.2 + TypeScript + Vite 5.1
  Styling: Tailwind CSS v4.0 (중요: v4 문법 사용!)
  UI: Shadcn UI (60+ 컴포넌트)
  Backend: Firebase (hp-kal 프로젝트)
    - Firestore: 데이터베이스
    - Auth: 인증
    - Storage: 파일 저장
    - Functions: 서버리스
  Payment: 
    - NICEPAY (기본)
    - 토스페이먼츠 (추가됨)
  State: Context API
  Router: React Router v6

페이지 수: 28개
라우트 수: 30+
컴포넌트 수: 60+
```

### 1.2 아키텍처

```
┌────────────────────────────────────────┐
│  Presentation (pages/*, components/*)  │
├────────────────────────────────────────┤
│  Business Logic (hooks/*, contexts/*)  │
├────────────────────────────────────────┤
│  Data Access (lib/*.api.ts)            │
├────────────────────────────────────────┤
│  Integration (lib/firebase.ts)         │
├────────────────────────────────────────┤
│  Backend (Firebase)                    │
└────────────────────────────────────────┘
```

### 1.3 데이터 흐름

```
사용자 클릭
  ↓
페이지 컴포넌트 (pages/app/Cart.tsx)
  ↓
Context/Hook (contexts/CartContext.tsx)
  ↓
API 함수 (lib/orders.api.ts)
  ↓
Firebase SDK (lib/firebase.ts)
  ↓
Firestore
```

### 1.4 현재 상태 (중요!)

```
✅ 완료:
  - 모든 UI/UX 컴포넌트
  - 타입 시스템
  - 디자인 시스템
  - 라우팅
  - Context API
  - Mock 데이터
  - 결제사 선택 시스템 (나이스페이/토스페이먼츠)
  - 관리자 설정 센터

⏳ 필요:
  - Firebase 연동 (VITE_USE_FIREBASE=true)
  - 실제 API 연동 (NICEPAY, Google Maps 등)
  - 프로덕션 배포

❌ 제거 필요 (프로덕션 전):
  - /dev 페이지 (DevTools.tsx)
  - /pages/app/Debug.tsx
  - 관리자 대시보드 디버그 버튼
```

---

## 2. 핵심 규칙 (절대 위반 금지!)

### 🔴 규칙 1: 디자인 절대 보호

```
❌ 절대 하지 말 것:
  - 브랜드 컬러 변경 (#D61C1C, #F37021, #C7A45A)
  - font-size, font-weight, line-height Tailwind 클래스 사용
  - 기존 컴포넌트 스타일 수정 (버그 아니면 건드리지 말 것)
  - !important 남발
  - 임의의 색상 (#123456 등)

✅ 항상 할 것:
  - BRAND_COLORS 상수 사용
  - var(--color-hyunpung-red) 사용
  - className="bg-hyunpung-red" 사용
  - 기존 디자인 토큰 활용
  - 변경 전 디자인 잠금 확인 (npm run design:verify)
```

### 🔴 규칙 2: 타입 안전성

```typescript
❌ any 사용 금지
✅ 모든 타입 명시 (types/*.ts 활용)

// 나쁜 예
const data: any = ...

// 좋은 예
import { Order } from '../types/order';
const order: Order = ...
```

### 🔴 규칙 3: Firebase Mock 모드

```typescript
// lib/firebase.ts에서 USE_FIREBASE 확인
const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE === 'true';

// Mock 모드 (개발)
if (!USE_FIREBASE) {
  return mockData;
}

// 실제 Firebase (프로덕션)
return await firestore.collection('orders').get();
```

### 🔴 규칙 4: 100% 구현 원칙

```
❌ 플레이스홀더 금지:
  - // TODO
  - // 나중에 구현
  - { /* ... */ }
  - "기타 코드 생략"

✅ 모든 코드 완전 구현
✅ 모든 엣지 케이스 처리
✅ 모든 에러 핸들링
```

### 🔴 규칙 5: 라우팅 일관성

```typescript
// App.tsx에서 모든 라우트 확인
// 절대 중복 라우트 생성 금지
// 절대 기존 라우트 삭제 금지

// 예:
<Route path="/menu" element={<MenuList />} />
<Route path="/menu/:id" element={<MenuDetail />} />
```

---

## 3. 디렉토리 구조

### 3.1 핵심 디렉토리

```
/
├── pages/              ← 페이지 컴포넌트 (28개)
│   ├── app/           ← 고객 앱 (14개)
│   │   ├── Home.tsx
│   │   ├── MenuList.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderTracking.tsx
│   │   ├── My.tsx
│   │   └── ...
│   ├── admin/         ← 관리자 (13개)
│   │   ├── Dashboard.tsx
│   │   ├── Orders.tsx
│   │   ├── Menus.tsx
│   │   ├── Reviews.tsx
│   │   ├── Settings/
│   │   │   ├── index.tsx        ← 설정 센터 메인
│   │   │   ├── PaymentTab.tsx   ← 결제사 선택 (나이스페이/토스)
│   │   │   ├── DeliveryTab.tsx
│   │   │   ├── MapsTab.tsx
│   │   │   ├── FCMTab.tsx
│   │   │   └── OperationsTab.tsx
│   │   └── ...
│   └── DevTools.tsx   ← 🚫 프로덕션 전 제거!
│
├── components/         ← 재사용 컴포넌트 (60+)
│   ├── app/           ← 앱 전용
│   ├── admin/         ← 관리자 전용
│   ├── shared/        ← 공통
│   ├── ui/            ← Shadcn UI
│   └── ...
│
├── lib/               ← 비즈니스 로직
│   ├── firebase.ts    ← Firebase 초기화 (핵심!)
│   ├── auth.ts        ← 인증 (Mock/Firebase)
│   ├── orders.api.ts  ← 주문 API
│   ├── nicepay.ts     ← 나이스페이
│   ├── admin/         ← 관리자 API
│   │   ├── orders.api.ts
│   │   ├── menus.api.ts
│   │   ├── settingsCenter.api.ts
│   │   └── ...
│   └── utils/         ← 유틸리티
│
├── types/             ← TypeScript 타입 (11개)
│   ├── order.ts
│   ├── menu.ts
│   ├── payment.ts
│   ├── adminSettings.ts
│   └── ...
│
├── contexts/          ← 전역 상태
│   ├── AuthContext.tsx
│   └── CartContext.tsx
│
├── constants/         ← 상수
│   ├── design-tokens.ts  ← 디자인 토큰 (중요!)
│   ├── colors.ts
│   └── ...
│
├── styles/            ← 스타일
│   ├── globals.css       ← 글로벌 CSS
│   └── design-lock.css   ← 디자인 잠금 (중요!)
│
├── functions/         ← Firebase Functions
│   └── src/
│       ├── index.ts
│       └── lib/
│
├── App.tsx            ← 메인 앱 (라우팅)
├── main.tsx           ← 엔트리 포인트
└── .env               ← 환경변수 (절대 커밋 금지!)
```

### 3.2 파일 명명 규칙

```
컴포넌트: PascalCase.tsx
  - ✅ OrderCard.tsx
  - ❌ orderCard.tsx

API 파일: camelCase.api.ts
  - ✅ orders.api.ts
  - ❌ Orders.api.ts

타입 파일: camelCase.ts
  - ✅ order.ts
  - ❌ Order.ts

유틸리티: camelCase.ts
  - ✅ format.ts
  - ❌ Format.ts
```

---

## 4. ATOMIC 프롬프트 (Step-by-Step)

> **각 Step을 복사해서 Cursor AI에 붙여넣기하세요!**

### 📌 사전 준비: 프로젝트 이해

```
이 프로젝트는 "현풍닭칼국수 PWA 배달앱"입니다. 
다음 정보를 완벽히 숙지하고 작업해주세요:

프로젝트 정보:
- 이름: 현풍닭칼국수 PWA
- 개발사: KS컴퍼니 (사업자번호: 553-17-00098)
- Firebase 프로젝트 ID: hp-kal
- 브랜드 컬러: #D61C1C (현풍레드), #F37021 (신칼오렌지), #C7A45A (황동식기색)
- 기술: React 18.2 + TypeScript + Vite + Tailwind v4 + Shadcn UI + Firebase

완성도:
- ✅ 프론트엔드: 99% (28 페이지, 60+ 컴포넌트)
- ✅ 디자인 시스템: 100%
- ⏳ Firebase 연동: Mock 모드 (VITE_USE_FIREBASE=false)

핵심 규칙 (절대 위반 금지):
1. 브랜드 컬러 절대 변경 금지
2. font-size, font-weight, line-height Tailwind 클래스 사용 금지
3. 기존 컴포넌트 스타일 수정 금지 (버그 아니면)
4. any 타입 사용 금지
5. 플레이스홀더 (TODO, ... 등) 절대 금지 - 100% 완전 구현
6. 디자인 잠금 확인: npm run design:verify

다음 문서를 참고하세요:
- CURSOR-프로젝트-완벽-이해-가이드.md
- DESIGN-LOCK-QUICK-START.md
- FIREBASE-연동-완벽-가이드.md

이해했다면 "프로젝트 정보를 완벽히 이해했습니다. 작업을 시작하겠습니다."라고 답변해주세요.
```

---

### Phase 1: 로컬 환경 설정

#### Step 1: 의존성 설치 및 확인

```
현풍닭칼국수 PWA 프로젝트의 의존성을 설치하고 프로젝트 구조를 확인해주세요.

작업:
1. package.json 파일 읽기 및 분석
2. npm install 실행 (또는 이미 설치되어 있는지 확인)
3. node_modules 설치 확인
4. 핵심 파일 존재 확인:
   - App.tsx
   - main.tsx
   - config/env.ts
   - lib/firebase.ts
   - lib/auth.ts
   - styles/globals.css
   - styles/design-lock.css
   - constants/design-tokens.ts
5. package.json의 주요 의존성 확인:
   - react, react-dom
   - react-router-dom
   - tailwindcss
   - firebase
   - lucide-react
   - sonner

검증 체크리스트:
[ ] npm install 성공 (또는 이미 설치됨)
[ ] node_modules 존재
[ ] 모든 핵심 파일 존재
[ ] package.json 의존성 확인
[ ] 에러 메시지 없음

설치 완료 후 결과를 리포트 형식으로 출력해주세요.
```

---

#### Step 2: 환경변수 설정 (.env)

```
.env 파일을 생성하고 개발 모드 환경변수를 설정해주세요.

⚠️ 중요:
- .env 파일이 이미 존재하면 덮어쓰지 말고 내용만 확인
- .gitignore에 .env가 포함되어 있는지 확인

작업:
1. .env 파일 생성 (없는 경우만)
2. 다음 내용으로 설정:

```env
# Firebase 설정 (개발 모드 - Mock)
VITE_USE_FIREBASE=false
VITE_FIREBASE_API_KEY=MOCK_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=localhost
VITE_FIREBASE_PROJECT_ID=mock-project
VITE_FIREBASE_STORAGE_BUCKET=mock-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:mock
VITE_FIREBASE_MEASUREMENT_ID=G-MOCK

# 결제 설정 (Mock)
VITE_NICEPAY_MID=MOCK_MID
VITE_NICEPAY_CLIENT_KEY=MOCK_KEY

# 배달대행사 설정 (Mock)
VITE_PROVIDER_A_API_URL=https://mock.example.com
VITE_PROVIDER_A_API_KEY=MOCK_KEY
VITE_PROVIDER_A_MERCHANT_ID=MOCK_MERCHANT

# 기능 플래그
VITE_DELIVERY_ENABLED=true
VITE_DELIVERY_PROVIDER=mock
VITE_SUPPORT_ENABLED=true
VITE_POINTS_ENABLED=true

# 환경
VITE_APP_ENV=development
```

3. .gitignore 확인 및 .env 추가 (없으면)

검증 체크리스트:
[ ] .env 파일 생성/확인
[ ] VITE_USE_FIREBASE=false (중요!)
[ ] 모든 환경변수 설정됨
[ ] .gitignore에 .env 포함
[ ] 민감 정보 없음 (개발 모드)

완료 후 "환경변수 설정 완료"라고 보고해주세요.
```

---

#### Step 3: 디자인 잠금 확인

```
디자인 CSS 잠금이 활성화되어 있는지 확인하고, 필요하면 활성화해주세요.

⚠️ 중요: 디자인 잠금은 브랜드 컬러와 디자인 시스템을 보호합니다!

작업:
1. styles/design-lock.css 파일 존재 확인
2. main.tsx에서 import './styles/design-lock.css' 확인
3. constants/design-tokens.ts 파일 확인
4. 브랜드 컬러 상수 확인:
   - BRAND_COLORS.hyunpungRed = '#D61C1C'
   - BRAND_COLORS.shinkalOrange = '#F37021'
   - BRAND_COLORS.brassWareGold = '#C7A45A'

디자인 잠금 내용 확인:
- CSS 변수 고정 (:root)
- 브랜드 컬러 보호
- 타이포그래피 고정
- Border Radius 고정
- Shadow 고정
- Z-Index 체계

검증 체크리스트:
[ ] styles/design-lock.css 존재
[ ] main.tsx에 import 존재
[ ] constants/design-tokens.ts 존재
[ ] 브랜드 컬러 상수 확인
[ ] CSS 변수 확인

완료 후 "디자인 잠금 확인 완료"라고 보고하고, 브랜드 컬러 3개를 출력해주세요.
```

---

#### Step 4: 개발 서버 실행

```
개발 서버를 시작하고 모든 주요 라우트가 정상 작동하는지 확인해주세요.

작업:
1. npm run dev 명령어로 개발 서버 시작
2. 서버 시작 확인 (보통 http://localhost:5173)
3. 브라우저 자동 오픈 (안되면 수동으로)

테스트할 URL (중요!):
- http://localhost:5173/ (홈)
- http://localhost:5173/menu (메뉴 리스트)
- http://localhost:5173/cart (장바구니)
- http://localhost:5173/my (마이페이지)
- http://localhost:5173/login (로그인)
- http://localhost:5173/admin (관리자 대시보드)
- http://localhost:5173/admin/settings (관리자 설정)
- http://localhost:5173/dev (디버그 페이지 - 나중에 제거)

확인 사항:
- 각 페이지 로딩 확인
- 브라우저 콘솔 에러 확인 (F12)
- 네트워크 탭에서 404 에러 확인
- Hot Module Replacement 작동 확인 (파일 수정 시 자동 리로드)

검증 체크리스트:
[ ] npm run dev 성공
[ ] 서버 포트 확인 (5173)
[ ] 모든 URL 접속 가능
[ ] 콘솔 에러 없음 (Warning은 OK)
[ ] 404 에러 없음
[ ] HMR 작동

완료 후 각 URL 접속 결과를 리포트해주세요.
```

---

#### Step 5: Mock 인증 테스트

```
Mock 인증 시스템이 정상 작동하는지 테스트해주세요.

⚠️ 현재 VITE_USE_FIREBASE=false이므로 Mock 모드입니다!

작업:
1. lib/auth.ts 파일 확인
2. getCurrentUser() 함수 확인
3. Mock 사용자 확인:
   - MOCK_ADMIN: role='owner'
   - MOCK_CUSTOMER: role='customer'
4. localStorage 기반 Mock 로그인 확인

테스트:
1. 브라우저 콘솔(F12) 열기
2. 다음 명령어 실행:

```javascript
// Owner로 로그인
localStorage.setItem('mockRole', 'owner');
location.reload();

// 관리자 페이지 접속 확인
// http://localhost:5173/admin

// Customer로 전환
localStorage.setItem('mockRole', 'customer');
location.reload();

// 다시 Owner로
localStorage.setItem('mockRole', 'owner');
location.reload();
```

검증 체크리스트:
[ ] lib/auth.ts 확인
[ ] USE_FIREBASE = false
[ ] Mock 사용자 존재
[ ] localStorage 테스트 성공
[ ] Owner로 /admin 접속 가능
[ ] Customer로 /admin 접속 차단

완료 후 "Mock 인증 테스트 완료"라고 보고해주세요.
```

---

### Phase 2: Firebase 연동 준비

#### Step 6: Firebase 설정 파일 확인

```
Firebase 설정 파일들을 확인하고 구조를 이해해주세요.

작업:
1. lib/firebase.ts 파일 열기 및 분석
2. Firebase 초기화 코드 확인
3. USE_FIREBASE 플래그 확인
4. Mock 모드와 실제 모드 분기 확인

확인할 파일:
- lib/firebase.ts (Firebase 초기화)
- lib/auth.ts (인증)
- lib/orders.api.ts (주문 API)
- lib/admin/orders.api.ts (관리자 주문 API)
- lib/admin/settingsCenter.api.ts (설정 센터 API)

각 파일에서 확인:
1. USE_FIREBASE 체크
2. Mock 데이터 반환
3. Firebase SDK 사용 (주석 처리 또는 조건부)

예시 패턴:
```typescript
const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE === 'true';

export async function getOrders(): Promise<Order[]> {
  if (!USE_FIREBASE) {
    // Mock 데이터 반환
    return MOCK_ORDERS;
  }
  
  // 실제 Firebase
  const snapshot = await firestore.collection('orders').get();
  return snapshot.docs.map(doc => doc.data() as Order);
}
```

검증 체크리스트:
[ ] lib/firebase.ts 분석 완료
[ ] USE_FIREBASE 플래그 이해
[ ] Mock 모드 패턴 이해
[ ] Firebase SDK 사용법 이해
[ ] 주요 API 파일 5개 확인

완료 후 USE_FIREBASE 분기 패턴을 설명해주세요.
```

---

#### Step 7: Firebase 프로젝트 정보 준비

```
Firebase 프로젝트 정보를 준비하고 .env.production 파일을 생성해주세요.

⚠️ 실제 Firebase 키는 아직 입력하지 마세요! 템플릿만 생성합니다.

작업:
1. .env.production.example 파일 생성
2. 다음 템플릿 작성:

```env
# Firebase 설정 (프로덕션)
VITE_USE_FIREBASE=true
VITE_FIREBASE_API_KEY=실제_API_키_입력
VITE_FIREBASE_AUTH_DOMAIN=hp-kal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hp-kal
VITE_FIREBASE_STORAGE_BUCKET=hp-kal.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=실제_SENDER_ID
VITE_FIREBASE_APP_ID=실제_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=실제_MEASUREMENT_ID

# 결제 설정 (나이스페이 - 프로덕션)
VITE_NICEPAY_MID=실제_가맹점ID
VITE_NICEPAY_CLIENT_KEY=실제_클라이언트키

# 배달대행사 설정 (프로덕션)
VITE_PROVIDER_A_API_URL=실제_API_URL
VITE_PROVIDER_A_API_KEY=실제_API_KEY
VITE_PROVIDER_A_MERCHANT_ID=실제_MERCHANT_ID

# 기능 플래그
VITE_DELIVERY_ENABLED=true
VITE_DELIVERY_PROVIDER=providerA
VITE_SUPPORT_ENABLED=true
VITE_POINTS_ENABLED=true

# 환경
VITE_APP_ENV=production
```

3. .gitignore에 .env.production 추가

참고 문서:
- FIREBASE-연동-완벽-가이드.md
- docs/06-firebase/01-Firebase-정보-전체-정리.md

검증 체크리스트:
[ ] .env.production.example 생성
[ ] 템플릿 완성
[ ] .gitignore 업데이트
[ ] 실제 키는 입력 안 함

완료 후 "Firebase 환경변수 템플릿 준비 완료"라고 보고해주세요.
```

---

#### Step 8: Firestore 컬렉션 구조 확인

```
Firestore 데이터베이스의 컬렉션 구조를 확인하고 이해해주세요.

작업:
1. types/ 디렉토리의 모든 타입 파일 확인:
   - order.ts
   - menu.ts
   - review.ts
   - coupon.ts
   - payment.ts
   - support.ts
   - points.ts

2. 각 타입에서 Firestore 컬렉션 매핑 확인

예상 컬렉션 구조:
```
Firestore Database (hp-kal)
├── orders/           ← 주문
│   ├── {orderId}
│   │   ├── id
│   │   ├── userId
│   │   ├── items[]
│   │   ├── status
│   │   ├── createdAt
│   │   └── ...
│
├── menus/            ← 메뉴
│   ├── {menuId}
│   │   ├── id
│   │   ├── name
│   │   ├── price
│   │   ├── category
│   │   └── ...
│
├── reviews/          ← 리뷰
├── users/            ← 사용자
├── coupons/          ← 쿠폰
├── points/           ← 포인트
└── settings/         ← 설정
    └── store/
        ├── businessHours
        ├── deliveryFee
        └── ...
```

검증 체크리스트:
[ ] 모든 타입 파일 확인
[ ] 컬렉션 구조 이해
[ ] 필드 구조 이해
[ ] 관계 이해 (order ↔ menu 등)

완료 후 주요 컬렉션 3개를 설명해주세요.
```

---

### Phase 3: Firebase Functions 설정

#### Step 9: Functions 구조 확인

```
Firebase Functions 코드를 확인하고 이해해주세요.

작업:
1. functions/ 디렉토리 확인
2. functions/package.json 확인
3. functions/src/index.ts 확인
4. functions/src/lib/ 하위 파일 확인:
   - nicepay.ts (나이스페이 연동)
   - pdf.ts (영수증 생성)
   - push.ts (푸시 알림)
   - coupons.ts (쿠폰 로직)
   - report.ts (리포트 생성)

Functions 목록 확인:
```typescript
// functions/src/index.ts

// 1. 주문 관련
export const createOrder = functions.https.onCall(...)
export const updateOrderStatus = functions.https.onCall(...)

// 2. 결제 관련
export const processPayment = functions.https.onCall(...)
export const verifyPayment = functions.https.onCall(...)

// 3. 알림 관련
export const sendPushNotification = functions.https.onCall(...)

// 4. 리포트 관련
export const generateReport = functions.https.onCall(...)
```

검증 체크리스트:
[ ] functions/ 디렉토리 확인
[ ] package.json 의존성 확인
[ ] index.ts 분석
[ ] lib/ 파일들 확인
[ ] Functions 목록 이해

완료 후 주요 Functions 3개를 설명해주세요.
```

---

#### Step 10: Functions 로컬 테스트 준비

```
Firebase Functions를 로컬에서 테스트할 준비를 해주세요.

⚠️ 실제 배포는 하지 않습니다! 로컬 에뮬레이터만 준비합니다.

작업:
1. Firebase CLI 설치 확인:
   ```bash
   firebase --version
   ```
   (없으면: npm install -g firebase-tools)

2. Firebase 프로젝트 연결 확인:
   ```bash
   firebase projects:list
   ```

3. firebase.json 파일 확인
4. Emulator 설정 확인

firebase.json 내용:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  },
  "emulators": {
    "functions": {
      "port": 5001
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    }
  }
}
```

로컬 에뮬레이터 시작 (선택):
```bash
firebase emulators:start
```

검증 체크리스트:
[ ] Firebase CLI 설치됨
[ ] 프로젝트 연결 확인
[ ] firebase.json 확인
[ ] Emulator 설정 확인
[ ] (선택) Emulator 시작 성공

완료 후 "Functions 로컬 테스트 준비 완료"라고 보고해주세요.
```

---

### Phase 4: 결제 시스템 확인

#### Step 11: 나이스페이 연동 확인

```
나이스페이 결제 연동 코드를 확인하고 이해해주세요.

작업:
1. lib/nicepay.ts 파일 확인
2. 결제 프로세스 이해:
   - initPayment() - 결제 시작
   - verifyPayment() - 결제 검증
   - cancelPayment() - 결제 취소

3. pages/app/Checkout.tsx에서 사용 확인

4. functions/src/lib/nicepay.ts 서버 코드 확인

나이스페이 플로우:
```
1. 고객: 결제 버튼 클릭
   ↓
2. Frontend: initPayment() 호출
   ↓
3. 나이스페이 결제창 오픈
   ↓
4. 고객: 카드 정보 입력
   ↓
5. 나이스페이: 결제 처리
   ↓
6. Callback: /pay/return
   ↓
7. Backend: verifyPayment() 검증
   ↓
8. Firestore: 주문 상태 업데이트
```

검증 체크리스트:
[ ] lib/nicepay.ts 확인
[ ] 3가지 함수 이해
[ ] Checkout.tsx 사용 확인
[ ] Functions 서버 코드 확인
[ ] 결제 플로우 이해

완료 후 결제 프로세스를 설명해주세요.
```

---

#### Step 12: 토스페이먼츠 확인

```
새로 추가된 토스페이먼츠 결제 옵션을 확인해주세요.

⚠️ 최근 업데이트: 관리자가 나이스페이/토스페이먼츠 중 선택 가능!

작업:
1. pages/admin/Settings/PaymentTab.tsx 확인
2. 결제사 선택 UI 확인:
   - RadioGroup (나이스페이 / 토스페이먼츠)
   - 각 결제사별 설정 가이드
3. 토스페이먼츠 CLI 설정 확인

토스페이먼츠 설정 (Firebase Functions Config):
```bash
firebase functions:config:set \
  toss.mode="production" \
  toss.client_key="live_ck_..." \
  toss.secret_key="live_sk_..."
```

Payment Provider 패턴:
```typescript
interface PaymentProvider {
  name: 'nicepay' | 'toss';
  initPayment(): Promise<PaymentResult>;
  verifyPayment(): Promise<boolean>;
  cancelPayment(): Promise<boolean>;
}
```

검증 체크리스트:
[ ] PaymentTab.tsx 확인
[ ] 결제사 선택 UI 이해
[ ] 나이스페이 설정 확인
[ ] 토스페이먼츠 설정 확인
[ ] Provider 패턴 이해

완료 후 "결제사 선택 시스템 확인 완료"라고 보고해주세요.

참고 문서:
- PAYMENT-PROVIDER-선택-시스템-가이드.md
- 결제사-선택-시스템-요약.md
```

---

### Phase 5: 관리자 기능 확인

#### Step 13: 관리자 대시보드 테스트

```
관리자 대시보드의 모든 기능을 테스트해주세요.

⚠️ Mock 모드에서 모든 기능이 정상 작동해야 합니다!

작업:
1. Owner로 로그인:
   ```javascript
   localStorage.setItem('mockRole', 'owner');
   location.reload();
   ```

2. 관리자 페이지 접속:
   http://localhost:5173/admin

3. 각 메뉴 테스트:
   - 대시보드 (/)
   - 주문 관리 (/orders)
   - 배달 관제 (/delivery)
   - 고객 지원 (/support)
   - 리뷰 관리 (/reviews)
   - 메뉴 관리 (/menus)
   - 쿠폰/프로모션 (/promotions)
   - 포인트 관리 (/points)
   - 관제 대시보드 (/analytics)
   - 통합 리포트 (/integrated-analytics)
   - 설정 (/settings) ⭐ 중요!

4. 설정 센터 5개 탭 테스트:
   - 결제 (payment) ⭐ 나이스페이/토스 선택
   - 배달대행 (delivery)
   - 지도/지오 (maps)
   - 알림/FCM (fcm)
   - 운영/보안 (operations)

검증 체크리스트:
[ ] Owner 로그인 성공
[ ] 11개 메뉴 모두 접속 가능
[ ] 설정 센터 5개 탭 정상
[ ] Mock 데이터 표시됨
[ ] 콘솔 에러 없음
[ ] UI 깨짐 없음

완료 후 각 메뉴별 상태를 리포트해주세요.
```

---

#### Step 14: 설정 센터 정밀 테스트

```
관리자 설정 센터를 정밀하게 테스트해주세요.

⚠️ 최근 수정: 접근 권한 문제 해결, 토스페이먼츠 추가

작업:
1. http://localhost:5173/admin/settings 접속

2. 결제 탭 테스트:
   - 나이스페이 라디오 버튼 클릭
   - 나이스페이 설정 가이드 표시 확인
   - CLI 명령어 복사 버튼 테스트
   - 토스페이먼츠 라디오 버튼 클릭
   - 토스페이먼츠 설정 가이드 표시 확인
   - 수수료 비교 표시 확인

3. 배달대행 탭 테스트:
   - 배달대행사 설정 확인
   - API 키 입력 필드 확인

4. 지도/지오 탭 테스트:
   - Google Maps API 설정 확인

5. 알림/FCM 탭 테스트:
   - Firebase Cloud Messaging 설정 확인

6. 운영/보안 탭 테스트:
   - 영업시간 설정 확인
   - 배달비 설정 확인

검증 체크리스트:
[ ] 설정 센터 접속 성공
[ ] 5개 탭 모두 정상
[ ] 결제사 선택 기능 작동
[ ] CLI 명령어 복사 작동
[ ] 모든 입력 필드 정상
[ ] 저장 버튼 작동 (Mock)

완료 후 "설정 센터 정밀 테스트 완료"라고 보고해주세요.
```

---

### Phase 6: 고객 앱 기능 확인

#### Step 15: 주문 플로우 테스트

```
고객 앱의 전체 주문 플로우를 테스트해주세요.

작업:
1. Customer로 로그인:
   ```javascript
   localStorage.setItem('mockRole', 'customer');
   location.reload();
   ```

2. 주문 플로우 테스트:

Step 1: 메뉴 선택
- http://localhost:5173/menu
- 메뉴 카드 클릭
- 상세 페이지로 이동 (/menu/:id)
- 옵션 선택 (필수/선택)
- 수량 선택
- "장바구니에 담기" 버튼 클릭

Step 2: 장바구니
- http://localhost:5173/cart
- 담긴 메뉴 확인
- 수량 변경 테스트
- 삭제 테스트
- 총 금액 계산 확인
- "주문하기" 버튼 클릭

Step 3: 주문/결제
- http://localhost:5173/checkout
- 배송 정보 입력
- 쿠폰 선택 (선택)
- 포인트 사용 (선택)
- 결제 수단 선택
- 최종 금액 확인
- "결제하기" 버튼 클릭

Step 4: 주문 추적
- 주문 완료 페이지로 이동
- /order/:id 주문 상세
- /order/:id/tracking 배달 추적

검증 체크리스트:
[ ] 메뉴 선택 정상
[ ] 장바구니 정상
[ ] 주문 정보 입력 정상
[ ] Mock 결제 완료
[ ] 주문 추적 페이지 정상
[ ] 전체 플로우 에러 없음

완료 후 주문 플로우 테스트 결과를 리포트해주세요.
```

---

#### Step 16: 리뷰 시스템 테스트

```
리뷰 작성 및 관리 기능을 테스트해주세요.

작업:
1. Customer 로그인 유지

2. 리뷰 작성 플로우:

Step 1: 주문 내역
- http://localhost:5173/my/orders
- 완료된 주문 확인
- "리뷰 작성" 버튼 클릭

Step 2: 리뷰 작성
- /review/write?orderId=xxx
- 별점 선택 (1~5)
- 리뷰 내용 입력
- 사진 업로드 (선택)
- "등록" 버튼 클릭

Step 3: 리뷰 목록
- /reviews
- 내가 작성한 리뷰 확인
- 수정/삭제 버튼 확인

3. 관리자에서 리뷰 확인:
- Owner 로그인
- /admin/reviews
- 고객 리뷰 목록 확인
- 답글 작성 테스트
- 신고 처리 테스트

검증 체크리스트:
[ ] 리뷰 작성 페이지 정상
[ ] 별점 선택 작동
[ ] 텍스트 입력 정상
[ ] Mock 이미지 업로드
[ ] 리뷰 목록 표시
[ ] 관리자 답글 작성 가능

완료 후 "리뷰 시스템 테스트 완료"라고 보고해주세요.
```

---

### Phase 7: Firebase 실제 연동 (선택)

#### Step 17: Firebase 실제 연동 준비

```
Firebase를 실제로 연동할 준비를 해주세요.

⚠️ 이 단계는 실제 Firebase 프로젝트가 있을 때만 진행하세요!

사전 준비:
1. Firebase 콘솔 (https://console.firebase.google.com)
2. hp-kal 프로젝트 선택
3. 프로젝트 설정 → 일반 → 웹 앱 추가
4. Firebase 설정 정보 복사

작업:
1. .env 파일 백업:
   ```bash
   cp .env .env.backup
   ```

2. .env 파일 수정:
   ```env
   VITE_USE_FIREBASE=true
   VITE_FIREBASE_API_KEY=실제_키_입력
   VITE_FIREBASE_AUTH_DOMAIN=hp-kal.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=hp-kal
   VITE_FIREBASE_STORAGE_BUCKET=hp-kal.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=실제_ID
   VITE_FIREBASE_APP_ID=실제_APP_ID
   VITE_FIREBASE_MEASUREMENT_ID=실제_ID
   ```

3. 개발 서버 재시작:
   ```bash
   npm run dev
   ```

4. lib/firebase.ts에서 Firebase 초기화 확인

5. 콘솔에서 Firebase 연결 확인:
   ```javascript
   import { firestore } from './lib/firebase';
   console.log('Firebase initialized:', firestore);
   ```

⚠️ 주의사항:
- 실제 Firebase 키는 절대 커밋하지 마세요!
- .env 파일이 .gitignore에 있는지 확인
- Mock 모드로 되돌리려면 VITE_USE_FIREBASE=false

검증 체크리스트:
[ ] Firebase 프로젝트 정보 복사
[ ] .env 백업 완료
[ ] .env 수정 완료
[ ] 서버 재시작 성공
[ ] Firebase 초기화 성공
[ ] 콘솔 에러 없음

완료 후 Firebase 연결 상태를 리포트해주세요.

⚠️ 실제 키가 없으면 이 단계는 건너뛰고 Mock 모드로 계속 진행하세요!
```

---

#### Step 18: Firestore 데이터 확인 (선택)

```
Firestore 데이터베이스에 실제로 데이터를 읽고 쓰는 테스트를 해주세요.

⚠️ VITE_USE_FIREBASE=true일 때만 진행!

작업:
1. Firebase 콘솔에서 Firestore 확인:
   - https://console.firebase.google.com/project/hp-kal/firestore

2. 테스트용 주문 생성:
   - /menu에서 메뉴 선택
   - 장바구니에 담기
   - 주문하기
   - Firestore에서 orders 컬렉션 확인

3. 관리자에서 주문 확인:
   - /admin/orders
   - 실시간 주문 목록 표시 확인

4. 주문 상태 변경:
   - "접수" → "조리중" → "배달중" → "완료"
   - Firestore 업데이트 확인

검증 체크리스트:
[ ] Firestore 콘솔 접속
[ ] 주문 생성 성공
[ ] orders 컬렉션에 데이터 저장
[ ] 관리자에서 실시간 조회
[ ] 상태 변경 성공
[ ] 실시간 업데이트 작동

완료 후 "Firestore 데이터 테스트 완료"라고 보고해주세요.
```

---

### Phase 8: 프로덕션 준비

#### Step 19: 디버그 코드 제거

```
프로덕션 배포 전에 개발용 디버그 코드를 모두 제거해주세요.

⚠️ 중요: 이 작업은 배포 직전에만 수행하세요!

작업:
1. 디버그 페이지 제거:
   - pages/DevTools.tsx 삭제
   - pages/app/Debug.tsx 삭제

2. App.tsx에서 디버그 라우트 제거:
   ```typescript
   // ❌ 제거할 라우트
   <Route path="/dev" element={<DevTools />} />
   <Route path="/debug" element={<Debug />} />
   ```

3. Header/Navigation에서 디버그 링크 제거:
   - components/Header.tsx 확인
   - components/app/BottomNav.tsx 확인
   - 디버그 페이지로 가는 링크 제거

4. 관리자 대시보드 디버그 버튼 제거:
   - pages/admin/Dashboard.tsx 확인
   - "디버그 모드" 버튼 제거
   - "테스트 데이터 생성" 버튼 제거

5. 콘솔 로그 제거:
   - 모든 파일에서 console.log() 제거 (또는 주석 처리)
   - console.error()는 유지 (에러 추적용)

검증 체크리스트:
[ ] DevTools.tsx 삭제
[ ] Debug.tsx 삭제
[ ] /dev 라우트 제거
[ ] /debug 라우트 제거
[ ] 디버그 링크 제거
[ ] 디버그 버튼 제거
[ ] console.log 제거
[ ] 빌드 에러 없음

완료 후 제거된 파일 목록을 리포트해주세요.
```

---

#### Step 20: 환경변수 최종 확인

```
프로덕션 배포를 위한 환경변수를 최종 확인해주세요.

작업:
1. .env.production 파일 확인 (없으면 생성)

2. 프로덕션 환경변수 설정:
   ```env
   # Firebase (프로덕션)
   VITE_USE_FIREBASE=true
   VITE_FIREBASE_API_KEY=실제_프로덕션_키
   VITE_FIREBASE_AUTH_DOMAIN=hp-kal.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=hp-kal
   VITE_FIREBASE_STORAGE_BUCKET=hp-kal.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=실제_ID
   VITE_FIREBASE_APP_ID=실제_APP_ID
   VITE_FIREBASE_MEASUREMENT_ID=실제_ID

   # 결제 (프로덕션)
   VITE_NICEPAY_MID=실제_가맹점ID
   VITE_NICEPAY_CLIENT_KEY=실제_클라이언트키

   # 배달대행 (프로덕션)
   VITE_PROVIDER_A_API_URL=실제_API_URL
   VITE_PROVIDER_A_API_KEY=실제_API_KEY
   VITE_PROVIDER_A_MERCHANT_ID=실제_MERCHANT_ID

   # 기능 플래그
   VITE_DELIVERY_ENABLED=true
   VITE_DELIVERY_PROVIDER=providerA
   VITE_SUPPORT_ENABLED=true
   VITE_POINTS_ENABLED=true

   # 환경
   VITE_APP_ENV=production
   ```

3. .gitignore 확인:
   ```
   .env
   .env.local
   .env.production
   .env.*.local
   ```

4. Firebase Functions Config 설정 (터미널):
   ```bash
   # 나이스페이 설정
   firebase functions:config:set \
     nicepay.mode="production" \
     nicepay.mid="실제_MID" \
     nicepay.key="실제_KEY"

   # 토스페이먼츠 설정
   firebase functions:config:set \
     toss.mode="production" \
     toss.client_key="실제_CLIENT_KEY" \
     toss.secret_key="실제_SECRET_KEY"

   # 확인
   firebase functions:config:get
   ```

검증 체크리스트:
[ ] .env.production 생성
[ ] 모든 환경변수 입력
[ ] .gitignore 확인
[ ] Functions Config 설정
[ ] 민감 정보 보호 확인

완료 후 "환경변수 최종 확인 완료"라고 보고해주세요.
```

---

#### Step 21: 빌드 및 배포 테스트

```
프로덕션 빌드를 생성하고 배포를 테스트해주세요.

작업:
1. 프로덕션 빌드:
   ```bash
   npm run build
   ```

2. 빌드 결과 확인:
   - dist/ 디렉토리 생성 확인
   - 번들 크기 확인
   - 에러/경고 확인

3. 로컬에서 프로덕션 빌드 테스트:
   ```bash
   npm run preview
   ```

4. 프리뷰 서버 테스트:
   - http://localhost:4173 접속
   - 모든 페이지 정상 작동 확인
   - 성능 확인 (Lighthouse)

5. Firebase 배포 (선택):
   ```bash
   # Functions 배포
   firebase deploy --only functions

   # Hosting 배포
   firebase deploy --only hosting

   # 전체 배포
   firebase deploy
   ```

6. 배포 후 확인:
   - https://hp-kal.web.app 접속
   - 모든 기능 정상 작동 확인

검증 체크리스트:
[ ] npm run build 성공
[ ] dist/ 생성됨
[ ] 번들 크기 적정 (< 1MB)
[ ] 경고 없음
[ ] preview 서버 정상
[ ] Lighthouse 점수 > 90
[ ] (선택) Firebase 배포 성공

완료 후 빌드 결과를 리포트해주세요.
```

---

#### Step 22: 최종 품질 검증

```
프로덕션 배포 전 최종 품질 검증을 수행해주세요.

작업:
1. 디자인 검증:
   ```bash
   npm run design:verify
   ```
   - 브랜드 컬러 확인
   - 타이포그래피 확인
   - 레이아웃 확인

2. 타입 검증:
   ```bash
   npx tsc --noEmit
   ```
   - TypeScript 에러 없음 확인

3. Lint 검증:
   ```bash
   npm run lint
   ```
   - ESLint 에러 없음 확인

4. 테스트 실행 (있으면):
   ```bash
   npm run test
   ```

5. 접근성 검증:
   - Lighthouse 접근성 점수 > 95
   - 키보드 네비게이션 테스트
   - 스크린 리더 테스트

6. 성능 검증:
   - Lighthouse 성능 점수 > 90
   - FCP < 1.8s
   - LCP < 2.5s
   - CLS < 0.1

7. SEO 검증:
   - meta 태그 확인
   - Open Graph 확인
   - sitemap.xml 확인

8. PWA 검증:
   - manifest.json 확인
   - service worker 확인
   - 오프라인 동작 확인
   - 설치 가능 확인

검증 체크리스트:
[ ] 디자인 검증 통과
[ ] TypeScript 에러 없음
[ ] Lint 에러 없음
[ ] 테스트 통과
[ ] 접근성 > 95
[ ] 성능 > 90
[ ] SEO 최적화
[ ] PWA 완벽 작동

완료 후 "최종 품질 검증 완료"라고 보고하고 Lighthouse 점수를 공유해주세요.
```

---

## 5. 디자인 보호 시스템

### 5.1 디자인 잠금 개요

```
목적: 브랜드 컬러와 디자인 시스템을 절대 보호

작동 방식:
1. styles/design-lock.css
   - CSS 변수 강제 고정
   - !important로 오버라이드 방지

2. constants/design-tokens.ts
   - TypeScript 타입 안전성
   - 컴파일 타임 체크

3. main.tsx
   - import './styles/design-lock.css'
   - 앱 시작 시 자동 적용
```

### 5.2 사용 방법

```typescript
// ✅ 방법 1: TypeScript 상수
import { BRAND_COLORS } from '@/constants/design-tokens';
<div style={{ backgroundColor: BRAND_COLORS.hyunpungRed }}>

// ✅ 방법 2: CSS 변수
<div className="bg-[var(--color-hyunpung-red)]">

// ✅ 방법 3: Tailwind 클래스
<div className="bg-hyunpung-red">

// ❌ 절대 금지
<div style={{ backgroundColor: '#D61C1C' }}>
<div className="bg-[#D61C1C]">
```

### 5.3 문제 해결

```bash
# 디자인 깨짐 시
1. npm run design:verify
2. npm run design:lock
3. npm run dev (재시작)

# TypeScript 에러 시
1. npx tsc --noEmit
2. VSCode: Ctrl+Shift+P → "Reload Window"
```

---

## 6. 프로덕션 준비

### 6.1 제거할 항목

```
파일 삭제:
❌ /pages/DevTools.tsx
❌ /pages/app/Debug.tsx

라우트 제거 (App.tsx):
❌ <Route path="/dev" element={<DevTools />} />
❌ <Route path="/debug" element={<Debug />} />

링크 제거:
❌ Header에서 "디버그" 링크
❌ BottomNav에서 "개발" 버튼
❌ Dashboard에서 "디버그 모드" 버튼

코드 정리:
❌ console.log() (대부분)
✅ console.error() (유지)
❌ // TODO
❌ // FIXME
```

### 6.2 환경변수 체크

```env
# 개발 모드
VITE_USE_FIREBASE=false
VITE_APP_ENV=development

# 프로덕션 모드
VITE_USE_FIREBASE=true
VITE_APP_ENV=production
VITE_FIREBASE_API_KEY=실제_키
VITE_NICEPAY_MID=실제_MID
```

### 6.3 배포 체크리스트

```
[ ] 디버그 코드 제거
[ ] 환경변수 설정
[ ] Firebase Functions Config
[ ] npm run build 성공
[ ] npm run preview 테스트
[ ] Lighthouse 점수 > 90
[ ] 접근성 > 95
[ ] SEO 최적화
[ ] PWA 완벽 작동
[ ] firebase deploy
```

---

## 📚 참고 문서

```
프로젝트 이해:
- CURSOR-프로젝트-완벽-이해-가이드.md
- README.md

디자인 시스템:
- DESIGN-LOCK-README.md
- DESIGN-LOCK-QUICK-START.md
- constants/design-tokens.ts

Firebase:
- FIREBASE-연동-완벽-가이드.md
- docs/06-firebase/

결제 시스템:
- PAYMENT-PROVIDER-선택-시스템-가이드.md
- 결제사-선택-시스템-요약.md

배포:
- docs/03-development/02-배포가이드_v1.0.md
- DEPLOYMENT-READY-CHECKLIST.md
```

---

## ✅ 최종 확인

```
프로젝트 이해:
[ ] 아키텍처 이해
[ ] 디렉토리 구조 파악
[ ] 핵심 규칙 숙지

로컬 개발:
[ ] 의존성 설치
[ ] 환경변수 설정
[ ] 디자인 잠금 확인
[ ] 개발 서버 실행
[ ] Mock 인증 테스트

Firebase:
[ ] 설정 파일 확인
[ ] Firestore 구조 이해
[ ] Functions 이해
[ ] (선택) 실제 연동

기능 테스트:
[ ] 관리자 대시보드
[ ] 설정 센터
[ ] 주문 플로우
[ ] 리뷰 시스템
[ ] 결제 시스템

프로덕션:
[ ] 디버그 코드 제거
[ ] 환경변수 최종 확인
[ ] 빌드 테스트
[ ] 품질 검증
[ ] 배포 준비
```

---

**작성: KS컴퍼니 (사업자번호: 553-17-00098)**  
**버전: 2.0**  
**최종 업데이트: 2024-11-08**  

🎉 **이 가이드로 완벽한 로컬 개발을 완성하세요!**
