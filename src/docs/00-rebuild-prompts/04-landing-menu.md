# Phase 1: 랜딩 페이지 및 메뉴 시스템

## 🎯 목표

고객이 처음 접속하는 **랜딩 페이지**와 **메뉴 조회 시스템**을 구축합니다.

---

## 📋 PRD (Product Requirements Document)

### 1. 랜딩 페이지 (Home.tsx)

#### 1.1 Hero 섹션
```typescript
interface HeroSection {
  title: string;              // "현풍닭칼국수"
  subtitle: string;           // "40년 전통의 깊은 맛"
  cta: {
    text: string;            // "주문하기"
    href: string;            // "/menu"
  };
  backgroundImage?: string;   // Hero 배경 이미지 (optional)
}
```

**디자인 요구사항:**
- 전체 화면 높이 (min-h-screen)
- 브랜드 컬러 그라데이션 배경 (hyunpung-red → sinkal-orange)
- 중앙 정렬된 텍스트
- 큰 CTA 버튼 (현풍레드, 흰색 텍스트)
- 하단 스크롤 인디케이터 (애니메이션)

#### 1.2 메뉴 프리뷰 섹션
```typescript
interface MenuPreview {
  categories: Array<{
    id: string;
    name: string;
    description: string;
    icon: ReactNode;          // 커스텀 아이콘 (BowlIcon, ChickenIcon 등)
  }>;
  featuredMenus: Menu[];      // 추천 메뉴 3개
}
```

**디자인 요구사항:**
- 카테고리 4개 (칼국수, 만두, 사이드, 음료)
- 그리드 레이아웃 (모바일 1열, 태블릿 2열, 데스크톱 4열)
- 호버 시 카드 상승 애니메이션
- 각 카테고리에 커스텀 아이콘

#### 1.3 브랜드 스토리 섹션
```typescript
interface BrandStory {
  title: string;              // "현풍닭칼국수 이야기"
  story: string;              // 브랜드 스토리 텍스트
  features: Array<{
    icon: ReactNode;
    title: string;
    description: string;
  }>;
}
```

**Features (3개):**
1. 🐔 **엄선된 닭고기** - 국내산 닭고기만 사용
2. 🍜 **수제 면** - 매일 아침 직접 뽑는 칼국수 면
3. 🥘 **전통 육수** - 40년 전통의 비법 육수

#### 1.4 Contact 섹션
```typescript
interface Contact {
  phone: string;              // "053-XXX-XXXX"
  address: string;            // "대구광역시 달서구 ..."
  hours: string;              // "매일 10:00 - 22:00"
  mapUrl?: string;            // 카카오맵 링크 (optional)
}
```

---

### 2. 메뉴 리스트 페이지 (MenuList.tsx)

#### 2.1 페이지 구조
```typescript
interface MenuListPage {
  header: {
    title: string;            // "메뉴"
    search: boolean;          // 검색 바 표시 여부
  };
  filters: {
    categories: string[];     // 카테고리 필터
    sortBy: 'popular' | 'price-low' | 'price-high' | 'name';
  };
  menuList: Menu[];
}
```

#### 2.2 Menu 타입
```typescript
interface Menu {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'noodle' | 'dumpling' | 'side' | 'beverage';
  isPopular: boolean;         // 인기 메뉴 여부
  isSoldOut: boolean;         // 품절 여부
  spicyLevel: 0 | 1 | 2 | 3;  // 맵기 단계 (0: 안매움)
  allergens?: string[];       // 알레르기 정보
  tags?: string[];            // 태그 (추천, 시그니처 등)
}
```

#### 2.3 UI 컴포넌트

**검색 바:**
```typescript
interface SearchBar {
  placeholder: string;
  onSearch: (query: string) => void;
  debounceMs: number;         // 300ms
}
```

**카테고리 필터:**
```typescript
interface CategoryFilter {
  categories: Array<{
    id: string;
    name: string;
    icon: ReactNode;
    count: number;            // 해당 카테고리 메뉴 개수
  }>;
  activeCategory: string | 'all';
  onChange: (categoryId: string) => void;
}
```

**메뉴 카드:**
```typescript
interface MenuCard {
  menu: Menu;
  onClick: () => void;
  showAddToCart: boolean;     // 장바구니 버튼 표시 여부
}
```

**디자인 요구사항:**
- 이미지 (16:9 비율, aspect-ratio 사용)
- 메뉴명 (font-semibold, text-lg)
- 설명 (text-sm, text-gray-600, 2줄 말줄임)
- 가격 (font-bold, text-xl, 현풍레드)
- 인기 메뉴 배지 (sinkal-orange 배경)
- 품절 시 오버레이 + "품절" 텍스트
- 맵기 표시 (ChiliIcon 1~3개)
- 호버 시 그림자 증가 + 상승 애니메이션

