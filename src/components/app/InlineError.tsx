/**
 * 인라인 에러 컴포넌트
 * Phase A: 쿠폰 적용 - 검증 오류 표시
 *
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { AlertCircle, Info, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

export type InlineErrorVariant = "error" | "warning" | "info";

export interface InlineErrorProps {
  message: string;
  variant?: InlineErrorVariant;
  actionLabel?: string;
  onAction?: () => void;
}

export function InlineError({
  message,
  variant = "error",
  actionLabel,
  onAction,
}: InlineErrorProps) {
  const config = getVariantConfig(variant);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-start gap-2 p-3 rounded-lg border
        ${config.bgColor} ${config.borderColor}
      `}
    >
      {/* 아이콘 */}
      <config.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />

      {/* 메시지 */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${config.textColor}`}>{message}</p>

        {/* 액션 버튼 (선택적) */}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className={`
              mt-2 text-sm font-medium underline
              ${config.actionColor}
              hover:opacity-80 transition-opacity
            `}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Variant별 설정
 */
function getVariantConfig(variant: InlineErrorVariant) {
  switch (variant) {
    case "error":
      return {
        icon: AlertCircle,
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        iconColor: "text-red-500",
        textColor: "text-red-900",
        actionColor: "text-red-700",
      };
    case "warning":
      return {
        icon: AlertTriangle,
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        iconColor: "text-yellow-500",
        textColor: "text-yellow-900",
        actionColor: "text-yellow-700",
      };
    case "info":
      return {
        icon: Info,
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        iconColor: "text-blue-500",
        textColor: "text-blue-900",
        actionColor: "text-blue-700",
      };
  }
}
