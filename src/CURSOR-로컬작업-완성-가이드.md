# 🎯 Cursor AI 로컬 작업 완성 가이드

> **프로젝트 이해 → 환경 설정 → Firebase 연동 → 프로덕션 배포**  
> 한 번에 완성하는 완벽한 가이드!

**작성:** KS컴퍼니 (사업자번호: 553-17-00098)  
**최종 업데이트:** 2024-11-08

---

## 📚 문서 구조

이 가이드는 3개의 핵심 문서로 구성됩니다:

### 1. 📖 CURSOR-완벽-작업-가이드-v2.md
**목적:** 프로젝트 완벽 이해 + 상세한 Step-by-Step 가이드

**내용:**
- 프로젝트 개요 및 아키텍처
- 핵심 규칙 (절대 위반 금지!)
- 디렉토리 구조 상세 설명
- 22개 Step ATOMIC 프롬프트
- 디자인 보호 시스템
- 프로덕션 준비 체크리스트

**사용 시기:** Cursor AI에게 프로젝트를 처음 설명할 때

---

### 2. ⚡ CURSOR-ATOMIC-빠른참조-v2.md
**목적:** 복사 → 붙여넣기용 빠른 참조

**내용:**
- 15개 Step 간략 버전
- 각 Step별 복사 가능한 프롬프트
- 핵심 규칙 요약
- 문제 해결 가이드
- 전체 체크리스트

**사용 시기:** 실제 작업할 때 각 Step을 복사해서 사용

---

### 3. 📋 이 문서 (CURSOR-로컬작업-완성-가이드.md)
**목적:** 전체 프로세스 요약 및 시작 가이드

**내용:**
- 문서 구조 설명
- 빠른 시작 가이드
- 주요 변경사항
- 알려진 이슈

---

## 🚀 빠른 시작 (5분)

### Step 1: Cursor AI에게 프로젝트 이해시키기

```
👉 다음 프롬프트를 Cursor AI에 붙여넣으세요:

"CURSOR-완벽-작업-가이드-v2.md 파일의 '1. 프로젝트 완벽 이해' 섹션을 읽고, 
이 프로젝트가 무엇인지 완벽히 이해해줘. 

프로젝트명, 기술 스택, 브랜드 컬러, 핵심 규칙 5가지를 설명해줘."
```

### Step 2: 환경 설정 시작

```
👉 CURSOR-ATOMIC-빠른참조-v2.md 파일을 열고,
Phase 1의 Step 1부터 순서대로 복사해서 붙여넣으세요.

Step 1: 의존성 설치
Step 2: 환경변수
Step 3: 디자인 잠금 확인
Step 4: 개발 서버 실행
Step 5: Mock 인증 테스트
```

### Step 3: 기능 테스트

```
👉 Phase 2, 3을 순서대로 진행:

Phase 2: 관리자 기능
- Step 6: 대시보드 테스트
- Step 7: 설정 센터 테스트

Phase 3: 고객 앱 기능
- Step 8: 주문 플로우 테스트
- Step 9: 리뷰 시스템 테스트
```

### Step 4: 프로덕션 준비

```
👉 배포 직전에만 Phase 5 진행:

Phase 5: 프로덕션 준비
- Step 12: 디버그 코드 제거 ⭐
- Step 13: 환경변수 최종 확인
- Step 14: 빌드 및 배포
- Step 15: 최종 품질 검증
```

---

## 🎯 핵심 규칙 (절대 위반 금지!)

### 🔴 규칙 1: 디자인 절대 보호

```
❌ 절대 하지 말 것:
- 브랜드 컬러 변경 (#D61C1C, #F37021, #C7A45A)
- font-size, font-weight, line-height Tailwind 클래스 사용
- 기존 컴포넌트 스타일 수정 (버그 아니면)
- !important 남발
- 임의의 색상 (#123456)

✅ 항상 할 것:
- BRAND_COLORS 상수 사용
- var(--color-hyunpung-red) 사용
- className="bg-hyunpung-red" 사용
- 디자인 잠금 확인 (npm run design:verify)
```

### 🔴 규칙 2: 100% 완전 구현

```
❌ 플레이스홀더 절대 금지:
- // TODO
- // 나중에 구현
- { /* ... */ }
- "기타 코드 생략"

✅ 모든 코드 완전 구현
✅ 모든 엣지 케이스 처리
✅ 모든 에러 핸들링
```

### 🔴 규칙 3: 타입 안전성

```typescript
❌ any 사용 금지
✅ 모든 타입 명시 (types/*.ts 활용)

// 나쁜 예
const data: any = ...

// 좋은 예
import { Order } from '../types/order';
const order: Order = ...
```

### 🔴 규칙 4: Firebase Mock 모드

```typescript
// lib/firebase.ts에서 확인
const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE === 'true';

// Mock 모드 (개발)
if (!USE_FIREBASE) {
  return mockData;
}

// 실제 Firebase (프로덕션)
return await firestore.collection('orders').get();
```

### 🔴 규칙 5: 디버그 코드 제거

