# 문제 분석 보고서 - /admin/dashboard 진입 실패

**작성일**: 2025-11-21  
**문제 발생 위치**: `/admin/dashboard` 경로  
**현재 상태**: 진입 불가

---

## 🔍 문제 확인

### 사용자 보고
- `/admin/dashboard` 진입이 안 됨
- 배포 후에도 동일한 문제 발생

---

## 📊 정밀 분석 결과

### 1. 라우팅 설정 확인

**파일**: `src/App.tsx`

**현재 라우팅 구조**:
```tsx
<Route path="/admin" element={<ProtectedRoute roles={["owner", "admin"]}><AdminLayout /></ProtectedRoute>}>
  <Route index element={<Dashboard />} />           // /admin → Dashboard
  <Route path="dashboard" element={<Dashboard />} /> // /admin/dashboard → Dashboard (추가됨)
  ...
</Route>
```

**분석 결과**: ✅ **라우팅 설정은 정상**
- `/admin/dashboard` 명시 라우트가 존재함 (149줄)
- `index` 라우트도 정상 설정됨 (148줄)

---

### 2. ProtectedRoute 확인

**파일**: `src/components/shared/ProtectedRoute.tsx`

**로직 분석**:
1. **로딩 중**: `<LoadingSkeleton />` 표시
2. **인증 없음**: `/login`으로 리다이렉트
3. **역할 불일치**: `/`로 리다이렉트
4. **정상**: `children` 렌더링

**분석 결과**: ✅ **ProtectedRoute 로직 정상**
- 디버그 로그도 포함되어 있어 문제 추적 가능

---

### 3. AdminLayout 확인

**파일**: `src/pages/admin/_layout/AdminLayout.tsx`

**잠재적 문제 발견**:

```tsx
// 44-48줄
if (!user) {
  // 이 경우는 ProtectedRoute 설정이 잘못됐을 때만 발생해야 함
  // 안전장치 정도로만 남겨두기
  navigate('/dev', { replace: true });
  return null;
}
```

**문제점**: ⚠️ **이중 체크 로직**
- `ProtectedRoute`에서 이미 인증 체크를 했는데, `AdminLayout`에서 또 체크함
- 만약 타이밍 이슈로 `user`가 잠시 `null`이면 `/dev`로 리다이렉트됨

**분석 결과**: ⚠️ **타이밍 이슈 가능성**
- `ProtectedRoute`를 통과했지만, `AdminLayout` 렌더링 시점에 `user`가 아직 설정되지 않았을 수 있음
- 또는 `AuthContext`의 `loading` 상태와 `user` 상태 동기화 문제

---

### 4. AuthContext 확인

**파일**: `src/contexts/AuthContext.tsx`

**Mock 모드 초기화 로직**:
```tsx
// 94-109줄
else {
  // Mock Auth
  console.log('[AuthContext] 🔍 USE_FIREBASE:', USE_FIREBASE);
  console.log('[AuthContext] 🔍 Mock 모드 초기화 시작');
  try {
    const mockUser = loadMockUserFromStorage();
    if (mockUser) {
      setUser(mockUser);
    } else {
      console.warn('[AuthContext] ⚠️ mockUser가 없습니다');
    }
  } catch (error) {
    console.error('[AuthContext] ❌ Mock 사용자 로드 실패:', error);
  } finally {
    setLoading(false);
    console.log('[AuthContext] 🏁 초기화 완료, loading=false');
  }
}
```

**분석 결과**: ⚠️ **Mock 사용자 로드 문제 가능성**
- `loadMockUserFromStorage()`가 `null`을 반환하면 `user`가 `null`로 남음
- 이 경우 `ProtectedRoute`는 `/login`으로 리다이렉트하지만, 만약 로그인하지 않은 상태라면 문제 발생

---

### 5. SidebarNav 확인

**파일**: `src/pages/admin/_layout/AdminLayout.tsx`

**대시보드 링크**:
```tsx
// 142줄
{ to: '/admin', icon: LayoutDashboard, label: '대시보드', end: true },
```

