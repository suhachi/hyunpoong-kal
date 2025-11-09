# ⚡ Cursor AI - ATOMIC 프롬프트 빠른 참조 카드

> **각 단계를 복사해서 Cursor AI에 붙여넣기만 하면 됩니다!**

---

## 📚 사전 준비

```
다음 문서를 먼저 읽어주세요:
1. CURSOR-프로젝트-완벽-이해-가이드.md
2. CURSOR-ATOMIC-프롬프트-완벽가이드.md (상세 버전)
3. 이 문서 (빠른 참조용)
```

---

## Phase 1: 로컬 환경 설정

### Step 1: 의존성 설치

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

### Step 2: 환경변수 설정

```
.env 파일을 생성하고 개발 모드로 설정해줘.

내용:
VITE_USE_FIREBASE=false
VITE_FIREBASE_API_KEY=MOCK_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=localhost
VITE_FIREBASE_PROJECT_ID=mock-project
VITE_FIREBASE_STORAGE_BUCKET=mock-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:mock
VITE_FIREBASE_MEASUREMENT_ID=G-MOCK

VITE_NICEPAY_MID=MOCK_MID
VITE_NICEPAY_CLIENT_KEY=MOCK_KEY

VITE_PROVIDER_A_API_URL=https://mock.example.com
VITE_PROVIDER_A_API_KEY=MOCK_KEY
VITE_PROVIDER_A_MERCHANT_ID=MOCK_MERCHANT

VITE_DELIVERY_ENABLED=true
VITE_DELIVERY_PROVIDER=mock
VITE_SUPPORT_ENABLED=true
VITE_POINTS_ENABLED=true

VITE_APP_ENV=development

검증:
[ ] .env 파일 생성됨
[ ] VITE_USE_FIREBASE=false
[ ] .gitignore에 .env 포함됨
```

---

### Step 3: 개발 서버 실행

```
개발 서버를 시작하고 모든 라우트가 정상 작동하는지 확인해줘.

작업:
1. npm run dev 실행
2. 다음 URL 접속 확인:
   - http://localhost:5173/
   - http://localhost:5173/menu
   - http://localhost:5173/cart
   - http://localhost:5173/my
   - http://localhost:5173/login
   - http://localhost:5173/admin
   - http://localhost:5173/dev
3. 브라우저 콘솔 에러 확인
4. Hot Reload 테스트

검증:
[ ] npm run dev 성공
[ ] 모든 페이지 접속 가능
[ ] 콘솔 에러 없음
[ ] Hot Reload 작동
```

---

## Phase 2: Firebase 프로젝트 생성

### Step 4: Firebase 프로젝트 생성 가이드

```
Firebase 프로젝트를 생성하는 단계별 가이드를 출력해줘.

포함 내용:
1. Firebase Console 접속 방법
2. 프로젝트 생성 단계
3. 웹 앱 추가 방법
4. 구성 정보 복사 방법

⚠️ 사용자가 직접 Firebase Console에서 작업 필요
```

---

### Step 5: Firebase 구성 정보 적용

```
.env 파일을 업데이트하여 실제 Firebase 구성 정보를 적용해줘.

사용자에게 Step 4에서 복사한 구성 정보를 요청:
- apiKey
- authDomain
- projectId
- storageBucket
- messagingSenderId
- appId
- measurementId

변경 사항:
VITE_USE_FIREBASE=false → true
모든 MOCK 값 → 실제 값

검증:
[ ] VITE_USE_FIREBASE=true
[ ] 모든 구성 값 실제 값으로 교체
[ ] 개발 서버 재시작
```

---

### Step 6: Firebase SDK 초기화 확인

```
Firebase SDK가 제대로 초기화되었는지 확인해줘.

작업:
1. 브라우저 콘솔 열기 (F12)
2. Firebase 초기화 메시지 확인
3. 에러가 없는지 확인
4. lib/firebase.ts에 임시 로그 추가:
   console.log('✅ Firebase 초기화 성공');
   console.log('  - Project ID:', firebaseConfig.projectId);

검증:
[ ] 콘솔에 초기화 성공 메시지
[ ] Firebase 관련 에러 없음
[ ] Network 탭에서 Firebase 요청 성공
```

---

## Phase 3: Authentication 연동

