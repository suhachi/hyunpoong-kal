# ✅ CORS 에러 해결 - 코드 수정 완료

**작성일**: 2025-01-20  
**수정 내용**: Firebase Storage 초기화 시 명시적으로 버킷 이름 지정

---

## 🔍 문제 원인

### 상황

- **환경 변수**: `VITE_FIREBASE_STORAGE_BUCKET=hyun-poong.firebasestorage.app`
- **실제 요청**: `hyun-poong.appspot.com` (존재하지 않음)
- **CORS 설정**: `hyun-poong.firebasestorage.app`에만 적용됨

### 원인

Firebase SDK가 내부적으로 `appspot.com` 형식의 버킷 이름을 사용하고 있었습니다.

---

## ✅ 해결 방법

### 코드 수정

`src/lib/firebase.ts` 파일에서 Storage 초기화 시 명시적으로 버킷 이름을 지정했습니다.

**수정 전**:
```typescript
export const storage = getStorage(app);
```

**수정 후**:
```typescript
// Storage: 명시적으로 버킷 이름 지정 (CORS 설정이 적용된 버킷 사용)
export const storage = getStorage(app, "gs://hyun-poong.firebasestorage.app");
```

---

## 🚀 다음 단계

### 1. 재빌드

```bash
npm run build
```

### 2. 재배포

```bash
firebase deploy --only hosting
```

### 3. 테스트

1. 관리자 페이지 접속: `https://hyun-poong.web.app/admin/menus`
2. 메뉴 이미지 업로드 시도
3. 개발자 도구(F12) > Network 탭에서 CORS 에러 확인
4. **CORS 에러가 없어야 합니다** ✅

---

## 📝 수정된 파일

- `src/lib/firebase.ts` - Storage 초기화 시 명시적으로 버킷 이름 지정

---

## ✅ 완료 체크리스트

- [x] 코드 수정 완료
- [ ] 재빌드 필요
- [ ] 재배포 필요
- [ ] 이미지 업로드 테스트

---

**코드 수정 완료** ✅  
**재빌드 및 재배포 후 테스트하세요!**





