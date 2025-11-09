# 🚀 Cursor AI 빠른 참조 카드

> **30초 안에 찾는 모든 명령어와 지시문**

---

## ⚡ 긴급 명령어

### 개발 서버

```bash
# 시작
npm run dev

# 중지
Ctrl + C

# 재시작
Ctrl + C → npm run dev

# 다른 포트로 실행
npm run dev -- --port 3000

# 포트 충돌 해결
lsof -ti:5173 | xargs kill -9
```

### 빌드 & 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# Firebase 배포
firebase deploy

# Firestore 규칙만
firebase deploy --only firestore:rules

# Functions만
firebase deploy --only functions
```

---

## 🎯 Cursor AI 단축키

| 기능 | macOS | Windows/Linux |
|-----|-------|---------------|
| 채팅 열기 | `Cmd+L` | `Ctrl+L` |
| 인라인 편집 | `Cmd+K` | `Ctrl+K` |
| 터미널 열기 | `Cmd+`` | `Ctrl+`` |
| 파일 찾기 | `Cmd+P` | `Ctrl+P` |
| 전체 검색 | `Cmd+Shift+F` | `Ctrl+Shift+F` |
| 저장 | `Cmd+S` | `Ctrl+S` |
| 되돌리기 | `Cmd+Z` | `Ctrl+Z` |

---

## 📝 핵심 지시문 템플릿

### 1. 디자인 수정 (복사해서 사용)

```
다음 디자인 규칙을 반드시 지켜줘:

✅ 브랜드 컬러:
- Primary: #D61C1C (현풍레드)
- Secondary: #F37021 (신칼오렌지)  
- Accent: #C7A45A (황동식기색)

❌ 금지:
- text-xl, font-bold 같은 Tailwind 폰트 클래스
- 임의의 색상 코드

✅ 사용:
- var(--color-primary)
- var(--color-secondary)
- var(--color-accent)
```

### 2. 새 페이지 추가

```
/pages/app/[페이지명].tsx 파일을 만들어줘.

요구사항:
- [기능 설명]
- [디자인 요구사항]
- [필요한 컴포넌트]

구조:
- AppLayout 사용
- 반응형 디자인
- 에러 처리 포함
- EmptyState 사용

라우팅:
- App.tsx에 경로 추가
```

### 3. 기존 파일 수정

```
[파일 경로]를 수정해줘.

변경사항:
1. [첫 번째 변경]
2. [두 번째 변경]
3. [세 번째 변경]

주의사항:
- 기존 기능 유지
- TypeScript 타입 에러 없이
- 디자인 일관성 유지
```

### 4. Firebase 연동

```
[기능명]을 Firebase에 연동해줘.

Firestore 구조:
[컬렉션명]/{docId}
{
  field1: type,
  field2: type,
  ...
}

구현:
1. /lib/[기능명].api.ts 생성
2. CRUD 함수 작성
3. 에러 처리 포함
4. TypeScript 타입 정의

최적화:
- 실시간 동기화 (onSnapshot)
- 로컬 캐시 사용
- 중복 요청 방지
```

### 5. 컴포넌트 생성

```
/components/[폴더]/[컴포넌트명].tsx 생성해줘.

Props:
- prop1: type
- prop2: type

기능:
- [기능 1]
- [기능 2]

디자인:
- 브랜드 컬러 사용
- 반응형
- 접근성 (aria-label)

참고:
- [비슷한 컴포넌트 경로]를 참고해서
```

---

## 🔥 Firebase 빠른 명령어

### Firestore

```typescript
// 문서 가져오기
import { doc, getDoc } from 'firebase/firestore';
const docRef = doc(db, 'collection', 'docId');
const docSnap = await getDoc(docRef);

// 컬렉션 가져오기
import { collection, getDocs } from 'firebase/firestore';
const querySnapshot = await getDocs(collection(db, 'collection'));

// 문서 추가
import { addDoc } from 'firebase/firestore';
await addDoc(collection(db, 'collection'), { data });

