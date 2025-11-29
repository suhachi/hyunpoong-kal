# 현풍닭칼국수 v0.9.0 - 주문 시스템 개선 보고서

**작업 일자:** 2025-01-18  
**작업 범위:** 주문 상태 머신 정리, 알림 시스템 구현, 샘플 데이터 제거, 라우팅 수정  
**상태:** ✅ 완료

---

## 📋 작업 개요

주문 관리 시스템의 상태 머신을 비즈니스 플로우에 맞게 정리하고, 새 주문 알림 시스템을 구현하며, 샘플 데이터를 제거하여 실제 운영 환경에 맞게 개선했습니다.

---

## 🔧 주요 작업 내역

### 1. 주문 상태 머신 정리

#### 1.1 OrderStatus 타입 통일
- **파일:** `src/types/order.ts`
- **변경 내용:**
  - 기존 11가지 상태를 6가지로 통일
  - `pending` (접수대기) → `accepted` (접수확인) → `cooking` (조리중) → `delivering` (배달중) → `completed` (완료) → `cancelled` (취소)
  - 레거시 상태값 제거: `placed`, `preparing`, `out_for_delivery`, `pickup_ready`, `done`, `payment_failed`, `canceled`
- **영향 범위:**
  - `ORDER_STATUS_TRANSITIONS` 전이 규칙 업데이트
  - 모든 주문 관련 컴포넌트 및 API 함수

#### 1.2 관리자 주문 탭 필터 로직 재구성
- **파일:** `src/pages/admin/Orders.tsx`
- **변경 내용:**
  - `ORDER_STATUS_TABS` 상수로 탭 정의 통일
  - 각 탭이 표시할 상태 배열로 필터링
  - "조리중" 탭에 `cooking`과 `delivering` 포함
- **결과:**
  - 고객이 주문하면 `pending` 상태로 생성
  - 관리자 대시보드 "접수대기" 탭에 즉시 표시
  - 상태 변경 시 올바른 탭으로 자동 이동

#### 1.3 고객 주문 생성 시 초기 상태 고정
- **파일:** 
  - `src/lib/orders.api.ts`
  - `src/lib/orders.repository.ts`
- **변경 내용:**
  - `createOrder`에서 새 주문 상태를 `pending`으로 고정
  - Mock/Firebase 모드 모두 적용

#### 1.4 관리자 액션 버튼 정리
- **파일:** `src/components/admin/OrderTable.tsx`
- **변경 내용:**
  - 접수하기 → `accepted`
  - 조리중 → `cooking`
  - 배달 → `delivering`
  - 완료 → `completed`
  - 취소 → `cancelled`

#### 1.5 상태 라벨 공통 헬퍼 함수 생성
- **파일:** `src/lib/orders.utils.ts` (신규 생성)
- **함수:**
  - `getOrderStatusLabelForAdmin()`: 관리자용 라벨
  - `getOrderStatusLabelForCustomer()`: 고객용 라벨
  - `getOrderStatusColor()`: 상태별 색상
- **적용:**
  - `OrderStatusBadge`, `OrderDetailDrawer` 등에서 사용

---

### 2. 새 주문 알림 시스템 구현

#### 2.1 새 주문 감지 로직
- **파일:** `src/pages/admin/Orders.tsx`
- **기능:**
  - 이전 주문 목록과 비교하여 `pending` 상태의 새 주문 감지
  - 5초마다 자동으로 새 주문 확인
  - `processedOrderIds` Set으로 중복 알림 방지

#### 2.2 알림음 재생
- **기능:**
  - Web Audio API를 사용한 800Hz beep 소리 재생
  - 새 주문 감지 시 자동 재생
- **구현:**
  ```typescript
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  oscillator.frequency.value = 800;
  // ... 재생 로직
  ```

#### 2.3 새 주문 알림 팝업
- **기능:**
  - 새 주문 감지 시 모달 팝업 표시
  - 주문번호, 주문 시간, 주문 내역, 총 금액 표시
  - "접수하기" 버튼으로 바로 접수 가능
- **UI:**
  - 빨간색 강조 디자인
  - 주문 내역 상세 표시

#### 2.4 접수 시 자동 프린트
- **기능:**
  - `accepted` 상태로 변경 시 자동으로 `window.print()` 호출
  - 주문서 자동 출력
- **구현:**
  - 상태 변경 후 500ms 지연 후 프린트 (상태 업데이트 반영 대기)

---

### 3. 샘플 데이터 제거

#### 3.1 리뷰 샘플 데이터 제거
- **파일:** `src/lib/admin/reviews.api.ts`
- **변경 내용:**
  - `MOCK_REVIEWS` 배열을 빈 배열로 변경
  - `USE_FIREBASE`를 `config/env.ts`에서 import하도록 수정
  - `getReviewStats`에 빈 배열 처리 추가 (기본값 반환)
- **결과:**
  - 관리자 리뷰 화면에 "등록된 리뷰가 없습니다" 표시

#### 3.2 관제 대시보드 샘플 수치 제거
- **파일:** `src/lib/admin/analytics.api.ts`
- **변경 내용:**
  - `getKPIData`: 모든 값 0으로 변경
  - `getHourlyOrders`: 빈 배열 반환
  - `getTopMenuSales`: 빈 배열 반환
  - `getDailySales`: 빈 배열 반환
- **결과:**
  - 관제 대시보드에 모든 수치가 0으로 표시
  - 그래프는 빈 상태로 표시

