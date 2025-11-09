# ⚡ Cursor AI - ATOMIC 프롬프트 빠른 참조 v2

> **복사 → 붙여넣기 → 완성!**  
> 각 Step을 순서대로 Cursor AI에 붙여넣으세요.

**작성:** KS컴퍼니 (사업자번호: 553-17-00098)  
**버전:** 2.0 (2024-11-08 업데이트)

---

## 📚 사전 필독

```
다음 문서를 먼저 Cursor AI에게 읽히세요:
1. CURSOR-완벽-작업-가이드-v2.md (필수!)
2. 이 문서 (빠른 참조용)

중요 규칙:
❌ 브랜드 컬러 변경 금지 (#D61C1C, #F37021, #C7A45A)
❌ font-size, font-weight Tailwind 클래스 사용 금지
❌ 기존 디자인 수정 금지 (버그 아니면)
❌ any 타입 사용 금지
❌ 플레이스홀더 (TODO, ...) 절대 금지
```

---

## Phase 1: 환경 설정

### Step 1: 의존성 설치

```
현풍닭칼국수 PWA 프로젝트의 의존성을 설치하고 프로젝트 구조를 확인해줘.

작업:
1. package.json 확인
2. npm install 실행 (또는 확인)
3. 핵심 파일 존재 확인:
   - App.tsx
   - main.tsx
   - lib/firebase.ts
   - styles/design-lock.css
   - constants/design-tokens.ts

검증:
[ ] npm install 성공
[ ] 모든 핵심 파일 존재
[ ] 에러 없음

완료 후 리포트 출력.
```

---

### Step 2: 환경변수 (.env)

```
.env 파일을 생성하고 개발 모드로 설정해줘.

⚠️ 이미 존재하면 덮어쓰지 말고 내용만 확인!

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
[ ] .env 파일 생성/확인
[ ] VITE_USE_FIREBASE=false
[ ] .gitignore에 .env 포함

완료 후 "환경변수 설정 완료" 보고.
```

---

### Step 3: 디자인 잠금 확인

```
디자인 CSS 잠금이 활성화되어 있는지 확인해줘.

확인 사항:
1. styles/design-lock.css 존재
2. main.tsx에서 import './styles/design-lock.css' 확인
3. constants/design-tokens.ts 확인
4. 브랜드 컬러 확인:
   - BRAND_COLORS.hyunpungRed = '#D61C1C'
   - BRAND_COLORS.shinkalOrange = '#F37021'
   - BRAND_COLORS.brassWareGold = '#C7A45A'

검증:
[ ] design-lock.css 존재
[ ] main.tsx에 import
[ ] 브랜드 컬러 3개 확인

완료 후 브랜드 컬러 3개 출력.
```

---

### Step 4: 개발 서버 실행

```
개발 서버를 시작하고 주요 라우트를 확인해줘.

작업:
1. npm run dev 실행
2. 다음 URL 접속 확인:
   - http://localhost:5173/
   - http://localhost:5173/menu
   - http://localhost:5173/cart
   - http://localhost:5173/admin
   - http://localhost:5173/admin/settings

검증:
[ ] npm run dev 성공
[ ] 모든 페이지 접속 가능
[ ] 콘솔 에러 없음 (Warning OK)
[ ] HMR 작동

완료 후 각 URL 상태 리포트.
```

---

### Step 5: Mock 인증 테스트

```
Mock 인증이 정상 작동하는지 테스트해줘.

작업:
1. lib/auth.ts 확인
2. USE_FIREBASE = false 확인
3. Mock 사용자 확인

브라우저 콘솔 테스트:
localStorage.setItem('mockRole', 'owner');
location.reload();

검증:
[ ] lib/auth.ts 확인
[ ] Mock 모드 확인
[ ] Owner로 /admin 접속 가능

완료 후 "Mock 인증 테스트 완료" 보고.
```

---

## Phase 2: 관리자 기능

### Step 6: 관리자 대시보드 테스트

```
관리자 대시보드의 모든 메뉴를 테스트해줘.

작업:
1. Owner 로그인:
   localStorage.setItem('mockRole', 'owner');
   location.reload();

2. 다음 메뉴 접속 확인:
   - /admin (대시보드)
   - /admin/orders (주문 관리)
   - /admin/delivery (배달 관제)
   - /admin/support (고객 지원)
   - /admin/reviews (리뷰)
   - /admin/menus (메뉴)
   - /admin/promotions (쿠폰)
   - /admin/points (포인트)
   - /admin/analytics (관제)
   - /admin/integrated-analytics (통합 리포트)
   - /admin/settings (설정) ⭐

검증:
[ ] 11개 메뉴 모두 접속
[ ] Mock 데이터 표시
[ ] UI 깨짐 없음

완료 후 각 메뉴 상태 리포트.
```

---

### Step 7: 설정 센터 테스트

