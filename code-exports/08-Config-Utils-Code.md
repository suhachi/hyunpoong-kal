# Config & Utils - Full Source Code

**Generated**: 2025-11-23-2022  
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

// Google Maps API
// VITE_GOOGLE_MAP_API_KEY 환경 변수를 읽어서 사용
export const GOOGLE_MAP_API_KEY = getEnv('VITE_GOOGLE_MAP_API_KEY', '');

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
};

// 배달 대행사 Provider A 설정
export const PROVIDER_A_CONFIG = {
  apiUrl: getEnv('VITE_PROVIDER_A_API_URL', 'https://api.provider-a.example.com'),
  apiKey: getEnv('VITE_PROVIDER_A_API_KEY', 'YOUR_API_KEY_HERE'),
  merchantId: getEnv('VITE_PROVIDER_A_MERCHANT_ID', 'YOUR_MERCHANT_ID'),
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
      strictPort: true, // 테스트 환경에서 포트 충돌 시 명확히 실패하도록 고정
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
            "@axe-core/playwright": "*",
            "@google-cloud/storage": "*",
            "@playwright/test": "^1.56.1",
            "@radix-ui/react-accordion": "*",
            "@radix-ui/react-alert-dialog": "*",
            "@radix-ui/react-aspect-ratio": "*",
            "@radix-ui/react-avatar": "*",
            "@radix-ui/react-checkbox": "*",
            "@radix-ui/react-collapsible": "*",
            "@radix-ui/react-context-menu": "*",
            "@radix-ui/react-dialog": "*",
            "@radix-ui/react-dropdown-menu": "*",
            "@radix-ui/react-hover-card": "*",
            "@radix-ui/react-label": "*",
            "@radix-ui/react-menubar": "*",
            "@radix-ui/react-navigation-menu": "*",
            "@radix-ui/react-popover": "*",
            "@radix-ui/react-progress": "*",
            "@radix-ui/react-radio-group": "*",
            "@radix-ui/react-scroll-area": "*",
            "@radix-ui/react-select": "*",
            "@radix-ui/react-separator": "*",
            "@radix-ui/react-slider": "*",
            "@radix-ui/react-slot": "*",
            "@radix-ui/react-switch": "*",
            "@radix-ui/react-tabs": "*",
            "@radix-ui/react-toggle": "*",
            "@radix-ui/react-toggle-group": "*",
            "@radix-ui/react-tooltip": "*",
            "@vitejs/plugin-react": "*",
            "class-variance-authority": "*",
            "clsx": "*",
            "cmdk": "*",
            "components": "*",
            "embla-carousel-react": "*",
            "firebase": "*",
            "firebase-admin": "*",
            "firebase-functions": "*",
            "input-otp": "*",
            "lucide-react": "^0.487.0",
            "motion": "*",
            "node-fetch": "*",
            "pages": "*",
            "path": "*",
            "pdfkit": "*",
            "playwright": "^1.56.1",
            "qrcode.react": "^4.2.0",
            "react": "^18.3.1",
            "react-day-picker": "*",
            "react-dom": "^18.3.1",
            "react-hook-form": "^7.55.0",
            "react-resizable-panels": "*",
            "react-router-dom": "*",
            "recharts": "*",
            "sonner": "^2.0.3",
            "tailwind-merge": "*",
            "vaul": "*"
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
