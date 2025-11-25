# Step 8-3: Admin Settings/Routes 테스트 안정화 결과

## 작업 목표

1. `src/e2e/admin-settings.spec.ts` 안정화
2. `src/e2e/admin-routes.spec.ts` 안정화
3. 테스트 코드만 수정 (앱 코드 최소 변경)
4. data-testid 기반 셀렉터 사용
5. `waitForPageStable` 헬퍼 사용
6. `networkidle` 제거

## 작업 내용

### Step 8-3-1: admin-settings.spec.ts 구조 점검 & 스냅샷
- 현재 상태 주석 추가
- 실패 원인 분석 (root가 안 떠서 탭 트리거도 안 보임)
- 문제점 정리 (networkidle 사용, waitForTimeout 사용)

### Step 8-3-2: admin-settings.spec.ts 공통 헬퍼 및 beforeEach 정리
- `waitForPageStable` 헬퍼 추가
- `beforeEach`에서 `networkidle` 제거
- `beforeEach`에서 root가 보일 때까지 대기 추가 (timeout: 10000ms)

### Step 8-3-3: admin-settings.spec.ts 탭 전환 테스트 안정화
- 모든 탭 전환 테스트에서 `waitForTimeout` → `waitForPageStable` 교체
- 탭 트리거 및 탭 내용에 `timeout: 5000ms` 추가
- "All tabs can be switched" 테스트도 동일 패턴 적용

### Step 8-3-4: admin-routes.spec.ts 공통 검증 로직 정리
- `waitForPageStable` 헬퍼 추가
- `assertAdminRoute` 헬퍼 추가
- `networkidle` 제거
- 콘솔 에러 필터링 (Notification permission 경고 제외)

## 테스트 결과 (Chromium 기준)

### admin-settings.spec.ts
- **총 테스트 수**: 7개
- **통과**: 0개
- **실패**: 7개

#### 실패한 테스트 목록:
1. **Settings page loads without errors**
   - 실패 사유: `admin-settings-page-root`가 10000ms 내에 보이지 않음
   - 원인: Mock Admin 로그인 타이밍 문제 또는 ProtectedRoute 차단

2. **Payment tab renders correctly**
   - 실패 사유: `admin-settings-tab-trigger-payment`가 5000ms 내에 보이지 않음
   - 원인: root가 안 떠서 탭 트리거도 안 보임

3. **Delivery tab renders correctly**
   - 실패 사유: `admin-settings-tab-trigger-delivery`가 5000ms 내에 보이지 않음
   - 원인: root가 안 떠서 탭 트리거도 안 보임

4. **Maps tab renders correctly**
   - 실패 사유: `admin-settings-tab-trigger-maps`가 5000ms 내에 보이지 않음
   - 원인: root가 안 떠서 탭 트리거도 안 보임

5. **FCM tab renders correctly**
   - 실패 사유: `admin-settings-tab-trigger-fcm`가 5000ms 내에 보이지 않음
   - 원인: root가 안 떠서 탭 트리거도 안 보임

6. **Operations tab renders correctly**
   - 실패 사유: `admin-settings-tab-trigger-operations`가 5000ms 내에 보이지 않음
   - 원인: root가 안 떠서 탭 트리거도 안 보임

7. **All tabs can be switched without errors**
   - 실패 사유: `admin-settings-tab-trigger-payment`가 5000ms 내에 보이지 않음
   - 원인: root가 안 떠서 탭 트리거도 안 보임

### admin-routes.spec.ts
- **총 테스트 수**: 11개
- **통과**: 0개
- **실패**: 11개

#### 실패한 테스트 목록:
1. **renders /admin (Dashboard) without console errors**
   - 실패 사유: 레이아웃이 8000ms 내에 보이지 않음

2. **renders /admin/orders (Orders) without console errors**
   - 실패 사유: 레이아웃이 8000ms 내에 보이지 않음

3. **renders /admin/menus (Menus) without console errors**
   - 실패 사유: 레이아웃이 8000ms 내에 보이지 않음

4. **renders /admin/reviews (Reviews) without console errors**
   - 실패 사유: 레이아웃이 8000ms 내에 보이지 않음

