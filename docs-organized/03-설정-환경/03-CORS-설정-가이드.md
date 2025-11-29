# Firebase Storage CORS 설정 가이드

**프로젝트**: 현풍닭칼국수 배달앱 (hp-kal)  
**작성일**: 2025-10-29  
**목적**: Firebase Storage CORS 설정 적용

---

## 📋 목차

1. [CORS란 무엇인가](#1-cors란-무엇인가)
2. [왜 CORS 설정이 필요한가](#2-왜-cors-설정이-필요한가)
3. [설정 방법 A: Google Cloud Console (권장)](#3-설정-방법-a-google-cloud-console-권장)
4. [설정 방법 B: gsutil 명령어](#4-설정-방법-b-gsutil-명령어)
5. [CORS 설정 확인](#5-cors-설정-확인)
6. [트러블슈팅](#6-트러블슈팅)

---

## 1. CORS란 무엇인가

### Cross-Origin Resource Sharing (CORS)

**정의**: 웹 브라우저가 다른 도메인의 리소스에 접근할 수 있도록 허용하는 메커니즘

**예시**:
```
웹 앱: https://hp-kal.web.app
Storage: https://storage.googleapis.com/hp-kal.appspot.com

→ 다른 도메인이므로 CORS 설정 필요
```

### 우리 프로젝트의 CORS 설정

**파일**: `/cors.json`

```json
[
  {
    "origin": [
      "https://hp-kal.web.app",
      "https://hp-kal.firebaseapp.com",
      "http://localhost:5173"
    ],
    "method": ["GET","HEAD","POST","PUT","DELETE","OPTIONS"],
    "responseHeader": ["Authorization","Content-Type","x-goog-meta-*","x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
```

**의미**:
- **origin**: 허용할 도메인 목록
- **method**: 허용할 HTTP 메서드
- **responseHeader**: 허용할 응답 헤더
- **maxAgeSeconds**: 브라우저 캐시 시간 (1시간)

---

## 2. 왜 CORS 설정이 필요한가

### 문제 상황

**CORS 설정 없이 이미지 업로드 시**:
```
❌ Access to fetch at 'https://storage.googleapis.com/...' 
from origin 'https://hp-kal.web.app' has been blocked by CORS policy
```

### 영향을 받는 기능

- ✅ **메뉴 이미지 업로드** (관리자 페이지)
- ✅ **리뷰 사진 업로드** (고객 앱)
- ✅ **이미지 다운로드** (Storage에서 직접 로드)

### CORS 설정 후

```
✅ https://hp-kal.web.app → Storage 업로드 성공
✅ https://hp-kal.firebaseapp.com → Storage 업로드 성공
✅ http://localhost:5173 → Storage 업로드 성공 (개발 환경)
```

---

## 3. 설정 방법 A: Google Cloud Console (권장)

### ⚠️ 중요: 권한 필요

CORS 설정을 변경하려면 **프로젝트 소유자** 또는 **Storage 관리자** 권한이 필요합니다.

### 단계별 가이드

#### Step 1: Google Cloud Console 접속

1. 브라우저에서 접속: https://console.cloud.google.com
2. Google 계정으로 로그인
3. 프로젝트 선택: **hp-kal**

**확인**:
```
상단 프로젝트 드롭다운에 "hp-kal" 표시
```

---

#### Step 2: Cloud Storage 페이지로 이동

**방법 1: 검색 사용**
1. 상단 검색창에 "Storage" 입력
2. "Cloud Storage" > "버킷" 선택

**방법 2: 메뉴 사용**
1. 왼쪽 메뉴 (≡) 클릭
2. "Cloud Storage" > "버킷" 선택

**직접 링크**:
```
https://console.cloud.google.com/storage/browser?project=hp-kal
```

---

#### Step 3: 버킷 선택

1. 버킷 목록에서 **hp-kal.appspot.com** 클릭

**확인**:
```
버킷 이름: hp-kal.appspot.com
위치: asia-northeast3 (서울)
```

---

#### Step 4: CORS 설정 페이지로 이동

1. 버킷 상세 페이지에서 상단 탭 중 **"구성"** (Configuration) 클릭
2. 아래로 스크롤하여 **"CORS 구성"** 섹션 찾기
3. "CORS 구성 수정" 또는 "Edit CORS configuration" 버튼 클릭

**또는 직접 링크**:
```
https://console.cloud.google.com/storage/browser/hp-kal.appspot.com;tab=cors?project=hp-kal
```

---

#### Step 5: CORS 설정 입력

1. **텍스트 에디터**가 열림 (JSON 형식)
2. 기존 내용을 **모두 삭제**
3. 아래 JSON을 **복사하여 붙여넣기**:

```json
[
  {
    "origin": [
      "https://hp-kal.web.app",
      "https://hp-kal.firebaseapp.com",
      "http://localhost:5173"
    ],
    "method": ["GET","HEAD","POST","PUT","DELETE","OPTIONS"],
    "responseHeader": ["Authorization","Content-Type","x-goog-meta-*","x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
```

4. **저장** 버튼 클릭

---

#### Step 6: 설정 확인

**성공 메시지**:
```
✅ CORS configuration updated successfully
또는
✅ CORS 구성이 성공적으로 업데이트되었습니다
```

**반영 시간**: 즉시 (일부 경우 최대 1분 소요)

---

### 스크린샷 가이드 (텍스트)

```
┌─────────────────────────────────────────────────┐
│ Google Cloud Console                            │
│ ┌─────────────────────────────────────────────┐ │
│ │ 프로젝트: hp-kal                  🔍 검색    │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ≡ Cloud Storage > 버킷                          │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ 버킷 이름              위치        크기      │ │
│ │ hp-kal.appspot.com   서울       10 GB      │ │ ← 클릭
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ [객체] [구성] [권한] [수명주기] [로깅]          │
│         ↑ 클릭                                  │
│                                                 │
│ CORS 구성                                       │
│ ┌─────────────────────────────────────────────┐ │
│ │ [CORS 구성 수정]  ← 클릭                    │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ JSON 에디터                                  │ │
│ │ [                                            │ │
│ │   {                                          │ │
│ │     "origin": [...],                         │ │
│ │     "method": [...],                         │ │
│ │     ...                                      │ │
│ │   }                                          │ │
│ │ ]                                            │ │
│ │                                              │ │
│ │ [취소] [저장]  ← 저장 클릭                   │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 4. 설정 방법 B: gsutil 명령어

### 사전 요구사항

1. **Google Cloud SDK 설치**
2. **gcloud 인증**
3. **프로젝트 권한**

### 설치 및 설정

#### 1. Google Cloud SDK 설치

**Mac (Homebrew)**:
```bash
brew install google-cloud-sdk
```

**Windows**:
```bash
# Installer 다운로드
# https://cloud.google.com/sdk/docs/install
```

**Linux**:
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

---

#### 2. 인증 및 프로젝트 설정

```bash
# Google 계정 인증
gcloud auth login

# 프로젝트 설정
gcloud config set project hp-kal

# 애플리케이션 기본 인증 설정 (gsutil 사용)
gcloud auth application-default login
```

**확인**:
```bash
gcloud config get-value project
# 출력: hp-kal
```

---

#### 3. CORS 설정 적용

```bash
# 프로젝트 루트에서 실행
gsutil cors set cors.json gs://hp-kal.appspot.com
```

**성공 메시지**:
```
Setting CORS on gs://hp-kal.appspot.com/...
```

---

#### 4. CORS 설정 확인

```bash
gsutil cors get gs://hp-kal.appspot.com
```

**출력 예시**:
```json
[
  {
    "origin": [
      "https://hp-kal.web.app",
      "https://hp-kal.firebaseapp.com",
      "http://localhost:5173"
    ],
    "method": ["GET","HEAD","POST","PUT","DELETE","OPTIONS"],
    "responseHeader": ["Authorization","Content-Type","x-goog-meta-*","x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
```

---

### 스크립트 자동화

**파일 생성**: `/scripts/apply-cors.sh`

```bash
#!/bin/bash

###############################################################################
# Firebase Storage CORS 설정 스크립트
# 프로젝트: hp-kal
###############################################################################

set -e

echo "======================================"
echo "Firebase Storage CORS 설정"
echo "======================================"
echo ""

# 프로젝트 확인
echo "🔍 현재 프로젝트 확인..."
current_project=$(gcloud config get-value project)
echo "현재 프로젝트: $current_project"
echo ""

if [ "$current_project" != "hp-kal" ]; then
  echo "❌ 프로젝트가 hp-kal이 아닙니다."
  echo "다음 명령어로 프로젝트를 설정하세요:"
  echo "  gcloud config set project hp-kal"
  exit 1
fi

# CORS 파일 확인
if [ ! -f "cors.json" ]; then
  echo "❌ cors.json 파일을 찾을 수 없습니다."
  echo "프로젝트 루트에서 실행하세요."
  exit 1
fi

echo "📄 CORS 설정 파일:"
cat cors.json
echo ""

read -p "이 설정을 적용하시겠습니까? (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
  echo "취소되었습니다."
  exit 0
fi

echo ""
echo "🚀 CORS 설정 적용 중..."
gsutil cors set cors.json gs://hp-kal.appspot.com

echo ""
echo "✅ CORS 설정이 완료되었습니다!"
echo ""

echo "🔍 현재 CORS 설정 확인:"
gsutil cors get gs://hp-kal.appspot.com

echo ""
echo "======================================"
echo "✨ CORS 설정 완료!"
echo "======================================"
```

**실행 방법**:
```bash
chmod +x scripts/apply-cors.sh
./scripts/apply-cors.sh
```

---

## 5. CORS 설정 확인

### 방법 1: Google Cloud Console

1. Storage > 버킷 > hp-kal.appspot.com
2. 구성 탭
3. CORS 구성 섹션 확인

---

### 방법 2: gsutil 명령어

```bash
gsutil cors get gs://hp-kal.appspot.com
```

---

### 방법 3: 웹 앱에서 테스트

#### 메뉴 이미지 업로드 테스트

**위치**: 관리자 페이지 > 메뉴 관리

1. 이미지 선택
2. 업로드 버튼 클릭
3. 성공 메시지 확인

**성공**:
```
✅ 이미지 업로드 성공
✅ Storage URL: https://storage.googleapis.com/hp-kal.appspot.com/menus/...
```

**실패 (CORS 설정 없음)**:
```
❌ CORS policy: No 'Access-Control-Allow-Origin' header
```

---

#### 리뷰 사진 업로드 테스트

**위치**: 고객 앱 > 리뷰 작성

1. 사진 추가
2. 리뷰 제출
3. 성공 확인

---

### 방법 4: 브라우저 개발자 도구

**Chrome DevTools**:

1. F12 또는 우클릭 > 검사
2. **Network** 탭
3. 이미지 업로드 실행
4. Storage 요청 확인

**성공 시**:
```
Request URL: https://storage.googleapis.com/hp-kal.appspot.com/...
Status Code: 200 OK
Response Headers:
  access-control-allow-origin: https://hp-kal.web.app
  access-control-allow-methods: GET, HEAD, POST, PUT, DELETE, OPTIONS
```

**실패 시**:
```
Status Code: (failed) CORS error
Console Error: Access to fetch blocked by CORS policy
```

---

## 6. 트러블슈팅

### 문제 1: 권한 없음

**에러**:
```
❌ AccessDeniedException: 403 ... does not have storage.buckets.update access
```

**원인**: 프로젝트 소유자 또는 Storage 관리자 권한 없음

**해결**:
1. 프로젝트 소유자에게 권한 요청
2. IAM & Admin에서 역할 부여
   - 역할: "Storage Admin" 또는 "Owner"

---

### 문제 2: CORS 설정 후에도 에러

**원인**: 브라우저 캐시

**해결**:
```bash
# 1. 브라우저 캐시 삭제
Ctrl+Shift+Delete (Chrome)

# 2. 시크릿 모드에서 테스트
Ctrl+Shift+N (Chrome)

# 3. 하드 새로고침
Ctrl+Shift+R (Chrome)
```

---

### 문제 3: gsutil 명령어 실패

**에러**:
```
❌ gsutil: command not found
```

**해결**:
```bash
# Google Cloud SDK 설치
brew install google-cloud-sdk  # Mac
# 또는 공식 installer 사용
```

**에러**:
```
❌ You do not currently have an active account selected
```

**해결**:
```bash
gcloud auth login
gcloud auth application-default login
```

---

### 문제 4: 잘못된 버킷 이름

**에러**:
```
❌ BucketNotFoundException: 404 gs://hp-kal.appspot.com bucket does not exist
```

**확인**:
```bash
# 버킷 목록 확인
gsutil ls

# 출력 예시:
# gs://hp-kal.appspot.com/
```

---

### 문제 5: JSON 형식 오류

**에러**:
```
❌ Invalid JSON in CORS configuration
```

**해결**:
```bash
# JSON 형식 검증
cat cors.json | python -m json.tool

# 또는 온라인 JSON validator 사용
# https://jsonlint.com
```

---

## 7. CORS 설정 변경 시나리오

### 시나리오 1: 새 도메인 추가

**예시**: 커스텀 도메인 `https://shinkal.co.kr` 추가

**수정된 cors.json**:
```json
[
  {
    "origin": [
      "https://hp-kal.web.app",
      "https://hp-kal.firebaseapp.com",
      "https://shinkal.co.kr",
      "http://localhost:5173"
    ],
    "method": ["GET","HEAD","POST","PUT","DELETE","OPTIONS"],
    "responseHeader": ["Authorization","Content-Type","x-goog-meta-*","x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
```

**재적용**:
```bash
gsutil cors set cors.json gs://hp-kal.appspot.com
```

---

### 시나리오 2: 개발 포트 변경

**예시**: localhost:3000으로 변경

```json
{
  "origin": [
    "https://hp-kal.web.app",
    "https://hp-kal.firebaseapp.com",
    "http://localhost:3000"  // 5173 → 3000
  ],
  ...
}
```

---

### 시나리오 3: 모든 오리진 허용 (개발 환경만)

**⚠️ 주의**: 프로덕션에서는 사용 금지!

```json
{
  "origin": ["*"],  // 모든 도메인 허용
  "method": ["GET","HEAD","POST","PUT","DELETE","OPTIONS"],
  "responseHeader": ["Authorization","Content-Type","x-goog-meta-*","x-goog-resumable"],
  "maxAgeSeconds": 3600
}
```

---

## 8. 체크리스트

### CORS 설정 전
- [ ] Google Cloud SDK 설치 (gsutil 사용 시)
- [ ] 프로젝트 권한 확인 (Storage Admin 이상)
- [ ] cors.json 파일 준비
- [ ] 버킷 이름 확인 (hp-kal.appspot.com)

### CORS 설정 중
- [ ] Google Cloud Console 로그인
- [ ] 프로젝트 hp-kal 선택
- [ ] Storage > 버킷 > hp-kal.appspot.com 선택
- [ ] 구성 > CORS 구성 수정
- [ ] cors.json 내용 붙여넣기
- [ ] 저장

### CORS 설정 후
- [ ] 설정 확인 (gsutil cors get)
- [ ] 웹 앱에서 이미지 업로드 테스트
- [ ] 브라우저 개발자 도구에서 CORS 헤더 확인
- [ ] 문서 업데이트

---

## 9. 요약

### 핵심 명령어

```bash
# CORS 설정 적용
gsutil cors set cors.json gs://hp-kal.appspot.com

# CORS 설정 확인
gsutil cors get gs://hp-kal.appspot.com

# 버킷 목록 확인
gsutil ls
```

### 주요 URL

- **Google Cloud Console**: https://console.cloud.google.com
- **Storage 버킷**: https://console.cloud.google.com/storage/browser?project=hp-kal
- **CORS 구성**: https://console.cloud.google.com/storage/browser/hp-kal.appspot.com;tab=cors?project=hp-kal

### 도움말

- **Google Cloud SDK 문서**: https://cloud.google.com/sdk/docs
- **gsutil CORS 문서**: https://cloud.google.com/storage/docs/configuring-cors
- **Firebase Storage CORS**: https://firebase.google.com/docs/storage/web/download-files#cors_configuration

---

**작성자**: 개발팀  
**최종 업데이트**: 2025-10-29  
**버전**: 1.0
