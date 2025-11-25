# Admin Pages - Full Source Code

**Generated**: 2025-11-25-1033  
**Project**: hyunpoong-kal  
**Company**: KS Company (BRN: 553-17-00098)

---

## Overview

Complete source code of 11 admin pages.

---
## src\pages\admin\Dashboard.tsx

```tsx
// Route: /admin
import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Star, TrendingUp } from 'lucide-react';
import { StatCard } from '../../components/admin/common/StatCard';
import { Card } from '../../components/ui/card';
import { formatPrice } from '../../lib/utils';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todaySales: 0,
    todayOrders: 0,
    averageRating: 0,
    installRate: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    // 실제 데이터 로딩 (샘플 데이터 제거)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 실제 주문/매출 데이터를 가져와서 계산
    // TODO: 실제 API 연동 시 여기서 데이터 로드
    setStats({
      todaySales: 0,
      todayOrders: 0,
      averageRating: 0,
      installRate: 0,
    });

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl text-[#333] mb-2">대시보드</h1>
        <p className="text-[#8B7355]">
          현풍닭칼국수 운영 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="오늘 매출"
          value={formatPrice(stats.todaySales)}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          subtitle="전일 대비"
          loading={loading}
        />

        <StatCard
          title="오늘 주문"
          value={`${stats.todayOrders}건`}
          icon={ShoppingBag}
          trend={{ value: 8.3, isPositive: true }}
          subtitle="전일 대비"
          loading={loading}
        />

        <StatCard
          title="평균 평점"
          value={stats.averageRating.toFixed(1)}
          icon={Star}
          subtitle="전체 리뷰 기준"
          loading={loading}
        />

        <StatCard
          title="PWA 설치율"
          value={`${stats.installRate}%`}
          icon={TrendingUp}
          trend={{ value: 5.2, isPositive: true }}
          subtitle="이번 주 기준"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 실시간 주문 현황 */}
        <Card className="p-6">
          <h2 className="text-[#333] mb-4">실시간 주문 현황</h2>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-[#8B7355]">로딩 중...</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#8B7355]">
                  새로운 주문이 없습니다
                </p>
                <p className="text-[#8B7355] mt-1">
                  주문이 들어오면 여기에 표시됩니다
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* 최근 리뷰 */}
        <Card className="p-6">
          <h2 className="text-[#333] mb-4">최근 리뷰</h2>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-[#8B7355]">로딩 중...</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#8B7355]">
                  최근 리뷰가 없습니다
                </p>
                <p className="text-[#8B7355] mt-1">
                  고객이 리뷰를 남기면 여기에 표시됩니다
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 시간대별 주문 현황 */}
      <Card className="p-6">
        <h2 className="text-[#333] mb-4">시간대별 주문 현황</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-[#E5DDD5] rounded-lg">
          <p className="text-[#8B7355]">
            차트가 여기에 표시됩니다 (Phase 2-9에서 구현 예정)
          </p>
        </div>
      </Card>

      {/* 도움말 */}
      <Card className="p-6 bg-[#F37021]/5 border-[#F37021]/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="text-[#333] mb-2">관리자 대시보드 안내</h3>
            <ul className="space-y-1 text-[#8B7355]">
              <li>• 좌측 메뉴에서 주문, 리뷰, 메뉴, 설정을 관리할 수 있습니다</li>
              <li>• 실시간 통계는 Firebase 연동 후 자동으로 업데이트됩니다</li>
              <li>• 모바일에서는 상단 메뉴 버튼을 눌러 네비게이션을 열 수 있습니다</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

```

---

## src\pages\admin\Orders.tsx

```tsx
// Route: /admin/orders
import React, { useState, useEffect, useRef } from 'react';
import type { Order, OrderStatus } from '../../types/order';
import { ORDER_STATUS_TRANSITIONS } from '../../types/order';
import { Card } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { OrderTable } from '../../components/admin/OrderTable';
import { OrderDetailDrawer } from '../../components/admin/OrderDetailDrawer';
import { PrintableOrder } from '../../components/admin/PrintableOrder';
import {
  fetchOrders,
  updateOrderStatus,
  type OrderFilters,
  type OrderSortField,
  type OrderSortDirection,
} from '../../lib/admin/orders.api';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { getOrdersFallback } from '../../lib/fallback';
import { getOrderStatusLabelForAdmin } from '../../lib/orders.utils';
import { formatPrice } from '../../lib/utils';

// 주문 상태 탭 정의
type OrderStatusTab = 'all' | 'pending' | 'accepted' | 'cooking' | 'completed' | 'cancelled';

const ORDER_STATUS_TABS: { id: OrderStatusTab; label: string; statuses: OrderStatus[] }[] = [
  { id: 'all', label: '전체', statuses: ['pending', 'accepted', 'cooking', 'delivering', 'completed', 'cancelled'] },
  { id: 'pending', label: '접수대기', statuses: ['pending'] },
  { id: 'accepted', label: '접수확인', statuses: ['accepted'] },
  { id: 'cooking', label: '조리중', statuses: ['cooking', 'delivering'] },
  { id: 'completed', label: '완료', statuses: ['completed'] },
  { id: 'cancelled', label: '취소', statuses: ['cancelled'] },
];

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 필터/정렬 상태
  const [currentTabId, setCurrentTabId] = useState<OrderStatusTab>('pending');
  const currentTab = ORDER_STATUS_TABS.find((t) => t.id === currentTabId)!;
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<OrderSortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<OrderSortDirection>('desc');

  // 취소 다이얼로그
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean;
    order: Order | null;
  }>({ open: false, order: null });
  const [cancelReason, setCancelReason] = useState('');

  // 새 주문 알림
  const [newOrderAlert, setNewOrderAlert] = useState<{
    open: boolean;
    order: Order | null;
  }>({ open: false, order: null });
  const [processedOrderIds, setProcessedOrderIds] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousOrdersRef = useRef<Order[]>([]);

  // 데이터 로드
  const loadOrders = async () => {
    setLoading(true);
    try {
      const filters: OrderFilters = {
        paymentMethod: paymentFilter === 'all' ? undefined : paymentFilter,
        searchQuery: searchQuery || undefined,
      };

      const data = await fetchOrders('store-hyunpung', filters, sortField, sortDirection);
      
      // 새 주문 감지 (pending 상태인 주문만)
      const previousOrders = previousOrdersRef.current;
      const newPendingOrders = data.filter(
        (order) =>
          order.status === 'pending' &&
          !processedOrderIds.has(order.orderId) &&
          !previousOrders.some((prev) => prev.orderId === order.orderId)
      );

      // 새 주문이 있으면 알림
      if (newPendingOrders.length > 0) {
        const latestOrder = newPendingOrders[0]; // 가장 최신 주문
        setNewOrderAlert({ open: true, order: latestOrder });
        setProcessedOrderIds((prev) => {
          const newSet = new Set(prev);
          newPendingOrders.forEach((o) => newSet.add(o.orderId));
          return newSet;
        });

        // 알림음 재생
        try {
          // 간단한 beep 소리 생성 (Web Audio API)
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 800; // 800Hz
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
          console.warn('알림음 재생 실패:', error);
        }
      }

      previousOrdersRef.current = data;
      setOrders(data);
      
      // 탭별 필터링
      const filtered = data.filter((order) => currentTab.statuses.includes(order.status));
      setFilteredOrders(filtered);
    } catch (error) {
      console.error('주문 로드 실패:', error);
      toast.error('주문 목록을 불러오는데 실패했습니다 (fallback 적용)');
      // Firestore 권한 실패 시 localStorage 기반 fallback (E2E 안정화)
      const arr = getOrdersFallback();
      setOrders(arr);
      const filtered = arr.filter((order) => currentTab.statuses.includes(order.status));
      setFilteredOrders(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    
    // 주기적으로 새 주문 확인 (5초마다)
    const interval = setInterval(() => {
      loadOrders();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentTabId, paymentFilter, searchQuery, sortField, sortDirection]);

  // 탭 변경 시 필터링
  useEffect(() => {
    const filtered = orders.filter((order) => currentTab.statuses.includes(order.status));
    setFilteredOrders(filtered);
  }, [orders, currentTab]);

  // 상태 변경 처리
  const handleUpdateStatus = async (order: Order, newStatus: OrderStatus) => {
    // 취소 처리는 사유 입력 모달 표시
    if (newStatus === 'cancelled') {
      setCancelDialog({ open: true, order });
      return;
    }

    // 상태 전이 검증
    const allowedTransitions = ORDER_STATUS_TRANSITIONS[order.status];
    if (!allowedTransitions.includes(newStatus)) {
      toast.error('상태 변경 불가', {
        description: `${order.status} 상태에서 ${newStatus}로 변경할 수 없습니다`,
      });
      return;
    }

    try {
      const result = await updateOrderStatus(order.orderId, newStatus);
      if (result.success) {
        toast.success('상태가 변경되었습니다', {
          description: `주문번호: ${order.orderId}`,
        });
        loadOrders();
      } else {
        toast.error('상태 변경 실패', {
          description: result.error,
        });
      }
    } catch (error) {
      console.error('상태 변경 실패:', error);
      toast.error('상태 변경 중 오류가 발생했습니다');
    }
  };

  // 취소 확인
  const handleCancelConfirm = async () => {
    if (!cancelDialog.order || !cancelReason.trim()) {
      toast.error('취소 사유를 입력해주세요');
      return;
    }

    try {
      const result = await updateOrderStatus(
        cancelDialog.order.orderId,
        'canceled',
        cancelReason
      );

      if (result.success) {
        toast.success('주문이 취소되었습니다', {
          description: `주문번호: ${cancelDialog.order.orderId}`,
        });
        setCancelDialog({ open: false, order: null });
        setCancelReason('');
        loadOrders();
      } else {
        toast.error('주문 취소 실패', {
          description: result.error,
        });
      }
    } catch (error) {
      console.error('주문 취소 실패:', error);
      toast.error('주문 취소 중 오류가 발생했습니다');
    }
  };

  // 상세보기
  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  // 정렬 토글
  const toggleSort = (field: OrderSortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // 통계
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    accepted: orders.filter((o) => o.status === 'accepted').length,
    cooking: orders.filter((o) => o.status === 'cooking' || o.status === 'delivering').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6" data-testid="admin.orders.page">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl text-[#333] mb-2">주문 관리</h1>
        <p className="text-[#8B7355]">실시간 주문 현황을 확인하고 상태를 관리하세요</p>
        <div className="mt-2">
          <Alert className="border-blue-100 bg-blue-50 text-sm">
            현재 결제 관련 기능은 Phase 3 이후 PG 연동으로 대체될 예정이며, 이 화면은 Mock/로컬 주문으로 동작합니다.
          </Alert>
        </div>
      </div>

      {/* 상태별 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Card className="p-4">
          <div className="text-2xl text-[#333] mb-1">{stats.total}</div>
          <div className="text-xs text-[#8B7355]">전체</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl text-gray-700 mb-1">{stats.pending}</div>
          <div className="text-xs text-[#8B7355]">접수대기</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl text-blue-600 mb-1">{stats.accepted}</div>
          <div className="text-xs text-[#8B7355]">접수확인</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl text-amber-600 mb-1">{stats.cooking}</div>
          <div className="text-xs text-[#8B7355]">조리중</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl text-green-600 mb-1">{stats.completed}</div>
          <div className="text-xs text-[#8B7355]">완료</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl text-red-600 mb-1">{stats.cancelled}</div>
          <div className="text-xs text-[#8B7355]">취소</div>
        </Card>
      </div>

      {/* 필터/검색 */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* 상태 탭 */}
          <Tabs value={currentTabId} onValueChange={(v) => setCurrentTabId(v as OrderStatusTab)}>
            <TabsList className="w-full justify-start overflow-x-auto">
              {ORDER_STATUS_TABS.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* 검색 및 필터 */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
              <Input
                placeholder="주문번호, 전화번호, 메뉴명 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex gap-2">
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[140px]">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 결제</SelectItem>
                  <SelectItem value="app_card">앱 결제</SelectItem>
                  <SelectItem value="meet_card">만나서 카드</SelectItem>
                  <SelectItem value="meet_cash">만나서 현금</SelectItem>
                  {/* 기존 호환성 */}
                  <SelectItem value="card">카드</SelectItem>
                  <SelectItem value="easy_pay">간편결제</SelectItem>
                  <SelectItem value="transfer">계좌이체</SelectItem>
                  <SelectItem value="on_site">만나서결제</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={`${sortField}-${sortDirection}`}
                onValueChange={(v) => {
                  const [field, dir] = v.split('-');
                  setSortField(field as OrderSortField);
                  setSortDirection(dir as OrderSortDirection);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">최신순</SelectItem>
                  <SelectItem value="createdAt-asc">오래된순</SelectItem>
                  <SelectItem value="amount-desc">금액 높은순</SelectItem>
                  <SelectItem value="amount-asc">금액 낮은순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* 주문 테이블 */}
      <div data-testid="admin.orders.list">
        <OrderTable
          orders={filteredOrders}
          onViewDetail={handleViewDetail}
          onUpdateStatus={handleUpdateStatus}
          isLoading={loading}
        />
      </div>

      {/* 상세 드로어 */}
      <OrderDetailDrawer
        order={selectedOrder}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedOrder(null);
        }}
      />

      {/* 인쇄용 주문서 (숨김) */}
      {selectedOrder && <PrintableOrder order={selectedOrder} />}
      {newOrderAlert.order && <PrintableOrder order={newOrderAlert.order} />}

      {/* 새 주문 알림 다이얼로그 */}
      <Dialog
        open={newOrderAlert.open}
        onOpenChange={(open) => {
          if (!open) {
            setNewOrderAlert({ open: false, order: null });
          }
        }}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#D61C1C] flex items-center gap-2">
              🔔 새 주문이 들어왔습니다!
            </DialogTitle>
            <DialogDescription>
              주문 확인 후 접수하기 버튼을 눌러주세요.
            </DialogDescription>
          </DialogHeader>
          {newOrderAlert.order && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-[#8B7355]">주문번호</Label>
                  <p className="text-lg font-semibold text-[#2E1C10]">
                    {newOrderAlert.order.orderId}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-[#8B7355]">주문 시간</Label>
                  <p className="text-lg font-semibold text-[#2E1C10]">
                    {new Date((newOrderAlert.order.createdAt as any)?.toDate?.() || newOrderAlert.order.createdAt).toLocaleTimeString('ko-KR')}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-[#8B7355]">주문 내역</Label>
                <div className="mt-2 space-y-1">
                  {newOrderAlert.order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-[#2E1C10]">
                        {item.menuName} {item.quantity > 1 && `x${item.quantity}`}
                      </span>
                      <span className="text-[#8B7355]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <div>
                  <Label className="text-sm text-[#8B7355]">총 금액</Label>
                  <p className="text-xl font-bold text-[#D61C1C]">
                    {formatPrice(newOrderAlert.order.finalAmount)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewOrderAlert({ open: false, order: null });
                    }}
                  >
                    닫기
                  </Button>
                  <Button
                    onClick={() => {
                      if (newOrderAlert.order) {
                        handleUpdateStatus(newOrderAlert.order, 'accepted');
                        setNewOrderAlert({ open: false, order: null });
                      }
                    }}
                    className="bg-[#D61C1C] hover:bg-[#B81515] text-white"
                  >
                    접수하기
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 취소 확인 다이얼로그 */}
      <Dialog
        open={cancelDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setCancelDialog({ open: false, order: null });
            setCancelReason('');
          }
        }}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>주문 취소</DialogTitle>
            <DialogDescription>
              주문번호: {cancelDialog.order?.orderId}
              <br />
              취소 사유를 입력해주세요. 고객에게 전달됩니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">취소 사유 *</Label>
              <Textarea
                id="cancel-reason"
                placeholder="예: 재료 소진으로 인한 취소"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
              />
            </div>

            {cancelDialog.order?.payment?.method === 'app_card' && (
              <div className="p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
                ⚠️ 결제가 승인된 주문입니다. 취소 시 자동으로 환불 처리됩니다.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialog({ open: false, order: null });
                setCancelReason('');
              }}
            >
              닫기
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={!cancelReason.trim()}
            >
              주문 취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

---

## src\pages\admin\Menus.tsx

```tsx
// Route: /admin/menus
/**
 * 관리자 메뉴 관리 페이지
 * Phase 2-6: 목록/검색/필터/품절 토글/시간제 설정/가격·설명 수정
 */

