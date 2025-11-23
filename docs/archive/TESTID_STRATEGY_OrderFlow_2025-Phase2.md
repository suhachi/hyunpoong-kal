# TESTID_STRATEGY_OrderFlow_2025-Phase2

## 1. 목적

Order-flow 전 구간(E2E)을 텍스트/레이아웃 변경에 영향받지 않고 안정적으로 테스트하기 위해,
Cart/Checkout/주문 완료/관리자 주문 목록 화면에 공통 data-testid 규칙을 적용한다.

Phase 2에서는 Firebase 실주문 흐름 기준으로 Order-flow E2E를 재작성한다.

모든 E2E는 `getByTestId()`를 우선 사용하고, 텍스트 셀렉터 의존은 최소화한다.

## 2. 네이밍 규칙

### 2.1 속성

- 테스트 식별자는 항상 `data-testid` 사용
- `id`/`class`/`name` 등은 그대로 유지하고, `data-testid`만 "테스트 전용"으로 추가

### 2.2 형식

- 소문자 + kebab-case
- `.`(dot) 로 "영역.컴포넌트.의미" 구분

**예:**
- `menu.card.add-to-cart`
- `cart.method.radio-delivery`
- `cart.button.submit`
- `admin.orders.item.status`

### 2.3 공통 원칙

- 화면명으로 시작: `menu`, `cart`, `checkout`, `order-complete`, `admin.orders` 등
- 하나의 역할에 하나의 testId (동일 역할 요소가 여러 개면 `nth()` 또는 `first()`/`last()`로 구분)
- UI 문구("주문 방식", "완료되었습니다" 등)에 의존하지 않음

## 3. 화면별 testId 설계

### 3.1 메뉴 목록 화면 (고객)

| 영역 | 역할 | testId | 비고 |
|------|------|--------|------|
| 페이지 루트 | 메뉴 페이지 전체 | `menu.page` | 적용 ✅ |
| 카드 래퍼 | 단일 메뉴 카드 | `menu.card` | 적용 ✅ |
| 메뉴명 | 메뉴 이름 텍스트 | `menu.card.name` | 적용 ✅ |
| 가격 | 메뉴 가격 | `menu.card.price` | 적용 ✅ |
| 담기 버튼 | 장바구니 담기 버튼 | `menu.card.add-to-cart` | 현재 MenuList엔 담기 버튼 없음 (MenuDetail 등 후속 적용 예정) |

**예시 (TSX):**
```tsx
<div data-testid="menu.page">
  {menus.map(menu => (
    <div key={menu.id} data-testid="menu.card">
      <div data-testid="menu.card.name">{menu.name}</div>
      <div data-testid="menu.card.price">{menu.price}</div>
      <button
        data-testid="menu.card.add-to-cart"
        onClick={() => handleAddToCart(menu)}
      >
        담기
      </button>
    </div>
  ))}
</div>
```

### 3.2 Cart 페이지

| 영역 | 역할 | testId |
|------|------|--------|
| 페이지 루트 | Cart 페이지 전체 | `cart.page` |
| 헤더 | "장바구니" 타이틀 영역 | `cart.header` |
| 아이템 리스트 | 장바구니 아이템 리스트 래퍼 | `cart.items` |
| 단일 아이템 래퍼 | 개별 아이템 | `cart.item` |
| 아이템 이름 | 아이템 이름 | `cart.item.name` |
| 수량 | 수량 표시 | `cart.item.quantity` |
| 금액 | 아이템 금액/합계 | `cart.item.total` |
| 주문 방식 섹션 | 배달/포장 선택 영역 | `cart.method.section` |
| 배달 라디오 | 배달 라디오 버튼 | `cart.method.radio-delivery` |
| 포장 라디오 | 포장 라디오 버튼 | `cart.method.radio-pickup` |
| 요청사항 입력 | 요청사항 textarea/input | `cart.input.requests` |
| 결제 버튼 | 결제/주문 버튼 | `cart.button.submit` |

**E2E에서 기대하는 사용 예:**
```typescript
await expect(page.getByTestId('cart.page')).toBeVisible();

await expect(page.getByTestId('cart.method.section')).toBeVisible();
await expect(page.getByTestId('cart.method.radio-delivery')).toBeVisible();
await expect(page.getByTestId('cart.method.radio-pickup')).toBeVisible();

await page.getByTestId('cart.button.submit').click();
```

