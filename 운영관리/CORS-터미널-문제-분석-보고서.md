# 🔍 CORS 스크립트 실행 문제 분석 보고서

**분석 일시**: 2025-01-20  
**문제**: `npm run cors:apply` 실행 시 "User project specified in the request is invalid" 에러 발생

---

## 📊 현재 상태

### 1. 에러 메시지

```
❌ CORS 설정 적용 실패:
에러 메시지: User project specified in the request is invalid.
에러 코드: 400
```

### 2. gcloud 설정 상태

**프로젝트 설정**: ✅ 정상
```
프로젝트 ID: hyun-poong
계정: jsbae59@gmail.com
```

**인증 상태**: ✅ 정상
```
ACTIVE: *
ACCOUNT: jsbae59@gmail.com
```

---

## 🔍 문제 원인 분석

### 원인 1: Application Default Credentials (ADC) 미설정

**문제**:
- `gcloud auth list`는 gcloud CLI 인증만 확인
- Google Cloud Storage SDK는 **Application Default Credentials (ADC)**를 사용
- ADC가 설정되지 않으면 "User project specified in the request is invalid" 에러 발생

**확인 방법**:
```bash
gcloud auth application-default print-access-token
```

**해결 방법**:
```bash
gcloud auth application-default login
```

### 원인 2: 버킷 소유 프로젝트와 요청 프로젝트 불일치

**가능성**:
- 버킷 `hyun-poong.firebasestorage.app`이 다른 프로젝트에 속해 있을 수 있음
- 또는 버킷이 실제로 존재하지 않을 수 있음

**확인 방법**:
```bash
gsutil ls gs://hyun-poong.firebasestorage.app
```

---

## 💡 해결 방안

### 즉시 조치 (필수)

#### 1단계: Application Default Credentials 설정

```bash
gcloud auth application-default login
```

**설명**:
- Google Cloud Storage SDK가 사용하는 인증 방식
- 브라우저에서 Google 계정 로그인 필요
- 로컬 개발 환경에서 한 번만 실행하면 됨

#### 2단계: 버킷 존재 확인

```bash
gsutil ls gs://hyun-poong.firebasestorage.app
```

**예상 결과**:
- 버킷이 존재하면: 파일 목록 또는 빈 목록 표시
- 버킷이 없으면: "BucketNotFoundException" 에러

#### 3단계: 버킷 소유 프로젝트 확인

```bash
gsutil ls -L -b gs://hyun-poong.firebasestorage.app
```

**확인 항목**:
- 버킷의 실제 소유 프로젝트 ID
- 현재 gcloud 프로젝트와 일치하는지 확인

---

## 🔧 추가 확인 사항

### Firebase Console에서 확인

1. Firebase Console 접속: https://console.firebase.google.com/
2. 프로젝트 선택: `hyun-poong`
3. Storage 메뉴 접속
4. 버킷 이름 확인:
   - `hyun-poong.firebasestorage.app` 버킷이 있는지 확인
   - 또는 `hyun-poong.appspot.com` 버킷이 있는지 확인

### Google Cloud Console에서 확인

1. Google Cloud Console 접속: https://console.cloud.google.com/
2. 프로젝트 선택: `hyun-poong`
3. Storage > Buckets 메뉴 접속
4. 버킷 목록 확인:
   - 실제 버킷 이름 확인
   - 버킷의 프로젝트 ID 확인

---

## 📋 체크리스트

### 실행 전 확인

- [x] `gcloud config get-value project` → `hyun-poong` 확인
- [x] `gcloud auth list` → 활성 계정 확인
- [ ] `gcloud auth application-default print-access-token` → 토큰 출력 확인 (실패 시 ADC 미설정)
- [ ] `gsutil ls gs://hyun-poong.firebasestorage.app` → 버킷 존재 확인

### 해결 후 확인

- [ ] `gcloud auth application-default login` 실행 완료
- [ ] `npm run cors:apply` 실행 성공
- [ ] `gsutil cors get gs://hyun-poong.firebasestorage.app` → CORS 설정 확인

---

## 🚨 예상되는 추가 문제

### 문제 1: 버킷이 다른 프로젝트에 속한 경우

**증상**:
- `gsutil ls`는 성공하지만 CORS 설정 실패
- "Permission denied" 또는 "Bucket not found" 에러

**해결**:
- Firebase Console에서 버킷의 실제 프로젝트 확인
- 해당 프로젝트로 전환: `gcloud config set project {실제-프로젝트-ID}`

### 문제 2: 버킷이 존재하지 않는 경우

**증상**:
- `gsutil ls` 실패
- "BucketNotFoundException" 에러

**해결**:
- Firebase Console > Storage에서 버킷 생성
- 또는 Firebase Console에서 Storage 활성화

### 문제 3: 권한 부족

**증상**:
- `gsutil cors set` 실행 시 "Permission denied" 에러

**해결**:
- Google Cloud Console > IAM에서 Storage Admin 권한 확인
- 또는 프로젝트 Owner 권한 확인

---

## ✅ 다음 단계

1. **즉시 실행**:
   ```bash
   gcloud auth application-default login
   ```

2. **버킷 확인**:
   ```bash
   gsutil ls gs://hyun-poong.firebasestorage.app
   ```

3. **CORS 스크립트 재실행**:
   ```bash
   npm run cors:apply
   ```

4. **CORS 설정 확인**:
   ```bash
   gsutil cors get gs://hyun-poong.firebasestorage.app
   ```

---

**작성일**: 2025-01-20  
**상태**: 🔴 **즉시 조치 필요** (Application Default Credentials 설정)

