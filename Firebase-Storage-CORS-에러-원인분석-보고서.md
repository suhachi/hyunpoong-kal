# 🔥 Firebase Storage CORS 에러 원인 분석 보고서

**작성일**: 2025-01-20  
**프로젝트**: 현풍닭칼국수 PWA  
**에러 유형**: CORS (Cross-Origin Resource Sharing) 정책 위반

---

## 📊 에러 요약

### 발생한 에러

```
Access to XMLHttpRequest at 
'https://firebasestorage.googleapis.com/v0/b/hyun-poong.appspot.com/o?name=stores%2Fhyunpoong-ma.in' 
from origin 'https://hyun-poong.web.app' 
has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
It does not have HTTP ok status.
```

**에러 위치**: 메뉴 이미지 업로드 시 (`MenuCreateDialog`)  
**에러 원인**: Firebase Storage CORS 설정이 올바르게 적용되지 않음

---

## 🔍 원인 분석

### 1. 프로젝트 정보 불일치

| 항목 | 실제 값 | 설정 파일 값 | 상태 |
|------|---------|-------------|------|
| **Firebase Project ID** | `hyun-poong` | `hp-kal` | ❌ 불일치 |
| **배포 도메인** | `https://hyun-poong.web.app` | `https://hp-kal.web.app` | ❌ 불일치 |
| **Storage Bucket** | `hyun-poong.appspot.com` | `hp-kal.appspot.com` | ❌ 불일치 |

### 2. CORS 설정 파일 문제

**파일 위치**: `src/cors.json`

**현재 설정**:
```json
[
  {
    "origin": [
      "https://hp-kal.web.app",           // ❌ 잘못된 도메인
      "https://hp-kal.firebaseapp.com",   // ❌ 잘못된 도메인
      "http://localhost:5173"             // ✅ 정상
    ],
    "method": ["GET","HEAD","POST","PUT","DELETE","OPTIONS"],
    "responseHeader": ["Authorization","Content-Type","x-goog-meta-*","x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
```

**문제점**:
- ❌ 실제 배포 도메인 `https://hyun-poong.web.app`이 허용 목록에 없음
- ❌ 실제 Firebase 앱 도메인 `https://hyun-poong.firebaseapp.com`이 허용 목록에 없음
- ❌ 잘못된 도메인 `hp-kal.*`만 설정되어 있음

### 3. CORS 설정 스크립트 문제

**파일 위치**: `src/scripts/apply-cors.sh`

**문제점**:
```bash
# 잘못된 버킷 이름 사용
gsutil cors set cors.json gs://hp-kal.appspot.com  # ❌ 잘못됨

# 올바른 버킷 이름
gsutil cors set cors.json gs://hyun-poong.appspot.com  # ✅ 올바름
```

### 4. 실제 요청 정보

**요청 URL**: 
```
https://firebasestorage.googleapis.com/v0/b/hyun-poong.appspot.com/o?name=stores%2Fhyunpoong-main%2Fmenus%2Ftemp-...%2Fimage.png
```

**요청 Origin**: 
```
https://hyun-poong.web.app
```

**문제**: 
- 요청은 `hyun-poong.appspot.com` 버킷으로 가고 있음
- Origin은 `hyun-poong.web.app`에서 발생
- 하지만 CORS 설정은 `hp-kal.appspot.com` 버킷에만 적용되어 있음 (또는 적용되지 않음)

---

## 🎯 근본 원인

### 주요 원인

1. **프로젝트 이름 변경 미반영**
   - 프로젝트가 `hp-kal`에서 `hyun-poong`으로 변경되었지만
   - CORS 설정 파일(`cors.json`)이 업데이트되지 않음
   - CORS 적용 스크립트(`apply-cors.sh`)도 업데이트되지 않음

2. **CORS 설정 미적용**
   - `cors.json` 파일이 잘못된 도메인을 포함하고 있어
   - 실제로 CORS 설정이 적용되지 않았거나
   - 잘못된 버킷에 적용되었을 가능성