import { useState, useEffect } from 'react';
import { Menu, MenuCategory, MenuFilters, CATEGORY_LABELS } from '../../types/menu';
import {
  getMenus,
  getMenuStats,
  MenuStats,
  toggleMenuAvailability,
  updateMenu,
  updateMenuAvailableHours,
  createMenu,
  deleteMenu,
} from '../../lib/admin/menus.api';
import { useAuth } from '../../contexts/AuthContext';
import { MenuTable } from '../../components/admin/MenuTable';
import { MenuEditDialog } from '../../components/admin/MenuEditDialog';
import { MenuCreateDialog } from '../../components/admin/MenuCreateDialog';
import { MenuCSVImport } from '../../components/admin/MenuCSVImport';
import { TimeSettingDialog } from '../../components/admin/TimeSettingDialog';
import { StatCard } from '../../components/admin/common/StatCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Search, RefreshCw, Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';

export function AdminMenus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [stats, setStats] = useState<MenuStats | null>(null);
  const [filters, setFilters] = useState<MenuFilters>({
    category: 'all',
    search: '',
    sortBy: 'order',
    availableOnly: false,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // 생성 다이얼로그
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // CSV 임포트 다이얼로그
  const [csvImportOpen, setCsvImportOpen] = useState(false);

  // 편집 다이얼로그
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // 시간제 다이얼로그
  const [timeSettingMenu, setTimeSettingMenu] = useState<Menu | null>(null);
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);

  // 삭제 확인 다이얼로그
  const [deletingMenuId, setDeletingMenuId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Undo 관련
  const [lastCreatedMenuId, setLastCreatedMenuId] = useState<string | null>(null);

  const { user } = useAuth();

  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    try {
      const [menusData, statsData] = await Promise.all([
        getMenus(filters),
        getMenuStats(),
      ]);
      setMenus(menusData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load menus:', error);
      toast.error('메뉴 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  // 품절 토글
  const handleToggleAvailability = async (menuId: string) => {
    if (!user) return;

    setActionLoading(true);
    try {
      const updated = await toggleMenuAvailability(menuId, user.uid, user.displayName || '관리자');
      
      // UI 즉시 반영
      setMenus(prev => 
        prev.map(m => m.menuId === menuId ? updated : m)
      );

      toast.success(
        updated.isAvailable ? '판매를 재개했습니다' : '품절 처리했습니다'
      );

      // 통계 갱신
      loadData();
    } catch (error: any) {
      console.error('Failed to toggle availability:', error);
      toast.error(error.message || '상태 변경에 실패했습니다');
    } finally {
      setActionLoading(false);
    }
  };

  // 메뉴 편집
  const handleEditMenu = (menu: Menu) => {
    setEditingMenu(menu);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (
    updates: { name?: string; category?: MenuCategory; price?: number; description?: string; image?: string; availableHours?: { start: string; end: string } | null },
    reason: string
  ) => {
    if (!user || !editingMenu) return;

    setActionLoading(true);
    try {
      // availableHours가 있으면 별도로 업데이트
      if ('availableHours' in updates) {
        await updateMenuAvailableHours(
          editingMenu.menuId,
          updates.availableHours || null,
          user.uid,
          user.name || '관리자'
        );
        // availableHours를 updates에서 제거
        const { availableHours, ...menuUpdates } = updates;
        if (Object.keys(menuUpdates).length > 0) {
          await updateMenu(
            editingMenu.menuId,
            menuUpdates,
            user.uid,
            user.name || '관리자',
            reason
          );
        }
      } else {
        await updateMenu(
          editingMenu.menuId,
          updates,
          user.uid,
          user.name || '관리자',
          reason
        );
      }

      // 데이터 다시 로드하여 최신 상태 반영
      await loadData();

      toast.success('메뉴 정보를 수정했습니다');
      setEditingMenu(null);
      setEditDialogOpen(false);
    } catch (error: any) {
      console.error('Failed to update menu:', error);
      toast.error(error.message || '메뉴 수정에 실패했습니다');
    } finally {
      setActionLoading(false);
    }
  };

  // 시간제 설정
  const handleSetTimeLimit = (menu: Menu) => {
    setTimeSettingMenu(menu);
    setTimeDialogOpen(true);
  };

  const handleSaveTimeLimit = async (
    hours: { start: string; end: string } | null
  ) => {
    if (!user || !timeSettingMenu) return;

    setActionLoading(true);
    try {
      const updated = await updateMenuAvailableHours(
        timeSettingMenu.menuId,
        hours,
        user.uid,
        user.name
      );

      // UI 즉시 반영
      setMenus(prev =>
        prev.map(m => m.menuId === timeSettingMenu.menuId ? updated : m)
      );

      toast.success(
        hours ? '시간제 판매를 설정했습니다' : '시간제 판매를 해제했습니다'
      );
      setTimeDialogOpen(false);
      setTimeSettingMenu(null);

      // 통계 갱신
      loadData();
    } catch (error: any) {
      console.error('Failed to update time limit:', error);
      toast.error(error.message || '시간제 설정에 실패했습니다');
    } finally {
      setActionLoading(false);
    }
  };

  // 메뉴 생성
  const handleCreateMenu = async (menuData: Partial<Menu>) => {
    console.log('[handleCreateMenu] Called with menuData:', menuData);
    if (!user) {
      console.error('[handleCreateMenu] No user found');
      return;
    }
    console.log('[handleCreateMenu] User:', user.uid, user.displayName);

    try {
      console.log('[handleCreateMenu] Calling createMenu...');
      const newMenu = await createMenu(menuData, user.uid, user.displayName || '관리자');
      console.log('[handleCreateMenu] createMenu returned:', newMenu);

      // UI 즉시 반영 (최상단 추가)
      setMenus(prev => [newMenu, ...prev]);
      setLastCreatedMenuId(newMenu.menuId);

      // 통계 갱신
      loadData();

      // Undo 토스트 (5초)
      toast.success('메뉴가 등록되었습니다', {
        duration: 5000,
        action: {
          label: '취소',
          onClick: () => handleUndoCreate(newMenu.menuId),
        },
      });
    } catch (error: any) {
      // 에러 메시지는 createMenu에서 이미 명확하게 설정됨
      console.error('[handleCreateMenu] Menu creation failed:', error);
      toast.error(error.message || '메뉴 등록에 실패했습니다');
    }
  };

  // 생성 취소 (Undo)
  const handleUndoCreate = async (menuId: string) => {
    if (!user) return;

    try {
      await deleteMenu(menuId, user.uid, user.displayName || '관리자');

      // UI에서 제거
      setMenus(prev => prev.filter(m => m.menuId !== menuId));
      setLastCreatedMenuId(null);

      toast.success('메뉴 등록이 취소되었습니다');

      // 통계 갱신
      loadData();
    } catch (error: any) {
      console.error('Failed to undo create:', error);
      toast.error(error.message || '취소에 실패했습니다');
    }
  };

  // 삭제 핸들러
  const handleDelete = (menuId: string) => {
    setDeletingMenuId(menuId);
    setDeleteDialogOpen(true);
  };

  // 삭제 확인
  const handleConfirmDelete = async () => {
    if (!user || !deletingMenuId) return;

    setActionLoading(true);
    try {
      await deleteMenu(deletingMenuId, user.uid, user.displayName || '관리자');

      // UI에서 제거
      setMenus(prev => prev.filter(m => m.menuId !== deletingMenuId));

      toast.success('메뉴가 삭제되었습니다');

      // 통계 갱신
      loadData();

      // 다이얼로그 닫기
      setDeleteDialogOpen(false);
      setDeletingMenuId(null);
    } catch (error: any) {
      console.error('Failed to delete menu:', error);
      toast.error(error.message || '메뉴 삭제에 실패했습니다');
    } finally {
      setActionLoading(false);
    }
  };

  // CSV 일괄 등록
  const handleCSVImport = async (menus: Partial<Menu>[]) => {
    if (!user) return;

    const createdMenus: Menu[] = [];

    for (const menuData of menus) {
      try {
        const newMenu = await createMenu(menuData, user.uid, user.displayName || '관리자');
        createdMenus.push(newMenu);
      } catch (error) {
        console.error('Failed to create menu:', error);
      }
    }

    // UI 반영
    setMenus(prev => [...createdMenus, ...prev]);

    // 통계 갱신
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#333] mb-2">메뉴 관리</h1>
          <p className="text-[#8B7355]">
            메뉴 정보를 관리하고 품절 상태를 변경하세요
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCsvImportOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            CSV 일괄등록
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            메뉴 등록
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="전체 메뉴"
            value={stats.total}
            subtitle="등록된 메뉴"
          />
          <StatCard
            title="판매 중"
            value={stats.available}
            subtitle="현재 주문 가능"
            variant="success"
          />
          <StatCard
            title="품절"
            value={stats.soldout}
            subtitle="일시 품절"
            variant="warning"
          />
          <StatCard
            title="시간외"
            value={stats.timeLimited}
            subtitle="시간제 메뉴"
            variant="info"
          />
        </div>
      )}

      {/* 필터 & 검색 */}
      <div className="space-y-4">
        {/* 카테고리 탭 */}
        <Tabs
          value={filters.category || 'all'}
          onValueChange={(value) =>
            setFilters(prev => ({ ...prev, category: value as MenuCategory | 'all' }))
          }
        >
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="noodle">{CATEGORY_LABELS.noodle}</TabsTrigger>
            <TabsTrigger value="set">{CATEGORY_LABELS.set}</TabsTrigger>
            <TabsTrigger value="side">{CATEGORY_LABELS.side}</TabsTrigger>
            <TabsTrigger value="drink">{CATEGORY_LABELS.drink}</TabsTrigger>
            <TabsTrigger value="alcohol">{CATEGORY_LABELS.alcohol}</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 검색 & 정렬 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="메뉴명, 설명, 태그 검색..."
              value={filters.search}
              onChange={(e) =>
                setFilters(prev => ({ ...prev, search: e.target.value }))
              }
              className="pl-10"
            />
          </div>

          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              setFilters(prev => ({
                ...prev,
                sortBy: value as MenuFilters['sortBy'],
              }))
            }
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order">기본 순서</SelectItem>
              <SelectItem value="name">이름순</SelectItem>
              <SelectItem value="price-asc">가격 낮은순</SelectItem>
              <SelectItem value="price-desc">가격 높은순</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* 메뉴 테이블 */}
      <MenuTable
        menus={menus}
        onToggleAvailability={handleToggleAvailability}
        onEdit={handleEditMenu}
        onSetTimeLimit={handleSetTimeLimit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* 생성 다이얼로그 */}
      <MenuCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSave={handleCreateMenu}
      />

      {/* CSV 일괄 등록 다이얼로그 */}
      <MenuCSVImport
        open={csvImportOpen}
        onOpenChange={setCsvImportOpen}
        onImport={handleCSVImport}
      />

      {/* 편집 다이얼로그 */}
      <MenuEditDialog
        menu={editingMenu}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveEdit}
        loading={actionLoading}
      />

      {/* 시간제 설정 다이얼로그 */}
      <TimeSettingDialog
        menu={timeSettingMenu}
        open={timeDialogOpen}
        onOpenChange={setTimeDialogOpen}
        onSave={handleSaveTimeLimit}
        loading={actionLoading}
      />

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>메뉴 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 메뉴를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

```

---

## src\pages\admin\Reviews.tsx

```tsx
// Route: /admin/reviews
import { useState, useEffect } from 'react';
import { Star, Image as ImageIcon, Filter, SortAsc } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ReviewCard } from '../../components/admin/ReviewCard';
import { ReplyModal } from '../../components/admin/ReplyModal';
import { ReportDialog } from '../../components/admin/ReportDialog';
import {
  getReviews,
  getReviewStats,
  addReviewReply,
  deleteReviewReply,
  reportReview,
  hideReview,
} from '../../lib/admin/reviews.api';
import { getCurrentUser } from '../../lib/auth';
import type { Review, ReviewStats } from '../../types/review';
import type { ReviewReportReason } from '../../types/review';
import { toast } from 'sonner';

type FilterType = 'all' | 'photo' | 'reported';
type SortType = 'latest' | 'rating_high' | 'rating_low';

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // 필터/정렬
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('latest');

  // 모달
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const storeId = 'store-hyunpung';

  useEffect(() => {
    loadData();
  }, [filter, sortBy]);

  async function loadData() {
    setLoading(true);
    try {
      const [reviewsData, statsData] = await Promise.all([
        getReviews({
          storeId,
          photoOnly: filter === 'photo',
          reported: filter === 'reported',
          sortBy,
          limit: 10,
          offset: 0,
        }),
        getReviewStats(storeId),
      ]);

      setReviews(reviewsData.reviews);
      setHasMore(reviewsData.hasMore);
      setStats(statsData);
    } catch (error) {
      console.error('리뷰 로딩 실패:', error);
      toast.error('리뷰를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      const data = await getReviews({
        storeId,
        photoOnly: filter === 'photo',
        reported: filter === 'reported',
        sortBy,
        limit: 10,
        offset: reviews.length,
      });

      setReviews([...reviews, ...data.reviews]);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('리뷰 로딩 실패:', error);
      toast.error('리뷰를 불러오는데 실패했습니다.');
    } finally {
      setLoadingMore(false);
    }
  }

  function handleReply(reviewId: string) {
    const review = (reviews || []).find((r) => r.id === reviewId);
    if (!review) return;

    setSelectedReview(review);
    setReplyModalOpen(true);
  }

  async function handleReplySubmit(reviewId: string, text: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('인증 필요');

    await addReviewReply(reviewId, {
      text,
      by: user.displayName,
    });

    // UI 업데이트
    setReviews(
      reviews.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              reply: {
                text,
                by: user.displayName,
                at: Date.now(),
              },
            }
          : r
      )
    );
  }

  async function handleReplyDelete(reviewId: string) {
    await deleteReviewReply(reviewId);

    // UI 업데이트
    setReviews(
      reviews.map((r) => {
        if (r.id === reviewId) {
          const { reply, ...rest } = r;
          return rest;
        }
        return r;
      })
    );
  }

  function handleReport(reviewId: string) {
    setSelectedReviewId(reviewId);
    setReportDialogOpen(true);
  }

  async function handleReportSubmit(
    reviewId: string,
    reason: ReviewReportReason,
    description?: string
  ) {
    const user = await getCurrentUser();
    if (!user) throw new Error('인증 필요');

    await reportReview(reviewId, reason, user.uid, description);

    // UI 업데이트
    setReviews(
      reviews.map((r) =>
        r.id === reviewId
          ? { ...r, reportedCount: (r.reportedCount || 0) + 1 }
          : r
      )
    );
  }

  async function handleToggleHidden(reviewId: string, hidden: boolean) {
    try {
      await hideReview(reviewId, hidden);

      // UI 업데이트
      setReviews(
        reviews.map((r) => (r.id === reviewId ? { ...r, isHidden: hidden } : r))
      );

      toast.success(hidden ? '리뷰를 숨겼습니다.' : '리뷰를 표시했습니다.');
    } catch (error) {
      console.error('리뷰 숨김 처리 실패:', error);
      toast.error('리뷰 숨김 처리에 실패했습니다.');
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl text-[#333] mb-2">리뷰 관리</h1>
        <p className="text-[#8B7355]">
          고객 리뷰를 확인하고 답글을 작성하세요
        </p>
      </div>

      {/* 통계 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#8B7355]">총 리뷰</span>
              <Star className="w-5 h-5 text-[#F37021]" />
            </div>
            <p className="text-2xl text-[#333]">{stats.totalCount}개</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#8B7355]">평균 평점</span>
              <Star className="w-5 h-5 text-[#F37021] fill-current" />
            </div>
            <p className="text-2xl text-[#333]">
              {stats.averageRating.toFixed(1)}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#8B7355]">사진 리뷰</span>
              <ImageIcon className="w-5 h-5 text-[#F37021]" />
            </div>
            <p className="text-2xl text-[#333]">
              {stats.photoCount}개
              <span className="text-[#8B7355] ml-2">
                ({((stats.photoCount / stats.totalCount) * 100).toFixed(0)}%)
              </span>
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-2">
              <span className="text-[#8B7355]">별점 분포</span>
            </div>
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-[#8B7355] w-3">{rating}</span>
                  <div className="flex-1 h-2 bg-[#E5DDD5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F37021]"
                      style={{
                        width: `${
                          (stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] /
                            stats.totalCount) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-[#8B7355] w-6 text-right">
                    {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 필터 & 정렬 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* 필터 탭 */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
          <TabsList>
            <TabsTrigger value="all">
              전체
              {stats && (
                <Badge variant="secondary" className="ml-2">
                  {stats.totalCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="photo">
              사진리뷰
              {stats && (
                <Badge variant="secondary" className="ml-2">
                  {stats.photoCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reported">
              신고됨
              {reviews.filter((r) => (r.reportedCount || 0) > 0).length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {reviews.filter((r) => (r.reportedCount || 0) > 0).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 정렬 */}
        <div className="flex items-center gap-2 ml-auto">
          <SortAsc className="w-4 h-4 text-[#8B7355]" />
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortType)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="rating_high">평점 높은순</SelectItem>
              <SelectItem value="rating_low">평점 낮은순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 리뷰 목록 */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="space-y-3">
                <div className="h-4 bg-[#E5DDD5] rounded w-1/4" />
                <div className="h-4 bg-[#E5DDD5] rounded w-full" />
                <div className="h-4 bg-[#E5DDD5] rounded w-3/4" />
              </div>
            </Card>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F37021]/10 flex items-center justify-center">
            <Star className="w-8 h-8 text-[#F37021]" />
          </div>
          <p className="text-[#8B7355] mb-2">리뷰가 없습니다</p>
          <p className="text-[#8B7355]">
            고객이 리뷰를 남기면 여기에 표시됩니다
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onReply={handleReply}
              onReport={handleReport}
              onToggleHidden={handleToggleHidden}
            />
          ))}

          {/* 더 보기 버튼 */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loadingMore}
                className="min-w-[200px]"
              >
                {loadingMore ? '로딩 중...' : '더 보기'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 답글 모달 */}
      <ReplyModal
        open={replyModalOpen}
        onOpenChange={setReplyModalOpen}
        review={selectedReview}
        onSubmit={handleReplySubmit}
        onDelete={handleReplyDelete}
      />

      {/* 신고 다이얼로그 */}
      <ReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        reviewId={selectedReviewId}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}

```

---

## src\pages\admin\Analytics.tsx

```tsx
// Route: /admin/analytics
/**
 * 관리자 관제/메트릭 페이지
 * Phase 2-9: KPI 대시보드 + 차트
 */

import { useState, useEffect } from 'react';
import {
  getKPIData,
  getHourlyOrders,
  getTopMenuSales,
  getDailySales,
  KPIData,
  HourlyOrders,
  MenuSales,
  DailySales,
} from '../../lib/admin/analytics.api';
import { StatCard } from '../../components/admin/common/StatCard';
import { Card } from '../../components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, Star, Download, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

export function AdminAnalytics() {
  const [kpi, setKpi] = useState<KPIData | null>(null);
  const [hourlyOrders, setHourlyOrders] = useState<HourlyOrders[]>([]);
  const [topMenus, setTopMenus] = useState<MenuSales[]>([]);
  const [dailySales, setDailySales] = useState<DailySales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [kpiData, hourlyData, menuData, salesData] = await Promise.all([
        getKPIData(),
        getHourlyOrders(),
        getTopMenuSales(),
        getDailySales(),
      ]);

      setKpi(kpiData);
      setHourlyOrders(hourlyData);
      setTopMenus(menuData);
      setDailySales(salesData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('데이터를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !kpi) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl text-[#333] mb-2">관제 대시보드</h1>
          <p className="text-[#8B7355]">핵심 지표와 퍼널 데이터를 확인하세요</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#333] mb-2">관제 대시보드</h1>
          <p className="text-[#8B7355]">
            핵심 지표와 퍼널 데이터를 확인하세요
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            리포트
          </Button>
        </div>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          title="오늘 매출"
          value={`${(kpi.todaySales / 10000).toFixed(0)}만원`}
          subtitle={`${kpi.todayOrders}건`}
          icon={TrendingUp}
        />
        <StatCard
          title="주문 수"
          value={kpi.todayOrders}
          subtitle="오늘 주문"
          variant="success"
        />
        <StatCard
          title="평균 평점"
          value={kpi.avgRating.toFixed(1)}
          subtitle="전체 리뷰"
          icon={Star}
          variant="info"
        />
        <StatCard
          title="설치율"
          value={`${kpi.installRate}%`}
          subtitle="A2HS 설치"
          icon={Download}
          variant="warning"
        />
        <StatCard
          title="전환율"
          value={`${kpi.conversionRate}%`}
          subtitle="방문→주문"
          icon={Users}
        />
      </div>

      {/* 차트 1: 일별 매출 추이 */}
      <Card className="p-6">
        <h3 className="text-lg text-[#333] mb-4">일별 매출 추이 (최근 7일)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailySales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value: any) => `${(value / 10000).toFixed(0)}만원`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#D61C1C"
              strokeWidth={2}
              name="매출"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* 차트 2: 시간대별 주문 */}
      <Card className="p-6">
        <h3 className="text-lg text-[#333] mb-4">시간대별 주문 (오늘)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hourlyOrders}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tickFormatter={(h) => `${h}시`} />
            <YAxis />
            <Tooltip labelFormatter={(h) => `${h}시`} />
            <Legend />
            <Bar dataKey="orders" fill="#F37021" name="주문 건수" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* 차트 3: 메뉴별 매출 Top 5 */}
      <Card className="p-6">
        <h3 className="text-lg text-[#333] mb-4">메뉴별 매출 Top 5</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topMenus} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v) => `${(v / 10000).toFixed(0)}만원`} />
            <YAxis type="category" dataKey="menuName" width={120} />
            <Tooltip
              formatter={(value: any) => `${(value / 10000).toFixed(0)}만원`}
            />
            <Legend />
            <Bar dataKey="sales" fill="#C7A45A" name="매출" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* 집계 정보 */}
      <Card className="p-6">
        <h3 className="text-lg text-[#333] mb-4">데이터 집계 정보</h3>
        <div className="space-y-2 text-sm text-[#8B7355]">
          <div className="flex items-start gap-2">
            <span className="text-[#D61C1C]">•</span>
            <span><strong>실시간 업데이트:</strong> Firebase Firestore onSnapshot (연동 시)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#F37021]">•</span>
            <span><strong>주간 리포트:</strong> 매주 월요일 04:00 자동 생성 (Functions)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#C7A45A]">•</span>
            <span><strong>이벤트 로깅:</strong> install_*, menu_view, add_to_cart, payment_*, order_*, review_*</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span><strong>알림 (준비):</strong> 결제 실패, 주문 폭증, 평점 급락 등 (FCM)</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

