/**
 * 가격 상세 내역 컴포넌트
 * Checkout, OrderTracking, Cart 등에서 공통 사용
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { memo } from 'react';
import { Separator } from '../ui/separator';
import { formatPrice } from '../../lib/utils';

interface PriceBreakdownProps {
  subtotal: number;
  deliveryFee?: number;
  couponDiscount?: number;
  pointsDiscount?: number;
  total: number;
  showDeliveryFee?: boolean;
  className?: string;
}

export const PriceBreakdown = memo(function PriceBreakdown({
  subtotal,
  deliveryFee = 0,
  couponDiscount = 0,
  pointsDiscount = 0,
  total,
  showDeliveryFee = true,
  className = '',
}: PriceBreakdownProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* 주문 금액 */}
      <div className="flex justify-between text-sm">
        <span className="text-[#2E1C10]/60">주문 금액</span>
        <span className="text-[#2E1C10]">{formatPrice(subtotal)}</span>
      </div>

      {/* 배달비 */}
      {showDeliveryFee && (
        <div className="flex justify-between text-sm">
          <span className="text-[#2E1C10]/60">배달비</span>
          <span className="text-[#2E1C10]">
            {deliveryFee === 0 ? '무료' : formatPrice(deliveryFee)}
          </span>
        </div>
      )}

      {/* 쿠폰 할인 */}
      {couponDiscount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-[#2E1C10]/60">쿠폰 할인</span>
          <span className="text-[#D61C1C]">-{formatPrice(couponDiscount)}</span>
        </div>
      )}

      {/* 포인트 사용 */}
      {pointsDiscount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-[#2E1C10]/60">포인트 사용</span>
          <span className="text-[#D61C1C]">-{formatPrice(pointsDiscount)}</span>
        </div>
      )}

      <Separator />

      {/* 총 결제금액 */}
      <div className="flex justify-between">
        <span className="text-[#2E1C10]">총 결제금액</span>
        <span className="text-[#D61C1C]">{formatPrice(total)}</span>
      </div>
    </div>
  );
});
