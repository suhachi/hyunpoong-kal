# NICEPAY 샌드박스 설정 가이드

**작성일**: 2025-12-03  
**목적**: NICEPAY 샌드박스 환경 설정 및 배포 가이드

---

## 📋 목차

1. [환경 변수 설정](#1-환경-변수-설정)
2. [Firebase Functions 배포](#2-firebase-functions-배포)
3. [프론트엔드 빌드 & 배포](#3-프론트엔드-빌드--배포)
4. [실결제 리허설](#4-실결제-리허설)
5. [Functions 로그 검증](#5-functions-로그-검증)

---

## 1. 환경 변수 설정

### 1-1. Functions 환경 변수 (서버)

**위치**: `src/functions/.env`

```bash
cd src/functions
```

`src/functions/.env` 파일을 생성하고 아래 내용 추가:

```bash
# ============================================================================
# NICEPAY 결제 설정
# ============================================================================

# 결제 Provider 모드: mock | nicepay_sandbox | nicepay_live
PAYMENT_PROVIDER_MODE=nicepay_sandbox

# NICEPAY 샌드박스 설정 (테스트용)
NICEPAY_MID_SANDBOX=YOUR_SANDBOX_MID_HERE
NICEPAY_MERCHANT_KEY_SANDBOX=YOUR_SANDBOX_MERCHANT_KEY_HERE
NICEPAY_API_BASE_SANDBOX=https://sandbox-api.nicepay.co.kr/v1

# ============================================================================
# Firebase 설정 (선택)
# ============================================================================

FIREBASE_PROJECT_ID=hyunpoong-kal
LOG_LEVEL=info
TZ=Asia/Seoul
```

**⚠️ 주의사항**:
- `YOUR_SANDBOX_MID_HERE`: NICEPAY 샌드박스 계정에서 발급받은 MID로 교체
- `YOUR_SANDBOX_MERCHANT_KEY_HERE`: NICEPAY 샌드박스 계정에서 발급받은 Merchant Key로 교체
- `.env` 파일은 절대로 Git에 커밋하지 마세요!
- `NODE_ENV=test`일 때는 자동으로 `mock` 모드로 동작합니다.

---

### 1-2. 프론트엔드 환경 변수 (클라이언트)

**위치**: 프로젝트 루트 `.env` 또는 `.env.local`

```bash
# ============================================================================
# Firebase 설정
# ============================================================================

VITE_USE_FIREBASE=true
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=hyunpoong-kal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hyunpoong-kal
VITE_FIREBASE_STORAGE_BUCKET=hyunpoong-kal.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
VITE_FIREBASE_VAPID_KEY=YOUR_VAPID_KEY

# ============================================================================
# 매장 설정
# ============================================================================

VITE_STORE_ID=hyunpoong_main

# ============================================================================
# Kakao Map 설정
# ============================================================================

VITE_KAKAO_MAP_APP_KEY=YOUR_KAKAO_JS_KEY
VITE_KAKAO_REST_API_KEY=YOUR_KAKAO_REST_KEY

# ============================================================================
# NICEPAY 온라인 결제 설정
# ============================================================================

# 온라인 결제 활성화
VITE_ONLINE_PAYMENT_ENABLED=true
VITE_ONLINE_PAYMENT_PROVIDER=nicepay

# NICEPAY 샌드박스 설정
VITE_NICEPAY_MID=YOUR_SANDBOX_MID_HERE
VITE_NICEPAY_CLIENT_KEY=YOUR_SANDBOX_CLIENT_KEY_HERE

# 결제 완료/취소 URL (로컬 개발용)
VITE_NICEPAY_RETURN_URL=http://localhost:5173/order/return
VITE_NICEPAY_CANCEL_URL=http://localhost:5173/order/cancel

# 배포 시 실제 도메인으로 변경:
# VITE_NICEPAY_RETURN_URL=https://yourdomain.com/order/return
# VITE_NICEPAY_CANCEL_URL=https://yourdomain.com/order/cancel

# ============================================================================
# 기능 플래그
# ============================================================================

VITE_POINTS_ENABLED=true
VITE_POINTS_RATE=0.03
VITE_POINTS_MIN_USE=1000
VITE_POINTS_EXPIRE_DAYS=365
VITE_SUPPORT_ENABLED=true

# ============================================================================
# 배달 설정
# ============================================================================

# 배달 가능 범위 (km, 0이면 제한 없음)
# Admin에서 설정한 값이 우선 적용됨
VITE_MAX_DELIVERY_RADIUS_KM=0
```

**⚠️ 주의사항**:
- 로컬 개발: `localhost` URL 사용
- 배포 시: `VITE_NICEPAY_RETURN_URL`, `VITE_NICEPAY_CANCEL_URL`을 실제 도메인으로 변경
- NICEPAY 샌드박스 키는 Functions와 동일한 MID를 사용하되, CLIENT_KEY는 별도 발급받아야 할 수 있습니다.

---

## 2. Firebase Functions 배포

### 2-1. Functions 빌드

프로젝트 루트에서:

```bash
cd src/functions
npm run build
```

**확인사항**:
- ✅ TypeScript 컴파일 에러 없음
- ✅ `lib/` 디렉토리에 `.js` 파일 생성됨

### 2-2. Functions 배포

```bash
npm run functions:deploy
```

또는:

```bash
firebase deploy --only functions
```

**배포 완료 확인**:

Firebase 콘솔 → Functions에서 다음 함수들이 배포되었는지 확인:

- ✅ `createPayment`
- ✅ `approvePayment`
- ✅ `cancelPayment`
- ✅ `createOnSitePaymentOrder`
- ✅ `cleanupPendingOrders` (스케줄러)

---

## 3. 프론트엔드 빌드 & 배포

### 3-1. 프론트엔드 빌드

프로젝트 루트에서:

```bash
npm run build
```

**확인사항**:
- ✅ Vite 빌드 성공
- ✅ `dist/` 디렉토리 생성
- ✅ TypeScript 에러 없음

### 3-2. Hosting 배포

```bash
firebase deploy --only hosting
```

또는 Vercel/Netlify 등 사용 중인 플랫폼의 배포 파이프라인 사용.

**배포 확인**:

배포된 도메인에서 다음 항목 확인:

- [ ] 메인 화면 정상 로드
- [ ] 장바구니/Checkout 페이지 정상 로드
- [ ] 주소검색 (Daum Postcode) 동작
- [ ] Geocoding (위도/경도 자동 저장) 동작
- [ ] Admin → 가게 설정 → 배달 반경(km) 수정 후 Checkout에서 반영 확인

---

## 4. 실결제 리허설

`docs/NICEPAY_SANDBOX_TEST_CHECKLIST.md` 참고하여 다음 3가지 필수 시나리오 테스트:

### 🧪 S1. APP_CARD 정상 결제 성공

1. 배포된 도메인 접속
2. 메뉴 담기 → 장바구니 → Checkout
3. 배달 주소 입력 (AddressSearch + Geocoding)
4. 결제수단: **앱 결제 (APP_CARD)** 선택
5. "결제하기" 버튼 클릭
6. NICEPAY 샌드박스 결제창 확인 (도메인/로고)
7. 샌드박스 테스트 카드번호로 결제
8. 결제 완료 후 `/order/return` 페이지로 리다이렉트
9. "결제가 정상적으로 완료되었습니다" 메시지 확인
10. "주문 상세 보기" 클릭 → `/order/{orderId}` 이동
11. Admin 화면에서 주문 상태 `APPROVED` 확인
12. Firebase Functions 로그에서 `ResultCode: "0000"` 확인

**기대 결과**:
- ✅ 결제창 정상 표시
- ✅ 결제 승인 성공
- ✅ 주문 상태 `APPROVED`
- ✅ Functions 로그에 성공 로그

---

### 🧪 S2. 결제창에서 사용자 취소

1. S1과 동일하게 진행
2. 결제창에서 **"취소"** 버튼 클릭
3. `/order/cancel` 페이지로 리다이렉트
4. "결제가 취소되었습니다" 메시지 확인
5. 주문이 생성되지 않았는지 확인

**기대 결과**:
- ✅ 취소 페이지 정상 표시
- ✅ 결제 미진행
- ✅ 주문 미생성

---

### 🧪 S3. 결제 실패 플로우

1. S1과 동일하게 진행
2. 샌드박스 **실패 케이스 카드** 사용
3. 결제 실패 후 `/order/return` 페이지
4. "결제 실패" 메시지 확인
5. 주문 상태 `FAILED` 또는 적절한 상태 확인

**기대 결과**:
- ✅ 실패 메시지 표시
- ✅ 주문 상태 `FAILED`
- ✅ Functions 로그에 실패 로그 및 에러 코드

---

### 선택 시나리오 (S4~S6)

- **S4**: PaymentReturn 페이지 재접속/새로고침 (멱등성 확인)
- **S5**: PENDING 주문 자동 취소 (`cleanupPendingOrders` 스케줄러)
- **S6**: MEET_CARD / MEET_CASH 플로우 회귀 테스트

---

## 5. Functions 로그 검증

Firebase 콘솔 → Functions → Logs에서 확인:

### 5-1. 정상 결제 로그

```
[createPayment] orderId: xxx, amount: xxx
[NicepayProvider.createPaymentReal] Request payload: {...}
[NicepayProvider.createPaymentReal] Response: { resultCode: "0000", ... }
[approvePayment] orderId: xxx
[NicepayProvider.approvePaymentReal] Response: { resultCode: "0000", ... }
```

**확인사항**:
- ✅ `createPayment` 호출 성공
- ✅ `approvePayment` 호출 성공
- ✅ `ResultCode: "0000"` (성공 코드)
- ✅ 동일 주문에 대해 `approvePayment` 중복 호출 없음 (멱등성)

---

### 5-2. 실패 결제 로그

```
[approvePayment] Payment approval failed: { resultCode: "F100", resultMsg: "한도초과" }
```

**확인사항**:
- ✅ 실패 코드 및 메시지 로그
- ✅ 민감정보(MERCHANT_KEY 등) 로그에 노출되지 않음

---

### 5-3. PENDING 자동 취소 로그

```
[cleanupPendingOrders] Found 2 pending orders to cancel
[cleanupPendingOrders] Canceled orderId: xxx (PENDING > 30min)
```

**확인사항**:
- ✅ 10분 간격으로 스케줄러 실행
- ✅ 30분 이상 PENDING 상태 주문 자동 취소

---

## ✅ 배포 체크리스트

### 1단계: 환경 변수 설정
- [ ] `src/functions/.env` 작성 완료
- [ ] 루트 `.env` 또는 `.env.local` 작성 완료
- [ ] NICEPAY 샌드박스 키 입력 완료

### 2단계: Functions 배포
- [ ] `npm run build` 성공
- [ ] `firebase deploy --only functions` 성공
- [ ] Firebase 콘솔에서 함수 배포 확인

### 3단계: 프론트엔드 배포
- [ ] `npm run build` 성공
- [ ] Hosting 배포 완료
- [ ] 배포 도메인 접속 확인

### 4단계: 실결제 리허설
- [ ] S1: 정상 결제 성공 테스트 완료
- [ ] S2: 결제 취소 테스트 완료
- [ ] S3: 결제 실패 테스트 완료

### 5단계: Functions 로그 검증
- [ ] 정상 결제 로그 확인
- [ ] 실패 결제 로그 확인
- [ ] 멱등성 동작 확인
- [ ] PENDING 자동 취소 스케줄러 동작 확인

---

## 🚀 프로덕션 배포 (운영 환경)

샌드박스 테스트가 모두 완료되면, 다음 단계로 프로덕션 배포:

### 변경 사항

1. **Functions `.env`**:
   ```bash
   PAYMENT_PROVIDER_MODE=nicepay_live
   NICEPAY_MID_LIVE=YOUR_PRODUCTION_MID
   NICEPAY_MERCHANT_KEY_LIVE=YOUR_PRODUCTION_KEY
   NICEPAY_API_BASE_LIVE=https://api.nicepay.co.kr/v1
   ```

2. **프론트엔드 `.env`**:
   ```bash
   VITE_NICEPAY_MID=YOUR_PRODUCTION_MID
   VITE_NICEPAY_CLIENT_KEY=YOUR_PRODUCTION_CLIENT_KEY
   VITE_NICEPAY_RETURN_URL=https://yourdomain.com/order/return
   VITE_NICEPAY_CANCEL_URL=https://yourdomain.com/order/cancel
   ```

3. **재배포**:
   - Functions 재배포
   - 프론트엔드 재빌드 및 재배포

---

## 📞 문의 및 지원

- NICEPAY 개발자 센터: https://developer.nicepay.co.kr/
- Firebase 공식 문서: https://firebase.google.com/docs

---

**작성**: Auto (Cursor AI)  
**최종 업데이트**: 2025-12-03