#### 3.3 쿠폰/프로모션 샘플 데이터 제거
- **파일:** `src/lib/coupons.api.ts`
- **변경 내용:**
  - `mockCoupons` 배열을 빈 배열로 변경
  - 타입 import 추가 (`Coupon`, `CouponFilters`, `CouponStats`, `CouponIssue`)
  - `getCouponStatus` import 추가
- **결과:**
  - 관리자 쿠폰 화면에 "발급된 쿠폰이 없습니다" 표시
  - 통계 카드 모두 0으로 표시

#### 3.4 고객지원 채팅 샘플 세션
- **파일:** `src/lib/admin/support.api.ts`
- **상태:** Firebase만 사용하므로 Mock 데이터 없음 (변경 불필요)

---

### 4. 주문내역 라우팅 수정

#### 4.1 마이페이지 주문내역 링크 수정
- **파일:** `src/pages/app/My.tsx`
- **변경 내용:**
  - 주문내역 링크를 `/orders`에서 `/order-history`로 수정
- **결과:**
  - 고객앱에서 "주문내역" 클릭 시 올바른 페이지로 이동

---

## 📊 수정된 파일 목록

### 핵심 파일
1. `src/types/order.ts` - OrderStatus 타입 통일
2. `src/lib/orders.utils.ts` - 상태 라벨 헬퍼 함수 (신규)
3. `src/pages/admin/Orders.tsx` - 탭 필터 로직, 알림 시스템
4. `src/components/admin/OrderTable.tsx` - 액션 버튼 정리
5. `src/components/admin/OrderDetailDrawer.tsx` - 상태 라벨 적용
6. `src/components/shared/OrderStatusBadge.tsx` - 상태 라벨 업데이트

### API 파일
7. `src/lib/orders.api.ts` - 초기 상태 `pending` 고정
8. `src/lib/orders.repository.ts` - 초기 상태 `pending` 고정
9. `src/lib/admin/orders.api.ts` - 상태 변경 함수, 통계 함수 업데이트

### 샘플 데이터 제거
10. `src/lib/admin/reviews.api.ts` - 리뷰 샘플 데이터 제거
11. `src/lib/admin/analytics.api.ts` - 관제 대시보드 샘플 수치 제거
12. `src/lib/coupons.api.ts` - 쿠폰 샘플 데이터 제거

### 라우팅
13. `src/pages/app/My.tsx` - 주문내역 라우팅 수정

---

## ✅ 검증 완료 사항

- [x] 주문 상태 머신 정리 완료
- [x] 새 주문 알림 시스템 구현 완료
- [x] 샘플 데이터 제거 완료
- [x] 주문내역 라우팅 수정 완료
- [x] 타입 오류 없음 (lint 통과)
- [x] 빌드 오류 없음

---

## 🔍 확인 필요 사항

### 1. 기능 테스트
- [ ] 고객이 주문하면 관리자 대시보드 "접수대기" 탭에 표시되는지
- [ ] 새 주문 알림음이 재생되는지
- [ ] 새 주문 알림 팝업이 표시되는지
- [ ] "접수하기" 버튼 클릭 시 자동 프린트가 되는지
- [ ] 상태 변경 시 올바른 탭으로 이동하는지
- [ ] 고객앱에서 "주문내역" 클릭 시 올바른 페이지로 이동하는지

### 2. UI/UX 확인
- [ ] 관리자 대시보드에서 모든 샘플 데이터가 0/빈 상태로 표시되는지
- [ ] 리뷰 관리 화면에 "등록된 리뷰가 없습니다" 표시되는지
- [ ] 관제 대시보드에 모든 수치가 0으로 표시되는지
- [ ] 쿠폰 관리 화면에 "발급된 쿠폰이 없습니다" 표시되는지

### 3. 성능 확인
- [ ] 5초마다 새 주문 확인이 성능에 영향을 주지 않는지
- [ ] 알림음 재생이 브라우저 호환성 문제가 없는지

### 4. 브라우저 호환성
- [ ] Web Audio API 지원 브라우저에서 알림음이 정상 재생되는지
- [ ] 자동 프린트 기능이 모든 브라우저에서 동작하는지

---

## 📝 다음 단계 권고 사항

### 단기 (1주일 내)
1. **실제 주문 테스트**
   - 고객앱에서 실제 주문 생성
   - 관리자 대시보드에서 알림 확인
   - 상태 변경 플로우 전체 테스트

2. **알림음 커스터마이징**
   - 현재 800Hz beep 소리를 더 적절한 알림음으로 변경 고려
   - 볼륨 조절 옵션 추가 고려

3. **프린트 기능 개선**
   - 프린트 실패 시 에러 핸들링 강화
   - 프린트 전 주문서 미리보기 기능 추가 고려

### 중기 (1개월 내)
1. **실시간 업데이트**
   - 현재 5초 폴링을 WebSocket 또는 Firebase Realtime Database로 전환 고려
   - 더 빠른 알림 반응 속도

2. **알림 설정**
   - 관리자가 알림음 on/off 설정 가능하도록
   - 알림음 종류 선택 가능하도록

3. **주문 통계**
   - 실제 주문 데이터 기반 통계 표시
   - 그래프 데이터 실제 값으로 채우기

---

## 🐛 알려진 이슈

현재 알려진 이슈 없음.

---

## 📚 관련 문서

- [주문 상태 머신 설계 문서](./주문상태머신-설계.md) (작성 예정)
- [알림 시스템 설계 문서](./알림시스템-설계.md) (작성 예정)
- [전체 진행상황 보고서](../HPKAL_v0.9.0_전체진행상황보고서.md)

---

**작성자:** AI Assistant  
**최종 수정일:** 2025-01-18

