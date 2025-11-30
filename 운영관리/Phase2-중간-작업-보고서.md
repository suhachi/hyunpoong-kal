# Phase 2: Production-Level Code Quality Update - 중간 작업 보고서

**날짜**: 2025년 11월 30일
**작성자**: AI Assistant
**상태**: 진행 중 (In Progress)

---

## 1. 개요 (Executive Summary)

"Phase 2: Production-Level Code Quality Update Roadmap"에 따라 프로젝트의 코드 품질을 프로덕션 수준으로 끌어올리기 위한 작업을 진행하고 있습니다. 현재 **T3(Type Stabilization Part 1)**, **T5(Functions Refactoring)**, **T6(Unit Testing)** 작업이 완료되었으며, **T2(Lint & Format)** 단계에서 중요한 잠재적 런타임 오류(React Hooks 규칙 위반)를 발견하여 이에 대한 대응을 준비 중입니다.

## 2. 완료된 작업 상세 (Completed Tasks)

### ✅ T3. Type Stabilization (Part 1) - `any` 타입 제거 및 API 반환 타입 명시
프로젝트 전반에 걸쳐 남발되어 있던 `any` 타입을 제거하고, 명확한 인터페이스와 타입 가드(Type Guards)를 적용했습니다. 특히 API 함수들이 `Promise<any>` 대신 `Promise<Order[]>`, `Promise<string>` 등 구체적인 타입을 반환하도록 리팩토링하여 안정성을 확보했습니다.

*   **주요 변경 파일**:
    *   `src/lib/admin/orders.api.ts`: `fetchOrders` 등의 필터링 로직에서 `any` 제거 및 `unknown` 타입 가드 적용.
    *   `src/lib/orders.repository.ts`: `LocalOrdersRepository`의 반환 타입 명시 및 `Order` 인터페이스 준수.
    *   `src/lib/auth/phone.ts`: Firebase Auth 에러 핸들링 시 `any` 대신 `AuthError` 인터페이스 정의 및 사용.
    *   `src/lib/storage.ts`: 파일 업로드/삭제 로직의 에러 핸들링 타입 강화.
    *   `src/lib/firebase.ts`: Firebase 설정 및 `storageBucket` 검증 로직 강화.
    *   `src/lib/fcm.ts`: FCM 토큰 발급 및 메시지 수신부의 타입 명확화.
    *   `src/lib/kakaoMaps.ts`: `window.kakao` 객체에 대한 `KakaoSDK` 인터페이스 정의.
    *   `src/lib/utils/pwa.ts`: Service Worker 및 `BeforeInstallPromptEvent` 타입 정의.
    *   `src/lib/utils/performance.ts`: 성능 측정 유틸리티의 제네릭 타입 강화.
    *   `src/lib/admin/menus.api.ts`: 메뉴 생성/수정 시 `Partial<Menu>` 및 `CustomOption` 타입 체크 강화.
    *   `src/lib/admin/reviews.api.ts`: 리뷰 데이터 변환 로직의 타입 안전성 확보.
    *   `src/lib/admin/support.api.ts`: 채팅 세션/메시지 타입 명시.
    *   `src/functions/src/lib/points.ts`: 서버 사이드 포인트 로직의 타입 정리.

### ✅ T5. Functions Refactoring - Cloud Functions 코드 정리
Firebase Cloud Functions의 결제 관련 로직(NICEPAY)과 에러 핸들링을 개선했습니다.

*   **주요 내용**:
    *   `src/functions/src/index.ts`: 모든 Callable Function의 `try-catch` 블록에서 `error: any`를 제거하고 `instanceof Error` 체크 적용.
    *   `src/functions/src/payments/nicepay-handlers.ts`: 결제 승인/취소 핸들러의 반환 타입 명시 (`PaymentResult`).
    *   `src/lib/functions.ts`: 클라이언트 측 Functions 호출 래퍼 함수의 제네릭 반환 타입 적용.

### ✅ T6. Unit Testing - 핵심 비즈니스 로직 테스트
Vitest를 도입하고, 결제 금액 계산 및 주문 상태 변경 등 핵심 로직에 대한 단위 테스트를 작성했습니다.

