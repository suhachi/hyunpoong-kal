# 🚀 Cursor AI 로컬 작업 완벽 가이드

> **현풍닭칼국수 PWA 배달앱 - 로컬 개발 환경 구축부터 Firebase 연동까지**  
> 작성일: 2024-11-07  
> 대상: Cursor AI를 사용하여 로컬에서 개발하는 개발자

---

## 📋 목차

1. [사전 준비](#1-사전-준비)
2. [코드 다운로드 및 초기 설정](#2-코드-다운로드-및-초기-설정)
3. [의존성 설치](#3-의존성-설치)
4. [환경변수 설정](#4-환경변수-설정)
5. [로컬 개발 서버 실행](#5-로컬-개발-서버-실행)
6. [Firebase 프로젝트 생성](#6-firebase-프로젝트-생성)
7. [Firebase 설정 및 연동](#7-firebase-설정-및-연동)
8. [Cursor AI 사용법](#8-cursor-ai-사용법)
9. [트러블슈팅](#9-트러블슈팅)
10. [다음 단계](#10-다음-단계)

---

## 1. 사전 준비

### 1.1 필수 소프트웨어 설치

#### A. Node.js 설치
```bash
# 버전 확인 (18.0.0 이상 필요)
node --version

# 없으면 설치
# https://nodejs.org/ 에서 LTS 버전 다운로드
# 권장 버전: v18.17.0 또는 v20.x.x
```

#### B. npm 확인
```bash
# Node.js 설치 시 자동으로 설치됨
npm --version

# 최신 버전으로 업데이트 (선택사항)
npm install -g npm@latest
```

#### C. Git 설치 (선택사항)
```bash
# 버전 확인
git --version

# 없으면 설치
# https://git-scm.com/
```

#### D. Cursor AI 설치
```bash
# https://cursor.sh/ 에서 다운로드
# Windows / macOS / Linux 지원
```

### 1.2 필수 계정 준비

✅ **지금 당장 필요:**
- [ ] Cursor AI 계정 (무료 플랜 가능)

📅 **나중에 필요 (Firebase 연동 시):**
- [ ] Google 계정 (Firebase용)
- [ ] Firebase Blaze 플랜 (결제카드 등록 필요, 무료 할당량 있음)
- [ ] NICEPAY 계정 (결제 연동 시)
- [ ] Google Maps API 키 (지도 기능 시)

---

## 2. 코드 다운로드 및 초기 설정

### 2.1 Figma Make에서 코드 다운로드

#### 방법 1: Figma Make UI에서 다운로드
```
1. Figma Make에서 "Download" 또는 "내보내기" 버튼 클릭
2. ZIP 파일 다운로드
3. 압축 해제
```

#### 방법 2: 직접 파일 복사
```
1. Figma Make의 파일 탐색기에서 전체 선택
2. 로컬 폴더로 복사
```

### 2.2 프로젝트 폴더 생성

```bash
# 작업할 위치로 이동 (예: 바탕화면)
cd ~/Desktop

# 프로젝트 폴더 생성
mkdir hyeonpung-kalguksu
cd hyeonpung-kalguksu

# 다운로드한 파일들을 이 폴더로 이동
```

### 2.3 폴더 구조 확인

```bash
# 폴더 구조가 올바른지 확인
ls -la

# 다음 파일/폴더가 있어야 함:
# ✅ package.json
# ✅ vite.config.ts
# ✅ index.html
# ✅ App.tsx
# ✅ components/
# ✅ pages/
# ✅ lib/
# ✅ styles/
```

**중요:** 만약 `hyeonpung-kalguksu` 같은 상위 폴더가 한 번 더 중첩되어 있다면:

```bash
# 잘못된 구조 (중첩됨)
hyeonpung-kalguksu/
  └── hyeonpung-kalguksu/
      ├── package.json
      └── ...

# 올바른 구조
hyeonpung-kalguksu/
  ├── package.json
  └── ...

# 수정 방법
cd hyeonpung-kalguksu
mv hyeonpung-kalguksu/* .
rm -rf hyeonpung-kalguksu
```

### 2.4 Cursor AI로 프로젝트 열기

```bash
# 방법 1: 터미널에서
cursor .

# 방법 2: Cursor AI 앱에서
# File > Open Folder > hyeonpung-kalguksu 선택
```

---

## 3. 의존성 설치

### 3.1 package.json 확인

Cursor AI에서 `package.json` 파일을 열어 확인:

```json
{
  "name": "hyeonpung-kalguksu",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.x.x",
    "firebase": "^10.x.x",
    ...
  }
}
```

### 3.2 npm 의존성 설치

Cursor AI의 터미널에서 실행:

```bash
# Cursor AI에서 터미널 열기
# macOS/Linux: Ctrl + `
# Windows: Ctrl + `

# 의존성 설치 (3-5분 소요)
npm install

# 설치 완료 확인
ls -la node_modules/
```

#### 설치 중 발생할 수 있는 경고

```bash
# ⚠️ 이런 경고는 무시해도 됨
npm WARN deprecated ...
npm notice created a lockfile as package-lock.json

# ❌ 이런 에러는 해결 필요
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**에러 발생 시:**

```bash
# 방법 1: legacy-peer-deps 옵션 사용
npm install --legacy-peer-deps

# 방법 2: 캐시 삭제 후 재설치
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# 방법 3: Node.js 버전 확인 및 변경
node --version  # 18.x 또는 20.x 사용
```

### 3.3 Firebase Tools 설치 (선택사항)

Firebase 연동을 위해 나중에 필요:

```bash
# 전역 설치
npm install -g firebase-tools

# 버전 확인
firebase --version

# 로그인 (나중에 사용)
# firebase login
```

---

## 4. 환경변수 설정

### 4.1 .env 파일 생성

프로젝트 루트에 `.env` 파일 생성:

**Cursor AI에게 지시:**

```
프로젝트 루트에 .env 파일을 생성하고 다음 내용을 추가해줘:

VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=hp-kal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hp-kal
VITE_FIREBASE_STORAGE_BUCKET=hp-kal.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID

VITE_NICEPAY_MID=YOUR_NICEPAY_MID
VITE_NICEPAY_MERCHANT_KEY=YOUR_NICEPAY_KEY

VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_KEY

VITE_APP_ENV=development
VITE_APP_DEBUG=true
```

### 4.2 현재는 임시값 사용

**지금 단계에서는 임시값으로 설정:**

```bash
# Cursor AI 터미널에서
cat > .env << 'EOF'
VITE_FIREBASE_API_KEY=TEMP_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=hp-kal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hp-kal
VITE_FIREBASE_STORAGE_BUCKET=hp-kal.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123

VITE_NICEPAY_MID=TEMP_MID
VITE_NICEPAY_MERCHANT_KEY=TEMP_KEY

VITE_GOOGLE_MAPS_API_KEY=TEMP_MAPS_KEY

VITE_APP_ENV=development
VITE_APP_DEBUG=true
EOF
```

### 4.3 .gitignore 확인

`.env` 파일이 Git에 커밋되지 않도록 확인:

```bash
# .gitignore 파일 확인
cat .gitignore | grep .env

# 출력되어야 함:
# .env
# .env.local
# .env.*.local
```

---

## 5. 로컬 개발 서버 실행

### 5.1 개발 서버 시작

```bash
# Cursor AI 터미널에서
npm run dev

# 출력 예시:
# VITE v5.x.x  ready in 500 ms
# 
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose
# ➜  press h + enter to show help
```

### 5.2 브라우저에서 확인

1. 브라우저 열기 (Chrome 권장)
2. `http://localhost:5173/` 접속
3. 현풍닭칼국수 홈 화면 확인

**확인 체크리스트:**

```
✅ 페이지가 로딩되는가?
✅ 브랜드 컬러(빨강, 주황)가 보이는가?
✅ 메뉴 이미지가 보이는가? (Unsplash 사용)
✅ 네비게이션이 작동하는가?
✅ 콘솔 에러가 없는가? (F12 → Console)
```

### 5.3 모든 페이지 테스트

**고객 앱:**
```
http://localhost:5173/          # 홈
http://localhost:5173/menu      # 메뉴 목록
http://localhost:5173/cart      # 장바구니
http://localhost:5173/my        # 마이페이지
http://localhost:5173/login     # 로그인
```

**관리자 대시보드:**
```
http://localhost:5173/admin                    # 대시보드
http://localhost:5173/admin/orders             # 주문 관리
http://localhost:5173/admin/menus              # 메뉴 관리
http://localhost:5173/admin/reviews            # 리뷰 관리
http://localhost:5173/admin/integrated-analytics  # 통합 리포트
http://localhost:5173/admin/settings           # 설정
```

### 5.4 Hot Reload 확인

```bash
# 파일 수정 시 자동으로 브라우저가 새로고침되는지 확인

# 테스트:
# 1. pages/app/Home.tsx 열기
# 2. 아무 텍스트 수정
# 3. 저장 (Ctrl+S / Cmd+S)
# 4. 브라우저가 자동으로 업데이트되는지 확인
```

---

## 6. Firebase 프로젝트 생성

### 6.1 Firebase Console 접속

1. https://console.firebase.google.com/ 접속
2. Google 계정으로 로그인
3. "프로젝트 추가" 또는 "Add project" 클릭

### 6.2 프로젝트 생성

**Step 1: 프로젝트 이름**
```
프로젝트 이름: hp-kal
또는: hyeonpung-kalguksu
```

**Step 2: Google Analytics**
```
☑️ 이 프로젝트에 Google Analytics 사용 설정
```

**Step 3: Analytics 계정**
```
계정 선택: Default Account for Firebase
또는 새로 만들기
```

**완료:**
```
"프로젝트 만들기" 클릭
약 30초 소요
```

### 6.3 프로젝트 ID 확인

```
프로젝트 설정 (⚙️ 아이콘) > 일반 탭

프로젝트 ID: hp-kal  (또는 자동 생성된 ID)

⚠️ 중요: 이 ID는 변경할 수 없음!
```

---

## 7. Firebase 설정 및 연동

### 7.1 웹 앱 추가

Firebase Console에서:

```
1. 프로젝트 개요 > 앱 추가
2. 웹 아이콘 (</>) 클릭
3. 앱 닉네임: "현풍닭칼국수 PWA"
4. ☑️ Firebase Hosting 설정 (선택)
5. "앱 등록" 클릭
```

### 7.2 Firebase 구성 정보 복사

화면에 표시되는 구성 정보:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "hp-kal.firebaseapp.com",
  projectId: "hp-kal",
  storageBucket: "hp-kal.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-ABC123"
};
```

**⚠️ 중요: 이 정보를 복사해두세요!**

### 7.3 .env 파일 업데이트

Cursor AI에서 `.env` 파일을 열고 실제 값으로 교체:

**Cursor AI에게 지시:**

```
.env 파일을 열고 다음 값들을 업데이트해줘:

VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=hp-kal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hp-kal
VITE_FIREBASE_STORAGE_BUCKET=hp-kal.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123
```

### 7.4 Authentication 활성화

Firebase Console > Authentication:

```
1. "시작하기" 클릭
2. 로그인 제공업체 탭

제공업체 활성화:
☑️ 이메일/비밀번호
   - 이메일 링크 사용 안함
☑️ Google
   - 프로젝트의 공개용 이름: 현풍닭칼국수
   - 프로젝트 지원 이메일: your@email.com

3. "저장" 클릭
```

### 7.5 Firestore Database 생성

Firebase Console > Firestore Database:

```
1. "데이터베이스 만들기" 클릭
2. 위치 선택
   - asia-northeast3 (서울) 권장
   - 또는 asia-northeast1 (도쿄)
3. 보안 규칙 시작 모드
   - ⚪ 프로덕션 모드 선택
   - (나중에 규칙 수정)
4. "사용 설정" 클릭
```

### 7.6 Firestore 보안 규칙 설정

Firebase Console > Firestore Database > 규칙 탭:

**로컬 파일 확인:**
```bash
# Cursor AI 터미널에서
cat firestore.rules
```

**규칙 복사 & 붙여넣기:**

```
Firebase Console 규칙 탭에서:
1. firestore.rules 파일 내용 전체 복사
2. Firebase Console에 붙여넣기
3. "게시" 클릭
```

**또는 CLI로 배포:**

```bash
# Cursor AI 터미널에서
firebase deploy --only firestore:rules
```

### 7.7 Storage 활성화

Firebase Console > Storage:

```
1. "시작하기" 클릭
2. 보안 규칙
   - 프로덕션 모드 선택
3. 위치
   - asia-northeast3 (서울) 권장
4. "완료" 클릭
```

**Storage 규칙 설정:**

```bash
# 로컬 파일 확인
cat storage.rules

# Firebase Console Storage > 규칙 탭에 복사
# 또는 CLI로 배포
firebase deploy --only storage
```

### 7.8 Cloud Functions 설정 (선택사항)

**Blaze 플랜으로 업그레이드 필요:**

```
Firebase Console 좌측 하단
"Spark (무료)" 클릭 > "플랜 업그레이드"

Blaze (종량제) 선택
- 신용카드 등록 필요
- 무료 할당량: 매달 2백만 호출
- 무료 할당량 초과 시에만 과금
```

**Functions 배포:**

```bash
# Cursor AI 터미널에서
cd functions
npm install
cd ..

# 배포
firebase deploy --only functions
```

### 7.9 개발 서버 재시작

환경변수 변경 후 서버 재시작:

```bash
# Cursor AI 터미널에서
# Ctrl+C로 서버 중지
npm run dev
```

### 7.10 Firebase 연결 확인

브라우저 콘솔에서 확인:

```javascript
// F12 > Console

// Firebase 초기화 확인
✅ Firebase initialized successfully

// 에러가 없어야 함
❌ Firebase: Error (auth/...)
❌ Firebase: Error (firestore/...)
```

---

## 8. Cursor AI 사용법

### 8.1 Cursor AI 기본 사용법

#### A. 채팅으로 코드 수정 요청

**Cmd+K (macOS) / Ctrl+K (Windows):**

```
"메뉴 카드의 배경색을 변경해줘"
"주문 버튼 텍스트를 '주문하기'에서 '바로 주문'으로 바꿔줘"
"홈 화면에 배너 섹션을 추가해줘"
```

#### B. 전체 파일 생성/수정

**Cmd+L (macOS) / Ctrl+L (Windows):**

```
"새로운 쿠폰 관리 페이지를 만들어줘. 
경로는 /admin/coupons이고, 
쿠폰 목록을 테이블로 보여주고, 
쿠폰 생성/수정/삭제 기능이 있어야 해."
```

#### C. 코드 설명 요청

**코드 블록 선택 후 Cmd+K:**

```
"이 코드가 뭘 하는지 설명해줘"
"이 함수를 더 효율적으로 리팩토링해줘"
```

### 8.2 프로젝트별 맞춤 지시문

#### 🎨 디자인 수정 시 필수 지시사항

```
"다음 규칙을 반드시 지켜줘:

1. 브랜드 컬러만 사용:
   - Primary: #D61C1C (현풍레드)
   - Secondary: #F37021 (신칼오렌지)
   - Accent: #C7A45A (황동식기색)

2. Tailwind 폰트 클래스 사용 금지:
   - text-xl, text-2xl, font-bold 등 사용하지 마
   - 이유: globals.css에 이미 정의되어 있음

3. 디자인 토큰 사용:
   - var(--color-primary)
   - var(--color-secondary)
   - var(--color-accent)

4. 기존 컴포넌트 스타일 유지:
   - 기존 클래스를 함부로 변경하지 마
   - 추가만 해줘"
```

#### 🔧 기능 추가 시 필수 지시사항

```
"다음 규칙을 반드시 지켜줘:

1. TypeScript 타입 안정성:
   - any 타입 사용 금지
   - 모든 함수에 파라미터/리턴 타입 명시

2. 기존 구조 따르기:
   - 새 페이지는 /pages 폴더에
   - 공통 컴포넌트는 /components/shared에
   - API 함수는 /lib에
   - 타입 정의는 /types에

3. 에러 처리:
   - try-catch 블록 필수
   - 사용자 친화적 에러 메시지
   - toast 알림 사용

4. 접근성:
   - 모든 버튼에 aria-label
   - 이미지에 alt 속성
   - 키보드 네비게이션 지원"
```

#### 🔥 Firebase 관련 지시사항

```
"Firebase 코드 작성 시 다음 규칙을 지켜줘:

1. 환경변수 사용:
   - import { ENV } from '../config/env'
   - ENV.FIREBASE_API_KEY 등으로 접근

2. 에러 처리:
   - Firebase 에러 코드 확인
   - 한글 에러 메시지 제공

3. 보안:
   - 클라이언트에서 민감한 작업 금지
   - Cloud Functions 사용 권장

4. 성능:
   - 불필요한 쿼리 최소화
   - 페이지네이션 사용
   - 캐싱 적용"
```

### 8.3 실전 예제

#### 예제 1: 새 페이지 추가

**지시문:**
```
/pages/app/Favorites.tsx 파일을 만들어줘.

요구사항:
- 사용자가 즐겨찾기한 메뉴 목록 표시
- 메뉴 카드 컴포넌트 재사용
- 빈 상태 처리 (EmptyState 컴포넌트 사용)
- 즐겨찾기 해제 기능
- 장바구니 추가 버튼

디자인:
- 브랜드 컬러 사용
- 모바일 반응형
- 2열 그리드 (md: 3열)

라우팅:
- App.tsx에 /favorites 경로 추가
- BottomNav에 즐겨찾기 아이콘 추가 (Heart)
```

#### 예제 2: 기존 기능 수정

**지시문:**
```
/pages/app/Cart.tsx를 수정해줘.

변경사항:
1. 장바구니가 비어있을 때 추천 메뉴 섹션 추가
   - UpsellSection 컴포넌트 사용
   - 인기 메뉴 3개 표시

2. 쿠폰 적용 UI 개선
   - 현재: 작은 버튼
   - 변경: 큰 배너 형태
   - "🎟️ 사용 가능한 쿠폰 N개" 표시

3. 총 금액 섹션 강조
   - 배경색: var(--color-primary)
   - 텍스트: 흰색
   - 글씨 크기 증가

주의:
- 기존 기능 유지
- 디자인 일관성 유지
- TypeScript 타입 에러 없도록
```

#### 예제 3: Firebase 연동 추가

**지시문:**
```
즐겨찾기 기능을 Firebase에 저장하도록 수정해줘.

Firestore 구조:
users/{userId}/favorites/{menuId}
{
  menuId: string,
  addedAt: timestamp,
  menu: { 메뉴 정보 스냅샷 }
}

구현 사항:
1. /lib/favorites.api.ts 생성
   - addFavorite(userId, menuId)
   - removeFavorite(userId, menuId)
   - getFavorites(userId)
   - isFavorite(userId, menuId)

2. 실시간 동기화
   - onSnapshot 사용
   - 다른 기기에서 추가/삭제 시 자동 반영

3. 에러 처리
   - 네트워크 오류 대응
   - 권한 오류 대응
   - 사용자 친화적 메시지

4. 최적화
   - 중복 요청 방지
   - 로컬 캐시 사용
```

### 8.4 Cursor AI 활용 팁

#### 💡 Tip 1: 컨텍스트 제공

**나쁜 예:**
```
"버튼 색 바꿔줘"
```

**좋은 예:**
```
"pages/app/MenuDetail.tsx 파일의 
'장바구니 담기' 버튼 배경색을 
var(--color-primary)로 변경해줘"
```

#### 💡 Tip 2: 참조 파일 명시

```
"components/app/MenuCard.tsx를 참고해서
새로운 ReviewCard 컴포넌트를 만들어줘.

비슷한 구조로:
- 이미지 (왼쪽)
- 정보 (오른쪽)
- 별점 표시
- 클릭 시 상세 페이지로"
```

#### 💡 Tip 3: 단계별 요청

```
"1단계: /types/favorites.ts에 타입 정의
2단계: /lib/favorites.api.ts에 CRUD 함수 작성
3단계: /pages/app/Favorites.tsx 페이지 생성
4단계: App.tsx에 라우팅 추가
5단계: BottomNav에 메뉴 추가

한 단계씩 진행하고, 각 단계마다 확인할게."
```

#### 💡 Tip 4: 에러 공유

```
"다음 에러가 발생했어:

[에러 메시지 복사]

pages/app/Cart.tsx:125 라인에서 발생한 것 같은데,
원인을 찾아서 수정해줘"
```

---

## 9. 트러블슈팅

### 9.1 개발 서버 관련

#### 문제 1: npm run dev 실패

```bash
# 에러: EADDRINUSE
# 원인: 포트 5173이 이미 사용 중

# 해결:
# 기존 프로세스 종료
lsof -ti:5173 | xargs kill -9

# 또는 다른 포트 사용
npm run dev -- --port 3000
```

#### 문제 2: 모듈을 찾을 수 없음

```bash
# 에러: Cannot find module 'react'

# 해결:
rm -rf node_modules package-lock.json
npm install
```

#### 문제 3: 페이지가 비어있음

```
브라우저 콘솔 확인 (F12)
- 빨간 에러 메시지 확인
- 네트워크 탭에서 실패한 요청 확인

일반적 원인:
1. import 경로 오류
2. 컴포넌트 export/import 불일치
3. 환경변수 누락
```

### 9.2 Firebase 관련

#### 문제 1: Firebase 초기화 실패

```javascript
// 에러: Firebase: Error (auth/invalid-api-key)

// 확인사항:
// 1. .env 파일의 API 키가 정확한가?
// 2. .env 파일이 프로젝트 루트에 있는가?
// 3. 환경변수 이름이 VITE_ 로 시작하는가?

// 해결:
// 1. Firebase Console에서 구성 정보 다시 확인
// 2. .env 파일 수정
// 3. 개발 서버 재시작
```

#### 문제 2: Firestore 권한 오류

```javascript
// 에러: Missing or insufficient permissions

// 원인: Firestore 보안 규칙

// 임시 해결 (개발용):
// Firebase Console > Firestore > 규칙
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ 개발용만!
    }
  }
}

// 프로덕션용:
// firestore.rules 파일 사용
```

#### 문제 3: Storage CORS 오류

```bash
# 에러: CORS policy: No 'Access-Control-Allow-Origin'

# 해결:
# 1. cors.json 파일 확인
cat cors.json

# 2. CORS 설정 적용
firebase deploy --only storage

# 또는 gsutil 사용
gsutil cors set cors.json gs://hp-kal.appspot.com
```

### 9.3 빌드 관련

#### 문제 1: 빌드 실패

```bash
# 실행
npm run build

# 에러: TypeScript 타입 오류

# 해결:
# 1. tsconfig.json 확인
# 2. any 타입 사용한 곳 수정
# 3. 타입 import 확인

# 타입 체크만 실행
npx tsc --noEmit
```

#### 문제 2: 빌드 크기 너무 큼

```bash
# 빌드 후 크기 확인
npm run build
ls -lh dist/assets/

# 최적화:
# 1. 이미지 압축
# 2. 코드 스플리팅 (React.lazy)
# 3. 사용하지 않는 의존성 제거

# 분석
npm install -D vite-plugin-bundle-analyzer
```

---

## 10. 다음 단계

### 10.1 개발 로드맵

#### Phase 1: 로컬 개발 환경 완성 ✅
- [x] 코드 다운로드
- [x] 의존성 설치
- [x] 개발 서버 실행
- [x] Firebase 프로젝트 생성

#### Phase 2: Firebase 완전 연동 (현재)
```
예상 시간: 2-3일

작업 순서:
1. Authentication 완전 연동
   - Google 로그인 테스트
   - 이메일 로그인 테스트
   - 로그아웃 테스트

2. Firestore 데이터 연동
   - 메뉴 데이터 마이그레이션
   - 주문 생성 테스트
   - 리뷰 작성 테스트

3. Storage 연동
   - 이미지 업로드 테스트
   - 리뷰 사진 업로드

4. Cloud Functions 배포
   - 주문 생성 함수
   - 결제 검증 함수
   - 푸시 알림 함수
```

#### Phase 3: 외부 API 연동
```
예상 시간: 2-3일

1. NICEPAY 결제 연동
   - 상점 등록
   - 테스트 결제
   - 실 결제 전환

2. Google Maps 연동
   - API 키 발급
   - 지도 표시
   - 배달 추적

3. 배달대행사 API
   - 계약 및 API 키 발급
   - 배달 요청 테스트
```

#### Phase 4: PWA 최적화
```
예상 시간: 1일

1. Service Worker 개선
2. 오프라인 대응
3. Push 알림 설정
4. A2HS 최적화
```

#### Phase 5: 배포
```
예상 시간: 1일

1. Firebase Hosting
2. 도메인 연결
3. SSL 인증서
4. 성능 모니터링
```

### 10.2 Cursor AI로 다음 작업 진행하기

#### 작업 1: 실제 메뉴 데이터로 교체

**Cursor AI에게 지시:**

```
/data/menus.json을 실제 현풍닭칼국수 메뉴로 교체해줘.

메뉴 목록:
1. 닭칼국수 - 9,000원
   - 설명: 국내산 닭으로 우려낸 진한 육수
   - 옵션: 보통맛/매운맛
   
2. 만두 (6개) - 4,000원
   - 설명: 매일 아침 직접 빚는 손만두
   
3. 공기밥 - 1,000원

각 메뉴에:
- 실제 설명
- 알레르기 정보
- 칼로리 정보
추가해줘
```

#### 작업 2: 실제 이미지로 교체

**Cursor AI에게 지시:**

```
ImageWithFallback 컴포넌트를 수정해서
로컬 이미지를 우선 사용하도록 바꿔줘.

구조:
/public/images/menus/
  ├── kalguksu-01.jpg
  ├── kalguksu-02.jpg
  └── mandu.jpg

fallback만 Unsplash 사용
```

#### 작업 3: 브랜드 에셋 교체

**Cursor AI에게 지시:**

```
1. /public/logo.svg 생성
   - 현풍닭칼국수 로고
   - SVG 형식
   - 반응형

2. 모든 🍜 이모지를 실제 로고로 교체
   - Header
   - Footer
   - LoadingScreen
   - AdminLayout

3. favicon 교체
   - /public/favicon.ico
   - 16x16, 32x32, 48x48
```

### 10.3 유용한 문서

프로젝트에 포함된 문서들:

```
필수 읽기:
📄 README.md - 프로젝트 개요
📄 WHITE-LABEL-README.md - 화이트라벨 가이드
📄 DESIGN-LOCK-README.md - 디자인 보호 가이드

참고 문서:
📄 TROUBLESHOOTING.md - 문제 해결
📄 DEPLOYMENT-READY-CHECKLIST.md - 배포 체크리스트
📄 docs/03-development/ - 개발 완료 보고서들
📄 docs/06-firebase/ - Firebase 설정 가이드
```

### 10.4 도움 받기

#### 커뮤니티:

```
React: https://react.dev/
Vite: https://vitejs.dev/
Firebase: https://firebase.google.com/docs
Tailwind: https://tailwindcss.com/docs
```

#### Cursor AI 사용:

```
공식 문서: https://cursor.sh/docs
Discord: https://discord.gg/cursor
```

#### 프로젝트 관련:

```
GitHub Issues 생성
템플릿 위치: /.github/ISSUE_TEMPLATE/
```

---

## 📋 최종 체크리스트

### 로컬 개발 환경

- [ ] Node.js 18+ 설치 확인
- [ ] npm 설치 확인
- [ ] Cursor AI 설��� 및 로그인
- [ ] 프로젝트 폴더 구조 확인
- [ ] npm install 완료
- [ ] .env 파일 생성
- [ ] npm run dev 실행 성공
- [ ] http://localhost:5173 접속 확인

### Firebase 연동

- [ ] Firebase 프로젝트 생성
- [ ] 웹 앱 추가
- [ ] .env 파일에 실제 키 입력
- [ ] Authentication 활성화
- [ ] Firestore Database 생성
- [ ] Storage 활성화
- [ ] 보안 규칙 배포
- [ ] 브라우저에서 Firebase 연결 확인

### Cursor AI 준비

- [ ] 프로젝트를 Cursor AI로 열기
- [ ] 프로젝트 구조 이해
- [ ] 기본 지시문 템플릿 저장
- [ ] 첫 번째 수정 테스트 완료

---

## 🎉 축하합니다!

로컬 개발 환경이 완벽하게 준비되었습니다!

**이제 할 수 있는 것:**
- ✅ 모든 페이지 수정
- ✅ 새로운 기능 추가
- ✅ 디자인 커스터마이징
- ✅ Firebase 데이터베이스 사용
- ✅ 실시간 미리보기

**다음 목표:**
1. 실제 메뉴/이미지로 교체
2. Firebase 완전 연동
3. 결제 시스템 연동
4. 프로덕션 배포

---

**작성:** KS컴퍼니 (사업자번호 553-17-00098)  
**문의:** 개발팀  
**버전:** 1.0.0  
**최종 수정:** 2024-11-07
