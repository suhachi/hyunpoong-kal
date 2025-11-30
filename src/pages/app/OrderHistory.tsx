/**
 * 주문내역 페이지
 * 고객의 모든 주문을 시간순으로 표시하고 상태별 필터링 제공
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Skeleton } from '../../components/ui/skeleton';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import {
  ShoppingBag,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Star,
  Package
} from 'lucide-react';
import { getOrdersByUser, filterOrdersByStatus, getReviewableOrders } from '../../lib/orders.api';
import type { Order, OrderStatus } from '../../types/order';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { formatPrice } from '../../lib/utils';
import { toast } from 'sonner';

type FilterStatus = OrderStatus | 'all' | 'reviewable';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
  pending: { label: '결제대기', variant: 'outline', color: 'text-gray-500' },
  accepted: { label: '접수완료', variant: 'default', color: 'text-green-600' },
  preparing: { label: '조리중', variant: 'secondary', color: 'text-orange-600' },
  completed: { label: '완료', variant: 'default', color: 'text-green-600' },
  canceled: { label: '취소', variant: 'destructive', color: 'text-gray-400' },
};

// OrderTracking 페이지와 동일한 상태 설정
const extendedStatusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
  ...statusConfig,
  placed: { label: '주문접수', variant: 'default', color: 'text-green-600' },
  cooking: { label: '조리중', variant: 'secondary', color: 'text-orange-600' },
  out_for_delivery: { label: '배달중', variant: 'secondary', color: 'text-blue-600' },
  pickup_ready: { label: '포장완료', variant: 'default', color: 'text-green-600' },
  done: { label: '완료', variant: 'default', color: 'text-green-600' },
  payment_failed: { label: '결제실패', variant: 'destructive', color: 'text-red-500' },
};

export function OrderHistory() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');

  // 인증 체크
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6F3] flex items-center justify-center">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userId = user.uid;

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  useEffect(() => {
    applyFilter();
  }, [filter, orders]);

  async function loadOrders() {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getOrdersByUser(userId);
      setOrders(data);
    } catch (error) {
      console.error('주문 목록 로딩 실패:', error);
      toast.error('주문 내역을 불러오는데 실패했습니다. 다시 시도해주세요.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  function applyFilter() {
    if (filter === 'all') {
      setFilteredOrders(orders);
    } else if (filter === 'reviewable') {
      setFilteredOrders(getReviewableOrders(orders));
    } else {
      setFilteredOrders(filterOrdersByStatus(orders, filter));
    }
  }

  function formatDate(timestamp: any): string {
    try {
      let date: Date;

      if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else if (timestamp?.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else if (timestamp?.toDate) {
        date = timestamp.toDate();
      } else {
        return '-';
      }

      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) {
        return '오늘 ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      } else if (days === 1) {
        return '어제 ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      } else if (days < 7) {
        return `${days}일 전`;
      } else {
        return date.toLocaleDateString('ko-KR', {
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('날짜 포맷 에러:', error);
      return '-';
    }
  }

  function hasReview(order: Order): boolean {
    return !!order.reviewed;
  }

  const reviewableCount = getReviewableOrders(orders).length;

  return (
    <div className="pb-24">
      {/* 헤더 */}
      <div className="sticky top-14 z-40 bg-[#F9F6F3] border-b border-[#E5DDD5] px-4 py-4">
        <h1 className="text-xl text-[#2E1C10] mb-4">주문내역</h1>

        {/* 필터 탭 */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
          <TabsList className="w-full grid grid-cols-3 bg-white">
            <TabsTrigger value="all" className="text-sm">
              전체
              {!loading && orders.length > 0 && (
                <span className="ml-1 text-xs opacity-60">({orders.length})</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="preparing" className="text-sm">
              진행중
              {!loading && (
                <span className="ml-1 text-xs opacity-60">
                  ({orders.filter(o =>
                    o.status === 'accepted' ||
                    o.status === 'preparing' ||
                    o.status === 'cooking' ||
                    o.status === 'out_for_delivery' ||
                    o.status === 'placed'
                  ).length})
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="reviewable" className="text-sm relative">
              리뷰작성
              {reviewableCount > 0 && (
                <span className="ml-1 flex items-center justify-center w-5 h-5 text-xs text-white bg-[#D61C1C] rounded-full">
                  {reviewableCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="p-4 space-y-3">
        {loading ? (
          // 로딩 스켈레톤
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="rounded-2xl border-[#E5DDD5]">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-24 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-6 w-24" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : filteredOrders.length === 0 ? (
          // 주문 없음
          <Card className="rounded-2xl border-[#E5DDD5] p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-[#2E1C10]/20 mx-auto mb-4" />
            <p className="text-[#2E1C10]/60 mb-4">
              {filter === 'all'
                ? '주문 내역이 없습니다'
                : filter === 'reviewable'
                  ? '리뷰 작성 가능한 주문이 없습니다'
                  : '해당 상태의 주문이 없습니다'}
            </p>
            <Button
              onClick={() => navigate('/menu')}
              className="bg-[#D61C1C] hover:bg-[#D61C1C]/90"
            >
              메뉴 둘러보기
            </Button>
          </Card>
        ) : (
          // 주문 목록
          filteredOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              hasReview={hasReview(order)}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  hasReview: boolean;
  formatDate: (timestamp: any) => string;
}

function OrderCard({ order, hasReview, formatDate }: OrderCardProps) {
  const navigate = useNavigate();

  const statusInfo = extendedStatusConfig[order.status] || statusConfig.completed;
  const isCompleted = order.status === 'completed' || order.status === 'done';
  const isCanceled = order.status === 'canceled';
  const canReview = isCompleted && !hasReview;

  // 대표 이미지 (첫 번째 아이템) - 안전한 배열 접근
  const firstItem = order.items?.[0];
  const totalItems = order.items?.length || 0;

  // items가 비어있는 경우 처리
  if (!firstItem || totalItems === 0) {
    return (
      <Card className="rounded-2xl border-[#E5DDD5]">
        <CardContent className="p-4 text-center text-gray-500">
          주문 항목이 없습니다
        </CardContent>
      </Card>
    );
  }

  return (
    <Link to={`/order/${order.orderId}`}>
      <Card className="rounded-2xl hover:shadow-md transition-all hover:scale-[1.01] border-[#E5DDD5] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-[#2E1C10]/60">
                  {formatDate(order.createdAt)}
                </span>
                <Badge variant={statusInfo.variant} className="text-xs">
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="text-xs text-[#2E1C10]/40">
                주문번호: {order.orderId}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#2E1C10]/40 flex-shrink-0" />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* 주문 아이템 */}
          <div className="flex gap-3">
            {/* 대표 이미지 */}
            {firstItem.menuImage && (
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F9F6F3] flex-shrink-0">
                <ImageWithFallback
                  src={firstItem.menuImage}
                  alt={firstItem.menuName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 주문 정보 */}
            <div className="flex-1 min-w-0">
              <p className="text-[#2E1C10] mb-1 truncate">
                {firstItem.menuName}
                {firstItem.quantity > 1 && (
                  <span className="text-[#2E1C10]/60"> × {firstItem.quantity}</span>
                )}
              </p>
              {totalItems > 1 && (
                <p className="text-sm text-[#2E1C10]/60">
                  외 {totalItems - 1}개
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {order.deliveryType === 'delivery' ? (
                  <Badge variant="outline" className="text-xs border-[#F37021]/30 text-[#F37021]">
                    <Package className="w-3 h-3 mr-1" />
                    배달
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs border-[#C7A45A]/30 text-[#C7A45A]">
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    포장
                  </Badge>
                )}
              </div>
            </div>

            {/* 금액 */}
            <div className="text-right flex-shrink-0">
              <p className={`text-lg ${isCanceled ? 'text-[#2E1C10]/40 line-through' : 'text-[#D61C1C]'}`}>
                {formatPrice(order.finalAmount)}
              </p>
            </div>
          </div>

          {/* 하단 액션 */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/order/${order.orderId}`);
              }}
            >
              <Clock className="w-4 h-4 mr-1" />
              주문상세
            </Button>

            {canReview && (
              <Button
                size="sm"
                className="flex-1 bg-[#D61C1C] hover:bg-[#D61C1C]/90 text-white"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/review/${order.orderId}`);
                }}
              >
                <Star className="w-4 h-4 mr-1" />
                리뷰작성
              </Button>
            )}

            {isCompleted && hasReview && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-green-200 text-green-700"
                disabled
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                리뷰완료
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
