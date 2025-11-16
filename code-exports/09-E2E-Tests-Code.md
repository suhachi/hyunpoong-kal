# E2E Tests - Full Source Code

**Generated**: 2025-11-15-2002  
**Project**: hyunpoong-kal  
**Company**: KS Company (BRN: 553-17-00098)

---

## Overview

Complete source code of Playwright E2E tests.

---
## src\playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Playwright E2E 테스트 설정
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // 수동 서버 모드(PW_SKIP_WEBSERVER=1)에서는 webServer 기동을 생략
  webServer: process.env.PW_SKIP_WEBSERVER
    ? undefined
    : {
        // Windows 환경에서 playwright가 pnpm script 실행 시 인식 문제 있어 'pnpm run dev' 명시
        command: 'pnpm run dev',
        cwd: path.resolve(__dirname, '..'),
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
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

import { test, expect } from '@playwright/test';

// Mock 관리자 사용자 (USE_FIREBASE=false 환경)
const mockAdmin = {
  uid: 'admin-001',
  email: 'admin@hyunpoongkalguksu.com',
  displayName: '관리자',
  role: 'owner',
  storeId: 'store-hyunpung',
};

// 테스트 대상 관리자 라우트 (11개)
const routes = [
  { path: '/admin', name: 'Dashboard' },
  { path: '/admin/orders', name: 'Orders' },
  { path: '/admin/menus', name: 'Menus' },
  { path: '/admin/reviews', name: 'Reviews' },
  { path: '/admin/analytics', name: 'Analytics' },
  { path: '/admin/integrated-analytics', name: 'IntegratedAnalytics' },
  { path: '/admin/delivery', name: 'Delivery' },
  { path: '/admin/promotions', name: 'Promotions' },
  { path: '/admin/points', name: 'Points' },
  { path: '/admin/support', name: 'Support' },
  { path: '/admin/settings', name: 'Settings' },
];

test.describe('Admin Routes @admin', () => {
  test.beforeEach(async ({ page }) => {
    // 첫 네비게이션 전 localStorage에 mock 사용자 주입
    await page.addInitScript((admin) => {
      localStorage.setItem('mockUser', JSON.stringify(admin));
      localStorage.setItem('mockRole', 'owner');
    }, mockAdmin);
  });

  for (const route of routes) {
    test(`renders ${route.path} (${route.name}) without console errors`, async ({ page }) => {
      // 콘솔 에러 수집
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      // 페이지 네비게이션
      const res = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      expect(res?.ok(), `HTTP response for ${route.path}`).toBeTruthy();

      // 기본 가시성 확인 (body가 렌더링되었는지)
      await expect(page.locator('body')).toBeVisible();

      // 네트워크 안정화 대기 (Mock API 응답 포함)
      await page.waitForLoadState('networkidle');

      // 최소 100ms 대기 (렌더링 완료 보장)
      await page.waitForTimeout(100);

      // 콘솔 에러 검증
      if (errors.length > 0) {
        console.error(`\n❌ Console errors on ${route.path}:\n` + errors.join('\n'));
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
 * Admin Settings E2E Test
 * 
 * Phase 1 - T2-4: 관리자 Settings 5개 탭 스모크 테스트
 * 
 * 목적:
 * - Settings 5개 탭이 에러 없이 렌더링되는지 확인
 * - 탭 전환 시 콘솔 에러 감지
 * - 각 탭의 핵심 UI 요소 확인
 * 
 * @tag @admin
 */

import { test, expect } from '@playwright/test';

// Mock 관리자 사용자
const mockAdmin = {
  uid: 'admin-001',
  email: 'admin@hyunpoongkalguksu.com',
  displayName: '관리자',
  role: 'owner',
  storeId: 'store-hyunpung',
};

test.describe('Admin Settings Pages @admin', () => {
  test.beforeEach(async ({ page }) => {
    // localStorage에 mock 사용자 주입
    await page.addInitScript((admin) => {
      localStorage.setItem('mockUser', JSON.stringify(admin));
      localStorage.setItem('mockRole', 'owner');
    }, mockAdmin);

    // /admin/settings 진입
    await page.goto('/admin/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
  });

  test('Settings page loads without errors', async ({ page }) => {
    // 콘솔 에러 수집
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // 페이지 타이틀 확인
    await expect(page.locator('h1')).toContainText('설정');

    // 에러 검증
    if (errors.length > 0) {
      console.error('\n❌ Console errors on Settings page:\n' + errors.join('\n'));
    }
    expect(errors, 'No console errors on Settings page').toEqual([]);
  });

  test('Payment tab renders correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Payment 탭 클릭 (이미 기본 탭일 수도 있음)
    const paymentTab = page.getByRole('tab', { name: /결제/i });
    if (await paymentTab.isVisible()) {
      await paymentTab.click();
      await page.waitForTimeout(100);
    }

    // NicePay 설정 UI 확인
    await expect(page.getByText(/NicePay|나이스페이/i)).toBeVisible();

    // 에러 검증
    expect(errors, 'No console errors on Payment tab').toEqual([]);
  });

  test('Delivery tab renders correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Delivery 탭 클릭
    const deliveryTab = page.getByRole('tab', { name: /배달/i });
    await deliveryTab.click();
    await page.waitForTimeout(100);

    // 배달 설정 UI 확인
    await expect(page.getByText(/배달 대행사|배달 설정/i)).toBeVisible();

    // 에러 검증
    expect(errors, 'No console errors on Delivery tab').toEqual([]);
  });

  test('Maps tab renders correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Maps 탭 클릭
    const mapsTab = page.getByRole('tab', { name: /지도/i });
    await mapsTab.click();
    await page.waitForTimeout(100);

    // 지도 API 가이드 확인
    await expect(page.getByText(/Kakao|Google|지도 API/i)).toBeVisible();

    // 에러 검증
    expect(errors, 'No console errors on Maps tab').toEqual([]);
  });

  test('FCM tab renders correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // FCM 탭 클릭
    const fcmTab = page.getByRole('tab', { name: /FCM|알림/i });
    await fcmTab.click();
    await page.waitForTimeout(100);

    // FCM 진단 UI 확인
    await expect(page.getByText(/FCM|Firebase Cloud Messaging|진단/i)).toBeVisible();

    // 에러 검증
    expect(errors, 'No console errors on FCM tab').toEqual([]);
  });

  test('Operations tab renders correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Operations 탭 클릭
    const opsTab = page.getByRole('tab', { name: /운영|Operations/i });
    await opsTab.click();
    await page.waitForTimeout(100);

    // 배포 스크립트 UI 확인
    await expect(page.getByText(/배포|Deploy|Firestore Rules/i)).toBeVisible();

    // 에러 검증
    expect(errors, 'No console errors on Operations tab').toEqual([]);
  });

  test('All tabs can be switched without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    const tabs = [
      { name: /결제/i, label: 'Payment' },
      { name: /배달/i, label: 'Delivery' },
      { name: /지도/i, label: 'Maps' },
      { name: /FCM|알림/i, label: 'FCM' },
      { name: /운영|Operations/i, label: 'Operations' },
    ];

    // 각 탭을 순서대로 클릭
    for (const tab of tabs) {
      const tabElement = page.getByRole('tab', { name: tab.name });
      if (await tabElement.isVisible()) {
        await tabElement.click();
        await page.waitForTimeout(50);
        console.log(`✓ Clicked ${tab.label} tab`);
      }
    }

    // 전체 탭 전환 후 에러 검증
    if (errors.length > 0) {
      console.error('\n❌ Console errors during tab switching:\n' + errors.join('\n'));
    }
    expect(errors, 'No console errors during all tabs switching').toEqual([]);
  });
});

```

---
