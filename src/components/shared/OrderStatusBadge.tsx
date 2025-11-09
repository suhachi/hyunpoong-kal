/**
 * 주문 상태 배지 컴포넌트
 * OrderTable, OrderHistory, OrderTracking 등에서 공통 사용
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { memo } from 'react';
import { Badge } from '../ui/badge';
import type { OrderStatus } from '../../types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus | string;
  className?: string;
}

// 상태별 배지 설정
const statusConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  // 기본 주문 상태
  pending: { label: '접수대기', variant: 'secondary' },
  accepted: { label: '접수확인', variant: 'default' },
  preparing: { label: '조리중', variant: 'outline' },
  completed: { label: '완료', variant: 'default' },
  canceled: { label: '취소', variant: 'destructive' },
  
  // 확장 상태 (OrderTracking용)
  placed: { label: '주문접수', variant: 'default' },
  cooking: { label: '조리중', variant: 'secondary' },
  out_for_delivery: { label: '배달중', variant: 'secondary' },
  pickup_ready: { label: '포장완료', variant: 'default' },
  done: { label: '완료', variant: 'default' },
  payment_failed: { label: '결제실패', variant: 'destructive' },
};

export const OrderStatusBadge = memo(function OrderStatusBadge({ 
  status, 
  className 
}: OrderStatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'outline' as const };
  
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
});
