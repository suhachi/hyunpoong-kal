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
    // 테스트 환경 localStorage 클린업 및 mockUser 구조 보강
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.addInitScript((admin) => {
      // 필수 필드 보장
      const safeAdmin = {
        uid: admin.uid || 'admin-001',
        email: admin.email || 'admin@hyunpoongkalguksu.com',
        displayName: admin.displayName || '관리자',
        role: admin.role || 'owner',
        storeId: admin.storeId || 'store-hyunpung',
      };
      localStorage.setItem('mockUser', JSON.stringify(safeAdmin));
      localStorage.setItem('mockRole', safeAdmin.role);
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
