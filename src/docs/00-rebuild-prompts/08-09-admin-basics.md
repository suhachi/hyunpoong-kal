# Phase 3-1, 3-2: 관리자 대시보드 및 메뉴 관리

## 🎯 목표

가게 주인이 실시간으로 주문을 관리하고 메뉴를 편집할 수 있는 관리자 대시보드를 구축합니다.

---

## 📋 PRD - Part 1: 관리자 대시보드

### 1. 관리자 레이아웃 (AdminLayout.tsx)

#### 1.1 UI 구조 (Desktop)
```
┌────────────────────────────────────────────┐
│ 🍜 현풍닭칼국수 관리자      [알림] [프로필]│
├───────────┬────────────────────────────────┤
│           │                                │
│ [사이드바]│   [메인 콘텐츠]                 │
│           │                                │
│ 📊 대시보드│                                │
│ 📋 주문관리│                                │
│ 🍽️ 메뉴관리│                                │
│ ⭐ 리뷰관리│                                │
│ 🎁 프로모션│                                │
│ 📈 분석    │                                │
│ ⚙️ 설정    │                                │
│           │                                │
│ ─────────│                                │
│ KS컴퍼니  │                                │
│ 553-17... │                                │
└───────────┴────────────────────────────────┘
```

#### 1.2 사이드바 메뉴
```tsx
const menuItems = [
  { id: 'dashboard', label: '대시보드', icon: LayoutDashboard, href: '/admin/dashboard' },
  { id: 'orders', label: '주문 관리', icon: Receipt, href: '/admin/orders', badge: 3 },
  { id: 'menus', label: '메뉴 관리', icon: BowlIcon, href: '/admin/menus' },
  { id: 'reviews', label: '리뷰 관리', icon: Star, href: '/admin/reviews' },
  { id: 'promotions', label: '프로모션', icon: Gift, href: '/admin/promotions' },
  { id: 'analytics', label: '통합 분석', icon: TrendingUp, href: '/admin/analytics' },
  { id: 'delivery', label: '배달 관제', icon: Truck, href: '/admin/delivery' },
  { id: 'support', label: '고객 지원', icon: MessageCircle, href: '/admin/support' },
  { id: 'settings', label: '설정', icon: Settings, href: '/admin/settings' },
];
```

---

### 2. 대시보드 페이지 (Dashboard.tsx)

#### 2.1 UI 구조
```
┌─────────────────────────────────────────────┐
│  대시보드                      2025.10.31   │
├─────────────────────────────────────────────┤
│                                             │
│  [실시간 주문 알림] 🔴 LIVE                  │
│  ┌─────────────────────────────────────┐   │
│  │ 🔔 새 주문이 도착했습니다!           │   │
│  │ HP-20251031-0042 | 26,000원          │   │
│  │ [접수] [거부]                        │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [통계 카드 4개]                            │
│  ┌──────┬──────┬──────┬──────┐            │
│  │오늘   │오늘   │대기중 │오늘   │            │
│  │매출   │주문   │주문   │리뷰   │            │
│  │      │      │      │      │            │
│  │520K원│ 43건 │  3건 │ 12건 │            │
│  │+12%  │ +8%  │      │ +5개 │            │
│  └──────┴──────┴──────┴──────┘            │
│                                             │
│  [최근 주문 목록]                            │
│  ┌─────────────────────────────────────┐   │
│  │ #0042 │ 현풍닭칼국수 외 1건          │   │
│  │ 14:30 │ 26,000원 │ [조리 중] ●     │   │
│  ├─────────────────────────────────────┤   │
│  │ #0041 │ 얼큰칼국수                  │   │
│  │ 14:25 │ 9,500원  │ [배달 중] ●     │   │
│  └─────────────────────────────────────┘   │
│  [전체 보기 →]                              │
│                                             │
│  ┌─────────────┬─────────────┐             │
│  │ [매출 차트]  │ [인기 메뉴]  │             │
│  │             │             │             │
│  │  📊 (7일)   │  1. 현풍... │             │
│  │             │  2. 얼큰... │             │
│  │             │  3. 수제... │             │
│  └─────────────┴─────────────┘             │
│                                             │
└─────────────────────────────────────────────┘
```

