# 🚀 Cursor AI로 현풍닭칼국수 PWA 개발 시작하기

> **5분 만에 시작! Cursor AI와 함께 완벽한 로컬 개발**

**작성:** KS컴퍼니 (사업자번호: 553-17-00098)  
**최종 업데이트:** 2024-11-08

---

## 📚 준비물

```
✅ Node.js v18 이상
✅ npm v9 이상
✅ Cursor AI (설치: https://cursor.sh)
✅ Git
✅ 이 프로젝트 클론
```

---

## ⚡ 5분 빠른 시작

### 1️⃣ Cursor AI 열기

```bash
# 프로젝트 디렉토리에서
cursor .
```

### 2️⃣ 프로젝트 이해시키기 (첫 프롬프트)

Cursor AI 채팅창에 다음을 복사 붙여넣기:

```
CURSOR-완벽-작업-가이드-v2.md 파일을 읽고, 
현풍닭칼국수 PWA 프로젝트를 완벽히 이해해줘.

특히 다음을 확인해줘:
1. 프로젝트명과 목적
2. 기술 스택
3. 브랜드 컬러 3개
4. 핵심 규칙 5가지
5. 현재 완성도

이해했으면 요약해서 설명해줘.
```

### 3️⃣ 환경 설정 (Step 1-5)

CURSOR-ATOMIC-빠른참조-v2.md 파일을 열고,  
**Phase 1**의 각 Step을 복사해서 붙여넣기:

```
✅ Step 1: 의존성 설치
✅ Step 2: 환경변수 설정
✅ Step 3: 디자인 잠금 확인
✅ Step 4: 개발 서버 실행
✅ Step 5: Mock 인증 테스트
```

### 4️⃣ 개발 서버 확인

```bash
# 브라우저 자동 오픈
http://localhost:5173

# 주요 URL 확인
http://localhost:5173/menu        # 메뉴
http://localhost:5173/admin       # 관리자
http://localhost:5173/admin/settings  # 설정
```

---

## 📖 필수 문서 (3개)

### 1. CURSOR-완벽-작업-가이드-v2.md
**용도:** 프로젝트 완벽 이해 + 상세 가이드

**포함 내용:**
- 프로젝트 개요 및 아키텍처
- 핵심 규칙 (절대 위반 금지!)
- 디렉토리 구조 상세
- 22개 Step ATOMIC 프롬프트
- 디자인 보호 시스템
- 프로덕션 준비

**읽는 시기:** 가장 먼저! (Cursor AI에게 읽히기)

---

### 2. CURSOR-ATOMIC-빠른참조-v2.md
**용도:** 복사 → 붙여넣기용

**포함 내용:**
- 15개 Step 간략 버전
- 복사 가능한 프롬프트
- 핵심 규칙 요약
- 문제 해결 가이드

**읽는 시기:** 실제 작업할 때 (각 Step 복사)

---

### 3. CURSOR-로컬작업-완성-가이드.md
**용도:** 전체 프로세스 요약

**포함 내용:**
- 문서 구조 설명
- 빠른 시작 가이드
- 최신 업데이트
- 체크리스트

**읽는 시기:** 전체 흐름 파악할 때

---

## 🎯 핵심 규칙 (꼭 기억!)

### 🔴 규칙 1: 디자인 절대 보호

```
❌ 절대 금지:
- 브랜드 컬러 변경 (#D61C1C, #F37021, #C7A45A)
- font-size, font-weight Tailwind 클래스 사용
- 기존 컴포넌트 스타일 수정 (버그 아니면)

✅ 허용:
- BRAND_COLORS 상수 사용
- var(--color-hyunpung-red) 사용
- className="bg-hyunpung-red" 사용
```

### 🔴 규칙 2: 100% 완전 구현

```
❌ 플레이스홀더 금지:
- // TODO
- { /* ... */ }
- "코드 생략"

✅ 모든 코드 완전 구현
```

### 🔴 규칙 3: 타입 안전성

```typescript
❌ any 사용 금지

✅ 타입 명시
import { Order } from '../types/order';
const order: Order = ...
```

### 🔴 규칙 4: Mock 모드 확인

```
개발 중: VITE_USE_FIREBASE=false
프로덕션: VITE_USE_FIREBASE=true
```

### 🔴 규칙 5: 디버그 코드 제거

```
프로덕션 배포 전:
❌ pages/DevTools.tsx 삭제
❌ pages/app/Debug.tsx 삭제
❌ /dev 라우트 제거
❌ console.log 제거
```

---

## 📊 프로젝트 정보

### 기본 정보

```yaml
프로젝트: 현풍닭칼국수 PWA 배달앱
개발사: KS컴퍼니 (사업자번호: 553-17-00098)
Firebase: hp-kal

브랜드 컬러:
  현풍레드: #D61C1C
  신칼오렌지: #F37021
  황동식기색: #C7A45A

완성도:
  프론트엔드: 99%
  Firebase 연동: 0% (Mock 모드)
```

### 기술 스택

```yaml
Frontend:
  - React 18.2
  - TypeScript
  - Vite 5.1
  - Tailwind CSS v4.0
  - Shadcn UI

Backend:
  - Firebase
    - Firestore
    - Auth
    - Storage
    - Functions

Payment:
  - 나이스페이 (NICEPAY)
  - 토스페이먼츠 ⭐ NEW!

State:
  - Context API
    - AuthContext
    - CartContext
```

### 구조

```
28개 페이지
60+ 컴포넌트
30+ 라우트
11개 타입 정의
```

---

## 🆕 최신 업데이트 (2024-11-08)

