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

import { test, expect, Page } from '@playwright/test';

// Mock 관리자 사용자
const mockAdmin = {
  uid: 'admin-001',
  email: 'admin@hyunpoongkalguksu.com',
  displayName: '관리자',
  role: 'owner',
  storeId: 'store-hyunpung',
};

// 공통 헬퍼: Admin Settings 페이지 열기
async function openAdminSettingsPage(page: Page) {
  // localStorage에 mock 사용자 주입
  await page.addInitScript((admin) => {
    localStorage.setItem('mockUser', JSON.stringify(admin));
    localStorage.setItem('mockRole', 'owner');
  }, mockAdmin);

  // /admin/settings 진입
  await page.goto('/admin/settings', { waitUntil: 'domcontentloaded' });
  
  // networkidle 제거: SPA/Firebase 환경에서 불안정
  // 대신 domcontentloaded + 짧은 대기 + polling 방식 사용
  await page.waitForTimeout(2000);
  
  // admin-settings-page-root가 나타날 때까지 polling (최대 15000ms)
  // lazy loading + Suspense 때문에 더 긴 타임아웃 필요
  await expect(page.getByTestId('admin-settings-page-root')).toBeVisible({ timeout: 15000 });
}

test.describe('Admin Settings Pages @admin', () => {
  // beforeEach 제거: 각 테스트가 독립적으로 페이지를 열도록 변경 (flakiness 감소)

  test('Settings page loads without errors', async ({ page }) => {
    // 각 테스트가 독립적으로 페이지를 엽니다
    await openAdminSettingsPage(page);

    // 콘솔 에러 수집
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // 페이지 루트 확인 (이미 openAdminSettingsPage에서 확인했지만 재확인)
    await expect(page.getByTestId('admin-settings-page-root')).toBeVisible();

    // 에러 검증
    if (errors.length > 0) {
      console.error('\n❌ Console errors on Settings page:\n' + errors.join('\n'));
    }
    expect(errors, 'No console errors on Settings page').toEqual([]);
  });

  test('Payment tab renders correctly', async ({ page }) => {
    // 각 테스트가 독립적으로 페이지를 엽니다
    await openAdminSettingsPage(page);

    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Payment 탭 클릭 (이미 기본 탭일 수도 있음)
    const paymentTrigger = page.getByTestId('admin-settings-tab-trigger-payment');
      await expect(paymentTrigger).toBeVisible();
      await paymentTrigger.click();
      await page.waitForTimeout(100);
      const paymentTab = page.getByTestId('admin-settings-payment-tab');
      await expect(paymentTab).toBeVisible();

    // 에러 검증
    expect(errors, 'No console errors on Payment tab').toEqual([]);
  });

  test('Delivery tab renders correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await openAdminSettingsPage(page);

    const deliveryTrigger = page.getByTestId('admin-settings-tab-trigger-delivery');
      await expect(deliveryTrigger).toBeVisible();
      await deliveryTrigger.click();
      await page.waitForTimeout(100);
      const deliveryTab = page.getByTestId('admin-settings-delivery-tab');
      await expect(deliveryTab).toBeVisible();

    // 에러 검증
    expect(errors, 'No console errors on Delivery tab').toEqual([]);
  });

  test('Maps tab renders correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await openAdminSettingsPage(page);

    const mapsTrigger = page.getByTestId('admin-settings-tab-trigger-maps');
      await expect(mapsTrigger).toBeVisible();
      await mapsTrigger.click();
      await page.waitForTimeout(100);
      const mapsTab = page.getByTestId('admin-settings-maps-tab');
      await expect(mapsTab).toBeVisible();

    // 에러 검증
    expect(errors, 'No console errors on Maps tab').toEqual([]);
  });

  test('FCM tab renders correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await openAdminSettingsPage(page);

    const fcmTrigger = page.getByTestId('admin-settings-tab-trigger-fcm');
      await expect(fcmTrigger).toBeVisible();
      await fcmTrigger.click();
      await page.waitForTimeout(100);
      const fcmTab = page.getByTestId('admin-settings-fcm-tab');
      await expect(fcmTab).toBeVisible();

    // 에러 검증
    expect(errors, 'No console errors on FCM tab').toEqual([]);
  });

  test('Operations tab renders correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await openAdminSettingsPage(page);

    const opsTrigger = page.getByTestId('admin-settings-tab-trigger-operations');
      await expect(opsTrigger).toBeVisible();
      await opsTrigger.click();
      await page.waitForTimeout(100);
      const opsTab = page.getByTestId('admin-settings-operations-tab');
      await expect(opsTab).toBeVisible();

    // 에러 검증
    expect(errors, 'No console errors on Operations tab').toEqual([]);
  });

  test('All tabs can be switched without errors', async ({ page }) => {
    // 각 테스트가 독립적으로 페이지를 엽니다
    await openAdminSettingsPage(page);

    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

      const tabTriggers = [
        'admin-settings-tab-trigger-payment',
        'admin-settings-tab-trigger-delivery',
        'admin-settings-tab-trigger-maps',
        'admin-settings-tab-trigger-fcm',
        'admin-settings-tab-trigger-operations',
      ];
      const tabContents = [
        'admin-settings-payment-tab',
        'admin-settings-delivery-tab',
        'admin-settings-maps-tab',
        'admin-settings-fcm-tab',
        'admin-settings-operations-tab',
      ];
      for (let i = 0; i < tabTriggers.length; i++) {
        const trigger = page.getByTestId(tabTriggers[i]);
        await expect(trigger).toBeVisible();
        await trigger.click();
        await page.waitForTimeout(50);
        const content = page.getByTestId(tabContents[i]);
        await expect(content).toBeVisible();
        console.log(`✓ Clicked ${tabTriggers[i]} and verified ${tabContents[i]}`);
      }

    // 전체 탭 전환 후 에러 검증
    if (errors.length > 0) {
      console.error('\n❌ Console errors during tab switching:\n' + errors.join('\n'));
    }
    expect(errors, 'No console errors during all tabs switching').toEqual([]);
  });
});
