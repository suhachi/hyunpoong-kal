# Firebase Functions 환경 변수 설정 가이드

## NICEPAY 결제 연동 환경 변수

### 필수 환경 변수

Firebase Functions에서 NICEPAY 실제 API를 사용하려면 다음 환경 변수를 설정해야 합니다.

#### 1. Payment Provider 모드 선택

```bash
PAYMENT_PROVIDER_MODE=mock | nicepay_sandbox | nicepay_live
```

*   `mock`: 테스트/E2E용 더미 응답 (기본값)
*   `nicepay_sandbox`: NICEPAY 샌드박스 환경
*   `nicepay_live`: NICEPAY 운영 환경

#### 2. NICEPAY 샌드박스 설정

```bash
NICEPAY_API_BASE_SANDBOX=https://sandbox-api.nicepay.co.kr/v1
NICEPAY_MID_SANDBOX=nicepay00m
NICEPAY_MERCHANT_KEY_SANDBOX=YOUR_SANDBOX_MERCHANT_KEY
NICEPAY_CLIENT_KEY_SANDBOX=YOUR_SANDBOX_CLIENT_KEY
```

#### 3. NICEPAY 운영 설정

```bash
NICEPAY_API_BASE_LIVE=https://api.nicepay.co.kr/v1
NICEPAY_MID_LIVE=YOUR_PRODUCTION_MID
NICEPAY_MERCHANT_KEY_LIVE=YOUR_PRODUCTION_MERCHANT_KEY
NICEPAY_CLIENT_KEY_LIVE=YOUR_PRODUCTION_CLIENT_KEY
```

---

## Firebase Functions 환경 변수 설정 방법

### 1. 로컬 개발 환경 (`.env` 파일)

`src/functions/.env` 파일 생성:

```bash
PAYMENT_PROVIDER_MODE=nicepay_sandbox
NICEPAY_MID_SANDBOX=nicepay00m
NICEPAY_MERCHANT_KEY_SANDBOX=***YOUR_KEY***
NICEPAY_CLIENT_KEY_SANDBOX=***YOUR_KEY***
```

### 2. Firebase 배포 환경 (Cloud Functions Config)

```bash
# 샌드박스 환경
firebase functions:config:set payment.provider_mode="nicepay_sandbox"
firebase functions:config:set nicepay.mid_sandbox="nicepay00m"
firebase functions:config:set nicepay.merchant_key_sandbox="***YOUR_KEY***"
firebase functions:config:set nicepay.client_key_sandbox="***YOUR_KEY***"

# 운영 환경
firebase functions:config:set payment.provider_mode="nicepay_live"
firebase functions:config:set nicepay.mid_live="***YOUR_MID***"
firebase functions:config:set nicepay.merchant_key_live="***YOUR_KEY***"
firebase functions:config:set nicepay.client_key_live="***YOUR_KEY***"
```

### 3. 환경 변수 확인

```bash
firebase functions:config:get
```

---

## 테스트 환경별 설정

### E2E 테스트
*   `NODE_ENV=test` 설정 시 자동으로 `mock` 모드로 동작합니다.
*   실제 NICEPAY API를 호출하지 않습니다.

### 로컬 개발
*   `PAYMENT_PROVIDER_MODE=mock` 또는 `nicepay_sandbox`

### 운영 배포
*   `PAYMENT_PROVIDER_MODE=nicepay_live`
*   **반드시 운영 키로 설정해야 합니다.**

---

## 보안 주의사항

1.  **민감정보 노출 금지**:
    *   MID, MERCHANT_KEY는 절대 코드에 하드코딩하지 마세요.
    *   `.env` 파일은 `.gitignore`에 포함시키세요.

2.  **로그 보안**:
    *   Functions 로그에 MERCHANT_KEY가 찍히지 않도록 주의하세요.
    *   SignData 값도 전체를 로그로 남기지 마세요.

3.  **환경 분리**:
    *   개발/샌드박스/운영 환경을 명확히 분리하세요.
    *   실수로 샌드박스 키가 운영에 배포되지 않도록 주의하세요.

---

## 참고 문서

*   NICEPAY API 문서: [https://developer.nicepay.co.kr/](https://developer.nicepay.co.kr/)
*   Firebase Functions 환경 변수: [https://firebase.google.com/docs/functions/config-env](https://firebase.google.com/docs/functions/config-env)