#### 2.2 StatCard 컴포넌트
```tsx
// components/admin/common/StatCard.tsx
interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;      // 변화율 (%)
    direction: 'up' | 'down';
  };
  color?: 'red' | 'orange' | 'green' | 'blue';
}

export function StatCard({ title, value, icon, trend, color = 'red' }: StatCardProps) {
  const colorClasses = {
    red: 'bg-hyunpung-red/10 text-hyunpung-red',
    orange: 'bg-sinkal-orange/10 text-sinkal-orange',
    green: 'bg-success/10 text-success',
    blue: 'bg-info/10 text-info',
  };
  
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold mb-2">{value}</p>
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-sm",
              trend.direction === 'up' ? 'text-success' : 'text-error'
            )}>
              {trend.direction === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center",
          colorClasses[color]
        )}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
```

#### 2.3 실시간 주문 알림
```tsx
// Dashboard.tsx에서 사용
export default function Dashboard() {
  const [newOrders, setNewOrders] = useState<Order[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    // Firestore 실시간 구독
    const q = query(
      collection(db, 'orders'),
      where('status', '==', 'paid'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const order = { id: change.doc.id, ...change.doc.data() } as Order;
          setNewOrders(prev => [order, ...prev]);
          
          // 알림 소리 재생
          audioRef.current?.play();
          
          // 브라우저 알림
          if (Notification.permission === 'granted') {
            new Notification('새 주문!', {
              body: `${order.orderNumber} - ${formatPrice(order.totalAmount)}`,
              icon: '/icon-192x192.png',
            });
          }
        }
      });
    });
    
    return () => unsubscribe();
  }, []);
  
  return (
    <div>
      <audio ref={audioRef} src="/sounds/order-notification.mp3" />
      
      {newOrders.length > 0 && (
        <Alert className="mb-6 border-hyunpung-red bg-hyunpung-red/5">
          <AlertCircle className="h-4 w-4 text-hyunpung-red" />
          <AlertTitle>새 주문 {newOrders.length}건</AlertTitle>
          <AlertDescription>
            {newOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between mt-2">
                <span>{order.orderNumber} - {formatPrice(order.totalAmount)}</span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAccept(order.id)}>
                    접수
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleReject(order.id)}>
                    거부
                  </Button>
                </div>
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}
      
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="오늘 매출"
          value={formatPrice(stats.todaySales)}
          icon={<DollarSign />}
          trend={{ value: 12, direction: 'up' }}
          color="red"
        />
        <StatCard
          title="오늘 주문"
          value={`${stats.todayOrders}건`}
          icon={<Receipt />}
          trend={{ value: 8, direction: 'up' }}
          color="orange"
        />
        <StatCard
          title="대기 중 주문"
          value={`${stats.pendingOrders}건`}
          icon={<Clock />}
          color="blue"
        />
        <StatCard
          title="오늘 리뷰"
          value={`${stats.todayReviews}건`}
          icon={<Star />}
          trend={{ value: 5, direction: 'up' }}
          color="green"
        />
      </div>
      
      {/* 최근 주문 */}
      <RecentOrders />
      
      {/* 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <SalesChart />
        <PopularMenus />
      </div>
    </div>
  );
}
```

---

### 3. 주문 관리 페이지 (Orders.tsx)

#### 3.1 UI 구조
```
┌─────────────────────────────────────────────┐
│  주문 관리                                   │
├─────────────────────────────────────────────┤
│  [탭]                                       │
│  ● 전체(43) 대기중(3) 조리중(5) 배달중(2)   │
│                                             │
│  [검색 및 필터]                              │
│  🔍 [주문번호 검색]  [날짜▼] [상태▼]        │
│                                             │
│  [주문 테이블]                               │
│  ┌─────┬──────┬──────┬────┬────┬──────┐   │
│  │번호  │시간   │고객   │메뉴 │금액 │상태   │   │
│  ├─────┼──────┼──────┼────┼────┼──────┤   │
│  │0042 │14:30 │홍길동 │현풍 │26K │조리중 │   │
│  │0041 │14:25 │김철수 │얼큰 │9.5K│배달중 │   │
│  │0040 │14:20 │이영희 │수제 │6K  │완료   │   │
│  └─────┴──────┴──────┴────┴────┴──────┘   │
│  [1] 2 3 4 5 ... 10 [다음]                 │
│                                             │
└─────────────────────────────────────────────┘
```

