# 🔒 디자인 CSS 잠금 - 빠른 시작

**30초 만에 디자인을 완벽하게 보호하세요!**

---

## ⚡ 이미 적용됨!

```bash
# ✅ 디자인 잠금이 이미 활성화되어 있습니다!

# 확인:
npm run design:verify

# 결과:
# ✅ 디자인 잠금 활성화됨
```

---

## 🎯 어떻게 작동하나요?

### 자동 보호 (20가지)

```
1. ✅ 브랜드 컬러 (#D61C1C, #F37021, #C7A45A) 절대 변경 안 됨
2. ✅ 타이포그래피 완전 고정
3. ✅ Border Radius 고정
4. ✅ Shadow 고정
5. ✅ Z-Index 충돌 방지
6. ✅ 간격 체계 고정
7. ✅ 버튼 스타일 보호
8. ✅ Input 스타일 보호
9. ✅ 링크 스타일 보호
10. ✅ 이미지 스타일 보호
11. ✅ 반응형 컨테이너 보호
12. ✅ 스크롤바 스타일 통일
13. ✅ 선택 영역 스타일 통일
14. ✅ 폰트 로딩 중 깜빡임 방지
15. ✅ 레이아웃 시프트 방지
16. ✅ 접근성 보호
17. ✅ 프린트 스타일 보호
18. ✅ 다크모드 강제 비활성화
19. ✅ 성능 최적화 (GPU 가속)
20. ✅ 터치 최적화
```

---

## 💡 사용 방법

### 1. TypeScript에서 사용

```typescript
import { BRAND_COLORS } from '@/constants/design-tokens';

<div style={{ backgroundColor: BRAND_COLORS.hyunpungRed }}>
  현풍닭칼국수
</div>
```

### 2. Tailwind 클래스 사용

```html
<div class="bg-hyunpung-red text-white">
  현풍닭칼국수
</div>
```

### 3. CSS 변수 직접 사용

```css
.my-component {
  background-color: var(--color-hyunpung-red);
}
```

---

## 🔍 검증

### 브라우저 콘솔 (F12)

```javascript
getComputedStyle(document.documentElement)
  .getPropertyValue('--color-hyunpung-red')

// ✅ 결과: #D61C1C
```

### 명령어

```bash
# 디자인 잠금 확인
npm run design:verify

# 전체 검증
npm run design:lock
```

---

## 📁 핵심 파일

```
/styles/design-lock.css          → CSS 변수 강제 고정
/constants/design-tokens.ts      → TypeScript 타입 안전성
/main.tsx                        → import './styles/design-lock.css'
```

---

## ⚠️ 규칙

### ✅ 허용

```typescript
✅ BRAND_COLORS.hyunpungRed
✅ var(--color-hyunpung-red)
✅ className="bg-hyunpung-red"
```

### ❌ 금지

```typescript
❌ color: '#123456'
❌ className="bg-[#123456]"
❌ !important 남발
```

---

## 🐛 문제 해결

### CSS가 깨짐

```bash
# 1. 확인
npm run design:verify

# 2. 비활성화되어 있다면
npm run design:lock

# 3. 재시작
npm run dev
```

### TypeScript 에러

```bash
# 타입 재생성
npx tsc --noEmit

# VSCode 재시작
# Ctrl+Shift+P → "Reload Window"
```

---

## 📚 상세 문서

- **완벽한 가이드**: `/docs/03-development/43-디자인-CSS-잠금-가이드.md`
- **전체 README**: `/DESIGN-LOCK-README.md`
- **디자인 토큰**: `/constants/design-tokens.ts`

---

## ✅ 체크리스트

- [x] 디자인 잠금 활성화됨
- [x] main.tsx에 import 추가됨
- [x] 브랜드 컬러 보호됨
- [x] 타이포그래피 고정됨
- [x] 레이아웃 안정화됨

---

## 🎉 완료!

```
디자인이 절대 깨지지 않습니다!

이제 안심하고 개발하세요! 🚀
```

**KS컴퍼니 (사업자번호: 553-17-00098)**