```
프로덕션 배포 전 반드시 제거:
❌ /pages/DevTools.tsx
❌ /pages/app/Debug.tsx
❌ <Route path="/dev" ... />
❌ <Route path="/debug" ... />
❌ console.log() (대부분)
❌ 디버그 버튼들
```

---

## 📊 프로젝트 현황

### ✅ 완료된 작업 (99%)

```yaml
프론트엔드:
  - 28개 페이지 완성
  - 60+ 컴포넌트 완성
  - 30+ 라우트 구성
  - Shadcn UI 통합
  - Tailwind CSS v4 적용

디자인 시스템:
  - 브랜드 컬러 정의 (#D61C1C, #F37021, #C7A45A)
  - 디자인 토큰 완성
  - 디자인 잠금 시스템 활성화
  - 타이포그래피 시스템
  - 반응형 레이아웃

타입 시스템:
  - 11개 타입 파일 (types/*.ts)
  - 100% TypeScript
  - 타입 안전성 보장

상태 관리:
  - AuthContext (인증)
  - CartContext (장바구니)
  - Mock 데이터 시스템

결제 시스템:
  - 나이스페이 통합
  - 토스페이먼츠 추가 ⭐ NEW!
  - 결제사 선택 UI

관리자:
  - 11개 관리 페이지
  - 설정 센터 (5개 탭) ⭐ NEW!
  - 통합 대시보드
  - 실시간 통계
```

### ⏳ 필요한 작업 (1%)

```yaml
Firebase 연동:
  - VITE_USE_FIREBASE=true 설정
  - 실제 API 키 입력
  - Firestore 데이터 연동
  - Auth 연동
  - Storage 연동

Functions 배포:
  - 결제 검증 함수
  - 푸시 알림 함수
  - 리포트 생성 함수

프로덕션:
  - 디버그 코드 제거
  - 최종 빌드
  - Firebase 배포
```

---

## 🆕 최신 업데이트 (2024-11-08)

### 1. 관리자 설정 접근 권한 문제 수정 ✅

```
문제: "접근 권한이 필요합니다" 메시지
해결: getCurrentUser() 동기 함수로 변경

파일:
- lib/auth.ts
- pages/admin/Settings/index.tsx

상태: ✅ 완료
```

### 2. 토스페이먼츠 결제 옵션 추가 ✅

```
기능: 관리자가 나이스페이/토스페이먼츠 중 선택

UI:
- 결제사 선택 RadioGroup
- 각 결제사별 설정 가이드
- CLI 명령어 복사 기능
- 수수료 비교 표시

파일:
- pages/admin/Settings/PaymentTab.tsx

상태: ✅ 완료
```

### 3. 디자인 잠금 시스템 강화 ✅

```
보호 항목:
- 브랜드 컬러 (3개)
- 타이포그래피
- Border Radius
- Shadow
- Z-Index 체계
- 간격 시스템

파일:
- styles/design-lock.css
- constants/design-tokens.ts
- main.tsx (import 추가)

상태: ✅ 완료
```

---

## 📁 핵심 파일 구조

```
현풍닭칼국수-PWA/
├── pages/
│   ├── app/              ← 고객 앱 (14개)
│   │   ├── Home.tsx
│   │   ├── MenuList.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderTracking.tsx
│   │   ├── Debug.tsx       ⚠️ 프로덕션 전 제거
│   │   └── ...
│   ├── admin/            ← 관리자 (13개)
│   │   ├── Dashboard.tsx
│   │   ├── Orders.tsx
│   │   ├── Settings/     ⭐ 설정 센터
│   │   │   ├── index.tsx
│   │   │   ├── PaymentTab.tsx    (나이스페이/토스)
│   │   │   ├── DeliveryTab.tsx
│   │   │   ├── MapsTab.tsx
│   │   │   ├── FCMTab.tsx
│   │   │   └── OperationsTab.tsx
│   │   └── ...
│   └── DevTools.tsx      ⚠️ 프로덕션 전 제거
│
├── lib/
│   ├── firebase.ts       ⭐ Firebase 초기화
│   ├── auth.ts           ⭐ 인증 (Mock/Firebase)
│   ├── nicepay.ts        ⭐ 나이스페이
│   ├── orders.api.ts
│   └── admin/
│       ├── settingsCenter.api.ts
│       └── ...
│
├── types/                ← 타입 정의 (11개)
│   ├── order.ts
│   ├── menu.ts
│   ├── adminSettings.ts
│   └── ...
│
├── constants/
│   └── design-tokens.ts  ⭐ 디자인 토큰
│
├── styles/
│   ├── globals.css
│   └── design-lock.css   ⭐ 디자인 잠금
│
├── App.tsx               ⭐ 메인 라우팅
├── main.tsx              ⭐ 엔트리 포인트
└── .env                  ⚠️ 절대 커밋 금지
```

---

## 🎯 작업 순서

### Phase 1: 준비 (5분)

```bash
# 1. 문서 읽기
CURSOR-완벽-작업-가이드-v2.md (프로젝트 이해)
CURSOR-ATOMIC-빠른참조-v2.md (Step 프롬프트)

# 2. 환경 확인
node --version  # v18+
npm --version   # v9+
```

### Phase 2: 환경 설정 (10분)

