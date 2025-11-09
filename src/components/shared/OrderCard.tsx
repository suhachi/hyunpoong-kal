/**
 * 주문 카드 컴포넌트
 * OrderHistory, OrderTracking 등에서 공통 사용
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { memo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatPrice, formatDateTime } from '../../lib/utils';
import type { Order } from '../../types/order';

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
  showAction?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const OrderCard = memo(function OrderCard({
  order,
  onClick,
  showAction = true,
  actionLabel = '상세보기',
  onAction,
  className = '',
}: OrderCardProps) {
  const handleClick = () => {
    if (onClick) onClick();
  };

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAction) onAction();
  };

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${className}`}
      onClick={handleClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* 헤더: 주문번호 + 상태 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#2E1C10]/60">주문번호</p>
            <p className="text-[#2E1C10]">#{order.id.slice(-8)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* 주문 메뉴 정보 */}
        <div className="space-y-1">
          {order.items && order.items.length > 0 && (
            <>
              <p className="text-[#2E1C10]">
                {order.items[0].menuName}
                {order.items.length > 1 && ` 외 ${order.items.length - 1}개`}
              </p>
              <p className="text-sm text-[#2E1C10]/60">
                {formatDateTime(order.createdAt)}
              </p>
            </>
          )}
        </div>

        {/* 금액 정보 */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2E1C10]/10">
          <span className="text-[#2E1C10]/60">총 결제금액</span>
          <span className="text-[#D61C1C]">{formatPrice(order.finalAmount)}</span>
        </div>

        {/* 액션 버튼 */}
        {showAction && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleAction}
          >
            {actionLabel}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
});
