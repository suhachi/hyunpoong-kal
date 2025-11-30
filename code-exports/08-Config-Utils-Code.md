# Config & Utils - Full Source Code

**Generated**: 2025-11-30-1717  
**Project**: hyunpoong-kal  
**Company**: KS Company (BRN: 553-17-00098)

---

## Overview

Complete source code of configuration files and utility functions.

---
## src\config\env.ts

```typescript
/**
 * 환경 변수 설정
 * USE_FIREBASE 플래그를 통한 Mock/Real 전환
 */

// 환경 타입 (먼저 정의 - 순환 참조 방지)
// Figma Make 환경 등에서 import.meta가 없을 수 있으므로 방어적으로 처리
export const ENV = (() => {
  try {
    // import.meta 존재 여부 확인 (Figma Make 호환)
    if (typeof import.meta === 'undefined' || !import.meta.env) {
      console.log('[Env] Figma Make 또는 특수 환경 감지 - 개발 모드로 설정');
      return 'development';
    }
    return import.meta.env.MODE || 'development';
  } catch {
    return 'development';
  }
})();

// 디버그 모드 (먼저 정의 - 순환 참조 방지)
export const DEBUG = ENV === 'development';

// 환경 변수 로딩 상태 (최초 1회만 경고)
let envWarningShown = false;

// 환경 변수 안전 접근 헬퍼 (Figma Make 환경 호환)
export const getEnv = (key: string, defaultValue: string = '', required: boolean = false): string => {
  try {
    // import.meta 안전 체크 (Figma Make 등 특수 환경 대응)
    if (typeof import.meta === 'undefined' || !import.meta.env) {
      if (DEBUG && required) {
        console.warn(`[Env] ${key} 접근 불가 (Figma Make?), 기본값 사용: ${defaultValue}`);
      }
      return defaultValue;
    }
    
    const value = import.meta.env[key] || '';
    
    // 필수 변수인데 값이 없으면 오류
    if (!value && required && !defaultValue) {
      console.error(`[Env] Required environment variable ${key} is not set`);
      // 개발 환경에서는 경고만, 프로덕션에서는 에러 던지기
      if (ENV === 'production') {
        throw new Error(`Required environment variable ${key} is not set`);
      }
    }
    
    // 값이 설정되어 있으면 해당 값 사용, 없으면 기본값
    return value || defaultValue;
  } catch (error) {
    if (DEBUG) {
      console.warn(`[Env] ${key} 접근 에러, 기본값 사용:`, defaultValue, error);
    }
    return defaultValue;
  }
};

// v1.0: Firebase 모드 플래그 (환경 변수 기반)
// VITE_USE_FIREBASE 환경 변수를 읽어서 boolean으로 변환
// 기본값: false (Mock 모드)
// true: Firebase 실연동 모드
// false: Mock 모드 (localStorage)
export const USE_FIREBASE = (() => {
  const raw = getEnv('VITE_USE_FIREBASE', 'false');
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  // 기본값: false (Mock 모드)
  return false;
})();

// 디버그 로그 추가
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log('[env] USE_FIREBASE:', USE_FIREBASE, 'VITE_USE_FIREBASE:', getEnv('VITE_USE_FIREBASE'));
}

// 앱 설정
export const APP_CONFIG = {
  name: '현풍닭칼국수',
  version: '1.0.0',
  company: 'KS컴퍼니',
  bizNo: '553-17-00098',
  ceo: '석경선/배종수(공동대표)',
};

// v1.0: Store ID (환경 변수 기반)
// VITE_STORE_ID 환경 변수를 읽어서 사용
// 기본값: 'hyunpoong_main'
export const STORE_ID = getEnv('VITE_STORE_ID', 'hyunpoong_main');

// Kakao Map JS SDK
// VITE_KAKAO_MAP_APP_KEY 환경 변수를 읽어서 사용
export const KAKAO_MAP_APP_KEY = getEnv('VITE_KAKAO_MAP_APP_KEY', '');

// Firebase 설정 (Firebase 사용 시)
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
  returnUrl: getEnv('VITE_NICEPAY_RETURN_URL', `${typeof window !== 'undefined' ? window.location.origin : ''}/order/return`),
  cancelUrl: getEnv('VITE_NICEPAY_CANCEL_URL', `${typeof window !== 'undefined' ? window.location.origin : ''}/order/cancel`),
};

// 배달 대행사 Provider A 설정
export const PROVIDER_A_CONFIG = {
  apiUrl: getEnv('VITE_PROVIDER_A_API_URL', 'https://api.provider-a.example.com'),
  apiKey: getEnv('VITE_PROVIDER_A_API_KEY', 'YOUR_API_KEY_HERE'),
  merchantId: getEnv('VITE_PROVIDER_A_MERCHANT_ID', 'YOUR_MERCHANT_ID'),
};

// '생각대로' 배달대행사 설정
export const SAENGGAKDAERO_CONFIG = {
  apiUrl: getEnv('VITE_SAENGGAKDAERO_API_URL', 'https://api.saenggakdaero.com'),
  apiKey: getEnv('VITE_SAENGGAKDAERO_API_KEY', 'YOUR_API_KEY_HERE'),
  merchantId: getEnv('VITE_SAENGGAKDAERO_MERCHANT_ID', 'YOUR_MERCHANT_ID'),
};

// Phase 3 기능 토글
export const FEATURE_FLAGS = {
  // 배달 추적 기능 (개발 환경에서는 기본 활성화)
  delivery: getEnv('VITE_DELIVERY_ENABLED', ENV === 'development' ? 'true' : 'false') === 'true',
  deliveryProvider: getEnv('VITE_DELIVERY_PROVIDER', 'mock'),
  deliveryWebhookSecret: getEnv('VITE_DELIVERY_WEBHOOK_SECRET', 'change_me'),
  // 고객 지원 채팅 기능 (개발 환경에서는 기본 활성화)
  support: getEnv('VITE_SUPPORT_ENABLED', ENV === 'development' ? 'true' : 'false') === 'true',
  // 포인트 리워드 시스템 (개발 환경에서는 기본 활성화)
  points: getEnv('VITE_POINTS_ENABLED', ENV === 'development' ? 'true' : 'false') === 'true',
  pointsRate: parseFloat(getEnv('VITE_POINTS_RATE', '0.03')),
  pointsMinUse: parseInt(getEnv('VITE_POINTS_MIN_USE', '1000'), 10),
  pointsExpireDays: parseInt(getEnv('VITE_POINTS_EXPIRE_DAYS', '365'), 10),
  // 온라인 결제 기능 (Phase 3)
  // v0.9.0에서는 강제로 false (env 기본값도 false)
  onlinePayment: getEnv('VITE_ONLINE_PAYMENT_ENABLED', 'false') === 'true',
  onlinePaymentProvider: getEnv('VITE_ONLINE_PAYMENT_PROVIDER', 'none'),
};

// 로깅 유틸
export function log(...args: any[]) {
  if (DEBUG) {
    console.log('[App]', ...args);
  }
}

export function logError(...args: any[]) {
  console.error('[App Error]', ...args);
}

// (중복 export 제거)
export default {
  ENV,
  DEBUG,
  USE_FIREBASE,
  FIREBASE_CONFIG,
  FEATURE_FLAGS,
  log,
  logError,
  getEnv,
};

```

