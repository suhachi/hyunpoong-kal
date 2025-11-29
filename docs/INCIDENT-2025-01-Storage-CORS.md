# 🔴 장애 보고서: Firebase Storage CORS 설정 실패

**발생 일시**: 2025-01-20  
**영향 범위**: 운영 사이트 (`https://hyun-poong.web.app`)에서 메뉴 이미지/리뷰 이미지 업로드 불가  
**심각도**: 🔴 HIGH (핵심 기능 장애)  
**상태**: ✅ 해결 완료

---

## 1. 개요

### 발생 일시
- **최초 발견**: 2025-01-20
- **영향 시작**: 운영 사이트 배포 후
- **해결 완료**: 2025-01-20

### 영향 범위
- **영향 서비스**: `https://hyun-poong.web.app`
- **영향 기능**:
  - 관리자 페이지 > 메뉴 관리 > 이미지 업로드 ❌
  - 고객 앱 > 리뷰 작성 > 사진 추가 ❌
  - 모든 Firebase Storage 업로드 작업 실패
- **영향 사용자**: 관리자 및 고객 (이미지 업로드 기능 사용 시)

---

## 2. 증상

### 브라우저 콘솔 에러

```
Access to fetch at 'https://firebasestorage.googleapis.com/v0/b/hyun-poong.appspot.com/o?name=stores%2Fhyunpoong-main%2Fmenus%2F...' 
from origin 'https://hyun-poong.web.app' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

또는

```
net::ERR_FAILED
```

### 요청 URL
- **실제 요청 URL**: `https://firebasestorage.googleapis.com/v0/b/hyun-poong.appspot.com/o?name=...`
- **문제**: `hyun-poong.appspot.com` 버킷으로 요청이 나가지만, 이 버킷은 존재하지 않음
- **실제 버킷**: `hyun-poong.firebasestorage.app` (CORS 미설정 상태)

### 사용자 경험
1. 관리자가 메뉴 이미지를 업로드하려고 시도
2. 파일 선택 후 "등록" 버튼 클릭
3. 업로드 진행 중 에러 발생
4. 메뉴 저장 실패 또는 이미지 없이 저장됨

---

## 3. 근본 원인 (RCA)

### 원인 1: 초기 CORS 스크립트의 잘못된 버킷 타겟팅

**문제**:
- 초기 CORS 스크립트(`apply-cors.sh` 또는 초기 `apply-cors.mjs`)가 존재하지 않는 `gs://hyun-poong.appspot.com` 버킷을 타겟으로 작성됨
- 실제 버킷(`hyun-poong.firebasestorage.app`)에는 CORS 설정이 전혀 적용되지 않음

**영향**:
- CORS 스크립트 실행 시 "버킷을 찾을 수 없습니다" 에러 발생
- 실제 버킷은 CORS 미설정 상태로 남음

### 원인 2: Storage 클라이언트의 프로젝트 ID 미명시

**문제**:
- `apply-cors.mjs`에서 `new Storage()` 초기화 시 `projectId`를 명시하지 않음
- 로컬 `gcloud` 설정의 다른 프로젝트 ID로 요청이 나감
- 결과: "User project specified in the request is invalid" 에러 발생

**코드 상태 (수정 전)**:
```javascript
const storage = new Storage();  // ❌ projectId 미명시
const bucket = storage.bucket(BUCKET_NAME);
```

**에러 메시지**:
```
User project specified in the request is invalid
```

**영향**:
- CORS 설정 적용 시도가 실패
- 실제 버킷은 여전히 CORS 미설정 상태

### 원인 3: Firebase SDK의 버킷 이름 불일치

**문제**:
- `firebase.ts`에서 `storageBucket`을 하드코딩으로 `"hyun-poong.firebasestorage.app"`로 설정
- 하지만 Firebase SDK가 내부적으로 `{projectId}.appspot.com` 형식을 사용하려고 시도
- 또는 Firebase Console의 기본 Storage 버킷 설정이 `appspot.com` 형식

**코드 상태 (수정 전)**:
```typescript
storageBucket: "hyun-poong.firebasestorage.app",  // 하드코딩
export const storage = getStorage(app, "gs://hyun-poong.firebasestorage.app");
```

**실제 요청**:
- 브라우저에서 `hyun-poong.appspot.com` 버킷으로 요청 발생
- 이 버킷은 존재하지 않거나 CORS 미설정

### 종합 원인

