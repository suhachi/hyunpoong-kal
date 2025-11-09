# Phase 2-1: 장바구니 및 결제 플로우

## 🎯 목표

장바구니 관리와 NICEPAY 결제 연동을 포함한 완전한 주문 플로우를 구축합니다.

---

## 📋 PRD (Product Requirements Document)

### 1. 장바구니 Context (CartContext.tsx)

```typescript
interface CartItem {
  id: string;                  // 고유 ID (menu.id + 옵션 조합)
  menuId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedOptions: Array<{
    groupId: string;
    groupName: string;
    optionId: string;
    optionName: string;
    price: number;
  }>;
  totalPrice: number;          // (기본가 + 옵션가) × 수량
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;           // 총 아이템 수
  totalAmount: number;         // 총 금액
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}
```

**요구사항:**
- localStorage에 자동 저장
- 페이지 새로고침 시에도 유지
- 중복 아이템 체크 (같은 메뉴 + 같은 옵션 조합)

---

### 2. 장바구니 페이지 (Cart.tsx)

#### 2.1 UI 구조
```
┌─────────────────────────┐
│  장바구니 (3)            │
├─────────────────────────┤
│ [메뉴 이미지]            │
│ 현풍닭칼국수             │
│ - 보통맛                │
│ - 계란 추가 +1,000원    │
│ 10,000원                │
│ [-] 2 [+]    [삭제]     │
├─────────────────────────┤
│ [메뉴 이미지]            │
│ 수제만두                │
│ 6,000원                 │
│ [-] 1 [+]    [삭제]     │
├─────────────────────────┤
│ 총 상품 금액: 26,000원  │
│ 배달비: 3,000원         │
│ ─────────────────       │
│ 결제 금액: 29,000원     │
│                         │
│ [주문하기]               │
└─────────────────────────┘
```

#### 2.2 기능
- 수량 변경 (즉시 반영)
- 아이템 삭제
- 전체 삭제
- 배달비 계산 (후술)
- "주문하기" → Checkout 페이지 이동

#### 2.3 빈 장바구니
```typescript
<EmptyState
  icon={<ShoppingCart size={64} />}
  title="장바구니가 비어있습니다"
  description="맛있는 메뉴를 담아보세요"
  action={{
    text: "메뉴 보러가기",
    href: "/menu"
  }}
/>
```

---

### 3. 주문서 작성 페이지 (Checkout.tsx)

#### 3.1 UI 구조
```
┌─────────────────────────┐
│  주문하기                │
├─────────────────────────┤
│ [주문 정보]              │
│ 주문자명: [입력]         │
│ 전화번호: [입력]         │
│                         │
│ [배송 정보]              │
│ 배송지: [주소 검색]      │
│ 상세주소: [입력]         │
│ 요청사항: [선택]         │
│                         │
│ [주문 메뉴]              │
│ 현풍닭칼국수 x2         │
│ 수제만두 x1             │
│                         │
│ [쿠폰]                   │
│ [쿠폰 선택] ➤           │
│ 할인: -2,000원          │
│                         │
│ [포인트]                 │
│ [사용 가능: 5,000P]      │
│ 사용: [입력] P          │
│                         │
│ [결제 수단]              │
│ ○ 신용카드              │
│ ○ 계좌이체              │
│ ○ 간편결제              │
│                         │
│ [결제 금액]              │
│ 상품 금액: 26,000원     │
│ 배달비: +3,000원        │
│ 쿠폰 할인: -2,000원     │
│ 포인트 사용: -1,000원   │
│ ─────────────────       │
│ 최종 결제: 26,000원     │
│                         │
│ [결제하기]               │
└─────────────────────────┘
```

#### 3.2 주문자 정보
```typescript
interface OrderInfo {
  name: string;
  phone: string;
  email?: string;
}

// Validation (react-hook-form + zod)
const orderInfoSchema = z.object({
  name: z.string().min(2, '이름을 입력해주세요'),
  phone: z.string().regex(/^010-?\d{4}-?\d{4}$/, '올바른 전화번호를 입력해주세요'),
  email: z.string().email().optional(),
});
```

