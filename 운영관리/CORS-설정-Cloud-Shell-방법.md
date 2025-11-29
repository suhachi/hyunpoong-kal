# 🔥 Firebase Storage CORS 설정 - Cloud Shell 방법

**프로젝트**: 현풍닭칼국수 PWA  
**작성일**: 2025-01-20  
**방법**: Google Cloud Shell에서 gsutil 명령어 사용

---

## 🚀 Cloud Shell에서 CORS 설정하기

### Step 1: Cloud Shell 열기

1. **Google Cloud Console 접속**
   - https://console.cloud.google.com
   - 프로젝트 `hyun-poong` 선택

2. **Cloud Shell 열기**
   - 상단 메뉴 바 오른쪽에 있는 **Cloud Shell 아이콘** 클릭
   - 또는 `Ctrl + \` (Windows) / `Cmd + \` (Mac) 단축키 사용
   - Cloud Shell이 하단에 열립니다

---

### Step 2: CORS 설정 파일 준비

1. **CORS 설정 JSON 확인**
   - 프로젝트의 `src/cors.json` 파일 내용:

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

2. **Cloud Shell에서 파일 생성**
   - Cloud Shell에서 다음 명령어 실행:

```bash
cat > cors.json << 'EOF'
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
EOF
```

---

### Step 3: 프로젝트 확인

```bash
# 현재 프로젝트 확인
gcloud config get-value project

# 프로젝트가 hyun-poong이 아니면 설정
gcloud config set project hyun-poong
```

---

### Step 4: CORS 설정 적용

```bash
# CORS 설정 적용
gsutil cors set cors.json gs://hyun-poong.firebasestorage.app
```

**출력 예시**:
```
Setting CORS on gs://hyun-poong.firebasestorage.app/...
```

---

### Step 5: CORS 설정 확인

```bash
# CORS 설정 확인
gsutil cors get gs://hyun-poong.firebasestorage.app
```

**출력 예시**:
```json
[
  {
    "origin": [
      "https://hyun-poong.web.app",
      "https://hyun-poong.firebaseapp.com",
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    "method": [
      "GET",
      "HEAD",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS"
    ],
    "responseHeader": [
      "Authorization",
      "Content-Type",
      "x-goog-meta-*",
      "x-goog-resumable"
    ],
    "maxAgeSeconds": 3600
  }
]
```

---

## 📋 전체 명령어 (한 번에 실행)

Cloud Shell에서 다음 명령어들을 순서대로 실행하세요:

```bash
# 1. 프로젝트 확인 및 설정
gcloud config set project hyun-poong

# 2. CORS 설정 파일 생성
cat > cors.json << 'EOF'
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
EOF

# 3. CORS 설정 적용
gsutil cors set cors.json gs://hyun-poong.firebasestorage.app

# 4. 설정 확인
gsutil cors get gs://hyun-poong.firebasestorage.app
```

---

## ✅ 확인 방법

### 방법 1: 명령어로 확인

```bash
gsutil cors get gs://hyun-poong.firebasestorage.app
```

### 방법 2: 브라우저에서 테스트

1. 관리자 페이지 접속: `https://hyun-poong.web.app/admin/menus`
2. 메뉴 이미지 업로드 시도
3. 개발자 도구(F12) > Network 탭에서 CORS 에러 확인
4. CORS 에러가 없으면 성공!

---

## 🚨 문제 해결

### 문제 1: "gsutil: command not found"

**해결 방법**:
```bash
# Cloud Shell에서는 자동으로 설치되어 있어야 합니다
# 만약 없다면:
gcloud components install gsutil
```

### 문제 2: "AccessDeniedException: 403"

**해결 방법**:
- Storage 관리자 권한이 필요합니다
- 프로젝트 소유자에게 권한 요청

### 문제 3: "BucketNotFoundException"

**해결 방법**:
- 버킷 이름 확인: `gs://hyun-poong.firebasestorage.app`
- 또는: `gs://hyun-poong.appspot.com` (구버전)

---

## 📝 참고사항

### 버킷 이름 확인

Firebase Storage 버킷 이름을 확인하려면:

```bash
# 모든 버킷 목록 확인
gsutil ls

# 또는
gsutil ls -p hyun-poong
```

### CORS 설정 삭제

CORS 설정을 삭제하려면:

```bash
gsutil cors set [] gs://hyun-poong.firebasestorage.app
```

---

## 🎯 요약

1. ✅ Cloud Shell 열기
2. ✅ CORS 설정 파일 생성 (`cors.json`)
3. ✅ 프로젝트 확인 (`gcloud config set project hyun-poong`)
4. ✅ CORS 설정 적용 (`gsutil cors set cors.json gs://hyun-poong.firebasestorage.app`)
5. ✅ 설정 확인 (`gsutil cors get gs://hyun-poong.firebasestorage.app`)
6. ✅ 브라우저에서 이미지 업로드 테스트

---

**가이드 작성 완료** ✅


