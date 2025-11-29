# 🔍 CORS 버킷 확인 필요

**작성일**: 2025-01-20  
**문제**: `hyun-poong.appspot.com` 버킷이 존재하지 않음

---

## 🚨 문제 상황

```bash
gsutil cors set cors.json gs://hyun-poong.appspot.com
# NotFoundException: 404 The specified bucket does not exist.
```

**원인**: `hyun-poong.appspot.com` 버킷이 실제로 존재하지 않습니다.

---

## ✅ 해결 방법

### Step 1: 실제 버킷 목록 확인

Cloud Shell에서 다음 명령어로 실제 존재하는 버킷을 확인하세요:

```bash
# 모든 버킷 목록 확인
gsutil ls

# 또는 프로젝트별 확인
gsutil ls -p hyun-poong
```

### Step 2: Firebase Storage 버킷 확인

Firebase Console에서 확인:
1. Firebase Console 접속: https://console.firebase.google.com/project/hyun-poong/storage
2. Storage 페이지에서 실제 버킷 이름 확인

### Step 3: 환경 변수 확인

프로젝트의 `.env.local` 파일에서 실제 사용 중인 버킷 이름 확인:

```bash
# 로컬에서 확인
cat .env.local | grep STORAGE_BUCKET
```

현재 설정: `VITE_FIREBASE_STORAGE_BUCKET=hyun-poong.firebasestorage.app`

---

## 🔍 가능한 원인

### 1. Firebase Storage 버킷 이름 형식

Firebase 프로젝트는 다음 중 하나의 버킷 이름 형식을 사용합니다:

- ✅ `{project-id}.firebasestorage.app` (신버전) ← 현재 사용 중
- ❌ `{project-id}.appspot.com` (구버전) ← 존재하지 않음

### 2. Firebase SDK 내부 동작

Firebase SDK가 내부적으로 `appspot.com` 도메인을 사용할 수 있지만, 실제 버킷은 `firebasestorage.app` 형식일 수 있습니다.

### 3. 환경 변수 불일치

에러 메시지에서 `hyun-poong.appspot.com`으로 요청이 가는 것은:
- Firebase SDK가 내부적으로 다른 버킷 이름을 사용하고 있거나
- 환경 변수가 잘못 설정되어 있을 수 있습니다

---

## ✅ 해결 방법

### 방법 1: 실제 버킷에만 CORS 설정 (권장)

```bash
# 실제 존재하는 버킷에만 CORS 설정
gsutil cors set cors.json gs://hyun-poong.firebasestorage.app

# 확인
gsutil cors get gs://hyun-poong.firebasestorage.app
```

### 방법 2: 환경 변수 확인 및 수정

`.env.local` 파일에서 실제 사용 중인 버킷 이름 확인:

```bash
# 현재 설정 확인
VITE_FIREBASE_STORAGE_BUCKET=hyun-poong.firebasestorage.app
```

만약 다른 버킷을 사용해야 한다면:
1. Firebase Console에서 실제 버킷 이름 확인
2. `.env.local` 파일 수정
3. 재빌드 및 재배포

### 방법 3: Firebase Storage 설정 확인

Firebase Console에서:
1. Storage > 설정
2. 기본 버킷 이름 확인
3. 실제 사용 중인 버킷 이름 확인

---

## 🧪 테스트 방법

### 1. 버킷 목록 확인

```bash
# Cloud Shell에서
gsutil ls
```

### 2. CORS 설정 확인

```bash
# 현재 CORS 설정 확인
gsutil cors get gs://hyun-poong.firebasestorage.app
```

### 3. 브라우저에서 테스트

1. 관리자 페이지 접속
2. 이미지 업로드 시도
3. 개발자 도구 > Network 탭에서 실제 요청 URL 확인
4. 어떤 버킷으로 요청이 가는지 확인

---

## 📝 다음 단계

1. ✅ `gsutil ls` 명령어로 실제 버킷 목록 확인
2. ✅ Firebase Console에서 Storage 버킷 확인
3. ✅ 실제 사용 중인 버킷에만 CORS 설정 적용
4. ✅ 이미지 업로드 테스트

---

**중요**: 실제 존재하는 버킷에만 CORS 설정을 적용하세요!