#### 3.3 배송지 정보
```typescript
interface DeliveryAddress {
  address: string;             // 기본 주소 (카카오맵 API)
  detailAddress: string;       // 상세 주소
  postcode: string;            // 우편번호
  lat: number;                 // 위도
  lng: number;                 // 경도
  distance: number;            // 가게로부터 거리 (km)
}

interface DeliveryRequest {
  type: 'door' | 'call' | 'direct';  // 문앞, 전화, 직접전달
  message?: string;            // 추가 요청사항
}
```

**주소 검색 버튼:**
- 다음 주소 API (Daum Postcode) 사용
- 선택 후 상세주소 입력 필드 활성화
- 가게로부터 거리 자동 계산 (Haversine formula)

#### 3.4 배달비 계산 로직
```typescript
interface DeliveryFeeRules {
  baseDistance: number;        // 2km
  baseFee: number;            // 3,000원
  extraPerKm: number;         // 500원/km
  freeOrderMin: number;       // 30,000원 이상 무료
  minOrderAmount: number;     // 최소 주문 12,000원
  maxDistance: number;        // 최대 5km
}

function calculateDeliveryFee(
  distance: number,
  orderAmount: number,
  rules: DeliveryFeeRules
): { fee: number; isFree: boolean; message: string } {
  // 1. 거리 초과 체크
  if (distance > rules.maxDistance) {
    return { fee: 0, isFree: false, message: '배달 가능 거리를 초과했습니다' };
  }
  
  // 2. 최소 주문 금액 체크
  if (orderAmount < rules.minOrderAmount) {
    return { 
      fee: 0, 
      isFree: false, 
      message: `최소 주문 금액은 ${rules.minOrderAmount.toLocaleString()}원입니다` 
    };
  }
  
  // 3. 무료 배달 체크
  if (orderAmount >= rules.freeOrderMin) {
    return { fee: 0, isFree: true, message: '무료 배달' };
  }
  
  // 4. 배달비 계산
  let fee = rules.baseFee;
  if (distance > rules.baseDistance) {
    const extraKm = distance - rules.baseDistance;
    fee += Math.ceil(extraKm) * rules.extraPerKm;
  }
  
  return { fee, isFree: false, message: `배달비 ${fee.toLocaleString()}원` };
}
```

#### 3.5 쿠폰/포인트
- 쿠폰 선택 모달 (사용 가능한 쿠폰 목록)
- 포인트 입력 (최소 1,000P 단위)
- 포인트 최대 사용 (결제 금액의 50%)

---

### 4. NICEPAY 결제 연동

#### 4.1 lib/nicepay.ts
```typescript
interface NicepayConfig {
  mid: string;                 // 가맹점 ID
  clientKey: string;           // 클라이언트 키
}

interface PaymentRequest {
  orderId: string;             // 주문 ID
  amount: number;              // 결제 금액
  goodsName: string;           // 상품명
  buyerName: string;           // 구매자명
  buyerTel: string;            // 구매자 전화번호
  buyerEmail?: string;         // 구매자 이메일
  returnUrl: string;           // 결제 완료 URL
}

interface PaymentResponse {
  success: boolean;
  tid: string;                 // 거래 ID
  orderId: string;
  amount: number;
  payMethod: string;           // 결제 수단
  cardName?: string;           // 카드사명
  cardNo?: string;             // 카드번호 (마스킹)
  approveNo?: string;          // 승인번호
  approveDate: string;         // 승인일시
}

export async function requestPayment(
  config: NicepayConfig,
  request: PaymentRequest
): Promise<PaymentResponse> {
  // NICEPAY SDK 사용
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !(window as any).AUTHNICE) {
      reject(new Error('NICEPAY SDK not loaded'));
      return;
    }
    
    (window as any).AUTHNICE.requestPay({
      clientId: config.clientKey,
      method: 'card',
      orderId: request.orderId,
      amount: request.amount,
      goodsName: request.goodsName,
      buyerName: request.buyerName,
      buyerTel: request.buyerTel,
      buyerEmail: request.buyerEmail,
      returnUrl: request.returnUrl,
      fnError: (error: any) => {
        reject(new Error(error.errorMsg || '결제 실패'));
      },
    }, (response: any) => {
      if (response.resultCode === '0000') {
        resolve({
          success: true,
          tid: response.tid,
          orderId: response.orderId,
          amount: response.amount,
          payMethod: response.payMethod,
          cardName: response.cardName,
          cardNo: response.cardNo,
          approveNo: response.approveNo,
          approveDate: response.approveDate,
        });
      } else {
        reject(new Error(response.resultMsg || '결제 실패'));
      }
    });
  });
}
```

