# Phase 3: 결제 연동 완료 보고서

## 1. 결제 아키텍처 개요

Phase 3에서는 기존의 Mock 기반 결제 시스템을 **실제 PG(NICEPAY) 연동이 가능한 구조**로 고도화했습니다.
보안과 확장성을 위해 **Adapter 패턴**을 적용하고, 모든 결제 로직을 **Cloud Functions**로 위임했습니다.

### 핵심 구조
- **Frontend (React)**: 결제 UI, PG Redirect 처리, 결과 페이지 표시
- **Backend (Cloud Functions)**: 결제 인증(`init`), 승인(`confirm`), 취소(`cancel`) 로직 수행
- **Database (Firestore)**: 주문 상태 및 결제 트랜잭션 기록 (Atomic Updates)

## 2. 주요 API 및 플로우

### 2.1. 결제 초기화 (`createPaymentIntent`)
- **역할**: 주문 생성 후 PG 결제창을 띄우기 위한 사전 데이터(Signature, Auth Token 등) 준비
- **입력**: `orderId`, `amount`, `clientOrderId` (멱등성 키)
- **동작**:
  1. 주문 유효성 검증 (금액, 상태)
  2. PG Provider(`nicepay` or `mock`)를 통해 초기화 데이터 생성
  3. Firestore 주문 문서에 `clientOrderId` 및 `pending` 상태 기록

### 2.2. 결제 승인 (`confirmPayment`)
- **역할**: PG 결제 완료 후 서버 간(S2S) 통신으로 최종 승인 처리
- **입력**: `orderId`, `pgToken`, `pgOrderId`
- **동작**:
  1. Firestore Transaction 시작
  2. PG Provider를 통해 승인 API 호출
  3. 성공 시: `Order.status = 'accepted'`, `Order.payment.status = 'paid'` 원자적 업데이트
  4. 실패 시: `Order.payment.status = 'failed'` 업데이트 및 에러 반환

## 3. Order / Payment 상태 머신

결제 연동에 따라 주문 상태(`OrderStatus`)와 결제 상태(`PaymentStatus`)가 유기적으로 연동됩니다.

| 시나리오 | Order Status | Payment Status | 설명 |
| :--- | :--- | :--- | :--- |
| **주문 생성 (앱결제)** | `PENDING` | `PENDING` | PG 결제창 진입 전 상태 |
| **결제 성공** | `ACCEPTED` | `PAID` | PG 승인 완료, 주문 접수됨 |
| **결제 실패** | `PENDING` | `FAILED` | 승인 실패, 사용자가 재시도 가능 |
| **주문 취소** | `CANCELLED` | `CANCELLED` | 관리자/사용자 취소 (환불 처리됨) |
| **만나서 결제** | `PENDING` | `PENDING` | 결제 승인 없이 주문 생성만 된 상태 |

> **운영 참고**: `payment.status === 'paid'`인 주문만 조리/배달이 가능하도록 운영 정책을 수립해야 합니다.

## 4. 환경 변수 및 Secret 설정

운영 환경(`live`) 전환 시 반드시 다음 Secret을 업데이트해야 합니다.

- **PAYMENT_NICEPAY_MERCHANT_ID**: 실제 상점 ID
- **PAYMENT_NICEPAY_SECRET_KEY**: 실제 Secret Key
- **PAYMENT_NICEPAY_CLIENT_KEY**: 실제 Client Key

> 자세한 설정 방법은 `Phase3-환경변수-설정-가이드.md`를 참고하세요.

## 5. 장애 대응 매뉴얼

### Q. 결제는 되었는데 주문 상태가 변하지 않음 (망취소 필요)
- **현상**: PG사에서는 승인 문자가 왔으나, 앱에서는 '결제 실패'로 뜨거나 상태가 멈춤.
- **원인**: `confirmPayment` 호출 중 타임아웃이나 네트워크 오류 발생.
- **대응**: 
  1. 관리자 대시보드에서 해당 주문 확인 (결제 정보가 없을 수 있음)
  2. PG사 관리자 페이지에서 해당 건 **수동 취소** 권장 (현재 자동 망취소 로직은 `cancelPayment` API로 구현되어 있으나, 자동화 연동 필요)

### Q. 중복 결제 발생 가능성?
- **대응**: `clientOrderId`를 통한 멱등성 제어가 적용되어 있어, 동일 주문번호로 중복 승인은 원천적으로 차단됩니다.

---
**작성일**: 2025-01-20
**작성자**: 개발팀 (AI Tech Lead)