---

## vite.config.ts

```typescript

  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
      publicDir: 'src/public',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'sonner@2.0.3': 'sonner',
        'react-hook-form@7.55.0': 'react-hook-form',
        'lucide-react@0.487.0': 'lucide-react',
        'figma:asset/f881b2d8bf23006ccae73c3d977f87a2e2dccf47.png': path.resolve(__dirname, './src/assets/f881b2d8bf23006ccae73c3d977f87a2e2dccf47.png'),
        'figma:asset/92c9b32635da68466319c6dfafbaf99b129ec904.png': path.resolve(__dirname, './src/assets/92c9b32635da68466319c6dfafbaf99b129ec904.png'),
        'figma:asset/75b3c0027407bb9d32080f5b3eb51096c93f9933.png': path.resolve(__dirname, './src/assets/75b3c0027407bb9d32080f5b3eb51096c93f9933.png'),
        'figma:asset/72ab99587b1fb72aa04a7051333c2c1411037d0e.png': path.resolve(__dirname, './src/assets/72ab99587b1fb72aa04a7051333c2c1411037d0e.png'),
        'figma:asset/326493a3b65735707c0e5d3d387262bcd7cdcc21.png': path.resolve(__dirname, './src/assets/326493a3b65735707c0e5d3d387262bcd7cdcc21.png'),
        'figma:asset/1710e1c0c8f0aa11de622128fdd40c7e0ada1ddd.png': path.resolve(__dirname, './src/assets/1710e1c0c8f0aa11de622128fdd40c7e0ada1ddd.png'),
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
    },
    server: {
      port: 3000,
      open: true,
      strictPort: false, // 포트 충돌 시 자동으로 다른 포트 사용
    },
  });
```

