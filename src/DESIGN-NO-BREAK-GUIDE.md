# 🔒 디자인 절대 안 깨지게 하는 완벽 가이드

> **목표**: 로컬 작업 시 디자인이 절대 뭉개지지 않도록 확실하게 설정

---

## ⚡ 빠른 시작 (3단계)

### 1️⃣ 검증 스크립트 실행

```bash
chmod +x scripts/verify-design.sh
./scripts/verify-design.sh
```

### 2️⃣ 개발 환경 시작

```bash
chmod +x scripts/start-local-dev.sh
./scripts/start-local-dev.sh
```

### 3️⃣ 브라우저 확인

```
1. http://localhost:5173 접속
2. Ctrl+Shift+R (강제 새로고침)
3. 디자인 정상 확인 ✅
```

---

## 🎯 핵심 원칙

### ✅ 절대 지켜야 할 3가지

```
1. main.tsx의 CSS import 순서를 절대 변경하지 말 것
   ├─ import './styles/globals.css'       (1순위)
   └─ import './styles/design-lock.css'   (2순위)

2. design-lock.css를 절대 삭제하지 말 것
   └─ 브랜드 컬러 보호 역할

3. postcss.config.js를 절대 삭제하지 말 것
   └─ Tailwind CSS v4.0 필수 설정
```

---

## 📁 필수 파일 체크리스트

```
✅ postcss.config.js          - Tailwind PostCSS 설정
✅ tailwind.config.js         - Tailwind 설정
✅ vite.config.ts             - Vite 설정
✅ styles/globals.css         - 메인 CSS (Tailwind import)
✅ styles/design-lock.css     - 브랜드 컬러 강제 고정
✅ main.tsx                   - CSS import 순서 중요!
✅ package.json               - 의존성 (@tailwindcss/postcss)
```

---

## 🔧 문제 해결

### 문제 1: 디자인이 전혀 안 나옴

**증상**: 스타일이 전혀 적용되지 않음

**해결**:
```bash
# 1. 캐시 삭제 + 개발 서버 재시작
rm -rf node_modules/.vite && npm run dev

# 2. 브라우저 강제 새로고침
Ctrl+Shift+R
```

### 문제 2: 포트가 3001 또는 5174로 변경됨

**증상**: localhost:3001 또는 localhost:5174로 접속됨

**해결**:
```bash
# 1. 모든 node 프로세스 종료
killall node  # Mac/Linux
taskkill /F /IM node.exe  # Windows

# 2. 개발 서버 재시작
npm run dev

# 3. localhost:5173 확인
```

### 문제 3: @tailwindcss/postcss 에러

**증상**: "Cannot find module '@tailwindcss/postcss'"

**해결**:
```bash
# 패키지 설치
npm install @tailwindcss/postcss@4.0.0 --save-dev

# 개발 서버 재시작
npm run dev
```

### 문제 4: 브랜드 컬러가 이상함

**증상**: 빨간색이 아닌 다른 색으로 보임

**해결**:
```bash
# 디자인 잠금 재적용
./scripts/lock-design.sh

# 개발 서버 재시작
npm run dev

# 브라우저 강제 새로고침
Ctrl+Shift+R
```

---

## 🚨 긴급 복구 (한 줄)

### 모든 설정 리셋 + 재시작

```bash
killall node 2>/dev/null; rm -rf node_modules/.vite dist; npm install && npm run dev
```

또는 Windows:

```bash
taskkill /F /IM node.exe 2>nul & rmdir /s /q node_modules\.vite dist 2>nul & npm install & npm run dev
```

---

## 📋 개발 시작 전 체크리스트

```
[ ] Git으로 최신 코드 pull
[ ] ./scripts/verify-design.sh 실행 → 모두 ✅
[ ] ./scripts/start-local-dev.sh 실행
[ ] localhost:5173 접속 (5173이어야 함!)
[ ] Ctrl+Shift+R 강제 새로고침
[ ] 현풍레드(#D61C1C) 컬러 확인
[ ] 타이포그래피 Pretendard 폰트 확인
```

