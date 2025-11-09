# 🏪 화이트라벨 배달앱 플랫폼

**현풍닭칼국수 PWA를 템플릿으로 사용하여 다른 음식점의 배달앱 만들기**

---

## 🎯 개요

이 프로젝트는 **화이트라벨(White-label)** 방식으로 다른 음식점의 배달앱을 쉽게 만들 수 있도록 설계되었습니다.

### 가능한 것

```
✅ 가게명 변경
✅ 브랜드 컬러 변경 (3가지)
✅ 로고 교체
✅ 메뉴 전체 교체
✅ 연락처/주소 변경
✅ 영업시간 설정
✅ 배달비/최소주문금액 설정
✅ Firebase 프로젝트 연결
✅ NICEPAY MID 교체
```

### 유지되는 것

```
✅ 모든 기능 (주문/결제/배달추적/리뷰/포인트)
✅ 관리자 대시보드
✅ PWA 기능 (오프라인, A2HS)
✅ 디자인 시스템 구조
✅ 코드 구조
✅ Firebase 백엔드
```

---

## ⚡ 빠른 시작 (30분)

### Step 1: 자동 브랜드 변경 (5분)

```bash
# 스크립트 실행
chmod +x scripts/rebrand.sh
./scripts/rebrand.sh "새가게명" "#Primary" "#Secondary" "#Accent"

# 예시: 부산갈비집
./scripts/rebrand.sh "부산갈비집" "#8B4513" "#FF6B35" "#D4AF37"
```

**자동 변경되는 파일:**
- ✅ config/env.ts (가게명, 회사정보)
- ✅ constants/colors.ts (브랜드 컬러)
- ✅ styles/globals.css (CSS 변수)
- ✅ index.html (타이틀, 메타)

---

### Step 2: 메뉴 데이터 변경 (10분)

```bash
# 메뉴 파일 수정
vi data/menus.json
```

```json
[
  {
    "id": "menu-001",
    "name": "LA갈비",
    "price": 28000,
    "category": "galbi",
    "image": "https://example.com/image.jpg"
  }
]
```

---

### Step 3: 환경 변수 설정 (10분)

```bash
# .env 파일 생성
cp .env.example .env
vi .env
```

```bash
# Firebase (새 프로젝트 생성 후 복사)
VITE_FIREBASE_PROJECT_ID=new-project-id
VITE_FIREBASE_API_KEY=your_api_key
# ...

# NICEPAY (새 MID 발급)
VITE_NICEPAY_MID=NEW_MID_001
```

---

### Step 4: 배포 (5분)

```bash
# Firebase 연결
firebase use new-project-id

# 배포
npm run build
firebase deploy
```

**완료! 🎉**

---

## 📚 상세 문서

### 기본 가이드
- **빠른 시작**: [WHITE-LABEL-QUICK-START.md](WHITE-LABEL-QUICK-START.md)
- **상세 가이드**: [docs/05-company/02-화이트라벨-가이드.md](docs/05-company/02-화이트라벨-가이드.md)
- **파일 목록**: [docs/05-company/03-화이트라벨-파일-목록.md](docs/05-company/03-화이트라벨-파일-목록.md)

### 자동화 도구
- **브랜드 변경 스크립트**: [scripts/rebrand.sh](scripts/rebrand.sh)

---

## 🎨 브랜드 컬러 예시

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

## 📋 변경 체크리스트

### 필수 변경 (11개)

- [ ] config/env.ts - 가게명, 회사정보
- [ ] constants/colors.ts - 브랜드 컬러
- [ ] constants/design-tokens.ts - 디자인 토큰
- [ ] styles/globals.css - CSS 변수
- [ ] styles/design-lock.css - CSS 잠금
- [ ] index.html - 타이틀, 메타
- [ ] data/menus.json - 메뉴 데이터
- [ ] constants/labels.ts - 카테고리 라벨
- [ ] .env - Firebase, NICEPAY
- [ ] components/Footer.tsx - 연락처
- [ ] public/manifest.json - PWA

