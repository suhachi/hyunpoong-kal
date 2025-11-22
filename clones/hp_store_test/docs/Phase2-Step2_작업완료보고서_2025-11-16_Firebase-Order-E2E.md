# Phase 2 Step 2 작업완료보고서: Firebase + data-testid 기반 Order-flow E2E 신규 작성

## 작업 일시
- 2025-11-16

## 작업 목표
- `src/e2e/order-flow.spec.ts`에 **Firebase + data-testid 기반 E2E 시나리오** 추가
- 고객 주문 생성 → 주문 완료 화면 → 관리자 주문 조회 전체 흐름 검증
- 기존 Mock 기반 `describe.skip` 블록은 그대로 유지 (삭제/수정 금지)
- USE_FIREBASE=true 환경에서만 유효한 시나리오 구현

---

## 변경 파일 목록

### 수정된 파일
- `src/e2e/order-flow.spec.ts`
  - 새로운 describe 블록 추가: `test.describe('@orderflow Firebase Order flow', ...)`
  - 기존 Mock 기반 skip 블록은 변경 없이 유지

### 변경되지 않은 파일 (명시)
- `src/e2e/admin-routes.spec.ts` (수정 안 함)
- `src/e2e/admin-settings.spec.ts` (수정 안 함)
- 기능 코드 (Checkout, Cart, OrderTracking, admin API 등) 모두 수정 안 함

---

## 구현 세부 사항

### 1. 새로운 describe 블록 구조

```typescript
// Phase 2: Firebase + testId 기반 Order-flow E2E
// NOTE: 이 시나리오는 USE_FIREBASE=true 환경에서만 유효하다.
// VITE_USE_FIREBASE=true 로 dev/test 환경을 설정한 뒤 실행할 것.
test.describe('@orderflow Firebase Order flow', () => {
  test('고객 주문이 완료되고 관리자에서 조회된다 (Firebase)', async ({ page, browser }) => {
    // 시나리오 구현
  });
});
```

**주요 특징:**
- `@orderflow` 태그: grep으로 필터링 가능 (`--grep "@orderflow"`)
- USE_FIREBASE=true 환경 필수 (주석으로 명시)
- 단일 테스트 안에서 고객 → 관리자 전체 흐름 검증

---

### 2. 시나리오 상세 흐름

#### 2-1) 1단계: 고객 주문 생성

**로그인/초기화:**
```typescript
// 기존 헬퍼 재사용 (새로운 로그인 방식 발명 금지)
await loginAsCustomer(page);
```

**메뉴 페이지 진입:**
```typescript
await page.goto('/');
await expect(page.getByTestId('menu.page')).toBeVisible({ timeout: 10000 });
```

**장바구니 상태 주입:**
- MenuList에 `add-to-cart` 버튼이 없으므로, localStorage에 직접 장바구니 아이템 세팅
```typescript
await page.evaluate(() => {
  const mockCart = {
    items: [
      {
        menuId: 'menu-001',
        menuName: '닭칼국수',
        menuImage: '/images/menu/chicken-kalguksu.jpg',
        quantity: 1,
        options: { noodle: '보통', spicy: '안맵게' },
        price: 8000,
        subtotal: 8000
      }
    ],
    subtotal: 8000,
    discount: 0,
    finalAmount: 8000
  };
  localStorage.setItem('hyunpung_cart', JSON.stringify(mockCart));
});
```

**Cart 페이지 검증:**
```typescript
await page.goto('/cart');
await expect(page.getByTestId('cart.page')).toBeVisible({ timeout: 10000 });
await expect(page.getByTestId('cart.items')).toBeVisible({ timeout: 10000 });
await expect(page.getByTestId('cart.item').first()).toBeVisible({ timeout: 10000 });
```

**주문 방식 선택 (포장):**
```typescript
await expect(page.getByTestId('cart.method')).toBeVisible({ timeout: 15000 });
await expect(page.getByTestId('cart.method.radio-pickup')).toBeVisible({ timeout: 10000 });
await page.getByTestId('cart.method.radio-pickup').click();
```