```bash
# Step 1-5 진행
1. npm install
2. .env 설정
3. 디자인 잠금 확인
4. npm run dev
5. Mock 인증 테스트
```

### Phase 3: 기능 테스트 (30분)

```bash
# Step 6-9 진행
6. 관리자 대시보드 (11개 메뉴)
7. 설정 센터 (5개 탭)
8. 주문 플로우
9. 리뷰 시스템
```

### Phase 4: Firebase 연동 (선택, 60분)

```bash
# Step 10-11 진행 (실제 Firebase 있을 때만)
10. Firebase 실제 연동
11. Firestore 데이터 테스트
```

### Phase 5: 프로덕션 배포 (30분)

```bash
# Step 12-15 진행
12. 디버그 코드 제거 ⚠️
13. 환경변수 최종 확인
14. 빌드 및 배포
15. 최종 품질 검증
```

---

## 🚨 알려진 이슈 및 해결

### 1. CSS 디자인 깨짐

```bash
# 증상: 브랜드 컬러가 변경되거나 레이아웃이 깨짐

# 해결:
npm run design:verify
npm run design:lock
npm run dev

# 원인: design-lock.css가 비활성화됨
```

### 2. 관리자 설정 접근 불가

```bash
# 증상: "접근 권한이 필요합니다" 메시지

# 해결:
localStorage.setItem('mockRole', 'owner');
location.reload();

# 원인: Mock 모드에서 role 설정 안 됨
```

### 3. Firebase 연결 실패

```bash
# 증상: "Firebase not initialized" 에러

# 해결:
1. .env 확인: VITE_USE_FIREBASE=true
2. Firebase 키 확인
3. npm run dev (재시작)

# 원인: 환경변수 설정 오류
```

### 4. 빌드 실패

```bash
# 증상: npm run build 에러

# 해결:
rm -rf node_modules dist
npm install
npm run build

# 원인: 의존성 충돌
```

---

## ✅ 체크리스트

### 개발 환경

```
[ ] Node.js v18+ 설치
[ ] npm v9+ 설치
[ ] Cursor AI 설치
[ ] Git 설치
```

### 로컬 개발

```
[ ] npm install 완료
[ ] .env 파일 생성
[ ] VITE_USE_FIREBASE=false
[ ] npm run dev 성공
[ ] http://localhost:5173 접속
```

### 기능 테스트

```
[ ] Owner로 /admin 접속
[ ] 설정 센터 5개 탭 확인
[ ] 결제사 선택 UI 확인
[ ] Customer로 /menu 접속
[ ] 주문 플로우 완료
[ ] 리뷰 작성 완료
```

### Firebase 연동 (선택)

```
[ ] Firebase 프로젝트 생성
[ ] .env에 실제 키 입력
[ ] VITE_USE_FIREBASE=true
[ ] Firebase 초기화 성공
[ ] Firestore 읽기/쓰기 성공
```

### 프로덕션 배포

```
[ ] DevTools.tsx 삭제
[ ] Debug.tsx 삭제
[ ] /dev 라우트 제거
[ ] console.log 제거
[ ] .env.production 설정
[ ] npm run build 성공
[ ] npm run preview 테스트
[ ] Lighthouse > 90
[ ] firebase deploy 성공
```

---

## 📚 추가 참고 문서

### 프로젝트 이해

```
- README.md
- docs/01-planning/01-기획서_v0.1.md
- docs/02-design/01-디자인기획서_v0.1.md
```

### 개발 가이드

```
- docs/03-development/01-전체구조_코드설계_v1.0.md
- docs/03-development/02-배포가이드_v1.0.md
- docs/03-development/환경변수-설정가이드.md
```

### Firebase

```
- FIREBASE-연동-완벽-가이드.md
- docs/06-firebase/01-Firebase-정보-전체-정리.md
- docs/06-firebase/03-CORS-설정-가이드.md
```

### 디자인

```
- DESIGN-LOCK-README.md
- DESIGN-LOCK-QUICK-START.md
- docs/03-development/43-디자인-CSS-잠금-가이드.md
```

### 결제

```
- PAYMENT-PROVIDER-선택-시스템-가이드.md
- 결제사-선택-시스템-요약.md
```

### 최근 수정

```
- 관리자-설정-접근권한-수정-완료.md
- 결제탭-토스페이먼츠-추가-완료.md
```

---

## 🎉 완료!

이제 다음 3단계로 완벽한 로컬 개발을 시작하세요:

### 1️⃣ Cursor AI에게 프로젝트 이해시키기

```
"CURSOR-완벽-작업-가이드-v2.md 파일을 읽고 프로젝트를 완벽히 이해해줘."
```

### 2️⃣ Step-by-Step 작업

```
CURSOR-ATOMIC-빠른참조-v2.md에서 각 Step을 복사해서 붙여넣기
```

### 3️⃣ 프로덕션 배포

```
Phase 5의 Step 12-15를 순서대로 진행
```

---

**작성: KS컴퍼니 (사업자번호: 553-17-00098)**  
**최종 업데이트: 2024-11-08**

**🚀 성공적인 개발을 응원합니다!**
