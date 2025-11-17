// 테스트 전용 유틸: E2E에서만 사용하세요. 앱 코드에서 import 금지.
import type { Page } from '@playwright/test';

const ADMIN_BASE_URL = '/admin';

export async function loginAsAdminWithLocalStorage(page: Page) {
  await page.addInitScript(() => {
    const mockAdmin = {
      uid: 'admin-001',
      email: 'admin@hyunpoongkalguksu.com',
      displayName: '관리자',
      role: 'owner',
      storeId: 'store-hyunpung',
    };
    localStorage.setItem('mockUser', JSON.stringify(mockAdmin));
    localStorage.setItem('mockRole', 'owner');
  });

  // Firebase 모드일 때: 익명 로그인 시도 (권한 가드 통과 목적)
  if (process.env.VITE_USE_FIREBASE === 'true') {
    // 먼저 루트 로드하여 앱 Firebase 초기화 유도
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    // auth 모듈 동적 import 후 익명 로그인
    await page.evaluate(async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { getAuth, signInAnonymously } = await import('firebase/auth');
        const auth = getAuth();
        if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
        // 익명 uid를 mockUser에 동기화하여 userId/권한 혼동 방지
        if (auth.currentUser) {
          try {
            const raw = localStorage.getItem('mockUser');
            if (raw) {
              const obj = JSON.parse(raw);
              obj.uid = auth.currentUser.uid;
              localStorage.setItem('mockUser', JSON.stringify(obj));
            }
          } catch {}
        }
      } catch (e) {
        console.warn('[admin-login] anonymous sign-in failed', e);
      }
    });
  }

  await page.goto(`${ADMIN_BASE_URL}/orders`);
}