### Step 7: Firebase Authentication 설정 가이드

```
Firebase Authentication을 설정하는 가이드를 출력해줘.

포함 내용:
1. Authentication 활성화 방법
2. 이메일/비밀번호 로그인 활성화
3. Google 로그인 활성화 (선택)
4. 테스트 계정 생성 방법

⚠️ 사용자가 직접 Firebase Console에서 작업 필요
```

---

### Step 8: 회원가입 기능 연동

```
lib/auth.ts 파일의 signUp 함수를 Firebase Auth와 연동해줘.

구현:
- Firebase createUserWithEmailAndPassword 사용
- Firestore users 컬렉션에 프로필 저장
- 에러 처리 (이메일 중복, 약한 비밀번호 등)

테스트:
1. /signup 페이지에서 회원가입
2. Firebase Console > Authentication 확인
3. Firestore > users 컬렉션 확인

검증:
[ ] signUp 함수 연동 완료
[ ] 회원가입 성공
[ ] Firebase에 사용자 생성 확인
[ ] Firestore에 프로필 저장 확인
```

---

### Step 9: 로그인/로그아웃 기능 연동

```
lib/auth.ts의 signIn과 signOut 함수를 Firebase Auth와 연동하고,
AuthContext.tsx를 업데이트해줘.

구현:
1. signIn: signInWithEmailAndPassword 사용
2. signOut: firebaseSignOut 사용
3. AuthContext: onAuthStateChanged로 실시간 감지

테스트:
1. 로그인 (test@example.com)
2. 로그아웃
3. 세션 유지 (새로고침 후에도 로그인 상태)

검증:
[ ] 로그인 성공
[ ] 로그아웃 성공
[ ] 세션 유지 확인
```

---

## Phase 4: Firestore 연동

### Step 10: Firestore Database 설정

```
Firestore Database 설정 가이드를 출력하고,
보안 규칙 파일(firestore.rules)이 올바른지 검증해줘.

작업:
1. Firestore Database 생성 가이드 출력
2. firestore.rules 파일 확인
3. 보안 규칙 배포 명령어 출력

⚠️ 사용자가 직접 Firebase Console과 터미널에서 작업 필요
```

---

### Step 11: 메뉴 데이터 마이그레이션

```
data/menus.json의 데이터를 Firestore menus 컬렉션으로 마이그레이션하는
스크립트를 작성하고 실행해줘.

작업:
1. scripts/migrate-menus.ts 생성
2. package.json에 스크립트 추가
3. npm run migrate:menus 실행
4. lib/admin/menus.api.ts를 Firestore 사용하도록 수정

검증:
[ ] 마이그레이션 스크립트 실행 성공
[ ] Firebase Console에서 menus 컬렉션 확인
[ ] /menu 페이지에서 데이터 로드 확인
```

---

### Step 12: 주문 시스템 연동

```
주문 시스템을 Firestore와 연동해줘.

작업:
1. lib/orders.api.ts 업데이트 (고객용)
2. lib/admin/orders.api.ts 업데이트 (관리자용)
3. firestore.indexes.json 생성/확인
4. firebase deploy --only firestore:indexes 실행

테스트:
1. 주문 생성
2. 주문 조회
3. 주문 내역 조회
4. 관리자 주문 관리
5. 주문 상태 변경

검증:
[ ] 주문 생성 성공
[ ] Firestore에 저장 확인
[ ] 관리자 대시보드에서 확인
```

---

### Step 13: 리뷰 시스템 연동

```
리뷰 시스템을 Firestore와 연동해줘.

작업:
1. lib/reviews.api.ts 생성 (고객용)
2. lib/admin/reviews.api.ts 업데이트 (관리자용)
3. Storage 이미지 업로드 포함
4. storage.rules 확인 및 배포

테스트:
1. 리뷰 작성 (텍스트만)
2. 리뷰 작성 (사진 포함)
3. Storage에 이미지 확인
4. 관리자 답글 작성

검증:
[ ] 리뷰 작성 성공
[ ] 이미지 업로드 성공
[ ] 리뷰 조회 성공
```

---

## Phase 5: Storage & Functions

### Step 14: Cloud Storage 설정 가이드

