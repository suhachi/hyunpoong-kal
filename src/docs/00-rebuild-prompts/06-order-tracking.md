# Phase 2-2: 주문 추적 및 히스토리

## 🎯 목표

실시간 주문 추적과 주문 히스토리를 구현하여 고객이 주문 상태를 확인할 수 있게 합니다.

---

## 📋 PRD (Product Requirements Document)

### 1. 주문 추적 페이지 (OrderTracking.tsx)

#### 1.1 URL 구조
```
/orders/:orderId
```

#### 1.2 데이터 모델
```typescript
// types/order.ts
export enum OrderStatus {
  PENDING = 'pending',           // 결제 대기
  PAID = 'paid',                // 결제 완료
  CONFIRMED = 'confirmed',      // 가게 접수
  PREPARING = 'preparing',      // 조리 중
  READY = 'ready',              // 조리 완료
  DELIVERING = 'delivering',    // 배달 중
  DELIVERED = 'delivered',      // 배달 완료
  COMPLETED = 'completed',      // 수령 확인
  CANCELLED = 'cancelled',      // 취소
  REFUNDED = 'refunded',        // 환불
}

export interface Order {
  id: string;
  orderNumber: string;          // 주문번호 (예: HP-20251031-0001)
  userId: string;
  status: OrderStatus;
  
  // 주문자 정보
  orderInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  
  // 배송 정보
  deliveryAddress: {
    address: string;
    detailAddress: string;
    postcode: string;
    lat: number;
    lng: number;
    distance: number;
  };
  
  deliveryRequest: {
    type: 'door' | 'call' | 'direct';
    message?: string;
  };
  
  // 주문 아이템
  items: Array<{
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
  }>;
  
  // 금액 정보
  itemsAmount: number;          // 상품 금액
  deliveryFee: number;          // 배달비
  couponDiscount: number;       // 쿠폰 할인
  pointsUsed: number;           // 포인트 사용
  totalAmount: number;          // 최종 결제 금액
  
  // 결제 정보
  payment: {
    tid: string;                // 거래 ID
    method: string;             // 결제 수단
    approveNo?: string;         // 승인번호
    approveDate: string;        // 승인일시
    cardName?: string;          // 카드사
    cardNo?: string;            // 카드번호 (마스킹)
  };
  
  // 배달 정보 (배달 중일 때)
  delivery?: {
    driverId: string;
    driverName: string;
    driverPhone: string;
    currentLat: number;
    currentLng: number;
    estimatedArrival: string;   // ISO 8601
  };
  
  // 타임스탬프
  createdAt: string;            // 주문 생성
  paidAt?: string;              // 결제 완료
  confirmedAt?: string;         // 가게 접수
  preparingAt?: string;         // 조리 시작
  readyAt?: string;             // 조리 완료
  deliveringAt?: string;        // 배달 시작
  deliveredAt?: string;         // 배달 완료
  completedAt?: string;         // 수령 확인
  cancelledAt?: string;         // 취소
  
  // 취소 정보 (취소된 경우)
  cancellation?: {
    reason: string;
    cancelledBy: 'user' | 'store' | 'system';
    refundAmount: number;
    refundDate?: string;
  };
}
```