```
관리자 설정 센터의 5개 탭을 모두 테스트해줘.

작업:
1. /admin/settings 접속

2. 5개 탭 테스트:
   - 결제 (payment) ⭐ 나이스페이/토스 선택
   - 배달대행 (delivery)
   - 지도/지오 (maps)
   - 알림/FCM (fcm)
   - 운영/보안 (operations)

3. 결제 탭 상세 테스트:
   - 나이스페이 라디오 클릭
   - 나이스페이 가이드 표시 확인
   - 토스페이먼츠 라디오 클릭
   - 토스 가이드 표시 확인
   - CLI 명령어 복사 버튼 테스트

검증:
[ ] 5개 탭 모두 정상
[ ] 결제사 선택 작동
[ ] CLI 복사 작동
[ ] UI 정상

완료 후 "설정 센터 테스트 완료" 보고.
```

---

## Phase 3: 고객 앱 기능

### Step 8: 주문 플로우 테스트

```
고객 앱의 전체 주문 플로우를 테스트해줘.

작업:
1. Customer 로그인:
   localStorage.setItem('mockRole', 'customer');
   location.reload();

2. 주문 플로우:
   Step 1: /menu → 메뉴 선택
   Step 2: /menu/:id → 옵션 선택 → 장바구니 담기
   Step 3: /cart → 수량 변경 → 주문하기
   Step 4: /checkout → 배송 정보 입력 → 결제하기
   Step 5: /order/:id → 주문 확인
   Step 6: /order/:id/tracking → 배달 추적

검증:
[ ] 전체 플로우 완료
[ ] Mock 결제 성공
[ ] 에러 없음

완료 후 플로우 테스트 리포트.
```

---

### Step 9: 리뷰 시스템 테스트

```
리뷰 작성 및 관리를 테스트해줘.

작업:
1. Customer로 로그인 유지

2. 리뷰 플로우:
   - /my/orders → 완료된 주문 확인
   - "리뷰 작성" 클릭
   - /review/write → 별점, 내용 입력
   - 등록
   - /reviews → 리뷰 목록 확인

3. 관리자 확인:
   - Owner 로그인
   - /admin/reviews
   - 리뷰 목록 확인
   - 답글 작성 테스트

검증:
[ ] 리뷰 작성 완료
[ ] 목록 표시
[ ] 관리자 답글 가능

완료 후 "리뷰 시스템 테스트 완료" 보고.
```

---

## Phase 4: Firebase 연동 (선택)

### Step 10: Firebase 실제 연동

```
Firebase를 실제로 연동해줘.

⚠️ 실제 Firebase 프로젝트가 있을 때만!

작업:
1. .env 백업:
   cp .env .env.backup

2. .env 수정:
   VITE_USE_FIREBASE=true
   VITE_FIREBASE_API_KEY=실제_키
   VITE_FIREBASE_PROJECT_ID=hp-kal
   ... (나머지 실제 값)

3. npm run dev (재시작)

4. Firebase 연결 확인

검증:
[ ] .env 백업
[ ] Firebase 키 입력
[ ] 서버 재시작
[ ] 연결 성공

⚠️ 실제 키 없으면 건너뛰기!

완료 후 Firebase 상태 리포트.
```

---

### Step 11: Firestore 데이터 테스트

```
Firestore에 실제 데이터를 읽고 쓰는 테스트를 해줘.

⚠️ VITE_USE_FIREBASE=true일 때만!

작업:
1. Firebase 콘솔 확인:
   https://console.firebase.google.com/project/hp-kal/firestore

2. 주문 생성 테스트:
   - /menu에서 주문
   - Firestore에서 orders 확인

3. 관리자에서 조회:
   - /admin/orders
   - 실시간 업데이트 확인

검증:
[ ] 주문 생성 성공
[ ] Firestore 저장 확인
[ ] 실시간 조회 성공

완료 후 "Firestore 테스트 완료" 보고.
```

---

## Phase 5: 프로덕션 준비

### Step 12: 디버그 코드 제거

```
프로덕션 배포 전 디버그 코드를 모두 제거해줘.

⚠️ 배포 직전에만 수행!

작업:
1. 파일 삭제:
   - pages/DevTools.tsx
   - pages/app/Debug.tsx

2. App.tsx에서 라우트 제거:
   - <Route path="/dev" ... />
   - <Route path="/debug" ... />

3. 링크 제거:
   - Header, BottomNav에서 디버그 링크
   - Dashboard에서 디버그 버튼

4. console.log 제거:
   - 모든 파일에서 console.log() 제거
   - console.error()는 유지

검증:
[ ] DevTools.tsx 삭제
[ ] Debug.tsx 삭제
[ ] 라우트 제거
[ ] 디버그 링크 제거
[ ] console.log 제거
[ ] 빌드 에러 없음

완료 후 제거된 항목 리스트 출력.
```

---

### Step 13: 환경변수 최종 확인