**결제하기 버튼 클릭:**
```typescript
await expect(page.getByTestId('cart.button.submit')).toBeVisible({ timeout: 10000 });
await page.getByTestId('cart.button.submit').click();
```

**Checkout 페이지 필수 입력:**
```typescript
await expect(page).toHaveURL(/\/checkout/, { timeout: 10000 });
await page.getByLabel(/전화번호/).fill('010-1234-5678');
await page.locator('#terms').check();
```

**주문 생성 (Firebase):**
```typescript
await page.getByRole('button', { name: /결제하기|주문 확정/ }).click();
await expect(page.getByText(/주문이 접수되었습니다/)).toBeVisible({ timeout: 15000 });
```
- 이 시점에서 `createOrder()` API가 Firestore에 주문 문서 생성

---

#### 2-2) 2단계: 주문 완료 화면 검증

**OrderTracking 페이지 진입:**
```typescript
await expect(page).toHaveURL(/\/order\//, { timeout: 10000 });
```

**주문번호 추출:**
```typescript
const orderNumberElement = page.locator('text=주문번호:').first();
await expect(orderNumberElement).toBeVisible({ timeout: 10000 });
const orderNumberText = await orderNumberElement.textContent();

const orderId = orderNumberText?.split(':').pop()?.trim() || null;
expect(orderId, '주문 ID가 추출되어야 합니다').not.toBeNull();
console.log('생성된 주문 ID:', orderId);
```

**중요 사항:**
- `order-complete.*` testId는 `status='done'`일 때만 렌더링됨
- 초기 상태(`placed`)에서는 일반 주문 추적 화면만 표시
- 따라서 텍스트 기반 셀렉터로 주문번호 추출

---

#### 2-3) 3단계: 관리자 화면에서 주문 확인

**관리자 context 생성:**
```typescript
const adminContext = await browser.newContext();
const adminPage = await adminContext.newPage();
```

**관리자 로그인/초기화:**
```typescript
// 기존 admin E2E에서 사용하는 헬퍼 재사용
await loginAsAdminWithLocalStorage(adminPage);
```

**관리자 주문 목록 진입:**
```typescript
await adminPage.goto('/admin/orders');
await expect(adminPage.getByTestId('admin.orders.page')).toBeVisible({ timeout: 10000 });
await expect(adminPage.getByTestId('admin.orders.list')).toBeVisible({ timeout: 10000 });
```

**Firestore 주문 조회 확인:**
```typescript
if (orderId) {
  // Firestore 쿼리 및 렌더링 시간 고려하여 timeout 증가
  await expect(
    adminPage.getByTestId('admin.orders.item.summary').first()
  ).toBeVisible({ timeout: 20000 });
  
  // 실제 orderId 텍스트가 화면에 표시되는지 확인
  await expect(adminPage.getByText(orderId)).toBeVisible({ timeout: 20000 });
  
  console.log('✓ 관리자 화면에서 주문 확인 완료:', orderId);
}
```

**정리:**
```typescript
await adminContext.close();
```

---

### 3. 셀렉터 전략 (data-testid 우선)

#### Cart 페이지 (src/pages/app/Cart.tsx)
- ✅ `cart.page`: 전체 페이지
- ✅ `cart.items`: 아이템 목록 컨테이너
- ✅ `cart.item`: 개별 아이템
- ✅ `cart.method`: 주문 방식 섹션
- ✅ `cart.method.radio-pickup`: 포장 라디오 버튼
- ✅ `cart.button.submit`: 결제하기 버튼

#### MenuList 페이지 (src/pages/app/MenuList.tsx)
- ✅ `menu.page`: 전체 페이지
- ✅ `menu.card`: 메뉴 카드
- ❌ `menu.card.add-to-cart`: 존재하지 않음 → localStorage 직접 주입으로 우회

#### OrderTracking 페이지 (src/pages/app/OrderTracking.tsx)
- ⚠️ `order-complete.page`: `status='done'`일 때만
- ⚠️ `order-complete.message`: `status='done'`일 때만
- ⚠️ `order-complete.order-id`: `status='done'`일 때만
- ✅ 텍스트 기반 셀렉터 사용: `text=주문번호:` (초기 상태)

