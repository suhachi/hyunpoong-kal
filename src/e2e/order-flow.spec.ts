import { test, expect } from '@playwright/test';

/**
 * 주문 플로우 E2E 테스트
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

test.describe('주문 플로우', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto('/login');
    await page.fill('input[type="email"]', 'customer@example.com');
    await page.fill('input[type="password"]', 'test1234');
    await page.click('button:has-text("로그인")');
    await page.waitForURL('/');
  });

  test('메뉴 탐색 및 상세 보기', async ({ page }) => {
    // 메뉴 목록으로 이동
    await page.goto('/menu');
    
    // 메뉴 카테고리 확인
    await expect(page.locator('text=닭칼국수')).toBeVisible();
    await expect(page.locator('text=사이드 메뉴')).toBeVisible();
    
    // 첫 번째 메뉴 클릭
    await page.click('[data-testid="menu-item"]:first-child, .menu-card:first-child, a[href^="/menu/"]:first-child');
    
    // 메뉴 상세 페이지로 이동 확인
    await expect(page).toHaveURL(/\/menu\/.+/);
    
    // 메뉴 정보 확인
    await expect(page.locator('text=가격')).toBeVisible();
    await expect(page.locator('text=설명')).toBeVisible();
  });

  test('장바구니에 메뉴 추가', async ({ page }) => {
    await page.goto('/menu');
    
    // 첫 번째 메뉴로 이동
    const firstMenu = page.locator('[data-testid="menu-item"]:first-child, .menu-card:first-child, a[href^="/menu/"]:first-child');
    await firstMenu.click();
    
    // 장바구니 담기 버튼 클릭
    await page.click('button:has-text("장바구니 담기"), button:has-text("담기")');
    
    // 장바구니 추가 확인 (토스트 또는 버튼 텍스트 변경)
    await expect(page.locator('text=장바구니에 추가되었습니다, text=담았습니다')).toBeVisible({ timeout: 5000 });
    
    // 장바구니로 이동
    await page.goto('/cart');
    
    // 장바구니에 아이템 확인
    await expect(page.locator('.cart-item, [data-testid="cart-item"]')).toHaveCount(1, { timeout: 5000 });
  });

  test('장바구니에서 수량 조절', async ({ page }) => {
    // 먼저 메뉴 추가
    await page.goto('/menu');
    const firstMenu = page.locator('a[href^="/menu/"]:first-child');
    await firstMenu.click();
    await page.click('button:has-text("장바구니 담기"), button:has-text("담기")');
    
    // 장바구니로 이동
    await page.goto('/cart');
    
    // 수량 증가 버튼 클릭
    const increaseButton = page.locator('button[aria-label="수량 증가"], button:has-text("+")').first();
    await increaseButton.click();
    
    // 수량이 2가 되었는지 확인
    await expect(page.locator('text=수량: 2, text=2개')).toBeVisible({ timeout: 3000 });
  });

  test('최소 주문금액 미달 시 결제 불가', async ({ page }) => {
    await page.goto('/cart');
    
    // 장바구니가 비어있으면 메뉴 추가
    const cartItemCount = await page.locator('.cart-item, [data-testid="cart-item"]').count();
    if (cartItemCount === 0) {
      await page.goto('/menu');
      await page.click('a[href^="/menu/"]:first-child');
      await page.click('button:has-text("담기")');
      await page.goto('/cart');
    }
    
    // 결제 버튼 상태 확인
    const checkoutButton = page.locator('button:has-text("결제하기"), button:has-text("주문하기")');
    
    // 최소 주문금액 미달 메시지 확인 (있을 경우)
    const minOrderWarning = page.locator('text=최소 주문금액');
    if (await minOrderWarning.isVisible()) {
      // 버튼이 비활성화되어 있어야 함
      await expect(checkoutButton).toBeDisabled();
    }
  });

  test('전체 주문 플로우 (메뉴 → 장바구니 → 결제)', async ({ page }) => {
    // 1. 메뉴 선택
    await page.goto('/menu');
    await page.click('a[href^="/menu/"]:first-child');
    
    // 2. 장바구니 담기
    await page.click('button:has-text("장바구니 담기"), button:has-text("담기")');
    
    // 3. 장바구니로 이동
    await page.goto('/cart');
    
    // 4. 주문 금액 확인
    await expect(page.locator('text=주문 금액, text=총 금액')).toBeVisible();
    
    // 5. 결제 페이지로 이동 시도
    const checkoutButton = page.locator('button:has-text("결제하기"), button:has-text("주문하기")');
    
    if (await checkoutButton.isEnabled()) {
      await checkoutButton.click();
      
      // 결제 페이지 확인
      await expect(page).toHaveURL('/checkout');
      
      // 결제 정보 입력 폼 확인
      await expect(page.locator('text=배달 정보, text=주문 정보')).toBeVisible();
    }
  });

  test('주문 내역 확인', async ({ page }) => {
    await page.goto('/orders');
    
    // 주문 내역 페이지 확인
    await expect(page.locator('text=주문내역, text=주문 목록')).toBeVisible();
    
    // 빈 상태 또는 주문 목록 확인
    const hasOrders = await page.locator('.order-item, [data-testid="order-item"]').count() > 0;
    if (!hasOrders) {
      await expect(page.locator('text=주문 내역이 없습니다, text=아직 주문이 없어요')).toBeVisible();
    }
  });
});
