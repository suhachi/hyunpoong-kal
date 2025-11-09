# 🎨 디자인 가이드 빠른 참조

## 📍 파일 위치
```
/docs/00-rebuild-prompts/DESIGN-GUIDE.md
```

---

## 🎯 핵심 내용 (15개 섹션)

### 1️⃣ 디자인 환경
- Figma (디자인 소스)
- Tailwind CSS v4 (스타일링)
- shadcn/ui (44개 컴포넌트)
- Pretendard (웹폰트)

### 2️⃣ 브랜드 컬러 (3색)
```css
현풍레드: #D61C1C    /* Primary - 메인 CTA */
신칼오렌지: #F37021  /* Secondary - 보조 액션 */
황동식기색: #C7A45A  /* Accent - 포인트 */
```

### 3️⃣ 디자인 토큰
```css
:root {
  --hyunpung-red-600: #D61C1C;
  --text-base: 1rem;
  --spacing-4: 1rem;
  --radius-lg: 0.5rem;
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
}
```

### 4️⃣ 타이포그래피
```css
h1: 36px (text-4xl) bold
h2: 30px (text-3xl) bold
본문: 16px (text-base) normal
작은글씨: 14px (text-sm)
```

### 5️⃣ Spacing (4px 단위)
```css
spacing-1: 4px
spacing-2: 8px
spacing-4: 16px
spacing-6: 24px
spacing-8: 32px
```

### 6️⃣ 커스텀 아이콘 (7개)
```
🍜 BowlIcon      - 그릇
🐔 ChickenIcon   - 닭
🍝 NoodleIcon    - 국수
🌶️ ChiliIcon     - 고추
💨 SteamIcon     - 김
🚚 DeliveryIcon  - 배달
🎟️ CouponIcon    - 쿠폰
```

### 7️⃣ 컴포넌트 Variants
```tsx
Button: default, secondary, accent, outline, ghost
Badge: default, success, warning, error
Card: default, hover (shadow-lg)
```

### 8️⃣ 레이아웃 구조
```
주문자 앱: AppHeader + Content + BottomNav
관리자: Sidebar + Header + Content
```

### 9️⃣ 반응형 Breakpoints
```css
sm: 640px   /* 모바일 가로 */
md: 768px   /* 태블릿 */
lg: 1024px  /* 데스크톱 */
xl: 1280px  /* 대형 */
```

### 🔟 애니메이션
```css
duration-200: 200ms
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
hover: scale-105, shadow-lg
```

### 1️⃣1️⃣ 접근성 (WCAG 2.1 AA)
```tsx
- 명도 대비 4.5:1 이상
- ARIA labels
- 키보드 네비게이션
- 포커스 인디케이터
```

### 1️⃣2️⃣ 상태별 컬러
```
결제완료: blue
접수: indigo
조리중: orange
배달중: red
완료: green
취소: gray
```

### 1️⃣3️⃣ Shadow 레벨
```css
shadow-sm: 카드 기본
shadow-md: 카드 hover
shadow-lg: 모달
shadow-xl: 최대 강조
```

### 1️⃣4️⃣ Border Radius
```css
rounded-md: 6px   /* 버튼 */
rounded-lg: 8px   /* 카드 */
rounded-xl: 12px  /* 큰 카드 */
rounded-full      /* 원형 */
```

### 1️⃣5️⃣ UI/UX 패턴
```
- Loading: Skeleton, Spinner, Progress
- Error: Inline, Alert, Toast
- Success: Toast, Message
- Empty: EmptyState
```

---

## 🚀 빠른 사용법

### 1. 버튼 만들기
```tsx
<Button className="bg-hyunpung-red-600 hover:bg-hyunpung-red-700">
  주문하기
</Button>
```

### 2. 카드 만들기
```tsx
<Card className="p-6 hover:shadow-lg transition-shadow">
  <CardTitle>제목</CardTitle>
  <CardContent>내용</CardContent>
</Card>
```

### 3. 그리드 레이아웃
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

### 4. 반응형 텍스트
```tsx
<h1 className="text-2xl lg:text-4xl font-bold text-gray-900">
  현풍닭칼국수
</h1>
```

### 5. 호버 애니메이션
```tsx
<div className="
  transition-all duration-200
  hover:scale-105 hover:shadow-lg
  active:scale-95
">
```

---

## 📋 체크리스트

디자인 구현 시 확인사항:

- [ ] 브랜드 컬러 사용 (현풍레드, 신칼오렌지, 황동식기색)
- [ ] 디자인 토큰 활용 (하드코딩 금지)
- [ ] Mobile First 반응형
- [ ] WCAG 2.1 AA 접근성
- [ ] 4px 단위 Spacing
- [ ] 일관된 Shadow 레벨
- [ ] Hover/Focus 상태 구현
- [ ] Loading/Error/Empty 상태
- [ ] 부드러운 애니메이션 (200ms)
- [ ] 개발사 정보 포함 (KS컴퍼니)

---

## 🎨 디자인 원칙

### 1. 일관성 (Consistency)
모든 페이지에서 동일한 패턴과 컬러 사용

### 2. 명확성 (Clarity)
사용자가 즉시 이해할 수 있는 디자인

### 3. 접근성 (Accessibility)
모든 사용자가 이용 가능한 디자인

### 4. 반응성 (Responsiveness)
모든 디바이스에서 완벽한 경험

### 5. 브랜드 아이덴티티
현풍닭칼국수만의 독특한 디자인

---

## 📞 더 자세한 내용

**전체 가이드 보기:**
```
/docs/00-rebuild-prompts/DESIGN-GUIDE.md
```

15개 섹션, 모든 디자인 요소를 포함한 완벽한 가이드!

---

**작성일**: 2025-10-31  
**개발사**: KS컴퍼니
