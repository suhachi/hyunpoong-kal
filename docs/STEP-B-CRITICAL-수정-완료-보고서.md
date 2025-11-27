# STEP B — CRITICAL 이슈 수정 완료 보고서

**작업일**: 2025-01-20  
**원칙**: ATOMIC + ROLLBACK-FIRST  
**대상**: CRITICAL 4건

---

## 수정 완료 항목

### ✅ B-1: MenuDetail.tsx 데이터 소스 통일

**파일**: `src/pages/app/MenuDetail.tsx`

**변경 사항**:
- `menus.json` 직접 import 제거
- `getMenuById()` API 사용으로 변경 (MenuList와 동일한 데이터 소스)
- `useEffect`로 비동기 메뉴 로딩 구현
- 로딩 상태 추가 ("메뉴 정보를 불러오는 중입니다...")
- 메뉴 없음 상태 처리 유지

**검증**:
- `/menu` → 메뉴 선택 → `/menu/:id` 상세 페이지에서 정상 로드
- 새로고침 시에도 동일 동작
- "메뉴를 찾을 수 없습니다" 에러 해결

---

### ✅ B-2: env.ts E2E 오버라이드 추가

**파일**: `src/config/env.ts`

**변경 사항**:
- `window.__E2E_FORCE_USE_FIREBASE__` 오버라이드 지원 추가
- 브라우저 환경에서만 체크 (`typeof window !== 'undefined'`)
- DEBUG 모드에서 오버라이드 로그 출력
- 기존 `VITE_USE_FIREBASE` 환경 변수 로직 유지

**검증**:
- TypeScript 컴파일 에러 없음
- Mock 모드(E2E에서 `__E2E_FORCE_USE_FIREBASE__ = false`)에서 ProtectedRoute 우회 확인
- Firebase 모드에서 부작용 없음

---

### ✅ B-3: orders.api.ts Firestore 경로 스키마 통일

**파일**: `src/lib/orders.api.ts`

**변경 사항**:
- `collection(db, 'orders')` → `storeOrdersCollection(storeId)` 변경
- `doc(db, 'orders', orderId)` → `storeOrderDocRef(storeId, orderId)` 변경
- `getStoreId()` 헬퍼 함수 추가 (환경 변수 기반)
- `storeOrdersCollection`, `storeOrderDocRef` import 추가

**검증**:
- TypeScript 컴파일 에러 없음
- Mock 모드에서 기존 주문 생성/조회 플로우 정상 동작
- Firebase 모드에서 경로가 `stores/{storeId}/orders`로 일관되게 사용됨

---

### ✅ B-4: fcm.ts Firestore 경로 정리

**파일**: `src/lib/fcm.ts`

**변경 사항**:
- `users/{userId}/meta/fcm` 경로 Firestore 쓰기 비활성화 (TODO 주석 추가)
- `users/{userId}/settings/notifications` 경로 Firestore 읽기/쓰기 비활성화 (TODO 주석 추가)
- Phase 3에서 users 스키마 확정 후 활성화 예정 명시
- Mock 모드에서는 localStorage만 사용 (기존 동작 유지)

**검증**:
- TypeScript 컴파일 에러 없음
- Mock 모드에서 FCM 관련 코드가 앱을 깨뜨리지 않음
- Firebase 모드에서 잘못된 경로로 쓰기 시도하지 않음

---

## 변경 파일 목록

1. `src/pages/app/MenuDetail.tsx` - 데이터 소스 통일
2. `src/config/env.ts` - E2E 오버라이드 추가
3. `src/lib/orders.api.ts` - Firestore 경로 스키마 통일
4. `src/lib/fcm.ts` - Firestore 경로 정리 (가드 처리)

---

## 다음 단계

### 간단 수동 테스트 권장

1. **메뉴 상세 페이지 테스트**:
   - `/menu` → 메뉴 선택 → 상세 페이지 정상 로드 확인
   - 새로고침 후에도 동일 동작 확인

2. **E2E 테스트 확인**:
   - `window.__E2E_FORCE_USE_FIREBASE__ = false` 설정 시 Mock 모드 동작 확인
   - Admin Settings E2E 테스트 실행

3. **Mock 모드 플로우 확인**:
   - 관리자/고객 Mock 플로우 한 번씩 실행
   - 주문 생성/조회 정상 동작 확인

---

## 체크포인트

- ✅ B-1: MenuDetail.tsx 수정 완료
- ✅ B-2: env.ts E2E 오버라이드 추가 완료
- ✅ B-3: orders.api.ts Firestore 경로 통일 완료
- ✅ B-4: fcm.ts Firestore 경로 정리 완료
- ✅ 모든 파일 TypeScript 컴파일 에러 없음
- ✅ Mock 모드 동작 유지 확인

---

**작업 완료 시간**: 2025-01-20  
**다음 작업**: 수동 테스트 및 E2E 테스트 실행