#### 1.3 UI 구조 (Desktop/Tablet)
```
┌──────────────────────────────────────┐
│  ← 주문 상세                          │
├──────────────────────────────────────┤
│                                      │
│  [주문 상태 Progress Bar]             │
│  ━━●━━●━━●━━○━━○                     │
│  결제  접수  조리  배달  완료          │
│                                      │
│  ┌──────────────┬─────────────────┐  │
│  │              │                 │  │
│  │ [실시간 지도] │  주문 정보       │  │
│  │              │  ---------------│  │
│  │   🏠 우리집  │  주문번호:      │  │
│  │      ↓       │  HP-20251031    │  │
│  │   🚗 배달원  │  -0001          │  │
│  │      ↓       │                 │  │
│  │   🏪 가게    │  예상 도착:     │  │
│  │              │  14:30          │  │
│  │              │                 │  │
│  │              │  배달원:        │  │
│  │              │  홍길동         │  │
│  │              │  010-1234-5678  │  │
│  │              │                 │  │
│  └──────────────┴─────────────────┘  │
│                                      │
│  [주문 메뉴]                          │
│  현풍닭칼국수 x2      20,000원       │
│  - 보통맛                            │
│  - 계란 추가                         │
│                                      │
│  수제만두 x1          6,000원        │
│                                      │
│  [결제 금액]                          │
│  상품 금액           26,000원        │
│  배달비              +3,000원        │
│  쿠폰 할인           -2,000원        │
│  포인트 사용         -1,000원        │
│  ──────────────────────────         │
│  최종 결제           26,000원        │
│                                      │
│  [결제 정보]                          │
│  신용카드 (BC카드)                   │
│  1234-****-****-5678                │
│  승인번호: 12345678                  │
│                                      │
│  [배송 정보]                          │
│  주소: 대구광역시 달서구 ...         │
│  상세주소: 101동 101호               │
│  요청사항: 문 앞에 놓아주세요        │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ [주문 취소]  [문의하기]         │ │
│  └────────────────────────────────┘ │
│                                      │
│  [타임라인]                           │
│  ● 14:00 배달 시작                   │
│  ● 13:45 조리 완료                   │
│  ● 13:30 조리 시작                   │
│  ● 13:25 가게 접수                   │
│  ● 13:20 결제 완료                   │
│                                      │
└──────────────────────────────────────┘
```

#### 1.4 UI 구조 (Mobile)
```
┌─────────────────────────┐
│  ← 주문 상태             │
├─────────────────────────┤
│                         │
│  [Progress Stepper]     │
│   ●━━●━━●━━○━━○         │
│  결제 접수 조리 배달 완료 │
│                         │
│  현재 상태: 배달 중 🚗   │
│  예상 도착: 14:30       │
│                         │
│  ┌───────────────────┐  │
│  │                   │  │
│  │  [지도 - 접힌 상태] │  │
│  │  탭하여 확대       │  │
│  │                   │  │
│  └───────────────────┘  │
│                         │
│  배달원 정보             │
│  홍길동 010-1234-5678   │
│  [전화 걸기]             │
│                         │
│  주문 메뉴               │
│  현풍닭칼국수 x2         │
│  수제만두 x1            │
│  [메뉴 상세 보기 ▼]     │
│                         │
│  결제 금액               │
│  26,000원               │
│  [금액 상세 보기 ▼]     │
│                         │
│  [주문 취소] [문의하기]  │
│                         │
│  타임라인                │
│  ● 14:00 배달 시작      │
│  ● 13:45 조리 완료      │
│  ● 13:30 조리 시작      │
│  [더보기 ▼]             │
│                         │
└─────────────────────────┘
```

#### 1.5 상태별 UI 변화

**1) 결제 완료 (PAID)**
```tsx
<StatusSection status="paid">
  <StatusIcon>
    <CheckCircle className="text-success" />
  </StatusIcon>
  <StatusTitle>결제가 완료되었습니다</StatusTitle>
  <StatusDescription>
    가게에서 주문을 확인하고 있습니다.
  </StatusDescription>
  <EstimatedTime>
    예상 접수 시간: 5분 이내
  </EstimatedTime>
</StatusSection>
```

**2) 조리 중 (PREPARING)**
```tsx
<StatusSection status="preparing">
  <StatusIcon>
    <ChefHat className="text-sinkal-orange animate-pulse" />
  </StatusIcon>
  <StatusTitle>맛있게 조리하고 있습니다</StatusTitle>
  <StatusDescription>
    곧 맛있는 음식이 준비됩니다!
  </StatusDescription>
  <EstimatedTime>
    예상 조리 시간: 15분
  </EstimatedTime>
</StatusSection>
```

