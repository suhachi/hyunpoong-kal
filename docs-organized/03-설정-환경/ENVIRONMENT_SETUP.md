# 환경설정 가이드 (ENVIRONMENT_SETUP)

**작성일**: 2025-11-22  
**버전**: v1.0  
**목적**: Mock 모드 ↔ Firebase 모드 전환 및 환경변수 설정 가이드

---

## 1. 개요

- 현풍닭칼국수 PWA 개발/운영에 필요한 환경변수와 모드 전환 방법을 정리한 문서입니다.
- **Mock 모드(localStorage)**와 **Firebase 실연동 모드**를 쉽게 전환할 수 있도록 하는 것이 목표입니다.
- 모든 환경변수는 `src/config/env.ts`를 통해서만 접근합니다.
- `import.meta.env`를 페이지/컴포넌트/라이브러리에서 직접 사용하면 안 됩니다.

---

## 2. 모드 개요

### Mock 모드: `USE_FIREBASE=false`

- **용도**: 로컬 개발 및 데모/테스트
- **데이터 저장**: 모든 데이터가 브라우저 `localStorage`에 저장
- **특징**:
  - 브라우저를 닫거나 다른 기기에서 접속하면 데이터가 사라짐
  - 기기 간 동기화 불가
  - Firebase 프로젝트 설정 불필요
- **설정**: `.env.local`에 `VITE_USE_FIREBASE=false` 설정

### Firebase 모드: `USE_FIREBASE=true`

- **용도**: 실제 매장 운영
- **데이터 저장**: Firebase Firestore/Storage에 저장
- **특징**:
  - 클라우드에 저장되어 기기 간 자동 동기화
  - 실시간 업데이트 (Firestore 리스너)
  - 푸시 알림 (FCM) 지원
  - Firebase 프로젝트 설정 필수
- **설정**: `.env.local`에 `VITE_USE_FIREBASE=true` 및 Firebase 설정 값 입력

---

## 3. ENV 파일 구성

| 파일 | 역할 | Git 관리 |
|------|------|----------|
| `.env.local.example` | 예시 파일 (템플릿) | ✅ 커밋 |
| `.env.local` | 실제 개발용 환경변수 | ❌ Gitignore |
| `.env.production` | 프로덕션 배포용 (선택) | ❌ Gitignore |

### 파일 사용 방법

1. **로컬 개발**:
   ```bash
   # .env.local.example 파일을 복사
   cp .env.local.example .env.local
   
   # .env.local 파일을 열어서 실제 값 입력
   # (Firebase 모드 사용 시 Firebase 설정 값 입력)
   ```

2. **프로덕션 배포**:
   - Firebase Hosting 환경변수 설정 사용 (권장)
   - 또는 `.env.production` 파일 사용 (배포 시 자동 로드)

---

## 4. 필수 ENV 목록

### Firebase 모드 플래그

| 키 | 용도 | 예시 값 | 주의사항 |
|---|---|---|---|
| `VITE_USE_FIREBASE` | Mock/Firebase 모드 전환 | `false` (Mock), `true` (Firebase) | 필수 |

### Firebase 설정 (Firebase 모드일 때만 필요)