#### Admin Orders 페이지 (src/pages/admin/Orders.tsx + OrderTable.tsx)
- ✅ `admin.orders.page`: 전체 페이지
- ✅ `admin.orders.list`: 주문 목록 컨테이너
- ✅ `admin.orders.item`: 개별 주문 아이템
- ✅ `admin.orders.item.summary`: 주문 요약 정보 (orderId 포함)
- ✅ `admin.orders.item.status`: 주문 상태
- ✅ `admin.orders.item.detail-button`: 상세 보기 버튼

---

### 4. 로그인 헬퍼 재사용 (새로운 방식 발명 금지)

#### 고객 로그인
```typescript
async function loginAsCustomer(page: Page, opts?: Partial<LoginOptions>) {
  await page.addInitScript(() => {
    const mockCustomer = {
      uid: 'user-001',
      email: 'customer@example.com',
      displayName: '고객',
      role: 'customer',
      storeId: 'store-hyunpung',
    };
    localStorage.setItem('mockUser', JSON.stringify(mockCustomer));
    localStorage.setItem('mockRole', 'customer');
  });
  // ... (기존 코드)
}
```

#### 관리자 로그인
```typescript
async function loginAsAdminWithLocalStorage(page: Page) {
  await page.addInitScript(() => {
    const mockAdmin = {
      uid: 'admin-001',
      email: 'admin@hyunpoongkalguksu.com',
      displayName: '관리자',
      role: 'owner',
      storeId: 'store-hyunpung',
    };
    localStorage.setItem('mockUser', JSON.stringify(mockAdmin));
    localStorage.setItem('mockRole', 'owner');
  });
  await page.goto(`${ADMIN_BASE_URL}/orders`);
  await expect(page).toHaveURL(/\/admin\/orders/);
}
```

---

## 테스트 실행 방법