```
Firebase Cloud Storage 설정 가이드를 출력해줘.

포함 내용:
1. Storage 활성화 방법
2. CORS 설정 방법
3. storage.rules 배포 방법

⚠️ 사용자가 직접 Firebase Console과 터미널에서 작업 필요
```

---

### Step 15: 이미지 업로드 기능 확인

```
이미지 업로드 기능이 제대로 작동하는지 테스트하고,
필요하면 pages/app/ReviewWrite.tsx를 수정해줘.

테스트:
1. JPG 파일 업로드
2. PNG 파일 업로드
3. 파일 크기 검증
4. Storage에 저장 확인

검증:
[ ] 이미지 업로드 성공
[ ] Storage에 파일 확인
[ ] 다운로드 URL 접근 가능
```

---

### Step 16: Cloud Functions 배포 가이드

```
Firebase Cloud Functions를 배포하기 위한 가이드를 출력해줘.

포함 내용:
1. Blaze 플랜 업그레이드 방법
2. Functions 의존성 설치
3. 환경변수 설정
4. 배포 명령어

⚠️ 사용자가 직접 터미널에서 작업 필요
⚠️ Blaze 플랜(종량제) 필수
```

---

## Phase 6: 통합 테스트

### Step 17: 전체 주문 플로우 테스트

```
전체 주문 플로우를 테스트하고 각 단계의 정상 작동 여부를 확인해줘.

테스트 시나리오:
1. 로그인
2. 메뉴 선택
3. 장바구니 담기
4. 결제
5. 주문 생성 확인 (Firestore)
6. 주문 추적
7. 주문 내역
8. 관리자 확인 및 상태 변경

각 단계마다 ✅/❌ 표시하고 리포트 출력

검증:
[ ] 모든 단계 정상 작동
[ ] Firestore 연동 확인
[ ] 에러 없음
```

---

### Step 18: 관리자 기능 테스트

```
관리자 대시보드의 모든 기능을 테스트하고 정상 작동 여부를 확인해줘.

테스트 대상:
1. 대시보드 (/admin)
2. 주문 관리 (/admin/orders)
3. 메뉴 관리 (/admin/menus)
4. 리뷰 관리 (/admin/reviews)
5. 통합 리포트 (/admin/integrated-analytics)
6. 설정 (/admin/settings)

각 기능 테스트 후 ✅/❌ 표시하고 리포트 출력

검증:
[ ] 모든 기능 정상
[ ] Firestore 연동 확인
```

---

## Phase 7: 프로덕션 준비

### Step 19: 디버그 페이지 및 개발 버튼 제거 ⚠️ **필수!**

```
프로덕션 배포를 위해 모든 개발 전용 요소를 제거해줘.

작업:
1. App.tsx에서 /dev 라우트 제거 또는 조건부 처리
2. 관리자 대시보드의 디버그 버튼 제거:
   - Dashboard.tsx
   - Orders.tsx
   - Menus.tsx
   - Settings/index.tsx
3. console.log 정리 (에러 로그는 유지)
4. .env: VITE_APP_ENV=production, VITE_APP_DEBUG=false
5. config/env.ts: USE_FIREBASE=true 확인
6. 테스트 계정 정보 제거
7. 불필요한 주석 제거

검증:
[ ] /dev 라우트 제거
[ ] 디버그 버튼 모두 제거
[ ] console.log 정리
[ ] 환경변수 프로덕션 모드
[ ] npm run build 성공
```

---

### Step 20: 최종 빌드 및 배포

```
프로덕션 배포를 위한 최종 체크리스트를 확인하고 빌드해줘.

작업:
1. 최종 체크리스트 확인
2. npx tsc --noEmit (타입 체크)
3. npm run lint (린트 체크)
4. npm run build (프로덕션 빌드)
5. npm run preview (프리뷰 테스트)
6. firebase deploy --only hosting (배포)

검증:
[ ] 체크리스트 모두 완료
[ ] 빌드 성공
[ ] 프리뷰 정상
[ ] 배포 성공
[ ] 배포 URL 접속 확인
```

---

## 🚨 에러 발생 시 빠른 해결

### npm install 실패

