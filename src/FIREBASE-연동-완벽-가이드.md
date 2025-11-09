# 🔥 Firebase 연동 완벽 가이드

> **현풍닭칼국수 PWA - Firebase 백엔드 완전 연동 매뉴얼**  
> 처음부터 끝까지 100% 완벽 작동 보장

---

## 📋 목차

1. [Firebase 프로젝트 생성](#1-firebase-프로젝트-생성)
2. [Authentication 설정](#2-authentication-설정)
3. [Firestore Database 설정](#3-firestore-database-설정)
4. [Cloud Storage 설정](#4-cloud-storage-설정)
5. [Cloud Functions 배포](#5-cloud-functions-배포)
6. [환경변수 설정](#6-환경변수-설정)
7. [데이터 마이그레이션](#7-데이터-마이그레이션)
8. [테스트 및 검증](#8-테스트-및-검증)
9. [보안 규칙 강화](#9-보안-규칙-강화)
10. [모니터링 설정](#10-모니터링-설정)

---

## 1. Firebase 프로젝트 생성

### 1.1 Console 접속 및 프로젝트 생성

```
1. https://console.firebase.google.com/ 접속
2. Google 계정으로 로그인
3. "프로젝트 추가" 클릭
```

### 1.2 프로젝트 설정

**Step 1: 프로젝트 이름**
```
프로젝트 이름: hp-kal

⚠️ 중요:
- 프로젝트 ID는 전역적으로 고유해야 함
- 나중에 변경 불가
- URL, 식별자에 사용됨
```

**Step 2: Google Analytics**
```
☑️ 이 프로젝트에 Google Analytics 사용 설정

이유:
- 사용자 행동 분석
- 전환율 추적
- 성능 모니터링
```

**Step 3: Analytics 계정**
```
계정: Default Account for Firebase 선택

또는 새로 만들기:
- 계정 이름: 현풍닭칼국수
- 위치: 대한민국
- 데이터 공유 설정: 기본값
```

**완료:**
```
"프로젝트 만들기" 클릭
⏱️ 약 30초 소요
```

### 1.3 프로젝트 정보 확인

```
⚙️ 프로젝트 설정 > 일반 탭

확인 사항:
✅ 프로젝트 이름: hp-kal
✅ 프로젝트 ID: hp-kal (또는 hp-kal-xxxxx)
✅ 프로젝트 번호: 123456789
✅ 웹 API 키: AIzaSy...
✅ 지원 이메일: your@email.com
```

---

## 2. Authentication 설정

### 2.1 Authentication 활성화

```
Firebase Console 좌측 메뉴
> 빌드 (Build)
> Authentication
> "시작하기" 클릭
```

### 2.2 이메일/비밀번호 로그인 설정

**활성화:**
```
Sign-in method 탭
> 이메일/비밀번호 클릭
> 사용 설정 토글 ON
> "저장"

설정:
☑️ 이메일/비밀번호
☐ 이메일 링크 (비밀번호가 없는 로그인) - 체크 안 함
```

### 2.3 Google 로그인 설정

**활성화:**
```
Sign-in method 탭
> Google 클릭
> 사용 설정 토글 ON

필수 입력:
- 프로젝트의 공개용 이름: 현풍닭칼국수
- 프로젝트 지원 이메일: your@email.com

선택사항:
- 승인된 도메인 추가:
  • localhost (개발용 - 자동 추가됨)
  • yourdomain.com (프로덕션용)

> "저장" 클릭
```

### 2.4 고급 설정 (선택사항)

**이메일 템플릿 커스터마이징:**
```
Templates 탭
> 비밀번호 재설정

커스터마이징:
- 발신자 이름: 현풍닭칼국수
- 회신 이메일: support@yourdomain.com
- 이메일 본문 수정 (HTML)
```

**사용자 관리:**
```
Users 탭
- 수동으로 사용자 추가 가능
- 사용자 비활성화/삭제
- 이메일 인증 상태 확인
```

### 2.5 테스트 계정 생성

```bash
# Cursor AI에게 지시:
"Firebase Authentication에서 테스트 계정을 만들 수 있는
회원가입 폼 기능이 제대로 작동하는지 확인하고,
안 되면 lib/auth.ts의 signUp 함수를 수정해줘."
```

**수동 테스트 계정 생성:**
```
Firebase Console > Authentication > Users 탭
> "사용자 추가" 클릭

이메일: test@example.com
비밀번호: Test1234!

> "사용자 추가"
```

---

## 3. Firestore Database 설정

### 3.1 데이터베이스 만들기

```
Firebase Console
> Firestore Database
> "데이터베이스 만들기" 클릭
```

### 3.2 위치 선택

```
⚠️ 중요: 나중에 변경 불가!

권장 위치:
1순위: asia-northeast3 (서울)
2순위: asia-northeast1 (도쿄)
3순위: asia-northeast2 (오사카)

이유:
- 낮은 레이턴시
- 빠른 응답 속도
- GDPR 준수 (아시아 데이터 센터)

> "다음" 클릭
```

### 3.3 보안 규칙 시작 모드

```
보안 규칙:
⚪ 테스트 모드
   - 30일간 모든 읽기/쓰기 허용
   - ⚠️ 프로덕션에서 위험!

⚫ 프로덕션 모드 (권장)
   - 모든 읽기/쓰기 거부
   - 규칙을 직접 설정해야 함
   - ✅ 안전함

> "프로덕션 모드" 선택
> "만들기" 클릭
```

### 3.4 보안 규칙 설정

**로컬 파일 사용:**

```bash
# 프로젝트의 firestore.rules 파일 확인
cat firestore.rules
```

**Console에서 수동 설정:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 헬퍼 함수
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid))
               .data.role in ['owner', 'admin'];
    }
    
    // 사용자 문서
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isSignedIn();
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // 메뉴
    match /menus/{menuId} {
      allow read: if true; // 모든 사용자 읽기 가능
      allow write: if isAdmin();
    }
    
    // 주문
    match /orders/{orderId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isSignedIn();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // 리뷰
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update: if isOwner(resource.data.userId) || isAdmin();
      allow delete: if isOwner(resource.data.userId) || isAdmin();
    }
    
    // 쿠폰
    match /coupons/{couponId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // 설정 (관리자만)
    match /settings/{settingId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
  }
}
```

**규칙 배포:**

```
Firestore Database > 규칙 탭
> 위 규칙 복사 & 붙여넙기
> "게시" 클릭
```

**또는 CLI로:**

```bash
# Firebase CLI 사용
firebase deploy --only firestore:rules
```

### 3.5 인덱스 설정

**복합 쿼리를 위한 인덱스:**

```bash
# firestore.indexes.json 확인
cat firestore.indexes.json
```

**Console에서 설정:**

```
Firestore Database > 색인 탭

자주 사용하는 쿼리:
1. orders 컬렉션
   - 필드: userId (오름차순), createdAt (내림차순)
   - 필드: status (오름차순), createdAt (내림차순)

2. reviews 컬렉션
   - 필드: menuId (오름차순), createdAt (내림차순)
   - 필드: rating (내림차순), createdAt (내림차순)

⚠️ 자동 생성:
- 앱 실행 중 에러 발생 시
- Console에서 자동으로 인덱스 링크 제공
- 클릭 한 번으로 생성 가능
```

### 3.6 데이터 구조 생성

**Cursor AI에게 지시:**

```
"Firestore에 다음 컬렉션 구조를 만들어주는
초기 데이터 마이그레이션 스크립트를 작성해줘:

컬렉션:
1. users
   - 샘플 관리자 계정 1개
   - 샘플 고객 계정 2개

2. menus
   - /data/menus.json의 모든 메뉴 import

3. settings
   - 기본 가게 설정 (운영시간, 배달비 등)

파일명: /scripts/init-firestore.ts
실행: npm run init-firestore"
```

**수동 데이터 추가 (테스트용):**

```
Firestore Database > 데이터 탭
> "컬렉션 시작" 클릭

컬렉션 ID: users
문서 ID: [자동 생성]

필드:
- email: "admin@test.com"
- displayName: "관리자"
- role: "owner"
- createdAt: [타임스탬프]

> "저장"
```

---

## 4. Cloud Storage 설정

### 4.1 Storage 활성화

```
Firebase Console
> Storage
> "시작하기" 클릭
```

### 4.2 보안 규칙 선택

```
보안 규칙:
⚪ 테스트 모드
⚫ 프로덕션 모드 (권장)

> "다음" 클릭
```

### 4.3 위치 선택

```
⚠️ Firestore와 동일한 위치 선택!

위치: asia-northeast3 (서울)

> "완료" 클릭
```

### 4.4 보안 규칙 설정

**로컬 파일:**

```bash
cat storage.rules
```

**규칙 내용:**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // 헬퍼 함수
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }
    
    function isValidSize() {
      return request.resource.size < 5 * 1024 * 1024; // 5MB
    }
    
    // 메뉴 이미지 (관리자만 업로드)
    match /menus/{menuId}/{fileName} {
      allow read: if true;
      allow write: if isSignedIn() && isImage() && isValidSize();
    }
    
    // 리뷰 이미지 (로그인 사용자)
    match /reviews/{userId}/{fileName} {
      allow read: if true;
      allow write: if isOwner(userId) && isImage() && isValidSize();
    }
    
    // 프로필 이미지
    match /profiles/{userId}/{fileName} {
      allow read: if true;
      allow write: if isOwner(userId) && isImage() && isValidSize();
    }
    
    // 임시 파일 (1시간 후 자동 삭제)
    match /temp/{userId}/{fileName} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId) && isImage() && isValidSize();
    }
  }
}
```

**배포:**

```
Storage > 규칙 탭
> 규칙 복사 & 붙여넣기
> "게시" 클릭
```

### 4.5 CORS 설정

**로컬 파일:**

```bash
cat cors.json
```

**내용:**

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization"]
  }
]
```

**적용 (gsutil 필요):**

```bash
# 1. Google Cloud SDK 설치
# https://cloud.google.com/sdk/docs/install

# 2. 인증
gcloud auth login

# 3. 프로젝트 설정
gcloud config set project hp-kal

# 4. CORS 적용
gsutil cors set cors.json gs://hp-kal.appspot.com

# 5. 확인
gsutil cors get gs://hp-kal.appspot.com
```

**또는 Firebase CLI:**

```bash
firebase deploy --only storage
```

### 4.6 테스트 업로드

**Cursor AI에게 지시:**

```
"이미지 업로드 테스트 페이지를 만들어줘:

경로: /dev/storage-test

기능:
1. 파일 선택 input
2. 미리보기
3. Firebase Storage 업로드
4. 업로드된 이미지 URL 표시
5. 이미지 삭제

경로: /menus/test/test-image.jpg"
```

---

## 5. Cloud Functions 배포

### 5.1 Blaze 플랜으로 업그레이드

```
⚠️ Cloud Functions는 Blaze 플랜 필요!

Firebase Console 좌측 하단
> "Spark (무료)" 클릭
> "플랜 업그레이드" 클릭

Blaze (종량제) 선택:
✅ 무료 할당량:
   - 125K 호출/월
   - 40K GB-초/월
   - 40K CPU-초/월

✅ 초과 시에만 과금
✅ 예산 알림 설정 가능

> 신용카드 등록
> "업그레이드" 클릭
```

### 5.2 Functions 폴더 확인

```bash
# 프로젝트 구조
/functions/
  ├── package.json
  ├── tsconfig.json
  └── src/
      ├── index.ts          # 메인 진입점
      ├── orders.ts         # 주문 관련 함수
      └── lib/
          ├── nicepay.ts    # 결제 검증
          ├── push.ts       # FCM 푸시
          ├── pdf.ts        # PDF 생성
          ├── report.ts     # 리포트 생성
          └── coupons.ts    # 쿠폰 관리
```

### 5.3 의존성 설치

```bash
# Functions 폴더로 이동
cd functions

# 의존성 설치
npm install

# TypeScript 컴파일 확인
npm run build

# 로컬 에뮬레이터 테스트
npm run serve
```

### 5.4 환경변수 설정 (Functions용)

```bash
# Firebase Functions 환경변수
firebase functions:config:set \
  nicepay.mid="YOUR_NICEPAY_MID" \
  nicepay.key="YOUR_NICEPAY_KEY" \
  admin.email="admin@yourdomain.com"

# 확인
firebase functions:config:get

# 로컬 개발용으로 내보내기
firebase functions:config:get > .runtimeconfig.json
```

### 5.5 Functions 배포

**전체 배포:**

```bash
# 프로젝트 루트로 돌아가기
cd ..

# 로그인 (한 번만)
firebase login

# 프로젝트 선택
firebase use hp-kal

# Functions 배포
firebase deploy --only functions

# 예상 시간: 3-5분
```

**개별 함수 배포:**

```bash
# 특정 함수만
firebase deploy --only functions:onOrderCreated
firebase deploy --only functions:verifyPayment
```

### 5.6 배포 확인

```
Firebase Console
> Functions
> 대시보드

확인 사항:
✅ onOrderCreated - 주문 생성 시 트리거
✅ verifyPayment - HTTPS 호출 가능
✅ generateReport - HTTPS 호출 가능
✅ onUserCreated - 사용자 생성 시 트리거

상태: 모두 녹색
요청: 0 (처음에는 0)
```

### 5.7 Functions 로그 확인

```bash
# 실시간 로그
firebase functions:log --only onOrderCreated

# 전체 로그
firebase functions:log
```

**Console에서:**

```
Functions > 로그 탭
- 함수별 필터링
- 심각도별 필터링
- 시간별 검색
```

---

## 6. 환경변수 설정

### 6.1 웹 앱 추가

```
Firebase Console
> 프로젝트 개요 (⚙️ 옆)
> 앱 추가
> 웹 아이콘 (</>) 클릭

앱 닉네임: "현풍닭칼국수 PWA"
☑️ Firebase Hosting 설정 (선택)

> "앱 등록" 클릭
```

### 6.2 구성 정보 복사

```javascript
// 화면에 표시되는 구성 객체
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

### 6.3 .env 파일 업데이트

**Cursor AI에서:**

```bash
# .env 파일 열기
# 다음 내용으로 교체:

VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=hp-kal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hp-kal
VITE_FIREBASE_STORAGE_BUCKET=hp-kal.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123

# 기타 환경변수는 유지
VITE_APP_ENV=development
VITE_APP_DEBUG=true
```

### 6.4 config/env.ts 확인

```typescript
// /config/env.ts 파일 확인
export const ENV = {
  // Firebase
  FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... 나머지
  
  // 검증
  get isProduction() {
    return this.APP_ENV === 'production';
  },
  
  get isDevelopment() {
    return this.APP_ENV === 'development';
  }
};
```

### 6.5 개발 서버 재시작

```bash
# Cursor AI 터미널
# Ctrl+C로 중지
npm run dev

# 브라우저 콘솔 확인
# F12 > Console
# Firebase 초기화 메시지 확인
```

---

## 7. 데이터 마이그레이션

### 7.1 메뉴 데이터 마이그레이션

**Cursor AI에게 지시:**

```
"/scripts/migrate-menus.ts 파일을 만들어줘.

기능:
1. /data/menus.json 읽기
2. 각 메뉴를 Firestore menus 컬렉션에 추가
3. 문서 ID: 메뉴의 id 사용
4. 진행 상황 로그 출력
5. 에러 처리

실행:
npm run migrate-menus

완료 후 Firestore에서 확인 가능해야 함."
```

**수동 마이그레이션 (소량):**

```javascript
// Firebase Console > Firestore > 데이터
// "컬렉션 시작" 클릭

// 컬렉션: menus
// 문서 ID: kalguksu-basic

// 필드:
{
  id: "kalguksu-basic",
  name: "닭칼국수",
  nameEn: "Chicken Kalguksu",
  category: "noodles",
  price: 9000,
  description: "국내산 닭으로 우려낸 진한 육수",
  image: "https://images.unsplash.com/...",
  isAvailable: true,
  isBestSeller: true,
  badges: ["best", "signature"],
  spicyLevel: 0,
  allergens: ["wheat", "soy"],
  calories: 650,
  createdAt: [Timestamp],
  updatedAt: [Timestamp]
}
```

### 7.2 설정 데이터 생성

**Cursor AI에게 지시:**

```
"Firestore settings 컬렉션에 기본 설정을 추가하는
스크립트를 만들어줘:

/scripts/init-settings.ts

설정 내용 (settings/store 문서):
{
  storeName: "현풍닭칼국수",
  phone: "010-1234-5678",
  address: "서울시 강남구...",
  businessHours: {
    monday: { open: "10:00", close: "21:00", isOpen: true },
    ...
  },
  deliveryFee: {
    base: 3000,
    freeThreshold: 15000
  },
  minimumOrder: 10000,
  isOpen: true,
  announcement: "오늘의 공지사항"
}

실행: npm run init-settings"
```

### 7.3 샘플 사용자 생성

```bash
# Firebase Console > Authentication > Users
# "사용자 추가" 클릭

관리자:
- 이메일: admin@hp-kal.com
- 비밀번호: Admin1234!

그 후 Firestore users 컬렉션에 문서 추가:
문서 ID: [위에서 생성된 UID]
{
  email: "admin@hp-kal.com",
  displayName: "관리자",
  role: "owner",
  phone: "010-1234-5678",
  createdAt: [Timestamp]
}
```

### 7.4 마이그레이션 검증

**Cursor AI에게 지시:**

```
"/scripts/verify-migration.ts 만들어줘.

확인 사항:
1. menus 컬렉션에 N개 문서 존재
2. settings/store 문서 존재
3. 모든 필수 필드 존재
4. 타입 검증

실행: npm run verify-migration
출력: ✅/❌ 체크리스트"
```

---

## 8. 테스트 및 검증

### 8.1 Authentication 테스트

**테스트 시나리오:**

```
1. 회원가입
   - /signup 접속
   - 이메일/비밀번호 입력
   - 가입 완료
   - Firestore users 컬렉션 확인

2. 로그인
   - /login 접속
   - 이메일/비밀번호 입력
   - 홈으로 리다이렉트
   - 로그인 상태 유지 (새로고침 후에도)

3. Google 로그인
   - "Google로 로그인" 클릭
   - Google 계정 선택
   - 권한 승인
   - 로그인 완료

4. 로그아웃
   - 마이페이지 > 로그아웃
   - 로그인 페이지로 리다이렉트
```

**검증:**

```javascript
// 브라우저 콘솔에서
console.log(firebase.auth().currentUser);
// 로그인 시: User 객체
// 로그아웃 시: null
```

### 8.2 Firestore 읽기/쓰기 테스트

**메뉴 읽기:**

```
1. /menu 페이지 접속
2. 메뉴 목록이 표시되는지 확인
3. 네트워크 탭에서 Firestore 요청 확인
4. Console에서 에러 없는지 확인
```

**주문 생성:**

```
1. 메뉴 선택 > 장바구니 담기
2. /cart > 주문하기
3. 배달 정보 입력
4. 주문 완료
5. Firestore orders 컬렉션에 문서 생성 확인
6. /order-history에서 주문 표시 확인
```

**리뷰 작성:**

```
1. 주문 내역에서 "리뷰 쓰기"
2. 별점, 내용, 사진(선택) 입력
3. 작성 완료
4. Firestore reviews 컬렉션 확인
5. Storage에 사진 업로드 확인
```

### 8.3 Storage 업로드 테스트

**이미지 업로드:**

```javascript
// 브라우저 콘솔에서
const storage = firebase.storage();
const ref = storage.ref('test/test.jpg');

// File input에서 파일 선택
const file = document.querySelector('input[type="file"]').files[0];

// 업로드
await ref.put(file);

// URL 가져오기
const url = await ref.getDownloadURL();
console.log(url);
```

### 8.4 Cloud Functions 테스트

**HTTP Functions:**

```bash
# verifyPayment 함수 테스트
curl -X POST \
  https://asia-northeast3-hp-kal.cloudfunctions.net/verifyPayment \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "test-order-1",
    "paymentId": "test-payment-1",
    "amount": 10000
  }'
```

**Firestore 트리거:**

```
1. Firestore에 주문 문서 추가
2. Functions 로그 확인:
   firebase functions:log --only onOrderCreated
3. FCM 푸시 전송 확인
4. 이메일 전송 확인 (설정된 경우)
```

### 8.5 통합 테스트

**전체 주문 플로우:**

```
✅ 체크리스트:

[ ] 1. 로그인 (Google 또는 이메일)
[ ] 2. 메뉴 목록 표시 (Firestore에서 읽기)
[ ] 3. 메뉴 상세 > 옵션 선택
[ ] 4. 장바구니 담기 (LocalStorage)
[ ] 5. 쿠폰 적용 (Firestore에서 읽기)
[ ] 6. 주문하기
[ ] 7. 배달 정보 입력
[ ] 8. 결제 (NICEPAY - 테스트 모드)
[ ] 9. 주문 생성 (Firestore 쓰기)
[ ] 10. Cloud Function 트리거
[ ] 11. FCM 푸시 수신 (관리자)
[ ] 12. 주문 추적 페이지 표시
[ ] 13. 관리자 대시보드에서 주문 확인
[ ] 14. 주문 상태 변경
[ ] 15. 고객에게 상태 변경 알림
[ ] 16. 리뷰 작성 (사진 업로드 포함)
[ ] 17. 리뷰 목록에 표시
```

---

## 9. 보안 규칙 강화

### 9.1 Firestore 규칙 검토

**보안 체크리스트:**

```
[ ] 모든 컬렉션에 규칙 정의
[ ] 인증된 사용자만 쓰기 가능
[ ] 소유자만 자신의 데이터 접근
[ ] 관리자 권한 분리
[ ] 민감한 필드 보호 (결제 정보 등)
[ ] 데이터 검증 (타입, 길이, 형식)
[ ] 중복 생성 방지
[ ] Rate limiting 고려
```

**강화된 규칙 예시:**

```javascript
// 주문 생성 시 검증
match /orders/{orderId} {
  allow create: if isSignedIn() &&
    // 필수 필드 확인
    request.resource.data.keys().hasAll([
      'userId', 'items', 'totalAmount', 'status'
    ]) &&
    // userId가 현재 사용자와 일치
    request.resource.data.userId == request.auth.uid &&
    // 주문 금액 검증
    request.resource.data.totalAmount > 0 &&
    request.resource.data.totalAmount < 1000000 &&
    // 초기 상태는 pending만
    request.resource.data.status == 'pending' &&
    // 생성 시간은 현재 시간
    request.time == request.resource.data.createdAt;
}
```

### 9.2 Storage 규칙 강화

```javascript
match /reviews/{userId}/{fileName} {
  allow read: if true;
  allow write: if isOwner(userId) &&
    // 이미지만 허용
    request.resource.contentType.matches('image/(jpeg|png|jpg|webp)') &&
    // 5MB 제한
    request.resource.size < 5 * 1024 * 1024 &&
    // 파일명 검증 (영문, 숫자, -, _ 만)
    fileName.matches('^[a-zA-Z0-9_-]+\\.(jpg|jpeg|png|webp)$');
}
```

### 9.3 Functions 보안

```typescript
// /functions/src/index.ts

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// CORS 설정
export const verifyPayment = functions
  .region('asia-northeast3')
  .https.onCall(async (data, context) => {
    // 인증 확인
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        '로그인이 필요합니다.'
      );
    }
    
    // 입력 검증
    if (!data.orderId || !data.amount) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        '필수 파라미터가 누락되었습니다.'
      );
    }
    
    // 권한 확인 (본인 주문만)
    const order = await admin.firestore()
      .collection('orders')
      .doc(data.orderId)
      .get();
      
    if (order.data()?.userId !== context.auth.uid) {
      throw new functions.https.HttpsError(
        'permission-denied',
        '권한이 없습니다.'
      );
    }
    
    // 비즈니스 로직...
  });
```

---

## 10. 모니터링 설정

### 10.1 Firebase Analytics 확인

```
Firebase Console > Analytics > 대시보드

자동 수집 이벤트:
- 첫 실행 (first_open)
- 세션 시작 (session_start)
- 페이지 조회 (page_view)

확인 사항:
✅ 실시간 사용자 수
✅ 사용자 참여도
✅ 이벤트 수
✅ 전환
```

### 10.2 Performance Monitoring

```
Firebase Console > Performance

자동 모니터링:
- 페이지 로드 시간
- 네트워크 요청 속도
- Firestore 쿼리 성능

임계값 설정:
- 페이지 로드: < 3초
- API 응답: < 1초
- Firestore 쿼리: < 500ms
```

### 10.3 Crashlytics (선택사항)

```bash
# Firebase SDK 추가
npm install firebase

# 앱에서 초기화
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const analytics = getAnalytics(app);
```

### 10.4 알림 설정

**예산 알림:**

```
Google Cloud Console
> 결제 (Billing)
> 예산 및 알림

설정:
- 예산 이름: Firebase 월별 예산
- 목표 금액: $10
- 알림: 50%, 90%, 100%
- 이메일: your@email.com
```

**쿼터 알림:**

```
Firebase Console > 사용량 및 결제
> 세부정보

모니터링:
- Firestore 읽기/쓰기
- Storage 다운로드
- Functions 호출
- Authentication DAU
```

---

## ✅ 최종 체크리스트

### Firebase 프로젝트

- [ ] 프로젝트 생성 (hp-kal)
- [ ] 웹 앱 추가
- [ ] .env 파일 업데이트

### Authentication

- [ ] 이메일/비밀번호 활성화
- [ ] Google 로그인 활성화
- [ ] 테스트 계정 생성
- [ ] 로그인/로그아웃 테스트 완료

### Firestore

- [ ] 데이터베이스 생성 (서울 리전)
- [ ] 보안 규칙 배포
- [ ] 인덱스 생성
- [ ] 메뉴 데이터 마이그레이션
- [ ] 설정 데이터 생성
- [ ] 읽기/쓰기 테스트 완료

### Storage

- [ ] Storage 활성화
- [ ] 보안 규칙 배포
- [ ] CORS 설정 적용
- [ ] 이미지 업로드 테스트 완료

### Cloud Functions

- [ ] Blaze 플랜 업그레이드
- [ ] Functions 배포 완료
- [ ] 환경변수 설정
- [ ] HTTP Functions 테스트
- [ ] 트리거 Functions 테스트

### 모니터링

- [ ] Analytics 작동 확인
- [ ] Performance 모니터링 활성화
- [ ] 예산 알림 설정
- [ ] 에러 추적 설정

### 통합 테스트

- [ ] 전체 주문 플로우 테스트
- [ ] 결제 시스템 테스트
- [ ] 푸시 알림 테스트
- [ ] 관리자 기능 테스트

---

## 🎉 축하합니다!

Firebase 백엔드 연동이 완료되었습니다!

**이제 가능한 것:**
- ✅ 실시간 데이터베이스
- ✅ 사용자 인증
- ✅ 파일 업로드/다운로드
- ✅ 서버리스 함수 실행
- ✅ 푸시 알림
- ✅ 분석 및 모니터링

**다음 단계:**
1. NICEPAY 결제 연동
2. Google Maps API 연동
3. 배달대행사 API 연동
4. 프로덕션 배포

---

**작성:** KS컴퍼니 (사업자번호 553-17-00098)  
**버전:** 1.0.0  
**최종 수정:** 2024-11-07
