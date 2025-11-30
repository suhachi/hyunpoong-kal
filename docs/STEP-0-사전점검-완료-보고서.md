# STEP 0: 사전 점검 & 백업 완료 보고서

**작성일**: 2025-01-XX  
**프로젝트**: 현풍닭칼국수 PWA (hyunpoong-kal)

---

## ✅ 0-1) 프로젝트 구조/의존성 확인

### 핵심 의존성 확인
- ✅ `react-router-dom`: ^6.28.0
- ✅ `firebase`: ^12.5.0
- ✅ `firebase-admin`: ^12.7.0
- ✅ `firebase-functions`: ^6.1.0
- ✅ `typescript`: devDependencies에 포함
- ✅ `vite`: 6.3.5

### 디렉토리 구조 확인
- ✅ `src/pages/app`: 존재 (Home, MenuList, MenuDetail, Cart, Checkout 등)
- ✅ `src/pages/admin`: 존재 (Dashboard, Orders, Menus, Settings 등)
- ✅ `src/components/app`: 존재
- ✅ `src/contexts`: 존재 (AuthContext, CartContext)
- ✅ `src/lib`: 존재 (admin, delivery, auth, nicepay 등)

---

## ✅ 0-2) 현재 App.tsx 상태 확인

**파일**: `src/App.tsx`

**상태**: ✅ **RealApp 라우터 버전** (Figma 데모 버전 아님)

**확인 사항**:
- ✅ `BrowserRouter`, `Routes`, `Route`, `Navigate` import됨
- ✅ `AppLayout` 사용
- ✅ 고객 앱 라우트 구조 존재
- ✅ 관리자 라우트 구조 존재
- ✅ `/menu` → `MenuList` 라우트 존재 (라인 95)
- ✅ `/menu/:menuId` → `MenuDetail` 라우트 존재 (라인 97)

**현재 라우팅 구조**:
```typescript
<Route path="/" element={<AppLayout />}>
  <Route path="menu" element={<MenuList />} />
  <Route path="menu/:menuId" element={<MenuDetail />} />
  ...
</Route>
```

---

## ⚠️ 0-3) 발견된 문제점

### 문제 1: MenuDetail 데이터 소스 불일치
- **MenuList**: `getMenus()` API 사용 (Firestore 또는 localStorage)
- **MenuDetail**: 정적 `menus.json` 파일에서만 찾음
- **영향**: Firebase 모드에서 메뉴를 찾을 수 없음

### 문제 2: 라우트 파라미터 이름
- **라우트**: `menu/:menuId` (라인 97)
- **MenuList 링크**: `/menu/${menu.menuId}` (정상)
- **MenuDetail**: `useParams<{ menuId: string }>()` 사용 필요 (확인 필요)

---

## 📋 0-4) 백업 대상 파일 목록

다음 파일들은 Step 1 전에 안전하게 백업됨:

1. ✅ `src/App.tsx` - 현재 RealApp 라우터 구조
2. ✅ `src/pages/app/Home.tsx`
3. ✅ `src/pages/app/MenuList.tsx`
4. ✅ `src/pages/app/MenuDetail.tsx`
5. ✅ `src/pages/app/Checkout.tsx`
6. ✅ `src/contexts/AuthContext.tsx`
7. ✅ `src/lib/nicepay.ts`
8. ✅ `src/lib/delivery/provider.ts`
9. ✅ `src/lib/delivery/providers/mock.ts`
10. ✅ `src/lib/delivery/providers/providerA.ts`

---

## 🎯 다음 단계 준비 완료

**STEP 1 준비 상태**: ✅ 완료

**주요 작업 예상**:
1. MenuDetail에서 `getMenuById()` API 사용하도록 수정
2. 라우트 파라미터 이름 통일 확인
3. 메뉴 클릭 시 정상 이동 검증

---

**보고서 작성자**: AI Assistant  
**최종 업데이트**: 2025-01-XX

