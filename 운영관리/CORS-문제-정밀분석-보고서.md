# 🔬 CORS 문제 정밀 분석 보고서

**작성일**: 2025-01-20  
**분석 범위**: Firebase Storage CORS 에러 근본 원인 파악  
**상태**: 🔴 **중요 발견 - 코드와 실제 동작 불일치**

---

## 📊 현재 코드 상태

### 1. Firebase 초기화 코드 (`src/lib/firebase.ts`)

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // 🔴 하드코딩된 버킷 이름
  storageBucket: "hyun-poong.firebasestorage.app", 
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);

// 🔴 명시적 버킷 지정
export const storage = getStorage(app, "gs://hyun-poong.firebasestorage.app");
```

**분석 결과**:
- ✅ `firebaseConfig.storageBucket`: `"hyun-poong.firebasestorage.app"` (하드코딩)
- ✅ `getStorage()` 두 번째 인자: `"gs://hyun-poong.firebasestorage.app"` (명시적 지정)
- ✅ 코드상으로는 올바르게 설정되어 있음

### 2. Storage 사용 코드 (`src/lib/storage.ts`)

```typescript
import { storage } from './firebase';  // ✅ firebase.ts에서 import
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadImageToStorage(file: File, path: string) {
  const storageRef = ref(storage, path);  // ✅ 명시적으로 지정된 storage 사용
  await uploadBytes(storageRef, file);
  // ...
}
```

**분석 결과**:
- ✅ `storage`는 `firebase.ts`에서 명시적으로 버킷을 지정한 인스턴스 사용
- ✅ 코드상으로는 올바르게 설정되어 있음

### 3. 환경 변수 설정 (`src/config/env.ts`)

```typescript
export const FIREBASE_CONFIG = {
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),  // ⚠️ 환경 변수 사용
  // ...
};
```

**분석 결과**:
- ⚠️ `env.ts`에서는 환경 변수를 사용하지만, `firebase.ts`에서는 하드코딩 사용
- ⚠️ 두 파일이 서로 다른 설정 소스를 사용 (불일치 가능성)

---

## 🔍 핵심 문제 발견

### 문제 1: Firebase SDK 내부 동작 불일치

**발견 사항**:
1. 코드에서는 `"hyun-poong.firebasestorage.app"` 버킷을 명시적으로 지정
2. 실제 에러 메시지에서는 `"hyun-poong.appspot.com"` 버킷으로 요청 발생
3. `hyun-poong.appspot.com` 버킷은 존재하지 않음

**가능한 원인**:

#### 원인 A: Firebase SDK의 내부 라우팅 문제

Firebase SDK가 내부적으로 다음과 같이 동작할 수 있음:

1. `initializeApp(firebaseConfig)`에서 `storageBucket`을 읽음
2. 하지만 내부적으로 `projectId`를 기반으로 `{projectId}.appspot.com` 형식을 생성
3. `getStorage(app, "gs://...")`로 명시적으로 지정해도, 내부적으로 다른 버킷을 사용할 수 있음

**증거**:
- 에러 메시지: `hyun-poong.appspot.com`으로 요청
- 코드 설정: `hyun-poong.firebasestorage.app`로 지정
- **불일치 발생**

#### 원인 B: 빌드 시점 환경 변수 오버라이드

**가능성**:
1. 빌드 시점에 환경 변수 `VITE_FIREBASE_STORAGE_BUCKET`이 다른 값으로 설정됨
2. 또는 Firebase Console의 기본 버킷 설정이 `appspot.com` 형식
3. 빌드된 코드에서 환경 변수 값을 사용하여 다른 버킷으로 요청

**확인 필요**:
- `.env.local` 파일의 실제 값
- Firebase Console의 기본 Storage 버킷 설정
- 빌드된 코드의 실제 버킷 이름

#### 원인 C: Firebase 프로젝트 설정 불일치

**가능성**:
1. Firebase Console에서 기본 Storage 버킷이 `appspot.com` 형식으로 설정됨
2. Firebase SDK가 프로젝트 설정을 우선적으로 사용
3. 코드에서 명시적으로 지정해도 프로젝트 설정이 우선됨

---

## 🎯 정밀 분석 결과

### 코드 레벨 분석

| 항목 | 코드 설정 | 실제 요청 | 상태 |
|------|----------|---------|------|
| `firebaseConfig.storageBucket` | `hyun-poong.firebasestorage.app` | - | ✅ |
| `getStorage()` 두 번째 인자 | `gs://hyun-poong.firebasestorage.app` | - | ✅ |
| 실제 HTTP 요청 버킷 | - | `hyun-poong.appspot.com` | ❌ **불일치** |

### 근본 원인 추정

**가장 가능성 높은 원인**: **Firebase SDK의 내부 동작 방식**

1. Firebase SDK는 `projectId`를 기반으로 기본 버킷 이름을 생성
2. 기본 버킷 이름 형식: `{projectId}.appspot.com`
3. `getStorage(app, "gs://...")`로 명시적으로 지정해도, 내부적으로는 프로젝트 설정을 우선 사용할 수 있음
4. 또는 Firebase Console의 기본 Storage 버킷 설정이 `appspot.com` 형식으로 되어 있음

---

## 🔬 추가 확인 필요 사항

### 1. Firebase Console 확인 (최우선)

**확인 위치**:
- Firebase Console > 프로젝트 설정 > 일반 탭
- Firebase Console > Storage > 설정

**확인 항목**:
- 기본 Storage 버킷 이름
- 버킷 이름 형식 (`appspot.com` vs `firebasestorage.app`)
- 프로젝트 ID와 버킷 이름의 관계

### 2. 환경 변수 파일 확인