### 3.3 주문 완료 화면 (고객)
현재 별도 `OrderComplete.tsx` 파일이 없으며 주문 완료(결제/상태 완료)는 `OrderTracking.tsx` 내 `order.status === 'done'` 상태에서 표시됨.

`OrderTracking`에 조건부로 아래 testId가 부여됨:

| 영역 | 역할 | testId | 조건 | 비고 |
|------|------|--------|------|------|
| 페이지 루트 | 주문 완료 페이지 전체 | `order-complete.page` | `order.status === 'done'` | 적용 ✅ (조건부) |
| 완료 메시지 | 완료 상태 라벨 | `order-complete.message` | `order.status === 'done'` | 적용 ✅ (조건부) |
| 주문번호/요약 | 주문 ID 표시 | `order-complete.order-id` | `order.status === 'done'` | 적용 ✅ (조건부) |
| 홈/목록 이동 버튼 | 홈 이동 | `order-complete.button-gohome` | - | 해당 전용 버튼 미구현 (추가 시 적용 예정) |

### 3.4 관리자 주문 목록 화면
`AdminOrders.tsx` + `OrderTable.tsx` 조합으로 렌더링되며 두 레이아웃(데스크톱 테이블 / 모바일 카드)에 공통 testId 부여.

| 영역 | 역할 | testId | 비고 |
|------|------|--------|------|
| 페이지 루트 | 관리자 주문 목록 페이지 | `admin.orders.page` | 적용 ✅ |
| 리스트 래퍼 | 주문 리스트 전체 | `admin.orders.list` | 적용 ✅ |
| 주문 카드/행 | 단일 주문 항목 (row/card) | `admin.orders.item` | 적용 ✅ (테이블/모바일 둘 다) |
| 주문 번호/요약 | 주문 ID/전화 등 요약 | `admin.orders.item.summary` | 적용 ✅ |
| 주문 상태 | 상태 badge | `admin.orders.item.status` | 적용 ✅ |
| 주문 상세 버튼 | 상세 보기 버튼 | `admin.orders.item.detail-button` | 적용 ✅ |

## 4. E2E 예시 (Phase 2 기준 템플릿)

Firebase 실주문 흐름 + data-testid 기반 Order-flow E2E 초안

```typescript
test('고객이 메뉴를 주문하면 관리자 주문 목록에서 보인다 (Firebase)', async ({ page }) => {
  // 1) 메뉴 페이지 진입
  await page.goto('/');
  await expect(page.getByTestId('menu.page')).toBeVisible();

  // 2) 첫 번째 메뉴를 장바구니에 담기
  await page.getByTestId('menu.card.add-to-cart').first().click();

  // 3) Cart 페이지로 이동
  await page.goto('/cart');
  await expect(page.getByTestId('cart.page')).toBeVisible();

  // 4) 주문 방식 확인 (배달/포장 라디오)
  await expect(page.getByTestId('cart.method.section')).toBeVisible();
  await expect(page.getByTestId('cart.method.radio-delivery')).toBeVisible();
  await expect(page.getByTestId('cart.method.radio-pickup')).toBeVisible();

  // 5) 결제/주문 버튼 클릭
  await page.getByTestId('cart.button.submit').click();

  // 6) 주문 완료 페이지 확인
  await expect(page.getByTestId('order-complete.page')).toBeVisible();
  const orderId = await page.getByTestId('order-complete.order-id').textContent();

  // 7) 관리자 화면에서 해당 주문 존재 여부 확인
  // (여기부터는 관리자 로그인/이동 로직 구현 후 연결)
  await page.goto('/admin/orders');
  await expect(page.getByTestId('admin.orders.page')).toBeVisible();
  await expect(page.getByTestId('admin.orders.list')).toBeVisible();

  // 주문 ID 또는 요약 텍스트로 필터링/검증 로직 구현 예정
  // 예: await expect(page.getByTestId('admin.orders.item.summary')).toContainText(orderId!);
});
```

## 5. 운영 가이드 (Phase 2용 메모)

### UI 수정 시 원칙

- 텍스트/레이블/순서가 바뀌어도 `data-testid`는 변경하지 않는 것을 기본 원칙으로 한다.
- 불가피하게 구조를 크게 바꿀 경우:
  - testId 전략 문서 → 컴포넌트 → E2E 순으로 같이 업데이트.

