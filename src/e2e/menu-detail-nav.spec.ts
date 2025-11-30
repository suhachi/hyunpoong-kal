import { test, expect } from "@playwright/test";

// 빠른 메뉴 상세 이동 디버그 전용
// 실패 시 콘솔 로그 + fallback goto 수행

test.describe("menu-detail navigation debug", () => {
  test("menu first item navigates to detail page", async ({ page }) => {
    await page.goto("/menu");
    await expect(page.getByTestId("menu-list.page")).toBeVisible();
    const link = page.getByTestId("menu-list.item.link").first();
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    console.log("[nav-debug] first link href:", href);

    await link.click();
    const pathnameAfterClick = await page.evaluate(() => window.location.pathname);
    console.log("[nav-debug] pathname immediately after click:", pathnameAfterClick);

    await page.waitForTimeout(600);
    const visible600 = await page
      .getByTestId("menu-detail.page")
      .isVisible()
      .catch(() => false);
    console.log("[nav-debug] menu-detail.page visible after 600ms?", visible600);

    if (!visible600 && href) {
      console.log("[nav-debug] fallback goto attempt:", href);
      await page.goto(href);
      const pathnameAfterFallback = await page.evaluate(() => window.location.pathname);
      console.log("[nav-debug] pathname after fallback goto:", pathnameAfterFallback);
      const bodySnippet = (await page.content()).slice(0, 500);
      console.log("[nav-debug] body snippet (first 500 chars):", bodySnippet.replace(/\n/g, " "));
    }

    await expect(page).toHaveURL(/\/menu\/menu-/);
    await expect(page.getByTestId("menu-detail.page")).toBeVisible({ timeout: 8000 });
  });
});
