# ✅ CORS 최종 해결 방안

**작성일**: 2025-01-20  
**상황**: `hyun-poong.appspot.com` 버킷은 존재하지 않음

---

## 📊 현재 상황

### 실제 존재하는 버킷

```bash
gsutil ls
```

**결과**:
- ✅ `gs://hyun-poong.firebasestorage.app/` ← **이 버킷만 존재**
- ❌ `gs://hyun-poong.appspot.com/` ← **존재하지 않음**

### 에러 메시지

```
Access to XMLHttpRequest at 
'https://firebasestorage.googleapis.com/v0/b/hyun-poong.appspot.com/o?name=...'
```

**문제**: 요청이 `hyun-poong.appspot.com`으로 가고 있지만, 이 버킷은 존재하지 않습니다.

---

## 🔍 원인 분석

### Firebase Storage 내부 동작

Firebase Storage는 때때로 내부적으로 `appspot.com` 도메인을 사용하여 요청을 처리합니다. 하지만 실제 버킷은 `firebasestorage.app` 형식일 수 있습니다.

### 가능한 원인

1. **Firebase SDK 내부 라우팅**
   - Firebase SDK가 내부적으로 `appspot.com` 도메인을 사용
   - 실제 버킷은 `firebasestorage.app` 형식

2. **환경 변수 불일치**
   - 환경 변수: `VITE_FIREBASE_STORAGE_BUCKET=hyun-poong.firebasestorage.app`
   - 하지만 Firebase SDK가 다른 버킷 이름을 사용할 수 있음

3. **CORS 설정 미적용**
   - `hyun-poong.firebasestorage.app`에 CORS 설정은 완료
   - 하지만 내부 라우팅으로 인해 다른 버킷으로 요청이 가고 있을 수 있음

---

## ✅ 해결 방법

### 방법 1: CORS 설정 재확인 및 재적용

```bash
# 1. 현재 CORS 설정 확인
gsutil cors get gs://hyun-poong.firebasestorage.app

# 2. CORS 설정이 올바른지 확인
# 다음 JSON이 출력되어야 합니다:
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

# 3. CORS 설정이 없다면 재적용
gsutil cors set cors.json gs://hyun-poong.firebasestorage.app
```

### 방법 2: Firebase Console에서 확인

1. **Firebase Console 접속**
   - https://console.firebase.google.com/project/hyun-poong/storage

2. **Storage 설정 확인**
   - Storage > 설정
   - 기본 버킷 이름 확인
   - 실제 사용 중인 버킷 이름 확인

3. **Google Cloud Console에서 확인**
   - https://console.cloud.google.com/storage/browser?project=hyun-poong
   - 버킷 목록에서 `hyun-poong.firebasestorage.app` 선택
   - 권한 탭에서 CORS 설정 확인

### 방법 3: 브라우저 캐시 삭제 및 재시도

1. **브라우저 캐시 삭제**
   - Ctrl+Shift+Delete (Windows) / Cmd+Shift+Delete (Mac)
   - 캐시 및 쿠키 삭제

2. **시크릿 모드에서 테스트**
   - 시크릿 모드에서 관리자 페이지 접속
   - 이미지 업로드 테스트

3. **CORS 설정 적용 대기**
   - CORS 설정 적용 후 최대 5-10분 정도 소요될 수 있습니다
   - 잠시 후 다시 시도

---

## 🧪 테스트 방법

### 1. CORS 설정 확인

```bash
# Cloud Shell에서
gsutil cors get gs://hyun-poong.firebasestorage.app
```

### 2. 브라우저에서 실제 요청 확인

1. 관리자 페이지 접속: `https://hyun-poong.web.app/admin/menus`
2. 개발자 도구(F12) > Network 탭 열기
3. 이미지 업로드 시도
4. **실제 요청 URL 확인**
   - 어떤 버킷으로 요청이 가는지 확인
   - `hyun-poong.appspot.com` 또는 `hyun-poong.firebasestorage.app`

### 3. Firebase SDK 초기화 확인

브라우저 콘솔에서:

```javascript
// Firebase Storage 버킷 확인
console.log(firebase.app().options.storageBucket);
```

---

## 📝 다음 단계

1. ✅ `gsutil cors get gs://hyun-poong.firebasestorage.app` - CORS 설정 확인
2. ✅ 브라우저에서 실제 요청 URL 확인
3. ✅ Firebase Console에서 Storage 설정 확인
4. ✅ 필요시 CORS 설정 재적용
5. ✅ 브라우저 캐시 삭제 후 재시도

---

## 🚨 중요 참고사항

### Firebase Storage 버킷 이름

- **실제 버킷**: `hyun-poong.firebasestorage.app` (존재함)
- **에러 메시지**: `hyun-poong.appspot.com` (존재하지 않음)

이것은 Firebase Storage의 내부 라우팅 때문일 수 있습니다. `hyun-poong.firebasestorage.app` 버킷에 CORS 설정이 올바르게 적용되어 있다면, 내부적으로 라우팅되어 정상 작동할 수 있습니다.

---

**다음**: `gsutil cors get gs://hyun-poong.firebasestorage.app` 명령어로 CORS 설정을 확인하세요!





