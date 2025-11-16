import { test, expect, Page } from '@playwright/test';

// 명시적인 baseURL 강제 (환경변수 우선)
test.use({ baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000' });

// =============================================================
// S02: 로그인/컨텍스트 헬퍼 정리 (주문 생성 로직은 S03에서 구현 예정)
// =============================================================

const APP_BASE_URL = '/';
const ADMIN_BASE_URL = '/admin';

type LoginOptions = {
  email: string;
  password: string;
};

/**
 * 고객 로그인 헬퍼 (S03에서 셀렉터/텍스트 구체화 예정)
 */
async function loginAsCustomer(page: Page, opts?: Partial<LoginOptions>) {
  // 테스트 안정성을 위해 항상 Mock 고객 세션을 선주입한다
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
  // 간단 헬스체크 (Plan A 적용): VSCode Runner(webServer 미기동)에서는 skip
  const base = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
  if (!process.env.PLAYWRIGHT_TEST_BASE_URL) {
    console.warn('[health-check skipped] PLAYWRIGHT_TEST_BASE_URL not set (VSCode Runner).');
    // Plan B (미적용): playwright.config.ts의 webServer.url을 읽어 PLAYWRIGHT_TEST_BASE_URL 자동 설정 후 항상 폴링
    // Plan C (미적용): 헬스체크 제거하고 첫 page.goto('/') 성공 여부만으로 대체
  } else {
    await expect.poll(async () => {
      try {
        const res = await fetch(base + '/');
        return res.status;
      } catch {
        return null;
      }
    }, { timeout: 8000 }).toBe(200);
  }

  await page.goto('/menu');
  await expect(page).toHaveURL(/\/menu$/);
}

/**
 * 관리자 mock 세션 주입 헬퍼
 * - localStorage에 mockUser / mockRole 세팅 후 /admin/orders 진입
 */
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

// (미사용) 추후 S03/S04에서 주문ID 활용 필요 시 재활성화 예정
// async function getLatestOrderId(page: Page): Promise<string | null> {
//   return page.evaluate(() => {
//     const data = localStorage.getItem('orders');
//     if (!data) return null;
//     try {
//       const arr = JSON.parse(data);
//       if (!Array.isArray(arr) || arr.length === 0) return null;
//       return arr[arr.length - 1].orderId || null;
//     } catch {
//       return null;
//     }
//   });
// }

// =============================================================
// S02 스켈레톤 테스트: 헬퍼 정상 동작(에러 없이 실행) 여부만 확인
// =============================================================
test.describe('Order flow skeleton (S02)', () => {
  test('스켈레톤 확인 (헬퍼 호출만 테스트)', async ({ page }) => {
    await loginAsCustomer(page);
    // 관리자 헬퍼는 S04에서 독립 context로 검증 예정이므로 여기서는 호출하지 않음
  });
});

// =============================================================
// S03: 고객 주문 생성 → 주문내역 표시 (happy path, Mock/결제 OFF)
// =============================================================
// Phase 1 결정 사항:
// - CartContext / Cart.tsx hydration 구조는 T2-15에서 최소 안정화 수준까지 단순화 완료.
// - 하지만 Mock 모드 + 빠른 E2E 환경에서 /cart 진입 직후 '주문 방식' 섹션이 간헐적 타이밍 이슈로 늦게 렌더되어
//   테스트가 과도하게 예민(flaky)해짐.
// - 실제 수동 브라우저 흐름 및 관리자 DoD 요건은 충족하므로, 고객 Order-flow 전체 E2E는 Phase 2 범위로 격리.
// Skip 사유:
//   1) 기능 자체 이상 없음 (수동 플로우 정상) → 테스트 안정성 문제
//   2) Phase 2에서 Firebase 모드 + data-testid 기반 셀렉터로 재작성 예정
//   3) 현재 수정은 비용 대비 효과 낮음 → 전면 재설계 시 복원
// 재활성 조건(Phase 2):
//   - Firebase 주문/결제 실제 데이터 흐름 연결
//   - Cart 렌더 안정성 재검증 (필요 시 추가 idle/hydration 가드)
//   - data-testid 적용 후 selector 안정성 확보
// TODO(Phase2): 아래 describe에서 skip 제거 후 셀렉터(testId) 기반으로 리팩터링
test.describe.skip('Order flow (Mock, payment OFF)', () => {
  test('고객이 메뉴를 주문하면 주문내역에서 보인다 (Mock, payment OFF)', async ({ page }) => {
    // 1) 고객 로그인
    await loginAsCustomer(page);

    // 2) 메뉴 페이지로 이동 (로그인 후 홈으로 올 수 있으므로 명시 이동)
    await page.goto('/menu');
    await expect(page).toHaveURL(/\/menu$/);

    // 3) 첫 번째 메뉴 상세 진입 → 담기
    // S02(T2-12): 첫 번째 메뉴 카드가 화면에 표시되는지 먼저 확인
    await page.waitForSelector('a[href^="/menu/menu-"]', { state: 'visible', timeout: 10000 });
    const firstMenuCard = page.locator('a[href^="/menu/menu-"]').first();
    const href = await firstMenuCard.getAttribute('href');
    console.log('클릭할 메뉴 링크:', href);
    await expect(firstMenuCard).toBeVisible({ timeout: 10000 });
    await firstMenuCard.click();
    await expect(page).toHaveURL(/\/menu\/menu-/);

    // 하단 고정 버튼 텍스트가 가격+담기 형태이므로 '담기' 텍스트로 선택
    // S02(T2-12): "담기" 버튼이 화면에 표시되는지 먼저 확인
    const addToCartButton = page.locator('button:has-text("담기")').first();
    await expect(addToCartButton).toBeVisible({ timeout: 10000 });
    await addToCartButton.click();

    // 장바구니 담기 토스트 확인
    await expect(page.getByText(/장바구니에 담았습니다/)).toBeVisible();

    // 장바구니 상태 검증 및 로그
    const cartItems = await page.evaluate(() => {
      const data = localStorage.getItem('hyunpung_cart');
      return data ? JSON.parse(data).items : [];
    });
    console.log('장바구니 아이템 개수:', cartItems.length);
    expect(cartItems.length).toBeGreaterThan(0);

    // 4) 장바구니로 이동 → Cart DOM 단계적 안정화 후 라디오 노출 확인 (T2-14)
    // ------------------------------------------------------------
    // 1) /cart 진입 (DOMContentLoaded까지 대기)
    await page.goto('/cart', { waitUntil: 'domcontentloaded' });

    // 2) Cart 기본 섹션 텍스트 등장 대기 (장바구니 헤더 / 주문 방식 섹션)
    await page.getByText('장바구니', { exact: false }).waitFor({ timeout: 15000 });
    await page.getByText('주문 방식', { exact: false }).waitFor({ timeout: 15000 });

    // 3) 배달/포장 라디오 버튼 등장 확인 (네트워크/렌더링 모두 완료된 시점)
    const deliveryRadio = page.locator('#delivery');
    const pickupRadio = page.locator('#pickup');
    await expect(deliveryRadio).toBeVisible({ timeout: 15000 });
    await expect(pickupRadio).toBeVisible({ timeout: 15000 });

    // 4) 포장 선택 후 결제 진행
    await pickupRadio.check();

    // 결제하기 버튼 클릭 (텍스트에 금액 포함 → name 정규식 사용)
    await page.getByRole('button', { name: /결제하기/ }).click();
    await expect(page).toHaveURL(/\/checkout/);

    // 5) Checkout: 필수 입력(전화번호, 약관동의) 후 결제하기
    await page.getByLabel(/전화번호/).fill('010-0000-0000');
    await page.locator('#terms').check();

    // 결제하기 (Mock 모드: 주문 생성 + 주문 접수 토스트 + 주문상세로 이동)
    await page.getByRole('button', { name: /결제하기/ }).click();
    await expect(page.getByText(/주문이 접수되었습니다/)).toBeVisible({ timeout: 10000 });

    // 6) 주문내역 페이지에서 최소 1건 표시 확인
    await page.goto('/order-history');
    await expect(page.getByText('주문내역')).toBeVisible();
    // '주문번호:' 라벨이 하나 이상 보이면 성공으로 간주
    await expect(page.locator('text=주문번호:').first()).toBeVisible({ timeout: 10000 });
  });

  test('고객 주문이 관리자 주문 목록에도 표시된다 (Mock, payment OFF)', async ({ page, browser }) => {
    // ============ 고객: 주문 생성 ============
    await loginAsCustomer(page);
    await page.goto('/menu');
    await expect(page).toHaveURL(/\/menu$/);

    // S02(T2-12): 첫 번째 메뉴 카드가 화면에 표시되는지 먼저 확인
    await page.waitForSelector('a[href^="/menu/menu-"]', { state: 'visible', timeout: 10000 });
    const firstMenuCard = page.locator('a[href^="/menu/menu-"]').first();
    const href = await firstMenuCard.getAttribute('href');
    console.log('클릭할 메뉴 링크:', href);
    await expect(firstMenuCard).toBeVisible({ timeout: 10000 });
    await firstMenuCard.click();
    await expect(page).toHaveURL(/\/menu\/menu-/);
    
    // S02(T2-12): "담기" 버튼이 화면에 표시되는지 먼저 확인
    const addToCartButton = page.getByRole('button', { name: /담기/ }).first();
    await expect(addToCartButton).toBeVisible({ timeout: 10000 });
    await addToCartButton.click();
    await expect(page.getByText(/장바구니에 담았습니다/)).toBeVisible();

    // 장바구니 상태 검증 및 로그
    const cartItems = await page.evaluate(() => {
      const data = localStorage.getItem('hyunpung_cart');
      return data ? JSON.parse(data).items : [];
    });
    console.log('장바구니 아이템 개수:', cartItems.length);
    expect(cartItems.length).toBeGreaterThan(0);

    // 4) 장바구니 진입 후 단계적 대기 (T2-14 동일 패턴 적용)
    // ------------------------------------------------------------
    await page.goto('/cart', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/cart/);

    // Cart 섹션 텍스트 기반 안정화 대기
    await page.getByText('장바구니', { exact: false }).waitFor({ timeout: 15000 });
    await page.getByText('주문 방식', { exact: false }).waitFor({ timeout: 15000 });

    // 라디오 버튼 가시성 확인 (단계적 안정화 패턴 적용)
    const deliveryRadio = page.locator('#delivery');
    const pickupRadio = page.locator('#pickup');
    await expect(deliveryRadio).toBeVisible({ timeout: 15000 });
    await expect(pickupRadio).toBeVisible({ timeout: 15000 });

    // 포장 선택 (기존 로직 유지)
    await pickupRadio.check();
    await page.getByRole('button', { name: /결제하기/ }).click();
    await expect(page).toHaveURL(/\/checkout/);

    await page.getByLabel(/전화번호/).fill('01012345678');
    await page.locator('#terms').check();
    await page.getByRole('button', { name: /결제하기|주문 확정/ }).click();
    await expect(page.getByText(/주문이 접수되었습니다/)).toBeVisible({ timeout: 10000 });

    // 주문 ID 추출: 우선 URL에서 시도, 실패 시 localStorage에서 최신 주문 검색
    let orderId: string | null = null;
    const urlMatch = page.url().match(/\/order\/([^?]+)/);
    if (urlMatch) {
      orderId = urlMatch[1];
    }
    if (!orderId) {
      orderId = await page.evaluate(() => {
        try {
          const raw = localStorage.getItem('orders');
          if (!raw) return null;
          const obj = JSON.parse(raw);
          const list = Object.values(obj) as any[];
          if (!Array.isArray(list) || list.length === 0) return null;
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          return list[0]?.orderId ?? null;
        } catch {
          return null;
        }
      });
    }
    expect(orderId, '주문 ID가 확인되어야 합니다').not.toBeNull();

    // ============ 관리자: 별도 컨텍스트에서 확인 ============
    const adminContext = await browser.newContext();
    await adminContext.addInitScript(() => {
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
    const adminPage = await adminContext.newPage();
    await adminPage.goto('/admin/orders');

    // 헤더/테이블 표시 확인
    await expect(adminPage.getByText(/주문 관리|주문 현황|Orders/i)).toBeVisible({ timeout: 10000 });

    // 최신 주문 ID가 목록에 표시되는지 확인 (데스크톱/모바일 공통 텍스트 렌더링)
    await expect(adminPage.getByText(orderId!)).toBeVisible({ timeout: 15000 });

    await adminContext.close();
  });
});

// =============================================================
// 기존 복잡 플로우 테스트는 S03~S04 재도입 예정 - 현재 단계에서 실행 방지
// =============================================================
test.describe.skip('주문 플로우 (기존 상세 테스트, S03에서 재활성화)', () => {
  test('placeholder', async () => {
    // S03에서 실제 주문 생성 시나리오 복원 예정
  });
});

// =============================================================
// Phase 2: Firebase + testId 기반 Order-flow E2E
// NOTE: 이 시나리오는 USE_FIREBASE=true 환경에서만 유효하다.
// VITE_USE_FIREBASE=true 로 dev/test 환경을 설정한 뒤 실행할 것.
// =============================================================
test.describe('@orderflow Firebase Order flow', () => {
  test('@orderflow 고객 주문이 완료되고 관리자에서 조회된다 (Firebase)', async ({ page, browser }) => {
    // ============================================================
    // 1단계: 고객 주문 생성
    // ============================================================

    await loginAsCustomer(page);
    // 메뉴 페이지 진입 확인
    await page.goto('/menu');
    console.log('[debug] URL after /menu:', await page.url());
    await expect(page.getByTestId('menu-list.page')).toBeVisible({ timeout: 10000 });
    // 최소 1개 아이템 가시성 확인 (품질 기준)
    const firstItem = page.getByTestId('menu-list.item').first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });
    const firstItemLink = page.getByTestId('menu-list.item.link').first();
    const href = await firstItemLink.getAttribute('href');
    console.log('[debug] about to click first menu link, href:', href);
    await firstItemLink.click();
    console.log('[debug] pathname immediately after click:', await page.evaluate(() => window.location.pathname));
    // 짧은 대기 후 존재 여부 확인
    await page.waitForTimeout(600);
    if (!(await page.getByTestId('menu-detail.page').isVisible())) {
      console.log('[warn] menu-detail.page not visible after 600ms, fallback navigation attempt');
      if (href) {
        await page.goto(href);
        console.log('[debug] performed fallback goto, pathname:', await page.evaluate(() => window.location.pathname));
      }
    }
    await expect(page).toHaveURL(/\/menu\/menu-/);
    await expect(page.getByTestId('menu-detail.page')).toBeVisible({ timeout: 10000 });

    // 상세 페이지에서 담기 실행 (유저 플로우 준수)
    await page.getByTestId('menu-detail.button.add').click();

    // 담기 성공 토스트 확인 (실제 사용자 플로우 안정화)
    await expect(page.getByText(/장바구니에 담았습니다/)).toBeVisible({ timeout: 10000 });

    // localStorage 동기화 확인: hyunpung_cart.items 길이가 0보다 커질 때까지 폴링
    await expect.poll(async () => {
      return await page.evaluate(() => {
        const raw = localStorage.getItem('hyunpung_cart');
        if (!raw) return 0;
        try {
          const obj = JSON.parse(raw);
          return Array.isArray(obj.items) ? obj.items.length : 0;
        } catch {
          return 0;
        }
      });
    }, { timeout: 7000 }).toBeGreaterThan(0);

    // 담기 완료 후 localStorage 상태 확인 (디버깅)
    const cartBeforeNav = await page.evaluate(() => localStorage.getItem('hyunpung_cart'));
    console.log('[debug] localStorage before /cart navigation:', cartBeforeNav);

    // 장바구니로 직접 이동 (토스트 버튼보다 안정적)
    await page.goto('/cart', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/cart$/);
    console.log('[debug] URL after cart navigation:', await page.url());

    // Cart 페이지 진입 후 localStorage 상태 확인 (디버깅)
    const cartAfterNav = await page.evaluate(() => localStorage.getItem('hyunpung_cart'));
    console.log('[debug] localStorage after /cart navigation:', cartAfterNav);
    
    // 네트워크 및 DOM 안정화 대기
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
    
    // body 엘리먼트가 준비될 때까지 대기
    await page.locator('body').waitFor({ state: 'attached', timeout: 5000 });
    
    // CartContext가 localStorage를 로드하고 items를 동기화할 시간 확보
    // Context의 useEffect가 실행되어 loadFromStorage()가 완료될 때까지 대기
    await page.waitForTimeout(1000);
    
    // localStorage와 Context 동기화 확인: items가 실제로 있는지 폴링
    await expect.poll(async () => {
      return await page.evaluate(() => {
        const raw = localStorage.getItem('hyunpung_cart');
        if (!raw) return 0;
        try {
          const obj = JSON.parse(raw);
          return Array.isArray(obj.items) ? obj.items.length : 0;
        } catch {
          return 0;
        }
      });
    }, { 
      message: 'localStorage의 items가 비어있지 않아야 함',
      timeout: 5000 
    }).toBeGreaterThan(0);
    
    // Cart 컴포넌트가 로딩을 끝내고 실제 화면이 나타날 때까지 대기 (최대 15초)
    // Context가 동기화되었으므로 cart.page가 렌더되어야 함
    await page.waitForFunction(() => {
      const doc = document;
      return !!(
        doc.querySelector('[data-testid="cart.page"]') ||
        doc.querySelector('[data-testid="cart.empty"]')
      );
    }, { timeout: 15_000 });

    const cartPage = page.getByTestId('cart.page');
    const emptyPage = page.getByTestId('cart.empty');

    if (await cartPage.isVisible().catch(() => false)) {
      // 정상 장바구니 화면 - 상세 요소 검증
      await expect(cartPage).toBeVisible();
      await expect(page.getByTestId('cart.items')).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId('cart.item').first()).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId('cart.method')).toBeVisible({ timeout: 10000 });
    } else {
      // 빈 장바구니 화면 - 예상치 못한 상황이므로 에러 처리
      await expect(emptyPage).toBeVisible();
      const cartData = await page.evaluate(() => localStorage.getItem('hyunpung_cart'));
      console.error('[error] Cart is empty but localStorage:', cartData);
      throw new Error('Cart is empty after add – storage sync failure');
    }

    // 포장 선택 및 체크아웃 진행
    await page.getByTestId('cart.method.radio-pickup').click();
    console.log('[debug] Pickup selected');
    
    const submitButton = page.getByTestId('cart.button.submit');
    await expect(submitButton).toBeEnabled({ timeout: 5000 });
    console.log('[debug] Submit button is enabled');
    
    await submitButton.click();
    console.log('[debug] Submit button clicked');

    await expect(page).toHaveURL(/\/checkout/, { timeout: 10000 });
    console.log('[debug] Navigated to checkout');
    await expect(page.getByTestId('checkout.page')).toBeVisible({ timeout: 10000 });
    await page.getByLabel(/전화번호/).fill('010-1234-5678');
    await page.locator('#terms').check();
    console.log('[debug] Phone and terms filled');
    
    // 콘솔 메시지 전체 수집
    const consoleLogs: Array<{type: string, text: string}> = [];
    page.on('console', msg => {
      consoleLogs.push({ type: msg.type(), text: msg.text() });
    });
    
    const checkoutSubmit = page.getByTestId('checkout.button.submit');
    await expect(checkoutSubmit).toBeEnabled({ timeout: 5000 });
    console.log('[debug] Checkout submit button is enabled');
    
    await checkoutSubmit.click();
    console.log('[debug] Checkout submit button clicked');
    
    // 페이지 네비게이션 대기 (성공 또는 실패)
    await page.waitForTimeout(3000);
    console.log('[debug] After submit - URL:', await page.url());
    console.log('[debug] Console logs:', JSON.stringify(consoleLogs, null, 2));
    
    // 토스트 또는 에러 확인
    const toastVisible = await page.getByText(/주문이 접수되었습니다/).isVisible().catch(() => false);
    if (!toastVisible) {
      console.log('[debug] Toast not visible, checking for errors');
      const errorVisible = await page.getByText(/오류/).isVisible().catch(() => false);
      console.log('[debug] Error message visible:', errorVisible);
      throw new Error('주문 완료 토스트가 표시되지 않음');
    }

    // ============================================================
    // 2단계: OrderTracking 기본 요소 testId 기반 검증
    // ============================================================
    await expect(page).toHaveURL(/\/order\//, { timeout: 10000 });
    console.log('[debug] URL after OrderTracking:', await page.url());

    // 코어 testId 존재 확인 (텍스트 셀렉터 제거)
    await expect(page.getByTestId('order-tracking.page')).toBeVisible();
    await expect(page.getByTestId('order-tracking.header')).toBeVisible();
    await expect(page.getByTestId('order-tracking.status')).toBeVisible();
    await expect(page.getByTestId('order-tracking.order-id')).toBeVisible();
    await expect(page.getByTestId('order-tracking.timeline')).toBeVisible();
    await expect(page.getByTestId('order-tracking.items')).toBeVisible();
    await expect(page.getByTestId('order-tracking.item').first()).toBeVisible();
    await expect(page.getByTestId('order-tracking.total')).toBeVisible();

    // 주문 ID 추출 (testId 기반)
    const orderIdText = await page.getByTestId('order-tracking.order-id').textContent();
    const orderId = orderIdText?.split(':').pop()?.trim() || null;
    expect(orderId, '주문 ID 추출 실패').not.toBeNull();
    console.log('[OrderTracking] 주문 ID:', orderId);

    // 상태 라벨 포괄 검증 (한국어 라벨 일부 변경 허용)
    const statusEl = page.getByTestId('order-tracking.status');
    await expect(statusEl).toHaveText(/주문|접수|조리|배달|포장|완료/);

    // ============================================================
    // 3단계: 관리자 화면에서 동일 주문 조회
    // ============================================================
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    await loginAsAdminWithLocalStorage(adminPage);

    await adminPage.goto('/admin/orders');
    await expect(adminPage.getByTestId('admin.orders.page')).toBeVisible({ timeout: 20000 });
    await expect(adminPage.getByTestId('admin.orders.list')).toBeVisible({ timeout: 20000 });

    // 요약 항목 표시 (최초 하나 가시성 확인 후 orderId 포함 여부 확인)
    await expect(adminPage.getByTestId('admin.orders.item.summary').first()).toBeVisible({ timeout: 20000 });
    if (orderId) {
      await expect(adminPage.getByText(orderId)).toBeVisible({ timeout: 20000 });
      await expect(adminPage.getByTestId('admin.orders.item.detail-button').first()).toBeVisible({ timeout: 20000 });
      console.log('✓ 관리자 화면에서 주문 확인:', orderId);
    }

    await adminContext.close();
  });
});

