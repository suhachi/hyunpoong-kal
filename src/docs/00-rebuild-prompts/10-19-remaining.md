# Phase 3-10: 나머지 모든 기능 (리뷰관리~문서화)

## 🎯 목표

관리자 고급 기능, 포인트/쿠폰, 배달 추적, 고객 지원, 인증, 테스트, PWA, 배포, 문서화를 모두 완성합니다.

---

## 📋 10. 리뷰 관리 및 통계 분석

### Reviews 페이지
```tsx
// pages/admin/Reviews.tsx
- 리뷰 목록 테이블
- 별점 필터 (전체, 5점, 4점, 3점 이하)
- 답글 미작성 필터
- 신고된 리뷰 필터
- ReviewCard (사장님 답글 작성 UI)
- ReplyModal (답글 작성/수정)
- ReportDialog (신고 처리)
```

### Analytics 페이지  
```tsx
// pages/admin/Analytics.tsx
- 기간 선택 (DateRangePicker)
- 매출 차트 (recharts Line)
- 주문 추이 (recharts Bar)
- 카테고리별 판매 (recharts Pie)
- 시간대별 주문 (recharts Area)
- Top 10 메뉴
- 고객 통계 (신규/재구매)
```

---

## 📋 11. 관리자 설정 센터

### Settings 페이지 (5개 탭)
```tsx
// pages/admin/Settings/index.tsx
<Tabs defaultValue="payment">
  <TabsList>
    <TabsTrigger value="payment">결제</TabsTrigger>
    <TabsTrigger value="delivery">배달</TabsTrigger>
    <TabsTrigger value="fcm">푸시 알림</TabsTrigger>
    <TabsTrigger value="maps">지도</TabsTrigger>
    <TabsTrigger value="operations">운영</TabsTrigger>
  </TabsList>
  
  <TabsContent value="payment">
    <PaymentTab />
  </TabsContent>
  {/* ... */}
</Tabs>
```

#### PaymentTab
- NICEPAY 설정 (MID, Client Key)
- 결제 수단 활성화 (카드, 계좌이체, 간편결제)
- PG사 수수료 설정

#### DeliveryTab  
- 배달비 규칙 (기본거리, 기본비용, km당 추가)
- 무료 배달 최소 주문금액
- 최소 주문 금액
- 최대 배달 거리

#### FCMTab
- Firebase Cloud Messaging 설정
- 서버 키, Sender ID
- 알림 템플릿 관리

#### MapsTab
- 가게 위치 (위도, 경도)
- Kakao Maps API 키
- 배달 가능 지역 반경

#### OperationsTab
- 영업시간 (요일별)
- 휴무일 설정
- 임시 휴무 설정
- 주문 자동 접수 (ON/OFF)

---

## 📋 12. 포인트 및 쿠폰 시스템

### Points 페이지
```tsx
// pages/app/Points.tsx
- 보유 포인트 표시 (큰 숫자)
- 포인트 적립/사용 내역 (무한 스크롤)
- 소멸 예정 포인트 알림
- 포인트 사용 방법 안내
```

### Coupons 페이지
```tsx
// pages/app/Coupons.tsx
- 사용 가능한 쿠폰 목록
- 사용 완료 쿠폰 (회색 처리)
- 쿠폰 코드 입력
- CouponCard (할인 금액, 유효기간, 최소 주문금액)
```

### Admin Promotions
```tsx
// pages/admin/Promotions.tsx
- 쿠폰 생성 (정액/정률/배달비무료)
- 쿠폰 코드 생성 (자동/수동)
- 발급 대상 (전체/특정 고객)
- 유효기간 설정
- 사용 횟수 제한
- 쿠폰 통계 (발급, 사용, 미사용)
```

---

## 📋 13. 배달 추적 시스템

### Delivery 페이지
```tsx
// pages/admin/Delivery.tsx
- 실시간 배달 관제 지도
- 진행 중인 배달 목록 (좌측 패널)
- 지도에 마커 (가게, 배달원 N명, 고객 N명)
- 배달원 선택 시 경로 표시
- 배달 대행사 API 호출 버튼
- 배달 상태 실시간 업데이트
```

### Provider A API 연동
```typescript
// lib/delivery/providers/providerA.ts
export async function callDelivery(order: Order): Promise<{
  deliveryId: string;
  estimatedPickupTime: string;
}>;

export async function trackDelivery(deliveryId: string): Promise<{
  driverId: string;
  driverName: string;
  driverPhone: string;
  currentLat: number;
  currentLng: number;
  status: 'picking' | 'delivering' | 'delivered';
  estimatedArrival: string;
}>;

export async function cancelDelivery(deliveryId: string): Promise<void>;
```

---

## 📋 14. 고객 지원 시스템

