# T2-22 작업완료보고서 — @orderflow 전체 시나리오 통합 검증 (Firebase)

## 1. 개요
- 일시: 2025-11-16
- 브랜치: `feat/fix-first-20251113`
- 범위: Firebase 기반 주문 흐름 전체(E2E)
- 목표: Checkout → OrderTracking → AdminOrders 전체 흐름 정상 검증

---

## 2. 문제 분석
### 2-1. OrderTracking 진입/상태 전환 점검
- 목표 상태: placed → accepted → cooking → (out_for_delivery | pickup_ready) → done
- 점검 포인트: `order-tracking.page`, `order-tracking.status`, `order-tracking.timeline`, `order-tracking.items`, `order-tracking.total` 가 DOM 상에 안정적으로 표시/갱신되는지

### 2-2. Admin Orders 조회 문제
- 점검 포인트: `/admin/orders` 진입 시 목록 렌더(`admin.orders.page`, `admin.orders.list`)와 신규 주문 노출, 상세 버튼 동작 여부

### 2-3. Cart/Checkout 단계 문제
- 점검 포인트: CartContext 로컬스토리지 스키마 반영 여부(`hyunpung_cart`), `cart.page`/`cart.items`/`cart.method` 가시성, Checkout testId 존재

---

## 3. 변경 파일
| 파일 | 내용 |
|------|------|
| `src/pages/app/MenuList.tsx` | testId 통일(`menu-list.page`, `menu-list.items`, `menu-list.item.*`) |
| `src/e2e/order-flow.spec.ts` | 헬스체크 Plan A 분기, 메뉴 진입 디버그, Cart 주입 스키마 교정, Cart 진입 디버그 |
| `기타` | 필요 시 최소 범위로 testId 보강(Checkout, OrderTracking, AdminOrders)

---

## 4. 핵심 패치 상세
### 4-1. testId 보강
- MenuList: `menu.page` → `menu-list.page`, 목록/아이템 전환 완료
- Cart: 기존 testId(`cart.page`, `cart.items`, `cart.item`, `cart.method`, `cart.button.submit`) 활용
- 필요 시 추가: Checkout/OrderTracking/AdminOrders에 data-testid만 최소 추가(텍스트/레이아웃 변경 금지)

### 4-2. OrderTracking 상태 전환 안정화
- 상태 라벨 포괄 검증: `/주문|접수|조리|배달|포장|완료/`
- 완료 시: `order-complete.page`, `order-complete.message`, `order-complete.order-id` 노출 확인

### 4-3. Checkout/Cart/관리자 페이지 개선(필요 시)
- waitForTimeout 금지, testId 기반 대기(`toBeVisible`, `waitForURL`) 사용

---

## 5. 실행 결과 (작성 시 갱신)

### CLI (`pnpm run test:e2e:orderflow`)
```powershell
Set-Location -Path 'd:\projectsing\hyun-poong\hyunpoong-kal'
$env:VITE_USE_FIREBASE='true'
pnpm run test:e2e:orderflow
```

- PASS/FAIL: (기입)
- 실패 시 기록:
  - 실패 구간 URL: (기입)
  - DOM snippet(앞 400자): (기입)
  - 누락된 testId: (기입)
  - redirect/guard 여부: (기입)

### VSCode Runner
- health-check: skipped (Plan A)
- 주요 페이지 표시 여부: (기입)

---

## 6. 최종 testId 매핑(요약)
- MenuList
  - `menu-list.page`, `menu-list.items`, `menu-list.item`, `menu-list.item.name`, `menu-list.item.price`, (옵션) `menu-list.item.add`
- Cart
  - `cart.page`, `cart.items`, `cart.item`, `cart.method`, `cart.method.radio-delivery`, `cart.method.radio-pickup`, `cart.button.submit`, `cart.summary`
- Checkout
  - (필요 시) `checkout.page`, `checkout.input.phone`, `checkout.checkbox.terms`, `checkout.button.submit`
- OrderTracking
  - `order-tracking.page`, `order-tracking.header`, `order-tracking.status`, `order-tracking.order-id`, `order-tracking.timeline`, `order-tracking.items`, `order-tracking.item`, `order-tracking.total`
  - 완료 시: `order-complete.page`, `order-complete.message`, `order-complete.order-id`
- Admin Orders
  - `admin.orders.page`, `admin.orders.list`, `admin.orders.item.summary`, `admin.orders.item.status`, `admin.orders.item.detail-button`

---

## 7. 결론
- DoD(성공 조건):
  - `pnpm run test:e2e:orderflow` 전체 통과
  - OrderTracking(코어 testId)와 완료 화면 testId 정상 표시
  - Admin Orders에서 신규 주문 조회 및 상세 버튼 동작 확인
- 다음 단계 권장:
  - 실패 지점은 Trace Viewer/디버그 로그(URL/DOM 스니펫) 기반으로 testId 추가/대기 로직 보강
  - Checkout 단계 testId 정규화 필요 시 최소 범위로 보강

---
작성자: GitHub Copilot (AI Assistant)
작성일: 2025-11-16
브랜치: feat/fix-first-20251113

## 8. 품질 체크리스트 (Quality Gate)

| 항목 | 기준 | 결과(체크) |
|------|------|-----------|
| MenuList 표시 | `/menu`에서 `menu-list.page` + 최소 1개 `menu-list.item` 표시 | [ ] |
| Cart 표시 | `/cart`에서 `cart.page` + `cart.items` + `cart.button.submit` 표시 | [ ] |
| Checkout 표시 | Checkout에서 `checkout.page` + `checkout.button.submit` 표시 | [ ] |
| OrderTracking 진행 | `order-tracking.page` + `status` + `timeline` + `items` 표시 | [ ] |
| 완료 화면 표시 | `order-complete.page` + `order-complete.order-id` 표시 | [ ] |
| Admin Orders 표시 | `/admin/orders`에서 `admin.orders.page` + `admin.orders.list` 표시 | [ ] |
| Admin 상세 버튼 | 최소 1개 `admin.orders.item.detail-button` 동작 | [ ] |
| waitForTimeout 제거 | @orderflow 내부에서 waitForTimeout 미사용 | [ ] |
| 스펙-유저플로우 일치 | 실제 유저 흐름(메뉴→장바구니→체크아웃→추적→관리자)와 크게 어긋나는 지름길 없음 | [ ] |