```

---

## src\pages\admin\IntegratedAnalytics.tsx

```tsx
// Route: /admin/integrated-analytics
/**
 * 통합 분석 페이지
 * Phase 3-7: 통합 리포트
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  Download,
  RefreshCw,
  TrendingUp,
  Users,
  Star,
  Gift,
  Zap,
  MessageSquare,
  Truck,
  Bell,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  generateIntegratedReport,
  exportReportToCSV,
} from '../../lib/admin/integrated-analytics.api';
import type { IntegratedReport, DateRange } from '../../types/analytics';
import { formatPrice } from '../../lib/utils';

const COLORS = ['#D61C1C', '#F37021', '#C7A45A', '#8B7355', '#4A4A4A'];

export function IntegratedAnalytics() {
  const [report, setReport] = useState<IntegratedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    loadReport();
  }, [period]);

  const getDateRange = (): DateRange => {
    const end = new Date();
    const start = new Date();
    
    if (period === 'weekly') {
      start.setDate(end.getDate() - 7);
    } else {
      start.setDate(end.getDate() - 30);
    }
    
    return { start, end };
  };

  const loadReport = async () => {
    setLoading(true);
    try {
      const dateRange = getDateRange();
      const data = await generateIntegratedReport(period, dateRange);
      setReport(data);
    } catch (error) {
      console.error('Failed to load report:', error);
      toast.error('리포트를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!report) return;

    try {
      const csv = exportReportToCSV(report);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `통합리포트_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('리포트를 다운로드했습니다');
    } catch (error) {
      console.error('Failed to export report:', error);
      toast.error('다운로드에 실패했습니다');
    }
  };

  // 데이터 존재 여부 확인
  const hasData = report && (
    report.kpi.totalOrders > 0 ||
    report.kpi.totalSales > 0 ||
    report.hourlyAnalysis.length > 0 ||
    report.dayOfWeekAnalysis.length > 0 ||
    report.topMenus.length > 0 ||
    report.couponEffectiveness.length > 0 ||
    (report.pointsEffectiveness.totalEarned > 0 || report.pointsEffectiveness.totalSpent > 0) ||
    report.reviewAnalysis.totalReviews > 0 ||
    report.deliveryPerformance.totalDeliveries > 0 ||
    report.notificationEffectiveness.totalSent > 0
  );

  if (loading || !report) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-[#333] mb-2">통합 분석</h1>
            <p className="text-[#8B7355]">종합 성과 분석 및 인사이트</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // 빈 상태 UI
  if (!hasData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-[#333] mb-2">통합 분석</h1>
            <p className="text-[#8B7355]">종합 성과 분석 및 인사이트</p>
          </div>
          <div className="flex gap-2">
            <Tabs value={period} onValueChange={(value: any) => setPeriod(value)}>
              <TabsList>
                <TabsTrigger value="weekly">주간</TabsTrigger>
                <TabsTrigger value="monthly">월간</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" onClick={loadReport}>
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
          </div>
        </div>

        <Card className="bg-white">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <TrendingUp className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-[#333] mb-2">
              아직 통합 리포트 데이터가 없습니다
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
              실제 주문, 리뷰, 쿠폰, 포인트 데이터가 쌓이면 자동으로 리포트가 생성됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#333] mb-2">통합 분석</h1>
          <p className="text-[#8B7355]">
            {report.dateRange.start.toLocaleDateString()} ~ {report.dateRange.end.toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Tabs value={period} onValueChange={(value: any) => setPeriod(value)}>
            <TabsList>
              <TabsTrigger value="weekly">주간</TabsTrigger>
              <TabsTrigger value="monthly">월간</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={loadReport}>
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            CSV 다운로드
          </Button>
        </div>
      </div>

      {/* KPI 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#D61C1C]" />
              총 매출
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{formatPrice(report.kpi.totalSales)}</div>
            <p className="text-xs text-gray-500 mt-1">
              평균 {formatPrice(report.kpi.averageOrderValue)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#F37021]" />
              고객
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{report.kpi.newCustomers + report.kpi.returningCustomers}명</div>
            <p className="text-xs text-gray-500 mt-1">
              유지율 {report.kpi.customerRetentionRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#C7A45A]" />
              평점
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{report.kpi.averageRating.toFixed(1)}점</div>
            <p className="text-xs text-gray-500 mt-1">
              리뷰 {report.kpi.totalReviews}개
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#D61C1C]" />
              쿠폰 사용률
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{report.kpi.couponUsageRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-500 mt-1">
              할인 {(report.kpi.totalDiscount / 10000).toFixed(0)}만원
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 인사이트 및 제안 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#F37021]" />
              <h3 className="text-sm">주요 인사이트</h3>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(report.insights || []).map((insight, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#D61C1C] mt-0.5">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#C7A45A]" />
              <h3 className="text-sm">개선 제안</h3>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(report.recommendations || []).map((rec, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#F37021] mt-0.5">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* 탭 메뉴 */}
      <Tabs defaultValue="hourly" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="hourly">시간대별</TabsTrigger>
          <TabsTrigger value="menu">메뉴 성과</TabsTrigger>
          <TabsTrigger value="coupon">쿠폰 효과</TabsTrigger>
          <TabsTrigger value="points">포인트</TabsTrigger>
          <TabsTrigger value="review">리뷰</TabsTrigger>
          <TabsTrigger value="delivery">배달</TabsTrigger>
          <TabsTrigger value="notification">알림</TabsTrigger>
        </TabsList>

        {/* 시간대별 분석 */}
        <TabsContent value="hourly" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <h3 className="text-sm">시간대별 주문 분석</h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={report.hourlyAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tickFormatter={(value) => `${value}시`} />
                  <YAxis />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      if (name === 'orders') return [value, '주문 수'];
                      if (name === 'sales') return [formatPrice(value), '매출'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="orders" fill="#D61C1C" name="주문 수" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <h3 className="text-sm">요일별 매출</h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={report.dayOfWeekAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dayName" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => formatPrice(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#F37021"
                    name="매출"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 메뉴 성과 */}
        <TabsContent value="menu" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <h3 className="text-sm">메뉴별 성과</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(report.topMenus || []).map((menu, index) => (
                  <div key={menu.menuId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <p className="text-sm">{menu.menuName}</p>
                        <p className="text-xs text-gray-500">
                          {menu.totalOrders}건 · ⭐ {menu.averageRating.toFixed(1)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{formatPrice(menu.totalSales)}</p>
                      <p className="text-xs text-gray-500">리뷰 {menu.reviewCount}개</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 쿠폰 효과 */}
        <TabsContent value="coupon" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <h3 className="text-sm">쿠폰 효과 분석</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.couponEffectiveness.map((coupon) => (
                  <div key={coupon.couponType} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">{coupon.couponType}</p>
                      <Badge variant="default">ROI {coupon.roi.toFixed(1)}x</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                      <div>
                        <p className="text-gray-500">발급/사용</p>
                        <p>{coupon.totalIssued} / {coupon.totalUsed}건</p>
                      </div>
                      <div>
                        <p className="text-gray-500">사용률</p>
                        <p>{coupon.usageRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">할인액</p>
                        <p>{formatPrice(coupon.totalDiscount)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 포인트 */}
        <TabsContent value="points" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <h3 className="text-sm">포인트 효과 분석</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">적립 포인트</p>
                  <p className="text-lg">{report.pointsEffectiveness.totalEarned.toLocaleString()}P</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">사용 포인트</p>
                  <p className="text-lg">{report.pointsEffectiveness.totalSpent.toLocaleString()}P</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">사용률</p>
                  <p className="text-lg">{report.pointsEffectiveness.redemptionRate.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">활성 사용자</p>
                  <p className="text-lg">{report.pointsEffectiveness.activeUsers}명</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-4">
                💡 포인트 사용 시 평균 주문 금액이 {formatPrice(report.pointsEffectiveness.orderIncreaseWithPoints)} 증가합니다.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 리뷰 */}
        <TabsContent value="review" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <h3 className="text-sm">리뷰 분석</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">평균 평점</p>
                  <p className="text-lg">⭐ {report.reviewAnalysis.averageRating.toFixed(1)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">총 리뷰</p>
                  <p className="text-lg">{report.reviewAnalysis.totalReviews}개</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">사진 리뷰율</p>
                  <p className="text-lg">{report.reviewAnalysis.photoReviewRate.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">답글 작성률</p>
                  <p className="text-lg">{report.reviewAnalysis.responseRate.toFixed(1)}%</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">주요 키워드</p>
                <div className="flex flex-wrap gap-2">
                  {report.reviewAnalysis.topKeywords.map((keyword) => (
                    <Badge key={keyword.keyword} variant="secondary">
                      {keyword.keyword} ({keyword.count})
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 배달 */}
        <TabsContent value="delivery" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#D61C1C]" />
                <h3 className="text-sm">배달 성과</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">총 배달</p>
                  <p className="text-lg">{report.deliveryPerformance.totalDeliveries}건</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">평균 배달 시간</p>
                  <p className="text-lg">{report.deliveryPerformance.averageDeliveryTime.toFixed(1)}분</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">정시 배달률</p>
                  <p className="text-lg">{report.deliveryPerformance.onTimeRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 */}
        <TabsContent value="notification" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#F37021]" />
                <h3 className="text-sm">알림 효과</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">발송</p>
                  <p className="text-lg">{report.notificationEffectiveness.totalSent}건</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">읽음률</p>
                  <p className="text-lg">{report.notificationEffectiveness.readRate.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">클릭률</p>
                  <p className="text-lg">{report.notificationEffectiveness.clickRate.toFixed(1)}%</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">타입별 성과</p>
                <div className="space-y-2">
                  {Object.entries(report.notificationEffectiveness.byType).map(([type, stats]) => (
                    <div key={type} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                      <span className="text-gray-700">{type}</span>
                      <span className="text-gray-500">
                        {stats.sent}건 · 읽음 {((stats.read / stats.sent) * 100).toFixed(0)}% · 클릭 {((stats.clicked / stats.sent) * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

```

---

## src\pages\admin\Delivery.tsx

```tsx
// Route: /admin/delivery
/**
 * 관리자 배달 관제 페이지
 * Phase 3-1: GPS Tracking
 * 
 * 모든 배달 현황을 실시간으로 모니터링
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Clock, AlertTriangle, RefreshCw, Package, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { getAllMockTasks, subscribeMockTasks } from '../../lib/delivery';
import { isDeliveryEnabled } from '../../lib/delivery';
import { getSettings } from '../../lib/admin/settings.api';
import type { DeliveryTask, DeliveryStatus } from '../../types/delivery';
import type { StoreSettings } from '../../types/settings';

const STATUS_CONFIG: Record<DeliveryStatus, { label: string; color: string }> = {
  assigned: { label: '배정됨', color: 'bg-blue-500' },
  picked_up: { label: '픽업 완료', color: 'bg-purple-500' },
  delivering: { label: '배달 중', color: 'bg-orange-500' },
  completed: { label: '완료', color: 'bg-green-500' },
  canceled: { label: '취소', color: 'bg-gray-500' },
};

const SLA_THRESHOLD_MINUTES = 45; // SLA 기준: 45분

export function AdminDelivery() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<DeliveryTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'delayed'>('all');
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    // 설정 로드
    loadSettings();

    if (!isDeliveryEnabled) return;

    // 초기 로드
    loadTasks();

    // 실시간 구독
    const unsubscribe = subscribeMockTasks(() => {
      loadTasks();
    });

    return unsubscribe;
  }, []);

  async function loadSettings() {
    try {
      const data = await getSettings('store-001');
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  function loadTasks() {
    try {
      setLoading(true);
      const allTasks = getAllMockTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error('Failed to load delivery tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  // 배달 추적 비활성화 또는 미설정
  const deliveryProvider = settings?.deliveryProvider;
  const isConfigured = deliveryProvider?.enabled && deliveryProvider?.provider;
  
  if (!isDeliveryEnabled && !isConfigured) {
    return (
      <div className="p-6 space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            배달 추적 기능이 활성화되지 않았습니다.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>배달대행사 연동 설정</CardTitle>
            <CardDescription>
              실시간 배달 추적을 사용하려면 배달대행사 API를 설정해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/admin/settings?tab=delivery')}
              className="w-full"
            >
              <Settings className="w-4 h-4 mr-2" />
              설정 페이지로 이동
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 통계 계산
  const activeTasks = (tasks || []).filter(
    (t) => t.status !== 'completed' && t.status !== 'canceled'
  );
  const delayedTasks = activeTasks.filter((t) => {
    const elapsed = (Date.now() - t.createdAt) / 1000 / 60; // 분
    return elapsed > SLA_THRESHOLD_MINUTES;
  });

  const filteredTasks =
    selectedTab === 'all'
      ? tasks
      : selectedTab === 'active'
      ? activeTasks
      : delayedTasks;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#2E1C10]">배달 관제</h1>
          <p className="text-sm text-[#2E1C10]/60">
            실시간 배달 현황 모니터링
            {deliveryProvider && (
              <Badge variant="secondary" className="ml-2">
                {deliveryProvider.provider === 'mock' && 'Mock (테스트)'}
                {deliveryProvider.provider === 'providerA' && 'Provider A'}
                {deliveryProvider.provider === 'custom' && deliveryProvider.custom?.name}
              </Badge>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/settings?tab=delivery')}
          >
            <Settings className="w-4 h-4 mr-2" />
            설정
          </Button>
          <Button
            variant="outline"
            onClick={loadTasks}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>전체 배달</CardDescription>
            <CardTitle className="text-3xl">{tasks.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <Package className="w-3 h-3 inline mr-1" />
              총 배달 건수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>진행 중</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{activeTasks.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <Navigation className="w-3 h-3 inline mr-1" />
              현재 배달 중
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>완료</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {tasks.filter((t) => t.status === 'completed').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <Package className="w-3 h-3 inline mr-1" />
              배달 완료
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>SLA 지연</CardDescription>
            <CardTitle className="text-3xl text-red-600">{delayedTasks.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              {SLA_THRESHOLD_MINUTES}분 초과
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SLA 지연 알림 */}
      {delayedTasks.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {delayedTasks.length}개의 배달이 SLA 기준({SLA_THRESHOLD_MINUTES}분)을 초과했습니다.
            즉시 확인이 필요합니다.
          </AlertDescription>
        </Alert>
      )}

      {/* 배달 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>배달 목록</CardTitle>
          <CardDescription>
            실시간으로 업데이트되는 배달 현황
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
            <TabsList>
              <TabsTrigger value="all">
                전체 ({tasks.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                진행 중 ({activeTasks.length})
              </TabsTrigger>
              <TabsTrigger value="delayed">
                지연 ({delayedTasks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  배달 내역이 없습니다
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <DeliveryTaskCard key={task.taskId} task={task} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 지도 뷰 (TODO) */}
      <Card>
        <CardHeader>
          <CardTitle>배달 지도</CardTitle>
          <CardDescription>
            모든 배달 기사의 실시간 위치
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="w-16 h-16 text-[#D61C1C] mx-auto" />
              <p className="text-[#2E1C10]">지도 뷰</p>
              <p className="text-sm text-[#2E1C10]/60">
                TODO: Kakao Maps / Google Maps 연동
              </p>
              <p className="text-xs text-[#2E1C10]/40">
                배달대행사의 API 연결 후 확인 가능한 메뉴입니다
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 개별 배달 태스크 카드
 */
function DeliveryTaskCard({ task }: { task: DeliveryTask }) {
  const elapsed = (Date.now() - task.createdAt) / 1000 / 60; // 분
  const isDelayed = elapsed > SLA_THRESHOLD_MINUTES && 
                    task.status !== 'completed' && 
                    task.status !== 'canceled';

  const statusInfo = STATUS_CONFIG[task.status];

  return (
    <div 
      className={`p-4 rounded-lg border-2 ${
        isDelayed ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-mono text-[#2E1C10]">
              {task.taskId}
            </span>
            <Badge 
              variant="secondary" 
              className={`${statusInfo.color} text-white`}
            >
              {statusInfo.label}
            </Badge>
            {isDelayed && (
              <Badge variant="destructive" className="animate-pulse">
                <AlertTriangle className="w-3 h-3 mr-1" />
                SLA 초과
              </Badge>
            )}
          </div>
          <p className="text-sm text-[#2E1C10]/60">
            주문 ID: {task.orderId}
          </p>
        </div>

        {task.eta !== undefined && task.eta > 0 && (
          <div className="text-right">
            <p className="text-xs text-[#2E1C10]/60">예상 도착</p>
            <p className={`text-lg ${isDelayed ? 'text-red-600' : 'text-[#F37021]'}`}>
              {task.eta}분
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-[#2E1C10]/60 mb-1">배달기사</p>
          <p className="text-[#2E1C10] font-mono">
            {task.driverId || '-'}
          </p>
        </div>

        <div>
          <p className="text-[#2E1C10]/60 mb-1">경과 시간</p>
          <p className={`text-[#2E1C10] ${isDelayed ? 'text-red-600' : ''}`}>
            {Math.floor(elapsed)}분
          </p>
        </div>
      </div>

      {task.lastCoord && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-xs font-mono text-[#2E1C10]/60">
          <MapPin className="w-3 h-3 inline mr-1" />
          위치: {task.lastCoord.lat.toFixed(4)}, {task.lastCoord.lng.toFixed(4)}
          <span className="ml-2 text-[#2E1C10]/40">
            ({new Date(task.lastCoord.at).toLocaleTimeString('ko-KR')})
          </span>
        </div>
      )}
    </div>
  );
}

```

---

## src\pages\admin\Promotions.tsx

```tsx
// Route: /admin/promotions
/**
 * 관리자 쿠폰/프로모션 관리 페이지
 * Phase 2-8: 쿠폰 발급 및 통계
 */

import { useState, useEffect } from 'react';
import { CouponStats, CouponIssue } from '../../types/coupon';
import { getCouponStats, issueCoupon } from '../../lib/coupons.api';
import { getCurrentUser } from '../../lib/auth';
import { StatCard } from '../../components/admin/common/StatCard';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Plus, Ticket } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

export function AdminPromotions() {
  const [stats, setStats] = useState<CouponStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [issuing, setIssuing] = useState(false);

  // 발급 폼
  const [issueForm, setIssueForm] = useState<CouponIssue>({
    type: 'admin',
    title: '',
    description: '',
    amount: 5000,
    minSpend: 15000,
    expiryDays: 30,
    issueLimit: 100,
  });

  const user = getCurrentUser();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getCouponStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      toast.error('통계를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async () => {
    if (!user) return;

    if (!issueForm.title.trim() || !issueForm.description.trim()) {
      toast.error('제목과 설명을 입력하세요');
      return;
    }

    setIssuing(true);
    try {
      const issued = await issueCoupon(issueForm, user.uid, user.name);
      
      toast.success(`쿠폰 ${issued.length}장을 발급했습니다`);
      setIssueDialogOpen(false);
      loadStats();

      // 폼 초기화
      setIssueForm({
        type: 'admin',
        title: '',
        description: '',
        amount: 5000,
        minSpend: 15000,
        expiryDays: 30,
        issueLimit: 100,
      });
    } catch (error: any) {
      console.error('Failed to issue coupons:', error);
      toast.error(error.message || '쿠폰 발급에 실패했습니다');
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#333] mb-2">쿠폰/프로모션</h1>
          <p className="text-[#8B7355]">
            쿠폰을 발급하고 사용 현황을 관리하세요
          </p>
        </div>
        <Button onClick={() => setIssueDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          쿠폰 발급
        </Button>
      </div>

      {/* 통계 */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="발급 총량"
            value={stats.totalIssued}
            subtitle="총 발급 쿠폰"
          />
          <StatCard
            title="사용 완료"
            value={stats.totalUsed}
            subtitle="사용된 쿠폰"
            variant="success"
          />
          <StatCard
            title="할인 금액"
            value={`${(stats.totalAmount / 10000).toFixed(0)}만원`}
            subtitle="총 할인액"
            variant="info"
          />
          <StatCard
            title="만료됨"
            value={stats.expiredCount}
            subtitle="미사용 만료"
            variant="warning"
          />
        </div>
      )}

      {/* 발급 가이드 */}
      <Card className="p-6">
        <h3 className="text-lg text-[#333] mb-4 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-[#D61C1C]" />
          쿠폰 발급 가이드
        </h3>
        <div className="space-y-3 text-sm text-[#8B7355]">
          <div className="flex items-start gap-2">
            <span className="text-[#D61C1C]">•</span>
            <span><strong>사진 리뷰 보상:</strong> 자동 발급 (3,000원, 10,000원 이상 주문 시)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#F37021]">•</span>
            <span><strong>신규 가입:</strong> 자동 발급 (5,000원, 15,000원 이상 주문 시)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#C7A45A]">•</span>
            <span><strong>관리자 발급:</strong> 수동 발급 (금액/조건 설정 가능)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span><strong>만료 처리:</strong> 매일 04:00 자동 처리 (Firebase Functions)</span>
          </div>
        </div>
      </Card>

      {/* 발급 내역 (Placeholder) */}
      <Card className="p-6">
        <h3 className="text-lg text-[#333] mb-4">최근 발급 내역</h3>
        <div className="text-center py-8 text-gray-500">
          <Ticket className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>발급 내역이 표시됩니다</p>
          <p className="text-sm text-gray-400 mt-1">
            Firebase 연동 시 실시간 내역 조회
          </p>
        </div>
      </Card>

      {/* 발급 다이얼로그 */}
      <Dialog open={issueDialogOpen} onOpenChange={setIssueDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>쿠폰 발급</DialogTitle>
            <DialogDescription>
              새로운 쿠폰을 발급합니다
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 타입 */}
            <div className="space-y-2">
              <Label>쿠폰 타입</Label>
              <Select
                value={issueForm.type}
                onValueChange={(v) => setIssueForm({ ...issueForm, type: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">관리자 발급</SelectItem>
                  <SelectItem value="event">이벤트</SelectItem>
                  <SelectItem value="compensation">보상</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 제목 */}
            <div className="space-y-2">
              <Label>제목</Label>
              <Input
                value={issueForm.title}
                onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
                placeholder="예: 설날 특별 할인 쿠폰"
              />
            </div>

            {/* 설명 */}
            <div className="space-y-2">
              <Label>설명</Label>
              <Textarea
                value={issueForm.description}
                onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                placeholder="예: 20,000원 이상 주문 시 사용 가능"
                rows={2}
              />
            </div>

            {/* 금액 & 최소주문 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>할인 금액 (원)</Label>
                <Input
                  type="number"
                  value={issueForm.amount}
                  onChange={(e) => setIssueForm({ ...issueForm, amount: Number(e.target.value) })}
                  min="1000"
                  step="1000"
                />
              </div>
              <div className="space-y-2">
                <Label>최소 주문 (원)</Label>
                <Input
                  type="number"
                  value={issueForm.minSpend}
                  onChange={(e) => setIssueForm({ ...issueForm, minSpend: Number(e.target.value) })}
                  min="0"
                  step="1000"
                />
              </div>
            </div>

            {/* 유효기간 & 발급상한 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>유효 기간 (일)</Label>
                <Input
                  type="number"
                  value={issueForm.expiryDays}
                  onChange={(e) => setIssueForm({ ...issueForm, expiryDays: Number(e.target.value) })}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label>발급 상한 (장)</Label>
                <Input
                  type="number"
                  value={issueForm.issueLimit}
                  onChange={(e) => setIssueForm({ ...issueForm, issueLimit: Number(e.target.value) })}
                  min="1"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIssueDialogOpen(false)}
              disabled={issuing}
            >
              취소
            </Button>
            <Button onClick={handleIssue} disabled={issuing}>
              {issuing ? '발급 중...' : '발급'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

---

## src\pages\admin\Points.tsx

```tsx
// Route: /admin/points
/**
 * 관리자 포인트 관리 페이지
 * Phase 3-3: Points System
 */

import { useState, useEffect } from 'react';
import { Gift, TrendingUp, TrendingDown, Users, DollarSign, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Skeleton } from '../../components/ui/skeleton';
import { StatCard } from '../../components/admin/common/StatCard';
import { getAllPointsBalances, adjustPoints, POINTS_POLICY } from '../../lib/points.api';
import { FEATURE_FLAGS } from '../../config/env';
import { toast } from 'sonner';
import type { PointsBalance } from '../../types/points';
import { formatPrice } from '../../lib/utils';
import { getAdminSettings } from '../../lib/admin/settingsCenter.api';

export function AdminPoints() {
  const [balances, setBalances] = useState<Array<PointsBalance & { phone?: string; name?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [pointsEnabled, setPointsEnabled] = useState<boolean>(true);
  
  // 조정 다이얼로그
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof balances[0] | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustNote, setAdjustNote] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const s = await getAdminSettings();
        setPointsEnabled(!!s.points?.enabled);
      } catch {}
      loadBalances();
    })();
  }, []);

  async function loadBalances() {
    try {
      setLoading(true);
      const data = await getAllPointsBalances();
      setBalances(data);
    } catch (error) {
      console.error('Failed to load points balances:', error);
      toast.error('포인트 내역 로드 실패');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdjust() {
    if (!selectedUser || !adjustAmount || !adjustNote) {
      toast.error('모든 필드를 입력해주세요');
      return;
    }

    const amount = parseInt(adjustAmount);
    if (isNaN(amount) || amount === 0) {
      toast.error('올바른 포인트 금액을 입력해주세요');
      return;
    }

    try {
      setAdjusting(true);
      await adjustPoints(selectedUser.uid, amount, adjustNote);
      toast.success('포인트가 조정되었습니다');
      setAdjustDialog(false);
      setSelectedUser(null);
      setAdjustAmount('');
      setAdjustNote('');
      loadBalances();
    } catch (error: any) {
      console.error('Failed to adjust points:', error);
      toast.error(error.message || '포인트 조정 실패');
    } finally {
      setAdjusting(false);
    }
  }

  function openAdjustDialog(user: typeof balances[0]) {
    setSelectedUser(user);
    setAdjustDialog(true);
  }

  if (!FEATURE_FLAGS.points || !pointsEnabled) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            포인트 기능이 비활성화되어 있습니다. 설정 센터 &gt; 운영/보안 탭에서 활성화해 주세요.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 통계 계산
  const safeBalances = balances || [];
  const totalUsers = safeBalances.length;
  const totalPoints = safeBalances.reduce((sum, b) => sum + b.balance, 0);
  const avgPoints = totalUsers > 0 ? Math.floor(totalPoints / totalUsers) : 0;
  const activeUsers = safeBalances.filter(b => b.balance > 0).length;

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl text-[#2E1C10] mb-1">포인트 관리</h1>
        <p className="text-[#2E1C10]/60">
          고객 포인트 현황을 관리하고 조정할 수 있습니다
        </p>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="전체 사용자"
          value={totalUsers.toString()}
          icon={Users}
          variant="info"
        />
        
        <StatCard
          title="전체 포인트"
          value={`${totalPoints.toLocaleString()}P`}
          icon={Gift}
          variant="default"
        />
        
        <StatCard
          title="평균 보유 포인트"
          value={`${avgPoints.toLocaleString()}P`}
          icon={TrendingUp}
          variant="success"
        />
        
        <StatCard
          title="활성 사용자"
          value={activeUsers.toString()}
          icon={DollarSign}
          variant="warning"
        />
      </div>

      {/* 포인트 정책 */}
      <Card>
        <CardHeader>
          <CardTitle>포인트 정책</CardTitle>
          <CardDescription>현재 적용 중인 포인트 정책입니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-[#2E1C10]/60 mb-1">주문 적립률</p>
              <p className="text-2xl font-medium text-[#D61C1C]">
                {(POINTS_POLICY.earnRate * 100).toFixed(1)}%
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-[#2E1C10]/60 mb-1">최소 사용 금액</p>
              <p className="text-2xl font-medium text-[#D61C1C]">
                {POINTS_POLICY.minUse.toLocaleString()}P
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-[#2E1C10]/60 mb-1">유효기간</p>
              <p className="text-2xl font-medium text-[#D61C1C]">
                {POINTS_POLICY.expireDays}일
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-[#2E1C10]/60 mb-1">사진 리뷰 보너스</p>
              <p className="text-2xl font-medium text-[#D61C1C]">
                {POINTS_POLICY.reviewPhotoBonus}P
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 사용자 포인트 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>사용자별 포인트</CardTitle>
          <CardDescription>
            전체 {balances.length}명의 사용자
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : balances.length > 0 ? (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>사용자</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>보유 포인트</TableHead>
                    <TableHead>최종 업데이트</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balances.map((balance) => (
                    <TableRow key={balance.uid}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#D61C1C]/10 flex items-center justify-center">
                            <span className="text-xs text-[#D61C1C]">
                              {balance.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{balance.name || balance.uid}</p>
                            <p className="text-xs text-gray-500">{balance.uid}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{balance.phone || '-'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={balance.balance > 0 ? 'default' : 'secondary'}
                          className={balance.balance > 0 ? 'bg-green-100 text-green-800' : ''}
                        >
                          {balance.balance.toLocaleString()}P
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {new Date(balance.updatedAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openAdjustDialog(balance)}
                        >
                          조정
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>아직 포인트 사용자가 없습니다</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 포인트 조정 다이얼로그 */}
      <Dialog open={adjustDialog} onOpenChange={setAdjustDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>포인트 조정</DialogTitle>
            <DialogDescription>
              사용자: {selectedUser?.name || selectedUser?.uid}
              <br />
              현재 보유 포인트: {selectedUser?.balance.toLocaleString()}P
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">조정 포인트</Label>
              <Input
                id="amount"
                type="number"
                placeholder="양수는 증가, 음수는 차감"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                예: +1000 (증가), -500 (차감)
              </p>
            </div>

            <div>
              <Label htmlFor="note">사유</Label>
              <Textarea
                id="note"
                placeholder="포인트 조정 사유를 입력하세요"
                value={adjustNote}
                onChange={(e) => setAdjustNote(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            {adjustAmount && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  조정 후 포인트: {(selectedUser!.balance + parseInt(adjustAmount || '0')).toLocaleString()}P
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAdjustDialog(false);
                setSelectedUser(null);
                setAdjustAmount('');
                setAdjustNote('');
              }}
            >
              취소
            </Button>
            <Button
              onClick={handleAdjust}
              disabled={adjusting || !adjustAmount || !adjustNote}
            >
              {adjusting ? '처리 중...' : '조정하기'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

---

## src\pages\admin\Support.tsx

```tsx
// Route: /admin/support
/**
 * 관리자 고객지원 채팅 관리 페이지
 * Phase 3-2: Support Chat
 * Firebase Firestore 실시간 채팅 시스템
 */

import { useEffect, useState, useRef } from 'react';
import { 
  Send, 
  MessageSquare, 
  Clock, 
  Check, 
  CheckCheck, 
  AlertCircle, 
  RefreshCw,
  UserCheck,
  X,
  CheckCircle,
  Timer,
  TrendingUp
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { FEATURE_FLAGS, USE_FIREBASE } from '../../config/env';
import { formatDateTime } from '../../lib/utils';
import { getCurrentUser } from '../../lib/auth';
import type { ChatSession, ChatMessage } from '../../types/support';
import { toast } from 'sonner';

// Firebase API (실제 환경에서 사용)
import {
  getAllSessions,
  getSessionMessages,
  sendAdminMessage,
  updateSessionStatus,
  markMessagesAsReadByAdmin,
  subscribeToSessions,
  subscribeToMessages,
  getPendingSessionsCount,
  getAverageResponseTime,
  getTodayCompletedCount,
} from '../../lib/admin/support.api';

export function AdminSupport() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'open' | 'closed'>('all');
  
  // 통계
  const [stats, setStats] = useState({
    pending: 0,
    avgResponseTime: 0,
    todayCompleted: 0,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const currentUser = getCurrentUser();

  // 지원 기능 비활성화 체크
  if (!FEATURE_FLAGS.support) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            고객 지원 기능이 비활성화되어 있습니다. 환경 변수에서 VITE_SUPPORT_ENABLED=true로 설정하세요.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 초기 로드 + 통계
  useEffect(() => {
    loadSessionsAndStats();
  }, []);

  // Firebase 실시간 구독
  useEffect(() => {
    if (!USE_FIREBASE) return;

    const unsubscribe = subscribeToSessions((updatedSessions) => {
      setSessions(updatedSessions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 선택된 세션의 메시지 구독
  useEffect(() => {
    if (!selectedSession || !USE_FIREBASE) return;

    const unsubscribe = subscribeToMessages(selectedSession.id, (updatedMessages) => {
      setMessages(updatedMessages);
      
      // 읽음 처리
      markMessagesAsReadByAdmin(selectedSession.id).catch(console.error);
    });

    return () => unsubscribe();
  }, [selectedSession]);

  // 메시지 자동 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  // 세션 및 통계 로드
  async function loadSessionsAndStats() {
    try {
      setLoading(true);

      if (USE_FIREBASE) {
        // Firebase에서 로드
        const [allSessions, pending, avgTime, completed] = await Promise.all([
          getAllSessions(),
          getPendingSessionsCount(),
          getAverageResponseTime(),
          getTodayCompletedCount(),
        ]);

        setSessions(allSessions);
        setStats({
          pending,
          avgResponseTime: avgTime,
          todayCompleted: completed,
        });
      } else {
        // Mock: localStorage
        await loadSessionsMock();
        setStats({
          pending: 0,
          avgResponseTime: 5,
          todayCompleted: 0,
        });
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast.error('세션 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  }

  // Mock 데이터 로드
  async function loadSessionsMock() {
    if (typeof window === 'undefined') {
      setSessions([]);
      return;
    }

    try {
      const sessionsData = localStorage.getItem('chat_sessions') || '{}';
      
      // localStorage가 비어있으면 빈 배열 반환 (샘플 데이터 생성 제거)
      if (!sessionsData || sessionsData === '{}') {
        setSessions([]);
        return;
      }

      const sessionsObj: Record<string, ChatSession> = JSON.parse(sessionsData);
      const sessionsList = Object.values(sessionsObj);
      
      // 안전성 체크: 배열이 아니면 빈 배열 반환
      if (!Array.isArray(sessionsList)) {
        console.warn('[Support] Invalid sessions data format, resetting to empty');
        setSessions([]);
        return;
      }
      
      sessionsList.sort((a, b) => {
        const aHasUnread = hasUnreadMessagesMock(a.id);
        const bHasUnread = hasUnreadMessagesMock(b.id);
        
        if (aHasUnread && !bHasUnread) return -1;
        if (!aHasUnread && bHasUnread) return 1;
        
        return b.lastAt - a.lastAt;
      });

      setSessions(sessionsList);
    } catch (error) {
      console.error('[Support] Failed to parse sessions from storage', error);
      setSessions([]);
    }
  }

  // Mock: 미응답 체크
  function hasUnreadMessagesMock(sessionId: string): boolean {
    const messagesData = localStorage.getItem(`chat_messages_${sessionId}`) || '[]';
    const msgs: ChatMessage[] = JSON.parse(messagesData);
    return msgs.some((m) => m.from === 'user' && !m.readByAdmin);
  }

  // 세션 선택
  async function selectSession(session: ChatSession) {
    setSelectedSession(session);

    if (USE_FIREBASE) {
      try {
        const msgs = await getSessionMessages(session.id);
        setMessages(msgs);
        
        // 읽음 처리
        await markMessagesAsReadByAdmin(session.id);
      } catch (error) {
        console.error('Failed to load messages:', error);
        toast.error('메시지를 불러오는데 실패했습니다');
      }
    } else {
      // Mock
      const messagesData = localStorage.getItem(`chat_messages_${session.id}`) || '[]';
      const msgs: ChatMessage[] = JSON.parse(messagesData);
      
      const updatedMsgs = msgs.map((m) => {
        if (m.from === 'user' && !m.readByAdmin) {
          return { ...m, readByAdmin: true };
        }
        return m;
      });
      
      localStorage.setItem(`chat_messages_${session.id}`, JSON.stringify(updatedMsgs));
      setMessages(updatedMsgs);
    }
  }

  // 메시지 전송
  async function sendMessage() {
    if (!selectedSession || !inputText.trim() || sending || !currentUser) return;

    const text = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      if (USE_FIREBASE) {
        await sendAdminMessage(selectedSession.id, text, currentUser.uid);
        toast.success('메시지가 전송되었습니다');
      } else {
        // Mock
        const newMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          sessionId: selectedSession.id,
          from: 'admin',
          type: 'text',
          text,
          at: Date.now(),
          readByUser: false,
        };

        const messagesData = localStorage.getItem(`chat_messages_${selectedSession.id}`) || '[]';
        const allMessages: ChatMessage[] = JSON.parse(messagesData);
        allMessages.push(newMessage);
        localStorage.setItem(`chat_messages_${selectedSession.id}`, JSON.stringify(allMessages));
        
        setMessages(allMessages);

        // 세션 업데이트
        const sessionsData = localStorage.getItem('chat_sessions') || '{}';
        const sessionsObj: Record<string, ChatSession> = JSON.parse(sessionsData);
        sessionsObj[selectedSession.id] = {
          ...selectedSession,
          lastMessage: text,
          lastAt: Date.now(),
          updatedAt: Date.now(),
          assignedTo: currentUser.uid,
        };
        localStorage.setItem('chat_sessions', JSON.stringify(sessionsObj));
        
        loadSessionsMock();
        toast.success('메시지가 전송되었습니다');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('메시지 전송에 실패했습니다');
      setInputText(text);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  // 세션 종료/재개
  async function toggleSessionStatus(session: ChatSession) {
    if (!currentUser) return;

    try {
      const newStatus = !session.open;
      
      if (USE_FIREBASE) {
        await updateSessionStatus(session.id, newStatus, currentUser.uid);
        toast.success(newStatus ? '세션을 재개했습니다' : '세션을 종료했습니다');
      } else {
        // Mock
        const sessionsData = localStorage.getItem('chat_sessions') || '{}';
        const sessionsObj: Record<string, ChatSession> = JSON.parse(sessionsData);
        sessionsObj[session.id] = {
          ...session,
          open: newStatus,
          updatedAt: Date.now(),
        };
        localStorage.setItem('chat_sessions', JSON.stringify(sessionsObj));
        loadSessionsMock();
        
        if (selectedSession?.id === session.id) {
          setSelectedSession({ ...session, open: newStatus });
        }
        
        toast.success(newStatus ? '세션을 재개했습니다' : '세션을 종료했습니다');
      }
    } catch (error) {
      console.error('Failed to update session status:', error);
      toast.error('세션 상태 변경에 실패했습니다');
    }
  }

  // 필터링된 세션
  const filteredSessions = (sessions || []).filter((s) => {
    if (filterTab === 'open') return s.open;
    if (filterTab === 'closed') return !s.open;
    return true;
  });

  // 통계
  const openSessions = (sessions || []).filter((s) => s.open);
  const unreadCount = USE_FIREBASE 
    ? stats.pending 
    : (sessions || []).filter((s) => hasUnreadMessagesMock(s.id)).length;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#2E1C10]">고객 지원 채팅</h1>
          <p className="text-sm text-[#2E1C10]/60">
            실시간 1:1 고객 문의 관리
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadSessionsAndStats}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>전체 세션</CardDescription>
            <CardTitle className="text-3xl">{sessions.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <MessageSquare className="w-3 h-3 inline mr-1" />
              누적 문의
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>진행 중</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{openSessions.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <Clock className="w-3 h-3 inline mr-1" />
              열린 세션
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>미응답</CardDescription>
            <CardTitle className="text-3xl text-red-600">{unreadCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              답변 필요
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>평균 응답시간</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.avgResponseTime}분</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <Timer className="w-3 h-3 inline mr-1" />
              첫 응답까지
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 미응답 알림 */}
      {unreadCount > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {unreadCount}개의 세션에 답변이 필요합니다. 빠른 응대로 고객 만족도를 높여보세요!
          </AlertDescription>
        </Alert>
      )}

      {/* 채팅 UI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* 세션 목록 (좌측) */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>문의 목록</CardTitle>
            <Tabs value={filterTab} onValueChange={(v) => setFilterTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="open">진행중</TabsTrigger>
                <TabsTrigger value="closed">완료</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {filteredSessions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  {filterTab === 'all' ? '문의가 없습니다' : 
                   filterTab === 'open' ? '진행 중인 문의가 없습니다' :
                   '완료된 문의가 없습니다'}
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredSessions.map((session) => {
                    const unread = USE_FIREBASE ? false : hasUnreadMessagesMock(session.id);
                    const isSelected = selectedSession?.id === session.id;

                    return (
                      <button
                        key={session.id}
                        onClick={() => selectSession(session)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-[#D61C1C] text-white'
                            : unread
                            ? 'bg-red-50 hover:bg-red-100'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${isSelected ? 'text-white' : 'text-[#2E1C10]'}`}>
                              {session.userName || session.userId.substring(0, 12)}
                            </span>
                            {!session.open && (
                              <Badge variant="secondary" className="h-5 text-xs">
                                종료
                              </Badge>
                            )}
                          </div>
                          {unread && !isSelected && (
                            <Badge variant="destructive" className="h-5">
                              NEW
                            </Badge>
                          )}
                        </div>
                        <p className={`text-xs truncate ${isSelected ? 'text-white/80' : 'text-[#2E1C10]/60'}`}>
                          {session.lastMessage || '메시지 없음'}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${isSelected ? 'text-white/60' : 'text-[#2E1C10]/40'}`}>
                            {formatDateTime(new Date(session.lastAt))}
                          </p>
                          {session.assignedTo && (
                            <UserCheck className={`w-3 h-3 ${isSelected ? 'text-white/60' : 'text-green-600'}`} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 채팅 영역 (우측) */}
        <Card className="lg:col-span-2">
          {selectedSession ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {selectedSession.userName || selectedSession.userId}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>세션 ID: {selectedSession.id}</span>
                      {selectedSession.userPhone && (
                        <>
                          <span>•</span>
                          <span>{selectedSession.userPhone}</span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedSession.open ? 'default' : 'secondary'}>
                      {selectedSession.open ? '진행 중' : '종료'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSessionStatus(selectedSession)}
                    >
                      {selectedSession.open ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          종료
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1" />
                          재개
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="p-4 h-[400px] flex flex-col">
                {/* 메시지 목록 */}
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">메시지가 없습니다</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <AdminMessageBubble key={msg.id} message={msg} />
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* 입력 영역 */}
                <div className="mt-4">
                  {!selectedSession.open && (
                    <Alert className="mb-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        이 세션은 종료되었습니다. 재개 버튼을 눌러 다시 열 수 있습니다.
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder={selectedSession.open ? "답변을 입력하세요..." : "세션이 종료되었습니다"}
                      disabled={sending || !selectedSession.open}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputText.trim() || sending || !selectedSession.open}
                      size="icon"
                      className="bg-[#D61C1C] hover:bg-[#D61C1C]/90"
                    >
                      {sending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p>세션을 선택하세요</p>
                <p className="text-sm mt-2">
                  왼쪽 목록에서 문의를 클릭하면 대화를 시작할 수 있습니다
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* 개발사 정보 (KS컴퍼니) */}
      <Card className="border-[#C7A45A]/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-[#2E1C10]/60">
            <div className="flex items-center gap-4">
              <span>개발사: KS컴퍼니</span>
              <Separator orientation="vertical" className="h-4" />
              <span>사업자번호: 553-17-00098</span>
              <Separator orientation="vertical" className="h-4" />
              <span>대표: 석경선 / 공동대표: 배종수</span>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>오늘 {stats.todayCompleted}건 완료</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 관리자용 메시지 말풍선
 */
function AdminMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.from === 'user';
  const isBot = message.from === 'bot';

  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div className="max-w-[75%]">
        {/* 보낸 사람 */}
        <p className={`text-xs text-[#2E1C10]/60 mb-1 px-1 ${isUser ? 'text-left' : 'text-right'}`}>
          {isUser ? '👤 고객' : isBot ? '🤖 자동 응답' : '👨‍💼 관리자'}
        </p>

        {/* 메시지 */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gray-100 text-[#2E1C10]'
              : isBot
              ? 'bg-blue-50 text-[#2E1C10] border border-blue-200'
              : 'bg-[#D61C1C] text-white'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>

        {/* 시간 + 읽음 */}
        <div className={`flex items-center gap-1 mt-1 px-1 ${isUser ? 'justify-start' : 'justify-end'}`}>
          <p className="text-xs text-[#2E1C10]/40">
            {new Date(message.at).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {!isUser && !isBot && (
            <>
              {message.readByUser ? (
                <CheckCheck className="w-3 h-3 text-green-600" />
              ) : (
                <Check className="w-3 h-3 text-[#2E1C10]/40" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

```

---
