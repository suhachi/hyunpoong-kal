# Firebase Storage 안정성 점검 결과 요약

**점검 일시**: 2025-01-XX  
**점검 범위**: Firebase Storage 버킷 설정 및 CORS 안정성  
**점검 목적**: `appspot.com` 버킷 사용 방지 및 `hyun-poong.firebasestorage.app` 단일 진실 소스 보장

---

## 1. 리그레션 스캔 결과

### A-1. 문자열 검색 결과

| 패턴 | 코드 내 사용 위치 | 허용 여부 | 조치 |
|------|-------------------|-----------|------|
| `appspot.com` | `src/lib/firebase.ts:77-79` | ✅ | FATAL 가드 메시지 (유지) |
| `appspot.com` | `src/lib/storage.ts:28,54,97` | ✅ | FATAL 가드 메시지 (유지) |
| `appspot.com` | `src/functions/lib/lib/pdf.js:20-21` | 🚫 | **수정 완료** → `firebasestorage.app` 사용 |
| `appspot.com` | 문서 파일들 (`docs/**/*.md`) | ✅ | 과거 기록/예시 (유지) |
| `firebasestorage.googleapis.com` | `src/lib/storage.ts:47` | ✅ | URL 검증용 (유지) |
| `uploadBytesResumable(` | 없음 | ✅ | 사용 안 함 |
| `fetch(` + `storage` | 없음 | ✅ | 직접 HTTP 요청 없음 |

### 발견된 이슈 및 조치

**이슈 1**: `src/functions/lib/lib/pdf.js` (빌드 산출물)에서 `appspot.com` 사용
- **원인**: Functions 빌드 산출물이 이전 소스 코드를 반영
- **조치**: 빌드 산출물 수정 완료 (소스 파일 `src/functions/src/lib/pdf.ts`는 이미 올바름)
- **후속 조치**: `npm run functions:build` 실행 필요

---

## 2. firebase.ts / storage.ts 설정 검증 결과

### B-1. `src/lib/firebase.ts` 검증 ✅

**검증 항목**:
- ✅ `firebaseConfig.projectId`: `'hyun-poong'` (환경 변수 우선)
- ✅ `firebaseConfig.storageBucket`: `VITE_FIREBASE_STORAGE_BUCKET || 'hyun-poong.firebasestorage.app'`
- ✅ `initializeApp(firebaseConfig)` 단일 진실 소스
- ✅ `getStorage(app)` 단일 진실 소스
- ✅ **재발 방지 가드** 존재:
  ```typescript
  const activeBucket = (storage as any)._location?.bucket || ...;
  if (activeBucket.includes('appspot.com')) {
    throw new Error('INVALID_STORAGE_BUCKET: ...');
  }
  ```
- ✅ DEBUG 모드에서 Config vs Actual 버킷 로그 출력
- ✅ 다른 파일에서 `initializeApp` / `getStorage` 직접 호출 없음 (문서 제외)

**결과**: ✅ **정상**

### B-2. `src/lib/storage.ts` 검증 ✅

**검증 항목**:
- ✅ `uploadImageToStorage` 함수 존재
- ✅ `uploadMenuImage` 함수 존재
- ✅ 업로드 시작 전 `appspot.com` 검사 및 FATAL 에러 throw
- ✅ `getDownloadURL` 후 URL 내 버킷 검증 및 FATAL 에러 throw
- ✅ 진단 로그 출력 (`Using storage bucket`, `storagePath`, `URL bucket`)
- ✅ 프로젝트 내 모든 이미지 업로드가 이 헬퍼를 통해서만 진행
  - `uploadBytes(`, `getDownloadURL(` 직접 사용 없음 (문서 제외)

**결과**: ✅ **정상**

---

## 3. 환경 변수/버킷/CORS 설정 검증 결과

### B-3. 환경 변수 검증 ✅

