// Route: /admin/orders
import React, { useState, useEffect, useRef } from "react";
import { OrderStatus } from "@/types/order";
import { ORDER_STATUS_TRANSITIONS, type Order } from "@/types/order";
import type { FTimestamp } from "@/types/common";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OrderTable } from "@/components/admin/OrderTable";
import { OrderDetailDrawer } from "@/components/admin/OrderDetailDrawer";
import { PrintableOrder } from "@/components/admin/PrintableOrder";
import {
  fetchOrders,
  updateOrderStatus,
  type OrderFilters,
  type OrderSortField,
  type OrderSortDirection,
} from "@/lib/admin/orders.api";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { getOrdersFallback } from "@/lib/fallback";
import { formatPrice } from "@/lib/utils";

// 주문 상태 탭 정의
type OrderStatusTab = "all" | OrderStatus;

const ORDER_STATUS_TABS: { id: OrderStatusTab; label: string; statuses: OrderStatus[] }[] = [
  {
    id: "all",
    label: "전체",
    statuses: [
      OrderStatus.PENDING,
      OrderStatus.ACCEPTED,
      OrderStatus.COOKING,
      OrderStatus.DELIVERING,
      OrderStatus.COMPLETED,
      OrderStatus.CANCELLED,
    ],
  },
  { id: OrderStatus.PENDING, label: "접수대기", statuses: [OrderStatus.PENDING] },
  { id: OrderStatus.ACCEPTED, label: "접수확인", statuses: [OrderStatus.ACCEPTED] },
  {
    id: OrderStatus.COOKING,
    label: "조리중",
    statuses: [OrderStatus.COOKING, OrderStatus.DELIVERING],
  },
  { id: OrderStatus.COMPLETED, label: "완료", statuses: [OrderStatus.COMPLETED] },
  { id: OrderStatus.CANCELLED, label: "취소", statuses: [OrderStatus.CANCELLED] },
];

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 필터/정렬 상태
  const [currentTabId, setCurrentTabId] = useState<OrderStatusTab>(OrderStatus.PENDING);
  const currentTab = ORDER_STATUS_TABS.find(t => t.id === currentTabId)!;
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<OrderSortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<OrderSortDirection>("desc");

  // 취소 다이얼로그
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean;
    order: Order | null;
  }>({ open: false, order: null });
  const [cancelReason, setCancelReason] = useState("");

  // 새 주문 알림
  const [newOrderAlert, setNewOrderAlert] = useState<{
    open: boolean;
    order: Order | null;
  }>({ open: false, order: null });
  const [processedOrderIds, setProcessedOrderIds] = useState<Set<string>>(new Set());
  const previousOrdersRef = useRef<Order[]>([]);

  // 데이터 로드
  const loadOrders = async () => {
    setLoading(true);
    try {
      const filters: OrderFilters = {
        paymentMethod: paymentFilter === "all" ? undefined : paymentFilter,
        searchQuery: searchQuery || undefined,
      };

      const data = await fetchOrders("store-hyunpung", filters, sortField, sortDirection);

      // 새 주문 감지 (pending 상태인 주문만)
      const previousOrders = previousOrdersRef.current;
      const newPendingOrders = data.filter(
        order =>
          order.status === OrderStatus.PENDING &&
          !processedOrderIds.has(order.orderId) &&
          !previousOrders.some(prev => prev.orderId === order.orderId),
      );

      // 새 주문이 있으면 알림
      if (newPendingOrders.length > 0) {
        const latestOrder = newPendingOrders[0]; // 가장 최신 주문
        setNewOrderAlert({ open: true, order: latestOrder });
        setProcessedOrderIds(prev => {
          const newSet = new Set(prev);
          newPendingOrders.forEach(o => newSet.add(o.orderId));
          return newSet;
        });

        // 알림음 재생
        try {
          // 간단한 beep 소리 생성 (Web Audio API)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = 800; // 800Hz
          oscillator.type = "sine";

          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
          console.warn("알림음 재생 실패:", error);
        }
      }

      previousOrdersRef.current = data;
      setOrders(data);

      // 탭별 필터링
      const filtered = data.filter(order => currentTab.statuses.includes(order.status));
      setFilteredOrders(filtered);
    } catch (error) {
      console.error("주문 로드 실패:", error);
      toast.error("주문 목록을 불러오는데 실패했습니다 (fallback 적용)");
      // Firestore 권한 실패 시 localStorage 기반 fallback (E2E 안정화)
      const arr = getOrdersFallback();
      setOrders(arr);
      const filtered = arr.filter(order => currentTab.statuses.includes(order.status));
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
    const filtered = orders.filter(order => currentTab.statuses.includes(order.status));
    setFilteredOrders(filtered);
  }, [orders, currentTab]);

  // 상태 변경 처리
  const handleUpdateStatus = async (order: Order, newStatus: OrderStatus) => {
    // 취소 처리는 사유 입력 모달 표시
    if (newStatus === OrderStatus.CANCELLED) {
      setCancelDialog({ open: true, order });
      return;
    }

    // 상태 전이 검증
    const allowedTransitions = ORDER_STATUS_TRANSITIONS[order.status];
    if (!allowedTransitions.includes(newStatus)) {
      toast.error("상태 변경 불가", {
        description: `${order.status} 상태에서 ${newStatus}로 변경할 수 없습니다`,
      });
      return;
    }

    try {
      const result = await updateOrderStatus(order.orderId, newStatus);
      if (result.success) {
        toast.success("상태가 변경되었습니다", {
          description: `주문번호: ${order.orderId}`,
        });
        loadOrders();
      } else {
        toast.error("상태 변경 실패", {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("상태 변경 실패:", error);
      toast.error("상태 변경 중 오류가 발생했습니다");
    }
  };

  // 취소 확인
  const handleCancelConfirm = async () => {
    if (!cancelDialog.order || !cancelReason.trim()) {
      toast.error("취소 사유를 입력해주세요");
      return;
    }

    try {
      const result = await updateOrderStatus(
        cancelDialog.order.orderId,
        OrderStatus.CANCELLED,
        cancelReason,
      );

      if (result.success) {
        toast.success("주문이 취소되었습니다", {
          description: `주문번호: ${cancelDialog.order.orderId}`,
        });
        setCancelDialog({ open: false, order: null });
        setCancelReason("");
        loadOrders();
      } else {
        toast.error("주문 취소 실패", {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("주문 취소 실패:", error);
      toast.error("주문 취소 중 오류가 발생했습니다");
    }
  };

  // 상세보기
  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  // 통계
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
    accepted: orders.filter(o => o.status === OrderStatus.ACCEPTED).length,
    cooking: orders.filter(
      o => o.status === OrderStatus.COOKING || o.status === OrderStatus.DELIVERING,
    ).length,
    completed: orders.filter(o => o.status === OrderStatus.COMPLETED).length,
    cancelled: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
  };

  const getOrderDate = (order: Order) => {
    const ts = order.createdAt as FTimestamp | string;
    if (typeof ts === "string") return new Date(ts);
    if (ts && "toDate" in ts) return ts.toDate();
    if (ts && "seconds" in ts) return new Date(ts.seconds * 1000);
    return new Date();
  };

  return (
    <div className="space-y-6" data-testid="admin.orders.page">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl text-[#333] mb-2">주문 관리</h1>
        <p className="text-[#8B7355]">실시간 주문 현황을 확인하고 상태를 관리하세요</p>
        <div className="mt-2">
          <Alert className="border-blue-100 bg-blue-50 text-sm">
            현재 결제 관련 기능은 Phase 3 이후 PG 연동으로 대체될 예정이며, 이 화면은 Mock/로컬
            주문으로 동작합니다.
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
          <Tabs value={currentTabId} onValueChange={v => setCurrentTabId(v as OrderStatusTab)}>
            <TabsList className="w-full justify-start overflow-x-auto">
              {ORDER_STATUS_TABS.map(tab => (
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
                onChange={e => setSearchQuery(e.target.value)}
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
                onValueChange={v => {
                  const [field, dir] = v.split("-");
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
        onOpenChange={open => {
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
            <DialogDescription>주문 확인 후 접수하기 버튼을 눌러주세요.</DialogDescription>
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
                    {getOrderDate(newOrderAlert.order).toLocaleTimeString("ko-KR")}
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
                        handleUpdateStatus(newOrderAlert.order, OrderStatus.ACCEPTED);
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
        onOpenChange={open => {
          if (!open) {
            setCancelDialog({ open: false, order: null });
            setCancelReason("");
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
                onChange={e => setCancelReason(e.target.value)}
                rows={4}
              />
            </div>

            {cancelDialog.order?.payment?.method === "app_card" && (
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
                setCancelReason("");
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