3. **환경 변수와 설정 파일 불일치**
   - `.env.local`: `VITE_FIREBASE_PROJECT_ID=hyun-poong` ✅
   - `cors.json`: `hp-kal` 도메인 사용 ❌
   - `apply-cors.sh`: `hp-kal.appspot.com` 버킷 사용 ❌

---

## ✅ 해결 방법

### 해결 방법 1: CORS 설정 파일 수정 및 적용 (권장)

#### Step 1: cors.json 파일 수정

**파일**: `src/cors.json`

**수정 전**:
```json
{
  "origin": [
    "https://hp-kal.web.app",
    "https://hp-kal.firebaseapp.com",
    "http://localhost:5173"
  ],
  ...
}
```

**수정 후**:
```json
[
  {
    "origin": [
      "https://hyun-poong.web.app",
      "https://hyun-poong.firebaseapp.com",
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    "method": ["GET","HEAD","POST","PUT","DELETE","OPTIONS"],
    "responseHeader": ["Authorization","Content-Type","x-goog-meta-*","x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
```

#### Step 2: apply-cors.sh 스크립트 수정

**파일**: `src/scripts/apply-cors.sh`

**수정할 부분**:
```bash
# 수정 전
gsutil cors set cors.json gs://hp-kal.appspot.com
gcloud config set project hp-kal

# 수정 후
gsutil cors set cors.json gs://hyun-poong.appspot.com
gcloud config set project hyun-poong
```

#### Step 3: CORS 설정 적용

**방법 A: Google Cloud Console 사용 (권장)**

1. Google Cloud Console 접속: https://console.cloud.google.com
2. 프로젝트 선택: `hyun-poong`
3. Cloud Storage > 버킷 선택: `hyun-poong.appspot.com`
4. "권한" 탭 > "CORS 구성" 클릭
5. 다음 JSON 입력:
```json
[
  {
    "origin": [
      "https://hyun-poong.web.app",
      "https://hyun-poong.firebaseapp.com",
      "http://localhost:5173"
    ],
    "method": ["GET","HEAD","POST","PUT","DELETE","OPTIONS"],
    "responseHeader": ["Authorization","Content-Type","x-goog-meta-*","x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
```
6. "저장" 클릭

**방법 B: gsutil 명령어 사용**

```bash
# 프로젝트 루트에서 실행
cd hyunpoong-kal

# Google Cloud 인증
gcloud auth login
gcloud config set project hyun-poong

# CORS 설정 적용
gsutil cors set src/cors.json gs://hyun-poong.appspot.com

# 설정 확인
gsutil cors get gs://hyun-poong.appspot.com
```

---

## 🔧 즉시 해결 방법 (긴급)

### 임시 해결책: Google Cloud Console에서 직접 설정

1. **Google Cloud Console 접속**
   - URL: https://console.cloud.google.com/storage/browser
   - 프로젝트: `hyun-poong` 선택

2. **Storage 버킷 선택**
   - 버킷 이름: `hyun-poong.appspot.com` 클릭

3. **CORS 설정**
   - "권한" 탭 클릭
   - "CORS 구성" 섹션에서 "편집" 클릭
   - 다음 JSON 입력:
   ```json
   [
     {
       "origin": [
         "https://hyun-poong.web.app",
         "https://hyun-poong.firebaseapp.com",
         "http://localhost:5173"
       ],
       "method": ["GET","HEAD","POST","PUT","DELETE","OPTIONS"],
       "responseHeader": ["Authorization","Content-Type","x-goog-meta-*","x-goog-resumable"],
       "maxAgeSeconds": 3600
     }
   ]
   ```
   - "저장" 클릭

4. **확인**
   - 브라우저 개발자 도구에서 이미지 업로드 재시도
   - Network 탭에서 CORS 에러가 사라졌는지 확인

---

## 📋 검증 체크리스트

CORS 설정 후 다음을 확인하세요:

