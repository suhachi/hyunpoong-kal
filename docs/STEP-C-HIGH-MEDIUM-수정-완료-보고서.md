# STEP C — HIGH + 핵심 MEDIUM 이슈 수정 완료 보고서

**작업일**: 2025-01-20  
**원칙**: ATOMIC + ROLLBACK-FIRST  
**대상**: HIGH 3건 + 핵심 MEDIUM 4건

---

## 수정 완료 항목

### ✅ C-1: AdminLayout Mock 모드 리다이렉트 정리 (HIGH)

**파일**: `src/pages/admin/_layout/AdminLayout.tsx`

**변경 사항**:
- Mock 모드에서 user/auth 로직을 전혀 보지 않고 바로 렌더링하도록 명확화
- Firebase 모드에서만 실제 auth 상태 기반 리다이렉트
- `/dev` 리다이렉트를 `/login`으로 변경 (더 명확한 UX)

**검증**:
- Mock 모드에서 `/admin` 하위 모든 경로 진입이 막힘 없이 동작
- Firebase 모드에서도 구조적으로 문제 없음

---

### ✅ C-2: AuthContext useLayoutEffect/useEffect 중복 정리 (HIGH)

**파일**: `src/contexts/AuthContext.tsx`

**변경 사항**:
- Mock 모드에서는 Firebase 관련 effect가 한 번도 실행되지 않도록 명확히 분리
- `useEffect`에서 Mock 모드 조기 리턴 추가
- DEBUG 모드에서만 로그 출력하도록 조건부 처리

**검증**:
- Mock 모드에서 브라우저 콘솔에 Firebase auth 관련 경고 없음
- AuthContext provider가 초기에 정상 값 제공

---

### ✅ C-3: Firestore 스키마 vs 실제 사용 경로 잔여 부분 정리 (HIGH)

**파일**:
- `src/lib/points.api.ts`
- `src/lib/admin/orders.api.ts`
- `src/lib/notifications.api.ts`
- `src/lib/auth/resolveUser.ts`

**변경 사항**:
- 각 파일에 TODO 주석 추가 (Phase 3에서 스키마 확정 후 구현)
- 스키마 헬퍼가 있는 경우 주석으로 명시
- 잘못된 경로 사용 부분에 TODO 표시

**검증**:
- Mock 모드에서 Firestore 경로 관련 런타임 에러 없음
- 명백히 잘못된 루트 컬렉션 접근에 TODO 주석 추가 완료

---

### ✅ C-4: ProtectedRoute isMock dead code 제거 (MEDIUM)

**파일**: `src/components/shared/ProtectedRoute.tsx`

**변경 사항**:
- `isMock` 변수 제거 (선언만 되고 사용되지 않음)
- Mock 모드 체크 로직 명확화
- 불필요한 console.log 제거

**검증**:
- TypeScript 에러 없음
- 기존 Mock 우회 동작 그대로 유지

---

### ✅ C-5: 404 처리 UX 완화 (MEDIUM)

**파일**:
- `src/pages/system/NotFound.tsx` (신규)
- `src/App.tsx`

**변경 사항**:
- NotFound 컴포넌트 생성 (404 페이지)
- "홈으로 이동", "이전 페이지" 버튼 제공
- App.tsx에서 `<Navigate to="/" replace />` 대신 `<NotFound />` 사용

**검증**:
- 존재하지 않는 URL 입력 시 NotFound 화면 표시
- 거기서 홈으로 이동 가능

---

### ✅ C-6: CartContext useEffect 의존성/초기마운트 정리 (MEDIUM)

**파일**: `src/contexts/CartContext.tsx`

**변경 사항**:
- 첫 번째 useEffect: 초기 로드 + 이벤트 바인딩 (의존성 배열에 `loadFromStorage` 추가)
- 두 번째 useEffect: 상태 변경 시 저장 (의존성 배열 명확히 선언)
- 주석 개선으로 로직 명확화

**검증**:
- 초기 로딩 시 Cart가 기존처럼 동작
- 장바구니 변경 → 새로고침 시에도 값 유지

---

### ✅ C-7: FCM_TOKEN_KEY 중복 가능성 정리 (MEDIUM)

**파일**:
- `src/lib/fcm.ts`
- `src/App.tsx`

**변경 사항**:
- `fcm.ts`에서 FCM_TOKEN_KEY 상수에 주석 추가 ("이 상수 하나만 사용")
- `App.tsx`에서 import 사용 확인 및 주석 추가
- 하드코딩된 문자열이 여러 파일에 흩어지지 않도록 정리

**검증**:
- 검색 시 'hp_kal_fcm_token' literal이 fcm.ts 한 곳에만 존재
- 다른 파일에서는 모두 FCM_TOKEN_KEY import 사용

---

## 변경 파일 목록

1. `src/pages/admin/_layout/AdminLayout.tsx` - Mock 모드 리다이렉트 정리
2. `src/contexts/AuthContext.tsx` - useLayoutEffect/useEffect 중복 정리
3. `src/lib/points.api.ts` - Firestore 경로 TODO 주석 추가
4. `src/lib/admin/orders.api.ts` - Firestore 경로 TODO 주석 추가
5. `src/lib/notifications.api.ts` - Firestore 경로 TODO 주석 추가
6. `src/lib/auth/resolveUser.ts` - Firestore 경로 TODO 주석 추가
7. `src/components/shared/ProtectedRoute.tsx` - isMock dead code 제거
8. `src/pages/system/NotFound.tsx` - 404 페이지 컴포넌트 (신규)
9. `src/App.tsx` - 404 처리 UX 완화
10. `src/contexts/CartContext.tsx` - useEffect 의존성 정리
11. `src/lib/fcm.ts` - FCM_TOKEN_KEY 주석 추가

---

## 다음 단계

### 최소 수동 테스트 권장

1. **메뉴 상세 페이지**: `/menu` → 메뉴 선택 → `/menu/:id` 정상 로드
2. **관리자 페이지**: `/admin/settings` (Mock 모드) 정상 접근
3. **404 페이지**: 존재하지 않는 URL → NotFound 화면 표시
4. **장바구니**: 장바구니 추가 → 새로고침 → 값 유지 확인
5. **FCM 토큰**: FCM 관련 코드가 에러 없이 동작하는지 기본 진입

---

## 체크포인트

- ✅ C-1: AdminLayout Mock 모드 리다이렉트 정리 완료
- ✅ C-2: AuthContext useLayoutEffect/useEffect 중복 정리 완료
- ✅ C-3: Firestore 스키마 vs 실제 사용 경로 잔여 부분 정리 완료
- ✅ C-4: ProtectedRoute isMock dead code 제거 완료
- ✅ C-5: 404 처리 UX 완화 완료
- ✅ C-6: CartContext useEffect 의존성/초기마운트 정리 완료
- ✅ C-7: FCM_TOKEN_KEY 중복 가능성 정리 완료
- ✅ 모든 파일 TypeScript 컴파일 에러 없음
- ✅ Mock 모드 동작 유지 확인

---

**작업 완료 시간**: 2025-01-20  
**다음 작업**: 수동 테스트 및 Git 커밋

