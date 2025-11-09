# Phase M0: 프로젝트 초기 설정 및 환경 구성

## 🎯 목표

React + TypeScript + Vite 프로젝트를 생성하고, Firebase 연동 및 기본 라우팅 구조를 설정합니다.

---

## 📋 PRD (Product Requirements Document)

### 1. 프로젝트 구조

```
hp-kal/
├── public/
│   ├── manifest.json          # PWA 매니페스트
│   ├── sw.js                  # Service Worker
│   ├── offline.html           # 오프라인 폴백
│   └── icons/                 # PWA 아이콘
│       ├── icon-192x192.png
│       └── icon-512x512.png
├── src/
│   ├── App.tsx                # 메인 앱 (라우터)
│   ├── main.tsx               # 엔트리 포인트
│   ├── vite-env.d.ts          # Vite 타입
│   ├── components/            # 컴포넌트
│   │   ├── ui/                # shadcn/ui
│   │   ├── app/               # 주문자 앱 컴포넌트
│   │   ├── admin/             # 관리자 컴포넌트
│   │   ├── shared/            # 공유 컴포넌트
│   │   ├── icons/             # 커스텀 아이콘
│   │   └── figma/             # Figma 시스템 컴포넌트
│   ├── pages/                 # 페이지 컴포넌트
│   │   ├── app/               # 주문자 페이지
│   │   └── admin/             # 관리자 페이지
│   ├── contexts/              # React Context
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── hooks/                 # Custom Hooks
│   ├── lib/                   # 유틸리티 및 API
│   │   ├── firebase.ts        # Firebase 초기화
│   │   ├── auth.ts            # 인증 API
│   │   ├── orders.api.ts      # 주문 API
│   │   └── utils/             # 유틸 함수
│   ├── types/                 # TypeScript 타입
│   ├── constants/             # 상수
│   ├── config/                # 설정 파일
│   │   └── env.ts             # 환경 변수
│   ├── styles/                # 스타일
│   │   └── globals.css
│   └── data/                  # Mock 데이터
│       └── menus.json
├── functions/                 # Firebase Functions
│   ├── src/
│   │   ├── index.ts
│   │   ├── orders.ts
│   │   └── lib/
│   ├── package.json
│   └── tsconfig.json
├── e2e/                       # E2E 테스트
│   ├── auth.spec.ts
│   ├── order-flow.spec.ts
│   └── accessibility.spec.ts
├── docs/                      # 문서
├── firebase.json              # Firebase 설정
├── firestore.rules            # Firestore 규칙
├── firestore.indexes.json     # Firestore 인덱스
├── storage.rules              # Storage 규칙
├── package.json
├── tsconfig.json
├── vite.config.ts
└── playwright.config.ts
```

---

### 2. package.json 의존성

#### 2.1 Core Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "firebase": "^11.0.1",
    "lucide-react": "^0.460.0",
    "sonner": "^2.0.3",
    "date-fns": "^4.1.0",
    "recharts": "^2.13.3",
    "react-hook-form": "^7.55.0",
    "zod": "^3.23.8"
  }
}
```

#### 2.2 Dev Dependencies
```json
{
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "typescript": "~5.6.2",
    "vite": "^5.4.10",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "@playwright/test": "^1.48.2",
    "firebase-tools": "^13.24.1"
  }
}
```

---

### 3. Firebase 설정

#### 3.1 Firebase 프로젝트 생성
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화
firebase init

# 선택 항목:
# - Firestore
# - Functions (TypeScript)
# - Hosting
# - Storage
# - Emulators
```

#### 3.2 firebase.json
```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": {
    "source": "functions",
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ]
  },
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "storage": {
    "rules": "storage.rules"
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "functions": {
      "port": 5001
    },
    "firestore": {
      "port": 8080
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

#### 3.3 firestore.rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isAuthenticated();
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isAuthenticated();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Menus collection
    match /menus/{menuId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Coupons collection
    match /coupons/{couponId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Points collection
    match /points/{pointId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isAdmin();
    }
    
    // Support collection
    match /support/{ticketId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.userId) || isAdmin();
    }
    
    // Settings collection
    match /settings/{doc} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

#### 3.4 storage.rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Menu images
    match /menus/{menuId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                    get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Review images
    match /reviews/{reviewId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // User avatars
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

### 4. 환경 변수 설정

#### 4.1 .env.local (로컬 개발용)
```bash
# Firebase Config
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=hp-kal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hp-kal
VITE_FIREBASE_STORAGE_BUCKET=hp-kal.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Feature Flags
VITE_USE_FIREBASE=false  # 개발 중에는 Mock 사용
VITE_DELIVERY_ENABLED=true
VITE_DELIVERY_PROVIDER=mock
VITE_SUPPORT_ENABLED=true
VITE_POINTS_ENABLED=true

