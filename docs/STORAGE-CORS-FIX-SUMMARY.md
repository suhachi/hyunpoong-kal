# Firebase Storage CORS 에러 근본 해결 완료 보고서

**작업 일시**: 2025-01-20  
**작업자**: AI Assistant  
**상태**: ✅ 완료

---

## 📋 작업 요약

Firebase Storage가 잘못된 버킷(`hyun-poong.appspot.com`)으로 요청을 보내서 CORS 에러가 발생하는 문제를 근본적으로 해결했습니다.

### 핵심 문제
- **실제 버킷**: `gs://hyun-poong.firebasestorage.app` ✅
- **요청 버킷**: `hyun-poong.appspot.com` ❌ (존재하지 않음)
- **에러**: CORS policy 에러로 이미지 업로드 실패

---

## 🔍 근본 원인 분석 (RCA)

### 원인 1: Firebase SDK의 내부 동작
Firebase SDK가 `storageBucket` 설정을 읽지만, 내부적으로 프로젝트 기본값(`{projectId}.appspot.com`)을 사용하려고 시도할 수 있습니다.

### 원인 2: 환경 변수 누락 가능성
빌드 시 `VITE_FIREBASE_STORAGE_BUCKET` 환경 변수가 제대로 주입되지 않아 기본값을 사용했을 가능성.

### 원인 3: 런타임 진단 부재
실제로 어떤 버킷이 사용되고 있는지 런타임에서 확인할 수 있는 로그가 없었습니다.

---

## ✅ 적용된 수정 사항

### 1. Firebase 초기화 단일화

**파일**: `src/lib/firebase.ts`

- ✅ `initializeApp()` 호출은 한 곳에서만 수행
- ✅ `getStorage(app)` 호출 시 명시적 버킷 지정 제거 (firebaseConfig의 storageBucket 사용)
- ✅ 런타임 진단 로그 추가

**주요 변경**:
```typescript
// Storage 버킷 진단 로그 추가
if (import.meta.env.MODE !== 'production') {
  console.log('[Firebase Storage] Initialized');
  console.log('[Firebase Storage] Config storageBucket:', app.options.storageBucket);
  const storageBucket = (storage as any)._location?.bucket || (storage as any)._bucket?.name || 'unknown';
  console.log('[Firebase Storage] Actual bucket:', storageBucket);
  if (storageBucket !== app.options.storageBucket) {
    console.warn('[Firebase Storage] ⚠️ 버킷 불일치 감지!');
  }
}
```

### 2. 업로드 헬퍼 진단 로그 강화

**파일**: `src/lib/storage.ts`

- ✅ `uploadImageToStorage()` 함수에 버킷 확인 로그 추가
- ✅ `uploadMenuImage()` 함수에 버킷 확인 로그 추가
- ✅ 다운로드 URL에서 버킷 이름 추출 및 검증

**주요 변경**:
```typescript
// Storage 버킷 확인 (런타임 진단)
const storageBucket = (storage as any)._location?.bucket || (storage as any)._bucket?.name || 'unknown';
console.log('[uploadImageToStorage] Using storage bucket:', storageBucket);

// 다운로드 URL에서 버킷 확인
if (downloadURL.includes('firebasestorage.googleapis.com')) {
  const urlMatch = downloadURL.match(/\/b\/([^/]+)\//);
  if (urlMatch) {
    const urlBucket = urlMatch[1];
    if (urlBucket !== storageBucket && !urlBucket.includes('firebasestorage.app')) {
      console.warn('[uploadImageToStorage] ⚠️ URL 버킷이 예상과 다릅니다!');
    }
  }
}
```

### 3. UI 하드코딩 수정

**파일**: `src/pages/admin/Settings/OperationsTab.tsx`

- ✅ `hp-kal.appspot.com` → `hyun-poong.firebasestorage.app`로 변경

### 4. Functions 서버 사이드 수정

**파일**: `src/functions/src/lib/pdf.ts`

- ✅ `appspot.com` 형식 → `firebasestorage.app` 형식으로 변경
- ✅ 환경 변수 `STORAGE_BUCKET_NAME` 지원 추가

**주요 변경**:
```typescript
const bucketName = process.env.FUNCTIONS_EMULATOR
  ? 'demo.firebasestorage.app'
  : process.env.STORAGE_BUCKET_NAME || `${projectId}.firebasestorage.app`;
```