| 키 | 용도 | 예시 값 | 주의사항 |
|---|---|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase API 키 | `AIza...` | Firebase 모드 필수 |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth 도메인 | `hyun-poong.firebaseapp.com` | Firebase 모드 필수 |
| `VITE_FIREBASE_PROJECT_ID` | Firebase 프로젝트 ID | `hyun-poong` | Firebase 모드 필수 |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage 버킷 | `hyun-poong.appspot.com` | Firebase 모드 필수 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM Sender ID | `123456789` | Firebase 모드 필수 |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:123456789:web:abcdef` | Firebase 모드 필수 |
| `VITE_FIREBASE_MEASUREMENT_ID` | Analytics 측정 ID | `G-XXXXXXXXXX` | 선택 (Analytics 사용 시) |

**Firebase 설정 값 발급 방법**:
1. [Firebase Console](https://console.firebase.google.com) 접속
2. 프로젝트 생성 (또는 기존 프로젝트 선택)
3. 프로젝트 설정 > 일반 > 앱에서 "웹 앱 추가"
4. 구성 값 복사하여 `.env.local`에 입력

### 앱/스토어 기본 설정

| 키 | 용도 | 예시 값 | 주의사항 |
|---|---|---|---|
| `VITE_APP_NAME` | 앱 이름 | `현풍닭칼국수` | 필수 |
| `VITE_STORE_ID` | 매장 ID | `hyunpoong_main` | 필수 (단일 매장 기준) |

### 기능 플래그

| 키 | 용도 | 예시 값 | 주의사항 |
|---|---|---|---|
| `VITE_POINTS_ENABLED` | 포인트 시스템 활성화 | `true` | 선택 |
| `VITE_POINTS_RATE` | 포인트 적립률 | `0.03` (3%) | 선택 (포인트 사용 시) |
| `VITE_POINTS_MIN_USE` | 포인트 최소 사용 금액 | `1000` (원) | 선택 (포인트 사용 시) |
| `VITE_POINTS_EXPIRE_DAYS` | 포인트 만료일 | `365` (일) | 선택 (포인트 사용 시) |
| `VITE_DELIVERY_ENABLED` | 배달 추적 기능 활성화 | `true` | 선택 |
| `VITE_DELIVERY_PROVIDER` | 배달 Provider 종류 | `mock` | 선택 (배달 사용 시) |
| `VITE_DELIVERY_WEBHOOK_SECRET` | 배달 Webhook Secret | `change_me` | 선택 (배달 연동 시) |
| `VITE_SUPPORT_ENABLED` | 고객 지원 채팅 활성화 | `true` | 선택 |
| `VITE_ONLINE_PAYMENT_ENABLED` | 온라인 결제 활성화 | `false` | 선택 (v1.0에서는 기본 비활성화) |
| `VITE_ONLINE_PAYMENT_PROVIDER` | 온라인 결제 Provider | `none` | 선택 (온라인 결제 사용 시) |

### 선택적 설정

| 키 | 용도 | 예시 값 | 주의사항 |
|---|---|---|---|
| `VITE_KAKAO_MAP_KEY` | Kakao 지도 API 키 | `...` | 선택 (관리자 설정 페이지에서 사용) |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API 키 | `...` | 선택 (관리자 설정 페이지에서 사용) |
| `VITE_NICEPAY_MID` | NICEPAY MID | `...` | 선택 (온라인 결제 사용 시) |
| `VITE_NICEPAY_CLIENT_KEY` | NICEPAY Client Key | `...` | 선택 (온라인 결제 사용 시) |
| `VITE_PROVIDER_A_API_URL` | 배달 Provider A API URL | `...` | 선택 (배달 연동 시) |
| `VITE_PROVIDER_A_API_KEY` | 배달 Provider A API Key | `...` | 선택 (배달 연동 시) |
| `VITE_PROVIDER_A_MERCHANT_ID` | 배달 Provider A Merchant ID | `...` | 선택 (배달 연동 시) |

---

## 5. 모드 전환 방법

### 5-1. Mock 모드

**설정 방법**:
```bash
# .env.local 파일
VITE_USE_FIREBASE=false
```

**실행**:
```bash
npm run dev
```

**확인 방법**:
- 브라우저 콘솔에 `[Firebase] SKIP init: USE_FIREBASE=false (Mock 모드)` 로그 출력
- 모든 데이터가 `localStorage`에 저장됨 (브라우저 개발자 도구 > Application > Local Storage에서 확인 가능)

---

### 5-2. Firebase 모드

**설정 방법**:
```bash
# .env.local 파일
VITE_USE_FIREBASE=true

# Firebase 설정 값 입력 (Firebase Console에서 발급받은 값)
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=hyun-poong.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hyun-poong
VITE_FIREBASE_STORAGE_BUCKET=hyun-poong.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX  # 선택
```

**실행**:
```bash
npm run dev
```

**확인 방법**:
- 브라우저 콘솔에 `[Firebase] 초기화 시작 (USE_FIREBASE=true)` 로그 출력
- Firebase Console > Firestore에서 데이터 저장 확인 가능

---

### 5-3. 회귀 테스트 (Mock ↔ Firebase 전환)

**목적**: Mock 모드와 Firebase 모드 모두에서 기능이 정상 동작하는지 확인

**테스트 시나리오**:
1. **Mock 모드 테스트**:
   ```bash
   # .env.local에 VITE_USE_FIREBASE=false 설정
   npm run dev
   # 모든 기능 정상 동작 확인
   ```

2. **Firebase 모드 테스트**:
   ```bash
   # .env.local에 VITE_USE_FIREBASE=true 설정
   npm run dev
   # 모든 기능 정상 동작 확인 (Firestore에 데이터 저장 확인)
   ```

**자동화 스크립트 (향후 구현 가능)**:
```json
{
  "scripts": {
    "test:mock": "VITE_USE_FIREBASE=false npm run test",
    "test:firebase": "VITE_USE_FIREBASE=true npm run test",
    "test:all": "npm run test:mock && npm run test:firebase"
  }
}
```

---

## 6. 스테이징/프로덕션 설정 전략

### Firebase Hosting 환경변수 설정 (권장)

**Firebase Hosting**에서는 프로젝트별 환경변수를 설정할 수 있습니다:

```bash
# Firebase CLI로 환경변수 설정
firebase functions:config:set \
  app.firebase_api_key="..." \
  app.firebase_auth_domain="..." \
  # ...