- [ ] Google Cloud Console에서 CORS 설정이 올바르게 저장되었는지 확인
- [ ] `gsutil cors get gs://hyun-poong.appspot.com` 명령어로 설정 확인
- [ ] 브라우저 개발자 도구 > Network 탭에서 OPTIONS 요청이 성공하는지 확인
- [ ] 메뉴 이미지 업로드가 정상적으로 작동하는지 확인
- [ ] 리뷰 사진 업로드가 정상적으로 작동하는지 확인
- [ ] 다른 도메인에서도 접근 가능한지 확인 (필요 시)

---

## 🚨 주의 사항

### 보안 고려사항

1. **Origin 제한**
   - 프로덕션 환경에서는 정확한 도메인만 허용
   - 와일드카드(`*`) 사용 지양

2. **Method 제한**
   - 필요한 HTTP 메서드만 허용
   - 현재 설정: GET, HEAD, POST, PUT, DELETE, OPTIONS

3. **Response Header**
   - 필요한 헤더만 허용
   - 현재 설정: Authorization, Content-Type, x-goog-meta-*, x-goog-resumable

### 개발 환경 고려사항

- `localhost:5173` (Vite 기본 포트) 허용
- 필요 시 다른 개발 포트도 추가 가능

---

## 📝 수정 필요한 파일 목록

1. **`src/cors.json`**
   - 도메인을 `hp-kal.*` → `hyun-poong.*`로 변경

2. **`src/scripts/apply-cors.sh`**
   - 버킷 이름을 `hp-kal.appspot.com` → `hyun-poong.appspot.com`로 변경
   - 프로젝트 ID를 `hp-kal` → `hyun-poong`으로 변경

3. **문서 파일들** (선택사항)
   - `src/docs/06-firebase/03-CORS-설정-가이드.md` 업데이트
   - 프로젝트 이름 관련 모든 문서 업데이트

---

## 🎯 결론

### 문제 요약

1. ✅ **Firebase 연동**: 정상 작동 중
2. ❌ **CORS 설정**: 잘못된 프로젝트 이름으로 인해 미적용
3. ❌ **설정 파일**: `hp-kal` → `hyun-poong` 업데이트 필요

### 해결 우선순위

1. **긴급**: Google Cloud Console에서 CORS 설정 직접 적용
2. **중요**: `cors.json` 파일 수정
3. **권장**: `apply-cors.sh` 스크립트 수정

### 예상 소요 시간

- Google Cloud Console 직접 설정: **5분**
- 파일 수정 및 스크립트 실행: **10분**
- 총 소요 시간: **약 15분**

---

---

## ✅ 수정 완료 내역

### 수정된 파일

1. **`src/cors.json`** ✅
   - 도메인을 `hp-kal.*` → `hyun-poong.*`로 변경 완료
   - `localhost:5174` 추가 (다른 개발 포트 지원)

2. **`src/scripts/apply-cors.sh`** ✅
   - 프로젝트 ID: `hp-kal` → `hyun-poong` 변경 완료
   - 버킷 이름: `hp-kal.appspot.com` → `hyun-poong.appspot.com` 변경 완료
   - 모든 관련 메시지 업데이트 완료

### 다음 단계

**중요**: 파일 수정만으로는 CORS 에러가 해결되지 않습니다.  
**반드시 Google Cloud Console에서 CORS 설정을 적용해야 합니다.**

#### 즉시 적용 방법

1. **Google Cloud Console 접속**
   - https://console.cloud.google.com/storage/browser
   - 프로젝트: `hyun-poong` 선택

2. **버킷 선택**
   - `hyun-poong.appspot.com` 클릭

3. **CORS 설정 적용**
   - "권한" 탭 > "CORS 구성" > "편집"
   - `src/cors.json` 파일 내용 복사하여 붙여넣기
   - "저장" 클릭

4. **또는 스크립트 실행** (gsutil 설치된 경우)
   ```bash
   cd hyunpoong-kal
   bash src/scripts/apply-cors.sh
   ```

---

**보고서 작성 완료** ✅  
**파일 수정 완료** ✅