#### 3.2 OrderTable 컴포넌트
```tsx
// components/admin/OrderTable.tsx
const columns = [
  { key: 'orderNumber', label: '주문번호' },
  { key: 'createdAt', label: '주문 시간' },
  { key: 'orderInfo', label: '주문자' },
  { key: 'items', label: '메뉴' },
  { key: 'totalAmount', label: '금액' },
  { key: 'status', label: '상태' },
  { key: 'actions', label: '액션' },
];

export function OrderTable({ orders }: { orders: Order[] }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(order => (
            <TableRow 
              key={order.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedOrder(order)}
            >
              <TableCell className="font-mono text-sm">
                {order.orderNumber}
              </TableCell>
              <TableCell>{formatTime(order.createdAt)}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.orderInfo.name}</p>
                  <p className="text-xs text-gray-500">{order.orderInfo.phone}</p>
                </div>
              </TableCell>
              <TableCell>
                {order.items[0].name}
                {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
              </TableCell>
              <TableCell className="font-bold text-hyunpung-red">
                {formatPrice(order.totalAmount)}
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell>
                <OrderActionBar order={order} onUpdate={() => {}} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* 상세 Drawer */}
      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
```

#### 3.3 OrderActionBar 컴포넌트
```tsx
// components/admin/OrderActionBar.tsx
export function OrderActionBar({ order, onUpdate }: { 
  order: Order; 
  onUpdate: () => void;
}) {
  const actions = getAvailableActions(order.status);
  
  return (
    <div className="flex gap-2">
      {actions.map(action => (
        <Button
          key={action.id}
          size="sm"
          variant={action.variant}
          onClick={() => handleAction(action.id, order.id)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

function getAvailableActions(status: OrderStatus) {
  const actionsMap = {
    paid: [
      { id: 'accept', label: '접수', variant: 'default' },
      { id: 'reject', label: '거부', variant: 'outline' },
    ],
    confirmed: [
      { id: 'prepare', label: '조리 시작', variant: 'default' },
      { id: 'cancel', label: '취소', variant: 'destructive' },
    ],
    preparing: [
      { id: 'ready', label: '조리 완료', variant: 'default' },
    ],
    ready: [
      { id: 'deliver', label: '배달 시작', variant: 'default' },
    ],
    delivering: [
      { id: 'complete', label: '배달 완료', variant: 'default' },
    ],
  };
  
  return actionsMap[status] || [];
}
```

#### 3.4 OrderDetailDrawer 컴포넌트
```tsx
// components/admin/OrderDetailDrawer.tsx
export function OrderDetailDrawer({ order, open, onClose }: {
  order: Order;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>주문 상세 - {order.orderNumber}</DrawerTitle>
        </DrawerHeader>
        
        <div className="p-6 overflow-auto">
          {/* 주문 정보 */}
          <section className="mb-6">
            <h3 className="font-semibold mb-3">주문 정보</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-600">주문 시간</dt>
                <dd>{formatDateTime(order.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">주문자</dt>
                <dd>{order.orderInfo.name} ({order.orderInfo.phone})</dd>
              </div>
            </dl>
          </section>
          
          {/* 주문 메뉴 */}
          <section className="mb-6">
            <h3 className="font-semibold mb-3">주문 메뉴</h3>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between py-2 border-b">
                <div>
                  <p className="font-medium">{item.name} x{item.quantity}</p>
                  {item.selectedOptions.map(opt => (
                    <p key={opt.optionId} className="text-sm text-gray-600">
                      - {opt.optionName} (+{formatPrice(opt.price)})
                    </p>
                  ))}
                </div>
                <p className="font-bold">{formatPrice(item.totalPrice)}</p>
              </div>
            ))}
          </section>
          
          {/* 금액 정보 */}
          <section className="mb-6">
            <h3 className="font-semibold mb-3">금액 정보</h3>
            <PriceBreakdown order={order} />
          </section>
          
          {/* 배송 정보 */}
          <section className="mb-6">
            <h3 className="font-semibold mb-3">배송 정보</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-gray-600 text-sm">주소</dt>
                <dd>{order.deliveryAddress.address}</dd>
                <dd className="text-sm text-gray-600">{order.deliveryAddress.detailAddress}</dd>
              </div>
              <div>
                <dt className="text-gray-600 text-sm">요청사항</dt>
                <dd>{order.deliveryRequest.message || '-'}</dd>
              </div>
            </dl>
          </section>
          
          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => handlePrint(order)}>
              <Printer className="w-4 h-4 mr-2" />
              영수증 출력
            </Button>
            <OrderActionBar order={order} onUpdate={onClose} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
```

