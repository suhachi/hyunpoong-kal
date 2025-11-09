# 🏪 화이트라벨 빠른 시작 가이드

**목적**: 2시간 안에 새로운 배달앱 만들기  
**난이도**: ⭐⭐ 중급

---

## ⚡ 3가지 방법

### **방법 1: 자동 스크립트 (30분)** ⭐ 추천!

```bash
# 1. 스크립트 실행
chmod +x scripts/rebrand.sh
./scripts/rebrand.sh "새가게명" "#컬러1" "#컬러2" "#컬러3"

# 예시:
./scripts/rebrand.sh "부산갈비집" "#8B4513" "#FF6B35" "#D4AF37"

# 2. 메뉴 변경
vi data/menus.json

# 3. 환경 변수 설정
cp .env.example .env
vi .env

# 4. Firebase 배포
firebase deploy
```

---

### **방법 2: 수동 변경 (1시간)**

#### Step 1: 브랜드 정보 (15분)

```typescript
// 1. config/env.ts
export const APP_CONFIG = {
  name: '부산갈비집',  // ← 변경
  company: '부산푸드',
  bizNo: '123-45-67890',
};

// 2. constants/colors.ts
export const BRAND_COLORS = {
  primary: '#8B4513',    // ← 변경
  secondary: '#FF6B35',  // ← 변경
  accent: '#D4AF37',     // ← 변경
};

// 3. styles/globals.css
:root {
  --color-primary: #8B4513;    // ← 변경
  --color-secondary: #FF6B35;  // ← 변경
  --color-accent: #D4AF37;     // ← 변경
}
```

#### Step 2: 메뉴 데이터 (30분)

```json
// data/menus.json
[
  {
    "id": "menu-001",
    "name": "LA갈비",
    "price": 28000,
    "category": "galbi"
  }
]
```

#### Step 3: 배포 (15분)

```bash
# Firebase 설정
firebase login
firebase use new-project-id

# 환경 변수
cp .env.example .env
vi .env

# 배포
npm run build
firebase deploy
```

---

### **방법 3: 프로젝트 복제 (2시간)**

```bash
# 1. 프로젝트 복제
git clone https://github.com/your-repo/hyunpung-pwa.git new-store-pwa
cd new-store-pwa

# 2. 브랜드 변경 스크립트 실행
./scripts/rebrand.sh "새가게명" "#컬러1" "#컬러2" "#컬러3"

# 3. 메뉴/설정 변경
# 4. Firebase 프로젝트 생성
# 5. 환경 변수 설정
# 6. 배포
```

---

## 📋 필수 변경 사항

### 1. 브랜드 정보

```
✅ config/env.ts - 가게명, 회사명, 사업자번호
✅ constants/colors.ts - 브랜드 컬러 (3가지)
✅ styles/globals.css - CSS 변수
```

### 2. 메뉴 데이터

```
✅ data/menus.json - 메뉴, 가격, 카테고리
✅ constants/labels.ts - 카테고리 라벨
```

### 3. Firebase 설정

```
✅ Firebase 프로젝트 생성
✅ .env 환경 변수 설정
✅ firebase use <project-id>
```

---

## 🎨 추천 브랜드 컬러

### 한식당
```bash
./scripts/rebrand.sh "서울한정식" "#8B4513" "#D4A574" "#C41E3A"
```

### 치킨집
```bash
./scripts/rebrand.sh "황금치킨" "#FF6B35" "#F7B733" "#C0392B"
```

### 피자집
```bash
./scripts/rebrand.sh "나폴리피자" "#E74C3C" "#F39C12" "#27AE60"
```

### 카페
```bash
./scripts/rebrand.sh "브루잉커피" "#6F4E37" "#D4AF37" "#8B7355"
```

### 분식집
```bash
./scripts/rebrand.sh "엄마손분식" "#E74C3C" "#F39C12" "#3498DB"
```

---

## ✅ 체크리스트

### 브랜드 변경
- [ ] 가게명 변경
- [ ] 브랜드 컬러 변경 (3가지)
- [ ] 타이틀 변경
- [ ] 로고 이미지 (선택)

### 메뉴 설정
- [ ] data/menus.json 수정
- [ ] 카테고리 라벨 변경
- [ ] 가격 설정

### Firebase
- [ ] 프로젝트 생성
- [ ] .env 설정
- [ ] firebase use 연결

### 배포
- [ ] npm run build
- [ ] firebase deploy
- [ ] 앱 확인

---

## 🚀 빠른 명령어

```bash
# 브랜드 변경
./scripts/rebrand.sh "새가게명" "#컬러1" "#컬러2" "#컬러3"

# 개발 서버
npm run dev

# 빌드
npm run build

# 배포
firebase deploy

# 확인
npm run design:verify
```

---

## 📊 소요 시간

| 방법 | 시간 | 난이도 |
|------|------|--------|
| **자동 스크립트** | 30분 | ⭐ 쉬움 |
| **수동 변경** | 1시간 | ⭐⭐ 중간 |
| **전체 복제** | 2시간 | ⭐⭐⭐ 고급 |

---

## 📞 지원

- **상세 가이드**: `/docs/05-company/02-화이트라벨-가이드.md`
- **개발사**: KS컴퍼니 (553-17-00098)

---

**🏪 2시간 안에 새로운 배달앱을 만드세요!**
