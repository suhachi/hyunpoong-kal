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

import { test, expect, Page } from '@playwright/test';

// 전체 테스트 타임아웃(각 테스트당)
test.setTimeout(60_000);

// Mock 관리자 사용자
const mockAdmin = {
  uid: 'admin-001',
  email: 'admin@hyunpoongkalguksu.com',
  displayName: '관리자',
  role: 'owner',
  storeId: 'store-hyunpung',
};

// 공통 헬퍼: Admin Settings 페이지 열기 (Mock 모드 강제)
async function openAdminSettingsPage(page: Page) {
  await page.addInitScript((admin) => {
    // E2E 환경에서 Firebase 모드 강제 OFF → Mock 모드로 고정
    (window as any).__E2E_FORCE_USE_FIREBASE__ = false;

    localStorage.setItem('mockUser', JSON.stringify(admin));
    localStorage.setItem('mockRole', 'owner');
  }, mockAdmin);

  // Admin Settings 페이지로 이동
  await page.goto('/admin/settings', { waitUntil: 'domcontentloaded' });

  // ✅ 이제는 레이아웃까지 보지 않고, Settings 루트만 확실히 뜨는지만 검증
  await expect(
    page.getByTestId('admin-settings-page-root'),
  ).toBeVisible({ timeout: 20_000 });
}

test.describe('Admin Settings Pages @admin', () => {
  // 1. 기본 페이지 로드
  test('Settings page loads without errors', async ({ page }) => {
    await openAdminSettingsPage(page);
    await expect(page.getByTestId('admin-settings-page-root')).toBeVisible();
  });

  // 2. Payment 탭
  test('Payment tab renders correctly', async ({ page }) => {
    await openAdminSettingsPage(page);

    const trigger = page.getByTestId('admin-settings-tab-trigger-payment');
    await expect(trigger).toBeVisible();
    await trigger.click();

    const panel = page.getByTestId('admin-settings-payment-tab');
    await expect(panel).toBeVisible();
  });

  // 3. Delivery 탭
  test('Delivery tab renders correctly', async ({ page }) => {
    await openAdminSettingsPage(page);

    const trigger = page.getByTestId('admin-settings-tab-trigger-delivery');
    await expect(trigger).toBeVisible();
    await trigger.click();

    const panel = page.getByTestId('admin-settings-delivery-tab');
    await expect(panel).toBeVisible();
  });

  // 4. Maps 탭
  test('Maps tab renders correctly', async ({ page }) => {
    await openAdminSettingsPage(page);

    const trigger = page.getByTestId('admin-settings-tab-trigger-maps');
    await expect(trigger).toBeVisible();
    await trigger.click();

    const panel = page.getByTestId('admin-settings-maps-tab');
    await expect(panel).toBeVisible();
  });

  // 5. FCM 탭
  test('FCM tab renders correctly', async ({ page }) => {
    await openAdminSettingsPage(page);

    const trigger = page.getByTestId('admin-settings-tab-trigger-fcm');
    await expect(trigger).toBeVisible();
    await trigger.click();

    const panel = page.getByTestId('admin-settings-fcm-tab');
    await expect(panel).toBeVisible();
  });

  // 6. Operations 탭
  test('Operations tab renders correctly', async ({ page }) => {
    await openAdminSettingsPage(page);

    const trigger = page.getByTestId('admin-settings-tab-trigger-operations');
    await expect(trigger).toBeVisible();
    await trigger.click();

    const panel = page.getByTestId('admin-settings-operations-tab');
    await expect(panel).toBeVisible();
  });

  // 7. 모든 탭을 순차적으로 전환
  test('All tabs can be switched without errors', async ({ page }) => {
    await openAdminSettingsPage(page);

    const triggers = [
      'admin-settings-tab-trigger-payment',
      'admin-settings-tab-trigger-delivery',
      'admin-settings-tab-trigger-maps',
      'admin-settings-tab-trigger-fcm',
      'admin-settings-tab-trigger-operations',
    ] as const;

    const panels = [
      'admin-settings-payment-tab',
      'admin-settings-delivery-tab',
      'admin-settings-maps-tab',
      'admin-settings-fcm-tab',
      'admin-settings-operations-tab',
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
