# 🚨 CORS 에러 최종 해결 방안 v2

**작성일**: 2025-01-20  
**문제**: `hyun-poong.appspot.com` 버킷으로 요청이 가지만 버킷이 존재하지 않음

---

## 🔍 문제 분석

### 에러 메시지

```
Access to XMLHttpRequest at 
'https://firebasestorage.googleapis.com/v0/b/hyun-poong.appspot.com/o?name=...'
from origin 'https://hyun-poong.web.app'
has been blocked by CORS policy
```

### 현재 상황

- ✅ CORS 설정 완료: `gs://hyun-poong.firebasestorage.app`
- ❌ 요청 URL: `hyun-poong.appspot.com` (존재하지 않음)
- ❌ `gsutil ls` 결과: `hyun-poong.appspot.com` 버킷 없음

---

## 💡 원인

Firebase SDK가 내부적으로 `appspot.com` 형식의 버킷 이름을 사용하고 있지만, 실제 버킷은 `firebasestorage.app` 형식입니다.

**가능한 원인**:
1. Firebase SDK의 기본 버킷 이름이 `appspot.com` 형식
2. 환경 변수 설정이 잘못되었거나 Firebase가 자동으로 다른 버킷 이름을 사용
3. Firebase Console에서 기본 Storage 버킷이 `appspot.com` 형식으로 설정됨

---

## ✅ 해결 방법

### 방법 1: Firebase Console에서 Storage 기본 버킷 확인 및 변경

1. **Firebase Console 접속**
   - https://console.firebase.google.com/project/hyun-poong/storage

2. **Storage 설정 확인**
   - Storage > 설정
   - "기본 버킷" 또는 "Default bucket" 확인
   - 현재 설정이 `hyun-poong.appspot.com`인지 확인

3. **기본 버킷 변경 (필요시)**
   - 기본 버킷을 `hyun-poong.firebasestorage.app`로 변경
   - 또는 Firebase Console에서 `hyun-poong.appspot.com` 버킷 생성

### 방법 2: 환경 변수 확인 및 수정

`.env.local` 파일 확인:

```bash
# 현재 설정
VITE_FIREBASE_STORAGE_BUCKET=hyun-poong.firebasestorage.app
```

**만약 Firebase SDK가 `appspot.com` 형식을 사용한다면**:

```bash
# .env.local 파일 수정
VITE_FIREBASE_STORAGE_BUCKET=hyun-poong.appspot.com
```

하지만 이 버킷이 존재하지 않으므로, **Firebase Console에서 버킷을 생성**하거나 **기본 버킷을 변경**해야 합니다.

### 방법 3: Firebase Console에서 `appspot.com` 버킷 생성

1. **Google Cloud Console 접속**
   - https://console.cloud.google.com/storage/browser?project=hyun-poong

2. **버킷 생성**
   - "버킷 만들기" 클릭
   - 버킷 이름: `hyun-poong.appspot.com`
   - 위치: `asia-northeast3` (서울)
   - 스토리지 클래스: `Standard`

3. **CORS 설정 적용**
   ```bash
   gsutil cors set cors.json gs://hyun-poong.appspot.com
   ```

### 방법 4: Firebase SDK 초기화 시 버킷 이름 명시

`src/lib/firebase.ts` 파일 수정:

```typescript
import { getStorage } from "firebase/storage";

// 기존 코드
export const storage = getStorage(app);

// 수정: 명시적으로 버킷 이름 지정
export const storage = getStorage(app, "gs://hyun-poong.firebasestorage.app");
```

이렇게 하면 Firebase SDK가 항상 `firebasestorage.app` 버킷을 사용합니다.

---

## 🧪 테스트 방법

### 1. 브라우저 콘솔에서 Firebase Storage 버킷 확인

```javascript
// 브라우저 콘솔에서 실행
import { storage } from './lib/firebase';
console.log("Storage Bucket:", storage.app.options.storageBucket);
```

### 2. Firebase Console에서 확인

1. Firebase Console > Storage
2. 기본 버킷 이름 확인
3. 실제 사용 중인 버킷 확인

### 3. 환경 변수 확인

```bash
# 로컬에서
cat .env.local | grep STORAGE_BUCKET
```

---

## 📝 권장 해결 순서

### 1단계: Firebase Console 확인 (가장 중요)

1. Firebase Console 접속
2. Storage > 설정에서 기본 버킷 확인
3. 기본 버킷이 `appspot.com` 형식인지 확인

### 2단계: 해결 방법 선택

**옵션 A**: Firebase Console에서 기본 버킷을 `firebasestorage.app`로 변경
- 가장 간단한 방법
- Firebase Console에서 설정 변경

**옵션 B**: `appspot.com` 버킷 생성 및 CORS 설정
- Google Cloud Console에서 버킷 생성
- CORS 설정 적용

**옵션 C**: Firebase SDK 코드 수정
- `src/lib/firebase.ts`에서 명시적으로 버킷 이름 지정
- 재빌드 및 재배포 필요

### 3단계: 테스트

1. 브라우저 캐시 삭제
2. 이미지 업로드 테스트
3. CORS 에러 확인

---

## 🚨 중요 참고사항

### Firebase Storage 버킷 이름 규칙

Firebase 프로젝트는 다음 중 하나의 버킷 이름 형식을 사용합니다:

1. **신버전**: `{project-id}.firebasestorage.app` ← 현재 존재하는 버킷
2. **구버전**: `{project-id}.appspot.com` ← 존재하지 않음, 하지만 SDK가 사용 시도

### 해결책

가장 확실한 방법은 **Firebase Console에서 기본 Storage 버킷을 확인하고, 필요시 변경**하는 것입니다.

---

## ✅ 다음 단계

1. ⏳ **Firebase Console에서 Storage 기본 버킷 확인** ← **지금 해야 할 일**
2. ⏳ 기본 버킷 변경 또는 `appspot.com` 버킷 생성
3. ⏳ CORS 설정 적용 (필요시)
4. ⏳ 재빌드 및 재배포 (코드 수정 시)
5. ⏳ 이미지 업로드 테스트

---

**중요**: Firebase Console에서 Storage 기본 버킷을 확인하는 것이 가장 중요합니다!





