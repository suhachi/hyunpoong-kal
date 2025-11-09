# Firebase 정보 전체 정리

**작성일**: 2025-01-29  
**프로젝트**: 현풍닭칼국수 배달앱  
**Firebase 프로젝트**: hp-kal

---

## 📋 목차

1. [Firebase 프로젝트 정보](#1-firebase-프로젝트-정보)
2. [Firebase 설정 파일](#2-firebase-설정-파일)
3. [Firestore 보안 규칙](#3-firestore-보안-규칙)
4. [Firestore 인덱스](#4-firestore-인덱스)
5. [Storage 보안 규칙](#5-storage-보안-규칙)
6. [CORS 설정](#6-cors-설정)
7. [Firebase Functions](#7-firebase-functions)
8. [환경 변수](#8-환경-변수)
9. [배포 명령어](#9-배포-명령어)
10. [프로젝트 URL](#10-프로젝트-url)

---

## 1. Firebase 프로젝트 정보

### 프로젝트 기본 정보
- **프로젝트 ID**: `hp-kal`
- **프로젝트 이름**: 현풍닭칼국수 배달앱
- **주요 도메인**:
  - Production: `https://hp-kal.web.app`
  - Alternate: `https://hp-kal.firebaseapp.com`
  - Local: `http://localhost:5173`

### 사용 중인 Firebase 서비스
- ✅ **Firestore Database**: 실시간 NoSQL 데이터베이스
- ✅ **Firebase Storage**: 파일 저장소 (이미지 등)
- ✅ **Firebase Hosting**: 웹 호스팅
- ✅ **Firebase Functions**: 서버리스 함수
- ✅ **Firebase Authentication**: 인증 (현재 Mock 사용 중)
- ✅ **Firebase Analytics**: 분석

---

## 2. Firebase 설정 파일

### 2.1 firebase.json

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "hosting": {
    "public": "dist",
    "ignore": ["**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          { "key": "Cache-Control", "value": "public,max-age=31536000,immutable" }
        ]
      },
      {
        "source": "/index.html",
        "headers": [
          { "key": "Cache-Control", "value": "no-cache" }
        ]
      },
      {
        "source": "**",
        "headers": [
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
        ]
      }
    ]
  },
  "emulators": {
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    },
    "ui": {
      "enabled": true
    }
  }
}
```

### 설정 설명
- **hosting.public**: `dist` (Vite 빌드 결과물)
- **hosting.rewrites**: SPA 라우팅을 위한 모든 경로를 index.html로 리다이렉트
- **headers**: 보안 헤더 및 캐시 정책 설정
- **emulators**: 로컬 개발용 에뮬레이터 포트 설정

---

## 3. Firestore 보안 규칙

### 3.1 firestore.rules

현재 프로젝트는 **기존 보안 규칙**을 유지합니다. 문서에 제시된 새 규칙은 참고용입니다.

**현재 적용된 규칙 특징**:
- ✅ Helper 함수로 권한 체크 (isAuthenticated, isOwner, isAdmin)
- ✅ Users: 본인만 읽기/수정
- ✅ Orders: 주문자/관리자만 접근, 불변 필드 보호
- ✅ Reviews: 누구나 읽기, 본인만 작성/수정
- ✅ Menus: 누구나 읽기, 관리자만 쓰기
- ✅ Phase 3 기능: GPS 추적, 채팅, 포인트 포함

### 권한 요약
- **users**: 본인 또는 관리자만 읽기/수정
- **orders**: 고객은 본인 주문만 읽기/생성, 관리자는 모든 주문 읽기/수정
- **reviews**: 모두 읽기, 본인만 작성/수정 (평점 1-5 범위 검증)
- **menus**: 모두 읽기, 관리자만 쓰기
- **coupons**: 본인만 읽기/사용, Functions만 생성
- **appConfig**: 모두 읽기, 관리자만 쓰기

---

## 4. Firestore 인덱스

### 4.1 firestore.indexes.json

**현재 적용된 인덱스**:

#### Orders (3개)
- storeId + status + createdAt (관리자 대시보드 필터)
- userId + createdAt (사용자 주문 내역)
- storeId + payment.method + createdAt (결제 방법별 조회)

#### Reviews (4개)
- storeId + createdAt (최신순)
- storeId + rating (평점순)
- storeId + hasPhoto + createdAt (사진 리뷰 필터)
- storeId + reportedCount + createdAt (신고 많은 순)

#### Menus (3개)
- storeId + category + order (카테고리별 정렬)
- storeId + name (이름순)
- storeId + price (가격순)

#### Phase 3 인덱스 (4개)
- deliveries: status + updatedAt
- drivers: status + lastCoord.at
- chat_sessions: open + lastAt
- points_ledger: uid + at, uid + type + at

**총 인덱스 수**: 16개

---

## 5. Storage 보안 규칙

### 5.1 storage.rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 메뉴 이미지 (5MB, 이미지 MIME) - 인증된 사용자
    match /menus/{menuId}/{file} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    // 리뷰 사진 (3MB) - 본인만
    match /reviews/{uid}/{reviewId}/{fileId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.uid == uid
                   && request.resource.size < 3 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### Storage 경로 구조
- `menus/{menuId}/{file}`: 메뉴 이미지 (5MB 제한, 인증 사용자 쓰기)
- `reviews/{uid}/{reviewId}/{fileId}`: 리뷰 사진 (3MB 제한, 본인만 쓰기)

---

## 6. CORS 설정

### 6.1 cors.json

```json
[
  {
    "origin": [
      "https://hp-kal.web.app",
      "https://hp-kal.firebaseapp.com",
      "http://localhost:5173"
    ],
    "method": ["GET","HEAD","POST","PUT","DELETE","OPTIONS"],
    "responseHeader": ["Authorization","Content-Type","x-goog-meta-*","x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
```

### CORS 적용 방법

#### 방법 1: Google Cloud Console (권장)
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 `hp-kal` 선택
3. Storage > Buckets > `hp-kal.appspot.com` 선택
4. Configuration > CORS > Edit
5. `cors.json` 내용 붙여넣기

#### 방법 2: gsutil 명령어 (권한 필요)
```bash
gsutil cors set cors.json gs://hp-kal.appspot.com
```

---

## 7. Firebase Functions

### 7.1 Functions 설정

**위치**: `functions/`

**package.json 주요 내용**:
```json
{
  "name": "hyunpung-kalguksu-functions",
  "version": "1.0.0",
  "engines": {
    "node": "18"
  },
  "dependencies": {
    "firebase-admin": "^12.5.0",
    "firebase-functions": "^5.1.1",
    "@google-cloud/storage": "^7.7.0",
    "pdfkit": "^0.15.0",
    "node-fetch": "^2.7.0"
  }
}
```

### 주요 Functions
- **주문 처리**: NICEPAY 결제 연동
- **주간 리포트 생성**: 매주 월요일 자동 생성
- **통합 리포트 생성**: 월별/분기별 리포트
- **리뷰 신고 처리**: 자동 숨김 처리

---

## 8. 환경 변수

### 8.1 클라이언트 (.env.local)

```bash
# Firebase 설정
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=hp-kal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hp-kal
VITE_FIREBASE_STORAGE_BUCKET=hp-kal.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Firebase 사용 여부
VITE_USE_FIREBASE=true

# NICEPAY 설정
VITE_NICEPAY_MID=your-nicepay-mid
VITE_NICEPAY_CLIENT_KEY=your-client-key

# 기능 플래그
VITE_DELIVERY_ENABLED=true
VITE_DELIVERY_PROVIDER=mock
VITE_SUPPORT_ENABLED=true
VITE_POINTS_ENABLED=true
VITE_POINTS_RATE=0.03
```

### 8.2 Functions 환경 변수

```bash
# Firebase Functions 환경 설정
firebase functions:config:set nice.mid="YOUR_MID"
firebase functions:config:set nice.key="YOUR_KEY"
firebase functions:config:set nice.site="YOUR_SITE"

# 환경 변수 확인
firebase functions:config:get
```

---

## 9. 배포 명령어

### 9.1 전체 배포
```bash
firebase deploy
```

### 9.2 개별 서비스 배포

#### Firestore Rules
```bash
firebase deploy --only firestore:rules
```

#### Firestore Indexes
```bash
firebase deploy --only firestore:indexes
```

#### Storage Rules
```bash
firebase deploy --only storage
```

#### Hosting
```bash
# 빌드 후 배포
npm run build
firebase deploy --only hosting
```

#### Functions
```bash
firebase deploy --only functions
```

### 9.3 에뮬레이터 실행
```bash
firebase emulators:start
```

---

## 10. 프로젝트 URL

### Production URLs
- **웹 앱**: https://hp-kal.web.app
- **대체 도메인**: https://hp-kal.firebaseapp.com

### Firebase Console
- **프로젝트 대시보드**: https://console.firebase.google.com/project/hp-kal
- **Firestore 데이터베이스**: https://console.firebase.google.com/project/hp-kal/firestore
- **Storage**: https://console.firebase.google.com/project/hp-kal/storage
- **Hosting**: https://console.firebase.google.com/project/hp-kal/hosting
- **Functions**: https://console.firebase.google.com/project/hp-kal/functions

### 로컬 개발
- **개발 서버**: http://localhost:5173
- **Firestore Emulator**: http://localhost:8080
- **Hosting Emulator**: http://localhost:5000
- **Emulator UI**: http://localhost:4000

---

## 11. Firebase 초기화 코드

### 11.1 lib/firebase.ts

현재 프로젝트는 **조건부 Firebase 초기화**를 사용합니다:

```typescript
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { FIREBASE_CONFIG, USE_FIREBASE } from '../config/env';

// Firebase 설정
const firebaseConfig = {
  apiKey: FIREBASE_CONFIG.apiKey || "YOUR_API_KEY",
  authDomain: FIREBASE_CONFIG.authDomain || "hp-kal.firebaseapp.com",
  projectId: FIREBASE_CONFIG.projectId || "hp-kal",
  storageBucket: FIREBASE_CONFIG.storageBucket || "hp-kal.appspot.com",
  messagingSenderId: FIREBASE_CONFIG.messagingSenderId || "123456789",
  appId: FIREBASE_CONFIG.appId || "1:123456789:web:abcdef",
  measurementId: FIREBASE_CONFIG.measurementId || "G-XXXXXXXXXX"
};

// Firebase 초기화 (USE_FIREBASE가 true일 때만)
let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreDb: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;
let analyticsInstance: Analytics | null = null;

if (USE_FIREBASE) {
  try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    firestoreDb = getFirestore(app);
    storageInstance = getStorage(app);
    analyticsInstance = typeof window !== 'undefined' ? getAnalytics(app) : null;
    console.log('[Firebase] 초기화 완료');
  } catch (error) {
    console.error('[Firebase] 초기화 실패:', error);
  }
} else {
  console.log('[Firebase] Mock 모드 (USE_FIREBASE=false)');
}

// Mock Firestore (개발용)
const mockDb = {
  collection: () => ({ /* ... */ }),
} as any;

// Export
export const auth = authInstance;
export const storage = storageInstance;
export const analytics = analyticsInstance;
export const db = USE_FIREBASE && firestoreDb ? firestoreDb : mockDb;
export default app;
```

---

## 12. 주요 컬렉션 구조

### Firestore Collections

#### users
```typescript
{
  uid: string;
  phone: string;
  name?: string;
  email?: string;
  role: 'customer' | 'admin' | 'owner';
  addresses: Address[];
  createdAt: Timestamp;
}
```

#### orders
```typescript
{
  orderId: string;
  userId: string;
  storeId: string;
  items: OrderItem[];
  status: OrderStatus;
  payment: PaymentInfo;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### menus
```typescript
{
  menuId: string;
  category: MenuCategory;
  name: string;
  price: number;
  description: string;
  image: string;
  badges: MenuBadge[];
  isAvailable: boolean;
}
```

#### reviews
```typescript
{
  reviewId: string;
  userId: string;
  menuId: string;
  orderId: string;
  rating: number; // 1-5
  text: string;
  photos: string[];
  hasPhoto: boolean;
  createdAt: Timestamp;
}
```

#### coupons
```typescript
{
  couponId: string;
  userId: string;
  type: string;
  amount: number;
  minOrderAmount: number;
  status: 'unused' | 'used' | 'expired';
  issuedAt: Timestamp;
  expiresAt: Timestamp;
}
```

---

## 13. 보안 체크리스트

- ✅ Firestore Rules: 모든 컬렉션에 적절한 권한 설정
- ✅ Storage Rules: 파일 크기 및 MIME 타입 검증
- ✅ CORS: 허용된 오리진만 접근 가능
- ✅ Hosting Headers: 보안 헤더 설정 완료
- ✅ 환경 변수: 민감한 정보 환경 변수로 관리
- ✅ 조건부 초기화: Mock 모드 지원

---

## 14. 모니터링 및 로그

### Functions 로그 확인
```bash
firebase functions:log
```

### 실시간 로그
```bash
firebase functions:log --only [function-name]
```

### Firestore 사용량 확인
- Firebase Console > Firestore > Usage 탭

### Storage 사용량 확인
- Firebase Console > Storage > Usage 탭

---

## 15. 트러블슈팅

### 일반적인 문제

#### 1. CORS 오류
- **증상**: Storage 업로드 시 CORS 오류
- **해결**: Google Cloud Console에서 CORS 설정 수동 적용

#### 2. 인덱스 없음 오류
- **증상**: Firestore 쿼리 시 인덱스 필요 오류
- **해결**: `firebase deploy --only firestore:indexes` 실행

#### 3. Rules 배포 실패
- **증상**: Rules 문법 오류
- **해결**: `firebase firestore:rules:validate` 명령으로 검증

#### 4. Firebase 초기화 경고
- **증상**: API key not valid 경고
- **해결**: `USE_FIREBASE=false`로 Mock 모드 사용 또는 실제 API 키 설정

---

## 16. 개발사 정보

- **회사명**: KS컴퍼니
- **사업자번호**: 553-17-00098
- **대표**: 석경선
- **공동대표**: 배종수
- **고객센터**: 1566-5046
- **이메일**: help@shinkal.co.kr

---

**최종 업데이트**: 2025-10-29  
**작성자**: 개발팀  
**버전**: 1.0
