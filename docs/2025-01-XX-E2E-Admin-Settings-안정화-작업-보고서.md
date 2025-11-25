# E2E Admin Settings 안정화 작업 보고서

**작업 일자**: 2025-01-XX  
**작업 목표**: Mock 모드에서 Admin Settings 페이지가 항상 렌더링되도록 보장하고, E2E 테스트 통과율 향상

---

## 📋 작업 개요

### 목표
- Mock 모드에서 `/admin/settings` 페이지가 항상 렌더링되도록 100% 보장
- `admin-settings-page-root`가 언제나 DOM에 존재하도록 보장
- `admin-settings.spec.ts` 테스트 통과율 향상

### 현재 상태
- **Admin Routes E2E**: ✅ 11/11 통과
- **Admin Settings E2E**: ❌ 0/7 통과 (admin-settings-page-root를 찾지 못함)

---

## 🔍 문제 원인 분석

### 1. 구조 다이어그램

```
App.tsx
  └─ <BrowserRouter>
      └─ <AuthProvider>
          └─ <CartProvider>
              └─ <Suspense fallback={<LoadingFallback />}>
                  └─ <Routes>
                      └─ <Route path="/admin" element={<ProtectedRoute roles={["owner","admin"]}><AdminLayout /></ProtectedRoute>}>
                          └─ <Route path="settings" element={<AdminSettingsCenter />} />
```

### 2. 발견된 문제점

| 문제 영역 | 문제 내용 | 영향 |
|----------|----------|------|
| **AuthContext** | Mock 모드에서 `initializing=true`로 시작, `mockUser` 즉시 반영 안 됨 | ProtectedRoute 차단 |
| **ProtectedRoute** | Mock 모드에서도 `loading`/`initializing`/`user` 체크로 차단 | AdminLayout 렌더링 차단 |
| **AdminLayout** | Mock 모드에서도 `loading`/`!user` 조건으로 차단 | Outlet 렌더링 차단 |
| **AdminSettingsCenter** | Mock 모드에서도 `!user` 조건으로 차단 | admin-settings-page-root 미렌더 |
| **E2E 테스트** | `networkidle` 사용으로 불안정 | 타임아웃 발생 |

---

## ✅ 수정 완료 내역

### 1. AuthContext.tsx

**변경 사항:**
- `initializing` 초기값: `USE_FIREBASE ? true : false`
- `useLayoutEffect`로 Mock 모드에서 즉시 `mockUser` 반영
- 3회 재확인 로직 제거 (즉시 처리로 변경)

**핵심 코드:**
```typescript
const [initializing, setInitializing] = useState(USE_FIREBASE ? true : false);

useLayoutEffect(() => {
  if (!USE_FIREBASE) {
    const mu = loadMockUserFromStorage();
    setUser(mu || null);
    setInitializing(false);
    setLoading(false);
    return;
  }
}, []);
```

### 2. ProtectedRoute.tsx

**변경 사항:**
- Mock 모드에서 모든 차단 로직 완전 우회
- `mockDelayPassed` 상태 제거
- Firebase 모드만 기존 로직 유지

**핵심 코드:**
```typescript
// Mock 모드: 차단 로직 전부 무시하고 children을 통과
if (!USE_FIREBASE) {
  return <>{children}</>;
}

// Firebase 모드: 기존 로직 그대로 유지
if (loading || initializing) return <LoadingSkeleton />;
if (requireAuth && !user) return <Navigate to="/login" />;
```

### 3. AdminLayout.tsx

**변경 사항:**
- Mock 모드에서 `loading`/`user` 체크 제거
- `data-testid="admin-layout-root"` 추가
- Firebase 모드만 기존 로직 유지

**핵심 코드:**
```typescript
// Mock 모드: loading/user 조건으로 차단하지 않음
if (USE_FIREBASE) {
  if (loading) return <div>로딩 중...</div>;
  if (!user) { navigate('/dev'); return null; }
}

return (
  <div className="min-h-screen bg-[#F9F6F3]" data-testid="admin-layout-root">
    ...
    <Outlet />
  </div>
);
```

### 4. AdminSettingsCenter (index.tsx)