**`.env` 파일**:
```
VITE_FIREBASE_PROJECT_ID=hyun-poong
VITE_FIREBASE_STORAGE_BUCKET=hyun-poong.firebasestorage.app
```

**`.env.production` 파일**:
```
VITE_FIREBASE_PROJECT_ID=hyun-poong
VITE_FIREBASE_STORAGE_BUCKET=hyun-poong.firebasestorage.app
```

**결과**: ✅ **정상** (중복/오타/공백 없음)

### C-1. CORS 스크립트 (`scripts/apply-cors.mjs`) 검증 ✅

**확인 포인트**:
- ✅ `BUCKET_NAME`: `'hyun-poong.firebasestorage.app'` (환경 변수 우선)
- ✅ `PROJECT_ID`: `'hyun-poong'` (환경 변수 우선)
- ✅ 에러 핸들링: 404, 403, 프로젝트 불일치 시 명확한 메시지 출력

**결과**: ✅ **정상**

### C-2. `cors.json` 검증 ✅

**확인 포인트**:
- ✅ `origin` 배열에 다음 포함:
  - `https://hyun-poong.web.app`
  - `https://hyun-poong.firebaseapp.com`
  - `http://localhost:5173`
  - `http://localhost:5174`
- ✅ `method`: `["GET","HEAD","POST","PUT","DELETE","OPTIONS"]`
- ✅ `responseHeader`: `["Authorization","Content-Type","x-goog-meta-*","x-goog-resumable"]`
- ✅ `maxAgeSeconds`: `3600`

**결과**: ✅ **정상**

---

## 4. 빌드/CORS/배포 전 자동 검증 플로우

### D-1. 빌드 검증

**명령어**: `npm run verify:build`

**절차**:
1. `npm run build` 실행
2. `dist/` 폴더에서 `appspot.com` 검색
3. 발견 시 빌드 실패로 처리 (exit code 1)

**PowerShell 검색 명령어**:
```powershell
Get-ChildItem -Path dist -Recurse -File | Select-String -Pattern "appspot\.com" -ErrorAction SilentlyContinue
```

**package.json 스크립트 추가 완료**:
```json
"verify:build": "npm run build && node -e \"...\"",
"predeploy": "npm run verify:build && npm run cors:apply"
```

### D-2. CORS 적용 및 검증 플로우

**명령어**: `npm run cors:apply`

**절차**:
1. `cors.json` 파일 읽기
2. Google Cloud Storage 클라이언트 초기화 (프로젝트 ID: `hyun-poong`)
3. 버킷 연결: `gs://hyun-poong.firebasestorage.app`
4. CORS 설정 적용
5. 적용된 설정 확인 및 출력

**권한 문제 발생 시 안내**:
- `gcloud config set project hyun-poong`
- `gcloud auth application-default login`

**수동 확인 명령어** (문서용):
```bash
gsutil cors get gs://hyun-poong.firebasestorage.app
```

### D-3. 배포 전 자동 검증 플로우

**권장 배포 순서**:
```bash
# 1. 빌드 검증 (appspot.com 확인)
npm run verify:build

# 2. CORS 설정 적용
npm run cors:apply

# 3. Functions 빌드 (필요 시)
npm run functions:build

# 4. 배포
firebase deploy --only hosting
# 또는
firebase deploy --only hosting,functions
```

**자동화**: `npm run predeploy` 스크립트가 `verify:build`와 `cors:apply`를 자동 실행

---

## 5. 운영 환경 수동 검증 체크리스트

### E. 운영 환경 수동 검증 시나리오

**접속**: https://hyun-poong.web.app/admin/menus

**절차**:
1. 관리자 로그인
2. 메뉴 생성/수정 → 이미지 업로드
3. 브라우저 DevTools → Console & Network 확인

**성공 기준**:

#### Console 로그:
- ✅ `[Firebase Storage] Actual bucket: hyun-poong.firebasestorage.app`
- ✅ `[uploadMenuImage] Using storage bucket: hyun-poong.firebasestorage.app`

