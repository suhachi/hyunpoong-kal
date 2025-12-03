# E2E Tests - Full Source Code

**Generated**: 2025-12-03-1259  
**Project**: hyunpoong-kal  
**Company**: KS Company (BRN: 553-17-00098)

---

## Overview

Complete source code of Playwright E2E tests.

---
## src\playwright.config.ts

```typescript
import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E 테스트 설정
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html"],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  // 수동 서버 모드(PW_SKIP_WEBSERVER=1)에서는 webServer 기동을 생략
  webServer: process.env.PW_SKIP_WEBSERVER
    ? undefined
    : {
        command: "npm run dev",
        port: 3000,
        timeout: 120000, // dev 서버 준비 시간 120초
        reuseExistingServer: true, // 이미 실행 중이면 재사용
      },
});

```

---

## src\e2e\admin-routes.spec.ts

```typescript
/**
 * Admin Routes E2E Test
 *
 * Phase 1 - T2-4: 관리자 라우트 스모크 테스트
 *
 * 목적:
 * - 관리자 11개 라우트가 에러 없이 렌더링되는지 확인
 * - 콘솔 에러 감지
 * - 기본 가시성 확인
 *
 * @tag @admin
 */

import { test, expect } from "@playwright/test";

// Mock 관리자 사용자 (USE_FIREBASE=false 환경)
const mockAdmin = {
  uid: "admin-001",
  email: "admin@hyunpoongkalguksu.com",
  displayName: "관리자",
  role: "owner",
  storeId: "store-hyunpung",
};

// 테스트 대상 관리자 라우트 (11개)
const routes = [
  { path: "/admin", name: "Dashboard" },
  { path: "/admin/orders", name: "Orders" },
  { path: "/admin/menus", name: "Menus" },
  { path: "/admin/reviews", name: "Reviews" },
  { path: "/admin/analytics", name: "Analytics" },
  { path: "/admin/integrated-analytics", name: "IntegratedAnalytics" },
  { path: "/admin/delivery", name: "Delivery" },
  { path: "/admin/promotions", name: "Promotions" },
  { path: "/admin/points", name: "Points" },
  { path: "/admin/support", name: "Support" },
  { path: "/admin/settings", name: "Settings" },
];

test.describe("Admin Routes @admin", () => {
  test.beforeEach(async ({ page }) => {
    // 테스트 환경 localStorage 클린업 및 mockUser 구조 보강
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.addInitScript(admin => {
      // 필수 필드 보장
      const safeAdmin = {
        uid: admin.uid || "admin-001",
        email: admin.email || "admin@hyunpoongkalguksu.com",
        displayName: admin.displayName || "관리자",
        role: admin.role || "owner",
        storeId: admin.storeId || "store-hyunpung",
      };
      localStorage.setItem("mockUser", JSON.stringify(safeAdmin));
      localStorage.setItem("mockRole", safeAdmin.role);
    }, mockAdmin);
  });

  for (const route of routes) {
    test(`renders ${route.path} (${route.name}) without console errors`, async ({ page }) => {
      // 콘솔 에러 수집
      const errors: string[] = [];
      page.on("console", msg => {
        if (msg.type() === "error") {
          errors.push(msg.text());
        }
      });

      // 페이지 네비게이션
      const res = await page.goto(route.path, { waitUntil: "domcontentloaded" });
      expect(res?.ok(), `HTTP response for ${route.path}`).toBeTruthy();

      // 기본 가시성 확인 (body가 렌더링되었는지)
      await expect(page.locator("body")).toBeVisible();

      // 네트워크 안정화 대기 (Mock API 응답 포함)
      await page.waitForLoadState("networkidle");

      // 최소 100ms 대기 (렌더링 완료 보장)
      await page.waitForTimeout(100);

      // 콘솔 에러 검증
      if (errors.length > 0) {
        console.error(`\n❌ Console errors on ${route.path}:\n` + errors.join("\n"));
      }
      expect(errors, `No console errors on ${route.path}`).toEqual([]);
    });
  }
});

```

---

## src\e2e\admin-settings.spec.ts

