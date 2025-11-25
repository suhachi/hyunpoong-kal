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
 * 
 * STEP-8-3-1: 현재 상태 스냅샷 (do not remove)
 * - 테스트 목록:
 *   1. Settings page loads without errors
 *   2. Payment tab renders correctly
 *   3. Delivery tab renders correctly
 *   4. Maps tab renders correctly
 *   5. FCM tab renders correctly
 *   6. Operations tab renders correctly
 *   7. All tabs can be switched without errors
 * 
 * - data-testid 의존성:
 *   - admin-settings-page-root (루트)
 *   - admin-settings-tab-trigger-payment, delivery, maps, fcm, operations (탭 트리거)
 *   - admin-settings-payment-tab, delivery-tab, maps-tab, fcm-tab, operations-tab (탭 내용)
 * 
 * - 현재 실패 원인 (Step 8-3-1 기준):
 *   1. "Settings page loads without errors": admin-settings-page-root가 5000ms 내에 보이지 않음
 *   2. "Payment tab renders correctly": admin-settings-tab-trigger-payment가 5000ms 내에 보이지 않음
 *   3. 기타 탭 테스트들도 유사한 패턴 (root가 안 떠서 탭 트리거도 안 보임)
 * 
 * - 문제점:
 *   - beforeEach에서 networkidle 사용 (line 35) - 제거 필요
 *   - waitForTimeout 사용 (line 67, 84, 101, 118, 135, 167) - waitForPageStable로 교체 필요
 *   - root가 렌더링되기 전에 테스트가 실행됨 (타이밍 문제)
 * 
 * - 수정 방향:
 *   - networkidle 제거, waitForPageStable 사용
 *   - beforeEach에서 root가 보일 때까지 대기 추가
 *   - 탭 전환 시 waitForPageStable 사용
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

// STEP-8-3-2: 공통 wait 헬퍼
async function waitForPageStable(page: Page, timeoutMs = 500) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(timeoutMs);
}

test.describe('Admin Settings Pages @admin', () => {
  test.beforeEach(async ({ page }) => {
    // STEP-8-3-2: Mock Admin 주입 및 페이지 로드
    // (1) mockAdmin 주입
    await page.addInitScript((admin) => {
      localStorage.setItem('mockUser', JSON.stringify(admin));
      localStorage.setItem('mockRole', 'owner');
    }, mockAdmin);

    // (2) /admin/settings로 이동
    await page.goto('/admin/settings', { waitUntil: 'domcontentloaded' });
    
    // (3) waitForPageStable 호출 (networkidle 제거)
    await waitForPageStable(page, 800);
    
    // (4) root가 보일 때까지 대기 (타이밍 보장)
    await expect(page.getByTestId('admin-settings-page-root')).toBeVisible({ timeout: 10000 });
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
      await expect(page.getByTestId('admin-settings-page-root')).toBeVisible();

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

    // STEP-8-3-3: 탭 전환 안정화
    const paymentTrigger = page.getByTestId('admin-settings-tab-trigger-payment');
    await expect(paymentTrigger).toBeVisible({ timeout: 5000 });
    await paymentTrigger.click();
    await waitForPageStable(page, 500);
    const paymentTab = page.getByTestId('admin-settings-payment-tab');
    await expect(paymentTab).toBeVisible({ timeout: 5000 });

    // 에러 검증
    expect(errors, 'No console errors on Payment tab').toEqual([]);
  });

  test('Delivery tab renders correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // STEP-8-3-3: 탭 전환 안정화
    const deliveryTrigger = page.getByTestId('admin-settings-tab-trigger-delivery');
    await expect(deliveryTrigger).toBeVisible({ timeout: 5000 });
    await deliveryTrigger.click();
    await waitForPageStable(page, 500);
    const deliveryTab = page.getByTestId('admin-settings-delivery-tab');
    await expect(deliveryTab).toBeVisible({ timeout: 5000 });

    // 에러 검증
    expect(errors, 'No console errors on Delivery tab').toEqual([]);
  });

  test('Maps tab renders correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // STEP-8-3-3: 탭 전환 안정화
    const mapsTrigger = page.getByTestId('admin-settings-tab-trigger-maps');
    await expect(mapsTrigger).toBeVisible({ timeout: 5000 });
    await mapsTrigger.click();
    await waitForPageStable(page, 500);
    const mapsTab = page.getByTestId('admin-settings-maps-tab');
    await expect(mapsTab).toBeVisible({ timeout: 5000 });

    // 에러 검증
    expect(errors, 'No console errors on Maps tab').toEqual([]);
  });

  test('FCM tab renders correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // STEP-8-3-3: 탭 전환 안정화
    const fcmTrigger = page.getByTestId('admin-settings-tab-trigger-fcm');
    await expect(fcmTrigger).toBeVisible({ timeout: 5000 });
    await fcmTrigger.click();
    await waitForPageStable(page, 500);
    const fcmTab = page.getByTestId('admin-settings-fcm-tab');
    await expect(fcmTab).toBeVisible({ timeout: 5000 });

    // 에러 검증
    expect(errors, 'No console errors on FCM tab').toEqual([]);
  });

  test('Operations tab renders correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // STEP-8-3-3: 탭 전환 안정화
    const opsTrigger = page.getByTestId('admin-settings-tab-trigger-operations');
    await expect(opsTrigger).toBeVisible({ timeout: 5000 });
    await opsTrigger.click();
    await waitForPageStable(page, 500);
    const opsTab = page.getByTestId('admin-settings-operations-tab');
    await expect(opsTab).toBeVisible({ timeout: 5000 });

    // 에러 검증
    expect(errors, 'No console errors on Operations tab').toEqual([]);
  });

  test('All tabs can be switched without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // STEP-8-3-3: 탭 전환 안정화
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
      await expect(trigger).toBeVisible({ timeout: 5000 });
      await trigger.click();
      await waitForPageStable(page, 300);
      const content = page.getByTestId(tabContents[i]);
      await expect(content).toBeVisible({ timeout: 5000 });
      console.log(`✓ Clicked ${tabTriggers[i]} and verified ${tabContents[i]}`);
    }

    // 전체 탭 전환 후 에러 검증
    if (errors.length > 0) {
      console.error('\n❌ Console errors during tab switching:\n' + errors.join('\n'));
    }
    expect(errors, 'No console errors during all tabs switching').toEqual([]);
  });
});
