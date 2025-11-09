# Phase 0-2: 디자인 시스템 및 브랜드 아이덴티티

## 🎯 목표

현풍닭칼국수 브랜드의 **일관된 디자인 시스템**을 구축하고, Tailwind CSS v4 디자인 토큰을 설정합니다.

---

## 📋 PRD (Product Requirements Document)

### 1. 브랜드 컬러 시스템

#### 1.1 Primary Colors (브랜드 핵심 색상)
```css
/* Hyunpung Red - 현풍레드 */
--hyunpung-red-50: #fef2f2;
--hyunpung-red-100: #fee2e2;
--hyunpung-red-200: #fecaca;
--hyunpung-red-300: #fca5a5;
--hyunpung-red-400: #f87171;
--hyunpung-red-500: #ef4444;
--hyunpung-red-600: #D61C1C;  /* 메인 브랜드 컬러 */
--hyunpung-red-700: #b91c1c;
--hyunpung-red-800: #991b1b;
--hyunpung-red-900: #7f1d1d;

/* Sinkal Orange - 신칼오렌지 */
--sinkal-orange-50: #fff7ed;
--sinkal-orange-100: #ffedd5;
--sinkal-orange-200: #fed7aa;
--sinkal-orange-300: #fdba74;
--sinkal-orange-400: #fb923c;
--sinkal-orange-500: #F37021;  /* 보조 브랜드 컬러 */
--sinkal-orange-600: #ea580c;
--sinkal-orange-700: #c2410c;
--sinkal-orange-800: #9a3412;
--sinkal-orange-900: #7c2d12;

/* Brass Bowl - 황동식기색 */
--brass-bowl-50: #fefce8;
--brass-bowl-100: #fef9c3;
--brass-bowl-200: #fef08a;
--brass-bowl-300: #fde047;
--brass-bowl-400: #facc15;
--brass-bowl-500: #C7A45A;  /* 포인트 컬러 */
--brass-bowl-600: #ca8a04;
--brass-bowl-700: #a16207;
--brass-bowl-800: #854d0e;
--brass-bowl-900: #713f12;
```

#### 1.2 Semantic Colors (의미론적 색상)
```css
/* Success - 성공, 완료 상태 */
--success-50: #f0fdf4;
--success-500: #10b981;
--success-600: #059669;

/* Warning - 경고, 대기 상태 */
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Error - 에러, 취소 상태 */
--error-50: #fef2f2;
--error-500: #ef4444;
--error-600: #dc2626;

/* Info - 정보, 안내 */
--info-50: #eff6ff;
--info-500: #3b82f6;
--info-600: #2563eb;
```

#### 1.3 Neutral Colors (중립 색상)
```css
/* Gray Scale */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
--gray-950: #030712;
```

---

### 2. 타이포그래피 시스템

#### 2.1 Font Family
```css
:root {
  --font-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
               'Roboto', 'Helvetica Neue', 'Arial', sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;
}
```

#### 2.2 Font Sizes
```css
:root {
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
}
```