**3) 배달 중 (DELIVERING)**
```tsx
<StatusSection status="delivering">
  <StatusIcon>
    <Truck className="text-hyunpung-red animate-bounce" />
  </StatusIcon>
  <StatusTitle>배달 중입니다</StatusTitle>
  <StatusDescription>
    배달원이 고객님께 향하고 있습니다.
  </StatusDescription>
  <EstimatedTime>
    예상 도착: {formatTime(delivery.estimatedArrival)}
  </EstimatedTime>
  
  {/* 실시간 지도 */}
  <DeliveryMap
    storeLat={storeLat}
    storeLng={storeLng}
    deliveryLat={delivery.currentLat}
    deliveryLng={delivery.currentLng}
    destinationLat={order.deliveryAddress.lat}
    destinationLng={order.deliveryAddress.lng}
  />
  
  {/* 배달원 정보 */}
  <DriverInfo>
    <DriverAvatar>{delivery.driverName[0]}</DriverAvatar>
    <DriverName>{delivery.driverName}</DriverName>
    <DriverPhone>{delivery.driverPhone}</DriverPhone>
    <CallButton href={`tel:${delivery.driverPhone}`}>
      <Phone /> 전화 걸기
    </CallButton>
  </DriverInfo>
</StatusSection>
```

**4) 배달 완료 (DELIVERED)**
```tsx
<StatusSection status="delivered">
  <StatusIcon>
    <Package className="text-success" />
  </StatusIcon>
  <StatusTitle>배달이 완료되었습니다</StatusTitle>
  <StatusDescription>
    맛있게 드셨나요?
  </StatusDescription>
  
  <ActionButtons>
    <Button onClick={handleCompleteOrder}>
      수령 확인
    </Button>
    <Button variant="outline" onClick={navigateToReview}>
      리뷰 작성하기
    </Button>
  </ActionButtons>
</StatusSection>
```

#### 1.6 Progress Stepper 컴포넌트
```tsx
// components/shared/OrderProgressStepper.tsx
interface Step {
  status: OrderStatus;
  label: string;
  icon: ReactNode;
}

const steps: Step[] = [
  { status: 'paid', label: '결제', icon: <CreditCard /> },
  { status: 'confirmed', label: '접수', icon: <Check /> },
  { status: 'preparing', label: '조리', icon: <ChefHat /> },
  { status: 'delivering', label: '배달', icon: <Truck /> },
  { status: 'completed', label: '완료', icon: <CheckCircle /> },
];

export function OrderProgressStepper({ currentStatus }: { currentStatus: OrderStatus }) {
  const currentIndex = steps.findIndex(s => s.status === currentStatus);
  
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <React.Fragment key={step.status}>
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                isActive ? "bg-hyunpung-red text-white" : "bg-gray-200 text-gray-400",
                isCurrent && "ring-4 ring-hyunpung-red/20"
              )}>
                {step.icon}
              </div>
              <span className={cn(
                "text-xs mt-2",
                isActive ? "text-gray-900 font-medium" : "text-gray-400"
              )}>
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-1 mx-2",
                index < currentIndex ? "bg-hyunpung-red" : "bg-gray-200"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
```

---

### 2. 주문 히스토리 페이지 (OrderHistory.tsx)

#### 2.1 URL 구조
```
/orders
```

#### 2.2 UI 구조
```
┌─────────────────────────┐
│  주문 내역               │
├─────────────────────────┤
│                         │
│  [필터 탭]               │
│  ● 전체  진행중  완료    │
│                         │
│  ┌─────────────────────┐│
│  │ [주문 카드]          ││
│  │ HP-20251031-0001    ││
│  │ 2025.10.31 13:20   ││
│  │                     ││
│  │ 현풍닭칼국수 외 1건  ││
│  │ 26,000원            ││
│  │                     ││
│  │ [배달 중] 14:30 도착││
│  │ [리뷰 작성]          ││
│  └─────────────────────┘│
│                         │
│  ┌─────────────────────┐│
│  │ HP-20251030-0042    ││
│  │ 2025.10.30 19:45   ││
│  │                     ││
│  │ 얼큰칼국수          ││
│  │ 9,500원             ││
│  │                     ││
│  │ [완료] ⭐⭐⭐⭐⭐      ││
│  └─────────────────────┘│
│                         │
│  [더보기]                │
│                         │
└─────────────────────────┘
```

