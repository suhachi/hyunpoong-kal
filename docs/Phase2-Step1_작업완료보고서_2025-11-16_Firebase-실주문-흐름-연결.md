# Phase 2 Step 1: Firebase 실주문 흐름 연결 작업 완료 보고서

**작업일:** 2025-11-16  
**브랜치:** feat/fix-first-20251113  
**작업자:** GitHub Copilot (AI Assistant)

---

## 1. 작업 목표

Phase 2를 대비하여 **Firebase Firestore 기반 실주문 흐름**을 연결:
1. `USE_FIREBASE=true` 환경에서 고객 주문이 Firestore `orders` 컬렉션에 저장되도록 구현
2. 주문 트래킹 페이지에서 Firestore 실시간 리스너로 주문 상태 조회
3. 관리자 주문 목록에서 Firestore 쿼리 기반 주문 조회 및 상태 업데이트
4. **E2E 테스트 코드는 수정하지 않고** 도메인 로직 + UI 흐름만 정리

---

## 2. 변경 파일 목록

### 2.1 주문 API/도메인 레이어
1. **`src/lib/orders.api.ts`**
   - `createOrder()` 함수 추가: Firebase 모드에서 Firestore `orders` 컬렉션에 주문 생성
   - Mock 모드에서는 기존 `ordersRepository` 사용 (기존 동작 유지)

2. **`src/lib/orders.repository.ts`**
   - `CreateOrderPayload` 인터페이스에 `menuImage` 필드 추가 (Order 타입과 일치시키기 위함)

3. **`src/lib/admin/orders.api.ts`**
   - Firebase import 추가: `USE_FIREBASE`, `db`, Firestore 함수들
   - `fetchOrders()`: Firebase 모드에서 Firestore 쿼리로 주문 목록 조회 (필터링/정렬 지원)
   - `updateOrderStatus()`: Firebase 모드에서 Firestore 주문 상태 업데이트

### 2.2 고객 주문 흐름
4. **`src/pages/app/Checkout.tsx`**
   - `ordersRepository` 대신 `createOrder()` API 호출로 변경
   - Firebase/Mock 모드 모두 단일 API로 통합 처리
   - 주문 생성 성공 후 `orderId`로 `/order/:orderId` 경로로 이동

5. **`src/pages/app/OrderTracking.tsx`**
   - Firebase 모드: Firestore 실시간 리스너(`onSnapshot`) 연결
   - `orders/:orderId` 문서 실시간 구독하여 상태 변화 자동 반영
   - Mock 모드: 기존 localStorage 조회 유지

### 2.3 관리자 주문 관리
6. **`src/pages/admin/Orders.tsx`**
   - 기존 `fetchOrders()` 호출 유지 (내부적으로 Firebase/Mock 분기 처리됨)
   - UI/testId는 기존 그대로 유지 (T2-16에서 추가한 `admin.orders.*` testId 활용)

---

## 3. 구현 세부 사항

### 3.1 주문 생성 (`createOrder`)

**파일:** `src/lib/orders.api.ts`

```typescript
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  if (!USE_FIREBASE) {
    return await ordersRepository.createOrder(payload);
  }

  // Firebase 모드: Firestore에 주문 문서 생성
  const orderData = {
    userId: payload.userId,
    storeId: payload.storeId,
    items: payload.items,
    // ... 기타 필드
    status: 'placed' as OrderStatus,
    payment: payload.payment || { ... },
    timeline: { placed: serverTimestamp() },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'orders'), orderData);

  return {
    orderId: docRef.id,
    ...orderData,
    // serverTimestamp는 로컬에서 즉시 표시를 위해 ISO string으로 변환
    timeline: { placed: new Date().toISOString() as any },
    createdAt: new Date().toISOString() as any,
    updatedAt: new Date().toISOString() as any,
  } as Order;
}
```

### 3.2 주문 트래킹 (실시간 리스너)

**파일:** `src/pages/app/OrderTracking.tsx`

```typescript
useEffect(() => {
  if (!orderId) return;

  if (USE_FIREBASE) {
    const setupFirestoreListener = async () => {
      const { doc, onSnapshot } = await import('firebase/firestore');
      const { db } = await import('../../lib/firebase');
      
      const orderRef = doc(db, 'orders', orderId);
      const unsubscribe = onSnapshot(orderRef, (snapshot) => {
        if (snapshot.exists()) {
          setOrder({ orderId: snapshot.id, ...snapshot.data() } as LocalOrder);
        }
        setLoading(false);
      });

      return unsubscribe;
    };

    const unsubPromise = setupFirestoreListener();
    return () => { unsubPromise?.then((unsub) => unsub?.()); };
  } else {
    // localStorage 기반 조회 (기존 로직)
  }
}, [orderId]);
```

