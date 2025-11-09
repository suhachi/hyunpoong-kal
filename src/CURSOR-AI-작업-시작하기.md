# 🎯 Cursor AI 로컬 작업 시작하기 - 완벽 가이드

> **현풍닭칼국수 PWA를 Cursor AI로 로컬 작업하여 Firebase 연동까지 완료하는 완벽한 가이드**

---

## 🎬 시작하기 전에

### 준비물 체크리스트

```
하드웨어:
[ ] 컴퓨터 (macOS/Windows/Linux)
[ ] 인터넷 연결

소프트웨어:
[ ] Node.js 18+ 설치
[ ] npm 설치
[ ] Cursor AI 설치 및 로그인
[ ] 코드 다운로드 완료

계정 (나중에 필요):
[ ] Google 계정 (Firebase용)
[ ] 신용카드 (Firebase Blaze 플랜용 - 무료 할당량 있음)
```

---

## 📖 가이드 문서 구조

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│   Cursor AI로 로컬 작업 시작 (이 문서)               │
│                                                       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────���───────────┐
│                                                       │
│   Step 1: CURSOR-프로젝트-완벽-이해-가이드.md        │
│   ⏱️ 10분 (읽기)                                    │
│   📌 Cursor AI의 첫 프롬프트로 제공                  │
│                                                       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                                                       │
│   Step 2: CURSOR-ATOMIC-프롬프트-완벽가이드.md       │
│   ⏱️ 4-6시간 (전체 완료)                            │
│   🚀 Step 1-20 단계별 진행                           │
│                                                       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                                                       │
│   Step 3: CURSOR-ATOMIC-빠른참조카드.md              │
│   ⏱️ 수시 참조                                       │
│   📌 북마크하고 복사해서 사용                         │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## ⚡ 5분 빠른 시작 (Cursor AI 전용)

### 1단계: Cursor AI 열기 (10초)

```bash
# 터미널에서
cursor .

# 또는 Cursor AI 앱에서 프로젝트 폴더 열기
```

### 2단계: 프로젝트 이해시키기 (2분)

Cursor AI 채팅에 다음을 **전체 복사해서 붙여넣기**:

```
CURSOR-프로젝트-완벽-이해-가이드.md 파일 전체를 읽고 이해해줘.

이 프로젝트는 현풍닭칼국수 PWA 배달앱이고:
- React 18.2 + TypeScript + Vite
- Firebase (Firestore, Auth, Storage, Functions)
- Tailwind CSS v4 + Shadcn UI
- 고객 앱 + 관리자 대시보드
- 현재 Mock 모드 (Firebase 연동 전)

핵심 규칙:
1. ❌ Tailwind 폰트 클래스 사용 금지 (text-xl, font-bold 등)
2. ✅ 브랜드 컬러만 사용 (#D61C1C, #F37021, #C7A45A)
3. ❌ TypeScript any 타입 사용 금지
4. ✅ Firebase는 lib/firebase.ts를 통해서만 접근

이해했다면 "✅ 프로젝트 구조 이해 완료" 라고 답해줘.
```

### 3단계: 첫 번째 작업 시작 (2분)

Cursor AI가 이해했다고 답하면, 바로 **CURSOR-ATOMIC-빠른참조카드.md**를 열고 **Step 1 프롬프트를 복사해서 붙여넣기**:

```
현풍닭칼국수 PWA 프로젝트의 의존성을 설치하고 구조를 확인해줘.

작업:
1. package.json 확인
2. npm install 실행
3. 설치 완료 확인
4. 핵심 파일 존재 확인 (App.tsx, config/env.ts, lib/firebase.ts 등)
5. 설치 결과 리포트 출력

검증:
[ ] npm install 성공
[ ] 에러 없음
[ ] 핵심 파일 모두 존재
```

---

## 🎯 단계별 작업 흐름

### Phase 1: 로컬 환경 설정 (30분)

```
✅ Step 1: 의존성 설치
✅ Step 2: 환경변수 설정 (Mock 모드)
✅ Step 3: 개발 서버 실행

결과: http://localhost:5173 에서 앱 확인 가능
```

**프롬프트 위치**: CURSOR-ATOMIC-빠른참조카드.md > Phase 1

---

