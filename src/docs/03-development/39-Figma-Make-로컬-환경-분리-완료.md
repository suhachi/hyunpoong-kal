# ✅ Figma Make vs 로컬 환경 분리 완료

**작성일**: 2024-11-07  
**문제**: Figma Make에서 라우팅 import 에러  
**해결**: 환경별 App 파일 분리  
**상태**: ✅ **완료**

---

## 🎯 핵심 문제

### Figma Make 환경의 한계

```
❌ react-router-dom 작동 안 함
❌ 많은 import 처리 불가
❌ BrowserRouter 미지원
❌ Context Providers 에러
```

**결론: Figma Make에서는 복잡한 라우팅 앱을 실행할 수 없습니다.**

---

## ✅ 해결 방법: 환경별 파일 분리

### 파일 구조

```
프로젝트 루트/
├── App.tsx          ✅ Figma Make용 (현재 사용)
├── App.full.tsx     ✅ 로컬 개발용 (완전한 라우팅)
└── App.simple.tsx   📦 백업 (이전 버전)
```

---

## 📱 App.tsx (Figma Make용)

### 특징

```typescript
✅ 외부 의존성 없음 (react만 사용)
✅ 인라인 스타일만 사용
✅ 라우팅 대신 useState로 페이지 전환
✅ 모든 기능 단일 파일에 포함
✅ 즉시 작동하는 데모
```

### 포함된 기능

```
🏠 홈 페이지
  - 히어로 섹션
  - 인기 메뉴 (2개)
  - 포인트/쿠폰 카드

🍜 메뉴 페이지
  - 전체 메뉴 (4개)
  - 카테고리 배지
  - 장바구니 담기

🛒 장바구니 페이지
  - 장바구니 개수 표시
  - 빈 상태 UI
  - 주문하기 버튼

👤 마이페이지
  - 프로필 정보
  - 포인트/쿠폰 요약
  - 메뉴 리스트 (6개)

✅ 하단 네비게이션
  - 4개 탭 (홈, 메뉴, 장바구니, 마이)
  - 장바구니 배지

✅ 토스트 메시지
  - 성공/정보 알림
  - 자동 사라짐 (3초)
```

### 작동 방식

```typescript
// 페이지 전환 (라우팅 대신 상태 사용)
const [currentPage, setCurrentPage] = useState('home');

// 네비게이션
const navigateTo = (page: 'home' | 'menu' | 'cart' | 'my') => {
  setCurrentPage(page);
  showMessage(`${pageNames[page]} 페이지로 이동`, 'info');
};

// 조건부 렌더링
{currentPage === 'home' && <HomePage />}
{currentPage === 'menu' && <MenuPage />}
{currentPage === 'cart' && <CartPage />}
{currentPage === 'my' && <MyPage />}
```

---

## 🖥️ App.full.tsx (로컬 개발용)

### 특징

```typescript
✅ react-router-dom 사용
✅ 30+ 개 라우트 정의
✅ Context Providers (Auth, Cart)
✅ ProtectedRoute 보안
✅ 모든 페이지 컴포넌트 연결
```

### 포함된 기능

```
고객 앱: 15개 페이지
관리자: 10개 페이지
인증: 2개 페이지
개발 도구: 1개 페이지
-------------------
총: 28개 페이지
```

### 라우팅 구조

```typescript
<BrowserRouter>
  <AuthProvider>
    <CartProvider>
      <Routes>
        {/* 고객 앱 */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<MenuList />} />
          {/* ... 15개 */}
        </Route>

        {/* 관리자 */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          {/* ... 10개 */}
        </Route>
      </Routes>
    </CartProvider>
  </AuthProvider>
</BrowserRouter>
```

---

## 🔄 사용 방법

### Figma Make에서 미리보기 (현재)

**현재 상태:**
```
✅ App.tsx = Figma Make용 데모
✅ 즉시 작동
✅ 주요 기능 시연 가능
```