#### 4.2 결제 플로우
```typescript
// Checkout.tsx
const handlePayment = async () => {
  try {
    // 1. 주문 정보 검증
    if (!orderInfo || !deliveryAddress) {
      toast.error('주문 정보를 입력해주세요');
      return;
    }
    
    // 2. 주문 생성 (pending 상태)
    const order = await createOrder({
      userId: user.uid,
      items: cartItems,
      orderInfo,
      deliveryAddress,
      deliveryFee,
      couponDiscount,
      pointsUsed,
      totalAmount,
    });
    
    // 3. NICEPAY 결제 요청
    const paymentResult = await requestPayment(NICEPAY_CONFIG, {
      orderId: order.id,
      amount: totalAmount,
      goodsName: `${cartItems[0].name} 외 ${cartItems.length - 1}건`,
      buyerName: orderInfo.name,
      buyerTel: orderInfo.phone,
      buyerEmail: orderInfo.email,
      returnUrl: `${window.location.origin}/orders/${order.id}`,
    });
    
    // 4. 결제 검증 (Cloud Functions)
    await verifyPayment(order.id, paymentResult.tid);
    
    // 5. 주문 상태 업데이트 (paid)
    await updateOrderStatus(order.id, 'paid');
    
    // 6. 장바구니 비우기
    clearCart();
    
    // 7. 성공 페이지 이동
    toast.success('결제가 완료되었습니다!');
    navigate(`/orders/${order.id}`);
    
  } catch (error) {
    console.error('Payment failed:', error);
    toast.error('결제에 실패했습니다. 다시 시도해주세요.');
  }
};
```

---

### 5. Firebase Functions (결제 검증)

#### 5.1 functions/src/orders.ts
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { verifyNicepayTransaction } from './lib/nicepay';