# 또는 Firebase Console에서 직접 설정
# Firebase Console > Hosting > 환경변수 설정
```

**주의**: Firebase Hosting은 클라이언트 사이드 환경변수이므로, `.env` 파일이 아닌 빌드 시점에 환경변수를 주입해야 합니다.

### `.env.production` 파일 사용 (선택)

프로덕션 빌드 시 자동으로 `.env.production` 파일을 읽습니다:

```bash
# .env.production 파일 생성
cp .env.local.example .env.production

# 프로덕션 값 입력
# (실제 Firebase 프로젝트 설정 값 입력)

# 프로덕션 빌드
npm run build
```

---

## 7. 새 환경변수/플래그 추가 규칙

새로운 환경변수를 추가할 때는 다음 단계를 따릅니다:

1. **`src/config/env.ts`에 추가**:
   ```typescript
   // getEnv() 헬퍼 함수로 읽기
   export const NEW_CONFIG = getEnv('VITE_NEW_CONFIG', 'defaultValue');
   ```

2. **`.env.local.example`에 추가**:
   ```env
   # 새 설정
   VITE_NEW_CONFIG=__FILL_ME__
   ```

3. **`docs/ENVIRONMENT_SETUP.md` 업데이트**:
   - 필수 ENV 목록에 새 변수 추가
   - 용도 및 예시 값 설명

4. **빌드 검증**:
   ```bash
   npm run build
   ```

**주의**:
- `import.meta.env`를 직접 사용하지 말고, 반드시 `src/config/env.ts`의 `getEnv()` 함수를 사용하세요.
- 환경변수 키는 반드시 `VITE_` 접두사로 시작해야 합니다 (Vite 요구사항).

---

## 8. 릴리즈 전 환경변수 최종 점검 체크리스트

### 개발 환경

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] `.env.local.example` 파일이 Git에 커밋되어 있는지 확인
- [ ] Mock 모드(`VITE_USE_FIREBASE=false`)로 모든 기능 정상 동작 확인

### 프로덕션 환경

- [ ] Firebase Hosting 환경변수 설정 완료 또는 `.env.production` 파일 확인
- [ ] Firebase 프로젝트 ID / API 키 / Auth 도메인이 운영 프로젝트로 지정되어 있는지 확인
- [ ] 테스트용/개발용 키가 운영 환경에 남아있지 않은지 확인
- [ ] 민감 정보(API 키, 비밀번호 등)가 Git 커밋에 포함되지 않았는지 확인
- [ ] Firebase 모드(`VITE_USE_FIREBASE=true`)로 모든 기능 정상 동작 확인

> ⚠️ **중요**: 운영 환경에서는 `.env.local.example` 파일을 직접 사용하지 말고, 배포 플랫폼의 환경변수 설정을 사용하세요!

---

## 9. 트러블슈팅

### ENV 누락/오타로 인한 대표적인 에러

1. **Firebase 초기화 실패**:
   ```
   [Firebase] 초기화 실패: Firebase: Error (auth/invalid-api-key)
   ```
   - **원인**: `VITE_FIREBASE_API_KEY` 누락 또는 잘못된 값
   - **해결**: `.env.local`에 올바른 Firebase API 키 입력

2. **환경변수 읽기 실패**:
   ```
   [Env] Required environment variable VITE_XXX is not set
   ```
   - **원인**: 필수 환경변수 누락
   - **해결**: `.env.local.example` 참고하여 누락된 변수 추가

3. **Mock 모드인데 Firebase 코드 실행**:
   ```
   Firebase not configured
   ```
   - **원인**: `USE_FIREBASE=true`로 설정했지만 Firebase 설정 값 누락
   - **해결**: `.env.local`에 `VITE_USE_FIREBASE=false` 설정 (Mock 모드) 또는 Firebase 설정 값 입력

### 해결 방법

1. **`.env.local` 파일 확인**:
   ```bash
   # .env.local 파일 존재 확인
   ls -la .env.local
   
   # .env.local.example과 비교
   diff .env.local.example .env.local
   ```

2. **환경변수 로드 확인**:
   - 브라우저 콘솔에서 `[env] USE_FIREBASE: ...` 로그 확인
   - `src/config/env.ts`의 `getEnv()` 함수가 올바르게 동작하는지 확인

3. **빌드 재시도**:
   ```bash
   # .env.local 수정 후 개발 서버 재시작
   npm run dev
   ```

---

## 10. 참고 문서

- **v1.0 설계 문서**: `docs/v1.0_Firebase-실연동-설계초안_2025-11-22.md`
- **Firebase Console**: https://console.firebase.google.com
- **Firebase 문서**: https://firebase.google.com/docs

---

**작성일**: 2025-11-22  
**작성자**: AI Assistant  
**버전**: v1.0  
**다음 업데이트**: STEP 2 (Firestore 스키마 1차 구현) 완료 후