**변경 사항:**
- Mock 모드에서 `user`/`loading`/`initializing` 체크 제거
- 항상 `admin-settings-page-root` 렌더링 보장
- Firebase 모드만 기존 로직 유지

**핵심 코드:**
```typescript
// Mock 모드: user/loading/initializing과 무관하게 항상 admin-settings-page-root 렌더링
if (USE_FIREBASE) {
  if (loading || initializing || !user) return <div>로딩 중...</div>;
  if (user.role !== 'owner' && user.role !== 'admin') return <div>접근 권한...</div>;
}

// Mock 모드/Firebase 모드 공통: 항상 admin-settings-page-root 렌더링 보장
return (
  <div data-testid="admin-settings-page-root" className="space-y-6">
    ...
  </div>
);
```

### 5. admin-settings.spec.ts

**변경 사항:**
- `beforeEach` 제거, 각 테스트가 독립적으로 페이지 열기
- `networkidle` 제거, `domcontentloaded` + `waitForTimeout(2000)` + `toBeVisible({ timeout: 15000 })` 사용
- `openAdminSettingsPage` 공통 헬퍼 함수 추가

**핵심 코드:**
```typescript
async function openAdminSettingsPage(page: Page) {
  await page.addInitScript((admin) => {
    localStorage.setItem('mockUser', JSON.stringify(admin));
    localStorage.setItem('mockRole', 'owner');
  }, mockAdmin);

  await page.goto('/admin/settings', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await expect(page.getByTestId('admin-settings-page-root')).toBeVisible({ timeout: 15000 });
}
```

---

## 📊 테스트 결과

### 현재 상태 (최종 실행 기준)

**Admin Routes E2E:**
- ✅ 11/11 통과

**Admin Settings E2E:**
- ❌ 0/7 통과
- 실패 원인: `admin-settings-page-root`를 찾지 못함 (15000ms 타임아웃)

### 실패 원인 분석

1. **Lazy Loading 지연**: `AdminSettingsCenter`가 lazy loading으로 로드되어 Suspense fallback 동안 `admin-settings-page-root`가 없을 수 있음
2. **React Router 렌더링 타이밍**: `/admin/settings` 라우트가 완전히 마운트되기 전에 테스트가 실행될 수 있음
3. **Suspense Fallback**: Suspense fallback이 계속 표시되는 경우

---

## 🔧 수정된 파일 목록

1. `src/contexts/AuthContext.tsx`
2. `src/components/shared/ProtectedRoute.tsx`
3. `src/pages/admin/_layout/AdminLayout.tsx`
4. `src/pages/admin/Settings/index.tsx`
5. `src/e2e/admin-settings.spec.ts`

---

## 📝 남은 작업

### 우선순위 1: Admin Settings E2E 테스트 통과

**목표**: `admin-settings.spec.ts` 7개 테스트 모두 통과

**남은 문제:**
- `admin-settings-page-root`를 찾지 못함 (15000ms 타임아웃)

**추가 디버깅 필요:**
1. **Lazy Loading 문제 해결**
   - `AdminSettingsCenter`를 lazy loading에서 일반 import로 변경 (테스트 환경 한정)
   - 또는 Suspense fallback에도 `admin-settings-page-root` 추가

2. **렌더링 타이밍 개선**
   - `openAdminSettingsPage`에서 더 긴 타임아웃 사용 (20000ms)
   - 또는 `expect.poll()` 사용하여 polling 방식으로 대기

3. **디버깅 코드 추가**
   ```typescript
   // DOM 상태 확인
   const rootCount = await page.locator('[data-testid="admin-settings-page-root"]').count();
   console.log('[DEBUG] admin-settings-page-root count:', rootCount);
   
   // 페이지 스크린샷
   await page.screenshot({ path: 'debug-before-wait.png' });
   ```

### 우선순위 2: 다른 E2E 테스트 안정화

**목표**: 전체 E2E 테스트 통과율 향상

**확인 필요:**
- `accessibility.spec.ts`: 접근성 테스트 안정화
- `auth.spec.ts`: 인증 테스트 안정화
- `menu-detail-nav.spec.ts`: 메뉴 네비게이션 테스트 안정화
- `order-flow.spec.ts`: 주문 플로우 테스트 안정화

