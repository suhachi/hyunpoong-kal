# Firebase Storage 버킷 검증 체크리스트

이 문서는 Firebase Storage CORS 에러 재발 방지를 위한 검증 체크리스트입니다.

## 📋 배포 전 필수 검증

### 1. 코드 검증

#### 1.1 Firebase 초기화 확인
```bash
# initializeApp이 한 곳에서만 호출되는지 확인
grep -r "initializeApp" src/ --exclude-dir=node_modules | grep -v "\.md"
# 결과: src/lib/firebase.ts만 나와야 함
```

#### 1.2 Storage 사용 확인
```bash
# getStorage가 다른 곳에서 호출되지 않는지 확인
grep -r "getStorage" src/ --exclude-dir=node_modules | grep -v "\.md"
# 결과: src/lib/firebase.ts만 나와야 함
```

#### 1.3 잘못된 버킷 이름 검색
```bash
# .appspot.com 문자열이 코드에 없는지 확인
grep -r "\.appspot\.com" src/ --exclude-dir=node_modules | grep -v "\.md" | grep -v "\.tsx" | grep -v "pdf.ts"
# 결과: pdf.ts (Functions 서버 사이드)만 허용
```

#### 1.4 올바른 버킷 이름 확인
```bash
# firebasestorage.app이 올바르게 사용되는지 확인
grep -r "firebasestorage\.app" src/lib/firebase.ts
# 결과: firebase.ts에 있어야 함
```

### 2. 빌드 검증

```bash
# 1. 빌드 실행
npm run build

# 2. dist/ 폴더에서 잘못된 버킷 이름 검색
grep -r "appspot\.com" dist/ || echo "✅ appspot.com 문자열 없음"

# 3. 올바른 버킷 이름 확인
grep -r "firebasestorage\.app" dist/ | head -5
```

### 3. CORS 설정 검증

```bash
# 1. CORS 설정 적용
npm run cors:apply

# 2. CORS 설정 확인
gsutil cors get gs://hyun-poong.firebasestorage.app

# 3. 출력 예시 (비어있으면 안 됨)
# [
#   {
#     "origin": ["https://hyun-poong.web.app", ...],
#     "method": ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"],
#     ...
#   }
# ]
```

## 📋 운영 배포 후 검증

### 1. 브라우저 DevTools Console 확인

운영 사이트(`https://hyun-poong.web.app`)에서 다음 로그가 출력되어야 합니다:

```
========================================
[Firebase Config] Actual Runtime Values:
========================================
storageBucket: hyun-poong.firebasestorage.app
projectId: hyun-poong
...
========================================

[Firebase Storage] Initialized
[Firebase Storage] Config storageBucket: hyun-poong.firebasestorage.app
[Firebase Storage] Actual bucket: hyun-poong.firebasestorage.app
```

**⚠️ 경고가 있으면 안 됨**:
- `[Firebase Storage] ⚠️ 버킷 불일치 감지!` 같은 경고가 있으면 즉시 확인 필요

### 2. 이미지 업로드 테스트

1. 관리자 페이지 접속: `https://hyun-poong.web.app/admin/menus`
2. 메뉴 생성/수정에서 이미지 선택 후 업로드
3. DevTools Console에서 다음 로그 확인:

```
[uploadMenuImage] Starting upload, menuId: ...
[uploadMenuImage] Using storage bucket: hyun-poong.firebasestorage.app
[uploadImageToStorage] Using storage bucket: hyun-poong.firebasestorage.app
[uploadImageToStorage] Upload successful, URL: https://firebasestorage.googleapis.com/v0/b/hyun-poong.firebasestorage.app/...
```

**⚠️ 경고가 있으면 안 됨**:
- `[uploadImageToStorage] ⚠️ URL 버킷이 예상과 다릅니다!` 같은 경고가 있으면 즉시 확인 필요

### 3. DevTools Network 탭 확인

이미지 업로드 시 Network 탭에서:

1. **요청 URL 형식 확인**:
   ```
   ✅ 올바름: https://firebasestorage.googleapis.com/v0/b/hyun-poong.firebasestorage.app/o?name=...
   ❌ 잘못됨: https://firebasestorage.googleapis.com/v0/b/hyun-poong.appspot.com/o?name=...
   ```

2. **응답 상태 확인**:
   - Status: `200` 또는 `204` (성공)
   - CORS 에러 없음

3. **응답 헤더 확인**:
   - `Access-Control-Allow-Origin: https://hyun-poong.web.app` 포함되어야 함

### 4. Firebase Console 확인

1. Firebase Console > Storage 접속
2. 버킷 목록에서 `hyun-poong.firebasestorage.app` 확인
3. `stores/hyunpoong-main/menus/...` 경로에 업로드된 파일 확인

## 🚨 문제 발생 시 즉시 확인

### 1. 브라우저 콘솔 로그 확인

다음 로그를 확인하여 문제 원인 파악:

```javascript
// 1. Firebase Config 확인
console.log('[Firebase Config] storageBucket:', app.options.storageBucket);

// 2. Storage 인스턴스 확인
const storageBucket = (storage as any)._location?.bucket || (storage as any)._bucket?.name;
console.log('[Firebase Storage] Actual bucket:', storageBucket);

// 3. 불일치 확인
if (storageBucket !== app.options.storageBucket) {
  console.error('⚠️ 버킷 불일치!', {
    config: app.options.storageBucket,
    actual: storageBucket
  });
}
```

### 2. Network 탭 확인

요청 URL에서 버킷 이름 확인:
- `hyun-poong.appspot.com`이 포함되어 있으면 즉시 코드 검토 필요
- `hyun-poong.firebasestorage.app`이어야 정상

### 3. 환경 변수 확인

```bash
# .env.local 확인
cat .env.local | grep VITE_FIREBASE_STORAGE_BUCKET
# 결과: VITE_FIREBASE_STORAGE_BUCKET=hyun-poong.firebasestorage.app

# 빌드 시 환경 변수 확인
npm run build 2>&1 | grep -i "storage\|bucket" || echo "환경 변수 확인 필요"
```

## ✅ 검증 완료 체크리스트

배포 전:
- [ ] 코드에서 `.appspot.com` 문자열 검색 결과 확인
- [ ] `dist/` 폴더에서 `.appspot.com` 문자열 검색 결과 확인
- [ ] CORS 설정 적용 및 확인 완료
- [ ] 빌드 성공 확인

배포 후:
- [ ] 브라우저 콘솔에서 Firebase Config 로그 확인
- [ ] 브라우저 콘솔에서 Storage 버킷 로그 확인
- [ ] 이미지 업로드 테스트 성공
- [ ] Network 탭에서 요청 URL 확인
- [ ] Firebase Console에서 업로드된 파일 확인

---

**최종 업데이트**: 2025-01-20  
**관련 문서**: `docs/INCIDENT-2025-01-Storage-CORS.md`