// 문서 업데이트
import { updateDoc } from 'firebase/firestore';
await updateDoc(doc(db, 'collection', 'docId'), { field: value });

// 문서 삭제
import { deleteDoc } from 'firebase/firestore';
await deleteDoc(doc(db, 'collection', 'docId'));

// 실시간 동기화
import { onSnapshot } from 'firebase/firestore';
onSnapshot(doc(db, 'collection', 'docId'), (doc) => {
  console.log(doc.data());
});
```

### Authentication

```typescript
// 이메일 로그인
import { signInWithEmailAndPassword } from 'firebase/auth';
await signInWithEmailAndPassword(auth, email, password);

// Google 로그인
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
const provider = new GoogleAuthProvider();
await signInWithPopup(auth, provider);

// 로그아웃
import { signOut } from 'firebase/auth';
await signOut(auth);

// 현재 사용자
import { onAuthStateChanged } from 'firebase/auth';
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user.uid);
  }
});
```

### Storage

```typescript
// 파일 업로드
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
const storageRef = ref(storage, 'path/file.jpg');
await uploadBytes(storageRef, file);
const url = await getDownloadURL(storageRef);

// 파일 삭제
import { deleteObject } from 'firebase/storage';
await deleteObject(storageRef);
```

---

## 🗂️ 프로젝트 구조

```
📁 중요 폴더:
/pages/app/          → 고객 앱 페이지
/pages/admin/        → 관리자 페이지
/components/app/     → 고객 앱 컴포넌트
/components/admin/   → 관리자 컴포넌트
/components/shared/  → 공통 컴포넌트
/components/ui/      → Shadcn UI
/lib/                → API 함수
/lib/admin/          → 관리자 API
/types/              → TypeScript 타입
/contexts/           → React Context
/hooks/              → Custom Hooks
/styles/             → CSS 파일
/config/             → 환경변수
/data/               → Mock 데이터
```

---

## 🎨 디자인 토큰

### 색상

```css
/* Primary */
--color-primary: #D61C1C;          /* 현풍레드 */
--color-primary-hover: #B01717;
--color-primary-light: #FFE5E5;

/* Secondary */
--color-secondary: #F37021;        /* 신칼오렌지 */
--color-secondary-hover: #D85F1B;

/* Accent */
--color-accent: #C7A45A;           /* 황동식기색 */

/* Neutral */
--color-text-primary: #333333;
--color-text-secondary: #8B7355;
--color-background: #F9F6F3;
--color-border: #E5DDD5;
```

### 간격

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
```

### 반응형 브레이크포인트

```css
sm: 640px    /* 모바일 가로 */
md: 768px    /* 태블릿 */
lg: 1024px   /* 데스크톱 */
xl: 1280px   /* 대형 데스크톱 */
```

---

## 🔍 주요 파일 위치

### 환경설정

```
/.env                    → 환경변수
/config/env.ts           → 환경변수 관리
/vite.config.ts          → Vite 설정
/tsconfig.json           → TypeScript 설정
/tailwind.config.js      → Tailwind 설정
```

### Firebase

```
/firebase.json           → Firebase 설정
/firestore.rules         → Firestore 보안 규칙
/storage.rules           → Storage 보안 규칙
/functions/              → Cloud Functions
/lib/firebase.ts         → Firebase 초기화
```

### 라우팅

```
/App.tsx                 → 메인 라우팅
/pages/app/              → 고객 앱 페이지
/pages/admin/            → 관리자 페이지
/components/app/AppLayout.tsx      → 고객 레이아웃
/pages/admin/_layout/AdminLayout.tsx → 관리자 레이아웃
```

### 인증

```
/contexts/AuthContext.tsx   → 인증 상태 관리
/lib/auth.ts                → 인증 함수
/pages/app/Login.tsx        → 로그인 페이지
/pages/app/Signup.tsx       → 회원가입 페이지
```

### 주문 시스템

