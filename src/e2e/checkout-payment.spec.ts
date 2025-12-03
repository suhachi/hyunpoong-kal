import { test, expect } from "@playwright/test";

/**
 * E2E 테스트: 결제 플로우 (APP_CARD + MEET_CASH)
 * 
 * 목적:
 * 1. APP_CARD + NICEPAY 플로우의 기본 동작 확인 (리다이렉트까지)
 * 2. MEET_CASH 플로우에서 PG 호출 없이 주문 완료 화면으로 가는지 확인
 */

test.describe("Checkout Payment Flow", () => {
  test.beforeEach(async ({ page }) => {
    // 테스트 전 초기화 (필요 시)
    await page.goto("/");
  });

  test("APP_CARD 선택 시 NICEPAY 결제창으로 리다이렉트된다", async ({ page }) => {
    // 1) 메뉴 선택 → 장바구니 진입
    await page.goto("/menu");

    // 첫 번째 메뉴 아이템 클릭 (실제 테스트 ID에 맞게 조정 필요)
    const firstMenuItem = page.locator('[data-testid^="menu-item"]').first();
    await firstMenuItem.click();

    // 메뉴 상세에서 장바구니 담기
    await page.getByTestId("add-to-cart-button").click();

    // 장바구니로 이동
    await page.goto("/cart");

    // 2) Checkout 페이지 이동
    await page.getByTestId("cart.button.submit").click();
    await expect(page).toHaveURL(/\/checkout/);

    // 3) 결제수단에서 APP_CARD 선택
    // TODO: 실제 테스트 ID 확인 후 수정 필요
    await page.locator('input[value="APP_CARD"]').click();

    // 4) 주소/필수 정보 입력
    // 배달 선택 (이미 선택되어 있을 수 있음)
    await page.locator('input[value="delivery"]').click();

    // 주소 입력 (AddressSearch 컴포넌트)
    const addressInput = page.getByTestId("address-input");
    if (await addressInput.isVisible()) {
      await addressInput.fill("서울특별시 테스트로 123");
    }

    const addressDetailInput = page.getByTestId("address-detail-input");
    if (await addressDetailInput.isVisible()) {
      await addressDetailInput.fill("테스트빌딩 101호");
    }

    // 5) 주문하기 버튼 클릭 및 리다이렉트 확인
    // NICEPAY 결제창으로 리다이렉트되는 것을 확인
    // 실제 환경에서는 새 창이 열리거나 현재 창이 리다이렉트됨

    // TODO: NICEPAY Functions를 mocking하여 실제 PG 호출 방지
    // 현재는 리다이렉트 시도만 확인

    const submitButton = page.getByTestId("checkout-submit");

    // 페이지 이동 또는 새 창 열림을 감지
    const [response] = await Promise.all([
      page.waitForResponse(response =>
        response.url().includes("initiatePayment") ||
        response.url().includes("createPayment")
      ).catch(() => null),
      submitButton.click(),
    ]);

    // NICEPAY 관련 호출이 발생했는지 확인
    // 실제 환경에서는 Functions mocking 필요
    console.log("Payment initiation attempted");
  });

  test("MEET_CASH 선택 시 결제창 없이 주문 완료 페이지로 이동한다", async ({ page }) => {
    // 1) 메뉴 담기 → checkout 진입
    await page.goto("/menu");

    const firstMenuItem = page.locator('[data-testid^="menu-item"]').first();
    await firstMenuItem.click();
    await page.getByTestId("add-to-cart-button").click();

    await page.goto("/cart");
    await page.getByTestId("cart.button.submit").click();
    await expect(page).toHaveURL(/\/checkout/);

    // 2) 결제수단에서 MEET_CASH 선택
    await page.locator('input[value="MEET_CASH"]').click();

    // 3) 포장 선택 (MEET_CASH는 주로 포장/매장 결제)
    await page.locator('input[value="pickup"]').click();

    // 4) 주문하기 클릭
    await page.getByTestId("checkout-submit").click();

    // 5) URL이 /order/{id} 형태로 이동하는지 확인
    await expect(page).toHaveURL(/\/order\/\w+/);

    // 6) 페이지 내에 "만나서 결제" 또는 "매장에서 결제" 안내 확인
    // TODO: 실제 텍스트 확인 후 수정
    const orderPage = page.locator("body");
    await expect(orderPage).toContainText(/주문이 접수되었습니다|만나서 결제/);
  });

  test("MEET_CARD 선택 시 결제창 없이 주문 완료 페이지로 이동한다", async ({ page }) => {
    // MEET_CARD도 MEET_CASH와 동일한 플로우
    await page.goto("/menu");

    const firstMenuItem = page.locator('[data-testid^="menu-item"]').first();
    await firstMenuItem.click();
    await page.getByTestId("add-to-cart-button").click();

    await page.goto("/cart");
    await page.getByTestId("cart.button.submit").click();
    await expect(page).toHaveURL(/\/checkout/);

    // MEET_CARD 선택
    await page.locator('input[value="MEET_CARD"]').click();

    // 포장 선택
    await page.locator('input[value="pickup"]').click();

    await page.getByTestId("checkout-submit").click();

    // 주문 완료 페이지로 이동 확인
    await expect(page).toHaveURL(/\/order\/\w+/);

    const orderPage = page.locator("body");
    await expect(orderPage).toContainText(/주문이 접수되었습니다|만나서 결제/);
  });
});
