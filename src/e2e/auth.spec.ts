import { test, expect } from "@playwright/test";

/**
 * 로그인/회원가입 E2E 테스트
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

test.describe("인증 시스템", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("로그인 페이지 접근", async ({ page }) => {
    await page.goto("/login");

    // 페이지 제목 확인
    await expect(page.locator("text=현풍닭칼국수")).toBeVisible();
    await expect(page.locator("text=로그인하고 맛있는 칼국수를 주문하세요")).toBeVisible();

    // 이메일 입력 필드
    await expect(page.locator('input[type="email"]')).toBeVisible();

    // 비밀번호 입력 필드
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // 로그인 버튼
    await expect(page.locator('button:has-text("로그인")')).toBeVisible();

    // 구글 로그인 버튼
    await expect(page.locator('button:has-text("구글로 로그인")')).toBeVisible();

    // 회원가입 링크
    await expect(page.locator("text=회원가입")).toBeVisible();
  });

  test("Mock 계정으로 로그인", async ({ page }) => {
    await page.goto("/login");

    // 이메일 입력
    await page.fill('input[type="email"]', "customer@example.com");

    // 비밀번호 입력
    await page.fill('input[type="password"]', "test1234");

    // 로그인 버튼 클릭
    await page.click('button:has-text("로그인")');

    // 홈 페이지로 리다이렉트 확인
    await expect(page).toHaveURL("/");

    // 로그인 성공 토스트 확인
    await expect(page.locator("text=로그인 성공")).toBeVisible({ timeout: 5000 });
  });

  test("잘못된 로그인 정보로 에러 표시", async ({ page }) => {
    await page.goto("/login");

    // 잘못된 이메일/비밀번호
    await page.fill('input[type="email"]', "wrong@example.com");
    await page.fill('input[type="password"]', "wrongpassword");

    // 로그인 시도
    await page.click('button:has-text("로그인")');

    // 에러 메시지 확인
    await expect(page.locator("text=이메일 또는 비밀번호가 올바르지 않습니다")).toBeVisible({
      timeout: 5000,
    });
  });

  test("회원가입 페이지 접근", async ({ page }) => {
    await page.goto("/signup");

    // 페이지 제목
    await expect(page.locator("text=회원가입")).toBeVisible();

    // 입력 필드
    await expect(page.locator('input[name="displayName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();

    // 약관 동의 체크박스
    await expect(page.locator('input[id="terms"]')).toBeVisible();
    await expect(page.locator('input[id="privacy"]')).toBeVisible();
  });

  test("회원가입 유효성 검사", async ({ page }) => {
    await page.goto("/signup");

    // 짧은 비밀번호로 시도
    await page.fill('input[name="displayName"]', "홍길동");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "123");
    await page.fill('input[name="confirmPassword"]', "123");

    // 약관 동의 체크
    await page.check('input[id="terms"]');
    await page.check('input[id="privacy"]');

    // 회원가입 시도
    await page.click('button:has-text("회원가입")');

    // 에러 메시지 확인
    await expect(page.locator("text=비밀번호는 최소 6자 이상이어야 합니다")).toBeVisible({
      timeout: 5000,
    });
  });

  test("보호된 페이지 접근 시 로그인 페이지로 리다이렉트", async ({ page }) => {
    // 로그인하지 않은 상태에서 장바구니 접근
    await page.goto("/cart");

    // 로그인 페이지로 리다이렉트 확인
    await expect(page).toHaveURL("/login");
  });

  test("로그아웃", async ({ page }) => {
    // 먼저 로그인
    await page.goto("/login");
    await page.fill('input[type="email"]', "customer@example.com");
    await page.fill('input[type="password"]', "test1234");
    await page.click('button:has-text("로그인")');
    await page.waitForURL("/");

    // 마이페이지로 이동
    await page.goto("/my");

    // 로그아웃 버튼 클릭
    await page.click('button:has-text("로그아웃")');

    // 홈으로 리다이렉트
    await expect(page).toHaveURL("/");

    // 로그아웃 성공 토스트
    await expect(page.locator("text=로그아웃되었습니다")).toBeVisible({ timeout: 5000 });
  });
});