#### 2.3 OrderCard 컴포넌트
```tsx
// components/shared/OrderCard.tsx
interface OrderCardProps {
  order: Order;
  onClick?: () => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const statusInfo = getOrderStatusInfo(order.status);
  const canReview = order.status === 'completed' && !order.hasReview;
  
  return (
    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono text-sm text-gray-600">{order.orderNumber}</p>
          <p className="text-xs text-gray-400">{formatDateTime(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      
      {/* 메뉴 정보 */}
      <div className="mb-3">
        <p className="font-medium">
          {order.items[0].name}
          {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
        </p>
        <p className="text-lg font-bold text-hyunpung-red">
          {formatPrice(order.totalAmount)}
        </p>
      </div>
      
      {/* 상태별 액션 */}
      {order.status === 'delivering' && order.delivery && (
        <div className="flex items-center gap-2 text-sm">
          <Truck className="w-4 h-4 text-hyunpung-red" />
          <span className="text-gray-600">
            예상 도착: {formatTime(order.delivery.estimatedArrival)}
          </span>
        </div>
      )}
      
      {canReview && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2"
          onClick={(e) => {
            e.stopPropagation();
            navigateToReview(order.id);
          }}
        >
          <Star className="w-4 h-4 mr-2" />
          리뷰 작성하기
        </Button>
      )}
      
      {order.hasReview && (
        <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>리뷰 작성 완료</span>
        </div>
      )}
    </Card>
  );
}
```

#### 2.4 필터 및 정렬
```tsx
interface FilterOptions {
  status: 'all' | 'active' | 'completed' | 'cancelled';
  sortBy: 'latest' | 'oldest' | 'amount-high' | 'amount-low';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

const filterTabs = [
  { id: 'all', label: '전체', count: 0 },
  { id: 'active', label: '진행중', count: 0 },
  { id: 'completed', label: '완료', count: 0 },
];
```

#### 2.5 무한 스크롤 (Infinite Scroll)
```tsx
// hooks/useInfiniteOrders.ts
export function useInfiniteOrders(userId: string, filter: FilterOptions) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const lastDocRef = useRef<any>(null);
  
  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const result = await fetchOrders({
        userId,
        filter,
        limit: 10,
        lastDoc: lastDocRef.current,
      });
      
      setOrders(prev => [...prev, ...result.orders]);
      lastDocRef.current = result.lastDoc;
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Intersection Observer로 무한 스크롤
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);
  
  return { orders, loading, hasMore, loadMoreRef };
}
```

---

### 3. Realtime 업데이트

#### 3.1 Firestore onSnapshot
```tsx
// lib/orders.api.ts
export function subscribeToOrder(
  orderId: string, 
  onUpdate: (order: Order) => void,
  onError?: (error: Error) => void
): () => void {
  const orderRef = doc(db, 'orders', orderId);
  
  const unsubscribe = onSnapshot(
    orderRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const order = { id: snapshot.id, ...snapshot.data() } as Order;
        onUpdate(order);
      }
    },
    (error) => {
      console.error('Order subscription error:', error);
      onError?.(error);
    }
  );
  
  return unsubscribe;
}
```

#### 3.2 OrderTracking에서 사용
```tsx
// pages/app/OrderTracking.tsx
export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!orderId) return;
    
    setLoading(true);
    
    // Realtime 구독
    const unsubscribe = subscribeToOrder(
      orderId,
      (updatedOrder) => {
        setOrder(updatedOrder);
        setLoading(false);
        
        // 상태 변경 시 알림
        if (updatedOrder.status === 'delivering') {
          toast.success('배달이 시작되었습니다!');
        }
      },
      (error) => {
        toast.error('주문 정보를 불러올 수 없습니다');
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [orderId]);
  
  if (loading) return <LoadingSkeleton />;
  if (!order) return <EmptyState title="주문을 찾을 수 없습니다" />;
  
  return (
    <AppLayout>
      <AppHeader title="주문 상세" showBack />
      
      <div className="max-w-4xl mx-auto p-4">
        {/* Progress Stepper */}
        <OrderProgressStepper currentStatus={order.status} />
        
        {/* 상태별 섹션 */}
        <StatusSection order={order} />
        
        {/* 주문 정보 */}
        <OrderDetails order={order} />
        
        {/* 타임라인 */}
        <OrderTimeline order={order} />
      </div>
    </AppLayout>
  );
}
```