### 우선순위 3: 코드 품질 개선

**목표**: 타입 에러 및 Linter 경고 해결

**현재 상태:**
- `AdminLayout.tsx`: TypeScript 타입 정의 경고 (런타임 영향 없음)

---

## 🎯 내일 작업 계획

### Step 1: Admin Settings E2E 디버깅

1. **Trace 분석**
   ```bash
   npx playwright show-trace src/test-results/admin-settings-*-chromium/trace.zip
   ```
   - 실제 DOM 상태 확인
   - `admin-settings-page-root`가 렌더링되는 시점 확인
   - Suspense fallback이 계속 표시되는지 확인

2. **Lazy Loading 문제 해결**
   - 옵션 A: `AdminSettingsCenter`를 일반 import로 변경 (테스트 환경 한정)
   - 옵션 B: Suspense fallback에도 `admin-settings-page-root` 추가

3. **대기 전략 개선**
   - `expect.poll()` 사용하여 polling 방식으로 대기
   - 또는 더 긴 타임아웃 사용 (20000ms)

### Step 2: 테스트 실행 및 검증

1. **Admin Settings E2E 재실행**
   ```bash
   npx playwright test src/e2e/admin-settings.spec.ts --project=chromium
   ```

2. **결과 확인**
   - 통과한 테스트 수 확인
   - 실패한 테스트의 스크린샷 및 trace 확인

### Step 3: 전체 E2E 테스트 실행

1. **전체 테스트 실행**
   ```bash
   npm run test:e2e
   ```

2. **결과 분석**
   - 전체 통과율 확인
   - 실패한 테스트 목록 정리
   - 우선순위 결정

---

## 📌 핵심 변경 사항 요약

### Mock 모드 렌더링 Invariant

**목표**: Mock 모드(USE_FIREBASE === false)에서 `/admin/settings`에 들어오면, 항상 다음 두 요소가 DOM에 찍혀야 함:

```tsx
<div data-testid="admin-layout-root"> ... <Outlet /> ... </div>
<div data-testid="admin-settings-page-root"> ... tabs ... </div>
```

**설령:**
- `user === null` 이어도
- `storeId`가 없거나
- Firestore settings 문서가 비어 있어도

**최소한 저 두 개의 루트 div는 항상 찍히게 설계**

### Firebase 모드는 보안/권한 체크 유지

`USE_FIREBASE === true`인 경우에는, 기존의 `loading` / `initializing` / `user` / `role` 체크를 유지

---

## 🚀 테스트 실행 가이드

### 실행 커맨드:
```bash
npx playwright test src/e2e/admin-settings.spec.ts --project=chromium
```

### 예상 결과:
- 테스트 7개 중 최소 2개 통과 (Settings page loads, All tabs can be switched)
- 나머지 5개는 개별 탭 테스트 (Payment, Delivery, Maps, FCM, Operations)

### 실패 시 확인 사항:

1. **스크린샷 확인:**
   ```bash
   # 실패한 테스트의 스크린샷 위치
   src/test-results/admin-settings-*-chromium/test-failed-1.png
   ```

2. **Trace 확인:**
   ```bash
   npx playwright show-trace src/test-results/admin-settings-*-chromium/trace.zip
   ```

3. **DOM 상태 확인:**
   - Trace에서 `admin-settings-page-root`가 실제로 렌더링되었는지 확인
   - `admin-layout-root`가 먼저 렌더링되었는지 확인
   - Suspense fallback이 계속 표시되는지 확인

4. **콘솔 에러 확인:**
   - `Error Context` 파일에서 실제 DOM 상태 확인
   - 브라우저 콘솔에서 React 에러 확인

---

## 📚 참고 자료

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [React Router v6 Documentation](https://reactrouter.com/en/main)
- [React Suspense Documentation](https://react.dev/reference/react/Suspense)

---

**작성자**: AI Assistant  
**작성 일자**: 2025-01-XX  
**다음 작업 일자**: 2025-01-XX (내일)