### Support 페이지 (고객용)
```tsx
// pages/app/Support.tsx
- 문의 유형 선택 (주문, 결제, 배달, 기타)
- 제목, 내용 입력
- 이미지 첨부 (최대 3장)
- 내 문의 내역
- 실시간 채팅 (선택 시)
```

### Admin Support
```tsx
// pages/admin/Support.tsx
- 문의 목록 (대기, 진행중, 완료)
- 문의 상세 (Drawer)
- 답변 작성
- 상태 변경 (대기→진행중→완료)
- 실시간 채팅 (Firebase Realtime DB)
```

---

## 📋 15. 인증 시스템

### Login 페이지
```tsx
// pages/app/Login.tsx
- 이메일 + 비밀번호
- 소셜 로그인 (Google, Kakao)
- "비밀번호 찾기" 링크
- "회원가입" 링크
```

### Signup 페이지
```tsx
// pages/app/Signup.tsx
- 이메일, 비밀번호, 비밀번호 확인
- 이름, 전화번호
- 약관 동의 (필수, 선택)
- 이메일 인증 (Firebase Auth)
```

### AuthContext
```tsx
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithKakao: () => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}
```

---

## 📋 16. E2E 테스트 및 접근성

### Playwright 테스트
```typescript
// e2e/order-flow.spec.ts
test('전체 주문 플로우', async ({ page }) => {
  // 1. 메뉴 선택
  await page.goto('/menu');
  await page.click('text=현풍닭칼국수');
  
  // 2. 옵션 선택
  await page.click('text=보통맛');
  await page.click('button:has-text("장바구니 담기")');
  
  // 3. 장바구니
  await page.goto('/cart');
  await page.click('button:has-text("주문하기")');
  
  // 4. 주문서 작성
  await page.fill('input[name="name"]', '홍길동');
  await page.fill('input[name="phone"]', '01012345678');
  await page.click('button:has-text("결제하기")');
  
  // 5. 결제 (Mock)
  await page.waitForURL('/orders/*');
  
  // 6. 주문 확인
  await expect(page.locator('text=결제가 완료되었습니다')).toBeVisible();
});
```

### 접근성 개선
```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('홈페이지 접근성', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page);
});

// 모든 주요 페이지에 대해 a11y 테스트
```

---

## 📋 17. PWA 최적화

### Service Worker
```javascript
// public/sw.js
const CACHE_NAME = 'hp-kal-v1';
const urlsToCache = [
  '/',
  '/menu',
  '/styles/globals.css',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

### Manifest
```json
// public/manifest.json
{
  "name": "현풍닭칼국수",
  "short_name": "현풍칼국수",
  "description": "40년 전통의 깊은 맛",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#D61C1C",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Offline Fallback
```html
<!-- public/offline.html -->
<!DOCTYPE html>
<html>
<head>
  <title>오프라인 - 현풍닭칼국수</title>
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #f9fafb;
    }
    .container {
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🍜</h1>
    <h2>인터넷에 연결되어 있지 않습니다</h2>
    <p>연결을 확인하고 다시 시도해주세요.</p>
  </div>
</body>
</html>
```

---

## 📋 18. Firebase 배포

### firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/service-worker.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  }
}
```

### 배포 스크립트
```bash
#!/bin/bash
# scripts/deploy-firebase.sh

echo "🔨 Building..."
npm run build

echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🌐 URL: https://hp-kal.web.app"
```

---

## 📋 19. 운영 문서화

### README.md
```markdown
# 현풍닭칼국수 PWA

## 시작하기

\`\`\`bash
npm install
npm run dev
\`\`\`

## 환경 변수

\`\`\`
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_PROJECT_ID=hp-kal
VITE_NICEPAY_MID=
\`\`\`

## 배포

\`\`\`bash
npm run build
firebase deploy
\`\`\`

## 개발사

KS컴퍼니 (사업자번호: 553-17-00098)
대표: 석경선 / 배종수 (공동대표)
```

### 운영 매뉴얼
```markdown
# 관리자 매뉴얼

## 주문 접수

1. 알림 확인
2. 주문 상세 확인
3. [접수] 버튼 클릭
4. 조리 시작

## 메뉴 관리

1. 메뉴 관리 → [메뉴 생성]
2. 정보 입력
3. 이미지 업로드
4. 옵션 설정
5. 저장

## 리뷰 답글

1. 리뷰 관리 → 리뷰 선택
2. [답글 작성]
3. 내용 입력
4. 저장

## 문제 해결

### 주문이 안 보여요
- 인터넷 연결 확인
- 페이지 새로고침
- 로그아웃 후 재로그인

### 결제가 안 돼요
- NICEPAY 설정 확인
- 테스트 모드 확인
- Functions 로그 확인
```

---

## 💬 통합 프롬프트