```
/types/order.ts             → 주문 타입
/lib/orders.api.ts          → 고객 주문 API
/lib/admin/orders.api.ts    → 관리자 주문 API
/pages/app/Checkout.tsx     → 결제 페이지
/pages/app/OrderTracking.tsx → 주문 추적
/pages/admin/Orders.tsx     → 주문 관리
```

---

## 🐛 자주 발생하는 에러

### 1. Module not found

```bash
❌ Error: Cannot find module 'react'

✅ 해결:
rm -rf node_modules package-lock.json
npm install
```

### 2. Port already in use

```bash
❌ Error: EADDRINUSE: address already in use :::5173

✅ 해결:
lsof -ti:5173 | xargs kill -9
npm run dev
```

### 3. Firebase 초기화 에러

```bash
❌ Firebase: Error (auth/invalid-api-key)

✅ 확인:
1. .env 파일이 루트에 있는지
2. VITE_ 접두사가 있는지
3. API 키가 정확한지
4. 개발 서버 재시작했는지
```

### 4. TypeScript 타입 에러

```bash
❌ Type 'string' is not assignable to type 'number'

✅ 해결:
1. 타입 정의 확인 (/types/)
2. any 타입 사용 지양
3. 타입 단언 사용: value as Type
```

### 5. CORS 에러

```bash
❌ CORS policy: No 'Access-Control-Allow-Origin'

✅ 해결:
firebase deploy --only storage
# 또는
gsutil cors set cors.json gs://버킷명
```

---

## 📱 테스트 URL

### 고객 앱

```
홈:           http://localhost:5173/
메뉴:         http://localhost:5173/menu
장바구니:     http://localhost:5173/cart
주문내역:     http://localhost:5173/order-history
마이페이지:   http://localhost:5173/my
로그인:       http://localhost:5173/login
```

### 관리자

```
대시보드:     http://localhost:5173/admin
주문 관리:    http://localhost:5173/admin/orders
메뉴 관리:    http://localhost:5173/admin/menus
리뷰 관리:    http://localhost:5173/admin/reviews
통합 리포트:  http://localhost:5173/admin/integrated-analytics
설정:         http://localhost:5173/admin/settings
```

### 개발 도구

```
DevTools:     http://localhost:5173/dev
```

---

## 🎯 Cursor AI 모범 사례

### ✅ 좋은 지시문

```
"pages/app/MenuDetail.tsx 파일에서
'장바구니 담기' 버튼을 다음과 같이 수정해줘:

1. 배경색: var(--color-primary)
2. 호버 시: var(--color-primary-hover)
3. 텍스트: '장바구니에 담기'로 변경
4. 아이콘: ShoppingCart 추가 (lucide-react)

기존 onClick 핸들러는 유지해줘."
```

### ❌ 나쁜 지시문

```
"버튼 고쳐줘"
```

---

## 🔐 환경변수 템플릿

```bash
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Payment
VITE_NICEPAY_MID=
VITE_NICEPAY_MERCHANT_KEY=

# Maps
VITE_GOOGLE_MAPS_API_KEY=

# App
VITE_APP_ENV=development
VITE_APP_DEBUG=true
```

---

## 📚 유용한 링크

```
프로젝트 문서:
📄 /README.md
📄 /CURSOR-AI-로컬-작업-완벽-가이드.md
📄 /WHITE-LABEL-README.md
📄 /DESIGN-LOCK-README.md
📄 /TROUBLESHOOTING.md

외부 문서:
🔗 React: https://react.dev/
🔗 Vite: https://vitejs.dev/
🔗 Firebase: https://firebase.google.com/docs
🔗 Tailwind: https://tailwindcss.com/
🔗 Cursor: https://cursor.sh/docs
```

---

## 🚀 빠른 시작 (5분)

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env
# .env 파일 수정

# 3. 개발 서버 시작
npm run dev

# 4. 브라우저 열기
# http://localhost:5173
```

---

**💡 Tip:** 이 카드를 Cursor AI에 북마크하여 언제든 참조하세요!

**작성:** KS컴퍼니  
**버전:** 1.0.0  
**최종 수정:** 2024-11-07