# NICEPAY (테스트 키)
VITE_NICEPAY_MID=NICE_DEV_MID
VITE_NICEPAY_CLIENT_KEY=NICE_DEV_KEY
```

#### 4.2 .env.production (프로덕션용)
```bash
# Firebase Config (실제 값 사용)
VITE_FIREBASE_API_KEY=production_api_key
VITE_FIREBASE_AUTH_DOMAIN=hp-kal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hp-kal
VITE_FIREBASE_STORAGE_BUCKET=hp-kal.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=production_sender_id
VITE_FIREBASE_APP_ID=production_app_id
VITE_FIREBASE_MEASUREMENT_ID=production_measurement_id

# Feature Flags
VITE_USE_FIREBASE=true  # 프로덕션에서는 Firebase 사용
VITE_DELIVERY_ENABLED=true
VITE_DELIVERY_PROVIDER=providerA
VITE_SUPPORT_ENABLED=true
VITE_POINTS_ENABLED=true

# NICEPAY (실제 키)
VITE_NICEPAY_MID=your_merchant_id
VITE_NICEPAY_CLIENT_KEY=your_client_key
```

#### 4.3 config/env.ts
```typescript
// 환경 변수 안전 접근
const getEnv = (key: string, defaultValue: string = ''): string => {
  try {
    return import.meta.env[key] || defaultValue;
  } catch {
    return defaultValue;
  }
};

export const ENV = import.meta.env.MODE || 'development';
export const DEBUG = ENV === 'development';

// Firebase 사용 여부
export const USE_FIREBASE = getEnv('VITE_USE_FIREBASE') === 'true';

// 앱 설정
export const APP_CONFIG = {
  name: '현풍닭칼국수',
  version: '1.0.0',
  company: 'KS컴퍼니',
  bizNo: '553-17-00098',
  ceo: '석경선/배종수(공동대표)',
};

// Firebase 설정
export const FIREBASE_CONFIG = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID'),
  measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID'),
};

// NICEPAY 설정
export const NICEPAY_CONFIG = {
  mid: getEnv('VITE_NICEPAY_MID', 'NICE_DEV_MID'),
  clientKey: getEnv('VITE_NICEPAY_CLIENT_KEY', 'NICE_DEV_KEY'),
};

// Feature Flags
export const FEATURE_FLAGS = {
  delivery: getEnv('VITE_DELIVERY_ENABLED', 'true') === 'true',
  support: getEnv('VITE_SUPPORT_ENABLED', 'true') === 'true',
  points: getEnv('VITE_POINTS_ENABLED', 'true') === 'true',
};
```

---

### 5. 라우팅 구조

#### 5.1 App.tsx
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from 'sonner@2.0.3';

// App Pages
import Home from './pages/app/Home';
import MenuList from './pages/app/MenuList';
import MenuDetail from './pages/app/MenuDetail';
import Cart from './pages/app/Cart';
import Checkout from './pages/app/Checkout';
import OrderTracking from './pages/app/OrderTracking';
import OrderHistory from './pages/app/OrderHistory';
import ReviewList from './pages/app/ReviewList';
import ReviewWrite from './pages/app/ReviewWrite';
import Coupons from './pages/app/Coupons';
import Points from './pages/app/Points';
import My from './pages/app/My';
import Support from './pages/app/Support';
import Login from './pages/app/Login';
import Signup from './pages/app/Signup';

// Admin Pages
import AdminLayout from './pages/admin/_layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Menus from './pages/admin/Menus';
import Reviews from './pages/admin/Reviews';
import Promotions from './pages/admin/Promotions';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* App Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuList />} />
            <Route path="/menu/:id" element={<MenuDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders/:id" element={<OrderTracking />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/reviews" element={<ReviewList />} />
            <Route path="/reviews/write/:orderId" element={<ReviewWrite />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/points" element={<Points />} />
            <Route path="/my" element={<My />} />
            <Route path="/support" element={<Support />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="menus" element={<Menus />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="promotions" element={<Promotions />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Toaster position="top-center" richColors />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

---

### 6. Firebase 초기화

#### 6.1 lib/firebase.ts
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';
import { FIREBASE_CONFIG, USE_FIREBASE } from '../config/env';

// Firebase 초기화 (USE_FIREBASE=true일 때만)
let app;
let db;
let auth;
let storage;
let functions;
let analytics;

if (USE_FIREBASE) {
  app = initializeApp(FIREBASE_CONFIG);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  functions = getFunctions(app);
  analytics = getAnalytics(app);
} else {
  console.log('🔧 Mock mode: Firebase disabled');
}

export { db, auth, storage, functions, analytics };
```

---

### 7. TypeScript 설정

#### 7.1 tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Paths */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 💬 프롬프트

**아래 프롬프트를 AI에게 그대로 입력하세요:**