---

## 🔍 디버깅 가이드

### 브라우저 개발자 도구 (F12)

#### Console 탭 확인:

```javascript
// 에러가 없어야 함
// ✅ 정상: 에러 없음
// ❌ 비정상: CSS 로딩 실패 에러
```

#### Network 탭 확인:

```
✅ globals.css - 200 OK
✅ design-lock.css - 200 OK
✅ main.tsx - 200 OK

❌ globals.css - 404 Not Found → 문제!
```

#### Elements 탭 확인:

```html
<!-- :root CSS 변수가 있어야 함 -->
<style>
  :root {
    --color-hyunpung-red: #D61C1C !important;
    --color-shinkal-orange: #F37021 !important;
    --color-brass-gold: #C7A45A !important;
  }
</style>
```

---

## 💡 Cursor AI 작업 시 주의사항

### ⚠️ Cursor AI에게 절대 요청하지 말 것:

```
❌ "main.tsx를 정리해줘"
   → CSS import가 삭제될 수 있음

❌ "불필요한 파일을 삭제해줘"
   → design-lock.css가 삭제될 수 있음

❌ "Tailwind 설정을 최적화해줘"
   → postcss.config.js가 변경될 수 있음

❌ "CSS를 정리해줘"
   → 브랜드 컬러가 변경될 수 있음
```

### ✅ Cursor AI에게 안전하게 요청하는 방법:

```
✅ "main.tsx의 CSS import는 절대 건드리지 말고, XXX 기능만 추가해줘"

✅ "styles/ 폴더는 절대 변경하지 말고, XXX 컴포넌트만 수정해줘"

✅ "디자인 시스템은 그대로 유지하면서, XXX 기능을 추가해줘"
```

---

## 📊 정상 작동 확인 방법

### ✅ 다음과 같이 보이면 정상:

```
1. 로고 색상: #D61C1C (현풍레드)
2. 버튼 색상: #D61C1C (현풍레드)
3. 강조 색상: #F37021 (신칼오렌지)
4. 폰트: Pretendard (깔끔한 한글 폰트)
5. 레이아웃: 깨지지 않고 정렬됨
```

### ❌ 다음과 같으면 문제:

```
1. 스타일이 전혀 없음 (흰 배경에 검은 텍스트만)
2. 색상이 파란색/보라색 (기본 브라우저 색)
3. 폰트가 고딕 (시스템 기본 폰트)
4. 레이아웃이 세로로 길게 나열됨
```

---

## 🎯 최종 확인

### 완벽하게 작동하는지 확인:

```bash
# 1. 검증
./scripts/verify-design.sh

# 예상 결과:
# 🎉 완벽합니다! 모든 설정이 정상입니다.

# 2. 개발 서버 시작
./scripts/start-local-dev.sh

# 예상 결과:
# VITE v5.1.4  ready in xxx ms
# ➜  Local:   http://localhost:5173/

# 3. 브라우저 접속
# http://localhost:5173

# 4. 디자인 확인
# ✅ 현풍레드 색상
# ✅ Pretendard 폰트
# ✅ 정렬된 레이아웃
```

---

## 📞 도움이 필요하면?

### 진단 정보 수집:

```bash
# 1. 시스템 진단
npm run diagnose

# 2. 디자인 검증
./scripts/verify-design.sh

# 3. 브라우저 Console (F12) 스크린샷
# 4. Network 탭 (F12) 스크린샷
```

---

## 📚 관련 문서

```
- scripts/start-local-dev.sh   : 개발 환경 시작 스크립트
- scripts/verify-design.sh     : 디자인 검증 스크립트
- scripts/lock-design.sh       : 디자인 잠금 스크립트
- CURSOR-완벽-작업-가이드-v2.md : Cursor AI 작업 가이드
- DESIGN-LOCK-README.md        : 디자인 잠금 상세 가이드
```

---

**작성: KS컴퍼니 (사업자번호: 553-17-00098)**  
**최종 업데이트: 2024-11-09**

**🔒 이제 디자인이 절대 안 깨집니다!**
