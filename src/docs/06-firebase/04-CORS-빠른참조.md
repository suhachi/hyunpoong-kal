# Firebase Storage CORS 빠른 참조

**프로젝트**: hp-kal  
**목적**: CORS 설정 빠른 적용

---

## ⚡ 빠른 시작 (3분)

### 방법 1: 자동 스크립트 (권장)

```bash
# 1. 스크립트 실행 권한 부여
chmod +x scripts/apply-cors.sh

# 2. 스크립트 실행
./scripts/apply-cors.sh

# 3. 안내에 따라 진행
```

**필요한 것**:
- ✅ Google Cloud SDK 설치
- ✅ hp-kal 프로젝트 권한

---

### 방법 2: 수동 명령어 (1분)

```bash
# 1. 프로젝트 설정
gcloud config set project hp-kal

# 2. CORS 적용
gsutil cors set cors.json gs://hp-kal.appspot.com

# 3. 확인
gsutil cors get gs://hp-kal.appspot.com
```

---

### 방법 3: Google Cloud Console (5분)

1. https://console.cloud.google.com 접속
2. 프로젝트 선택: **hp-kal**
3. Cloud Storage > 버킷 > **hp-kal.appspot.com**
4. **구성** 탭 > **CORS 구성 수정**
5. 아래 JSON 붙여넣기:

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

6. **저장**

---

## 🔍 확인 방법

### 터미널에서 확인
```bash
gsutil cors get gs://hp-kal.appspot.com
```

### 웹에서 확인
1. 관리자 페이지 > 메뉴 관리
2. 이미지 업로드 테스트
3. ✅ 성공하면 CORS 적용 완료!

---

## ❌ 문제 해결

### "gcloud: command not found"
```bash
# Mac
brew install google-cloud-sdk

# 또는
# https://cloud.google.com/sdk/docs/install
```

### "AccessDeniedException: 403"
- 프로젝트 소유자에게 권한 요청
- 필요한 역할: **Storage Admin**

### "CORS error still occurs"
- 브라우저 캐시 삭제: Ctrl+Shift+Delete
- 시크릿 모드에서 테스트

---

## 📞 도움말

**상세 가이드**: `/docs/06-firebase/03-CORS-설정-가이드.md`  
**Firebase 문서**: `/docs/06-firebase/README.md`

---

**작성**: 2025-10-29