```
다음 명령어로 재시도해줘:
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

### Port 5173 already in use

```
포트 충돌을 해결해줘:
lsof -ti:5173 | xargs kill -9
npm run dev
```

### Firebase 초기화 실패

```
.env 파일의 Firebase 구성 정보를 다시 확인해줘.
Firebase Console에서 구성 정보를 다시 복사해서 비교해줘.
```

### Firestore 권한 오류

```
Firebase Console > Firestore > 규칙 탭에서
firestore.rules 내용을 복사해서 붙여넣고 "게시" 클릭하라고 안내해줘.
```

---

## 📌 중요 포인트

### 절대 잊지 말 것!

```
1. ❌ Tailwind 폰트 클래스 사용 금지
   text-xl, font-bold 등 사용하지 말 것

2. ✅ 브랜드 컬러 3가지만 사용
   #D61C1C (현풍레드)
   #F37021 (신칼오렌지)
   #C7A45A (황동식기색)

3. ❌ TypeScript any 타입 사용 금지

4. ✅ .env 파일 Git 커밋 금지 (.gitignore 확인)

5. ⚠️ Step 19 꼭 실행 (디버그 제거)
```

---

## ✅ 최종 완료 체크리스트

```
Phase 1: 로컬 환경 설정
[ ] Step 1: 의존성 설치
[ ] Step 2: 환경변수 설정
[ ] Step 3: 개발 서버 실행

Phase 2: Firebase 프로젝트 생성
[ ] Step 4: Firebase 프로젝트 생성
[ ] Step 5: 구성 정보 적용
[ ] Step 6: SDK 초기화 확인

Phase 3: Authentication 연동
[ ] Step 7: Authentication 설정
[ ] Step 8: 회원가입 연동
[ ] Step 9: 로그인/로그아웃 연동

Phase 4: Firestore 연동
[ ] Step 10: Database 설정
[ ] Step 11: 메뉴 마이그레이션
[ ] Step 12: 주문 시스템 연동
[ ] Step 13: 리뷰 시스템 연동

Phase 5: Storage & Functions
[ ] Step 14: Storage 설정
[ ] Step 15: 이미지 업로드 연동
[ ] Step 16: Cloud Functions 배포

Phase 6: 통합 테스트
[ ] Step 17: 주문 플로우 테스트
[ ] Step 18: 관리자 기능 테스트

Phase 7: 프로덕션 준비
[ ] Step 19: 디버그 제거 ⚠️
[ ] Step 20: 최종 빌드 및 배포

Phase 8: 추가 기능 (선택사항)
[ ] Step 21: 결제사 선택 시스템 (나이스페이/토스페이먼츠)
```

---

## 🎁 보너스: Step 21 - 결제사 선택 시스템

### Step 21: 결제사 선택 시스템 구축 (선택사항)

**목표**: 나이스페이와 토스페이먼츠 중 점주가 선택할 수 있도록

```
결제사 선택 시스템을 구축해줘. (나이스페이 / 토스페이먼츠)

PAYMENT-PROVIDER-선택-시스템-가이드.md를 참고해서:

작업:
1. types/payment.ts에 PaymentProvider 타입 추가
2. /lib/payment/providers/ 폴더 생성:
   - nicepay.ts (나이스페이 구현)
   - toss.ts (토스페이먼츠 구현)
   - mock.ts (개발용)
3. /lib/payment/index.ts 생성 (Provider 팩토리)
4. config/env.ts에 토스페이먼츠 설정 추가
5. pages/admin/Settings/PaymentTab.tsx 업데이트
   - 결제사 선택 라디오 버튼
   - 선택에 따른 입력 필드
6. pages/app/Checkout.tsx 수정
   - getPaymentProvider() 사용

테스트:
1. 관리자 > 설정 > 결제 탭
2. 토스페이먼츠 선택
3. Client Key / Secret Key 입력
4. 저장
5. 고객 앱에서 결제 테스트

검증:
[ ] Provider 파일들 생성 완료
[ ] 관리자 설정 UI 작동
[ ] Firestore에 설정 저장 확인
[ ] 결제 플로우 정상 작동
```

**참고 문서**: [PAYMENT-PROVIDER-선택-시스템-가이드.md](./PAYMENT-PROVIDER-선택-시스템-가이드.md)

---

**작성:** KS컴퍼니 (사업자번호 553-17-00098)  
**버전:** 1.1.0  
**최종 수정:** 2024-11-08
