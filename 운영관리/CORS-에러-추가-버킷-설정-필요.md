# 🚨 CORS 에러 - 추가 버킷 설정 필요

**작성일**: 2025-01-20  
**문제**: `hyun-poong.appspot.com` 버킷에도 CORS 설정 필요

---

## 🔍 문제 분석

### 에러 메시지

```
Access to XMLHttpRequest at 
'https://firebasestorage.googleapis.com/v0/b/hyun-poong.appspot.com/o?name=...' 
from origin 'https://hyun-poong.web.app' 
has been blocked by CORS policy
```

### 원인

- ✅ CORS 설정 적용됨: `gs://hyun-poong.firebasestorage.app`
- ❌ CORS 설정 누락: `gs://hyun-poong.appspot.com` ← **이 버킷에도 설정 필요!**

### 현재 상태

| 버킷 이름 | CORS 설정 | 상태 |
|---------|---------|------|
| `hyun-poong.firebasestorage.app` | ✅ 적용됨 | 정상 |
| `hyun-poong.appspot.com` | ❌ 미적용 | **에러 발생** |

---

## ✅ 해결 방법

### Cloud Shell에서 두 버킷 모두에 CORS 설정 적용

```bash
# 1. 프로젝트 확인
gcloud config set project hyun-poong

# 2. CORS 설정 파일 생성 (이미 있다면 생략)
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

# 3. 첫 번째 버킷에 CORS 설정 (이미 적용됨)
gsutil cors set cors.json gs://hyun-poong.firebasestorage.app

# 4. 두 번째 버킷에 CORS 설정 (추가 필요!)
gsutil cors set cors.json gs://hyun-poong.appspot.com

# 5. 두 버킷 모두 확인
gsutil cors get gs://hyun-poong.firebasestorage.app
gsutil cors get gs://hyun-poong.appspot.com
```

---

## 🎯 빠른 해결 (한 줄 명령어)

Cloud Shell에서 다음 명령어만 실행하세요:

```bash
# CORS 설정 파일이 이미 있다면
gsutil cors set cors.json gs://hyun-poong.appspot.com
```

---

## 📝 확인 방법

### 1. 명령어로 확인

```bash
# 두 버킷 모두 확인
gsutil cors get gs://hyun-poong.firebasestorage.app
gsutil cors get gs://hyun-poong.appspot.com
```

### 2. 브라우저에서 테스트

1. 관리자 페이지 접속: `https://hyun-poong.web.app/admin/menus`
2. 메뉴 이미지 업로드 시도
3. 개발자 도구(F12) > Network 탭에서 CORS 에러 확인
4. **CORS 에러가 없어야 합니다** ✅

---

## 🔍 버킷 확인 방법

Firebase 프로젝트에서 사용 중인 모든 버킷 확인:

```bash
# 모든 버킷 목록 확인
gsutil ls -p hyun-poong

# 또는
gsutil ls
```

---

## 📋 참고사항

### Firebase Storage 버킷 이름

Firebase 프로젝트는 보통 두 가지 버킷 이름 형식을 사용합니다:

1. **구버전**: `{project-id}.appspot.com`
2. **신버전**: `{project-id}.firebasestorage.app`

두 버킷이 모두 존재할 수 있으므로, **둘 다에 CORS 설정을 적용**해야 합니다.

---

## ✅ 완료 체크리스트

- [x] `hyun-poong.firebasestorage.app` 버킷 CORS 설정 완료
- [ ] `hyun-poong.appspot.com` 버킷 CORS 설정 필요 ← **지금 해야 할 일**
- [ ] 이미지 업로드 테스트
- [ ] CORS 에러 해결 확인

---

**중요**: `hyun-poong.appspot.com` 버킷에도 CORS 설정을 적용해야 합니다!