```
현풍닭칼국수 PWA 프로젝트의 초기 설정을 진행합니다.

## 작업 목표
React + TypeScript + Vite 프로젝트를 생성하고, Firebase 연동 및 기본 라우팅을 설정합니다.

## 작업 내용

### 1. 프로젝트 구조 생성
다음 디렉토리와 파일을 모두 생성해주세요:

#### 환경 설정 파일
- `/config/env.ts` - 환경 변수 관리
- `/.env.local.example` - 환경 변수 예시
- `/vite.config.ts` - Vite 설정
- `/tsconfig.json` - TypeScript 설정

#### Firebase 설정 파일
- `/firebase.json` - Firebase 프로젝트 설정
- `/firestore.rules` - Firestore 보안 규칙
- `/firestore.indexes.json` - Firestore 인덱스
- `/storage.rules` - Storage 보안 규칙
- `/lib/firebase.ts` - Firebase 초기화

#### 라우팅
- `/App.tsx` - 메인 라우터 (위의 구조 그대로)
- `/main.tsx` - 엔트리 포인트

#### Context
- `/contexts/AuthContext.tsx` - 인증 상태 관리 (빈 스켈레톤)
- `/contexts/CartContext.tsx` - 장바구니 상태 관리 (빈 스켈레톤)

#### 페이지 스켈레톤 (빈 페이지)
주문자 앱:
- `/pages/app/Home.tsx`
- `/pages/app/MenuList.tsx`
- `/pages/app/MenuDetail.tsx`
- `/pages/app/Cart.tsx`
- `/pages/app/Checkout.tsx`
- `/pages/app/OrderTracking.tsx`
- `/pages/app/OrderHistory.tsx`
- `/pages/app/ReviewList.tsx`
- `/pages/app/ReviewWrite.tsx`
- `/pages/app/Coupons.tsx`
- `/pages/app/Points.tsx`
- `/pages/app/My.tsx`
- `/pages/app/Support.tsx`
- `/pages/app/Login.tsx`
- `/pages/app/Signup.tsx`

관리자 대시보드:
- `/pages/admin/_layout/AdminLayout.tsx`
- `/pages/admin/Dashboard.tsx`
- `/pages/admin/Orders.tsx`
- `/pages/admin/Menus.tsx`
- `/pages/admin/Reviews.tsx`
- `/pages/admin/Promotions.tsx`
- `/pages/admin/Analytics.tsx`
- `/pages/admin/Settings/index.tsx`

#### Types
- `/types/common.ts` - 공통 타입
- `/types/menu.ts` - 메뉴 타입
- `/types/order.ts` - 주문 타입
- `/types/review.ts` - 리뷰 타입
- `/types/coupon.ts` - 쿠폰 타입
- `/types/points.ts` - 포인트 타입

#### PWA
- `/public/manifest.json` - PWA 매니페스트
- `/public/sw.js` - Service Worker (빈 스켈레톤)
- `/public/offline.html` - 오프라인 폴백 페이지

### 2. 구현 원칙
1. ✅ 모든 페이지는 기본 스켈레톤만 생성 (실제 기능은 다음 단계)
2. ✅ Firebase 초기화 코드는 완전히 구현
3. ✅ 라우팅 구조는 완전히 구현
4. ✅ TypeScript 타입은 기본 인터페이스만 정의
5. ✅ 환경 변수는 안전하게 접근 (try-catch)

### 3. 페이지 스켈레톤 형식
각 페이지는 다음 형식으로 생성:

```typescript
export default function PageName() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold">페이지 이름</h1>
      <p className="mt-4 text-gray-600">이 페이지는 다음 단계에서 구현됩니다.</p>
    </div>
  );
}
```

### 4. 주의사항
- ⚠️ Firebase 프로젝트 ID는 "hp-kal" 사용
- ⚠️ 모든 import 경로는 상대 경로 사용
- ⚠️ sonner import는 `'sonner@2.0.3'` 버전 명시
- ⚠️ 개발사 정보는 아직 삽입하지 않음 (다음 단계)

모든 파일을 100% 완성된 형태로 생성해주세요.
```

---

## ✅ 검증 체크리스트

- [ ] `config/env.ts` 파일이 생성되고 환경 변수 접근 함수가 있는가?
- [ ] `firebase.json` 설정이 완료되었는가?
- [ ] `firestore.rules`에 보안 규칙이 정의되었는가?
- [ ] `lib/firebase.ts`에서 Firebase가 초기화되는가?
- [ ] `App.tsx`에 모든 라우트가 정의되었는가?
- [ ] Context (Auth, Cart)가 생성되었는가?
- [ ] 주문자 앱 페이지 15개가 모두 생성되었는가?
- [ ] 관리자 대시보드 페이지 7개가 모두 생성되었는가?
- [ ] 기본 타입 파일들이 생성되었는가?
- [ ] PWA 파일 (manifest, sw)이 생성되었는가?
- [ ] 모든 페이지가 오류 없이 렌더링되는가?

---

## 📌 다음 단계

**04-landing-menu.md** - 랜딩 페이지 및 메뉴 시스템 구축

---

**작성일**: 2025-10-31  
**작성자**: 현풍닭칼국수 개발팀  
**개발사**: KS컴퍼니
