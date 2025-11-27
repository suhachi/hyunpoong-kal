# STEP A — 전체 코드 베이스 전수 검사 결과

**작업일**: 2025-01-20  
**분석 범위**: 전체 소스코드 (01~10)  
**원칙**: 문제만 나열, 수정하지 않음

---

## [STEP A-1] 루트 구조 스캔

### 검사 대상
- `src/main.tsx`
- `src/App.tsx`
- `src/pages/**`
- `src/components/**`
- BrowserRouter → Routes → Layout → Nested Routes 흐름

### 발견된 문제

#### CRITICAL
1. **MenuDetail.tsx 데이터 소스 불일치**
   - 위치: `src/pages/app/MenuDetail.tsx:13`
   - 문제: `menus.json` 직접 import 사용
   - 영향: `MenuList.tsx`는 `getMenus()` API 사용 (localStorage 우선)인데, `MenuDetail`은 정적 JSON만 사용하여 데이터 불일치 발생 가능
   - 증상: 메뉴 목록에서 선택한 메뉴가 상세 페이지에서 "메뉴를 찾을 수 없습니다" 에러 발생
   - 체크포인트: A-1(CP-1)

2. **env.ts에 E2E 오버라이드 로직 누락**
   - 위치: `src/config/env.ts:64-70`
   - 문제: `USE_FIREBASE`가 `window.__E2E_FORCE_USE_FIREBASE__` 오버라이드를 지원하지 않음
   - 영향: E2E 테스트에서 Mock 모드 강제 불가능, Firebase 모드로 실행되어 ProtectedRoute 차단 발생
   - 증상: E2E 테스트에서 `admin-settings-page-root`를 찾지 못함
   - 체크포인트: A-1(CP-2)

#### HIGH
3. **AdminLayout에서 Mock 모드 리다이렉트 로직 불완전**
   - 위치: `src/pages/admin/_layout/AdminLayout.tsx:48-53`
   - 문제: Firebase 모드에서 `!user`일 때 `/dev`로 리다이렉트하는데, Mock 모드에서는 이 체크가 없어도 되지만 명시적이지 않음
   - 영향: Mock 모드에서도 혹시 모를 리다이렉트 발생 가능성
   - 체크포인트: A-1(CP-3)

4. **App.tsx의 lazy import 패턴 일관성**
   - 위치: `src/App.tsx:22-59`
   - 문제: 모든 lazy import가 `.then(m => ({ default: m.ComponentName }))` 패턴 사용
   - 영향: named export를 default로 변환하는 패턴이지만, 일부 컴포넌트가 실제로 default export를 사용하는 경우 중복 변환 가능
   - 체크포인트: A-1(CP-4)

#### MEDIUM
5. **ProtectedRoute의 Mock 모드 로직 위치**
   - 위치: `src/components/shared/ProtectedRoute.tsx:30-33`
   - 문제: Mock 모드 체크가 최상단에 있어 좋지만, `isMock` 변수를 선언하고 사용하지 않음 (27번 줄)
   - 영향: Dead code, 린터 경고 가능
   - 체크포인트: A-1(CP-5)

6. **404 처리 리다이렉트**
   - 위치: `src/App.tsx:190`
   - 문제: `path="*"`가 모든 미매칭 경로를 홈(`/`)으로 리다이렉트
   - 영향: 실제 404 페이지가 없어 사용자 경험 저하 가능
   - 체크포인트: A-1(CP-6)

#### LOW
7. **AppLayout의 Outlet 위치**
   - 위치: `src/components/app/AppLayout.tsx:22`
   - 문제: 없음 (정상)
   - 체크포인트: A-1(CP-7)

8. **Suspense fallback**
   - 위치: `src/App.tsx:62-66`
   - 문제: `LoadingFallback`이 단순 텍스트만 표시, 브랜드 스타일 미적용
   - 영향: 로딩 중 사용자 경험 저하 (기능적 문제는 아님)
   - 체크포인트: A-1(CP-8)

---

## [STEP A-2] Context/Provider 스캔

### 검사 대상
- `AuthContext`
- `CartContext`
- FCM `ensureFcmToken` 흐름
- Provider wrapping 순서

### 발견된 문제

#### CRITICAL
없음

#### HIGH
1. **AuthContext의 useLayoutEffect와 useEffect 중복**
   - 위치: `src/contexts/AuthContext.tsx:72-82, 86-110`
   - 문제: Mock 모드에서 `useLayoutEffect`로 초기화 후, `useEffect`에서도 Firebase 체크 실행 (불필요)
   - 영향: Mock 모드에서도 `useEffect` 내부 로직이 실행될 수 있음 (조건부이지만 명확하지 않음)
   - 체크포인트: A-2(CP-1)

2. **CartContext의 초기 마운트 플래그**
   - 위치: `src/contexts/CartContext.tsx:67-73`
   - 문제: `isInitialMount` ref를 사용하여 초기 마운트 시 저장 방지
   - 영향: 로직은 정상이지만, `useEffect` 의존성 배열이 비어있어 린터 경고 가능
   - 체크포인트: A-2(CP-2)

