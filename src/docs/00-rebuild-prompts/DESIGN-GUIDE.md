# 🎨 현풍닭칼국수 PWA - 완벽 디자인 가이드

## 📋 목차

1. [디자인 환경 및 도구](#1-디자인-환경-및-도구)
2. [브랜드 아이덴티티](#2-브랜드-아이덴티티)
3. [디자인 토큰 시스템](#3-디자인-토큰-시스템)
4. [컬러 시스템](#4-컬러-시스템)
5. [타이포그래피](#5-타이포그래피)
6. [Spacing & Layout](#6-spacing--layout)
7. [Border & Shadow](#7-border--shadow)
8. [아이콘 시스템](#8-아이콘-시스템)
9. [컴포넌트 디자인 패턴](#9-컴포넌트-디자인-패턴)
10. [페이지 레이아웃 구조](#10-페이지-레이아웃-구조)
11. [반응형 디자인](#11-반응형-디자인)
12. [애니메이션 & 인터랙션](#12-애니메이션--인터랙션)
13. [접근성 디자인](#13-접근성-디자인)
14. [UI/UX 패턴](#14-uiux-패턴)
15. [개발자 핸드오프](#15-개발자-핸드오프)

---

## 1. 디자인 환경 및 도구

### 1.1 디자인 시스템 스택

```yaml
디자인 도구:
  - Figma: 디자인 소스 및 프로토타이핑
  - Figma → Code: 자동 코드 변환 (AI 지원)

CSS 프레임워크:
  - Tailwind CSS v4.0: 유틸리티 기반 스타일링
  - CSS Variables: 디자인 토큰 관리

UI 라이브러리:
  - shadcn/ui: 44개 컴포넌트
  - Radix UI: Headless 컴포넌트 (접근성)
  - Lucide React: 아이콘 (1000개 이상)

타이포그래피:
  - Pretendard: 한글 웹폰트 (Variable Font)
  - 시스템 폰트 Fallback: -apple-system, sans-serif

이미지:
  - Unsplash API: 고품질 음식 사진
  - WebP 포맷: 최적화
  - Lazy Loading: 성능

애니메이션:
  - Motion (Framer Motion): 고급 애니메이션
  - Tailwind Transitions: 간단한 애니메이션
```

### 1.2 디자인 파일 구조

```
/styles/
  └── globals.css              # 글로벌 스타일 + 디자인 토큰

/components/
  ├── ui/                      # shadcn/ui (44개)
  ├── icons/                   # 커스텀 아이콘 (7개)
  ├── shared/                  # 공유 컴포넌트
  ├── app/                     # 주문자 앱 컴포넌트
  ├── admin/                   # 관리자 컴포넌트
  └── brand/                   # 브랜드 컴포넌트

/constants/
  └── colors.ts                # 컬러 상수

/guidelines/
  ├── DesignTokens.md          # 디자인 토큰 문서
  └── Guidelines.md            # 사용 가이드
```

---

## 2. 브랜드 아이덴티티

### 2.1 브랜드 핵심 가치

```yaml
브랜드명: 현풍닭칼국수
슬로건: "40년 전통의 깊은 맛"

핵심 가치:
  - 전통: 40년 역사, 비법 육수
  - 정성: 매일 아침 직접 뽑는 면
  - 신뢰: 국내산 닭고기만 사용

타겟:
  - 주: 30-50대 가족 단위
  - 부: 20대 직장인, 학생

브랜드 톤앤매너:
  - 따뜻하고 친근한
  - 전통적이지만 현대적인
  - 신뢰할 수 있는
  - 맛있어 보이는
```

### 2.2 브랜드 컬러 철학

```
현풍레드 (#D61C1C)
  ├─ 의미: 따뜻함, 열정, 전통
  ├─ 용도: 주요 CTA, 강조, 브랜드 아이덴티티
  └─ 연상: 고추, 따뜻한 국물, 뜨거운 음식

신칼오렌지 (#F37021)
  ├─ 의미: 활력, 맛, 식욕
  ├─ 용도: 보조 액션, 하이라이트, 포인트
  └─ 연상: 따뜻한 조명, 신선함, 에너지

황동식기색 (#C7A45A)
  ├─ 의미: 전통, 고급, 프리미엄
  ├─ 용도: 포인트, 특별 할인, 등급
  └─ 연상: 황동 그릇, 전통 식기, 프리미엄
```

### 2.3 로고 시스템

```typescript
로고 구성:
  - 워드마크: "현풍닭칼국수" (Pretendard Bold)
  - 심볼: BowlIcon (그릇 모양)
  - 컬러: 현풍레드 (#D61C1C)

로고 사용 규칙:
  ├─ 최소 크기: 120px (가로)
  ├─ 여백: 로고 높이의 50% 이상
  ├─ 변형 금지: 비율, 색상, 회전
  └─ 배경: 흰색 또는 밝은 회색만

로고 변형:
  ├─ Primary: 컬러 (현풍레드)
  ├─ White: 어두운 배경용
  ├─ Black: 단색 인쇄용
  └─ Simplified: 파비콘용 (아이콘만)
```

---

## 3. 디자인 토큰 시스템

### 3.1 토큰 구조

```css
/* styles/globals.css */
:root {
  /* Brand Colors */
  --hyunpung-red-50: #fef2f2;
  --hyunpung-red-600: #D61C1C;  /* 메인 */
  --hyunpung-red-700: #b91c1c;
  
  --sinkal-orange-500: #F37021;  /* 메인 */
  --brass-bowl-500: #C7A45A;     /* 메인 */
  
  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Typography */
  --font-sans: 'Pretendard', -apple-system, sans-serif;
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  
  /* Spacing */
  --spacing-0: 0px;
  --spacing-1: 0.25rem;    /* 4px */
  --spacing-2: 0.5rem;     /* 8px */
  --spacing-3: 0.75rem;    /* 12px */
  --spacing-4: 1rem;       /* 16px */
  --spacing-6: 1.5rem;     /* 24px */
  --spacing-8: 2rem;       /* 32px */
  --spacing-12: 3rem;      /* 48px */
  
  /* Border Radius */
  --radius-sm: 0.125rem;   /* 2px */
  --radius-base: 0.25rem;  /* 4px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-full: 9999px;   /* 완전한 원 */
  
  /* Shadow */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  
  /* Animation */
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 3.2 Tailwind 설정

```javascript
// tailwind.config.js (v4)
export default {
  theme: {
    extend: {
      colors: {
        hyunpung: {
          red: {
            50: 'var(--hyunpung-red-50)',
            600: 'var(--hyunpung-red-600)',
            700: 'var(--hyunpung-red-700)',
          }
        },
        sinkal: {
          orange: 'var(--sinkal-orange-500)',
        },
        brass: {
          bowl: 'var(--brass-bowl-500)',
        }
      }
    }
  }
}
```

---

## 4. 컬러 시스템

### 4.1 Primary Colors (브랜드)

```css
/* 현풍레드 - Hyunpung Red */
--hyunpung-red-50: #fef2f2;   /* 배경 (hover, active) */
--hyunpung-red-100: #fee2e2;  /* 배경 (light) */
--hyunpung-red-200: #fecaca;  /* 테두리 (light) */
--hyunpung-red-300: #fca5a5;  /* 비활성화 */
--hyunpung-red-400: #f87171;  /* 보조 */
--hyunpung-red-500: #ef4444;  /* 보조 */
--hyunpung-red-600: #D61C1C;  /* 🎯 메인 브랜드 */
--hyunpung-red-700: #b91c1c;  /* 어두운 버전 */
--hyunpung-red-800: #991b1b;  /* 매우 어두운 */
--hyunpung-red-900: #7f1d1d;  /* 텍스트용 */

/* 신칼오렌지 - Sinkal Orange */
--sinkal-orange-50: #fff7ed;
--sinkal-orange-500: #F37021;  /* 🎯 메인 */
--sinkal-orange-600: #ea580c;  /* 어두운 버전 */

/* 황동식기색 - Brass Bowl */
--brass-bowl-50: #fefce8;
--brass-bowl-500: #C7A45A;     /* 🎯 메인 */
--brass-bowl-600: #ca8a04;     /* 어두운 버전 */
```

### 4.2 Semantic Colors (의미론적)

```css
/* Success - 성공, 완료 */
--success-50: #f0fdf4;
--success-500: #10b981;  /* 주문 완료, 배달 완료 */
--success-600: #059669;

/* Warning - 경고, 대기 */
--warning-50: #fffbeb;
--warning-500: #f59e0b;  /* 조리 중, 대기 중 */
--warning-600: #d97706;

/* Error - 에러, 취소 */
--error-50: #fef2f2;
--error-500: #ef4444;    /* 취소, 거부, 품절 */
--error-600: #dc2626;

/* Info - 정보, 안내 */
--info-50: #eff6ff;
--info-500: #3b82f6;     /* 알림, 정보 */
--info-600: #2563eb;
```

### 4.3 Neutral Colors (중립)

```css
/* Gray Scale - UI 기본 */
--gray-50: #f9fafb;    /* 배경 */
--gray-100: #f3f4f6;   /* 배경 (hover) */
--gray-200: #e5e7eb;   /* 테두리 */
--gray-300: #d1d5db;   /* 테두리 (강조) */
--gray-400: #9ca3af;   /* 비활성 텍스트 */
--gray-500: #6b7280;   /* 보조 텍스트 */
--gray-600: #4b5563;   /* 일반 텍스트 */
--gray-700: #374151;   /* 강조 텍스트 */
--gray-800: #1f2937;   /* 헤딩 */
--gray-900: #111827;   /* 타이틀 */
--gray-950: #030712;   /* 최대 강조 */
```

### 4.4 컬러 사용 규칙

```typescript
// 버튼 컬러
Primary Button: bg-hyunpung-red-600 hover:bg-hyunpung-red-700
Secondary Button: bg-sinkal-orange-500 hover:bg-sinkal-orange-600
Accent Button: bg-brass-bowl-500 hover:bg-brass-bowl-600
Outline Button: border-hyunpung-red-600 text-hyunpung-red-600
Ghost Button: hover:bg-gray-100

// 상태별 컬러
결제 완료: blue-500
접수: indigo-500
조리 중: orange-500 (warning)
배달 중: red-500 (hyunpung-red)
완료: green-500 (success)
취소: gray-500

// 텍스트 컬러
Primary Text: gray-900
Secondary Text: gray-600
Disabled Text: gray-400
Link: hyunpung-red-600
Price: hyunpung-red-600 (강조)

// 배경 컬러
Page Background: gray-50
Card Background: white
Hover Background: gray-100
Active Background: hyunpung-red-50
```

---

## 5. 타이포그래피

### 5.1 폰트 패밀리

```css
/* 주 폰트 */
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 
             'Segoe UI', 'Roboto', 'Helvetica Neue', 
             'Arial', sans-serif;

/* 모노스페이스 (주문번호, 코드) */
font-family: 'Fira Code', 'SF Mono', 'Courier New', monospace;
```

### 5.2 폰트 스케일

```css
/* Heading */
h1: text-4xl (36px) font-bold leading-tight
h2: text-3xl (30px) font-bold leading-tight
h3: text-2xl (24px) font-semibold leading-snug
h4: text-xl (20px) font-semibold leading-snug
h5: text-lg (18px) font-medium leading-normal
h6: text-base (16px) font-medium leading-normal

/* Body */
text-base (16px): 기본 본문
text-sm (14px): 작은 텍스트, 설명
text-xs (12px): 메타 정보, 캡션

/* Display */
text-5xl (48px): 히어로 타이틀
text-6xl (60px): 특별 강조
```

### 5.3 폰트 굵기

```css
font-light: 300      /* 연한 텍스트 */
font-normal: 400     /* 일반 본문 */
font-medium: 500     /* 강조 본문 */
font-semibold: 600   /* 소제목 */
font-bold: 700       /* 제목, CTA */
font-extrabold: 800  /* 특별 강조 */
```

### 5.4 줄 높이

```css
leading-none: 1          /* 타이트한 제목 */
leading-tight: 1.25      /* 제목 */
leading-snug: 1.375      /* 소제목 */
leading-normal: 1.5      /* 본문 (기본) */
leading-relaxed: 1.625   /* 편안한 본문 */
leading-loose: 2         /* 여유있는 본문 */
```

### 5.5 타이포그래피 사용 예시

```tsx
// 페이지 타이틀
<h1 className="text-4xl font-bold text-gray-900 mb-4">
  현풍닭칼국수
</h1>

// 섹션 제목
<h2 className="text-2xl font-semibold text-gray-800 mb-6">
  인기 메뉴
</h2>

// 본문
<p className="text-base text-gray-600 leading-relaxed">
  40년 전통의 비법 육수로 우려낸 깊은 맛
</p>

// 가격
<span className="text-2xl font-bold text-hyunpung-red-600">
  9,000원
</span>

// 메타 정보
<span className="text-xs text-gray-500">
  2025.10.31
</span>

// 주문번호
<code className="font-mono text-sm">
  HP-20251031-0001
</code>
```

---

## 6. Spacing & Layout

### 6.1 Spacing Scale

```css
/* 4px 기반 스케일 */
spacing-0: 0px
spacing-1: 4px      /* 매우 작은 간격 */
spacing-2: 8px      /* 작은 간격 */
spacing-3: 12px     /* 기본 간격 */
spacing-4: 16px     /* 표준 간격 */
spacing-5: 20px
spacing-6: 24px     /* 큰 간격 */
spacing-8: 32px     /* 섹션 간격 */
spacing-10: 40px
spacing-12: 48px    /* 페이지 간격 */
spacing-16: 64px
spacing-20: 80px
spacing-24: 96px    /* 매우 큰 간격 */
```

### 6.2 Container 설정

```css
/* 페이지 컨테이너 */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;  /* 16px */
}

@media (min-width: 640px) {
  .container { padding: 0 2rem; }  /* 32px */
}
```

### 6.3 Grid 시스템

```css
/* 메뉴 그리드 */
.menu-grid {
  display: grid;
  gap: 1.5rem;  /* 24px */
}

/* 반응형 그리드 */
grid-cols-1           /* Mobile: 1열 */
md:grid-cols-2        /* Tablet: 2열 */
lg:grid-cols-3        /* Desktop: 3열 */
xl:grid-cols-4        /* Large: 4열 */
```

### 6.4 레이아웃 패턴

```tsx
// 페이지 레이아웃
<div className="min-h-screen bg-gray-50 p-4">
  <div className="max-w-7xl mx-auto">
    {/* Content */}
  </div>
</div>

// 카드 그리드
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// 사이드바 레이아웃
<div className="flex gap-6">
  <aside className="w-64 flex-shrink-0">
    {/* Sidebar */}
  </aside>
  <main className="flex-1">
    {/* Main Content */}
  </main>
</div>
```

---

## 7. Border & Shadow

### 7.1 Border Radius

```css
/* 모서리 둥글기 */
rounded-none: 0px
rounded-sm: 2px       /* Input, 작은 요소 */
rounded: 4px          /* 기본 */
rounded-md: 6px       /* 버튼 */
rounded-lg: 8px       /* 카드 */
rounded-xl: 12px      /* 큰 카드 */
rounded-2xl: 16px     /* 모달 */
rounded-full: 9999px  /* 원형 (Avatar, Badge) */
```

### 7.2 Border Width

```css
border: 1px           /* 기본 테두리 */
border-2: 2px         /* 강조 테두리 */
border-4: 4px         /* 매우 강조 */
```

### 7.3 Shadow (그림자)

```css
/* 카드 그림자 */
shadow-sm: 0 1px 2px rgba(0,0,0,0.05)     /* 약한 그림자 */
shadow: 0 1px 3px rgba(0,0,0,0.1)         /* 기본 그림자 */
shadow-md: 0 4px 6px rgba(0,0,0,0.1)      /* 카드 */
shadow-lg: 0 10px 15px rgba(0,0,0,0.1)    /* 부각된 카드 */
shadow-xl: 0 20px 25px rgba(0,0,0,0.1)    /* 모달 */
shadow-2xl: 0 25px 50px rgba(0,0,0,0.25)  /* 최대 강조 */

/* 사용 예시 */
Card Default: shadow-md
Card Hover: shadow-lg
Modal: shadow-xl
Dropdown: shadow-lg
```

### 7.4 포커스 링

```css
/* 접근성: 키보드 포커스 */
focus:outline-none
focus:ring-2
focus:ring-hyunpung-red-600
focus:ring-offset-2
```

---

## 8. 아이콘 시스템

### 8.1 커스텀 아이콘 (7개)

```typescript
// components/icons/
1. BowlIcon.tsx      - 🍜 그릇 (메뉴, 주문)
2. ChickenIcon.tsx   - 🐔 닭 (닭칼국수)
3. NoodleIcon.tsx    - 🍝 국수 (칼국수)
4. ChiliIcon.tsx     - 🌶️ 고추 (맵기)
5. SteamIcon.tsx     - 💨 김 (뜨거움)
6. DeliveryIcon.tsx  - 🚚 배달 트럭
7. CouponIcon.tsx    - 🎟️ 쿠폰/티켓

// 사용 예시
import { BowlIcon } from './components/icons';

<BowlIcon className="w-6 h-6 text-hyunpung-red-600" />
```

### 8.2 아이콘 규격

```typescript
// 크기
xs: 12px (w-3 h-3)
sm: 16px (w-4 h-4)
md: 24px (w-6 h-6)  // 기본
lg: 32px (w-8 h-8)
xl: 48px (w-12 h-12)

// 스트로크
stroke-width: 2px   // 기본
currentColor        // 부모 색상 상속

// SVG 속성
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
```

### 8.3 Lucide 아이콘 (외부)

```typescript
import {
  ShoppingCart,      // 장바구니
  Receipt,           // 주문
  Star,              // 리뷰/평점
  Gift,              // 쿠폰
  Coins,             // 포인트
  Truck,             // 배달
  MessageCircle,     // 지원
  Bell,              // 알림
  User,              // 사용자
  Settings,          // 설정
  ChevronRight,      // 우측 화살표
  Check,             // 체크
  X,                 // 닫기
  AlertCircle,       // 경고
  Clock,             // 시간
  MapPin,            // 위치
  Phone,             // 전화
  Search,            // 검색
  Plus,              // 추가
  Minus,             // 감소
  Edit,              // 수정
  Trash,             // 삭제
} from 'lucide-react';

// 사용
<ShoppingCart className="w-6 h-6" />
```

---

## 9. 컴포넌트 디자인 패턴

### 9.1 Button 컴포넌트

```tsx
// 버튼 Variants
<Button variant="default">   {/* 현풍레드 */}
<Button variant="secondary"> {/* 신칼오렌지 */}
<Button variant="accent">    {/* 황동식기색 */}
<Button variant="outline">   {/* 테두리만 */}
<Button variant="ghost">     {/* 투명 */}
<Button variant="destructive"> {/* 빨강 (삭제) */}

// 버튼 Sizes
<Button size="sm">   {/* 작은 버튼 */}
<Button size="md">   {/* 기본 */}
<Button size="lg">   {/* 큰 버튼 */}

// 디자인 명세
Default: 
  bg-hyunpung-red-600 
  hover:bg-hyunpung-red-700
  text-white
  px-6 py-3
  rounded-md
  font-medium
  transition-colors duration-200
  
Disabled:
  opacity-50
  cursor-not-allowed
  pointer-events-none
```

### 9.2 Card 컴포넌트

```tsx
// 기본 카드
<Card className="p-6">
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardContent>
    내용
  </CardContent>
  <CardFooter>
    액션 버튼
  </CardFooter>
</Card>

// 디자인 명세
Card:
  bg-white
  border border-gray-200
  rounded-lg
  shadow-md
  
Card Hover:
  shadow-lg
  transform: translateY(-2px)
  transition: all 200ms
```

### 9.3 Input 컴포넌트

```tsx
// 기본 Input
<Input 
  type="text"
  placeholder="입력하세요"
/>

// 디자인 명세
Input:
  border border-gray-300
  rounded-md
  px-4 py-3
  text-base
  
Input Focus:
  outline-none
  border-hyunpung-red-600
  ring-4 ring-hyunpung-red-600/10
  
Input Error:
  border-error-500
  ring-error-500/10
```

### 9.4 Badge 컴포넌트

```tsx
// 배지 Variants
<Badge variant="default">기본</Badge>
<Badge variant="success">완료</Badge>
<Badge variant="warning">대기</Badge>
<Badge variant="error">취소</Badge>
<Badge variant="outline">테두리</Badge>

// 디자인 명세
Badge:
  px-3 py-1
  rounded-full
  text-xs font-medium
  
Success:
  bg-success-50
  text-success-700
  border border-success-200
```

### 9.5 Modal/Dialog 컴포넌트

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>제목</DialogTitle>
      <DialogDescription>설명</DialogDescription>
    </DialogHeader>
    
    <div>{/* Content */}</div>
    
    <DialogFooter>
      <Button variant="outline">취소</Button>
      <Button>확인</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// 디자인 명세
Dialog Overlay:
  bg-black/50
  backdrop-blur-sm
  
Dialog Content:
  bg-white
  rounded-2xl
  shadow-xl
  max-w-md
  p-6
```

---

## 10. 페이지 레이아웃 구조

### 10.1 주문자 앱 레이아웃

```tsx
// AppLayout 구조
┌────────────────────────┐
│ [AppHeader]            │ ← 상단 고정
├────────────────────────┤
│                        │
│                        │
│  [Main Content]        │ ← 스크롤 영역
│  (min-h-screen)        │
│                        │
│                        │
├────────────────────────┤
│ [BottomNav]            │ ← 하단 고정 (모바일)
└────────────────────────┘

// AppHeader
- 높이: 64px (h-16)
- 배경: white
- 그림자: shadow-sm
- 내용: 뒤로가기, 타이틀, 장바구니

// BottomNav (모바일)
- 높이: 64px
- 배경: white
- 그림자: shadow-lg
- 아이템: 4개 (홈, 메뉴, 주문, MY)
```

### 10.2 관리자 대시보드 레이아웃

```tsx
// AdminLayout 구조 (Desktop)
┌───────────┬────────────────────────┐
│           │ [Header]               │
│ [Sidebar] ├────────────────────────┤
│           │                        │
│  - 메뉴   │                        │
│  - 메뉴   │  [Main Content]        │
│  - 메뉴   │                        │
│           │                        │
│           │                        │
└───────────┴────────────────────────┘

// Sidebar
- 너비: 256px (w-64)
- 배경: white
- 테두리: border-r

// Main Content
- 패딩: p-8
- 배경: gray-50
- 최대 너비: max-w-7xl
```

### 10.3 페이지별 레이아웃

```tsx
// 1. 홈 (랜딩)
<div>
  <Hero />              {/* 전체 화면 */}
  <MenuSection />       {/* 그리드 */}
  <BrandStory />        {/* 2열 */}
  <Contact />           {/* 1열 */}
</div>

// 2. 메뉴 리스트
<div className="p-4">
  <SearchBar />         {/* 검색 */}
  <CategoryFilter />    {/* 탭 */}
  <MenuGrid />          {/* 그리드 */}
</div>

// 3. 메뉴 상세
<div>
  <MenuImages />        {/* 캐러셀 */}
  <MenuInfo />          {/* 정보 */}
  <OptionGroups />      {/* 옵션 */}
  <QuantitySelector />  {/* 수량 */}
  <CTAButton />         {/* 하단 고정 */}
</div>

// 4. 주문 추적
<div className="p-4">
  <ProgressStepper />   {/* 상단 */}
  <DeliveryMap />       {/* 지도 */}
  <OrderDetails />      {/* 상세 */}
  <Timeline />          {/* 타임라인 */}
</div>
```

---

## 11. 반응형 디자인

### 11.1 Breakpoints

```css
/* Tailwind Breakpoints */
sm: 640px   /* 모바일 가로 */
md: 768px   /* 태블릿 세로 */
lg: 1024px  /* 태블릿 가로 / 작은 데스크톱 */
xl: 1280px  /* 데스크톱 */
2xl: 1536px /* 대형 데스크톱 */
```

### 11.2 Mobile First 전략

```tsx
// 기본: 모바일 (320px~)
<div className="p-4 grid grid-cols-1 gap-4">

// 태블릿 (768px~)
<div className="md:p-6 md:grid-cols-2 md:gap-6">

// 데스크톱 (1024px~)
<div className="lg:p-8 lg:grid-cols-3 lg:gap-8">
```

### 11.3 반응형 패턴

```tsx
// 1. 그리드 변경
grid-cols-1          // Mobile: 1열
md:grid-cols-2       // Tablet: 2열
lg:grid-cols-3       // Desktop: 3열
xl:grid-cols-4       // Large: 4열

// 2. 숨김/보임
hidden lg:block      // 모바일 숨김, 데스크톱 표시
block lg:hidden      // 모바일 표시, 데스크톱 숨김

// 3. 텍스트 크기
text-2xl lg:text-4xl // 모바일 24px, 데스크톱 36px

// 4. 패딩/마진
p-4 lg:p-8          // 모바일 16px, 데스크톱 32px

// 5. 플렉스 방향
flex-col lg:flex-row // 모바일 세로, 데스크톱 가로
```

### 11.4 반응형 네비게이션

```tsx
// Mobile: BottomNav
<nav className="lg:hidden fixed bottom-0 ...">
  {/* 하단 네비게이션 */}
</nav>

// Desktop: Sidebar
<aside className="hidden lg:block w-64 ...">
  {/* 좌측 사이드바 */}
</aside>
```

---

## 12. 애니메이션 & 인터랙션

### 12.1 Transition Duration

```css
transition-fast: 150ms
transition-base: 200ms
transition-slow: 300ms
transition-slower: 500ms

/* 사용 */
transition-all duration-200
transition-colors duration-150
```

### 12.2 Easing Functions

```css
ease-linear: linear
ease-in: cubic-bezier(0.4, 0, 1, 1)
ease-out: cubic-bezier(0, 0, 0.2, 1)
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

### 12.3 Common Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { 
    transform: translateY(10px); 
    opacity: 0; 
  }
  to { 
    transform: translateY(0); 
    opacity: 1; 
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Bounce */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### 12.4 Hover Effects

```tsx
// 버튼
hover:bg-hyunpung-red-700
hover:scale-105
active:scale-95
transition-all duration-200

// 카드
hover:shadow-lg
hover:transform hover:-translate-y-1
transition-all duration-200

// 링크
hover:text-hyunpung-red-700
hover:underline
transition-colors duration-150
```

### 12.5 Motion (Framer Motion)

```tsx
import { motion } from 'motion/react';

// Fade In
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>

// Slide In
<motion.div
  initial={{ x: -20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.3 }}
>

// Stagger Children
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
  initial="hidden"
  animate="show"
>
```

---

## 13. 접근성 디자인

### 13.1 WCAG 2.1 AA 준수

```tsx
// 1. 시맨틱 HTML
<header>
<nav>
<main>
<article>
<section>
<aside>
<footer>

// 2. ARIA Labels
<button aria-label="장바구니">
  <ShoppingCart />
</button>

// 3. 키보드 네비게이션
tabIndex={0}
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
}}

// 4. 포커스 인디케이터
focus:outline-none
focus:ring-2
focus:ring-hyunpung-red-600
focus:ring-offset-2
```

### 13.2 명도 대비 (Contrast Ratio)

```css
/* WCAG AA 기준: 4.5:1 이상 */

/* ✅ 통과 */
text-gray-900 on white       /* 21:1 */
text-gray-700 on white       /* 8.6:1 */
text-hyunpung-red-600 on white  /* 5.2:1 */

/* ❌ 불통과 */
text-gray-400 on white       /* 2.9:1 */
text-gray-300 on white       /* 1.8:1 */

/* 큰 텍스트(18px+, bold): 3:1 이상 */
```

### 13.3 스크린 리더 지원

```tsx
// 1. Skip to Content
<a href="#main-content" className="sr-only focus:not-sr-only">
  본문으로 건너뛰기
</a>

// 2. Hidden Text
<span className="sr-only">
  현재 페이지: 메뉴
</span>

// 3. ARIA Live Regions
<div role="status" aria-live="polite">
  {successMessage}
</div>

// 4. ARIA Descriptions
<img 
  src={menu.image} 
  alt={menu.name}
  aria-describedby="menu-desc"
/>
<p id="menu-desc" className="sr-only">
  {menu.description}
</p>
```

### 13.4 접근성 클래스

```css
/* Screen Reader Only */
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
.focus-visible:focus {
  outline: 2px solid var(--hyunpung-red-600);
  outline-offset: 2px;
}
```

---

## 14. UI/UX 패턴

### 14.1 로딩 상태

```tsx
// Skeleton
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>

// Spinner
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hyunpung-red-600"></div>

// Progress Bar
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className="bg-hyunpung-red-600 h-2 rounded-full transition-all"
    style={{ width: `${progress}%` }}
  />
</div>
```

### 14.2 에러 상태

```tsx
// Inline Error
<div className="flex items-center gap-2 text-error-600 text-sm mt-1">
  <AlertCircle className="w-4 h-4" />
  <span>{error}</span>
</div>

// Alert
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>오류</AlertTitle>
  <AlertDescription>{errorMessage}</AlertDescription>
</Alert>

// Empty State
<EmptyState
  icon={<ShoppingCart size={64} />}
  title="장바구니가 비어있습니다"
  description="맛있는 메뉴를 담아보세요"
  action={{
    text: "메뉴 보기",
    href: "/menu"
  }}
/>
```

### 14.3 성공 피드백

```tsx
// Toast (Sonner)
import { toast } from 'sonner@2.0.3';

toast.success('장바구니에 담았습니다!');
toast.error('주문에 실패했습니다');
toast.info('새 주문이 있습니다');

// Success Message
<div className="flex items-center gap-2 text-success-600 bg-success-50 p-4 rounded-lg">
  <Check className="w-5 h-5" />
  <span>주문이 완료되었습니다</span>
</div>
```

### 14.4 인터랙티브 요소

```tsx
// Hover Effect
<button className="
  transition-all duration-200
  hover:scale-105 hover:shadow-lg
  active:scale-95
">

// Focus Effect
<input className="
  focus:outline-none
  focus:ring-2 focus:ring-hyunpung-red-600
  focus:border-hyunpung-red-600
">

// Disabled State
<button 
  disabled
  className="opacity-50 cursor-not-allowed"
>
```

---

## 15. 개발자 핸드오프

### 15.1 Figma → Code 매핑

```tsx
// Figma 컴포넌트 → React 컴포넌트
Figma Frame → <div>
Figma Auto Layout → flex or grid
Figma Text → <p>, <h1>, <span>
Figma Rectangle → <div>
Figma Button → <Button>
Figma Input → <Input>

// Figma 스타일 → Tailwind Class
Fill → bg-{color}
Stroke → border border-{color}
Corner Radius → rounded-{size}
Shadow → shadow-{size}
Padding → p-{size}
Gap → gap-{size}
```

### 15.2 디자인 토큰 사용

```tsx
// ❌ 하드코딩 금지
<div style={{ color: '#D61C1C' }}>

// ✅ 디자인 토큰 사용
<div className="text-hyunpung-red-600">

// ✅ CSS 변수 사용
<div style={{ color: 'var(--hyunpung-red-600)' }}>
```

### 15.3 컴포넌트 재사용

```tsx
// ❌ 중복 코드
<button className="bg-hyunpung-red-600 text-white px-4 py-2 rounded-md">
  버튼 1
</button>
<button className="bg-hyunpung-red-600 text-white px-4 py-2 rounded-md">
  버튼 2
</button>

// ✅ 컴포넌트 재사용
<Button>버튼 1</Button>
<Button>버튼 2</Button>
```

### 15.4 상태별 디자인

```tsx
// 주문 상태별 색상
const statusColors = {
  pending: 'blue',
  confirmed: 'indigo',
  preparing: 'orange',
  delivering: 'red',
  completed: 'green',
  cancelled: 'gray',
};

<Badge variant={statusColors[order.status]}>
  {getStatusLabel(order.status)}
</Badge>
```

### 15.5 디자인 체크리스트

```markdown
✅ 브랜드 컬러 사용 (현풍레드, 신칼오렌지, 황동식기색)
✅ 디자인 토큰 활용 (CSS 변수)
✅ 반응형 디자인 (Mobile First)
✅ 접근성 준수 (WCAG 2.1 AA)
✅ 일관된 Spacing (4px 단위)
✅ 적절한 Shadow
✅ Hover/Focus 상태
✅ 로딩/에러/빈 상태
✅ 애니메이션 (부드러운 전환)
✅ 개발사 정보 삽입 (KS컴퍼니)
```

---

## 📚 참고 자료

### 디자인 문서
- `/docs/02-design/` - 디자인 기획서 및 완료 보고서
- `/guidelines/DesignTokens.md` - 디자인 토큰 문서
- `/guidelines/Guidelines.md` - 사용 가이드

### 컴포넌트
- `/components/ui/` - shadcn/ui 컴포넌트 (44개)
- `/components/icons/` - 커스텀 아이콘 (7개)
- `/components/brand/` - 브랜드 컴포넌트

### 스타일
- `/styles/globals.css` - 글로벌 스타일 + 디자인 토큰
- `/constants/colors.ts` - 컬러 상수

---

## 🎉 완료!

이 디자인 가이드는 현풍닭칼국수 PWA의 **모든 디자인 관련 정보**를 포함합니다.

**핵심 원칙:**
1. 브랜드 컬러 일관성 (현풍레드, 신칼오렌지, 황동식기색)
2. 디자인 토큰 사용 (하드코딩 금지)
3. 반응형 Mobile First
4. 접근성 WCAG 2.1 AA
5. 100% 구현 (플레이스홀더 금지)

---

**작성일**: 2025-10-31  
**작성자**: 현풍닭칼국수 개발팀  
**개발사**: KS컴퍼니 (사업자번호: 553-17-00098, 대표: 석경선/배종수)