**분석 결과**: ✅ **정상**
- `/admin`으로 링크되어 있고, `end: true`로 정확히 `/admin`일 때만 활성화됨
- `/admin/dashboard`로 직접 접근하는 경우와는 무관

---

## 🎯 가능한 원인 시나리오

### 시나리오 1: Mock 사용자 미로그인 상태

**증상**:
- `/admin/dashboard` 접근 시 `/login`으로 리다이렉트

**원인**:
- `localStorage`에 `mockUser`가 없음
- 로그인하지 않은 상태

**해결 방법**:
1. `/login` 페이지에서 Mock 계정으로 로그인
   - 이메일: `admin@hyunpoongkalguksu.com`
   - 비밀번호: (Mock 모드에서는 체크 안 함)

---

### 시나리오 2: 타이밍 이슈 (AdminLayout의 이중 체크)

**증상**:
- `/admin/dashboard` 접근 시 `/dev`로 리다이렉트

**원인**:
- `ProtectedRoute`를 통과했지만, `AdminLayout` 렌더링 시점에 `user`가 아직 `null`
- `AuthContext`의 `loading` 상태와 `user` 상태 동기화 지연

**해결 방법**:
1. `AdminLayout`의 이중 체크 로직 제거 또는 개선
2. `ProtectedRoute`에서 이미 체크했으므로, `AdminLayout`에서는 신뢰

---

### 시나리오 3: 브라우저 캐시 문제

**증상**:
- 배포 후에도 이전 버전이 표시됨
- 라우팅이 동작하지 않음

**원인**:
- 브라우저 캐시된 이전 버전
- Service Worker 캐시

**해결 방법**:
1. 브라우저 강력 새로고침 (Ctrl+Shift+R)
2. Service Worker 등록 해제 및 재등록
3. 하드 리프레시

---

### 시나리오 4: 빌드/배포 문제

**증상**:
- 배포되었지만 변경사항이 반영되지 않음

**원인**:
- 빌드 캐시 문제
- 배포 파일 불일치

**해결 방법**:
1. `dist` 폴더 삭제 후 재빌드
2. Firebase 배포 재시도

---

## 🔧 권장 해결 방법

### 즉시 확인 사항

1. **브라우저 콘솔 확인**
   - 에러 메시지 확인
   - `ProtectedRoute Debug` 로그 확인
   - `AuthContext` 로그 확인

2. **로그인 상태 확인**
   - Mock 계정으로 로그인했는지 확인
   - `localStorage.getItem('mockUser')` 확인

3. **네트워크 탭 확인**
   - 404 에러 확인
   - 리다이렉트 확인

### 코드 수정 권장 사항

1. **AdminLayout의 이중 체크 로직 제거**
   ```tsx
   // 현재 (문제 가능성)
   if (!user) {
     navigate('/dev', { replace: true });
     return null;
   }
   
   // 권장 (ProtectedRoute 신뢰)
   // 이 부분 제거 또는 로딩 상태만 확인
   if (loading) {
     return <LoadingSkeleton />;
   }
   ```

2. **ProtectedRoute와 AdminLayout 동기화**
   - `ProtectedRoute`에서 이미 인증 체크를 했으므로, `AdminLayout`에서는 `user`가 반드시 존재해야 함
   - 만약 `user`가 없다면, `ProtectedRoute` 로직에 문제가 있음

---

## 📝 다음 단계

1. **즉시 확인**:
   - [ ] 브라우저 콘솔 에러 확인
   - [ ] 로그인 상태 확인 (`localStorage.getItem('mockUser')`)
   - [ ] 네트워크 탭 확인

2. **코드 수정**:
   - [ ] `AdminLayout`의 이중 체크 로직 개선
   - [ ] 에러 처리 강화

3. **테스트**:
   - [ ] 로컬에서 `/admin/dashboard` 접근 테스트
   - [ ] 배포 후 실서버 테스트

---

**작성일**: 2025-11-21  
**상태**: ⏳ **원인 분석 완료, 추가 확인 필요**