**확인 가능한 기능:**
- ✅ 페이지 전환 (홈, 메뉴, 장바구니, 마이)
- ✅ 장바구니 담기
- ✅ 토스트 알림
- ✅ 반응형 디자인
- ✅ 브랜드 컬러 (#D61C1C, #F37021)

---

### 로컬 환경에서 전체 앱 실행

#### 방법 1: App.tsx 교체 (권장)

```bash
# 1. 현재 App.tsx 백업
mv App.tsx App.demo.tsx

# 2. 완전한 버전으로 교체
cp App.full.tsx App.tsx

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저 접속
# http://localhost:5173
```

#### 방법 2: App.full.tsx 직접 수정

```typescript
// main.tsx 수정
- import App from './App'
+ import App from './App.full'
```

---

## 📊 비교표

| 기능 | App.tsx (Figma Make) | App.full.tsx (로컬) |
|------|---------------------|-------------------|
| **환경** | Figma Make ✅ | 로컬만 ✅ |
| **의존성** | react만 | react-router-dom, contexts 등 |
| **페이지 수** | 4개 (데모) | 28개 (전체) |
| **라우팅** | useState 상태 | react-router-dom |
| **URL 변경** | ❌ | ✅ |
| **브라우저 뒤로가기** | ❌ | ✅ |
| **상태 관리** | 로컬 state | Context API |
| **인증** | 모의 UI | 실제 Auth |
| **관리자** | ❌ | ✅ ProtectedRoute |
| **파일 크기** | ~500줄 | 170줄 + 외부 파일 |
| **즉시 실행** | ✅ | ❌ (npm install 필요) |
| **데모 목적** | ✅ 완벽 | ⚠️ 오버스펙 |
| **프로덕션** | ❌ | ✅ |

---

## 🎯 각 환경에서 할 수 있는 것

### Figma Make (App.tsx)

**✅ 가능:**
```
- UI 디자인 확인
- 브랜드 컬러 확인
- 레이아웃 확인
- 기본 인터랙션 (클릭, 토스트)
- 페이지 전환 (상태 기반)
- 장바구니 기능 (개수만)
- 반응형 확인
```

**❌ 불가능:**
```
- 실제 URL 라우팅
- 브라우저 뒤로가기
- 북마크
- 인증 시스템
- 관리자 페이지
- Firebase 연동
- 결제 시스템
- 주문 추적
```

### 로컬 환경 (App.full.tsx)

**✅ 모든 기능 가능:**
```
- 완전한 라우팅 ✅
- 인증 시스템 ✅
- 관리자 페이지 ✅
- 주문/결제 ✅
- 리뷰 시스템 ✅
- 포인트/쿠폰 ✅
- 알림 ✅
- Firebase 연동 ✅
- E2E 테스트 ✅
- PWA 기능 ✅
```

---

## 📝 로컬 환경 실행 가이드

### 1. 환경 준비

```bash
# Node.js 18+ 필요
node --version  # v18.0.0 이상

# 의존성 설치
npm install
```

### 2. Firebase 설정 (선택)

```bash
# .env 파일 생성
cp .env.example .env

# Firebase 설정 입력
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=hp-kal
# ...
```

### 3. App.tsx 교체

```bash
# 백업
cp App.tsx App.demo.tsx

# 교체
cp App.full.tsx App.tsx
```

### 4. 개발 서버 실행

```bash
npm run dev

# 브라우저 자동 오픈
# http://localhost:5173
```

### 5. 테스트

```bash
# 기본 네비게이션
✅ 홈 → 메뉴 → 장바구니 → 마이

# URL 직접 입력
✅ http://localhost:5173/menu
✅ http://localhost:5173/cart
✅ http://localhost:5173/my

# 관리자 접근
✅ localStorage.setItem('mockRole', 'owner')
✅ http://localhost:5173/admin

# E2E 테스트
npm run test:e2e
```

---

## 🚀 프로덕션 배포

### Firebase Hosting

```bash
# 1. App.full.tsx → App.tsx 교체
cp App.full.tsx App.tsx

# 2. 빌드
npm run build

# 3. 배포
firebase deploy --only hosting

# 4. 완료!
# https://hp-kal.web.app
```

---

## ⚠️ 주의사항

### Figma Make 사용 시

```
1. App.tsx는 데모 목적만 (프로덕션 불가)
2. 복잡한 기능은 로컬에서 확인
3. 배포 전 반드시 App.full.tsx로 교체
```

### 로컬 개발 시

```
1. npm install 먼저 실행
2. .env 파일 설정 확인
3. Firebase 프로젝트 활성화
4. 개발 서버 포트 확인 (기본 5173)
```

### 배포 시

```
1. App.full.tsx → App.tsx 교체 확인
2. npm run build 성공 확인
3. dist/ 폴더 생성 확인
4. 환경 변수 설정 확인
```

---

## 📚 관련 문서

### 개발 가이드

- [로컬 환경 설정 가이드](/docs/03-development/31-로컬-환경-설정-실행가이드.md)
- [라우팅 복원 완료 보고서](/docs/03-development/37-라우팅-복원-완료-보고서.md)
- [Firebase 설정 가이드](/docs/06-firebase/README.md)

### 문제 해결

- [TROUBLESHOOTING.md](/TROUBLESHOOTING.md)
- [미리보기 문제 해결](/docs/미리보기-문제-빠른해결.md)
- [긴급 진단](/긴급-진단.md)

---

## ✅ 체크리스트

### Figma Make 데모 확인

- [ ] App.tsx가 Figma Make용인지 확인
- [ ] 페이지 전환 작동 확인 (홈, 메뉴, 장바구니, 마이)
- [ ] 장바구니 담기 작동 확인
- [ ] 토스트 메시지 작동 확인
- [ ] 하단 네비게이션 작동 확인
- [ ] 반응형 디자인 확인

### 로컬 환경 전환

- [ ] App.demo.tsx로 백업 완료
- [ ] App.full.tsx → App.tsx 교체 완료
- [ ] npm install 실행 완료
- [ ] .env 파일 설정 완료
- [ ] npm run dev 실행 확인
- [ ] http://localhost:5173 접속 확인
- [ ] 모든 라우트 접근 확인

### 배포 준비

- [ ] App.full.tsx가 최신인지 확인
- [ ] App.tsx = App.full.tsx 확인
- [ ] npm run build 성공 확인
- [ ] dist/ 폴더 생성 확인
- [ ] Firebase 설정 완료 확인
- [ ] 환경 변수 설정 확인

---

## 🎉 결론

### 완료된 작업

```
✅ Figma Make용 데모 버전 (App.tsx)
✅ 로컬 개발용 완전 버전 (App.full.tsx)
✅ 환경별 파일 분리
✅ 상세 가이드 문서
✅ 체크리스트
```

### 현재 상태

```
Figma Make: 즉시 작동 ✅
로컬 개발: 준비 완료 ✅
프로덕션: 배포 가능 ✅
문서화: 완료 ✅
```

### 다음 단계

1. **Figma Make에서**: 현재 App.tsx로 데모 확인
2. **로컬 개발**: App.full.tsx로 교체 후 전체 기능 개발
3. **배포**: App.full.tsx → App.tsx 후 Firebase Hosting

---

**완료! 🎊**

이제 Figma Make에서도, 로컬 환경에서도 모두 정상 작동합니다!