### 3.3 관리자 주문 조회

**파일:** `src/lib/admin/orders.api.ts`

```typescript
export async function fetchOrders(...): Promise<Order[]> {
  if (!USE_FIREBASE) {
    // Mock + localStorage 병합 로직 (기존)
  }

  // Firebase 모드
  let q = query(
    collection(db, 'orders'),
    where('storeId', '==', storeId)
  );

  if (filters.status && filters.status !== 'all') {
    q = query(q, where('status', '==', filters.status));
  }

  q = query(q, orderBy('createdAt', sortDirection));

  const snapshot = await getDocs(q);
  let orders = snapshot.docs.map((doc) => ({
    orderId: doc.id,
    ...doc.data(),
  } as Order));

  // 클라이언트 필터링 (검색어, 날짜 범위 등)
  // ...

  return orders;
}
```

### 3.4 주문 상태 업데이트

**파일:** `src/lib/admin/orders.api.ts`

```typescript
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  if (!USE_FIREBASE) {
    // localStorage 기반 업데이트 (기존)
  }

  // Firebase 모드
  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) {
    return { success: false, error: '주문을 찾을 수 없습니다' };
  }

  const updateData: any = {
    status: newStatus,
    updatedAt: serverTimestamp(),
    [`timeline.${newStatus}`]: serverTimestamp(),
  };

  if (newStatus === 'canceled' && reason) {
    updateData['payment.cancelReason'] = reason;
    updateData['payment.canceledAt'] = serverTimestamp();
  }

  await updateDoc(orderRef, updateData);

  return { success: true };
}
```

---

## 4. 검증 방법

### 4.1 로컬 환경 (USE_FIREBASE=false)
기존 동작 유지 확인:
- Cart → Checkout → 주문 생성 → localStorage 저장
- OrderTracking에서 localStorage 조회
- 관리자 Orders 페이지에서 localStorage + Mock 데이터 병합 표시

### 4.2 Firebase 환경 (USE_FIREBASE=true)
Firebase 콘솔 + 앱 화면으로 검증:

1. **주문 생성**
   - `.env` 또는 `src/config/env.ts`에서 `VITE_USE_FIREBASE=true` 설정
   - `pnpm dev` 실행
   - 고객 화면: 메뉴 선택 → Cart → Checkout → 주문하기 클릭
   - **Firebase Console** → Firestore → `orders` 컬렉션에 새 문서 생성 확인

2. **주문 트래킹**
   - 주문 생성 후 `/order/:orderId` 페이지로 자동 이동
   - 화면에 주문 정보 표시 확인
   - `order.status === 'done'`일 때 `order-complete.page`, `order-complete.message`, `order-complete.order-id` testId 노출 확인 (개발자 도구 Elements 탭)

3. **관리자 주문 목록**
   - `/admin/orders` 접속
   - Firestore의 주문이 `admin.orders.list` 영역에 표시되는지 확인
   - 상태 변경 버튼 클릭 → Firestore 문서 `status` 필드 업데이트 확인
   - 실시간으로 고객 트래킹 화면에도 상태 변경 반영되는지 확인

4. **빌드 검증**
   ```powershell
   pnpm build
   ```
   - TypeScript 오류 없음 확인
   - 빌드 성공 확인

---

## 5. 주의 사항

### 5.1 기존 동작 보존
- `USE_FIREBASE=false` 일 때는 기존 localStorage 기반 Mock 흐름이 그대로 동작함
- E2E 테스트(`order-flow.spec.ts`)는 현재 `describe.skip` 상태이며, **이번 작업에서 수정하지 않음**

### 5.2 Firebase 설정 필요
Firebase 모드 테스트를 위해서는:
- `.env` 파일에 Firebase config 설정 필요:
  ```
  VITE_USE_FIREBASE=true
  VITE_FIREBASE_API_KEY=...
  VITE_FIREBASE_PROJECT_ID=...
  # 기타 Firebase 설정
  ```
- Firestore 규칙 설정 (개발 시 임시로 `allow read, write: if true;` 가능)

### 5.3 타임스탬프 처리
- Firestore `serverTimestamp()`는 서버에서 생성되므로, 클라이언트에서 즉시 반환할 때는 현재 시간(`new Date().toISOString()`)으로 임시 대체
- 실시간 리스너를 통해 서버 타임스탬프로 업데이트됨

