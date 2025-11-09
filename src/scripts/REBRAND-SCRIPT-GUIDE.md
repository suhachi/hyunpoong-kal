# 🤖 rebrand.sh 자동화 스크립트 완벽 가이드

**파일 위치**: `/scripts/rebrand.sh`  
**목적**: 현풍닭칼국수 PWA를 다른 음식점 브랜드로 자동 변환  
**소요 시간**: 5분  
**난이도**: ⭐ 쉬움

---

## 📋 목차

1. [개요](#개요)
2. [기능](#기능)
3. [사용법](#사용법)
4. [작동 원리](#작동-원리)
5. [변경되는 파일](#변경되는-파일)
6. [예시](#예시)
7. [문제 해결](#문제-해결)
8. [고급 사용법](#고급-사용법)

---

## 🎯 개요

### 무엇을 하는 스크립트인가?

`rebrand.sh`는 **현풍닭칼국수 PWA**를 **다른 음식점의 배달앱**으로 자동 변환하는 Bash 스크립트입니다.

### 왜 필요한가?

```
❌ 수동 변경: 11개 파일을 하나씩 수정 (30분 소요)
✅ 자동 스크립트: 1개 명령으로 6개 파일 변경 (5분 소요)
```

### 핵심 가치

```
✅ 시간 절약: 30분 → 5분
✅ 실수 방지: 자동으로 정확하게
✅ 백업 자동: 원본 보존
✅ 복원 가능: 언제든 되돌리기
```

---

## 🚀 기능

### 1. 자동 변경 (6개 파일)

| 순서 | 파일 | 변경 내용 |
|------|------|----------|
| **[1/8]** | 백업 | 원본 파일 자동 백업 |
| **[2/8]** | `config/env.ts` | 가게명 변경 |
| **[3/8]** | `constants/colors.ts` | 브랜드 컬러 변경 (3가지) |
| **[4/8]** | `constants/design-tokens.ts` | 디자인 토큰 변경 |
| **[5/8]** | `styles/globals.css` | CSS 변수 변경 |
| **[6/8]** | `styles/design-lock.css` | CSS 잠금 변경 |
| **[7/8]** | `index.html` | 타이틀/메타 태그 변경 |
| **[8/8]** | 검증 | 변경 사항 확인 |

### 2. 안전 기능

```
✅ 백업 자동 생성 (타임스탬프)
✅ 확인 프롬프트 (실수 방지)
✅ 변경 전후 비교
✅ 상세한 로그
✅ 컬러 출력 (가독성)
```

### 3. 호환성

```
✅ macOS (Darwin)
✅ Linux
✅ Git Bash (Windows)
```

---

## 📖 사용법

### **Step 1: 권한 부여 (최초 1회)**

```bash
chmod +x scripts/rebrand.sh
```

**설명**: 스크립트 실행 권한을 부여합니다.

---

### **Step 2: 스크립트 실행**

```bash
./scripts/rebrand.sh "새가게명" "#Primary" "#Secondary" "#Accent"
```

**파라미터:**
- **`"새가게명"`**: 새로운 가게 이름 (따옴표 필수!)
- **`"#Primary"`**: Primary 브랜드 컬러 (hex)
- **`"#Secondary"`**: Secondary 브랜드 컬러 (hex)
- **`"#Accent"`**: Accent 브랜드 컬러 (hex)

---

### **Step 3: 확인**

스크립트가 변경 사항을 보여줍니다:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏪 브랜드 변경 스크립트 시작
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

가게명: 부산갈비집
Primary: #8B4513
Secondary: #FF6B35
Accent: #D4AF37

계속하시겠습니까? (y/N):
```

**`y`** 입력 → 변경 시작  
**`N`** 입력 → 취소

---

### **Step 4: 완료**

변경이 완료되면 다음 단계를 안내합니다:

```
🎉 브랜드 변경 완료!

다음 단계:
  1. 개발 서버 실행: npm run dev
  2. 브라우저 확인: http://localhost:5173
  3. 메뉴 데이터 변경: vi data/menus.json
  4. 연락처 정보 변경: vi components/Footer.tsx
  5. Firebase 프로젝트 생성
  6. 환경 변수 설정
  7. 배포
```

---

## 🔍 작동 원리

### 1. 백업 생성 (Step 1/8)

```bash
BACKUP_DIR="./backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

cp config/env.ts "$BACKUP_DIR/"
cp constants/colors.ts "$BACKUP_DIR/"
cp constants/design-tokens.ts "$BACKUP_DIR/"
cp styles/globals.css "$BACKUP_DIR/"
cp styles/design-lock.css "$BACKUP_DIR/"
cp index.html "$BACKUP_DIR/"
```

**결과**: `backup-20241107-153042/` 디렉토리 생성

---

### 2. 가게명 변경 (Step 2/8)

```bash
# config/env.ts에서 가게명 변경
sed -i '' "s/name: '.*'/name: '$NEW_NAME'/" config/env.ts
```

**Before:**
```typescript
export const APP_CONFIG = {
  name: '현풍닭칼국수',
  // ...
};
```

**After:**
```typescript
export const APP_CONFIG = {
  name: '부산갈비집',
  // ...
};
```

---

### 3. 브랜드 컬러 변경 (Step 3/8)

```bash
# constants/colors.ts에서 3가지 컬러 변경
sed -i '' "s/primary: '#[0-9A-Fa-f]\{6\}'/primary: '$COLOR_PRIMARY'/" constants/colors.ts
sed -i '' "s/secondary: '#[0-9A-Fa-f]\{6\}'/secondary: '$COLOR_SECONDARY'/" constants/colors.ts
sed -i '' "s/accent: '#[0-9A-Fa-f]\{6\}'/accent: '$COLOR_ACCENT'/" constants/colors.ts
```

**Before:**
```typescript
export const BRAND_COLORS = {
  primary: '#D61C1C',      // 현풍레드
  secondary: '#F37021',    // 신칼오렌지
  accent: '#C7A45A',       // 황동식기색
} as const;
```

**After:**
```typescript
export const BRAND_COLORS = {
  primary: '#8B4513',      // 갈비 브라운
  secondary: '#FF6B35',    // 불꽃 오렌지
  accent: '#D4AF37',       // 골드
} as const;
```

---

### 4. 디자인 토큰 변경 (Step 4/8)

```bash
# constants/design-tokens.ts 변경
sed -i '' "s/hyunpungRed: '#[0-9A-Fa-f]\{6\}'/primary: '$COLOR_PRIMARY'/" constants/design-tokens.ts
```

---

### 5. CSS 변수 변경 (Step 5-6/8)

```bash
# styles/globals.css
sed -i '' "s/--color-hyunpung-red: #[0-9A-Fa-f]\{6\}/--color-primary: $COLOR_PRIMARY/" styles/globals.css

# styles/design-lock.css
sed -i '' "s/--color-hyunpung-red: #[0-9A-Fa-f]\{6\} !important/--color-primary: $COLOR_PRIMARY !important/" styles/design-lock.css
```

---

### 6. HTML 메타 태그 변경 (Step 7/8)

```bash
# index.html
sed -i '' "s/<title>.*<\/title>/<title>$NEW_NAME - 배달주문<\/title>/" index.html
```

**Before:**
```html
<title>현풍닭칼국수 - 배달주문</title>
```

**After:**
```html
<title>부산갈비집 - 배달주문</title>
```

---

### 7. 검증 (Step 8/8)

스크립트가 변경 사항을 확인하고 리포트를 출력합니다.

---

## 📁 변경되는 파일

### 자동 변경 (6개)

| # | 파일 | 경로 | 변경 내용 |
|---|------|------|----------|
| 1 | `env.ts` | `/config/` | 가게명 |
| 2 | `colors.ts` | `/constants/` | 브랜드 컬러 3개 |
| 3 | `design-tokens.ts` | `/constants/` | 디자인 토큰 |
| 4 | `globals.css` | `/styles/` | CSS 변수 |
| 5 | `design-lock.css` | `/styles/` | CSS 잠금 |
| 6 | `index.html` | `/` | 타이틀/메타 |

### 수동 변경 필요 (5개)

| # | 파일 | 경로 | 변경 내용 |
|---|------|------|----------|
| 7 | `menus.json` | `/data/` | 메뉴 데이터 |
| 8 | `labels.ts` | `/constants/` | 카테고리 라벨 |
| 9 | `.env` | `/` | Firebase 설정 |
| 10 | `Footer.tsx` | `/components/` | 연락처 |
| 11 | `manifest.json` | `/public/` | PWA 매니페스트 |

---

## 🎨 예시

### 예시 1: 한식당 (서울한정식)

```bash
./scripts/rebrand.sh "서울한정식" "#8B4513" "#D4A574" "#C41E3A"
```

**컬러 의미:**
- Primary (#8B4513): 전통 브라운
- Secondary (#D4A574): 누룽지색
- Accent (#C41E3A): 고추장 레드

---

### 예시 2: 치킨집 (황금치킨)

```bash
./scripts/rebrand.sh "황금치킨" "#FF6B35" "#F7B733" "#C0392B"
```

**컬러 의미:**
- Primary (#FF6B35): 치킨 오렌지
- Secondary (#F7B733): 골든 프라이
- Accent (#C0392B): 양념 레드

---

### 예시 3: 피자집 (나폴리피자)

```bash
./scripts/rebrand.sh "나폴리피자" "#E74C3C" "#F39C12" "#27AE60"
```

**컬러 의미:**
- Primary (#E74C3C): 토마토 레드
- Secondary (#F39C12): 치즈 옐로우
- Accent (#27AE60): 바질 그린

---

### 예시 4: 카페 (브루잉커피)

```bash
./scripts/rebrand.sh "브루잉커피" "#6F4E37" "#D4AF37" "#8B7355"
```

**컬러 의미:**
- Primary (#6F4E37): 커피 브라운
- Secondary (#D4AF37): 카페라떼
- Accent (#8B7355): 카라멜

---

### 예시 5: 분식집 (엄마손분식)

```bash
./scripts/rebrand.sh "엄마손분식" "#E74C3C" "#F39C12" "#3498DB"
```

**컬러 의미:**
- Primary (#E74C3C): 떡볶이 레드
- Secondary (#F39C12): 튀김 옐로우
- Accent (#3498DB): 시원한 블루

---

## 🛠️ 문제 해결

### 문제 1: 권한 오류

**증상:**
```
bash: ./scripts/rebrand.sh: Permission denied
```

**해결:**
```bash
chmod +x scripts/rebrand.sh
```

---

### 문제 2: sed 오류 (macOS)

**증상:**
```
sed: 1: "config/env.ts": invalid command code
```

**원인**: macOS의 sed는 `-i` 옵션 뒤에 공백이 필요합니다.

**해결**: 스크립트가 자동으로 처리합니다 (101-107줄).

---

### 문제 3: 파라미터 부족

**증상:**
```
❌ 사용법: ./scripts/rebrand.sh <가게명> <Primary> <Secondary> <Accent>
```

**해결**: 4개 파라미터를 모두 입력하세요.

```bash
./scripts/rebrand.sh "가게명" "#컬러1" "#컬러2" "#컬러3"
```

---

### 문제 4: 컬러가 적용 안 됨

**원인**: 브라우저 캐시

**해결:**
```bash
# 1. 개발 서버 재시작
npm run dev

# 2. 브라우저 하드 리프레시
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

---

### 문제 5: 백업 복원

**백업 위치 확인:**
```bash
ls -la backup-*
```

**복원:**
```bash
cp backup-20241107-153042/* .
```

---

## 🎓 고급 사용법

### 1. 백업만 생성

```bash
# 스크립트의 백업 부분만 실행
BACKUP_DIR="./backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp config/env.ts "$BACKUP_DIR/"
cp constants/colors.ts "$BACKUP_DIR/"
# ...
```

---

### 2. 특정 파일만 변경

```bash
# 가게명만 변경
sed -i '' "s/name: '.*'/name: '새가게명'/" config/env.ts

# Primary 컬러만 변경
sed -i '' "s/primary: '#[0-9A-Fa-f]\{6\}'/primary: '#새컬러'/" constants/colors.ts
```

---

### 3. 스크립트 커스터마이징

**위치**: `/scripts/rebrand.sh`

**추가 가능한 기능:**
- [ ] 로고 이미지 자동 교체
- [ ] `manifest.json` 자동 생성
- [ ] `Footer.tsx` 자동 변경
- [ ] `menus.json` 템플릿 복사
- [ ] Git 커밋 자동 생성

---

### 4. 일괄 처리

```bash
# 여러 가게 한 번에 변경 (for 루프)
for store in "가게1" "가게2" "가게3"; do
  ./scripts/rebrand.sh "$store" "#컬러1" "#컬러2" "#컬러3"
  # 각 가게별로 다른 프로젝트로 복사
  cp -r . "../$store-pwa"
done
```

---

## 📊 스크립트 통계

```
총 라인: 267줄
주석: 25줄
실행 코드: 242줄
함수: 0개
sed 명령: 18개
백업 파일: 6개
변경 파일: 6개
소요 시간: 5초
```

---

## 🔐 보안

### 안전한 점

```
✅ 백업 자동 생성
✅ 확인 프롬프트
✅ 원본 보존
✅ Git 커밋 권장
```

### 주의할 점

```
⚠️ .env 파일은 수동 변경 필요
⚠️ Firebase 키는 자동 변경 안 됨
⚠️ NICEPAY MID는 별도 발급 필요
```

---

## 📚 관련 문서

```
📄 /WHITE-LABEL-README.md              - 화이트라벨 플랫폼 개요
📄 /WHITE-LABEL-QUICK-START.md         - 빠른 시작 가이드
📄 /docs/05-company/02-화이트라벨-가이드.md  - 상세 가이드
📄 /docs/05-company/03-화이트라벨-파일-목록.md - 파일 목록
```

---

## ✅ 체크리스트

### 사용 전

- [ ] Git 커밋 (백업 목적)
- [ ] 스크립트 권한 부여 (`chmod +x`)
- [ ] 새 브랜드 컬러 준비
- [ ] 가게명 확정

### 사용 중

- [ ] 4개 파라미터 정확히 입력
- [ ] 확인 프롬프트에서 `y` 입력
- [ ] 로그 확인

### 사용 후

- [ ] 개발 서버 재시작
- [ ] 브라우저 하드 리프레시
- [ ] 컬러 적용 확인
- [ ] 가게명 표시 확인
- [ ] 메뉴 데이터 수동 변경
- [ ] 연락처 정보 수동 변경

---

## 🎯 성공 기준

```
✅ 스크립트가 에러 없이 완료
✅ 백업 디렉토리 생성됨
✅ 6개 파일이 변경됨
✅ 브라우저에서 새 브랜드 컬러 확인
✅ 타이틀에 새 가게명 표시
```

---

## 💡 팁

### 컬러 선택 팁

1. **Adobe Color**: https://color.adobe.com
2. **Coolors**: https://coolors.co
3. **Paletton**: http://paletton.com

### 가게명 팁

```
✅ 짧고 기억하기 쉽게
✅ 한글 2-5글자 권장
✅ 특수문자 피하기
```

### 백업 팁

```
✅ 백업은 자동 생성됨
✅ Git 커밋도 추천
✅ 주기적으로 백업 정리
```

---

## 📞 지원

### 문제 발생 시

1. **백업 확인**: `ls -la backup-*`
2. **복원**: `cp backup-*/파일명 .`
3. **문서 참조**: `/docs/05-company/`

### 개발사

- **KS컴퍼니** (사업자번호: 553-17-00098)
- **대표**: 석경선 / 공동대표: 배종수

---

**작성일**: 2024-11-07  
**버전**: 1.0.0  
**Status**: ✅ **즉시 사용 가능**

🤖 **자동화로 5분 만에 새 브랜드 탄생!**
