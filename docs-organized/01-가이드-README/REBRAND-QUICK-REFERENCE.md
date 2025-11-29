# ⚡ Rebrand 스크립트 빠른 참조 v2.0

> **30초만에 브랜드 변경 완료!**

**작성:** KS컴퍼니 (사업자번호: 553-17-00098)  
**버전:** 2.0 (2024-11-08 업데이트)

---

## 🎯 1줄 요약

```bash
./scripts/rebrand.sh "새가게명" "#Primary" "#Secondary" "#Accent"
```

---

## ⚡ 빠른 사용법

### Step 1: 권한 부여 (최초 1회)

```bash
chmod +x scripts/rebrand.sh
```

### Step 2: 실행

```bash
./scripts/rebrand.sh "부산갈비집" "#8B4513" "#FF6B35" "#D4AF37"
```

### Step 3: 개발 서버 실행

```bash
npm run dev
```

### Step 4: 확인

```
http://localhost:5173
```

---

## 🎨 업종별 프리셋 (복사 → 붙여넣기)

### 1. 한식당 (전통 브라운)

```bash
./scripts/rebrand.sh "서울한정식" "#8B4513" "#D4A574" "#C41E3A"
```

**컬러 설명:**
- Primary: `#8B4513` (전통 브라운)
- Secondary: `#D4A574` (누룽지색)
- Accent: `#C41E3A` (고추장 레드)

---

### 2. 치킨집 (치킨 오렌지)

```bash
./scripts/rebrand.sh "황금치킨" "#FF6B35" "#F7B733" "#C0392B"
```

**컬러 설명:**
- Primary: `#FF6B35` (치킨 오렌지)
- Secondary: `#F7B733` (골든 프라이)
- Accent: `#C0392B` (양념 레드)

---

### 3. 피자집 (토마토 레드)

```bash
./scripts/rebrand.sh "나폴리피자" "#E74C3C" "#F39C12" "#27AE60"
```

**컬러 설명:**
- Primary: `#E74C3C` (토마토 레드)
- Secondary: `#F39C12` (치즈 옐로우)
- Accent: `#27AE60` (바질 그린)

---

### 4. 카페 (커피 브라운)

```bash
./scripts/rebrand.sh "브루잉커피" "#6F4E37" "#D4AF37" "#8B7355"
```

**컬러 설명:**
- Primary: `#6F4E37` (커피 브라운)
- Secondary: `#D4AF37` (카페라떼)
- Accent: `#8B7355` (카라멜)

---

### 5. 분식집 (떡볶이 레드)

```bash
./scripts/rebrand.sh "엄마손분식" "#E74C3C" "#F39C12" "#3498DB"
```

**컬러 설명:**
- Primary: `#E74C3C` (떡볶이 레드)
- Secondary: `#F39C12` (튀김 옐로우)
- Accent: `#3498DB` (시원한 블루)

---

### 6. 일식당 (사쿠라 핑크)

```bash
./scripts/rebrand.sh "도쿄스시" "#E91E63" "#FF9800" "#4CAF50"
```

**컬러 설명:**
- Primary: `#E91E63` (사쿠라 핑크)
- Secondary: `#FF9800` (주황)
- Accent: `#4CAF50` (와사비 그린)

---

### 7. 중식당 (중국 레드)

```bash
./scripts/rebrand.sh "베이징" "#C41E3A" "#FFD700" "#228B22"
```

**컬러 설명:**
- Primary: `#C41E3A` (중국 레드)
- Secondary: `#FFD700` (금색)
- Accent: `#228B22` (제이드 그린)

---

### 8. 양식당 (와인 레드)

```bash
./scripts/rebrand.sh "프렌치키친" "#722F37" "#DAA520" "#2E8B57"
```

**컬러 설명:**
- Primary: `#722F37` (와인 레드)
- Secondary: `#DAA520` (골든로드)
- Accent: `#2E8B57` (시그린)

---

## 📁 자동 변경 파일 (6개)