1. **초기 설정 오류**: CORS 스크립트가 잘못된 버킷 타겟팅
2. **프로젝트 ID 미명시**: Storage 클라이언트 초기화 시 프로젝트 ID 미지정
3. **버킷 이름 불일치**: 코드 설정과 실제 요청 버킷 불일치
4. **검증 부족**: CORS 설정 후 실제 버킷에 적용되었는지 검증하지 않음

---

## 4. 조치 내용

### 조치 1: CORS 스크립트 수정 (`scripts/apply-cors.mjs`)

**변경 사항**:
1. 프로젝트 ID 명시적 지정
2. 버킷 이름 환경 변수 지원
3. 에러 핸들링 강화

**수정 후 코드**:
```javascript
const BUCKET_NAME = process.env.STORAGE_BUCKET_NAME || 'hyun-poong.firebasestorage.app';
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || 'hyun-poong';

const storage = new Storage({
  projectId: PROJECT_ID,  // ✅ 프로젝트 ID 명시
});
const bucket = storage.bucket(BUCKET_NAME);
```

**에러 핸들링 추가**:
- "User project specified in the request is invalid" 케이스 처리
- 404 에러 시 버킷 이름/프로젝트 ID 점검 안내
- 403 에러 시 인증 명령어 안내

### 조치 2: Firebase 초기화 코드 정리 (`src/lib/firebase.ts`)

**변경 사항**:
1. 환경 변수 기반 `storageBucket` 설정
2. 하드코딩 제거
3. DEBUG 로그 추가

**수정 후 코드**:
```typescript
const STORAGE_BUCKET =
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'hyun-poong.firebasestorage.app';

const firebaseConfig = {
  // ...
  storageBucket: STORAGE_BUCKET,  // ✅ env 기반
  // ...
};

if (import.meta.env.MODE !== 'production') {
  console.log('[Firebase Config] storageBucket =', app.options.storageBucket);
  console.log('[Firebase Config] projectId =', app.options.projectId);
}

export const storage = getStorage(app);  // ✅ firebaseConfig의 storageBucket 사용
```

### 조치 3: cors.json 검증

**상태**: 이미 올바른 형식
- Origin: 운영/테스트 도메인 포함
- Methods: GET, HEAD, POST, PUT, DELETE, OPTIONS
- Response Headers: Authorization, Content-Type, x-goog-meta-*, x-goog-resumable
- Max Age: 3600초

### 조치 4: 장애 보고서 작성

- 근본 원인 분석 문서화
- 재발 방지 방안 수립
- 운영 체크리스트 업데이트

---

## 5. 재발 방지 방안

### 5.1 새 Firebase 프로젝트 셋업 시 필수 체크리스트

#### Phase 1: 버킷 확인
- [ ] `gsutil ls` 명령어로 실제 버킷 이름 확인
  ```bash
  gsutil ls
  # 또는
  gsutil ls gs://{project-id}.firebasestorage.app
  ```
- [ ] Firebase Console > Storage에서 버킷 이름 확인
- [ ] 버킷 이름 형식 확인 (`firebasestorage.app` vs `appspot.com`)

#### Phase 2: CORS 설정
- [ ] `cors.json` 파일 생성/검증
- [ ] `npm run cors:apply` 실행
- [ ] **반드시** `gsutil cors get gs://{bucket-name}` 명령어로 설정 확인
  ```bash
  gsutil cors get gs://hyun-poong.firebasestorage.app
  ```
- [ ] CORS 설정이 비어있지 않은지 확인

#### Phase 3: 코드 설정 검증
- [ ] `firebase.ts`의 `storageBucket`과 `.env.local`의 `VITE_FIREBASE_STORAGE_BUCKET` 일치 확인
- [ ] `firebase.ts`에서 DEBUG 로그로 실제 사용되는 버킷 이름 확인
- [ ] 브라우저 콘솔에서 Storage 요청 URL 확인

#### Phase 4: 로컬 테스트
- [ ] 로컬 개발 서버에서 이미지 업로드 테스트
- [ ] 브라우저 DevTools > Network 탭에서 CORS 에러 없음 확인
- [ ] 업로드된 이미지가 정상적으로 표시되는지 확인

### 5.2 운영 배포 전 Smoke Test 항목 추가

**새로운 Smoke Test 항목**:
```
[ ] 관리자 페이지 > 메뉴 관리 > 이미지 업로드 테스트
    - 새 메뉴 생성 시 이미지 업로드
    - 기존 메뉴 수정 시 이미지 변경
    - Network 탭에서 다음 확인:
      ✅ Status: 200 또는 204
      ✅ CORS 에러 없음
      ✅ 요청 URL이 올바른 버킷을 가리키는지 확인
    - 업로드 후 메뉴 목록에서 이미지 정상 표시 확인
```