#### MEDIUM
3. **FCM_TOKEN_KEY 중복 정의 가능성**
   - 위치: `src/lib/fcm.ts:94`
   - 문제: `FCM_TOKEN_KEY = 'hp_kal_fcm_token'` 하드코딩
   - 영향: 다른 곳에서 같은 키를 사용하는 경우 충돌 가능 (확인 필요)
   - 체크포인트: A-2(CP-3)

4. **Provider 순서**
   - 위치: `src/App.tsx:83-84`
   - 문제: `AuthProvider` → `CartProvider` 순서
   - 영향: `CartProvider`에서 `AuthContext`를 사용하는 경우 문제 발생 가능 (현재는 사용하지 않음)
   - 체크포인트: A-2(CP-4)

#### LOW
5. **AuthContext의 console.log**
   - 위치: `src/contexts/AuthContext.tsx:88, 78`
   - 문제: 프로덕션에서도 실행되는 console.log
   - 영향: 성능/보안 문제는 아니지만, 프로덕션 로그 정리 필요
   - 체크포인트: A-2(CP-5)

---

## [STEP A-3] API / lib / Firebase 경로 스캔

### 검사 대상
- `src/lib/**` → api, fcm, orders, delivery, utils
- Firestore collection 경로
- Mock 모드 vs Firebase 모드 분기

### 발견된 문제

#### CRITICAL
1. **orders.api.ts의 Firestore 경로 불일치**
   - 위치: `src/lib/orders.api.ts:85, 144`
   - 문제: `collection(db, 'orders')` 직접 사용 (스키마와 불일치)
   - 영향: Firestore 스키마는 `stores/{storeId}/orders`인데, API는 루트 `orders` 컬렉션 사용
   - 증상: Firebase 모드에서 주문 저장/조회 실패
   - 체크포인트: A-3(CP-1)

2. **fcm.ts의 Firestore 경로 불일치**
   - 위치: `src/lib/fcm.ts:77, 253, 297`
   - 문제: `users/${userId}/meta/fcm`, `users/${userId}/settings/notifications` 직접 사용
   - 영향: Firestore 스키마에 `users` 컬렉션 정의가 없음 (stores 중심 구조)
   - 증상: Firebase 모드에서 FCM 토큰 저장/조회 실패
   - 체크포인트: A-3(CP-2)

#### HIGH
3. **Mock 모드에서 Firestore 호출 가능성**
   - 위치: 전체 `src/lib/**/*.api.ts`
   - 문제: `USE_FIREBASE` 체크 전에 Firestore import/초기화가 실행될 수 있음
   - 영향: Mock 모드에서도 Firebase SDK 로드되어 번들 크기 증가
   - 체크포인트: A-3(CP-3)

4. **getMenus API의 localStorage 키**
   - 위치: `src/lib/admin/menus.api.ts:35`
   - 문제: `STORAGE_KEY = 'hyunpoong_mock_menus'` 하드코딩
   - 영향: 다른 곳에서 같은 키 사용 시 충돌 가능
   - 체크포인트: A-3(CP-4)

#### MEDIUM
5. **Firestore 스키마와 실제 사용 경로 불일치**
   - 위치: `src/lib/firebase/firestore-schema.ts` vs 실제 API 파일들
   - 문제: 스키마는 `stores/{storeId}/...` 구조인데, 일부 API는 루트 컬렉션 사용
   - 영향: Firebase 모드 전환 시 데이터 구조 불일치
   - 체크포인트: A-3(CP-5)

6. **Promise reject 미처리**
   - 위치: 여러 API 파일들
   - 문제: `async/await` 사용 시 try/catch 누락 가능성
   - 영향: 에러 발생 시 앱 크래시 가능
   - 체크포인트: A-3(CP-6)

#### LOW
7. **env.ts의 USE_FIREBASE 로직**
   - 위치: `src/config/env.ts:64-70`
   - 문제: E2E 오버라이드 미지원 (A-1에서 언급)
   - 체크포인트: A-3(CP-7)

---

## [STEP A-4] Style / CSS / Tailwind / PWA 스캔

### 검사 대상
- `styles/globals.css`
- `styles/design-lock.css`
- `index.html` manifest / icon

### 발견된 문제

#### CRITICAL
없음

#### HIGH
1. **manifest.webmanifest 파일 존재 여부 미확인**
   - 위치: `index.html:18`
   - 문제: `<link rel="manifest" href="/manifest.webmanifest" />` 참조
   - 영향: 파일이 없으면 PWA 설치 실패
   - 체크포인트: A-4(CP-1)

2. **icon 파일 존재 여부 미확인**
   - 위치: `index.html:19`
   - 문제: `<link rel="icon" type="image/png" href="/icons/icon-192.png" />` 참조
   - 영향: 파일이 없으면 아이콘 표시 실패
   - 체크포인트: A-4(CP-2)

