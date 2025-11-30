# Phase 3: 환경 변수 및 Secret 설정 가이드

## 1. 프론트엔드 (.env)

`.env` 또는 `.env.local` 파일에 다음 변수들을 설정해야 합니다.

```bash
# 온라인 결제 사용 여부 (true | false)
VITE_USE_ONLINE_PAYMENT=true

# 결제 환경 (sandbox | live)
VITE_PAYMENT_ENV=sandbox

# 사용할 PG사 (nicepay | mock)
VITE_PAYMENT_PROVIDER=nicepay
```

## 2. Firebase Cloud Functions (Secrets)

Cloud Functions에서 사용할 민감한 정보는 Firebase Secret Manager를 통해 관리합니다.

### 설정 방법 (CLI)

```bash
# NICEPAY 상점 ID (MID)
firebase functions:secrets:set PAYMENT_NICEPAY_MERCHANT_ID

# NICEPAY Secret Key (서버용)
firebase functions:secrets:set PAYMENT_NICEPAY_SECRET_KEY

# NICEPAY Client Key (필요 시)
firebase functions:secrets:set PAYMENT_NICEPAY_CLIENT_KEY
```

### Sandbox (테스트)용 값 예시

- **PAYMENT_NICEPAY_MERCHANT_ID**: `nicepay00m` (NICEPAY 테스트 MID)
- **PAYMENT_NICEPAY_SECRET_KEY**: `33F49GnCMS1...` (NICEPAY 개발자 센터에서 발급받은 키)

> **주의**: 실제 운영(Live) 환경으로 전환 시에는 반드시 실제 발급받은 MID와 Key로 업데이트해야 합니다.

## 3. Secret 적용 (functions/src/index.ts)

Functions 배포 시 Secret을 사용할 수 있도록 `runWith` 옵션에 추가해야 합니다.

```typescript
const runtimeOpts = {
  secrets: [
    "PAYMENT_NICEPAY_MERCHANT_ID",
    "PAYMENT_NICEPAY_SECRET_KEY",
    "PAYMENT_NICEPAY_CLIENT_KEY"
  ],
};
```