```
현풍닭칼국수 PWA의 나머지 모든 기능을 완성합니다.

## Phase 10: 리뷰 관리 및 분석

### Reviews 페이지
- 리뷰 목록, 필터 (별점, 답글 미작성, 신고)
- ReplyModal, ReportDialog
- 답글 작성/수정/삭제

### Analytics 페이지
- DateRangePicker (기간 선택)
- 4개 차트 (매출, 주문, 카테고리, 시간대)
- Top 10 메뉴, 고객 통계

## Phase 11: 설정 센터

### Settings 페이지 (5개 탭)
1. PaymentTab - NICEPAY 설정
2. DeliveryTab - 배달비 규칙
3. FCMTab - 푸시 알림
4. MapsTab - 지도 설정
5. OperationsTab - 영업시간

각 탭은 Form + Save 버튼

## Phase 12: 포인트/쿠폰

### Points 페이지
- 보유 포인트, 적립/사용 내역

### Coupons 페이지  
- 사용 가능/완료 쿠폰

### Admin Promotions
- 쿠폰 생성/발급/통계

## Phase 13: 배달 추적

### Delivery 페이지
- Kakao Maps 실시간 관제
- 배달원 위치 마커
- Provider A API 연동

## Phase 14: 고객 지원

### Support 페이지
- 문의 작성/조회
- 실시간 채팅 (선택)

### Admin Support
- 문의 관리/답변

## Phase 15: 인증

### Login/Signup
- 이메일/비밀번호
- 소셜 로그인 (Google, Kakao)

### AuthContext
- Firebase Auth 연동

## Phase 16: 테스트/접근성

### Playwright E2E
- order-flow.spec.ts
- auth.spec.ts
- accessibility.spec.ts

### axe-core
- 모든 페이지 a11y 검증

## Phase 17: PWA

### Service Worker
- 캐싱 전략
- Offline fallback

### Manifest
- icons, theme_color

## Phase 18: 배포

### firebase deploy
- Hosting 설정
- Functions 배포
- Firestore Rules

## Phase 19: 문서화

### README.md
- 시작 가이드
- 환경 변수
- 배포 방법

### 운영 매뉴얼
- 주문 접수
- 메뉴 관리
- 문제 해결

---

## 구현 원칙 (전체)
1. ✅ 100% 구현 (플레이스홀더 금지)
2. ✅ 모든 기능 완전 작동
3. ✅ 실제 API 연동 (Mock 지원)
4. ✅ 에러 처리
5. ✅ 로딩 상태
6. ✅ 접근성 (WCAG 2.1 AA)
7. ✅ 반응형
8. ✅ 개발사 정보 삽입
9. ✅ 브랜드 컬러 일관성
10. ✅ TypeScript 타입 안전성

모든 파일을 생성하고, 완전히 작동하는 PWA를 완성해주세요.
```

---

## ✅ 최종 검증 체크리스트

### 주문자 앱 (15개 페이지)
- [ ] Home - 랜딩 페이지
- [ ] MenuList - 메뉴 목록
- [ ] MenuDetail - 메뉴 상세
- [ ] Cart - 장바구니
- [ ] Checkout - 주문서
- [ ] OrderTracking - 주문 추적
- [ ] OrderHistory - 주문 내역
- [ ] ReviewList - 리뷰 목록
- [ ] ReviewWrite - 리뷰 작성
- [ ] Points - 포인트
- [ ] Coupons - 쿠폰
- [ ] Support - 고객 지원
- [ ] My - 마이페이지
- [ ] Login - 로그인
- [ ] Signup - 회원가입

### 관리자 대시보드 (9개 페이지)
- [ ] Dashboard - 대시보드
- [ ] Orders - 주문 관리
- [ ] Menus - 메뉴 관리
- [ ] Reviews - 리뷰 관리
- [ ] Promotions - 프로모션
- [ ] Analytics - 통합 분석
- [ ] Delivery - 배달 관제
- [ ] Support - 고객 지원
- [ ] Settings - 설정 센터

### 핵심 기능
- [ ] 실시간 주문 알림
- [ ] NICEPAY 결제 연동
- [ ] 배달 대행사 API
- [ ] Firebase Auth
- [ ] Firestore CRUD
- [ ] Firebase Storage
- [ ] Firebase Functions
- [ ] FCM 푸시 알림
- [ ] Service Worker
- [ ] PWA 설치 프롬프트

### 품질
- [ ] E2E 테스트 (Playwright)
- [ ] 접근성 (axe-core)
- [ ] Lighthouse Score 90+
- [ ] 반응형 (모든 화면)
- [ ] TypeScript 에러 0개
- [ ] ESLint 에러 0개

---

## 📌 완료!

모든 19단계 프롬프트가 완성되었습니다.

**총 파일 수**: 100개 이상  
**총 작업 시간**: 24시간  
**완성도**: 100%

---

**작성일**: 2025-10-31  
**작성자**: 현풍닭칼국수 개발팀  
**개발사**: KS컴퍼니 (사업자번호: 553-17-00098, 대표: 석경선/배종수)