### 5.4 testId는 유지
- Cart, OrderTracking, AdminOrders의 기존 testId는 그대로 유지 (T2-15, T2-16에서 추가)
- Phase 2 후속 단계에서 testId 기반 E2E 재작성 예정

---

## 6. 다음 단계 (Phase 2 후속 작업)

1. **E2E 테스트 재작성**
   - `src/e2e/order-flow.spec.ts`의 skip된 블록을 Firebase 기반으로 재작성
   - `getByTestId()` 우선 사용하여 안정적인 테스트 구축

2. **결제 연동 (Phase 3)**
   - NICEPAY PG 연동
   - 실결제 흐름 구현

3. **배달 추적 기능**
   - 배달 대행사 API 연동
   - GPS 기반 실시간 배달 추적

4. **포인트/쿠폰 시스템 강화**
   - Firestore 기반 포인트/쿠폰 관리
   - Functions 트리거 연동

---

## 7. 테스트 결과

### 7.1 빌드 결과
```
✓ 2869 modules transformed.
build/index.html                        0.45 kB │ gzip:   0.29 kB
build/assets/index-Jfxg-yVJ.css        94.34 kB │ gzip:  16.36 kB
build/assets/index.esm-DaOZX2f4.js     24.52 kB │ gzip:   4.82 kB
build/assets/index-C-kWe1gt.js      1,789.77 kB │ gzip: 493.70 kB
✓ built in 22.72s
```
- ✅ TypeScript 컴파일 성공
- ✅ 빌드 오류 없음
- ⚠️ 번들 크기 경고 (기존부터 존재, Phase 3에서 code-splitting 개선 예정)

### 7.2 기능 검증 체크리스트 (수동 테스트 가이드)

#### Mock 모드 (`USE_FIREBASE=false`)
- [ ] Cart → Checkout → 주문 생성 → localStorage에 저장됨
- [ ] `/order/:orderId` 페이지에서 주문 정보 표시됨
- [ ] `/admin/orders`에서 localStorage 주문 조회됨
- [ ] 관리자에서 상태 변경 시 localStorage 업데이트됨

#### Firebase 모드 (`USE_FIREBASE=true`)
- [ ] Cart → Checkout → 주문 생성 → Firestore `orders` 컬렉션에 문서 생성됨
- [ ] Firebase Console에서 주문 문서 확인 가능
- [ ] `/order/:orderId` 페이지에서 실시간 리스너 동작 (상태 변화 자동 반영)
- [ ] `/admin/orders`에서 Firestore 주문 목록 조회됨
- [ ] 관리자에서 상태 변경 시 Firestore 업데이트됨
- [ ] 고객 트래킹 화면에서 실시간으로 상태 변경 반영됨
- [ ] `order.status === 'done'` 시 `order-complete.*` testId 노출 확인

---

## 8. 결론

**✅ Phase 2 Step 1 작업 완료**

- Firebase Firestore 기반 실주문 흐름 연결 완료
- `USE_FIREBASE` 플래그로 Mock/Firebase 모드 전환 가능
- 기존 testId 및 UI 구조 유지 (E2E 재작성 준비 완료)
- 빌드 성공 (타입 오류 없음)
- 다음 단계: Firebase 환경에서 수동 검증 → E2E 테스트 재작성

**변경 파일 요약:**
- `src/lib/orders.api.ts` (createOrder 추가)
- `src/lib/orders.repository.ts` (CreateOrderPayload에 menuImage 추가)
- `src/lib/admin/orders.api.ts` (fetchOrders, updateOrderStatus Firebase 연동)
- `src/pages/app/Checkout.tsx` (createOrder API 호출로 변경)
- `src/pages/app/OrderTracking.tsx` (Firestore 실시간 리스너 추가)

**커밋 제안 메시지:**
```
feat(phase2): Connect Firebase order flow (create/track/admin)

- Add createOrder() in orders.api.ts for Firestore integration
- Update Checkout.tsx to use unified createOrder API
- Add Firestore real-time listener in OrderTracking.tsx
- Implement Firestore queries in admin/orders.api.ts
- Maintain existing testIds and UI structure
- Build verified with no TypeScript errors

Related: Phase 2 Step 1, T2-17
```

---

**작성:** 2025-11-16  
**검토:** 개발자가 Firebase 환경 설정 후 수동 검증 필요