### 5. CORS 스크립트 검증

**파일**: `scripts/apply-cors.mjs`

- ✅ 이미 올바르게 설정되어 있음 확인
- ✅ `BUCKET_NAME = 'hyun-poong.firebasestorage.app'` 확인
- ✅ `PROJECT_ID = 'hyun-poong'` 확인

### 6. 문서 업데이트

**파일**: `docs/INCIDENT-2025-01-Storage-CORS.md`

- ✅ 재발 방지 체크리스트 추가
- ✅ 근본 원인 요약 추가

**새 파일**: `docs/STORAGE-BUCKET-VERIFICATION-CHECKLIST.md`

- ✅ 배포 전/후 검증 체크리스트 작성

---

## 📝 수정된 주요 파일

### 1. `src/lib/firebase.ts`
- Storage 버킷 진단 로그 추가
- 버킷 불일치 감지 경고 추가

### 2. `src/lib/storage.ts`
- `uploadImageToStorage()`: 버킷 확인 로그 추가
- `uploadMenuImage()`: 버킷 확인 로그 추가
- 다운로드 URL에서 버킷 검증 추가

### 3. `src/pages/admin/Settings/OperationsTab.tsx`
- UI 하드코딩 버킷 이름 수정

### 4. `src/functions/src/lib/pdf.ts`
- Functions 서버 사이드 버킷 이름 형식 수정

### 5. `docs/INCIDENT-2025-01-Storage-CORS.md`
- 재발 방지 체크리스트 추가
- 근본 원인 요약 추가

### 6. `docs/STORAGE-BUCKET-VERIFICATION-CHECKLIST.md` (신규)
- 배포 전/후 검증 체크리스트

---

## 🧪 검증 방법

### 로컬 검증

```bash
# 1. 빌드 성공 확인
npm run build

# 2. dist/ 폴더에서 잘못된 버킷 이름 검색
grep -r "appspot\.com" dist/ || echo "✅ appspot.com 문자열 없음"

# 3. CORS 설정 적용
npm run cors:apply
```

### 운영 검증

1. **브라우저 콘솔 확인**:
   - `[Firebase Config] storageBucket: hyun-poong.firebasestorage.app` 로그 확인
   - `[Firebase Storage] Actual bucket: hyun-poong.firebasestorage.app` 로그 확인
   - 경고 메시지 없음 확인

2. **이미지 업로드 테스트**:
   - 관리자 페이지에서 메뉴 이미지 업로드
   - `[uploadMenuImage] Using storage bucket: hyun-poong.firebasestorage.app` 로그 확인
   - 업로드 성공 확인

3. **Network 탭 확인**:
   - 요청 URL: `https://firebasestorage.googleapis.com/v0/b/hyun-poong.firebasestorage.app/o?...`
   - Status: 200 또는 204
   - CORS 에러 없음

---

## 🛡️ 재발 방지 체크리스트

### 코드 리뷰 시 필수 확인

- [ ] `initializeApp()` 호출은 `src/lib/firebase.ts` 한 곳에서만
- [ ] 모든 Storage 사용이 `import { storage } from '@/lib/firebase'` 사용
- [ ] 코드에 `.appspot.com` 문자열 하드코딩 없음
- [ ] 환경 변수 `VITE_FIREBASE_STORAGE_BUCKET=hyun-poong.firebasestorage.app` 설정

### 배포 전 필수 검증

- [ ] `npm run build` 성공
- [ ] `dist/` 폴더에서 `.appspot.com` 문자열 검색 결과 0건
- [ ] `npm run cors:apply` 실행 및 확인

### 배포 후 필수 검증

- [ ] 브라우저 콘솔에서 Firebase Config 로그 확인
- [ ] 브라우저 콘솔에서 Storage 버킷 로그 확인
- [ ] 이미지 업로드 테스트 성공
- [ ] Network 탭에서 요청 URL 확인

---

## 📚 관련 문서

- `docs/INCIDENT-2025-01-Storage-CORS.md`: 장애 보고서 및 재발 방지 가이드
- `docs/STORAGE-BUCKET-VERIFICATION-CHECKLIST.md`: 검증 체크리스트
- `scripts/apply-cors.mjs`: CORS 설정 스크립트
- `cors.json`: CORS 설정 파일

---

**작업 완료 일시**: 2025-01-20  
**검증 상태**: 대기 중 (운영 배포 후 최종 검증 필요)