### 1. 환경 변수 설정
Firebase 모드 활성화를 위해 `.env` 파일 설정 필요:
```env
VITE_USE_FIREBASE=true
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. Dev 서버 실행
```powershell
pnpm dev
```

### 3. E2E 테스트 실행 (새로운 Firebase 시나리오만)
```powershell
pnpm exec playwright test src/e2e/order-flow.spec.ts --project=chromium --grep "@orderflow"
```

### 4. 모든 order-flow 테스트 실행 (skip 포함)
```powershell
pnpm exec playwright test src/e2e/order-flow.spec.ts --project=chromium
```
- Mock 기반 skip 블록은 실행되지 않음 (의도된 동작)
- Firebase 기반 `@orderflow` 블록만 실행됨

---

## 검증 결과

### 빌드 검증
```powershell
> pnpm build
✓ built in 22.72s
```
- ✅ TypeScript 컴파일 오류 없음
- ✅ 기존 코드와 호환성 유지

### 정적 분석
- ✅ 기존 `describe.skip` 블록 변경 없음
- ✅ 다른 E2E 파일(admin-routes, admin-settings) 수정 없음
- ✅ 기능 코드(Checkout, Cart, OrderTracking, admin API) 수정 없음

### 수동 테스트 체크리스트 (Firebase 환경 필요)

#### 사전 조건
- [ ] Firebase 프로젝트 설정 완료
- [ ] `.env`에 Firebase config 설정
- [ ] VITE_USE_FIREBASE=true 설정
- [ ] Dev 서버 실행 (`pnpm dev`)

#### 시나리오 검증
1. **고객 주문 생성**
   - [ ] 메뉴 페이지 로딩 확인
   - [ ] 장바구니 상태 주입 확인
   - [ ] Cart 페이지 렌더링 확인 (cart.* testId)
   - [ ] 주문 방식 선택 가능 확인
   - [ ] Checkout 페이지 진입 확인
   - [ ] 주문 생성 성공 (토스트 확인)

2. **주문 완료 화면**
   - [ ] OrderTracking 페이지 진입 (/order/:orderId)
   - [ ] 주문번호 표시 확인
   - [ ] orderId 추출 성공

3. **관리자 주문 조회**
   - [ ] 관리자 로그인 성공
   - [ ] /admin/orders 페이지 로딩 (admin.orders.* testId)
   - [ ] Firestore 주문 목록 조회 성공
   - [ ] 고객이 생성한 주문 ID 화면에 표시

4. **Firestore 데이터 확인**
   - [ ] Firebase Console에서 `orders` 컬렉션 확인
   - [ ] 주문 문서 필드 확인 (orderId, status, items, createdAt 등)

---

## 주의 사항 및 제약

### 1. USE_FIREBASE=true 필수
- 이 테스트는 Firebase 환경에서만 의미가 있음
- Mock 모드(USE_FIREBASE=false)에서는 Firestore 연결 실패
- 환경 변수 누락 시 테스트 실패 예상

### 2. testId 제약 사항
- `order-complete.*` testId는 `status='done'`일 때만 렌더링
- 초기 상태(placed)에서는 텍스트 셀렉터 사용 불가피
- 향후 OrderTracking에 초기 상태용 testId 추가 고려

### 3. 장바구니 담기 방식
- MenuList에 `add-to-cart` 버튼 없음
- localStorage 직접 주입으로 우회
- 실제 UI 플로우와 다를 수 있음 (테스트 전용 방식)

### 4. Firestore 쿼리 latency
- 관리자 화면에서 주문 조회 시 timeout 증가 (20초)
- Firestore 쿼리 + 렌더링 시간 고려
- 로컬 환경에서는 빠르지만, CI 환경에서는 더 느릴 수 있음

### 5. 기존 Mock 기반 테스트
- `describe.skip` 블록은 그대로 유지
- Phase 1 기록용 → 삭제 금지
- Firebase 시나리오와 병행 유지

---

## 다음 단계 (Phase 2 후속 작업)

### 1. 실제 Firebase 환경 테스트
- Firebase 프로젝트 설정 후 실제 실행
- Firestore 데이터 생성/조회 확인
- E2E 테스트 통과 확인

### 2. OrderTracking testId 보완 (선택)
- 초기 상태(placed, accepted, cooking)에서도 testId 추가
- `order-tracking.page`, `order-tracking.order-id` 등
- 텍스트 셀렉터 의존도 감소

### 3. 관리자 상태 변경 테스트 추가 (선택)
```typescript
// adminPage에서 상태 변경 → 고객 화면 반영 확인
await adminPage.getByTestId('admin.orders.item.detail-button').first().click();
// 상태 변경 UI 조작 (실제 구현에 맞게)
// 고객 page에서 실시간 업데이트 확인
```

### 4. E2E 안정성 개선
- Flaky 테스트 모니터링
- 타임아웃 최적화
- Retry 전략 추가

### 5. CI/CD 통합
- GitHub Actions에서 Firebase Emulator 사용
- 환경 변수 자동 주입
- E2E 테스트 자동화

---

## 작업 요약

### 추가된 코드
- `src/e2e/order-flow.spec.ts`에 새로운 `describe` 블록 추가 (약 120줄)
- `@orderflow` 태그로 필터링 가능
- Firebase + data-testid 기반 end-to-end 시나리오

### 변경되지 않은 코드
- 기존 Mock 기반 `describe.skip` 블록 (2개)
- 다른 E2E 파일 (admin-routes, admin-settings)
- 기능 코드 (모든 src/pages, src/lib, src/components)

### 빌드 결과
- ✅ pnpm build 성공 (22.72초)
- ✅ TypeScript 오류 없음

### 검증 상태
- ✅ 정적 분석 완료
- ⏳ 실제 Firebase 환경 테스트 대기 (Firebase config 설정 후)

---

## 참고 문서
- [Phase2-Step1_작업완료보고서_2025-11-16_Firebase-실주문-흐름-연결.md](./Phase2-Step1_작업완료보고서_2025-11-16_Firebase-실주문-흐름-연결.md)
- [T2-15_작업완료보고서_2025-11-16.md](./T2-15_작업완료보고서_2025-11-16.md)
- [T2-16_작업완료보고서_2025-11-16_Cart-testId-적용.md](./T2-16_작업완료보고서_2025-11-16_Cart-testId-적용.md)
- [TESTID_STRATEGY_OrderFlow_2025-Phase2.md](./TESTID_STRATEGY_OrderFlow_2025-Phase2.md)