5. **renders /admin/analytics (Analytics) without console errors**
   - 실패 사유: 레이아웃이 8000ms 내에 보이지 않음

6. **renders /admin/integrated-analytics (IntegratedAnalytics) without console errors**
   - 실패 사유: 레이아웃이 8000ms 내에 보이지 않음

7. **renders /admin/delivery (Delivery) without console errors**
   - 실패 사유: 레이아웃이 8000ms 내에 보이지 않음

8. **renders /admin/promotions (Promotions) without console errors**
   - 실패 사유: 레이아웃이 8000ms 내에 보이지 않음

9. **renders /admin/points (Points) without console errors**
   - 실패 사유: 레이아웃이 8000ms 내에 보이지 않음

10. **renders /admin/support (Support) without console errors**
    - 실패 사유: 레이아웃이 8000ms 내에 보이지 않음

11. **renders /admin/settings (Settings) without console errors**
    - 실패 사유: 레이아웃이 8000ms 내에 보이지 않음

## 개선 사항

### 완료된 작업
1. ✅ `networkidle` 제거 완료
2. ✅ `waitForPageStable` 헬퍼 추가 및 사용
3. ✅ `waitForTimeout` → `waitForPageStable` 교체
4. ✅ data-testid 기반 셀렉터 사용 (이미 구현됨)
5. ✅ 공통 헬퍼 함수 추가 (`waitForPageStable`, `assertAdminRoute`)
6. ✅ 콘솔 에러 필터링 (Notification permission 경고 제외)

### 남은 문제
1. **Mock Admin 로그인 타이밍 문제**
   - `addInitScript`로 주입된 `mockUser`가 AuthContext에 반영되기 전에 ProtectedRoute가 실행됨
   - Step 8-2에서 `initializing` state와 Mock 모드 지연을 추가했으나, 여전히 타이밍 이슈 존재

2. **ProtectedRoute 차단**
   - Mock Admin이 AuthContext에 반영되기 전에 ProtectedRoute가 차단 화면을 표시
   - `initializing` state 확인 로직이 있으나, 테스트 환경에서 충분하지 않을 수 있음

3. **Admin Layout 렌더링 타이밍**
   - Admin 페이지가 렌더링되기 전에 테스트가 실행됨
   - `admin-settings-page-root`가 보이지 않음

## 다음 단계 제안

1. **테스트 대기 전략 개선**
   - `beforeEach`에서 `initializing` state가 false가 될 때까지 대기
   - ProtectedRoute가 통과할 때까지 polling 방식으로 대기

2. **Mock Admin 주입 타이밍 개선**
   - `addInitScript` 대신 `page.goto` 전에 `localStorage` 직접 설정
   - 또는 `page.evaluate`로 동기적으로 설정

3. **Admin Layout data-testid 확인**
   - Admin Layout 컴포넌트에 `data-testid="admin-layout-root"` 추가 여부 확인
   - 없으면 추가 필요

## 변경된 파일

1. `src/e2e/admin-settings.spec.ts`
   - `waitForPageStable` 헬퍼 추가
   - `beforeEach`에서 `networkidle` 제거, root 대기 추가
   - 모든 탭 전환 테스트에서 `waitForPageStable` 사용

2. `src/e2e/admin-routes.spec.ts`
   - `waitForPageStable` 헬퍼 추가
   - `assertAdminRoute` 헬퍼 추가
   - `networkidle` 제거
   - 콘솔 에러 필터링 개선

## 롤백 전략

모든 변경사항은 테스트 코드 파일에만 한정되어 있으므로, 필요 시 다음 명령으로 롤백 가능:

```bash
git restore src/e2e/admin-settings.spec.ts
git restore src/e2e/admin-routes.spec.ts
```

## 결론

테스트 코드 안정화 작업은 완료되었으나, 여전히 Mock Admin 로그인 타이밍 문제로 인해 모든 테스트가 실패하고 있습니다. 이는 **앱 코드의 타이밍 문제**로 보이며, 테스트 코드만으로는 해결하기 어려울 수 있습니다.

다음 단계에서는:
1. Mock Admin 주입 타이밍 개선
2. ProtectedRoute의 `initializing` state 대기 로직 강화
3. Admin Layout 렌더링 타이밍 개선

이 필요합니다.