```
프로덕션 환경변수를 최종 확인해줘.

작업:
1. .env.production 파일 생성 (없으면)

2. 프로덕션 설정:
   VITE_USE_FIREBASE=true
   VITE_APP_ENV=production
   ... (실제 프로덕션 값)

3. .gitignore 확인:
   .env
   .env.production

4. Firebase Functions Config:
   firebase functions:config:set \
     nicepay.mode="production" \
     nicepay.mid="실제_MID" \
     nicepay.key="실제_KEY"

   firebase functions:config:set \
     toss.mode="production" \
     toss.client_key="실제_KEY" \
     toss.secret_key="실제_SECRET"

검증:
[ ] .env.production 생성
[ ] 모든 환경변수 입력
[ ] .gitignore 확인
[ ] Functions Config 설정

완료 후 "환경변수 최종 확인 완료" 보고.
```

---

### Step 14: 빌드 및 배포

```
프로덕션 빌드를 생성하고 배포해줘.

작업:
1. 빌드:
   npm run build

2. 빌드 결과 확인:
   - dist/ 디렉토리
   - 번들 크기
   - 에러/경고

3. 프리뷰:
   npm run preview
   - http://localhost:4173 접속
   - 모든 페이지 테스트

4. Firebase 배포 (선택):
   firebase deploy --only functions
   firebase deploy --only hosting
   
   또는
   
   firebase deploy

5. 배포 후 확인:
   - https://hp-kal.web.app
   - 전체 기능 테스트

검증:
[ ] npm run build 성공
[ ] dist/ 생성
[ ] preview 정상
[ ] (선택) 배포 성공

완료 후 빌드 리포트 출력.
```

---

### Step 15: 최종 품질 검증

```
프로덕션 배포 전 최종 품질 검증을 수행해줘.

작업:
1. 디자인 검증:
   npm run design:verify

2. TypeScript 검증:
   npx tsc --noEmit

3. Lint 검증:
   npm run lint

4. Lighthouse 테스트:
   - 성능 > 90
   - 접근성 > 95
   - SEO 최적화
   - PWA 완벽

검증:
[ ] 디자인 통과
[ ] TypeScript 에러 없음
[ ] Lint 에러 없음
[ ] Lighthouse > 90

완료 후 Lighthouse 점수 리포트.
```

---

## 🎯 핵심 규칙 (항상 기억!)

```
❌ 절대 금지:
1. 브랜드 컬러 변경 (#D61C1C, #F37021, #C7A45A)
2. font-size, font-weight Tailwind 클래스
3. 기존 컴포넌트 스타일 수정 (버그 아니면)
4. any 타입 사용
5. 플레이스홀더 (TODO, ..., /* ... */)
6. !important 남발
7. 임의의 색상 (#123456)

✅ 항상 할 것:
1. BRAND_COLORS 상수 사용
2. types/*.ts 타입 활용
3. 100% 완전 구현
4. 디자인 잠금 확인
5. Mock 모드 체크 (USE_FIREBASE)
```

---

## 🚨 문제 해결

### 디자인 깨짐

```bash
npm run design:verify
npm run design:lock
npm run dev
```

### TypeScript 에러

```bash
npx tsc --noEmit
# VSCode: Ctrl+Shift+P → "Reload Window"
```

### 빌드 에러

```bash
rm -rf node_modules
npm install
npm run build
```

---

## 📚 참고 문서

```
필수:
- CURSOR-완벽-작업-가이드-v2.md
- CURSOR-프로젝트-완벽-이해-가이드.md

디자인:
- DESIGN-LOCK-QUICK-START.md
- DESIGN-LOCK-README.md

Firebase:
- FIREBASE-연동-완벽-가이드.md

결제:
- PAYMENT-PROVIDER-선택-시스템-가이드.md
- 결제사-선택-시스템-요약.md

배포:
- DEPLOYMENT-READY-CHECKLIST.md
```

---

## ✅ 전체 체크리스트

```
Phase 1: 환경 설정
[ ] Step 1: 의존성 설치
[ ] Step 2: 환경변수
[ ] Step 3: 디자인 잠금
[ ] Step 4: 개발 서버
[ ] Step 5: Mock 인증

Phase 2: 관리자
[ ] Step 6: 대시보드
[ ] Step 7: 설정 센터

Phase 3: 고객 앱
[ ] Step 8: 주문 플로우
[ ] Step 9: 리뷰 시스템

Phase 4: Firebase (선택)
[ ] Step 10: 실제 연동
[ ] Step 11: Firestore 테스트

Phase 5: 프로덕션
[ ] Step 12: 디버그 제거
[ ] Step 13: 환경변수
[ ] Step 14: 빌드/배포
[ ] Step 15: 품질 검증
```

---

**작성: KS컴퍼니 (사업자번호: 553-17-00098)**  
**버전: 2.0**  
**최종 업데이트: 2024-11-08**

🎉 **복사 → 붙여넣기 → 완성!**