---

## 📋 PRD - Part 2: 메뉴 관리

### 4. 메뉴 관리 페이지 (Menus.tsx)

#### 4.1 UI 구조
```
┌─────────────────────────────────────────────┐
│  메뉴 관리                                   │
├─────────────────────────────────────────────┤
│  [메뉴 생성]  [CSV 임포트]                  │
│                                             │
│  [카테고리 탭]                               │
│  ● 전체  칼국수  만두  사이드  음료          │
│                                             │
│  [메뉴 테이블]                               │
│  ┌───┬──────┬────┬────┬───────┬──────┐    │
│  │📷 │메뉴명  │가격 │재고 │상태    │액션   │    │
│  ├───┼──────┼────┼────┼───────┼──────┤    │
│  │🍜 │현풍... │9K  │∞   │판매중  │[편집] │    │
│  │🍜 │얼큰... │9.5K│∞   │판매중  │[편집] │    │
│  │🥟 │수제... │6K  │100 │품절    │[편집] │    │
│  └───┴──────┴────┴────┴───────┴──────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

#### 4.2 MenuTable 컴포넌트
```tsx
// components/admin/MenuTable.tsx
export function MenuTable({ menus, onEdit, onDelete }: {
  menus: Menu[];
  onEdit: (menu: Menu) => void;
  onDelete: (menuId: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>이미지</TableHead>
          <TableHead>메뉴명</TableHead>
          <TableHead>카테고리</TableHead>
          <TableHead>가격</TableHead>
          <TableHead>재고</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>액션</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {menus.map(menu => (
          <TableRow key={menu.id}>
            <TableCell>
              <img
                src={menu.image}
                alt={menu.name}
                className="w-12 h-12 object-cover rounded"
              />
            </TableCell>
            <TableCell className="font-medium">{menu.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{getCategoryLabel(menu.category)}</Badge>
            </TableCell>
            <TableCell>{formatPrice(menu.price)}</TableCell>
            <TableCell>
              {menu.stock === -1 ? '무제한' : menu.stock}
            </TableCell>
            <TableCell>
              <Badge variant={menu.isSoldOut ? 'destructive' : 'success'}>
                {menu.isSoldOut ? '품절' : '판매중'}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onEdit(menu)}>
                    <Edit className="w-4 h-4 mr-2" />
                    편집
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleSoldOut(menu.id)}>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {menu.isSoldOut ? '판매 시작' : '품절 처리'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(menu.id)}
                    className="text-destructive"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

#### 4.3 MenuCreateDialog 컴포넌트
```tsx
// components/admin/MenuCreateDialog.tsx
export function MenuCreateDialog({ open, onClose, onSubmit }: {
  open: boolean;
  onClose: () => void;
  onSubmit: (menu: Partial<Menu>) => void;
}) {
  const [image, setImage] = useState<File | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(menuSchema),
  });
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>메뉴 추가</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 기본 정보 */}
          <FormField label="메뉴명" required error={errors.name?.message}>
            <Input {...register('name')} placeholder="현풍닭칼국수" />
          </FormField>
          
          <FormField label="설명" required error={errors.description?.message}>
            <Textarea {...register('description')} rows={3} />
          </FormField>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField label="가격" required error={errors.price?.message}>
              <Input {...register('price', { valueAsNumber: true })} type="number" />
            </FormField>
            
            <FormField label="카테고리" required error={errors.category?.message}>
              <Select {...register('category')}>
                <option value="noodle">칼국수</option>
                <option value="dumpling">만두</option>
                <option value="side">사이드</option>
                <option value="beverage">음료</option>
              </Select>
            </FormField>
          </div>
          
          {/* 이미지 업로드 */}
          <FormField label="이미지">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </FormField>
          
          {/* 옵션 그룹 */}
          <FormField label="옵션 그룹">
            <OptionGroupsManagement />
          </FormField>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">생성</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

#### 4.4 CSV 임포트
```tsx
// components/admin/MenuCSVImport.tsx
export function MenuCSVImport({ onImport }: {
  onImport: (menus: Partial<Menu>[]) => void;
}) {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const text = await file.text();
    const rows = text.split('\n').map(row => row.split(','));
    
    const headers = rows[0];
    const menus = rows.slice(1).map(row => {
      const menu: any = {};
      headers.forEach((header, index) => {
        menu[header.trim()] = row[index]?.trim();
      });
      return menu;
    });
    
    onImport(menus);
  };
  
  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center">
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p className="mb-4">CSV 파일을 업로드하세요</p>
      
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="max-w-xs mx-auto"
      />
      
      <div className="mt-4 text-sm text-gray-600">
        <p>CSV 형식: 메뉴명,설명,가격,카테고리,이미지URL</p>
        <Button variant="link" onClick={downloadTemplate}>
          템플릿 다운로드
        </Button>
      </div>
    </div>
  );
}
```

---

## 💬 프롬프트

```
현풍닭칼국수 PWA의 관리자 대시보드 및 메뉴 관리 시스템을 구축합니다.

## Part 1: 관리자 기본 구조

### 1. AdminLayout (`/pages/admin/_layout/AdminLayout.tsx`)
- 좌측 사이드바 (Desktop)
- 상단 헤더 (로고, 알림, 프로필)
- 메인 콘텐츠 영역
- 하단 개발사 정보 (KS컴퍼니)
- 반응형 (Mobile: 햄버거 메뉴)

### 2. 사이드바 메뉴
9개 메뉴 항목:
- 대시보드, 주문관리, 메뉴관리, 리뷰관리, 프로모션
- 통합분석, 배달관제, 고객지원, 설정
- 활성 메뉴 하이라이트 (현풍레드)
- Badge (주문 대기 수)

### 3. Dashboard 페이지 (`/pages/admin/Dashboard.tsx`)
- 실시간 주문 알림 (Firestore onSnapshot)
- 알림 소리 (audio 태그)
- 브라우저 알림 (Notification API)
- 4개 StatCard (매출, 주문, 대기, 리뷰)
- 최근 주문 목록 (5개)
- 매출 차트 (recharts - 7일간)
- 인기 메뉴 Top 3

### 4. StatCard 컴포넌트
- 제목, 값, 아이콘
- 트렌드 (%, 상승/하락)
- 컬러 variant (red, orange, green, blue)

## Part 2: 주문 관리

### 5. Orders 페이지 (`/pages/admin/Orders.tsx`)
- 탭 필터 (전체, 대기중, 조리중, 배달중)
- 검색 (주문번호, 고객명)
- 날짜 필터 (DatePicker)
- 상태 필터 (Dropdown)
- Pagination (10개씩)

### 6. OrderTable 컴포넌트
- 7개 컬럼 (번호, 시간, 고객, 메뉴, 금액, 상태, 액션)
- 클릭 시 상세 Drawer
- 호버 시 배경색 변경

### 7. OrderActionBar 컴포넌트
- 상태별 가능한 액션:
  - PAID: 접수, 거부
  - CONFIRMED: 조리 시작, 취소
  - PREPARING: 조리 완료
  - READY: 배달 시작
  - DELIVERING: 배달 완료
- 버튼 크기: sm
- Primary 액션: default variant
- Secondary 액션: outline

### 8. OrderDetailDrawer 컴포넌트
- Drawer (우측에서 열림)
- 높이: 90vh
- 섹션:
  - 주문 정보 (시간, 주문자)
  - 주문 메뉴 (옵션 포함)
  - 금액 정보 (PriceBreakdown)
  - 배송 정보 (주소, 요청사항)
  - 액션 버튼 (영수증 출력, 상태 변경)

### 9. PrintableOrder 컴포넌트
- A4 크기 (210mm x 297mm)
- 가게 정보 (상단)
- 주문 정보
- 메뉴 목록
- 금액 정보
- QR 코드 (주문 추적용)
- 개발사 정보 (하단)
- Print 스타일 (@media print)

## Part 3: 메뉴 관리

### 10. Menus 페이지 (`/pages/admin/Menus.tsx`)
- [메뉴 생성] 버튼 → Dialog
- [CSV 임포트] 버튼 → Dialog
- 카테고리 탭 (전체, 칼국수, 만두, 사이드, 음료)
- MenuTable 컴포넌트

### 11. MenuTable 컴포넌트
- 7개 컬럼 (이미지, 메뉴명, 카테고리, 가격, 재고, 상태, 액션)
- 이미지: 48x48px, rounded
- 상태: Badge (판매중/품절)
- 액션: DropdownMenu
  - 편집
  - 품절 처리/판매 시작
  - 삭제

### 12. MenuCreateDialog 컴포넌트
- Dialog (max-w-2xl)
- react-hook-form + zod
- 필드:
  - 메뉴명 (필수)
  - 설명 (필수, Textarea)
  - 가격 (필수, number)
  - 카테고리 (필수, Select)
  - 이미지 (File input)
  - 옵션 그룹 (OptionGroupsManagement)
- 제출 시 Firebase Storage 업로드 + Firestore 저장

### 13. MenuEditDialog 컴포넌트
- MenuCreateDialog와 동일한 구조
- 기존 데이터 pre-fill
- 수정 버튼

### 14. MenuCSVImport 컴포넌트
- File input (CSV)
- CSV 파싱 (Papa Parse 또는 수동)
- 템플릿 다운로드 버튼
- Drag & Drop 지원
- 프리뷰 테이블
- 일괄 임포트

### 15. OptionGroupsManagement 컴포넌트
- 옵션 그룹 목록
- [그룹 추가] 버튼
- 각 그룹:
  - 그룹명 (예: "맵기 선택")
  - 필수 여부 (Switch)
  - 최대 선택 개수 (Number)
  - 옵션 목록:
    - 옵션명
    - 추가 금액
    - [추가] [삭제]

## API 함수

### `/lib/admin/orders.api.ts`
```typescript
export async function fetchOrders(filter: OrderFilter): Promise<Order[]>;
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
export async function acceptOrder(orderId: string): Promise<void>;
export async function rejectOrder(orderId: string, reason: string): Promise<void>;
```

### `/lib/admin/menus.api.ts`
```typescript
export async function fetchMenus(category?: string): Promise<Menu[]>;
export async function createMenu(menu: Partial<Menu>): Promise<Menu>;
export async function updateMenu(menuId: string, data: Partial<Menu>): Promise<void>;
export async function deleteMenu(menuId: string): Promise<void>;
export async function toggleSoldOut(menuId: string): Promise<void>;
export async function importMenusFromCSV(menus: Partial<Menu>[]): Promise<void>;
```

## 구현 원칙
1. ✅ Realtime 업데이트 (onSnapshot)
2. ✅ 알림 소리 + 브라우저 알림
3. ✅ 영수증 프린트 (window.print)
4. ✅ CSV 임포트/엑스포트
5. ✅ 모든 액션에 확인 Dialog
6. ✅ 에러 처리 (toast)
7. ✅ 로딩 상태

모든 파일을 100% 완성된 형태로 생성해주세요.
```

---

## ✅ 검증 체크리스트

- [ ] AdminLayout이 사이드바를 포함하는가?
- [ ] Dashboard에서 실시간 주문 알림이 작동하는가?
- [ ] StatCard가 트렌드를 표시하는가?
- [ ] Orders 페이지에서 필터/검색이 작동하는가?
- [ ] OrderTable 클릭 시 Drawer가 열리는가?
- [ ] OrderActionBar가 상태별 액션을 표시하는가?
- [ ] 영수증 프린트가 작동하는가?
- [ ] Menus 페이지에서 메뉴 생성이 가능한가?
- [ ] MenuTable에서 편집/삭제가 작동하는가?
- [ ] CSV 임포트가 작동하는가?
- [ ] 옵션 그룹 관리가 가능한가?

---

## 📌 다음 단계

**10-11-admin-advanced.md** - 리뷰 관리, 분석, 설정

---

**작성일**: 2025-10-31  
**개발사**: KS컴퍼니