### 신규 컴포넌트 추가 시

- Order-flow(고객/관리자)에 포함되는 경우, 반드시 `data-testid` 부여.
- 네이밍은 이 문서의 패턴(화면.블록.역할)을 그대로 따른다.

### 기존 skip 처리된 Order-flow E2E

- `src/e2e/order-flow.spec.ts`의 `test.describe.skip('Order flow (Mock, payment OFF)', …)` 블록은
  Phase 2에서 Firebase 실주문 + data-testid 기반 시나리오로 완전히 교체한 뒤 skip을 제거한다.

---

**작성일:** 2025-11-16  
**브랜치:** feat/fix-first-20251113  
**관련 문서:** docs/T2-15_Cart_E2E_Summary_2025-11-16.md, docs/PROJECT_EVALUATION_2025-11-16.md

## 6. 적용 현황 (2025-11-16 기준)

- Cart 페이지: ✅ testId 적용 완료 (기존 T2-16)
- 메뉴 목록 페이지: ✅ `menu.page`, `menu.card`, `menu.card.name`, `menu.card.price` 적용. 담기 버튼은 현재 UI 없음 → 추후 상세/추가 기능 시 `menu.card.add-to-cart` 적용 예정.
- 주문 완료 페이지: ✅ 조건부(`order.status === 'done'`)로 `order-complete.page`, `order-complete.message`, `order-complete.order-id` 적용. 전용 홈 이동 버튼 미구현.
- 관리자 주문 목록 페이지: ✅ `admin.orders.page`, `admin.orders.list`, `admin.orders.item`, `admin.orders.item.summary`, `admin.orders.item.status`, `admin.orders.item.detail-button` 적용.
- Order-flow E2E: ⏳ Phase 2에서 Firebase + testId 기반 재작성 예정 (현재 describe.skip 상태 유지)

## 7. 간단 검증 가이드

1. 타입/빌드: `pnpm build` 수행 후 오류 없음 확인.
2. 브라우저 DevTools Elements에서 각 페이지 진입 후 testId 존재 여부 확인.
3. 기존 기능(네비게이션, 주문 상태 표시, 관리자 상태 변경 등) 동작 동일성 확인.
4. 누락 예정 항목: `menu.card.add-to-cart`, `order-complete.button-gohome` (추후 UI 추가 시 반영).

## 8. OrderTracking (고객 주문 추적 화면) — Phase 2 보강

Firebase 기반 실주문 흐름(E2E @orderflow)에서 텍스트 셀렉터 대신 아래 testId를 사용해 안정성 확보. 상태(`placed` / `accepted` / `cooking` / `out_for_delivery` / `pickup_ready` / `done`) 어느 것이든 공통 testId가 유지되도록 구성한다. 완료(`done`) 상태에만 추가로 `order-complete.*` 계열이 표시된다.

| testId                       | 설명                              | 비고                          |
|-----------------------------|-----------------------------------|-------------------------------|
| `order-tracking.page`       | 주문 추적 페이지 최상위 컨테이너  | 모든 상태 공통               |
| `order-tracking.header`     | 상단 상태/타이틀 카드 래퍼        | 아이콘+상태라벨+주문번호 포함 |
| `order-tracking.status`     | 현재 주문 상태 라벨               | 한글 라벨 (예: 주문 접수)     |
| `order-tracking.order-id`   | 주문번호 표시 영역                | “주문번호: XXXX” 텍스트 포함 |
| `order-tracking.timeline`   | 단계별 진행 타임라인 컨테이너     | 배달/포장 분기 모두 포함     |
| `order-tracking.items`      | 주문 메뉴 리스트 전체 래퍼        |                               |
| `order-tracking.item`       | 개별 메뉴 항목                    | 반복 요소                     |
| `order-tracking.total`      | 최종 결제 금액/요약 영역          | PriceBreakdown 래핑          |
| `order-complete.page`       | 주문 완료 화면 컨테이너           | status === 'done' 일 때만    |
| `order-complete.message`    | 완료 메시지 텍스트                | status === 'done' 조건부     |
| `order-complete.order-id`   | 완료 화면 주문번호 표시           | 선택(존재 시 표시)           |

> 권장: OrderTracking E2E에서는 텍스트 셀렉터 대신 위 testId 사용.