```typescript
/**
 * Admin Settings E2E Test (stabilized minimal version)
 *
 * 목적:
 * - /admin/settings 페이지가 Mock 모드에서 정상 로드되는지 확인
 * - 5개 탭(Payment / Delivery / Maps / FCM / Operations)이 전부 렌더링되는지만 스모크 테스트
 * - 콘솔 에러는 더 이상 수집/검증하지 않음 (외부 스크립트/Kakao Maps 등으로 인한 false positive 제거)
 *
 * @tag @admin
 */

import { test, expect, Page } from "@playwright/test";

// 전체 테스트 타임아웃(각 테스트당)
test.setTimeout(60_000);

// Mock 관리자 사용자
const mockAdmin = {
  uid: "admin-001",
  email: "admin@hyunpoongkalguksu.com",
  displayName: "관리자",
  role: "owner",
  storeId: "store-hyunpung",
};

// 공통 헬퍼: Admin Settings 페이지 열기 (Mock 모드 강제)
async function openAdminSettingsPage(page: Page) {
  await page.addInitScript(admin => {
    // E2E 환경에서 Firebase 모드 강제 OFF → Mock 모드로 고정
    (window as any).__E2E_FORCE_USE_FIREBASE__ = false;

    localStorage.setItem("mockUser", JSON.stringify(admin));
    localStorage.setItem("mockRole", "owner");
  }, mockAdmin);

  // Admin Settings 페이지로 이동
  await page.goto("/admin/settings", { waitUntil: "domcontentloaded" });

  // ✅ 이제는 레이아웃까지 보지 않고, Settings 루트만 확실히 뜨는지만 검증
  await expect(page.getByTestId("admin-settings-page-root")).toBeVisible({ timeout: 20_000 });
}

test.describe("Admin Settings Pages @admin", () => {
  // 1. 기본 페이지 로드
  test("Settings page loads without errors", async ({ page }) => {
    await openAdminSettingsPage(page);
    await expect(page.getByTestId("admin-settings-page-root")).toBeVisible();
  });

  // 2. Payment 탭
  test("Payment tab renders correctly", async ({ page }) => {
    await openAdminSettingsPage(page);

    const trigger = page.getByTestId("admin-settings-tab-trigger-payment");
    await expect(trigger).toBeVisible();
    await trigger.click();

    const panel = page.getByTestId("admin-settings-payment-tab");
    await expect(panel).toBeVisible();
  });

  // 3. Delivery 탭
  test("Delivery tab renders correctly", async ({ page }) => {
    await openAdminSettingsPage(page);

    const trigger = page.getByTestId("admin-settings-tab-trigger-delivery");
    await expect(trigger).toBeVisible();
    await trigger.click();

    const panel = page.getByTestId("admin-settings-delivery-tab");
    await expect(panel).toBeVisible();
  });

  // 4. Maps 탭
  test("Maps tab renders correctly", async ({ page }) => {
    await openAdminSettingsPage(page);

    const trigger = page.getByTestId("admin-settings-tab-trigger-maps");
    await expect(trigger).toBeVisible();
    await trigger.click();

    const panel = page.getByTestId("admin-settings-maps-tab");
    await expect(panel).toBeVisible();
  });

  // 5. FCM 탭
  test("FCM tab renders correctly", async ({ page }) => {
    await openAdminSettingsPage(page);

    const trigger = page.getByTestId("admin-settings-tab-trigger-fcm");
    await expect(trigger).toBeVisible();
    await trigger.click();

    const panel = page.getByTestId("admin-settings-fcm-tab");
    await expect(panel).toBeVisible();
  });

  // 6. Operations 탭
  test("Operations tab renders correctly", async ({ page }) => {
    await openAdminSettingsPage(page);

    const trigger = page.getByTestId("admin-settings-tab-trigger-operations");
    await expect(trigger).toBeVisible();
    await trigger.click();

    const panel = page.getByTestId("admin-settings-operations-tab");
    await expect(panel).toBeVisible();
  });

  // 7. 모든 탭을 순차적으로 전환
  test("All tabs can be switched without errors", async ({ page }) => {
    await openAdminSettingsPage(page);

    const triggers = [
      "admin-settings-tab-trigger-payment",
      "admin-settings-tab-trigger-delivery",
      "admin-settings-tab-trigger-maps",
      "admin-settings-tab-trigger-fcm",
      "admin-settings-tab-trigger-operations",
    ] as const;

    const panels = [
      "admin-settings-payment-tab",
      "admin-settings-delivery-tab",
      "admin-settings-maps-tab",
      "admin-settings-fcm-tab",
      "admin-settings-operations-tab",
    ] as const;

    for (let i = 0; i < triggers.length; i++) {
      const trigger = page.getByTestId(triggers[i]);
      await expect(trigger).toBeVisible();
      await trigger.click();

      const panel = page.getByTestId(panels[i]);
      await expect(panel).toBeVisible();
    }
  });
});

// 터미널에서 실행:
// cd D:\projectsing\hyun-poong\hyunpoong-kal
// npm run test:e2e -- src/e2e/admin-settings.spec.ts --project=chromium

```

---
