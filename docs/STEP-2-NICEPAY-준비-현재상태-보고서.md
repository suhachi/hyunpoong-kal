# STEP 2: NICEPAY 온라인 결제 연동 준비 - 현재 상태 보고서

**작성일**: 2025-01-XX  
**프로젝트**: 현풍닭칼국수 PWA (hyunpoong-kal)

---

## 📋 현재 상태 요약

### ✅ 이미 구현된 부분
1. **클라이언트 유틸** (`src/lib/nicepay.ts`):
   - `initiatePayment()` - 결제 인증 시작
   - `approvePayment()` - 결제 승인
   - `cancelPayment()` - 결제 취소
   - `openNicePayWindow()` - 결제창 열기 (PC/모바일 분기)
   - `pollPaymentResult()` - 결제 결과 폴링

2. **Firebase Functions** (`src/functions/src/lib/nicepay.ts`):
   - `authorizePayment()` - 결제 승인 (Mock 구현)
   - `cancelPayment()` - 결제 취소 (Mock 구현)
   - `issueCashReceipt()` - 현금영수증 발급 (Mock 구현)

3. **Firebase Functions 엔드포인트** (`src/functions/src/index.ts`):
   - `payAuthorize` - 결제 승인 (onCall)
   - `payCancel` - 결제 취소 (onCall)
   - `requestCashReceipt` - 현금영수증 발급 (onCall)

4. **환경 변수 설정** (`src/config/env.ts`):
   - `NICEPAY_CONFIG` 기본 구조 존재
   - `VITE_NICEPAY_MID`, `VITE_NICEPAY_CLIENT_KEY` 지원

### ❌ 미구현/수정 필요 부분

1. **환경 변수 확장**:
   - `VITE_NICEPAY_RETURN_URL` 추가 필요
   - `VITE_NICEPAY_CANCEL_URL` 추가 필요
   - Functions용 `NICEPAY_SECRET_KEY` 환경 변수 정의 필요

2. **Checkout 페이지 연동**:
   - `app_card` 선택 시 NICEPAY 호출 로직 미구현
   - 현재는 TODO 주석만 존재 (라인 222-223)

3. **Firebase Functions NICEPAY Auth 엔드포인트**:
   - `/nicepay/auth` 엔드포인트 미구현
   - `/nicepay/confirm` 엔드포인트 미구현
   - 현재는 `payAuthorize`만 존재 (다른 구조)

4. **결제 플로우**:
   - 주문 생성 → NICEPAY Auth 요청 → 결제창 호출 → Confirm → 주문 상태 업데이트 플로우 미완성

---

## 🎯 STEP 2 작업 계획

### 2-1) 환경 변수 및 Config 정리 ✅ (부분 완료)

**완료된 작업**:
- `src/config/env.ts`에 `returnUrl`, `cancelUrl` 추가

**추가 필요**:
- `.env.example` 파일 생성 (환경 변수 예시)
- Functions용 환경 변수 주석 추가

### 2-2) NICEPAY 클라이언트 유틸 구현/보완 ✅ (이미 구현됨)

**현재 상태**:
- `src/lib/nicepay.ts`에 기본 유틸 함수들이 이미 구현되어 있음
- `initiatePayment()`는 `createPayment` 함수를 호출하는데, 이 함수가 Functions에 없음

**수정 필요**:
- `initiatePayment()`가 호출하는 함수명을 실제 Functions 엔드포인트와 맞추기
- 또는 새로운 `/nicepay/auth` 엔드포인트 생성

### 2-3) Firebase Functions NICEPAY 엔드포인트 ⚠️ (부분 구현)

**현재 상태**:
- `payAuthorize` (onCall) 존재
- `/nicepay/auth` (onRequest) 없음
- `/nicepay/confirm` (onRequest) 없음

**추가 필요**:
- `/nicepay/auth` 엔드포인트 생성 (주문 정보 → authUrl 반환)
- `/nicepay/confirm` 엔드포인트 생성 (NICEPAY 콜백 → 주문 상태 업데이트)

### 2-4) Checkout 페이지와 연동 ❌ (미구현)

**현재 상태**:
- `app_card` 선택 시 TODO 주석만 존재
- 실제 NICEPAY 호출 로직 없음

**수정 필요**:
- `handlePayment()` 함수에서 `app_card` 분기 시:
  1. 주문 생성 (pending 상태)
  2. NICEPAY Auth 요청
  3. 결제창 호출
  4. 결제 완료 후 Confirm 처리
  5. 주문 상태 업데이트

---

## 📝 다음 단계 작업 목록

### 우선순위 1: Checkout 페이지 연동
1. `Checkout.tsx`의 `handlePayment()` 함수 수정
2. `app_card` 분기에서 NICEPAY 호출 로직 추가
3. 결제 완료 후 리다이렉트 처리

### 우선순위 2: Firebase Functions 엔드포인트 추가
1. `/nicepay/auth` 엔드포인트 생성
2. `/nicepay/confirm` 엔드포인트 생성
3. 환경 변수에서 NICEPAY 키 읽기

### 우선순위 3: 환경 변수 문서화
1. `.env.example` 파일 생성
2. Functions 환경 변수 설정 가이드 추가

---

## ⚠️ 주의사항

1. **NICEPAY 실제 API 스펙**:
   - 현재 `src/functions/src/lib/nicepay.ts`는 Mock 구현만 존재
   - 실제 NICEPAY API 스펙에 맞춰 수정 필요

2. **보안**:
   - Functions에서 사용하는 NICEPAY Secret Key는 환경 변수 또는 Secret Manager 사용
   - 코드에 직접 하드코딩하지 않기

3. **테스트**:
   - Sandbox 계정으로 먼저 테스트
   - 실제 결제 전 충분한 검증 필요

---

**보고서 작성자**: AI Assistant  
**최종 업데이트**: 2025-01-XX