### 1. 관리자 설정 접근 권한 문제 수정 ✅

```
문제: 설정 센터 "접근 권한이 필요합니다"
해결: getCurrentUser() 동기 함수로 변경
파일: lib/auth.ts, pages/admin/Settings/index.tsx
```

### 2. 토스페이먼츠 결제 추가 ✅

```
기능: 나이스페이/토스페이먼츠 선택 가능
UI: 결제사 선택 RadioGroup
파일: pages/admin/Settings/PaymentTab.tsx
```

### 3. 디자인 잠금 시스템 ✅

```
보호: 브랜드 컬러, 타이포그래피, 레이아웃
파일: styles/design-lock.css, constants/design-tokens.ts
```

---

## 🔄 작업 단계

### Phase 1: 환경 설정 (10분)

```
Step 1: npm install
Step 2: .env 설정
Step 3: 디자인 잠금 확인
Step 4: npm run dev
Step 5: Mock 인증 테스트
```

### Phase 2: 관리자 기능 (20분)

```
Step 6: 대시보드 테스트 (11개 메뉴)
Step 7: 설정 센터 테스트 (5개 탭)
  - 결제 (나이스페이/토스)
  - 배달대행
  - 지도/지오
  - 알림/FCM
  - 운영/보안
```

### Phase 3: 고객 앱 (20분)

```
Step 8: 주문 플로우
  - 메뉴 선택
  - 장바구니
  - 주문/결제
  - 주문 추적

Step 9: 리뷰 시스템
  - 리뷰 작성
  - 리뷰 목록
  - 관리자 답글
```

### Phase 4: Firebase 연동 (선택, 60분)

```
Step 10: Firebase 실제 연동
  - .env에 실제 키 입력
  - VITE_USE_FIREBASE=true

Step 11: Firestore 테스트
  - 주문 생성
  - 실시간 조회
```

### Phase 5: 프로덕션 (30분)

```
Step 12: 디버그 제거 ⚠️
  - DevTools.tsx 삭제
  - Debug.tsx 삭제
  - console.log 제거

Step 13: 환경변수 최종 확인
Step 14: 빌드 및 배포
Step 15: 품질 검증
```

---

## 🚨 문제 해결

### CSS 디자인 깨짐

```bash
npm run design:verify
npm run design:lock
npm run dev
```

### 관리자 설정 접근 불가

```javascript
// 브라우저 콘솔 (F12)
localStorage.setItem('mockRole', 'owner');
location.reload();
```

### Firebase 연결 실패

```bash
# .env 확인
VITE_USE_FIREBASE=true
VITE_FIREBASE_API_KEY=실제_키

# 재시작
npm run dev
```

### 빌드 실패

```bash
rm -rf node_modules dist
npm install
npm run build
```

---

## ✅ 체크리스트

### 시작 전

```
[ ] Node.js v18+ 설치
[ ] npm v9+ 설치
[ ] Cursor AI 설치
[ ] 프로젝트 클론
```

### 환경 설정

```
[ ] npm install
[ ] .env 파일 생성
[ ] VITE_USE_FIREBASE=false
[ ] npm run dev 성공
[ ] localhost:5173 접속
```

### 기능 테스트

```
[ ] Owner로 로그인
[ ] /admin 접속
[ ] /admin/settings 접속
[ ] 결제 탭 확인 (나이스페이/토스)
[ ] 주문 플로우 완료
[ ] 리뷰 작성 완료
```

### 프로덕션

```
[ ] DevTools.tsx 삭제
[ ] Debug.tsx 삭제
[ ] console.log 제거
[ ] npm run build 성공
[ ] Lighthouse > 90
[ ] firebase deploy
```

---

## 📚 추가 문서

### 필수

```
- CURSOR-완벽-작업-가이드-v2.md (프로젝트 이해)
- CURSOR-ATOMIC-빠른참조-v2.md (Step 프롬프트)
- CURSOR-로컬작업-완성-가이드.md (전체 요약)
```

### 디자인

```
- DESIGN-LOCK-README.md
- DESIGN-LOCK-QUICK-START.md
```

### Firebase

```
- FIREBASE-연동-완벽-가이드.md
- docs/06-firebase/
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

## 🎁 보너스 팁

### Cursor AI 효과적으로 사용하기

```
1. 한 번에 한 작업만 요청
2. 각 Step을 순서대로 진행
3. 완료 확인 후 다음 Step
4. 에러 발생 시 즉시 보고
5. 완료 후 항상 검증
```

### Mock 모드 활용

```javascript
// Owner 로그인
localStorage.setItem('mockRole', 'owner');

// Customer 로그인
localStorage.setItem('mockRole', 'customer');

// 확인
localStorage.getItem('mockRole');
```

### 디자인 검증

```bash
# 디자인 잠금 확인
npm run design:verify

# 브라우저 콘솔에서
getComputedStyle(document.documentElement)
  .getPropertyValue('--color-hyunpung-red')
// 결과: #D61C1C
```

---

## 🎉 시작하세요!

### 1단계: Cursor AI 열기

```bash
cursor .
```

### 2단계: 첫 프롬프트

```
"CURSOR-완벽-작업-가이드-v2.md 파일을 읽고 프로젝트를 이해해줘."
```

### 3단계: Step-by-Step

```
CURSOR-ATOMIC-빠른참조-v2.md의 각 Step 복사 → 붙여넣기
```

---

**작성: KS컴퍼니 (사업자번호: 553-17-00098)**  
**최종 업데이트: 2024-11-08**

**🚀 성공적인 개발을 응원합니다!**