#### 2.3 Font Weights
```css
:root {
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

#### 2.4 Line Heights
```css
:root {
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

---

### 3. Spacing System

#### 3.1 Spacing Scale
```css
:root {
  --spacing-0: 0px;
  --spacing-1: 0.25rem;    /* 4px */
  --spacing-2: 0.5rem;     /* 8px */
  --spacing-3: 0.75rem;    /* 12px */
  --spacing-4: 1rem;       /* 16px */
  --spacing-5: 1.25rem;    /* 20px */
  --spacing-6: 1.5rem;     /* 24px */
  --spacing-8: 2rem;       /* 32px */
  --spacing-10: 2.5rem;    /* 40px */
  --spacing-12: 3rem;      /* 48px */
  --spacing-16: 4rem;      /* 64px */
  --spacing-20: 5rem;      /* 80px */
  --spacing-24: 6rem;      /* 96px */
}
```

---

### 4. Border & Radius

#### 4.1 Border Radius
```css
:root {
  --radius-none: 0px;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-base: 0.25rem;  /* 4px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-full: 9999px;   /* 완전한 원 */
}
```

#### 4.2 Border Width
```css
:root {
  --border-0: 0px;
  --border-1: 1px;
  --border-2: 2px;
  --border-4: 4px;
  --border-8: 8px;
}
```

---

### 5. Shadow System

#### 5.1 Box Shadows
```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}
```

---

### 6. Component Styles

#### 6.1 Button Variants
```typescript
const buttonVariants = {
  primary: {
    bg: 'var(--hyunpung-red-600)',
    hover: 'var(--hyunpung-red-700)',
    text: '#ffffff',
  },
  secondary: {
    bg: 'var(--sinkal-orange-500)',
    hover: 'var(--sinkal-orange-600)',
    text: '#ffffff',
  },
  accent: {
    bg: 'var(--brass-bowl-500)',
    hover: 'var(--brass-bowl-600)',
    text: '#ffffff',
  },
  outline: {
    border: 'var(--hyunpung-red-600)',
    text: 'var(--hyunpung-red-600)',
    hover: 'var(--hyunpung-red-50)',
  },
  ghost: {
    text: 'var(--gray-700)',
    hover: 'var(--gray-100)',
  },
};
```

#### 6.2 Input Styles
```css
.input-base {
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--text-base);
  transition: all 0.2s;
}

.input-base:focus {
  outline: none;
  border-color: var(--hyunpung-red-600);
  box-shadow: 0 0 0 3px rgba(214, 28, 28, 0.1);
}
```

#### 6.3 Card Styles
```css
.card-base {
  background: #ffffff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-base);
  padding: var(--spacing-6);
}

.card-hover {
  transition: all 0.2s;
}

.card-hover:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

---

### 7. 아이콘 시스템

#### 7.1 브랜드 커스텀 아이콘
```typescript
// 파일: components/icons/index.ts

// BowlIcon - 그릇 모양 (메뉴, 주문)
export const BowlIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 9C3 9 6 3 12 3C18 3 21 9 21 9" stroke="currentColor" strokeWidth="2"/>
    <path d="M21 9C21 9 20 15 12 15C4 15 3 9 3 9" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 15V21" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 21H15" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// ChickenIcon - 닭 모양 (닭칼국수)
export const ChickenIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 16L10 21M12 16L14 21" stroke="currentColor" strokeWidth="2"/>
    <path d="M6 10C6 10 5 8 4 8" stroke="currentColor" strokeWidth="2"/>
    <path d="M18 10C18 10 19 8 20 8" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// NoodleIcon - 국수 모양
export const NoodleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 6C3 6 6 3 9 6C12 9 15 3 18 6C21 9 21 6 21 6" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 12C3 12 6 9 9 12C12 15 15 9 18 12C21 15 21 12 21 12" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 18C3 18 6 15 9 18C12 21 15 15 18 18C21 21 21 18 21 18" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// ChiliIcon - 고추 모양 (매운맛)
export const ChiliIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 3C12 3 10 5 10 8C10 11 12 13 12 16C12 19 10 21 10 21" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 3C14 3 16 5 16 7" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// SteamIcon - 김 모양 (뜨거운 음식)
export const SteamIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 18C6 18 6 15 8 15C10 15 10 18 12 18C14 18 14 15 16 15C18 15 18 18 18 18" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 12C8 12 8 9 10 9C12 9 12 12 12 12" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 12C16 12 16 9 14 9C12 9 12 12 12 12" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
```

#### 7.2 lucide-react 아이콘 매핑
```typescript
import {
  ShoppingCart,      // 장바구니
  Receipt,           // 주문/영수증
  Star,              // 리뷰/평점
  Gift,              // 쿠폰/선물
  Coins,             // 포인트
  Truck,             // 배달
  MessageCircle,     // 고객 지원
  Bell,              // 알림
  User,              // 사용자
  Settings,          // 설정
  ChevronRight,      // 우측 화살표
  ChevronLeft,       // 좌측 화살표
  X,                 // 닫기
  Check,             // 체크/완료
  AlertCircle,       // 경고
  Info,              // 정보
  Clock,             // 시간
  MapPin,            // 위치
  Phone,             // 전화
  Mail,              // 이메일
  Heart,             // 찜/좋아요
  Search,            // 검색
  Filter,            // 필터
  Plus,              // 추가
  Minus,             // 감소
  Trash,             // 삭제
  Edit,              // 수정
  Download,          // 다운로드
  Upload,            // 업로드
  Eye,               // 보기
  EyeOff,            // 숨기기
} from 'lucide-react';
```

---

### 8. 애니메이션 시스템

#### 8.1 Transition Duration
```css
:root {
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;
}
```

#### 8.2 Easing Functions
```css
:root {
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### 8.3 Common Animations
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## 📦 산출물

### 1. styles/globals.css
```css
@import "tailwindcss";

/* Design Tokens */
:root {
  /* Colors */
  --hyunpung-red: #D61C1C;
  --sinkal-orange: #F37021;
  --brass-bowl: #C7A45A;
  
  /* (위의 모든 디자인 토큰 포함) */
}

/* Base Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  color: var(--gray-900);
  background-color: var(--gray-50);
  line-height: var(--leading-normal);
}

/* Typography */
h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); }
h2 { font-size: var(--text-3xl); font-weight: var(--font-bold); }
h3 { font-size: var(--text-2xl); font-weight: var(--font-semibold); }
h4 { font-size: var(--text-xl); font-weight: var(--font-semibold); }
h5 { font-size: var(--text-lg); font-weight: var(--font-medium); }
h6 { font-size: var(--text-base); font-weight: var(--font-medium); }

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus Visible */
*:focus-visible {
  outline: 2px solid var(--hyunpung-red);
  outline-offset: 2px;
}
```

### 2. components/icons/index.ts
```typescript
export { BowlIcon } from './BowlIcon';
export { ChickenIcon } from './ChickenIcon';
export { NoodleIcon } from './NoodleIcon';
export { ChiliIcon } from './ChiliIcon';
export { SteamIcon } from './SteamIcon';
export { DeliveryIcon } from './DeliveryIcon';
export { CouponIcon } from './CouponIcon';
```

### 3. constants/colors.ts
```typescript
export const BRAND_COLORS = {
  hyunpungRed: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#D61C1C', // 메인
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  sinkalOrange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#F37021', // 메인
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  brassBowl: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#C7A45A', // 메인
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
} as const;

export const SEMANTIC_COLORS = {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;
```

---

## 💬 프롬프트

**아래 프롬프트를 AI에게 그대로 입력하세요:**

```
현풍닭칼국수 브랜드의 디자인 시스템을 구축합니다.

## 작업 목표
Tailwind CSS v4를 사용하여 일관된 디자인 토큰과 컴포넌트 스타일을 설정합니다.

## 브랜드 컬러 (필수 준수)
- 현풍레드 #D61C1C (Primary) - 메인 CTA, 강조
- 신칼오렌지 #F37021 (Secondary) - 보조 액션, 하이라이트
- 황동식기색 #C7A45A (Accent) - 포인트, 프리미엄

## 작업 내용

### 1. styles/globals.css 생성
- Tailwind CSS v4 임포트
- CSS 변수로 모든 디자인 토큰 정의
  - 브랜드 컬러 (50~900 shade)
  - Semantic 컬러 (success, warning, error, info)
  - 타이포그래피 (font-size, font-weight, line-height)
  - Spacing (0~24)
  - Border radius (sm~full)
  - Shadow (sm~2xl)
  - Duration & Easing
- 기본 HTML 스타일 (h1~h6, body)
- 접근성 클래스 (.sr-only)
- Focus-visible 스타일

### 2. components/icons/ 디렉토리 생성
각 아이콘을 개별 파일로 생성:
- BowlIcon.tsx - 그릇 모양
- ChickenIcon.tsx - 닭 모양
- NoodleIcon.tsx - 국수 모양
- ChiliIcon.tsx - 고추 모양
- SteamIcon.tsx - 김 모양
- DeliveryIcon.tsx - 배달 트럭
- CouponIcon.tsx - 쿠폰/티켓

각 아이콘:
- SVG 24x24 사이즈
- currentColor 사용 (색상 상속)
- stroke-width: 2
- 시맨틱 패스 명명

### 3. constants/colors.ts 생성
- BRAND_COLORS 객체 (TypeScript const assertion)
- SEMANTIC_COLORS 객체
- 타입 안전성 보장

## 구현 원칙
1. ✅ Tailwind v4 문법 사용 (@import "tailwindcss")
2. ✅ CSS 변수 기반 토큰 시스템
3. ✅ 접근성 고려 (명도 대비, 포커스 인디케이터)
4. ✅ 다크 모드 대비 설계 (추후 확장 가능)
5. ✅ 모든 아이콘 SVG 직접 생성 (외부 파일 없음)

## 파일 생성 요청
1. /styles/globals.css
2. /components/icons/BowlIcon.tsx
3. /components/icons/ChickenIcon.tsx
4. /components/icons/NoodleIcon.tsx
5. /components/icons/ChiliIcon.tsx
6. /components/icons/SteamIcon.tsx
7. /components/icons/DeliveryIcon.tsx
8. /components/icons/CouponIcon.tsx
9. /components/icons/index.ts
10. /constants/colors.ts

모든 파일을 100% 완성된 형태로 생성해주세요.
플레이스홀더나 TODO 주석 없이 완전히 작동하는 코드만 작성합니다.
```

---

## ✅ 검증 체크리스트

- [ ] `styles/globals.css` 파일이 생성되었는가?
- [ ] 모든 브랜드 컬러가 CSS 변수로 정의되었는가?
- [ ] 타이포그래피 토큰 (size, weight, line-height)이 설정되었는가?
- [ ] Spacing 시스템 (0~24)이 정의되었는가?
- [ ] Shadow, Radius, Duration 토큰이 설정되었는가?
- [ ] 7개의 커스텀 아이콘이 모두 생성되었는가?
- [ ] 각 아이콘이 `currentColor`를 사용하는가?
- [ ] `components/icons/index.ts`에서 모든 아이콘을 export하는가?
- [ ] `constants/colors.ts`에 타입 안전한 컬러 객체가 있는가?
- [ ] 접근성 스타일 (sr-only, focus-visible)이 포함되었는가?

---

## 📌 다음 단계

**03-project-setup.md** - 프로젝트 초기 설정 및 환경 구성

---

**작성일**: 2025-10-31  
**작성자**: 현풍닭칼국수 개발팀  
**개발사**: KS컴퍼니