### Phase 2: Firebase 프로젝트 생성 (30분)

```
✅ Step 4: Firebase 프로젝트 생성 가이드
   → 사용자가 직접 Firebase Console에서 작업
✅ Step 5: Firebase 구성 정보 .env 적용
✅ Step 6: Firebase SDK 초기화 확인

결과: Firebase 연결 완료
```

**프롬프트 위치**: CURSOR-ATOMIC-빠른참조카드.md > Phase 2

**⚠️ 주의**: Step 4는 사용자가 직접 Firebase Console에서 프로젝트를 생성해야 합니다.

---

### Phase 3: Authentication 연동 (1시간)

```
✅ Step 7: Firebase Authentication 설정 가이드
   → 사용자가 직접 Firebase Console에서 활성화
✅ Step 8: 회원가입 기능 연동
✅ Step 9: 로그인/로그아웃 기능 연동

결과: 사용자 인증 시스템 완성
```

**프롬프트 위치**: CURSOR-ATOMIC-빠른참조카드.md > Phase 3

**테스트**: /signup에서 회원가입 → /login에서 로그인 성공

---

### Phase 4: Firestore 연동 (1.5시간)

```
✅ Step 10: Firestore Database 설정
   → 사용자가 직접 Firebase Console에서 생성
✅ Step 11: 메뉴 데이터 마이그레이션
✅ Step 12: 주문 시스템 연동
✅ Step 13: 리뷰 시스템 연동

결과: 모든 데이터가 Firestore에 저장됨
```

**프롬프트 위치**: CURSOR-ATOMIC-빠른참조카드.md > Phase 4

**테스트**: 
- 메뉴 목록이 Firestore에서 로드
- 주문 생성 → Firestore에 저장
- 리뷰 작성 → Firestore에 저장

---

### Phase 5: Storage & Functions (1시간)

```
✅ Step 14: Cloud Storage 설정
   → 사용자가 직접 Firebase Console에서 활성화
✅ Step 15: 이미지 업로드 기능 연동
✅ Step 16: Cloud Functions 배포
   → Blaze 플랜 업그레이드 필요 (종량제, 무료 할당량 있음)

결과: 이미지 업로드 가능, 서버 함수 작동
```

**프롬프트 위치**: CURSOR-ATOMIC-빠른참조카드.md > Phase 5

**⚠️ 주의**: Step 16은 Blaze 플랜(종량제)이 필요합니다. 신용카드 등록 필요하지만 무료 할당량이 있습니다.

---

### Phase 6: 통합 테스트 (30분)

```
✅ Step 17: 전체 주문 플로우 테스트
   - 로그인 → 메뉴 선택 → 장바구니 → 결제 → 주문 생성 → 추적
✅ Step 18: 관리자 기능 테스트
   - 대시보드, 주문 관리, 메뉴 관리, 리뷰 관리, 설정

결과: 모든 기능 정상 작동 확인
```

**프롬프트 위치**: CURSOR-ATOMIC-빠른참조카드.md > Phase 6

**중요**: 각 단계마다 ✅/❌를 확인하고 문제가 있으면 해결 후 진행

---

### Phase 7: 프로덕션 준비 (30분)

```
✅ Step 19: 디버그 페이지 및 개발 버튼 제거 ⚠️ 필수!
   - /dev 라우트 제거
   - 관리자 디버그 버튼 제거
   - console.log 정리
   - 환경변수 프로덕션 모드로 변경
✅ Step 20: 최종 빌드 및 배포
   - npm run build
   - firebase deploy --only hosting

결과: 프로덕션 배포 완료! 🎉
```

**프롬프트 위치**: CURSOR-ATOMIC-빠른참조카드.md > Phase 7

**⚠️ 중요**: Step 19를 건너뛰면 프로덕션에 디버그 기능이 노출됩니다!

---

## 📌 자주 사용하는 프롬프트

### 에러 발생 시

```
다음 에러가 발생했어:

[에러 메시지 전체 복사]

CURSOR-ATOMIC-빠른참조카드.md의 "에러 발생 시 빠른 해결" 섹션을 참고해서 해결해줘.
```

### 기능 추가 시

```
다음 기능을 추가해줘:

[기능 설명]

주의사항:
1. Tailwind 폰트 클래스 사용 금지
2. 브랜드 컬러 3가지만 사용
3. TypeScript 타입 안정성 유지
4. 기존 기능 유지
```