---

### 3. 메뉴 상세 페이지 (MenuDetail.tsx)

#### 3.1 페이지 구조
```typescript
interface MenuDetailPage {
  menu: Menu;
  options: OptionGroup[];
  relatedMenus: Menu[];       // 추천 메뉴
}
```

#### 3.2 옵션 그룹
```typescript
interface OptionGroup {
  id: string;
  name: string;               // "맵기 선택", "사이드 추가"
  required: boolean;          // 필수 선택 여부
  maxSelect: number;          // 최대 선택 개수 (1: 단일, 2+: 다중)
  options: Option[];
}

interface Option {
  id: string;
  name: string;
  price: number;              // 추가 금액 (0이면 무료)
  isDefault?: boolean;        // 기본 선택 여부
  isAvailable: boolean;       // 품절 여부
}
```

**옵션 예시:**
```typescript
const spicyOptions: OptionGroup = {
  id: 'spicy',
  name: '맵기 선택',
  required: true,
  maxSelect: 1,
  options: [
    { id: 'mild', name: '순한맛', price: 0, isDefault: true, isAvailable: true },
    { id: 'medium', name: '보통', price: 0, isAvailable: true },
    { id: 'hot', name: '매운맛', price: 0, isAvailable: true },
    { id: 'extra-hot', name: '아주매운맛', price: 500, isAvailable: true },
  ],
};

const sideOptions: OptionGroup = {
  id: 'sides',
  name: '사이드 추가',
  required: false,
  maxSelect: 3,
  options: [
    { id: 'egg', name: '계란 추가', price: 1000, isAvailable: true },
    { id: 'dumpling', name: '만두 추가', price: 3000, isAvailable: true },
    { id: 'rice', name: '공기밥', price: 1000, isAvailable: true },
  ],
};
```

#### 3.3 UI 구조

```
┌─────────────────────────┐
│  ← 뒤로가기              │
├─────────────────────────┤
│                         │
│   [메뉴 이미지]          │
│   (Carousel - 여러장)   │
│                         │
├─────────────────────────┤
│ 메뉴명               ⭐4.8│
│ 설명                    │
│ 가격: 9,000원           │
├─────────────────────────┤
│ 🌶️ 맵기 선택 (필수)     │
│  ○ 순한맛               │
│  ● 보통                 │
│  ○ 매운맛               │
├─────────────────────────┤
│ 사이드 추가 (선택)       │
│  ☐ 계란 추가 +1,000원   │
│  ☐ 만두 추가 +3,000원   │
├─────────────────────────┤
│ 수량: [-] 1 [+]         │
├─────────────────────────┤
│ 총 금액: 9,000원        │
│                         │
│ [장바구니 담기]          │
└─────────────────────────┘
```

#### 3.4 상세 정보 탭
```typescript
interface MenuDetailTabs {
  tabs: Array<{
    id: string;
    label: string;
    content: ReactNode;
  }>;
}
```

**탭 구성:**
1. **상세 정보** - 원산지, 알레르기, 칼로리
2. **리뷰** (N개) - 별점, 최신 리뷰 3개 + "전체 보기"
3. **추천 메뉴** - 함께 먹으면 좋은 메뉴 3개

---

### 4. Mock 데이터

#### 4.1 data/menus.json
```json
[
  {
    "id": "noodle-001",
    "name": "현풍닭칼국수",
    "description": "40년 전통 비법 육수로 우려낸 시그니처 메뉴",
    "price": 9000,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
    "category": "noodle",
    "isPopular": true,
    "isSoldOut": false,
    "spicyLevel": 0,
    "allergens": ["밀", "대두"],
    "tags": ["시그니처", "인기메뉴"],
    "rating": 4.8,
    "reviewCount": 234
  },
  {
    "id": "noodle-002",
    "name": "얼큰칼국수",
    "description": "얼큰한 국물이 일품인 매콤한 칼국수",
    "price": 9500,
    "image": "https://images.unsplash.com/photo-1617093727343-374698b1b08d",
    "category": "noodle",
    "isPopular": true,
    "isSoldOut": false,
    "spicyLevel": 2,
    "allergens": ["밀", "대두"],
    "tags": ["매운맛"],
    "rating": 4.6,
    "reviewCount": 187
  },
  {
    "id": "dumpling-001",
    "name": "수제만두",
    "description": "매일 아침 손으로 빚는 전통 만두",
    "price": 6000,
    "image": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c",
    "category": "dumpling",
    "isPopular": false,
    "isSoldOut": false,
    "spicyLevel": 0,
    "allergens": ["밀", "대두", "돼지고기"],
    "tags": ["수제"],
    "rating": 4.7,
    "reviewCount": 145
  }
]
```