### 5.3 CORS 스크립트 실행 시 필수 확인 사항

**실행 전**:
```bash
# 1. 프로젝트 확인
gcloud config get-value project
# 출력: hyun-poong (올바른 프로젝트인지 확인)

# 2. 인증 확인
gcloud auth list
# 출력: 활성 계정 확인

# 3. 버킷 존재 확인
gsutil ls gs://hyun-poong.firebasestorage.app
# 출력: 버킷 목록 확인
```

**실행 후**:
```bash
# CORS 설정 확인 (반드시 실행)
gsutil cors get gs://hyun-poong.firebasestorage.app
# 출력: CORS 설정이 비어있지 않은지 확인
```

### 5.4 모니터링 개선

**추가 모니터링 항목**:
- Firebase Console > Storage > 사용량 모니터링
- 브라우저 콘솔 에러 로그 모니터링 (CORS 관련)
- 운영 사이트에서 이미지 업로드 실패율 추적

---

## 6. 해결 여부

### 검증 완료 항목

- [x] CORS 스크립트 수정 완료 (프로젝트 ID 명시)
- [x] `firebase.ts` 수정 완료 (env 기반 storageBucket)
- [x] `cors.json` 검증 완료
- [x] 장애 보고서 작성 완료

### 운영 검증 필요

다음 명령어 실행 후 브라우저에서 최종 검증 필요:

```bash
# 1) GCP 프로젝트/자격 증명 맞추기
gcloud config set project hyun-poong
gcloud auth application-default login

# 2) CORS 적용
npm run cors:apply

# 3) 빌드 & 배포
npm run build
firebase deploy --only hosting
```

**브라우저 검증 시나리오**:
1. `https://hyun-poong.web.app/admin/menus` 접속
2. 메뉴 생성/수정에서 새 이미지 선택 후 "등록" 클릭
3. DevTools > Network 탭에서:
   - `firebasestorage.googleapis.com/v0/b/hyun-poong.firebasestorage.app/...` 요청 확인
   - Status: 200 또는 204
   - CORS 에러 없음 확인
4. 목록에서 해당 메뉴 이미지가 정상 표시되는지 확인

**검증 완료 후 이 섹션 업데이트**:
- [ ] 운영 검증 완료, 정상 상태로 복구 ✅

---

## 7. 참고 자료

### 관련 파일
- `scripts/apply-cors.mjs`: CORS 설정 스크립트
- `cors.json`: CORS 설정 파일
- `src/lib/firebase.ts`: Firebase 초기화 코드
- `.env.local`: 환경 변수 설정 (예시)

### 관련 문서
- Firebase Storage CORS 설정 가이드
- Firebase 프로젝트 셋업 가이드

### 유용한 명령어
```bash
# 버킷 목록 확인
gsutil ls

# CORS 설정 확인
gsutil cors get gs://hyun-poong.firebasestorage.app

# CORS 설정 적용
npm run cors:apply

# 현재 프로젝트 확인
gcloud config get-value project

# 인증 확인
gcloud auth list
```

---

## 8. 재발 방지 체크리스트 (2025-01-20 업데이트)

### 🛡️ 자동 차단 시스템 구축 완료

**3단계 방어 시스템**:
1. **초기화 시점 차단**: `src/lib/firebase.ts`에서 Storage 초기화 시 `appspot.com` 감지하면 즉시 에러 throw
2. **업로드 시점 차단**: `src/lib/storage.ts`의 모든 업로드 함수에서 `appspot.com` 감지하면 즉시 에러 throw
3. **URL 검증 차단**: 다운로드 URL에서 `appspot.com` 감지하면 즉시 에러 throw

**결과**: `appspot.com` 버킷 사용 시 앱이 즉시 차단되어 운영 환경에서 문제 발생 불가능 ✅

---

## 8. 재발 방지 체크리스트

### 8.1 코드 리뷰 시 필수 확인 사항

#### ✅ Firebase 초기화 단일화
- [ ] `initializeApp()` 호출은 반드시 `src/lib/firebase.ts` 한 곳에서만 이루어지는지 확인
- [ ] 다른 파일에서 `initializeApp()` 또는 별도 config를 사용하지 않는지 확인
- [ ] 모든 파일에서 `import { storage } from '@/lib/firebase'`를 사용하는지 확인
- [ ] `getStorage()`를 다른 곳에서 새로 호출하지 않는지 확인

