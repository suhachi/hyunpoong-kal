# 남아있는 작업 목록 및 우선 순위 (2025-11-16)

## 개요
- 목표: 지난 T2-13 작업 중단 지점에서부터 이어서 진행할 작업을 정리합니다.
- 핵심 문제: E2E(Mock)에서 Cart 페이지의 localStorage→React state 동기화 타이밍 문제로 `#pickup` 라디오가 늦게 표시되어 Playwright 타임아웃이 발생.

---

## 오늘(우선) 처리 항목
1. 로컬 수동 테스트 (완료 - TODO)
   - pnpm run dev로 로컬 서버를 띄우고, 브라우저에서 전체 주문/결제 플로우를 수동 진행하여 Cart hydration 시간 측정.
   - 확인: `#pickup` / `#delivery` 라디오 노출 타이밍, 스피너 표시 여부, localStorage 값 및 React state 변화 확인 (console.log 필요).

2. Playwright E2E 테스트(현행) 재실행
   - 현재 실패 중인 테스트: `order-flow.spec.ts` 내 두 개 테스트.
   - 조치: `page.goto('/cart', { waitUntil: 'domcontentloaded' })` + `page.waitForLoadState('networkidle')` 및 `await expect(locator).toBeVisible({ timeout: 15000 });` 추가.
   - 예상 소요: 5~15분

3. Firebase 모드 전환 및 E2E 테스트 실행 (진행 예정)
   - 목적: Mock 모드(localStorage)에서 발생하는 타이밍 문제를 실 백엔드(서버 동기화)로 대체하여 재현 여부를 확인.
   - 세부작업:
     - `.env` 또는 환경 설정에서 `USE_FIREBASE=true` 활성화
     - Firestore에 테스트 주문을 기록하는 로직 경로 확인(ordersRepository 등)
     - Playwright 실행 시 환경변수 주입
   - 예상 소요: 30분 ~ 1시간

---

## 중간 우선 순위 (수일 내 진행)
1. CartContext 초기화 방식 개선(구조 변경)
   - 후보: `useLayoutEffect`를 사용해 첫 렌더 전에 localStorage를 반영하거나 초기 items를 `prefetchItems()`로 미리 로드
   - 파일: `src/contexts/CartContext.tsx`, `src/pages/app/Cart.tsx` (isHydrating 로직 재검토)
   - 예상 소요: 1~2시간(추가 테스트 포함)

2. Playwright 테스트 안정화 (테스트 전용 헬퍼)
   - 후보: 테스트 플래그 `?e2e=1`을 처리하여 테스트 환경에서 Cart 동기화를 강제
   - 목적: Mock 환경에서만 발생하는 race condition을 테스트 전용으로 회피하여 E2E 신뢰성 확보
   - 예상 소요: 30분

3. ordersRepository / Firebase 구현 보완
   - Firestore와의 읽기/쓰기 인터페이스 확인 및 에러 케이스 핸들링 강화
   - 관련 파일: `src/lib/orders.api.ts`, `src/lib/firebase.*`
   - 예상 소요: 30분 ~ 2시간

---

## 저우선/향후 계획
- React StrictMode로 인한 마운트 2회 확인 및 필요 시 테스트 빌드에서 제한
- `Cart.tsx`의 `isHydrating` 제거 또는 안전한 default값 적용
- Playwright에서 불필요한 body text 체크 제거 (이미 반영됨)
- 문서 정리 및 PR 제출

---

## 검증 방법 및 종료 조건
- 로컬 수동 플로우: Cart에서 `#pickup` 라디오가 정상적으로 표시되고 결제가 정상 이루어짐을 수동 확인
- E2E: production/USE_FIREBASE=true 환경에서 `order-flow.spec.ts` 전 테스트 통과
- PR: 변경사항이 `feat/fix-first-20251113` 브랜치에 머지되고 dev 서버에서 재검증

---

## 추가 메모
- 문제는 주로 Mock 환경과 E2E 런너의 배치/타이밍 차이에 의한 것으로, 근본적으로 Context 초기화 시점을 더 빨리 가져오거나 테스트에서 명시적으로 sync 될 때까지 대기하면 해결할 가능성이 높음.

---

## 담당 및 예상 시간
- 담당: 개발팀(AI Assistant + 엔지니어)
- 우선순위 높은 항목 합계: 약 2~4 시간


파일 경로: `docs/Remaining_Tasks_2025-11-16.md`
