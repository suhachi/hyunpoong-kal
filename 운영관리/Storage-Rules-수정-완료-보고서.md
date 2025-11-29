# 🔥 Firebase Storage Rules 수정 완료 보고서

**작성일**: 2025-01-20  
**프로젝트**: 현풍닭칼국수 PWA  
**수정 내용**: Storage Rules 경로 수정

---

## 📊 수정 요약

### 문제점

Firebase Console의 Storage Rules와 프로젝트 파일의 경로가 불일치했습니다.

**Firebase Console**:
```
match /stores/{storeId}/menus/{menuId}/{fileName}
```

**프로젝트 파일** (`src/storage.rules`):
```
match /menus/{menuId}/{fileName}  // ❌ stores/ 경로 누락
```

**실제 업로드 경로** (`src/lib/storage.ts`):
```typescript
const storagePath = `stores/${storeId}/menus/${targetMenuId}/image.${fileExtension}`;
```

### 수정 내용

✅ `src/storage.rules` 파일을 Firebase Console과 일치하도록 수정

**수정 전**:
```javascript
match /menus/{menuId}/{fileName} {
```

**수정 후**:
```javascript
match /stores/{storeId}/menus/{menuId}/{fileName} {
```

---

## ✅ 수정된 파일

### 1. `src/storage.rules`

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // 메뉴 이미지 (실제 업로드 경로: stores/{storeId}/menus/{menuId}/image.png)
    match /stores/{storeId}/menus/{menuId}/{fileName} {
      allow read: if true; // 모두 읽기 가능
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024 // 5MB 제한
                   && request.resource.contentType.matches('image/.*');
    }

    // 리뷰 사진
    match /reviews/{uid}/{rid}/{file} {
      allow read: if true; // 모두 읽기 가능
      allow write: if request.auth != null
                   && request.auth.uid == uid
                   && request.resource.size < 3 * 1024 * 1024 // 3MB 제한
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### 2. `firebase.json`

Storage Rules 설정 추가:

```json
{
  "storage": {
    "rules": "src/storage.rules"
  }
}
```

---

## 🚀 배포 방법

### Storage Rules 배포

```bash
# Storage Rules만 배포
firebase deploy --only storage
```

### 전체 배포

```bash
# 모든 항목 배포 (Hosting, Firestore, Storage, Functions)
firebase deploy
```

---

## ✅ 검증

배포 후 다음을 확인하세요:

1. **Firebase Console 확인**
   - Storage > Rules 탭에서 수정된 규칙 확인
   - `stores/{storeId}/menus/{menuId}/{fileName}` 경로가 있는지 확인

2. **이미지 업로드 테스트**
   - 관리자 페이지 > 메뉴 관리 > 이미지 업로드
   - CORS 에러 없이 정상 업로드되는지 확인

3. **Rules Playground 테스트**
   - Firebase Console > Storage > Rules > Rules Playground
   - 경로: `stores/hyunpoong-main/menus/menu-001/image.png`
   - 시뮬레이션 유형: `write`
   - 인증됨: `on`
   - "실행" 버튼 클릭하여 허용되는지 확인

---

## 📝 참고사항

### Storage Rules 경로 구조

```
stores/
  └── {storeId}/
      └── menus/
          └── {menuId}/
              └── image.{ext}
```

**예시**:
- `stores/hyunpoong-main/menus/menu-001/image.png`
- `stores/hyunpoong-main/menus/menu-002/image.jpg`

### 권한 설정

- **읽기**: 모든 사용자 허용 (`allow read: if true`)
- **쓰기**: 인증된 사용자만 허용 (`request.auth != null`)
- **파일 크기 제한**: 5MB 이하
- **파일 타입 제한**: 이미지 파일만 (`image/.*`)

---

## 🎯 다음 단계

1. ✅ Storage Rules 파일 수정 완료
2. ✅ firebase.json에 Storage 설정 추가 완료
3. ⏳ **다음**: `firebase deploy --only storage` 실행하여 배포

---

**수정 완료** ✅