---

### 5. 공유 컴포넌트

#### 5.1 components/app/AppLayout.tsx
```typescript
interface AppLayout {
  children: ReactNode;
  showHeader: boolean;        // 헤더 표시 여부
  showBottomNav: boolean;     // 하단 네비게이션 표시 여부
}
```

#### 5.2 components/app/AppHeader.tsx
```typescript
interface AppHeader {
  title?: string;             // 페이지 제목
  showBack: boolean;          // 뒤로가기 버튼
  showCart: boolean;          // 장바구니 아이콘
  actions?: ReactNode;        // 추가 액션 버튼
}
```

#### 5.3 components/app/BottomNav.tsx
```typescript
const navItems = [
  { id: 'home', label: '홈', icon: Home, href: '/' },
  { id: 'menu', label: '메뉴', icon: BowlIcon, href: '/menu' },
  { id: 'orders', label: '주문', icon: Receipt, href: '/orders' },
  { id: 'my', label: 'MY', icon: User, href: '/my' },
];
```

---

## 💬 프롬프트

**아래 프롬프트를 AI에게 그대로 입력하세요:**

```
현풍닭칼국수 PWA의 랜딩 페이지와 메뉴 시스템을 구축합니다.

## 작업 목표
고객이 메뉴를 조회하고 상세 정보를 확인할 수 있는 완전한 UI를 구현합니다.

## 작업 내용

### 1. Mock 데이터 생성
`/data/menus.json` 파일을 생성하고 다음 메뉴 데이터를 포함:
- 칼국수 3종 (현풍닭칼국수, 얼큰칼국수, 해물칼국수)
- 만두 2종 (수제만두, 김치만두)
- 사이드 3종 (공기밥, 계란, 김치)
- 음료 2종 (콜라, 사이다)

각 메뉴는 위의 Menu 타입 구조를 따릅니다.
이미지는 Unsplash의 음식 사진을 사용하세요.

### 2. 공유 컴포넌트 구현

#### AppLayout (`/components/app/AppLayout.tsx`)
- children props를 받아 레이아웃 제공
- 선택적으로 header, bottom navigation 표시
- 기본 패딩 및 배경색 설정

#### AppHeader (`/components/app/AppHeader.tsx`)
- 상단 헤더
- 좌측: 뒤로가기 버튼 (선택)
- 중앙: 제목
- 우측: 장바구니 아이콘 (badge with count)
- 고정 상단 배치 (sticky top-0)

#### BottomNav (`/components/app/BottomNav.tsx`)
- 하단 네비게이션 바 (4개 탭)
- 홈, 메뉴, 주문, MY
- 현재 경로에 따라 active 상태 표시
- 고정 하단 배치 (fixed bottom-0)
- 모바일에서만 표시 (lg:hidden)

### 3. 랜딩 페이지 구현 (`/pages/app/Home.tsx`)

완전한 랜딩 페이지 구현:

#### Hero 섹션
- 전체 화면 높이
- 그라데이션 배경 (현풍레드 → 신칼오렌지)
- 중앙 정렬 텍스트
  - 제목: "현풍닭칼국수"
  - 부제: "40년 전통의 깊은 맛"
- 큰 CTA 버튼 "주문하기" → /menu
- 하단 스크롤 인디케이터 (ChevronDown 아이콘, 애니메이션)

#### 메뉴 프리뷰 섹션
- 섹션 제목: "메뉴"
- 4개 카테고리 카드 (칼국수, 만두, 사이드, 음료)
- 각 카드:
  - 커스텀 아이콘 (BowlIcon, 등)
  - 카테고리명
  - 간단한 설명
  - "보러가기" 링크 → /menu?category=xxx
- 그리드 레이아웃 (모바일 1열, 태블릿 2열, 데스크톱 4열)
- 호버 시 상승 애니메이션

#### 브랜드 스토리 섹션
- 섹션 제목: "현풍닭칼국수 이야기"
- 스토리 텍스트 (2-3문단)
- 3개 특징:
  - 🐔 엄선된 닭고기 - 국내산 닭고기만 사용
  - 🍜 수제 면 - 매일 아침 직접 뽑는 칼국수 면
  - 🥘 전통 육수 - 40년 전통의 비법 육수

#### Contact 섹션
- 연락처, 주소, 영업시간
- 카카오맵 링크 버튼
- 개발사 정보 표시 (KS컴퍼니, 사업자번호 553-17-00098)

### 4. 메뉴 리스트 페이지 (`/pages/app/MenuList.tsx`)

완전한 메뉴 리스트 페이지 구현:

#### Header
- AppHeader 사용
- 제목: "메뉴"
- 장바구니 아이콘 표시

#### 검색 및 필터
- 검색 바 (debounce 300ms)
- 카테고리 필터 (전체, 칼국수, 만두, 사이드, 음료)
- 정렬 옵션 (인기순, 가격낮은순, 가격높은순, 이름순)

#### 메뉴 그리드
- 메뉴 카드 컴포넌트 사용
- 그리드 레이아웃 (모바일 1열, 태블릿 2열, 데스크톱 3열)
- 각 카드 클릭 시 → /menu/:id

#### 메뉴 카드 (`/components/app/MenuCard.tsx`)
- 이미지 (16:9 비율)
- 인기 메뉴 배지 (우측 상단)
- 메뉴명, 설명 (2줄 말줄임)
- 가격 (현풍레드, bold)
- 맵기 표시 (ChiliIcon)
- 품절 시 오버레이
- 호버 애니메이션

#### 빈 상태
- 검색 결과 없을 때 EmptyState 컴포넌트 표시

### 5. 메뉴 상세 페이지 (`/pages/app/MenuDetail.tsx`)

완전한 메뉴 상세 페이지 구현:

#### Header
- AppHeader (뒤로가기 + 장바구니)

#### 메뉴 이미지
- 큰 이미지 (1:1 또는 16:9)
- 여러 장이면 Carousel 사용

#### 메뉴 정보
- 메뉴명 + 별점 (우측)
- 설명
- 가격

#### 옵션 선택
- 각 옵션 그룹마다 섹션
- 필수 여부 표시
- 단일 선택: Radio
- 다중 선택: Checkbox
- 추가 금액 표시

#### 수량 선택
- [-] 버튼, 수량, [+] 버튼
- 최소 1개

#### 총 금액
- (기본 가격 + 옵션 금액) × 수량
- 큰 글씨, bold, 현풍레드

#### CTA 버튼
- "장바구니 담기" 버튼 (전체 너비)
- 클릭 시:
  1. CartContext에 추가
  2. Toast 알림 "장바구니에 담았습니다"
  3. 장바구니로 이동 여부 물어보기 (optional)

#### 탭 섹션
- 상세 정보 (원산지, 알레르기)
- 리뷰 미리보기 (3개) + "전체 보기" 링크
- 추천 메뉴 (3개)

### 6. 구현 원칙
1. ✅ 100% 완성된 UI (플레이스홀더 없음)
2. ✅ 반응형 디자인 (Mobile First)
3. ✅ 브랜드 컬러 일관성
4. ✅ 로딩 상태 처리 (Skeleton)
5. ✅ 에러 상태 처리 (EmptyState)
6. ✅ 접근성 (ARIA labels, 키보드 네비게이션)
7. ✅ 애니메이션 (hover, scroll)

### 7. 필요한 shadcn 컴포넌트
다음 shadcn 컴포넌트를 사용하세요:
- Button
- Card
- Badge
- Input
- RadioGroup
- Checkbox
- Tabs
- Separator

모든 파일을 100% 완성된 형태로 생성해주세요.
Mock 데이터는 실제처럼 풍부하게 작성하세요.
```

---

## ✅ 검증 체크리스트

- [ ] `/data/menus.json`에 최소 10개 메뉴가 있는가?
- [ ] `AppLayout`, `AppHeader`, `BottomNav` 컴포넌트가 완성되었는가?
- [ ] 랜딩 페이지가 4개 섹션을 모두 포함하는가?
- [ ] 메뉴 리스트 페이지에 검색과 필터가 작동하는가?
- [ ] 메뉴 카드가 반응형으로 표시되는가?
- [ ] 메뉴 상세 페이지에서 옵션 선택이 가능한가?
- [ ] 수량 증감이 정상 작동하는가?
- [ ] 총 금액이 실시간으로 계산되는가?
- [ ] "장바구니 담기" 버튼이 작동하는가?
- [ ] 모든 페이지가 모바일에서 정상 표시되는가?
- [ ] 접근성 (ARIA, focus)이 적용되었는가?

---

## 📌 다음 단계

**05-cart-checkout.md** - 장바구니 및 결제 플로우 구축

---

**작성일**: 2025-10-31  
**작성자**: 현풍닭칼국수 개발팀  
**개발사**: KS컴퍼니