*   **설정**: `vitest.config.ts`, `src/test/setup.ts` 생성 (JSDOM 환경).
*   **테스트 파일**: `src/test/order-logic.test.ts`
*   **커버리지**:
    *   `calculateEarnPoints`: 포인트 적립 계산 로직 검증.
    *   `calculateReviewPoints`: 리뷰 포인트(포토/텍스트) 계산 검증.
    *   `getMenuStatus`: 운영 시간 및 품절 상태에 따른 메뉴 상태 계산 검증.
    *   `formatPrice`, `formatRelativeTime`: 포맷팅 유틸리티 검증.
    *   `getOrderStatusLabel`: 관리자/고객용 주문 상태 라벨 반환 검증.
*   **결과**: 작성된 11개 테스트 케이스 모두 통과 (All tests passed).

### ✅ T2. Lint & Format Introduction (진행 중)
코드 품질 자동 검사를 위한 ESLint 설정을 최신 버전(v9) 기준으로 초기화했습니다.

*   **설정**: `eslint.config.js` 생성 (Flat Config 적용).
*   **플러그인**: `react`, `react-hooks`, `react-refresh`, `typescript-eslint` 설정.
*   **스크립트**: `npm run lint`, `npm run lint:fix` 추가.

---

## 3. 발견된 중요 이슈 (Critical Findings)

Lint 검사(`npm run lint`)를 수행하는 과정에서 **애플리케이션의 안정성을 위협하는 치명적인 코드 패턴**이 발견되었습니다. 이는 즉각적인 수정이 필요합니다.

### 🚨 Critical: React Hooks 규칙 위반 (Conditional Hooks)
React Hooks(`useState`, `useEffect`, `useRef` 등)는 조건문(if) 안에서 호출되거나, 리턴문 이후에 호출되어서는 안 됩니다. 이는 React의 렌더링 순서를 꼬이게 하여 예측 불가능한 버그를 유발합니다.

*   **발견된 파일**:
    *   `src/pages/app/Checkout.tsx`: 조건부 렌더링(`if (loading) return ...`) 이후에 Hooks가 호출되고 있음.
    *   `src/pages/app/OrderTracking.tsx`: 다수의 `useState`와 `useEffect`가 조건문 내부 또는 리턴문 이후에 위치함.
    *   `src/pages/app/Support.tsx`, `src/pages/admin/Support.tsx`: `useEffect`가 조건부로 호출됨.
    *   `src/lib/coupons.api.ts`: 비동기 함수 내부 혹은 조건부로 커스텀 훅(`useCouponMock`)이 호출됨.

### ⚠️ Warning: 기타 품질 이슈
*   **Unused Variables**: 사용되지 않는 변수가 다수 존재하여 코드의 가독성을 해치고 있습니다.
*   **Fast Refresh 제약**: 일부 파일에서 컴포넌트 외의 상수를 export하여 HMR(Hot Module Replacement)이 제대로 동작하지 않을 수 있습니다.

---

## 4. 향후 작업 계획 (Next Steps)

### 1단계: 긴급 수정 (Priority: Highest)
*   **[T2-Fix] React Hooks 규칙 위반 수정**: `Checkout.tsx`, `OrderTracking.tsx` 등에서 Hooks 호출 순서를 최상단으로 이동시키고, 조건부 로직을 Hooks 내부나 렌더링 로직으로 변경합니다. 이 작업 없이는 프로덕션 배포 시 런타임 에러 발생 위험이 매우 높습니다.

### 2단계: 구조 및 데이터 개선 (Priority: High)
*   **[T4] Type Stabilization (Part 2)**: `Review`와 `Order` 데이터 구조의 불일치를 해결하고, Enum(`OrderStatus`, `PaymentMethod`) 사용을 전역적으로 강제합니다.
*   **[T7] Structural Refactoring**: 상대 경로(`../../`)로 된 import 문을 절대 경로(`@/`)로 표준화하여 유지보수성을 높입니다.

### 3단계: 성능 및 문서화 (Priority: Medium)
*   **[T8] Performance Optimization**: 번들 사이즈 분석 및 Lazy Loading 적용.
*   **[T9] Documentation**: 개발자 가이드 및 API 문서화.

---

위 보고서를 바탕으로, 가장 시급한 **React Hooks 규칙 위반 수정** 작업을 최우선으로 진행하겠습니다.