#### MEDIUM
3. **main.tsx의 CSS import 순서 경고**
   - 위치: `src/main.tsx:1-4`
   - 문제: 주석으로 "절대 변경하지 마세요" 경고 있음
   - 영향: 순서 변경 시 디자인 깨짐 가능
   - 체크포인트: A-4(CP-3)

4. **Service Worker 등록 조건**
   - 위치: `src/main.tsx:14-16`
   - 문제: `import.meta.env?.PROD` 체크만으로 프로덕션 판단
   - 영향: 일부 빌드 환경에서 PROD 플래그가 다를 수 있음
   - 체크포인트: A-4(CP-4)

#### LOW
5. **design-lock.css의 전역 스타일 오버라이드**
   - 위치: `src/styles/design-lock.css` (내용 미확인)
   - 문제: 전역 스타일 오버라이드 구조 확인 필요
   - 영향: 스타일 충돌 가능성
   - 체크포인트: A-4(CP-5)

---

## [STEP A-5] 전체 요약 및 다음 단계 안내

### 심각도별 문제 재정렬

#### CRITICAL (즉시 수정 필요)
1. **MenuDetail.tsx 데이터 소스 불일치** [A-1(CP-1)]
   - 원인: `menus.json` 직접 import vs `getMenus()` API 사용 불일치
   - 위치: `src/pages/app/MenuDetail.tsx:13`
   - 제안: `getMenus()` API 사용으로 변경, `useEffect`로 비동기 로딩

2. **env.ts E2E 오버라이드 누락** [A-1(CP-2)]
   - 원인: `USE_FIREBASE`가 `window.__E2E_FORCE_USE_FIREBASE__` 미지원
   - 위치: `src/config/env.ts:64-70`
   - 제안: E2E 오버라이드 로직 추가

3. **orders.api.ts Firestore 경로 불일치** [A-3(CP-1)]
   - 원인: `collection(db, 'orders')` 직접 사용 vs 스키마 `stores/{storeId}/orders`
   - 위치: `src/lib/orders.api.ts:85, 144`
   - 제안: `storeOrdersCollection(storeId)` 사용

4. **fcm.ts Firestore 경로 불일치** [A-3(CP-2)]
   - 원인: `users/${userId}/...` 경로 사용 vs 스키마에 users 컬렉션 없음
   - 위치: `src/lib/fcm.ts:77, 253, 297`
   - 제안: 스키마에 users 컬렉션 추가 또는 경로 수정

#### HIGH (우선 수정 권장)
5. **AdminLayout Mock 모드 리다이렉트 로직** [A-1(CP-3)]
   - 원인: Mock 모드에서도 리다이렉트 체크 불명확
   - 위치: `src/pages/admin/_layout/AdminLayout.tsx:48-53`
   - 제안: Mock 모드 분기 명확화

6. **AuthContext useLayoutEffect/useEffect 중복** [A-2(CP-1)]
   - 원인: Mock 모드에서 두 훅 모두 실행 가능
   - 위치: `src/contexts/AuthContext.tsx:72-110`
   - 제안: Mock 모드에서 useEffect 조기 리턴

7. **Firestore 스키마와 실제 사용 경로 불일치** [A-3(CP-5)]
   - 원인: 스키마 정의와 실제 API 사용 경로 불일치
   - 위치: 전체 `src/lib/**/*.api.ts`
   - 제안: 스키마 헬퍼 함수 사용으로 통일

#### MEDIUM (수정 고려)
8. **ProtectedRoute isMock 변수 미사용** [A-1(CP-5)]
9. **404 처리 리다이렉트** [A-1(CP-6)]
10. **CartContext useEffect 의존성** [A-2(CP-2)]
11. **FCM_TOKEN_KEY 중복 가능성** [A-2(CP-3)]
12. **manifest.webmanifest 파일 존재 여부** [A-4(CP-1)]

#### LOW (선택적 수정)
13. **Suspense fallback 스타일** [A-1(CP-8)]
14. **AuthContext console.log** [A-2(CP-5)]
15. **Service Worker 등록 조건** [A-4(CP-4)]

---

### 다음 단계 안내

#### STEP B (수정 작업)
1. CRITICAL 문제부터 순서대로 수정
2. 각 수정 후 즉시 테스트
3. 롤백 기준점 확인 후 진행

#### 수정 우선순위
1. MenuDetail.tsx 데이터 소스 통일 (즉시)
2. env.ts E2E 오버라이드 추가 (즉시)
3. Firestore 경로 불일치 수정 (Firebase 모드 사용 전 필수)
4. 나머지 HIGH/MEDIUM 문제 순차 수정

---

**체크포인트 저장 완료**: A-1(CP-1~8), A-2(CP-1~5), A-3(CP-1~7), A-4(CP-1~5)

**분석 완료 시간**: 2025-01-20