### 디자인 수정 시

```
[파일 경로]의 디자인을 수정해줘:

[변경 사항]

디자인 규칙:
✅ var(--color-primary), var(--color-secondary), var(--color-accent) 사용
❌ text-xl, font-bold 같은 Tailwind 폰트 클래스 사용 금지
✅ 기존 클래스 유지
```

---

## 🚨 중요 주의사항

### 절대 하지 말아야 할 것 ❌

```
1. Tailwind 폰트 클래스 사용
   ❌ text-xl, text-2xl, font-bold, leading-tight 등

2. 브랜드 컬러 외 색상 사용
   ❌ bg-red-500, text-blue-600 등

3. TypeScript any 타입 사용
   ❌ const data: any = ...

4. Firebase 직접 import
   ❌ import { getFirestore } from 'firebase/firestore';
   ✅ import { db } from './lib/firebase';

5. .env 파일 Git 커밋
   ❌ git add .env

6. /dev 라우트를 프로덕션에 남기기
   ❌ Step 19 건너뛰기
```

### 반드시 해야 할 것 ✅

```
1. 각 Step마다 검증 체크리스트 확인
2. 에러 발생 시 완전히 해결 후 다음 Step 진행
3. Firebase Console에서 작업 필요한 Step은 직접 수행
4. Step 19 (디버그 제거) 필수 실행
5. 최종 빌드 전 모든 기능 테스트
```

---

## 📊 예상 소요 시간

```
전체 완료 시간: 약 6시간

Phase 1: 로컬 환경 설정         30분
Phase 2: Firebase 프로젝트 생성  30분
Phase 3: Authentication 연동     1시간
Phase 4: Firestore 연동          1.5시간
Phase 5: Storage & Functions     1시간
Phase 6: 통합 테스트             30분
Phase 7: 프로덕션 준비           30분
--------------------------------------
합계:                            5.5시간
예비:                            0.5시간
```

---

## 🎯 성공 기준

### 완료 시 확인 사항

```
[ ] http://localhost:5173 에서 앱 정상 작동
[ ] Firebase Authentication 연동 (로그인/회원가입)
[ ] Firestore에 데이터 저장/조회
[ ] Storage에 이미지 업로드
[ ] 전체 주문 플로우 작동 (메뉴 선택 → 결제 → 주문 생성)
[ ] 관리자 대시보드 모든 기능 작동
[ ] /dev 라우트 및 디버그 버튼 제거
[ ] npm run build 성공
[ ] Firebase Hosting 배포 성공
[ ] 배포 URL에서 앱 정상 작동
```

---

## 🆘 도움이 필요할 때

### 1. 빠른 참조 카드 확인

```
CURSOR-ATOMIC-빠른참조카드.md
→ "에러 발생 시 빠른 해결" 섹션
```

### 2. Cursor AI에게 질문

```
"CURSOR-ATOMIC-프롬프트-완벽가이드.md의 Step [번호] 부분에서
다음 문제가 발생했어:

[문제 설명]

어떻게 해결하면 될까?"
```

### 3. 가이드 문서 재확인

```
- CURSOR-프로젝트-완벽-이해-가이드.md (프로젝트 구조)
- CURSOR-ATOMIC-프롬프트-완벽가이드.md (상세 설명)
- CURSOR-ATOMIC-빠른참조카드.md (빠른 참조)
```

---

## 🎉 축하합니다!

이제 시작할 준비가 되었습니다!

### 다음 단계:

```
1. Cursor AI 열기
2. CURSOR-프로젝트-완벽-이해-가이드.md를 Cursor AI에게 읽게 하기
3. CURSOR-ATOMIC-빠른참조카드.md 열기
4. Step 1부터 순서대로 진행
5. 6시간 후 완성! 🎉
```

### 시작하기:

**👉 [CURSOR-프로젝트-완벽-이해-가이드.md](./CURSOR-프로젝트-완벽-이해-가이드.md)를 Cursor AI에게 제공하세요!**

---

**작성:** KS컴퍼니 (사업자번호 553-17-00098)  
**버전:** 1.0.0  
**최종 수정:** 2024-11-08
