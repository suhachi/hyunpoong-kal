# 💳 결제사 선택 시스템 - 완벽 가이드

> **나이스페이 / 토스페이먼츠 중 점주가 선택하는 유연한 결제 시스템**

---

## 📋 목차

1. [개요](#1-개요)
2. [결제사 비교](#2-결제사-비교)
3. [시스템 아키텍처](#3-시스템-아키텍처)
4. [구현 가이드](#4-구현-가이드)
5. [Cursor AI 프롬프트](#5-cursor-ai-프롬프트)
6. [설정 방법](#6-설정-방법)
7. [테스트](#7-테스트)

---

## 1. 개요

### 1.1 왜 두 가지 결제사를 지원하나요?

```
✅ 점주의 선택권 확대
   - 기존 나이스페이 계약이 있는 점주
   - 토스페이먼츠를 선호하는 점주

✅ 수수료 경쟁력
   - 나이스페이: 전통적, 안정적
   - 토스페이먼츠: 경쟁력 있는 수수료

✅ 개발자 경험
   - 나이스페이: 검증된 API
   - 토스페이먼츠: 최신 API, 문서화 우수

✅ 백업 옵션
   - 한 결제사에 장애 발생 시 다른 것으로 전환
```

### 1.2 구현 방식

```typescript
// Payment Provider 패턴 사용
interface PaymentProvider {
  initialize(): Promise<void>;
  requestPayment(params: PaymentParams): Promise<PaymentResult>;
  verifyPayment(orderId: string): Promise<boolean>;
}

// 구현체
class NicePayProvider implements PaymentProvider { ... }
class TossPaymentsProvider implements PaymentProvider { ... }

// 선택된 제공자 사용
const provider = getPaymentProvider(); // 설정에 따라 선택
await provider.requestPayment(params);
```

---

## 2. 결제사 비교

### 2.1 나이스페이 (NICEPAY)

```
장점:
✅ 오랜 역사와 안정성
✅ 다양한 결제 수단
✅ 금융권 신뢰도 높음
✅ 대량 거래 처리 경험

단점:
❌ API 문서화가 다소 복잡
❌ 개발자 친화적이지 않음
❌ 수수료가 다소 높을 수 있음

특징:
- 설립: 1998년
- 점유율: 높음
- 대상: 중대형 가맹점
```

### 2.2 토스페이먼츠 (Toss Payments)

```
장점:
✅ 최신 API, RESTful
✅ 뛰어난 개발자 문서
✅ 경쟁력 있는 수수료
✅ 빠른 정산
✅ 실시간 대시보드

단점:
❌ 역사가 짧음 (2021년)
❌ 일부 금융권에서 인지도 낮음

특징:
- 설립: 2021년
- 성장: 빠름
- 대상: 스타트업, 중소형 가맹점
```

### 2.3 수수료 비교 (2024년 기준)

```
나이스페이:
- 신용카드: 3.3% ~ 3.5%
- 계좌이체: 1.0% ~ 1.5%
- 간편결제: 3.0% ~ 3.3%

토스페이먼츠:
- 신용카드: 3.2% (정액)
- 계좌이체: 0.9% ~ 1.2%
- 토스페이: 2.5%

⚠️ 실제 수수료는 협상에 따라 달라질 수 있습니다.
```

---

## 3. 시스템 아키텍처

### 3.1 폴더 구조

```
/lib/
  ├── payment/
  │   ├── index.ts              # Payment Provider 선택 로직
  │   ├── types.ts              # 공통 타입 정의
  │   ├── providers/
  │   │   ├── nicepay.ts        # 나이스페이 구현
  │   │   ├── toss.ts           # 토스페이먼츠 구현
  │   │   └── mock.ts           # Mock (개발용)
  │   └── utils/
  │       ├── validation.ts     # 결제 검증
  │       └── formatting.ts     # 데이터 포맷팅
  ├── nicepay.ts                # [기존] 나중에 deprecate
  └── ...

/types/
  └── payment.ts                # 결제 관련 타입 (확장)

/pages/admin/Settings/
  └── PaymentTab.tsx            # 결제 설정 UI (업데이트)

/config/
  └── env.ts                    # 환경변수 (토스페이먼츠 추가)
```

### 3.2 데이터 흐름

```
1. 점주가 관리자 페이지에서 결제사 선택
   ↓
2. Firestore settings/payment에 저장
   {
     provider: 'nicepay' | 'toss',
     nicepay: { mid, key },
     toss: { clientKey, secretKey }
   }
   ↓
3. 고객이 결제 시도
   ↓
4. getPaymentProvider()가 설정 읽기
   ↓
5. 선택된 Provider 인스턴스 반환
   ↓
6. provider.requestPayment() 호출
   ↓
7. 결제 완료
```

---

## 4. 구현 가이드

### 4.1 타입 정의

**파일: `/types/payment.ts` (확장)**

```typescript
// 기존 타입에 추가

export type PaymentProvider = 'nicepay' | 'toss' | 'mock';

export interface PaymentProviderConfig {
  provider: PaymentProvider;
  nicepay?: {
    mid: string;
    merchantKey: string;
  };
  toss?: {
    clientKey: string;
    secretKey: string;
  };
}

export interface PaymentParams {
  orderId: string;
  amount: number;
  orderName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  successUrl: string;
  failUrl: string;
}

export interface PaymentResult {
  success: boolean;
  paymentKey?: string;
  orderId: string;
  amount: number;
  message?: string;
  errorCode?: string;
}

export interface IPaymentProvider {
  initialize(): Promise<void>;
  requestPayment(params: PaymentParams): Promise<PaymentResult>;
  verifyPayment(orderId: string, paymentKey: string): Promise<boolean>;
  cancelPayment(paymentKey: string, reason: string): Promise<boolean>;
}
```

### 4.2 공통 인터페이스

**파일: `/lib/payment/types.ts` (신규)**

```typescript
export * from '../../types/payment';

// Provider별 고유 설정
export interface NicePayConfig {
  mid: string;
  merchantKey: string;
  mode: 'test' | 'production';
}

export interface TossConfig {
  clientKey: string;
  secretKey: string;
  mode: 'test' | 'production';
}
```

### 4.3 나이스페이 Provider

**파일: `/lib/payment/providers/nicepay.ts` (신규)**

```typescript
import type { IPaymentProvider, PaymentParams, PaymentResult } from '../types';

export class NicePayProvider implements IPaymentProvider {
  private config: {
    mid: string;
    merchantKey: string;
    mode: 'test' | 'production';
  };

  constructor(config: { mid: string; merchantKey: string; mode?: 'test' | 'production' }) {
    this.config = {
      ...config,
      mode: config.mode || 'production',
    };
  }

  async initialize(): Promise<void> {
    // 나이스페이 SDK 로드
    if (typeof window === 'undefined') return;
    
    const script = document.createElement('script');
    script.src = 'https://pay.nicepay.co.kr/v1/js/';
    script.async = true;
    
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    
    console.log('[NicePay] SDK 로드 완료');
  }

  async requestPayment(params: PaymentParams): Promise<PaymentResult> {
    try {
      // 나이스페이 결제 요청
      const result = await this.callNicePayAPI({
        MID: this.config.mid,
        Amt: params.amount,
        GoodsName: params.orderName,
        BuyerName: params.customerName,
        BuyerEmail: params.customerEmail,
        BuyerTel: params.customerPhone,
        Moid: params.orderId,
        ReturnURL: params.successUrl,
        // ... 나이스페이 필수 파라미터
      });

      return {
        success: result.ResultCode === '0000',
        paymentKey: result.TID,
        orderId: params.orderId,
        amount: params.amount,
        message: result.ResultMsg,
      };
    } catch (error) {
      console.error('[NicePay] 결제 요청 실패:', error);
      return {
        success: false,
        orderId: params.orderId,
        amount: params.amount,
        message: '결제 요청에 실패했습니다.',
      };
    }
  }

  async verifyPayment(orderId: string, paymentKey: string): Promise<boolean> {
    try {
      // 나이스페이 결제 검증
      const response = await fetch('/api/verify-nicepay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, tid: paymentKey }),
      });

      const result = await response.json();
      return result.verified === true;
    } catch (error) {
      console.error('[NicePay] 결제 검증 실패:', error);
      return false;
    }
  }

  async cancelPayment(paymentKey: string, reason: string): Promise<boolean> {
    try {
      // 나이스페이 결제 취소
      const response = await fetch('/api/cancel-nicepay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tid: paymentKey, reason }),
      });

      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('[NicePay] 결제 취소 실패:', error);
      return false;
    }
  }

  private async callNicePayAPI(params: any): Promise<any> {
    // 나이스페이 API 호출 로직
    // 실제 구현 필요
    return new Promise((resolve) => {
      // @ts-ignore
      if (window.NICEPAY) {
        // @ts-ignore
        window.NICEPAY.requestPay(params, resolve);
      }
    });
  }
}
```

### 4.4 토스페이먼츠 Provider

**파일: `/lib/payment/providers/toss.ts` (신규)**

```typescript
import type { IPaymentProvider, PaymentParams, PaymentResult } from '../types';

export class TossPaymentsProvider implements IPaymentProvider {
  private config: {
    clientKey: string;
    secretKey: string;
    mode: 'test' | 'production';
  };
  private tossPayments: any;

  constructor(config: { clientKey: string; secretKey: string; mode?: 'test' | 'production' }) {
    this.config = {
      ...config,
      mode: config.mode || 'production',
    };
  }

  async initialize(): Promise<void> {
    // 토스페이먼츠 SDK 로드
    if (typeof window === 'undefined') return;
    
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.async = true;
    
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    // @ts-ignore
    this.tossPayments = window.TossPayments(this.config.clientKey);
    
    console.log('[TossPayments] SDK 로드 완료');
  }

  async requestPayment(params: PaymentParams): Promise<PaymentResult> {
    try {
      if (!this.tossPayments) {
        throw new Error('토스페이먼츠 SDK가 초기화되지 않았습니다.');
      }

      // 토스페이먼츠 결제 요청
      await this.tossPayments.requestPayment('카드', {
        amount: params.amount,
        orderId: params.orderId,
        orderName: params.orderName,
        customerName: params.customerName,
        customerEmail: params.customerEmail,
        customerMobilePhone: params.customerPhone,
        successUrl: params.successUrl,
        failUrl: params.failUrl,
      });

      // successUrl로 리다이렉트되므로 여기는 도달하지 않음
      return {
        success: true,
        orderId: params.orderId,
        amount: params.amount,
      };
    } catch (error: any) {
      console.error('[TossPayments] 결제 요청 실패:', error);
      return {
        success: false,
        orderId: params.orderId,
        amount: params.amount,
        message: error.message || '결제 요청에 실패했습니다.',
        errorCode: error.code,
      };
    }
  }

  async verifyPayment(orderId: string, paymentKey: string): Promise<boolean> {
    try {
      // 토스페이먼츠 결제 승인 (서버에서 수행)
      const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(this.config.secretKey + ':')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: 0, // 실제 금액은 서버에서 조회
        }),
      });

      const result = await response.json();
      return result.status === 'DONE';
    } catch (error) {
      console.error('[TossPayments] 결제 검증 실패:', error);
      return false;
    }
  }

  async cancelPayment(paymentKey: string, reason: string): Promise<boolean> {
    try {
      // 토스페이먼츠 결제 취소
      const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(this.config.secretKey + ':')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cancelReason: reason,
        }),
      });

      const result = await response.json();
      return result.status === 'CANCELED';
    } catch (error) {
      console.error('[TossPayments] 결제 취소 실패:', error);
      return false;
    }
  }
}
```

### 4.5 Mock Provider (개발용)

**파일: `/lib/payment/providers/mock.ts` (신규)**

```typescript
import type { IPaymentProvider, PaymentParams, PaymentResult } from '../types';

export class MockPaymentProvider implements IPaymentProvider {
  async initialize(): Promise<void> {
    console.log('[MockPayment] 초기화 완료 (개발 모드)');
  }

  async requestPayment(params: PaymentParams): Promise<PaymentResult> {
    console.log('[MockPayment] 결제 요청:', params);
    
    // 2초 지연 (실제 결제 시뮬레이션)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      paymentKey: `mock_${Date.now()}`,
      orderId: params.orderId,
      amount: params.amount,
      message: 'Mock 결제 성공',
    };
  }

  async verifyPayment(orderId: string, paymentKey: string): Promise<boolean> {
    console.log('[MockPayment] 결제 검증:', { orderId, paymentKey });
    return true;
  }

  async cancelPayment(paymentKey: string, reason: string): Promise<boolean> {
    console.log('[MockPayment] 결제 취소:', { paymentKey, reason });
    return true;
  }
}
```

### 4.6 Provider 팩토리

**파일: `/lib/payment/index.ts` (신규)**

```typescript
import type { IPaymentProvider, PaymentProvider, PaymentProviderConfig } from './types';
import { NicePayProvider } from './providers/nicepay';
import { TossPaymentsProvider } from './providers/toss';
import { MockPaymentProvider } from './providers/mock';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

let cachedProvider: IPaymentProvider | null = null;
let cachedConfig: PaymentProviderConfig | null = null;

/**
 * 설정에 따라 적절한 결제 Provider를 반환합니다.
 */
export async function getPaymentProvider(): Promise<IPaymentProvider> {
  // 캐시된 Provider 반환
  if (cachedProvider) {
    return cachedProvider;
  }

  // Firestore에서 설정 읽기
  const config = await getPaymentConfig();
  
  // Provider 생성
  cachedProvider = createProvider(config);
  cachedConfig = config;
  
  // 초기화
  await cachedProvider.initialize();
  
  return cachedProvider;
}

/**
 * Firestore에서 결제 설정을 읽습니다.
 */
async function getPaymentConfig(): Promise<PaymentProviderConfig> {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'payment'));
    
    if (!settingsDoc.exists()) {
      console.warn('[Payment] 설정이 없습니다. Mock 모드 사용');
      return {
        provider: 'mock',
      };
    }
    
    return settingsDoc.data() as PaymentProviderConfig;
  } catch (error) {
    console.error('[Payment] 설정 읽기 실패:', error);
    return {
      provider: 'mock',
    };
  }
}

/**
 * 설정에 따라 Provider 인스턴스를 생성합니다.
 */
function createProvider(config: PaymentProviderConfig): IPaymentProvider {
  switch (config.provider) {
    case 'nicepay':
      if (!config.nicepay) {
        throw new Error('나이스페이 설정이 없습니다.');
      }
      return new NicePayProvider({
        mid: config.nicepay.mid,
        merchantKey: config.nicepay.merchantKey,
      });
      
    case 'toss':
      if (!config.toss) {
        throw new Error('토스페이먼츠 설정이 없습니다.');
      }
      return new TossPaymentsProvider({
        clientKey: config.toss.clientKey,
        secretKey: config.toss.secretKey,
      });
      
    case 'mock':
    default:
      return new MockPaymentProvider();
  }
}

/**
 * 캐시된 Provider를 초기화합니다. (설정 변경 시 호출)
 */
export function resetPaymentProvider(): void {
  cachedProvider = null;
  cachedConfig = null;
}

/**
 * 현재 사용 중인 Provider를 반환합니다.
 */
export function getCurrentProvider(): PaymentProvider {
  return cachedConfig?.provider || 'mock';
}
```

---

## 5. Cursor AI 프롬프트

### Step 21: 결제사 선택 시스템 구축

**Cursor AI에게 제공할 프롬프트:**

```
결제사 선택 시스템을 구축해줘. (나이스페이 / 토스페이먼츠)

=== 작업 1: 타입 정의 ===

types/payment.ts에 다음 타입 추가:

```typescript
export type PaymentProvider = 'nicepay' | 'toss' | 'mock';

export interface PaymentProviderConfig {
  provider: PaymentProvider;
  nicepay?: {
    mid: string;
    merchantKey: string;
  };
  toss?: {
    clientKey: string;
    secretKey: string;
  };
}

export interface PaymentParams {
  orderId: string;
  amount: number;
  orderName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  successUrl: string;
  failUrl: string;
}

export interface PaymentResult {
  success: boolean;
  paymentKey?: string;
  orderId: string;
  amount: number;
  message?: string;
  errorCode?: string;
}

export interface IPaymentProvider {
  initialize(): Promise<void>;
  requestPayment(params: PaymentParams): Promise<PaymentResult>;
  verifyPayment(orderId: string, paymentKey: string): Promise<boolean>;
  cancelPayment(paymentKey: string, reason: string): Promise<boolean>;
}
```

=== 작업 2: Provider 구현 ===

PAYMENT-PROVIDER-선택-시스템-가이드.md의 4.3, 4.4, 4.5 참고하여:
1. /lib/payment/providers/nicepay.ts 생성
2. /lib/payment/providers/toss.ts 생성
3. /lib/payment/providers/mock.ts 생성

=== 작업 3: Provider 팩토리 ===

/lib/payment/index.ts 생성:
- getPaymentProvider() 함수
- Firestore에서 설정 읽기
- 선택된 Provider 반환

=== 작업 4: 환경변수 추가 ===

config/env.ts에 추가:

```typescript
export const PAYMENT_CONFIG = {
  provider: getEnv('VITE_PAYMENT_PROVIDER', 'mock') as 'nicepay' | 'toss' | 'mock',
  nicepay: {
    mid: getEnv('VITE_NICEPAY_MID'),
    merchantKey: getEnv('VITE_NICEPAY_MERCHANT_KEY'),
  },
  toss: {
    clientKey: getEnv('VITE_TOSS_CLIENT_KEY'),
    secretKey: getEnv('VITE_TOSS_SECRET_KEY'),
  },
};
```

=== 작업 5: 관리자 설정 UI ===

pages/admin/Settings/PaymentTab.tsx 업데이트:

```typescript
- 결제사 선택 라디오 버튼 (나이스페이 / 토스페이먼츠)
- 선택에 따라 필요한 입력 필드 표시
  - 나이스페이: MID, Merchant Key
  - 토스페이먼츠: Client Key, Secret Key
- Firestore settings/payment에 저장
```

=== 작업 6: 결제 페이지 수정 ===

pages/app/Checkout.tsx 수정:

```typescript
import { getPaymentProvider } from '../lib/payment';

// 기존 nicepay 호출 대신
const provider = await getPaymentProvider();
const result = await provider.requestPayment({
  orderId,
  amount,
  orderName,
  customerName,
  ...
});
```

출력 형식:
```
✅ 결제사 선택 시스템 구축 완료

생성 파일:
- /lib/payment/types.ts
- /lib/payment/providers/nicepay.ts
- /lib/payment/providers/toss.ts
- /lib/payment/providers/mock.ts
- /lib/payment/index.ts

수정 파일:
- /types/payment.ts
- /config/env.ts
- /pages/admin/Settings/PaymentTab.tsx
- /pages/app/Checkout.tsx

테스트:
1. 관리자 > 설정 > 결제 탭
2. 결제사 선택 (나이스페이 / 토스페이먼츠)
3. 설정 저장
4. 고객 앱에서 결제 테스트

⏭️ 다음: .env 파일에 토스페이먼츠 설정 추가
```
```

---

## 6. 설정 방법

### 6.1 환경변수 (.env)

```env
# 결제 Provider 선택
VITE_PAYMENT_PROVIDER=toss  # 'nicepay' | 'toss' | 'mock'

# 나이스페이 설정
VITE_NICEPAY_MID=YOUR_NICEPAY_MID
VITE_NICEPAY_MERCHANT_KEY=YOUR_NICEPAY_KEY

# 토스페이먼츠 설정
VITE_TOSS_CLIENT_KEY=test_ck_...
VITE_TOSS_SECRET_KEY=test_sk_...
```

### 6.2 관리자 페이지에서 설정

```
1. 관리자 로그인
2. 설정 > 결제 탭
3. 결제사 선택:
   ○ 나이스페이
   ● 토스페이먼츠
4. 해당 정보 입력:
   - Client Key: test_ck_...
   - Secret Key: test_sk_...
5. "저장" 클릭
6. Firestore settings/payment 문서에 저장됨
```

### 6.3 Firestore 데이터 구조

```javascript
// settings/payment 문서
{
  provider: 'toss',
  nicepay: {
    mid: 'YOUR_MID',
    merchantKey: 'YOUR_KEY'
  },
  toss: {
    clientKey: 'test_ck_...',
    secretKey: 'test_sk_...'
  },
  updatedAt: Timestamp,
  updatedBy: 'admin_uid'
}
```

---

## 7. 테스트

### 7.1 개발 환경 테스트

```
1. Mock 모드 테스트
   - VITE_PAYMENT_PROVIDER=mock
   - 결제 플로우 확인
   - 2초 후 성공

2. 나이스페이 테스트 모드
   - 나이스페이 테스트 계정 발급
   - 테스트 카드로 결제
   - 결제 성공 확인

3. 토스페이먼츠 테스트 모드
   - test_ck_, test_sk_ 키 사용
   - 테스트 카드: 
     - 카드번호: 5570********1234
     - 유효기간: 12/28
     - CVC: 123
   - 결제 성공 확인
```

### 7.2 결제사 전환 테스트

```
1. 나이스페이로 설정
   - 관리자 > 설정 > 결제 > 나이스페이 선택
   - 저장
   - 고객 앱에서 결제
   - 나이스페이 결제창 확인

2. 토스페이먼츠로 전환
   - 관리자 > 설정 > 결제 > 토스페이먼츠 선택
   - 저장
   - 고객 앱에서 결제
   - 토스페이먼츠 결제창 확인

3. 전환 중 주문 처리
   - 나이스페이로 진행 중인 주문
   - 토스페이먼츠로 전환
   - 기존 주문 정상 처리 확인
```

### 7.3 에러 시나리오 테스트

```
1. 설정 없음
   - settings/payment 문서 없음
   - Mock 모드로 fallback
   - 결제 가능 확인

2. 잘못된 키
   - 틀린 Client Key 입력
   - 결제 실패 확인
   - 에러 메시지 확인

3. 네트워크 오류
   - 네트워크 차단
   - 타임아웃 처리 확인
   - 재시도 로직 확인
```

---

## 📌 FAQ

### Q1. 두 결제사를 동시에 사용할 수 있나요?

```
A: 아니요. 한 번에 하나의 결제사만 활성화됩니다.
   점주가 관리자 페이지에서 선택한 결제사만 사용됩니다.
```

### Q2. 결제사를 변경하면 기존 주문은 어떻게 되나요?

```
A: 기존 주문 데이터는 그대로 유지됩니다.
   paymentProvider 필드에 어떤 결제사를 사용했는지 저장됩니다.
   
   {
     orderId: 'order-123',
     paymentProvider: 'nicepay',  // 또는 'toss'
     paymentKey: '...',
     ...
   }
```

### Q3. 수수료는 어떻게 다르나요?

```
A: 2024년 기준:
   - 나이스페이: 3.3% ~ 3.5%
   - 토스페이먼츠: 3.2% (정액)
   
   실제 수수료는 계약 시 협상에 따라 달라질 수 있습니다.
```

### Q4. Mock 모드는 언제 사용하나요?

```
A: 개발/테스트 환경에서 사용합니다.
   - 로컬 개발 시
   - 실제 결제 없이 플로우 테스트
   - Firebase 연동 전 Mock 데이터 사용
   
   프로덕션에서는 절대 사용하지 마세요!
```

### Q5. 토스페이먼츠 테스트 카드는?

```
A: 토스페이먼츠 개발자 문서 참조:
   https://docs.tosspayments.com/guides/payment-widget/integration#테스트-카드
   
   예시:
   - 카드번호: 5570********1234
   - 유효기간: 12/28
   - CVC: 123
```

---

## 🔗 참고 문서

```
나이스페이:
- 개발자 센터: https://developer.nicepay.co.kr/
- API 문서: https://developer.nicepay.co.kr/api.php

토스페이먼츠:
- 공식 문서: https://docs.tosspayments.com/
- 결제위젯: https://docs.tosspayments.com/guides/payment-widget/
- 테스트: https://docs.tosspayments.com/reference/test-card

Cursor AI 가이드:
- CURSOR-ATOMIC-프롬프트-완벽가이드.md
- CURSOR-ATOMIC-빠른참조카드.md
```

---

**작성:** KS컴퍼니 (사업자번호 553-17-00098)  
**버전:** 1.0.0  
**최종 수정:** 2024-11-08