---

## 💬 프롬프트

```
현풍닭칼국수 PWA의 주문 추적 및 히스토리 시스템을 구축합니다.

## 작업 목표
고객이 실시간으로 주문 상태를 확인하고, 과거 주문 내역을 조회할 수 있는 완전한 UI를 구현합니다.

## 작업 내용

### 1. 타입 정의 (`/types/order.ts`)
- OrderStatus enum (10가지 상태)
- Order 인터페이스 (완전한 구조)
- 모든 타임스탬프 필드
- 결제, 배달, 취소 정보

### 2. 주문 추적 페이지 (`/pages/app/OrderTracking.tsx`)

완전한 기능 구현:

#### 상태별 UI
- PAID: "가게에서 확인 중" 메시지
- CONFIRMED: "접수 완료" + 예상 조리 시간
- PREPARING: "조리 중" 애니메이션 + 진행률
- READY: "조리 완료" + 픽업 대기
- DELIVERING: 실시간 지도 + 배달원 정보 + 예상 도착 시간
- DELIVERED: "수령 확인" 버튼 + "리뷰 작성" 버튼
- COMPLETED: 완료 메시지 + 포인트 적립 안내
- CANCELLED: 취소 사유 + 환불 정보

#### Progress Stepper
- 5단계 (결제-접수-조리-배달-완료)
- 현재 단계 하이라이트
- 완료 단계는 현풍레드 색상
- 미완료 단계는 회색

#### 주문 정보 섹션
- 주문번호 (font-mono)
- 주문 메뉴 목록 (옵션 포함)
- 금액 breakdown (접기/펼치기)
- 결제 정보 (카드사, 카드번호 마스킹)
- 배송 정보 (주소, 요청사항)

#### 타임라인
- 모든 상태 변경 이력
- 시간 표시 (HH:MM 형식)
- 아이콘 + 설명

#### 액션 버튼
- 배달 중: "배달원에게 전화" (tel: 링크)
- 배달 완료: "수령 확인", "리뷰 작성"
- 진행 중: "주문 취소" (조리 전만)
- 모든 상태: "문의하기" → Support

### 3. 실시간 지도 (`/components/app/DeliveryMap.tsx`)

**요구사항:**
- Kakao Maps API 사용 (임시로 Static Map)
- 3개 마커:
  - 🏪 가게 (파란색)
  - 🚗 배달원 (빨간색, 실시간 업데이트)
  - 🏠 고객 (초록색)
- 경로 폴리라인
- 줌/팬 가능
- 모바일에서는 접힌 상태 → 탭하면 전체화면

**임시 구현 (Static):**
```tsx
export function DeliveryMap({ storeLat, storeLng, deliveryLat, deliveryLng, destinationLat, destinationLng }) {
  // 실제로는 Kakao Maps SDK 사용
  // 지금은 Static Image
  return (
    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
      <img
        src={`https://maps.googleapis.com/maps/api/staticmap?center=${deliveryLat},${deliveryLng}&zoom=14&size=600x300&markers=color:blue|${storeLat},${storeLng}&markers=color:red|${deliveryLat},${deliveryLng}&markers=color:green|${destinationLat},${destinationLng}&key=YOUR_KEY`}
        alt="배달 경로"
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium">배달원이 고객님께 향하고 있습니다</p>
        <p className="text-xs text-gray-600">예상 도착: 14:30</p>
      </div>
    </div>
  );
}
```

### 4. 주문 히스토리 페이지 (`/pages/app/OrderHistory.tsx`)

완전한 기능 구현:

#### 필터 탭
- 전체 / 진행중 / 완료 / 취소
- 각 탭에 개수 표시
- 활성 탭 하이라이트 (현풍레드)

#### 정렬 옵션
- Dropdown: 최신순 / 오래된순 / 금액높은순 / 금액낮은순

#### OrderCard 컴포넌트
- 주문번호 (작게, font-mono)
- 날짜/시간
- 메뉴명 (첫 번째 + "외 N건")
- 금액 (크게, bold, 현풍레드)
- 상태 Badge
- 배달 중일 때: 예상 도착 시간
- 완료 시: 리뷰 작성 버튼 or 별점 표시

#### 무한 스크롤
- Intersection Observer 사용
- 한 번에 10개씩 로드
- 로딩 스피너 하단에 표시
- "더 이상 주문이 없습니다" 메시지

#### 빈 상태
```tsx
<EmptyState
  icon={<Receipt size={64} />}
  title="주문 내역이 없습니다"
  description="첫 주문을 시작해보세요!"
  action={{ text: "메뉴 보기", href: "/menu" }}
