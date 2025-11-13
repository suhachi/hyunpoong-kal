import { test, expect } from '@playwright/test';

// 관리자 접근에 필요한 mock 사용자 주입
const mockAdmin = {
  uid: 'admin-001',
  email: 'admin@hyunpungkalguksu.com',
  displayName: '관리자',
  role: 'owner',
  storeId: 'store-hyunpung',
};

const routes = [
  '/admin',
  '/admin/orders',
  '/admin/menus',
  '/admin/reviews',
  '/admin/analytics',
  '/admin/integrated-analytics',
  '/admin/delivery',
  '/admin/promotions',
  '/admin/points',
  '/admin/support',
  '/admin/settings',
];

test.describe('Admin Routes', () => {
  test.beforeEach(async ({ page }) => {
    // 콘솔 에러 감시를 위해 리스너 설치
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // 첫 네비게이션 전 localStorage에 mock 주입
    await page.addInitScript((admin) => {
      localStorage.setItem('mockUser', JSON.stringify(admin));
      localStorage.setItem('mockRole', 'owner');
    }, mockAdmin);
  });

  for (const path of routes) {
    test(`renders ${path} without red console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      const res = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(res?.ok()).toBeTruthy();

      // 기본 가시성 확인(바디 표기)
      await expect(page.locator('body')).toBeVisible();

      // 네트워크 안정화 대기
      await page.waitForLoadState('networkidle');

      // 빨간 에러가 없는지 확인
      if (errors.length > 0) {
        console.error(`Console errors on ${path}:\n` + errors.join('\n'));
      }
      expect(errors, `Console errors on ${path}`).toEqual([]);
    });
  }
});