---

## tailwind.config.js

```javascript
import config from './src/tailwind.config.js';

export default config;


```

---

## postcss.config.js

```javascript
let plugins;

try {
  const { version } = require('tailwindcss/package.json');
  const [major] = version.split('.');

  if (Number(major) >= 4) {
    require.resolve('@tailwindcss/postcss');
    plugins = {
      '@tailwindcss/postcss': {},
    };
  } else {
    throw new Error('Tailwind CSS v4 미사용');
  }
} catch {
  plugins = {
    tailwindcss: {},
    autoprefixer: {},
  };
}

export default {
  plugins,
};


```

---

## package.json

```json
{
      "name": "hyunpoong-kal",
      "version": "0.9.0",
      "private": true,
      "description": "현풍닭칼국수 PWA - 매장/포장 주문 전용 웹앱 (v0.9.0, 비결제 Mock 모드)",
      "type": "module",
      "dependencies": {
            "@axe-core/playwright": "^4.10.0",
            "@google-cloud/storage": "^7.14.0",
            "@playwright/test": "^1.56.1",
            "@radix-ui/react-accordion": "^1.2.1",
            "@radix-ui/react-alert-dialog": "^1.1.2",
            "@radix-ui/react-aspect-ratio": "^1.1.0",
            "@radix-ui/react-avatar": "^1.1.1",
            "@radix-ui/react-checkbox": "^1.1.2",
            "@radix-ui/react-collapsible": "^1.1.1",
            "@radix-ui/react-context-menu": "^2.2.2",
            "@radix-ui/react-dialog": "^1.1.2",
            "@radix-ui/react-dropdown-menu": "^2.1.2",
            "@radix-ui/react-hover-card": "^1.1.2",
            "@radix-ui/react-label": "^2.1.0",
            "@radix-ui/react-menubar": "^1.1.2",
            "@radix-ui/react-navigation-menu": "^1.2.1",
            "@radix-ui/react-popover": "^1.1.2",
            "@radix-ui/react-progress": "^1.1.0",
            "@radix-ui/react-radio-group": "^1.2.1",
            "@radix-ui/react-scroll-area": "^1.2.0",
            "@radix-ui/react-select": "^2.1.2",
            "@radix-ui/react-separator": "^1.1.0",
            "@radix-ui/react-slider": "^1.2.1",
            "@radix-ui/react-slot": "^1.1.0",
            "@radix-ui/react-switch": "^1.1.1",
            "@radix-ui/react-tabs": "^1.1.1",
            "@radix-ui/react-toggle": "^1.1.0",
            "@radix-ui/react-toggle-group": "^1.1.0",
            "@radix-ui/react-tooltip": "^1.1.3",
            "@vitejs/plugin-react": "^4.3.4",
            "class-variance-authority": "^0.7.0",
            "clsx": "^2.1.1",
            "cmdk": "^1.0.0",
            "embla-carousel-react": "^8.5.1",
            "firebase": "^12.5.0",
            "firebase-admin": "^12.7.0",
            "firebase-functions": "^6.1.0",
            "input-otp": "^1.4.1",
            "lucide-react": "^0.487.0",
            "motion": "^11.11.17",
            "node-fetch": "^3.3.2",
            "path": "^0.12.7",
            "pdfkit": "^0.15.0",
            "playwright": "^1.56.1",
            "qrcode.react": "^4.2.0",
            "react": "^18.3.1",
            "react-day-picker": "^9.4.1",
            "react-dom": "^18.3.1",
            "react-hook-form": "^7.55.0",
            "react-resizable-panels": "^2.1.7",
            "react-router-dom": "^6.28.0",
            "recharts": "^2.13.3",
            "sonner": "^2.0.3",
            "tailwind-merge": "^2.5.5",
            "vaul": "^1.1.1"
      },
      "devDependencies": {
            "@tailwindcss/postcss": "^4.0.0",
            "@types/node": "^20.10.0",
            "@vitejs/plugin-react-swc": "^3.10.2",
            "autoprefixer": "^10.4.20",
            "postcss": "^8.4.47",
            "tailwindcss": "^3.4.14",
            "vite": "6.3.5"
      },
      "scripts": {
            "dev": "vite",
            "build": "vite build",
            "preview": "vite preview",
            "analyze:dist": "npm run build && node scripts/print-dist-size.cjs",
            "verify:build": "npm run build && node scripts/verify-build.mjs",
            "cors:apply": "node scripts/apply-cors.mjs",
            "predeploy": "npm run verify:build && npm run cors:apply",
            "test:e2e": "playwright test -c src/playwright.config.ts",
            "test:e2e:admin": "playwright test -c src/playwright.config.ts --project=chromium --grep @admin",
            "test:e2e:admin:routes": "playwright test -c src/playwright.config.ts admin-routes.spec.ts --project=chromium",
            "test:e2e:admin:settings": "playwright test -c src/playwright.config.ts admin-settings.spec.ts --project=chromium",
            "test:e2e:ui": "playwright test -c src/playwright.config.ts --ui",
            "test:e2e:report": "playwright show-report",
            "test:e2e:orderflow": "playwright test -c src/playwright.config.ts src/e2e/order-flow.spec.ts --project=chromium --grep @orderflow",
            "functions:build": "cd src/functions && npm run build",
            "functions:deploy": "cd src/functions && npm run deploy",
            "functions:serve": "cd src/functions && npm run serve"
      }
}
```