export const verifyPayment = functions.https.onCall(async (data, context) => {
  // 인증 체크
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '로그인이 필요합니다');
  }
  
  const { orderId, tid } = data;
  
  try {
    // 1. 주문 정보 가져오기
    const orderRef = admin.firestore().collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();
    
    if (!orderSnap.exists) {
      throw new functions.https.HttpsError('not-found', '주문을 찾을 수 없습니다');
    }
    
    const order = orderSnap.data();
    
    // 2. 본인 주문인지 확인
    if (order.userId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', '권한이 없습니다');
    }
    
    // 3. NICEPAY 거래 검증 (서버 비밀키 사용)
    const secretKey = functions.config().nicepay.secret_key;
    const verification = await verifyNicepayTransaction(tid, secretKey);
    
    // 4. 금액 일치 확인
    if (verification.amount !== order.totalAmount) {
      throw new functions.https.HttpsError('invalid-argument', '결제 금액이 일치하지 않습니다');
    }
    
    // 5. 주문 상태 업데이트
    await orderRef.update({
      status: 'paid',
      payment: {
        tid,
        method: verification.payMethod,
        approveNo: verification.approveNo,
        approveDate: verification.approveDate,
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // 6. 포인트 적립 (3%)
    const pointsToEarn = Math.floor(order.totalAmount * 0.03);
    await admin.firestore().collection('points').add({
      userId: order.userId,
      orderId,
      amount: pointsToEarn,
      type: 'earn',
      description: `주문 적립 (${order.orderNumber})`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // 7. FCM 알림 (가게 주인에게)
    await sendOrderNotification(orderId, 'new_order');
    
    return { success: true };
    
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw new functions.https.HttpsError('internal', '결제 검증 실패');
  }
});
```

---

## 💬 프롬프트

```
현풍닭칼국수 PWA의 장바구니와 결제 플로우를 구축합니다.

## 작업 내용

### 1. CartContext 구현 (`/contexts/CartContext.tsx`)
- CartItem 타입 정의
- addItem, removeItem, updateQuantity, clearCart 함수
- localStorage 자동 저장/복원
- 중복 아이템 체크 로직

### 2. 장바구니 페이지 (`/pages/app/Cart.tsx`)
- 아이템 목록 표시
- 수량 변경 (즉시 반영)
- 아이템 삭제
- 배달비 표시 (임시로 3,000원 고정)
- 총 금액 계산
- "주문하기" 버튼 → /checkout
- 빈 장바구니 EmptyState

### 3. 주문서 페이지 (`/pages/app/Checkout.tsx`)
- react-hook-form + zod 사용
- 주문자 정보 입력 (이름, 전화번호)
- 배송지 입력 (주소 검색 버튼 - 임시로 modal만 표시)
- 상세주소, 요청사항 입력
- 주문 메뉴 요약
- 쿠폰 선택 (임시로 "사용 가능한 쿠폰 없음")
- 포인트 사용 (임시로 "보유 포인트 0P")
- 결제 수단 선택 (라디오)
- 결제 금액 breakdown
- "결제하기" 버튼 → NICEPAY 연동

### 4. NICEPAY 연동 (`/lib/nicepay.ts`)
- requestPayment 함수 구현
- NICEPAY SDK 스크립트 로드 (`index.html`에 추가)
- Mock 모드 지원 (USE_FIREBASE=false일 때 가짜 성공 응답)

### 5. Firebase Functions (`/functions/src/orders.ts`)
- verifyPayment Function 구현
- NICEPAY 거래 검증 로직
- 주문 상태 업데이트
- 포인트 적립 (3%)
- FCM 알림 (임시로 console.log)

### 6. 컴포넌트
- `/components/app/CheckoutSummary.tsx` - 결제 금액 요약
- `/components/app/DeliveryFeeBreakdown.tsx` - 배달비 상세

### 7. 타입 정의
- `/types/cart.ts` - CartItem, CartContextType
- `/types/order.ts` - Order, OrderInfo, DeliveryAddress
- `/types/payment.ts` - PaymentRequest, PaymentResponse

## 구현 원칙
1. ✅ 100% 완성된 UI
2. ✅ 폼 유효성 검사 (zod)
3. ✅ 로딩 상태 처리
4. ✅ 에러 처리 (toast)
5. ✅ Mock 모드 지원
6. ✅ 결제 보안 (서버 검증)

모든 파일을 완전히 구현해주세요.
```

---

## ✅ 검증 체크리스트

- [ ] CartContext가 localStorage와 동기화되는가?
- [ ] 장바구니에서 수량 변경이 즉시 반영되는가?
- [ ] 주문서 폼 유효성 검사가 작동하는가?
- [ ] 배달비가 올바르게 계산되는가?
- [ ] NICEPAY 결제 팝업이 열리는가?
- [ ] 결제 성공 시 주문 상태가 업데이트되는가?
- [ ] Cloud Functions 결제 검증이 작동하는가?
- [ ] 결제 완료 후 장바구니가 비워지는가?

---

## 📌 다음 단계

**06-order-tracking.md** - 주문 추적 및 히스토리

---

**작성일**: 2025-10-31  
**개발사**: KS컴퍼니