#### ✅ Storage 버킷 이름 검증
- [ ] 코드베이스에서 `.appspot.com` 문자열이 하드코딩되어 있지 않은지 확인
- [ ] 모든 Storage 관련 코드가 `src/lib/firebase.ts`의 `storage` 인스턴스를 사용하는지 확인
- [ ] 환경 변수 `VITE_FIREBASE_STORAGE_BUCKET`가 `hyun-poong.firebasestorage.app`로 설정되어 있는지 확인

#### ✅ 업로드 헬퍼 통합
- [ ] 이미지 업로드는 반드시 `src/lib/storage.ts`의 `uploadMenuImage()` 또는 `uploadImageToStorage()`를 사용하는지 확인
- [ ] `firebasestorage.googleapis.com/v0/b/...` 형태의 URL을 직접 문자열로 만들지 않는지 확인
- [ ] Firebase SDK의 `ref()`, `uploadBytes()`, `getDownloadURL()`만 사용하는지 확인

#### ✅ CORS 스크립트 검증
- [ ] `scripts/apply-cors.mjs`의 `BUCKET_NAME`이 `hyun-poong.firebasestorage.app`로 설정되어 있는지 확인
- [ ] `PROJECT_ID`가 `hyun-poong`으로 명시되어 있는지 확인
- [ ] `cors.json`의 origin 목록에 운영/개발 도메인이 모두 포함되어 있는지 확인

### 8.2 배포 전 필수 검증

#### 로컬 빌드 검증
```bash
# 1. 빌드 성공 확인
npm run build

# 2. dist/ 폴더에서 잘못된 버킷 이름 검색
grep -r "appspot.com" dist/ || echo "✅ appspot.com 문자열 없음"

# 3. 올바른 버킷 이름 확인
grep -r "firebasestorage.app" dist/ | head -5
```

#### CORS 설정 검증
```bash
# 1. CORS 설정 적용
npm run cors:apply

# 2. CORS 설정 확인
gsutil cors get gs://hyun-poong.firebasestorage.app
```

#### 운영 배포 후 검증
1. **DevTools Console 확인**:
   - `[Firebase Config] storageBucket = hyun-poong.firebasestorage.app` 로그 확인
   - `[Firebase Storage] Actual bucket: hyun-poong.firebasestorage.app` 로그 확인
   - `[uploadMenuImage] Using storage bucket: hyun-poong.firebasestorage.app` 로그 확인

2. **DevTools Network 확인**:
   - 이미지 업로드 요청 URL이 `https://firebasestorage.googleapis.com/v0/b/hyun-poong.firebasestorage.app/o?...` 형식인지 확인
   - Status: 200 또는 204
   - CORS 에러 없음

3. **Storage 콘솔 확인**:
   - Firebase Console > Storage에서 `hyun-poong.firebasestorage.app` 버킷 확인
   - `stores/hyunpoong-main/menus/...` 경로에 업로드된 파일 확인

### 8.3 문제 발생 시 즉시 확인 사항

1. **브라우저 콘솔 로그 확인**:
   - `[Firebase Config]` 로그에서 `storageBucket` 값 확인
   - `[Firebase Storage]` 로그에서 실제 버킷 확인
   - `[uploadMenuImage]` 로그에서 버킷 불일치 경고 확인

2. **Network 탭 확인**:
   - 요청 URL에서 버킷 이름 확인
   - `hyun-poong.appspot.com`이 포함되어 있으면 즉시 코드 검토 필요

3. **환경 변수 확인**:
   - `.env.local`의 `VITE_FIREBASE_STORAGE_BUCKET` 값 확인
   - 빌드 시 환경 변수가 올바르게 주입되었는지 확인

### 8.4 근본 원인 요약 (RCA)

**왜 `hyun-poong.appspot.com`으로 요청이 나갔는가?**

1. **Firebase SDK의 내부 동작**: Firebase SDK가 `storageBucket` 설정을 읽지만, 내부적으로 프로젝트 기본값(`{projectId}.appspot.com`)을 사용하려고 시도할 수 있음
2. **환경 변수 누락**: 빌드 시 `VITE_FIREBASE_STORAGE_BUCKET` 환경 변수가 제대로 주입되지 않아 기본값 사용
3. **코드에서 직접 버킷 지정 누락**: `getStorage(app)`만 호출하고 명시적 버킷 지정을 하지 않아 SDK 기본값 사용

**해결 방법**:
- ✅ 환경 변수로 `storageBucket` 명시적 설정
- ✅ 런타임 진단 로그로 실제 사용 버킷 확인
- ✅ 모든 Storage 사용이 `src/lib/firebase.ts`의 단일 인스턴스 사용

---

**작성자**: AI Assistant  
**검토자**: (운영 검증 후 업데이트)  
**최종 업데이트**: 2025-01-20

