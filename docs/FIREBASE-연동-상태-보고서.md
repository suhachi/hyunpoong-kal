# Firebase 연동 상태 보고서

**작업 일시**: 2025-01-XX
**프로젝트**: 현풍닭칼국수 PWA (hyunpoong-kal)
**Firebase 프로젝트 ID**: `hyun-poong` (Active)

---

## 🔍 연동 상태 점검

### 1. Hosting
- **상태**: ✅ 연결됨
- **배포 디렉토리**: `dist`
- **URL**: https://hyun-poong.web.app
- **설정**: `firebase.json`에 SPA 리라이트(`rewrites`) 설정 완료

### 2. Firestore Database
- **상태**: ✅ 연결됨
- **규칙 파일**: `firestore.rules`
- **현재 규칙**: **개발 모드 (모두 허용)**
  ```javascript
  allow read, write: if true;
  ```
  ⚠️ **주의**: 프로덕션 운영 시 보안 규칙 강화 필요

### 3. Cloud Functions
- **상태**: ✅ 연결됨
- **소스 위치**: `src/functions`
- **런타임**: Node.js 20
- **구현된 기능**:
  - NICEPAY 결제 핸들러 (`createPayment`, `approvePayment` 등)
  - 배달대행 Webhook (`saenggakdaero`)

### 4. Storage
- **상태**: ✅ 연결됨
- **규칙 파일**: `src/storage.rules`
- **현재 규칙**:
  - 모든 경로: 인증된 사용자만 읽기/쓰기 가능 (`if request.auth != null`)
  - 이미지 확장자 제한 등 세부 규칙 적용됨
- **CORS 이슈**: 이전 이슈 해결됨 (보고서 참조)

### 5. Authentication
- **상태**: ✅ 연결됨 (Client SDK)
- **설정 파일**: `src/lib/firebase.ts`
- **지원 방식**:
  - 이메일/비밀번호
  - Google 로그인
  - Phone Auth (최근 런타임 에러 수정 완료)

---

## 📋 환경 변수 점검

`src/config/env.ts` 및 `.env` 파일을 통해 아래 설정들이 주입되고 있는지 확인 필요:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

---

## ✅ 결론
- Firebase 프로젝트와의 연동은 **정상**입니다.
- CLI를 통한 배포(`firebase deploy`)가 가능한 상태입니다.
- 단, Firestore 보안 규칙(`firestore.rules`)이 현재 **개발용(Open)** 상태이므로, 실제 운영 전에는 반드시 보안 규칙을 강화해야 합니다.




