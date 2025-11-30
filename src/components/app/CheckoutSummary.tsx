/**
 * 결제 요약 컴포넌트
 * Phase A: 쿠폰 적용 - 금액 변화 하이라이트
 *
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { memo, useEffect, useRef, useMemo } from "react";
import { motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export interface CheckoutSummaryProps {
  subtotal: number;
  deliveryFee: number;
  couponDiscount: number;
  pointsUsed: number;
  total: number;
  highlightChanges?: boolean;
}

export const CheckoutSummary = memo(function CheckoutSummary({
  subtotal,
  deliveryFee,
  couponDiscount,
  pointsUsed,
  total,
  highlightChanges = true,
}: CheckoutSummaryProps) {
  const prevTotal = usePrevious(total);
  const prevCoupon = usePrevious(couponDiscount);
  const prevPoints = usePrevious(pointsUsed);

  const totalChanged = prevTotal !== undefined && prevTotal !== total;
  const couponChanged = prevCoupon !== undefined && prevCoupon !== couponDiscount;
  const pointsChanged = prevPoints !== undefined && prevPoints !== pointsUsed;

  const savingsAmount = useMemo(() => couponDiscount + pointsUsed, [couponDiscount, pointsUsed]);

  return (
    <div className="space-y-3">
      {/* 기본 항목 */}
      <SummaryLine label="상품 금액" amount={subtotal} />

      {deliveryFee > 0 && <SummaryLine label="배달비" amount={deliveryFee} />}

      {/* 할인 항목 */}
      {couponDiscount > 0 && (
        <motion.div
          initial={highlightChanges && couponChanged ? { scale: 0.95, opacity: 0 } : {}}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SummaryLine
            label="쿠폰 할인"
            amount={-couponDiscount}
            className="text-[#D61C1C]"
            highlight={highlightChanges && couponChanged}
          />
        </motion.div>
      )}

      {pointsUsed > 0 && (
        <motion.div
          initial={highlightChanges && pointsChanged ? { scale: 0.95, opacity: 0 } : {}}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SummaryLine
            label="포인트 사용"
            amount={-pointsUsed}
            className="text-[#F37021]"
            highlight={highlightChanges && pointsChanged}
          />
        </motion.div>
      )}

      <Separator />

      {/* 총 절약 금액 (할인이 있을 때만) */}
      {savingsAmount > 0 && (
        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-[#D61C1C]/5 to-[#F37021]/5 rounded-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F37021]" />
            <span className="text-sm text-[#2E1C10]/80">총 절약</span>
          </div>
          <span className="text-sm font-medium text-[#D61C1C]">-{formatPrice(savingsAmount)}</span>
        </div>
      )}

      {/* 총 결제금액 */}
      <motion.div
        initial={highlightChanges && totalChanged ? { scale: 1.05 } : {}}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SummaryLine
          label="총 결제금액"
          amount={total}
          className="font-bold text-lg"
          highlight={highlightChanges && totalChanged}
        />
      </motion.div>
    </div>
  );
});

/**
 * 요약 행 컴포넌트
 */
interface SummaryLineProps {
  label: string;
  amount: number;
  className?: string;
  highlight?: boolean;
}

const SummaryLine = memo(function SummaryLine({
  label,
  amount,
  className = "",
  highlight = false,
}: SummaryLineProps) {
  return (
    <div
      className={`
        flex justify-between text-sm transition-colors
        ${highlight ? "bg-yellow-100 -mx-2 px-2 py-1 rounded" : ""}
        ${className}
      `}
    >
      <span className="text-[#2E1C10]/60">{label}</span>
      <span className={className || "text-[#2E1C10]"}>{formatPrice(amount)}</span>
    </div>
  );
});

/**
 * 이전 값 추적 Hook
 */
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