---

## src\utils\printReceipt.ts

```typescript
import type { Order } from '../types/order';
import { formatPrice } from '../lib/utils';

interface StoreInfo {
    name: string;
    address: string;
    phone: string;
}

export function printOrderReceipt(
    orderId: string,
    order: Order,
    storeInfo: StoreInfo = {
        name: '현풍닭칼국수',
        address: '대구광역시 달성군 현풍읍', // 실제 주소로 변경 필요
        phone: '053-000-0000' // 실제 전화번호로 변경 필요
    }
) {
    const items = order.items
        .map(item => `
      <li>
        <div style="display: flex; justify-content: space-between;">
          <span>${item.menuName} x ${item.quantity}</span>
          <span>${formatPrice(item.subtotal)}</span>
        </div>
        ${item.options ? `
          <div style="font-size: 12px; color: #666; padding-left: 10px;">
            ${Object.entries(item.options)
                    .filter(([_, value]) => value && (Array.isArray(value) ? value.length > 0 : true))
                    .map(([key, value]) => {
                        if (key === 'toppings' && Array.isArray(value)) return `토핑: ${value.join(', ')}`;
                        if (key === 'noodle') return `면: ${value}`;
                        if (key === 'spicy') return `맵기: ${value}`;
                        return `${key}: ${value}`;
                    })
                    .join('<br/>')}
          </div>
        ` : ''}
      </li>
    `)
        .join('');

    const total = formatPrice(order.finalAmount);
    const delivery = order.deliveryType === 'delivery' ? '배달' : '포장';

    // Payment method label mapping
    const paymentMethodLabels: Record<string, string> = {
        app_card: '앱 결제',
        meet_card: '만나서 카드',
        meet_cash: '만나서 현금',
        card: '카드',
        transfer: '계좌이체',
        easy_pay: '간편결제',
        on_site: '만나서결제',
    };

    const payment = paymentMethodLabels[order.payment.method] || order.payment.method;

    // Handle createdAt which might be a Firestore Timestamp or string
    let createdDate: Date;
    if (typeof order.createdAt === 'string') {
        createdDate = new Date(order.createdAt);
    } else if (order.createdAt && typeof (order.createdAt as any).toDate === 'function') {
        createdDate = (order.createdAt as any).toDate();
    } else {
        createdDate = new Date();
    }

    const created = createdDate.toLocaleString('ko-KR');

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>영수증 #${orderId}</title>
  <style>
    body { font-family: monospace, sans-serif; font-size: 14px; color: #111; margin: 0; padding: 0; }
    .wrap { width: 280px; margin: 0 auto; padding: 10px; background: #fff; }
    h3 { text-align: center; margin: 8px 0; font-size: 18px; }
    .c { text-align: center; font-size: 12px; margin-bottom: 4px; }
    hr { border: 0; border-top: 1px dashed #000; margin: 8px 0; }
    ul { padding: 0; margin: 0; list-style: none; }
    li { margin-bottom: 6px; }
    .total { text-align: right; font-weight: bold; font-size: 16px; margin-top: 10px; }
    .badge { font-weight: bold; text-align: center; font-size: 20px; margin: 10px 0; border: 2px solid #000; padding: 5px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
    .label { font-weight: bold; }
  </style>
</head>
<body>
  <div class="wrap">
    <h3>${storeInfo.name}</h3>
    <div class="c">${storeInfo.address}<br/>${storeInfo.phone}</div>
    <hr/>
    <div class="badge">${delivery}</div>
    <hr/>
    <div class="row"><span class="label">주문번호:</span> <span>${orderId.slice(-8)}</span></div>
    <div class="row"><span class="label">일시:</span> <span>${created}</span></div>
    <div class="row"><span class="label">결제:</span> <span>${payment}</span></div>
    <hr/>
    <div class="row"><span class="label">주문자:</span> <span>${order.phone}</span></div>
    ${order.deliveryAddress ? `<div class="row"><span class="label">주소:</span> <span style="text-align:right; max-width: 200px;">${order.deliveryAddress.address} ${order.deliveryAddress.detail}</span></div>` : ''}
    ${order.requests ? `<div class="row"><span class="label">요청:</span> <span style="text-align:right; max-width: 200px;">${order.requests}</span></div>` : ''}
    <hr/>
    <ul>${items}</ul>
    <hr/>
    <div class="total">합계: ${total}</div>
    <div class="c" style="margin-top:20px;">* 감사합니다! *</div>
  </div>
  <script>
    setTimeout(function() {
      window.print();
      // Optional: Close window after print (commented out for debugging)
      // setTimeout(function() { window.close(); }, 500);
    }, 500);
  </script>
</body>
</html>`;

    const w = window.open('', '_blank', 'width=360,height=600');
    if (!w) {
        alert('팝업이 차단되었습니다. 브라우저에서 팝업 허용 후 다시 시도해 주세요.');
        return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    // w.focus(); // Some browsers block focus calls
}

```

---