/>
```

### 5. OrderCard 컴포넌트 (`/components/shared/OrderCard.tsx`)
- hover 시 그림자 증가
- 클릭 시 → /orders/:id
- 상태별 아이콘 및 색상
- 리뷰 작성 버튼 (조건부)

### 6. OrderProgressStepper (`/components/shared/OrderProgressStepper.tsx`)
- 5단계 Progress
- 현재 단계 ring 효과
- 완료 단계 현풍레드
- 미완료 단계 회색
- 반응형 (모바일에서 작게)

### 7. OrderStatusBadge (`/components/shared/OrderStatusBadge.tsx`)
- 상태별 색상:
  - PAID: blue
  - CONFIRMED: indigo
  - PREPARING: orange
  - READY: purple
  - DELIVERING: red
  - DELIVERED: green
  - COMPLETED: green
  - CANCELLED: gray
  - REFUNDED: gray

### 8. API 함수 (`/lib/orders.api.ts`)

```typescript
// 단일 주문 조회
export async function fetchOrder(orderId: string): Promise<Order>;

// 주문 목록 조회 (페이징)
export async function fetchOrders(params: {
  userId: string;
  filter?: FilterOptions;
  limit?: number;
  lastDoc?: any;
}): Promise<{ orders: Order[]; lastDoc: any; hasMore: boolean }>;

// 실시간 구독
export function subscribeToOrder(
  orderId: string,
  onUpdate: (order: Order) => void,
  onError?: (error: Error) => void
): () => void;

// 수령 확인
export async function confirmDelivery(orderId: string): Promise<void>;

// 주문 취소
export async function cancelOrder(
  orderId: string, 
  reason: string
): Promise<void>;
```

### 9. Mock 데이터 (`/data/orders.json`)
최소 5개의 주문 생성:
- 1개: DELIVERING (배달 중)
- 1개: PREPARING (조리 중)
- 2개: COMPLETED (완료, 하나는 리뷰 있음)
- 1개: CANCELLED (취소)

### 10. 구현 원칙
1. ✅ Realtime 업데이트 (onSnapshot)
2. ✅ 상태별 UI 완전히 다름
3. ✅ 애니메이션 (pulse, bounce)
4. ✅ 무한 스크롤
5. ✅ 로딩/에러/빈 상태 처리
6. ✅ 접근성 (ARIA)
7. ✅ 반응형 (Mobile First)

모든 파일을 100% 완성된 형태로 생성해주세요.
```

---

## ✅ 검증 체크리스트

- [ ] OrderStatus enum이 정의되었는가?
- [ ] Order 타입이 모든 필드를 포함하는가?
- [ ] OrderTracking 페이지가 상태별로 다른 UI를 보여주는가?
- [ ] Progress Stepper가 현재 단계를 표시하는가?
- [ ] 실시간 지도가 표시되는가? (DELIVERING 상태)
- [ ] 배달원 정보가 표시되는가?
- [ ] 타임라인이 모든 이력을 보여주는가?
- [ ] OrderHistory 페이지에 필터/정렬이 작동하는가?
- [ ] OrderCard가 상태별로 다른 정보를 보여주는가?
- [ ] 무한 스크롤이 작동하는가?
- [ ] 리뷰 작성 버튼이 조건부로 표시되는가?
- [ ] Realtime 업데이트가 작동하는가?

---

## 📌 다음 단계

**07-review-system.md** - 리뷰 작성 및 조회 시스템

---

**작성일**: 2025-10-31  
**개발사**: KS컴퍼니
