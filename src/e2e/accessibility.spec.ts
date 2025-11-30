import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * 접근성(a11y) E2E 테스트
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

test.describe("접근성 테스트", () => {
  test("홈 페이지 접근성 검사", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("로그인 페이지 접근성 검사", async ({ page }) => {
    await page.goto("/login");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("메뉴 목록 페이지 접근성 검사", async ({ page }) => {
    await page.goto("/menu");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("키보드 탐색 - Tab 키로 이동", async ({ page }) => {
    await page.goto("/");

    // Tab 키로 포커스 이동
    await page.keyboard.press("Tab");

    // 첫 번째 포커스 가능한 요소 확인
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(["A", "BUTTON", "INPUT"]).toContain(focusedElement);
  });

  test("키보드 탐색 - Enter 키로 링크 활성화", async ({ page }) => {
    await page.goto("/");

    // 메뉴 링크로 Tab 이동
    await page.keyboard.press("Tab");

    // Enter 키로 활성화
    await page.keyboard.press("Enter");

    // 페이지 이동 확인
    await page.waitForLoadState("networkidle");
    const url = page.url();
    expect(url).not.toBe("http://localhost:5173/");
  });

  test("이미지 alt 텍스트 확인", async ({ page }) => {
    await page.goto("/menu");

    // 모든 이미지 alt 속성 확인
    const images = await page.locator("img").all();

    for (const img of images) {
      const alt = await img.getAttribute("alt");
      // alt가 null이 아니어야 함 (빈 문자열은 허용 - 장식용 이미지)
      expect(alt).not.toBeNull();
    }
  });

  test("색상 대비 - 텍스트 가독성", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .include('[class*="text"]')
      .analyze();

    // 색상 대비 관련 위반 사항 확인
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === "color-contrast",
    );

    expect(colorContrastViolations).toEqual([]);
  });

  test("폼 레이블 확인", async ({ page }) => {
    await page.goto("/login");

    // 모든 input에 label이 있는지 확인
    const inputs = await page.locator('input[type="email"], input[type="password"]').all();

    for (const input of inputs) {
      const id = await input.getAttribute("id");
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        expect(label).toBeGreaterThan(0);
      }
    }
  });

  test("ARIA 속성 확인", async ({ page }) => {
    await page.goto("/");

    // 중요한 ARIA 랜드마크 확인
    await expect(page.locator('[role="navigation"], nav')).toBeVisible({ timeout: 5000 });
  });

  test("포커스 표시 확인", async ({ page }) => {
    await page.goto("/login");

    // 버튼에 포커스
    const button = page.locator('button:has-text("로그인")').first();
    await button.focus();

    // 포커스 스타일이 적용되었는지 확인
    const outlineStyle = await button.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.outline || styles.boxShadow;
    });

    expect(outlineStyle).not.toBe("none");
    expect(outlineStyle).not.toBe("");
  });
});