| # | 파일 | 변경 내용 |
|---|------|----------|
| 1 | `config/env.ts` | 가게명 |
| 2 | `constants/colors.ts` | 브랜드 컬러 (Primary, Secondary, Accent) |
| 3 | `constants/design-tokens.ts` | 디자인 토큰 (hyunpungRed, shinkalOrange, brassGold) |
| 4 | `styles/globals.css` | CSS 변수 (#D61C1C → 새 Primary 등) |
| 5 | `styles/design-lock.css` | CSS 잠금 파일 (!important 포함) |
| 6 | `index.html` | 타이틀, 메타 태그 |

---

## 🔧 수동 변경 필요 파일

### 필수 (3개)

```
1. data/menus.json
   → 메뉴 이름, 가격, 설명

2. components/Footer.tsx
   → 전화번호, 주소, 영업시간

3. .env
   → Firebase 키, 결제 정보
```

### 선택 (2개)

```
4. components/BrandStory.tsx
   → 가게 소개, 역사

5. public/manifest.json
   → PWA 앱 이름, 아이콘
```

---

## ⏱️ 소요 시간

```
백업 생성:        5초
파일 변경:        10초 (6개 파일)
검증:            2초
사용자 확인:      변동

총 소요 시간:     약 30초
```

---

## 🚨 문제 해결

### 문제: "Permission denied"

```bash
# 해결:
chmod +x scripts/rebrand.sh
```

### 문제: "No such file or directory"

```bash
# 해결: 프로젝트 루트에서 실행
cd /path/to/project
./scripts/rebrand.sh ...
```

### 문제: 컬러가 변경되지 않음

```bash
# 해결: 디자인 잠금 재적용
npm run design:lock
npm run dev
```

### 문제: 이전 상태로 복원하고 싶음

```bash
# 해결: 백업 디렉토리에서 복사
cp backup-20241108-123456/* .
```

---

## ✅ 체크리스트

### 실행 전
```
[ ] 프로젝트 루트 디렉토리에 있음
[ ] scripts/rebrand.sh 파일 존재
[ ] chmod +x 권한 부여됨
[ ] 가게명과 컬러 3개 준비됨
```

### 실행 후
```
[ ] 백업 디렉토리 생성 확인
[ ] npm run dev 실행
[ ] http://localhost:5173 접속
[ ] 가게명 변경 확인
[ ] 컬러 변경 확인
[ ] data/menus.json 수정
[ ] components/Footer.tsx 수정
[ ] .env 설정
```

---

## 📊 변경 전후 비교

### 변경 전 (현풍닭칼국수)

```
가게명:  현풍닭칼국수
Primary: #D61C1C (현풍레드)
Secondary: #F37021 (신칼오렌지)
Accent: #C7A45A (황동식기색)
```

### 변경 후 (예: 부산갈비집)

```
가게명:  부산갈비집
Primary: #8B4513 (전통 브라운)
Secondary: #FF6B35 (치킨 오렌지)
Accent: #D4AF37 (골드)
```

---

## 🎁 추가 팁

### 컬러 선택 도구

```
Adobe Color: https://color.adobe.com
Coolors: https://coolors.co
Material Design: https://material.io/design/color
```

### 컬러 조합 검증

```
1. 명도 대비 (Contrast Ratio) 확인
   → 4.5:1 이상 권장

2. 색맹 친화적인지 확인
   → Coblis 도구 사용

3. 브랜드 아이덴티티 일치
   → 업종에 맞는 컬러 선택
```

### 백업 관리

```bash
# 백업 목록 확인
ls -la backup-*

# 오래된 백업 삭제 (30일 이상)
find . -name "backup-*" -type d -mtime +30 -exec rm -rf {} \;

# 특정 백업 복원
cp backup-20241108-123456/config/env.ts config/
```

---

## 📚 관련 문서

```
상세 가이드:
- scripts/REBRAND-SCRIPT-GUIDE.md

디자인 시스템:
- DESIGN-LOCK-README.md
- DESIGN-LOCK-QUICK-START.md

화이트라벨:
- WHITE-LABEL-README.md
- WHITE-LABEL-QUICK-START.md

배포:
- DEPLOYMENT-READY-CHECKLIST.md
```

---

**작성: KS컴퍼니 (사업자번호: 553-17-00098)**  
**버전: 2.0**  
**최종 업데이트: 2024-11-08**

🚀 **30초만에 브랜드 변경 완료!**
