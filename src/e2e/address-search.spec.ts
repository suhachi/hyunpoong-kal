import { test, expect } from "@playwright/test";

/**
 * E2E 테스트: 주소검색 기능 (AddressSearch 컴포넌트)
 * 
 * 목적:
 * 1. Admin 설정 화면에서 AddressSearch가 렌더링되는지 확인
 * 2. 주소검색 버튼 클릭 후 입력 필드 업데이트 확인
 * 3. Customer Cart/Checkout 주소 입력도 동일 컴포넌트로 동작하는지 확인
 */

test.describe("Address Search Component", () => {

  test.describe("Admin Store Settings", () => {
    test.beforeEach(async ({ page }) => {
      // Admin 로그인 (실제 로그인 헬퍼 사용 필요)
      // TODO: 실제 admin 로그인 로직 구현
      await page.goto("/admin/settings");
    });

    test("Admin 가게 설정에서 AddressSearch가 동작한다", async ({ page }) => {
      // 1) Admin 설정 페이지로 이동
      // StoreInfoTab으로 이동 (기본 탭일 수 있음)

      // 2) AddressSearch 컴포넌트 렌더링 확인
      const addressSearchButton = page.getByTestId("address-search-button");
      await expect(addressSearchButton).toBeVisible();

      // 가게 주소 라벨 확인
      const addressLabel = page.getByText("가게 주소");
      await expect(addressLabel).toBeVisible();

      // 3) 주소검색 버튼 클릭
      await addressSearchButton.click();

      // 4) Daum 팝업 대신 직접 입력 (테스트 환경)
      // 실제 Daum Postcode 팝업은 mock 처리 필요
      const addressInput = page.getByTestId("address-input");
      if (await addressInput.isVisible()) {
        await addressInput.fill("서울특별시 테스트로 123");
      }

      const addressDetailInput = page.getByTestId("address-detail-input");
      if (await addressDetailInput.isVisible()) {
        await addressDetailInput.fill("테스트타워 101호");
      }

      // 5) 저장 버튼 클릭
      const saveButton = page.getByRole("button", { name: /저장/ });
      await saveButton.click();

      // 6) 성공 토스트 확인
      const successToast = page.getByText(/저장되었습니다|성공/);
      await expect(successToast).toBeVisible({ timeout: 5000 });
    });

    test("주소 입력 후 값이 유지된다", async ({ page }) => {
      // 주소 입력
      const addressInput = page.getByTestId("address-input");
      const testAddress = "대구광역시 달성군 현풍면 테스트로 456";

      if (await addressInput.isVisible()) {
        await addressInput.fill(testAddress);
      }

      const addressDetailInput = page.getByTestId("address-detail-input");
      const testDetail = "테스트빌딩 202호";

      if (await addressDetailInput.isVisible()) {
        await addressDetailInput.fill(testDetail);
      }

      // 저장
      await page.getByRole("button", { name: /저장/ }).click();

      // 페이지 새로고침
      await page.reload();

      // 값이 유지되는지 확인
      await expect(addressInput).toHaveValue(testAddress);
      await expect(addressDetailInput).toHaveValue(testDetail);
    });
  });

  test.describe("Customer Checkout", () => {
    test.beforeEach(async ({ page }) => {
      // 메뉴 담기
      await page.goto("/menu");
      const firstMenuItem = page.locator('[data-testid^="menu-item"]').first();
      await firstMenuItem.click();
      await page.getByTestId("add-to-cart-button").click();

      // Checkout으로 이동
      await page.goto("/cart");
      await page.getByTestId("cart.button.submit").click();
    });

    test("고객 Checkout에서 AddressSearch를 통해 배달 주소를 입력할 수 있다", async ({ page }) => {
      // 1) Checkout 페이지 확인
      await expect(page).toHaveURL(/\/checkout/);

      // 2) 배달 선택
      await page.locator('input[value="delivery"]').click();

      // 3) AddressSearch 컴포넌트 확인
      const addressSearchButton = page.getByTestId("address-search-button");
      await expect(addressSearchButton).toBeVisible();

      // 4) 주소 입력
      await addressSearchButton.click();

      const addressInput = page.getByTestId("address-input");
      if (await addressInput.isVisible()) {
        await addressInput.fill("서울특별시 테스트로 456");
      }

      const addressDetailInput = page.getByTestId("address-detail-input");
      if (await addressDetailInput.isVisible()) {
        await addressDetailInput.fill("테스트아파트 202동 303호");
      }

      // 5) 주문 버튼 활성화 확인
      const submitButton = page.getByTestId("checkout-submit");
      await expect(submitButton).toBeEnabled();

      // 6) 주소 필수 체크 통과 확인 (에러 메시지 없음)
      const errorAlert = page.locator('[role="alert"]').filter({ hasText: /주소/ });
      await expect(errorAlert).not.toBeVisible();
    });

    test("배달 선택 시 주소 미입력하면 에러가 표시된다", async ({ page }) => {
      // 1) 배달 선택
      await page.locator('input[value="delivery"]').click();

      // 2) 주소 입력 없이 주문 시도
      const submitButton = page.getByTestId("checkout-submit");

      // 주소가 비어있으면 버튼이 비활성화되거나 에러 표시
      const isDisabled = await submitButton.isDisabled();

      if (!isDisabled) {
        await submitButton.click();

        // 에러 토스트 또는 경고 메시지 확인
        const errorMessage = page.getByText(/주소를|배달 주소/);
        await expect(errorMessage).toBeVisible({ timeout: 3000 });
      } else {
        // 버튼이 비활성화되어 있음을 확인
        expect(isDisabled).toBe(true);
      }
    });
  });

  test.describe("Cart Page", () => {
    test.beforeEach(async ({ page }) => {
      // 메뉴 담기
      await page.goto("/menu");
      const firstMenuItem = page.locator('[data-testid^="menu-item"]').first();
      await firstMenuItem.click();
      await page.getByTestId("add-to-cart-button").click();

      // Cart로 이동
      await page.goto("/cart");
    });

    test("Cart 페이지에서도 AddressSearch를 사용할 수 있다", async ({ page }) => {
      // 1) 배달 선택
      await page.getByTestId("cart.method.radio-delivery").click();

      // 2) AddressSearch 컴포넌트 확인
      const addressSearchButton = page.getByTestId("address-search-button");
      await expect(addressSearchButton).toBeVisible();

      // 3) 주소 입력
      await addressSearchButton.click();

      const addressInput = page.getByTestId("address-input");
      if (await addressInput.isVisible()) {
        await addressInput.fill("부산광역시 테스트구 테스트로 789");
      }

      const addressDetailInput = page.getByTestId("address-detail-input");
      if (await addressDetailInput.isVisible()) {
        await addressDetailInput.fill("테스트빌라 101동 101호");
      }

      // 4) 주소 입력 후 결제 버튼 활성화 확인
      const submitButton = page.getByTestId("cart.button.submit");
      await expect(submitButton).toBeEnabled();
    });
  });
});