### 권장 변경 (5개)

- [ ] public/logo.svg - 로고
- [ ] public/icon-192.png - PWA 아이콘
- [ ] public/icon-512.png - PWA 아이콘
- [ ] public/og-image.png - Open Graph
- [ ] public/favicon.ico - 파비콘

---

## 🚀 적용 가능 업종

```
✅ 한식당        ✅ 중식당
✅ 치킨집        ✅ 일식당
✅ 피자집        ✅ 분식집
✅ 카페          ✅ 도시락/반찬
✅ 디저트        ✅ 야식/포차
```

**모든 배달 음식점에 적용 가능!**

---

## 📊 소요 시간

| 방법 | 시간 | 난이도 |
|------|------|--------|
| **자동 스크립트** | 30분 | ⭐ 쉬움 |
| **수동 변경** | 1시간 | ⭐⭐ 중간 |
| **전체 복제** | 2시간 | ⭐⭐⭐ 고급 |

---

## 💡 주요 기능 (유지)

### 고객 앱 (15페이지)

```
✅ 홈/메뉴 조회
✅ 장바구니
✅ 체크아웃 (배달비 자동 계산)
✅ 결제 (NICEPAY)
✅ 주문 내역
✅ 배달 추적 (GPS)
✅ 리뷰 작성
✅ 포인트 적립/사용
✅ 쿠폰 사용
✅ 1:1 고객 지원
✅ 푸시 알림 (FCM)
```

### 관리자 대시보드 (11페이지)

```
✅ 주문 관리 (실시간)
✅ 메뉴 관리 (CSV 업/다운로드)
✅ 리뷰 관리 (답글, 신고)
✅ 쿠폰/프로모션 관리
✅ 포인트 관리
✅ 배달 관제 시스템
✅ 고객 지원 채팅
✅ 통합 분석 대시보드
✅ 설정 센터
```

---

## 🛡️ 기술 스택

```
Frontend:  React 18.2 + TypeScript 5.2 + Vite 5.1
Styling:   Tailwind CSS v4 + shadcn/ui
Backend:   Firebase (Auth, Firestore, Storage, Functions, FCM, Hosting)
Payment:   NICEPAY
Delivery:  Provider 어댑터 패턴
PWA:       Service Worker, A2HS, 오프라인
```

---

## 📞 지원

### 개발사
- **KS컴퍼니** (사업자번호: 553-17-00098)
- **대표**: 석경선 / 공동대표: 배종수

### 문의
- **이메일**: contact@kscompany.com
- **기술 지원**: tech@kscompany.com

---

## 🎉 성공 사례

### 변환 예시

```
현풍닭칼국수 → 부산갈비집      (30분)
현풍닭칼국수 → 황금치킨        (30분)
현풍닭칼국수 → 나폴리피자      (30분)
현풍닭칼국수 → 브루잉커피      (30분)
```

---

## 📖 라이선스

이 프로젝트는 화이트라벨 템플릿으로 사용 가능합니다.

### 허용 사항
- ✅ 상업적 사용
- ✅ 브랜드 변경
- ✅ 메뉴 변경
- ✅ 배포

### 주의 사항
- ⚠️ 개발사 정보(KS컴퍼니) 유지 권장
- ⚠️ 코드 재배포 시 출처 명시

---

## 🚀 시작하기

```bash
# 1. 프로젝트 복제
git clone https://github.com/your-repo/hyunpung-pwa.git new-store

# 2. 브랜드 변경
cd new-store
./scripts/rebrand.sh "새가게명" "#컬러1" "#컬러2" "#컬러3"

# 3. 메뉴 변경
vi data/menus.json

# 4. 환경 설정
cp .env.example .env
vi .env

# 5. 배포
firebase use new-project-id
npm run build
firebase deploy
```

**🏪 2시간 안에 새로운 배달앱 완성!**

---

**작성일**: 2024-11-07  
**버전**: 1.0.0  
**Status**: ✅ **즉시 사용 가능**
