# STEP 1: 라우터 복원 + 메뉴 상세 이동 버그 해결 완료 보고서

**작성일**: 2025-01-XX  
**프로젝트**: 현풍닭칼국수 PWA (hyunpoong-kal)

---

## ✅ 1-1) 라우터 설계 복원

### 현재 상태 확인
- ✅ `App.tsx`는 이미 **RealApp 라우터 구조**로 되어 있음
- ✅ `BrowserRouter`, `Routes`, `Route` 사용 중
- ✅ `/menu` → `MenuList` 라우트 존재
- ✅ `/menu/:menuId` → `MenuDetail` 라우트 존재

**변경 사항**: 없음 (이미 올바른 구조)

---

## ✅ 1-2) MenuDetail 데이터 소스 수정

### 문제점
- ❌ **이전**: 정적 `menus.json` 파일에서만 메뉴를 찾음
- ✅ **수정 후**: `getMenuById()` API 사용

### 변경 내용

**파일**: `src/pages/app/MenuDetail.tsx`

1. **Import 변경**:
   ```typescript
   // 제거
   import menusData from '../../data/menus.json';
   
   // 추가
   import { getMenuById } from '../../lib/admin/menus.api';
   import { Loader2 } from 'lucide-react';
   ```

2. **상태 관리 추가**:
   ```typescript
   const [menu, setMenu] = useState<Menu | null>(null);
   const [loading, setLoading] = useState(true);
   ```

3. **useEffect로 메뉴 로드**:
   ```typescript
   useEffect(() => {
     if (!menuId) {
       navigate('/menu');
       return;
     }

     const loadMenu = async () => {
       try {
         setLoading(true);
         const loadedMenu = await getMenuById(menuId);
         if (!loadedMenu) {
           toast.error('메뉴를 찾을 수 없습니다');
           navigate('/menu');
           return;
         }
         setMenu(loadedMenu);
       } catch (error) {
         console.error('Failed to load menu:', error);
         toast.error('메뉴 정보를 불러오는데 실패했습니다');
         navigate('/menu');
       } finally {
         setLoading(false);
       }
     };

     loadMenu();
   }, [menuId, navigate]);
   ```

4. **로딩 상태 UI 추가**:
   ```typescript
   if (loading) {
     return (
       <div className="flex items-center justify-center min-h-[60vh]">
         <Loader2 className="w-8 h-8 animate-spin text-[#D61C1C]" />
       </div>
     );
   }
   ```

---

## ✅ 1-3) 라우트 파라미터 이름 확인

### 확인 결과
- ✅ **라우트**: `menu/:menuId` (App.tsx 라인 97)
- ✅ **MenuList 링크**: `/menu/${menu.menuId}` (MenuList.tsx 라인 134)
- ✅ **MenuDetail 파라미터**: `useParams<{ menuId: string }>()` (MenuDetail.tsx 라인 34)

**결론**: 파라미터 이름이 일치함 (`menuId`)

---

## ✅ 1-4) Home.tsx 메뉴 클릭 확인

**파일**: `src/pages/app/Home.tsx` (라인 41-43)

```typescript
const handleMenuClick = useCallback((menuId: string) => {
  navigate(`/menu/${menuId}`);
}, [navigate]);
```

✅ **정상**: `navigate`를 사용하여 올바른 경로로 이동

---

## 📋 변경 파일 목록

### 수정된 파일
1. ✅ `src/pages/app/MenuDetail.tsx`
   - 정적 JSON import 제거
   - `getMenuById()` API 사용
   - 로딩 상태 추가
   - 에러 처리 추가

### 확인만 한 파일 (변경 없음)
2. ✅ `src/App.tsx` - 이미 올바른 라우터 구조
3. ✅ `src/pages/app/MenuList.tsx` - 이미 올바른 링크 사용
4. ✅ `src/pages/app/Home.tsx` - 이미 올바른 네비게이션 사용

---

## 🎯 검증 결과

### 예상 동작
1. ✅ `/menu` → 메뉴 목록 표시
2. ✅ 메뉴 카드 클릭 → `/menu/{menuId}`로 이동
3. ✅ `MenuDetail`에서 `getMenuById(menuId)` 호출
4. ✅ Firebase 모드: Firestore에서 메뉴 조회
5. ✅ Mock 모드: localStorage 또는 menus.json에서 메뉴 조회
6. ✅ 메뉴를 찾을 수 없으면 `/menu`로 리다이렉트

---

## ⚠️ 롤백 기준

만약 문제가 발생하면:
1. `src/pages/app/MenuDetail.tsx`를 Step 0에서 백업한 버전으로 복구
2. 다시 단계별로 수정

---

## ✅ STEP 1 완료

**상태**: ✅ 완료  
**다음 단계**: STEP 2 (NICEPAY 온라인 결제 연동 준비)

---

**보고서 작성자**: AI Assistant  
**최종 업데이트**: 2025-01-XX