**확인 위치**:
- `.env.local` (로컬 개발)
- `.env.production` (프로덕션 빌드)
- Firebase Hosting 환경 변수

**확인 항목**:
- `VITE_FIREBASE_STORAGE_BUCKET` 값
- 빌드 시점에 실제 사용된 값

### 3. 빌드된 코드 확인

**확인 방법**:
```bash
# 빌드된 JavaScript 파일에서 버킷 이름 검색
grep -r "appspot.com\|firebasestorage.app" dist/
```

**확인 항목**:
- 실제 빌드된 코드에서 사용하는 버킷 이름
- 환경 변수가 제대로 주입되었는지

### 4. 브라우저 콘솔 확인

**확인 방법**:
```javascript
// 브라우저 콘솔에서 실행
import { storage } from './lib/firebase';
console.log('Storage Bucket:', storage.app.options.storageBucket);
console.log('Storage App:', storage.app);
```

**확인 항목**:
- 런타임에 실제 사용되는 버킷 이름
- Firebase 앱 설정의 실제 값

---

## 💡 해결 방안 (우선순위)

### 방안 1: Firebase Console에서 기본 버킷 확인 및 변경 (최우선)

**작업**:
1. Firebase Console 접속
2. Storage > 설정에서 기본 버킷 확인
3. 기본 버킷이 `appspot.com` 형식이면 `firebasestorage.app` 형식으로 변경
4. 또는 Firebase Console에서 `hyun-poong.appspot.com` 버킷 생성

**예상 효과**: ⭐⭐⭐⭐⭐ (가장 확실한 해결책)

### 방안 2: 환경 변수 통일 및 하드코딩 제거

**작업**:
```typescript
// src/lib/firebase.ts 수정
const firebaseConfig = {
  // ...
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hyun-poong.firebasestorage.app",
  // ...
};

// 환경 변수 사용으로 통일
export const storage = getStorage(
  app, 
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET 
    ? `gs://${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}` 
    : "gs://hyun-poong.firebasestorage.app"
);
```

**예상 효과**: ⭐⭐⭐⭐ (코드 일관성 향상)

### 방안 3: `appspot.com` 버킷 생성 및 CORS 설정

**작업**:
1. Google Cloud Console에서 `hyun-poong.appspot.com` 버킷 생성
2. CORS 설정 적용:
   ```bash
   gsutil cors set cors.json gs://hyun-poong.appspot.com
   ```

**예상 효과**: ⭐⭐⭐ (임시 해결책, 근본 원인 미해결)

### 방안 4: Firebase SDK 버전 확인 및 업데이트

**작업**:
1. `package.json`에서 Firebase SDK 버전 확인
2. 최신 버전으로 업데이트
3. `firebasestorage.app` 형식 지원 여부 확인

**예상 효과**: ⭐⭐ (버전 문제일 가능성 낮음)

---

## 📋 즉시 확인 체크리스트

### Phase 1: Firebase Console 확인 (필수)

- [ ] Firebase Console > 프로젝트 설정 > 일반 탭 접속
- [ ] 기본 Storage 버킷 이름 확인
- [ ] 버킷 이름 형식 확인 (`appspot.com` vs `firebasestorage.app`)
- [ ] 기본 버킷이 `appspot.com` 형식이면 `firebasestorage.app`로 변경 시도

### Phase 2: 환경 변수 확인 (필수)

- [ ] `.env.local` 파일 확인
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` 값 확인
- [ ] 빌드 시점 환경 변수 확인 (Firebase Hosting 설정)

### Phase 3: 빌드된 코드 확인 (권장)

- [ ] `npm run build` 실행
- [ ] `dist/` 폴더에서 버킷 이름 검색
- [ ] 실제 빌드된 코드에서 사용하는 버킷 이름 확인

### Phase 4: 브라우저 런타임 확인 (권장)

- [ ] 개발 서버 실행 (`npm run dev`)
- [ ] 브라우저 콘솔에서 Storage 버킷 이름 확인
- [ ] 실제 런타임에 사용되는 버킷 이름 확인

---

## 🚨 중요 발견 사항

### 발견 1: 코드와 실제 동작 불일치

- **코드**: `hyun-poong.firebasestorage.app` 명시적 지정
- **실제 요청**: `hyun-poong.appspot.com`으로 발생
- **결론**: Firebase SDK 내부 동작 또는 프로젝트 설정이 코드를 오버라이드하고 있음

### 발견 2: 설정 소스 불일치

- **`firebase.ts`**: 하드코딩된 버킷 이름 사용
- **`env.ts`**: 환경 변수 사용
- **결론**: 두 파일이 서로 다른 설정 소스를 사용하여 불일치 가능성

### 발견 3: Firebase SDK 동작 방식 의심

- **가설**: Firebase SDK가 `projectId`를 기반으로 기본 버킷 이름을 생성
- **증거**: 에러 메시지에서 `{projectId}.appspot.com` 형식 사용
- **결론**: Firebase Console의 프로젝트 설정이 코드 설정을 오버라이드할 가능성

---

## ✅ 다음 단계

1. **즉시**: Firebase Console에서 기본 Storage 버킷 확인
2. **즉시**: 환경 변수 파일 확인
3. **권장**: 빌드된 코드에서 실제 버킷 이름 확인
4. **권장**: 브라우저 런타임에서 실제 버킷 이름 확인

---

## 📝 참고사항

- 이 문제는 **코드 레벨에서는 해결 불가능**할 수 있음
- Firebase Console의 프로젝트 설정이 근본 원인일 가능성이 높음
- `appspot.com` 버킷을 생성하는 것은 임시 해결책일 뿐, 근본 원인 해결 필요

---

**분석 완료일**: 2025-01-20  
**분석자**: AI Assistant  
**상태**: 🔴 **즉시 조치 필요**