#### Network 탭:
- ✅ 요청 URL: `https://firebasestorage.googleapis.com/v0/b/hyun-poong.firebasestorage.app/o?...`
- ✅ Status: `200` 또는 `204`
- ✅ CORS 에러 없음

#### Storage Console:
- ✅ 업로드된 파일 확인: `hyun-poong.firebasestorage.app/stores/hyunpoong-main/menus/...`

---

## 6. 발견된 이슈 및 조치 내역

### 이슈 1: Functions 빌드 산출물에 `appspot.com` 사용

**파일**: `src/functions/lib/lib/pdf.js` (빌드 산출물)

**수정 전**:
```javascript
const bucketName = process.env.FUNCTIONS_EMULATOR
    ? 'demo.appspot.com'
    : `${projectId}.appspot.com`;
```

**수정 후**:
```javascript
const bucketName = process.env.FUNCTIONS_EMULATOR
    ? 'demo.firebasestorage.app'
    : process.env.STORAGE_BUCKET_NAME || `${projectId}.firebasestorage.app`;
```

**조치 완료**: ✅ 빌드 산출물 수정 완료

**후속 조치**: `npm run functions:build` 실행하여 소스 파일에서 재빌드 권장

---

## 7. 다음에 배포할 때 반드시 따라야 할 체크리스트

### 배포 전 필수 체크리스트

- [ ] **빌드 검증**: `npm run verify:build` 실행 → `appspot.com` 없음 확인
- [ ] **CORS 설정**: `npm run cors:apply` 실행 → 성공 확인
- [ ] **Functions 빌드** (변경 시): `npm run functions:build` 실행
- [ ] **환경 변수 확인**: `.env.production`에서 `VITE_FIREBASE_STORAGE_BUCKET=hyun-poong.firebasestorage.app` 확인

### 배포 후 필수 체크리스트

- [ ] **운영 환경 접속**: https://hyun-poong.web.app/admin/menus
- [ ] **Console 로그 확인**: `[Firebase Storage] Actual bucket: hyun-poong.firebasestorage.app` 출력 확인
- [ ] **이미지 업로드 테스트**: 메뉴 이미지 업로드 성공 확인
- [ ] **Network 탭 확인**: 요청 URL이 `hyun-poong.firebasestorage.app`인지 확인
- [ ] **CORS 에러 없음**: Network 탭에서 CORS 관련 에러 없음 확인

### 자동화된 검증

- [ ] `npm run predeploy` 스크립트가 정상 실행되는지 확인 (빌드 검증 + CORS 적용)

---

## 8. 재발 방지 시스템

### 코드 레벨 가드

1. **`src/lib/firebase.ts`**: Storage 초기화 시 `appspot.com` 감지 → FATAL 에러 throw
2. **`src/lib/storage.ts`**: 업로드 시작 전 및 다운로드 URL에서 `appspot.com` 감지 → FATAL 에러 throw

### 빌드 레벨 검증

- `npm run verify:build`: 빌드 산출물에서 `appspot.com` 검색 → 발견 시 빌드 실패

### 배포 레벨 검증

- `npm run predeploy`: 빌드 검증 + CORS 적용 자동 실행

---

## 9. 요약

**전체 검증 결과**: ✅ **정상**

- 코드 레벨: FATAL 가드 정상 작동
- 환경 변수: 올바른 버킷 이름 설정
- CORS 설정: 올바른 origin 및 method 설정
- 빌드 검증: 자동화 스크립트 추가 완료
- Functions 빌드 산출물: 수정 완료 (재빌드 권장)

**다음 배포 시**: 위 체크리스트를 따라 배포 전/후 검증 수행

---

**문서 작성일**: 2025-01-XX  
**최종 검증자**: 운영관리 전담 시니어 엔지니어
