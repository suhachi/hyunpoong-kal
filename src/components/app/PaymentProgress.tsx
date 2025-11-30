/**
 * 결제 진행 상태 컴포넌트
 * Phase H: 결제 NICEPAY - 단계별 UI 시각화
 *
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";

export type PaymentStatus =
  | "preparing" // 결제 준비 중
  | "redirecting" // PG사 리다이렉트
  | "processing" // 결제 처리 중
  | "success" // 결제 성공
  | "failed" // 결제 실패
  | "timeout" // 시간 초과
  | "cancelled"; // 사용자 취소

export interface PaymentProgressProps {
  status: PaymentStatus;
  message?: string;
  timeoutSeconds?: number;
  onRetry?: () => void;
  onCancel?: () => void;
  onContact?: () => void;
}

export function PaymentProgress({
  status,
  message,
  timeoutSeconds = 180, // 3분
  onRetry,
  onCancel,
  onContact,
}: PaymentProgressProps) {
  const [remainingTime, setRemainingTime] = useState(timeoutSeconds);
  const [progress, setProgress] = useState(0);

  // 타이머 (redirecting, processing 상태에서만)
  useEffect(() => {
    if (status !== "redirecting" && status !== "processing") {
      return;
    }

    setRemainingTime(timeoutSeconds);
    setProgress(0);

    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });

      setProgress(prev => {
        const newProgress = ((timeoutSeconds - remainingTime) / timeoutSeconds) * 100;
        return Math.min(newProgress, 100);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, timeoutSeconds]);

  const config = getStatusConfig(status);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 space-y-6">
      {/* 아이콘 */}
      <div className={cn("flex items-center justify-center w-20 h-20 rounded-full", config.iconBg)}>
        <config.icon className={cn("w-10 h-10", config.iconColor)} />
      </div>

      {/* 상태 메시지 */}
      <div className="text-center space-y-2">
        <h2 className={cn("text-xl font-medium", config.titleColor)}>{config.title}</h2>
        {message && <p className="text-[#2E1C10]/60">{message}</p>}
      </div>

      {/* 프로그레스 바 (진행 중 상태) */}
      {(status === "redirecting" || status === "processing") && (
        <div className="w-full max-w-sm space-y-3">
          <Progress value={progress} className="h-2" />

          <div className="flex items-center justify-center gap-2 text-sm text-[#2E1C10]/60">
            <Clock className="w-4 h-4" />
            <span>
              남은 시간: {minutes}분 {seconds}초
            </span>
          </div>

          {remainingTime < 30 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-900 text-center">
                잠시만 기다려 주세요. 곧 완료됩니다.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {status === "failed" && onRetry && (
          <Button onClick={onRetry} className="w-full bg-[#D61C1C] hover:bg-[#D61C1C]/90">
            다시 시도하기
          </Button>
        )}

        {status === "timeout" && onRetry && (
          <Button onClick={onRetry} className="w-full bg-[#D61C1C] hover:bg-[#D61C1C]/90">
            처음부터 다시 시도
          </Button>
        )}

        {(status === "failed" || status === "timeout") && onContact && (
          <Button onClick={onContact} variant="outline" className="w-full">
            고객센터 문의
          </Button>
        )}

        {(status === "redirecting" || status === "processing") && onCancel && (
          <Button onClick={onCancel} variant="outline" className="w-full">
            결제 취소
          </Button>
        )}
      </div>

      {/* 망취소 안내 (실패 시) */}
      {status === "failed" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg max-w-md">
          <h4 className="text-sm font-medium text-red-900 mb-2">결제가 실패했습니다</h4>
          <p className="text-xs text-red-800">
            카드사 승인이 거부되었거나 네트워크 오류가 발생했습니다. 결제가 진행되었다면 자동으로{" "}
            <strong>망취소</strong> 처리됩니다.
          </p>
          <p className="text-xs text-red-800 mt-2">
            • 승인 취소는 즉시 진행되나, 카드사 반영은 1~3일 소요될 수 있습니다.
            <br />• 결제가 완료되지 않았으니 안심하세요.
          </p>
        </div>
      )}

      {/* 시간 초과 안내 */}
      {status === "timeout" && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md">
          <h4 className="text-sm font-medium text-yellow-900 mb-2">결제 시간이 초과되었습니다</h4>
          <p className="text-xs text-yellow-800">
            결제 처리 중 예상보다 시간이 오래 걸렸습니다. 네트워크 상태를 확인한 후 다시 시도해
            주세요.
          </p>
        </div>
      )}

      {/* 성공 시 자동 이동 안내 */}
      {status === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg max-w-md">
          <p className="text-xs text-green-800 text-center">
            잠시 후 주문 상세 페이지로 이동합니다...
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * 상태별 설정
 */
function getStatusConfig(status: PaymentStatus) {
  switch (status) {
    case "preparing":
      return {
        icon: Loader2,
        iconColor: "text-[#C7A45A] animate-spin",
        iconBg: "bg-[#C7A45A]/10",
        title: "결제 준비 중",
        titleColor: "text-[#2E1C10]",
      };

    case "redirecting":
      return {
        icon: Clock,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100",
        title: "PG사로 이동 중",
        titleColor: "text-[#2E1C10]",
      };

    case "processing":
      return {
        icon: Loader2,
        iconColor: "text-[#D61C1C] animate-spin",
        iconBg: "bg-[#D61C1C]/10",
        title: "결제 처리 중",
        titleColor: "text-[#2E1C10]",
      };

    case "success":
      return {
        icon: CheckCircle2,
        iconColor: "text-green-600",
        iconBg: "bg-green-100",
        title: "결제 완료!",
        titleColor: "text-green-900",
      };

    case "failed":
      return {
        icon: XCircle,
        iconColor: "text-red-600",
        iconBg: "bg-red-100",
        title: "결제 실패",
        titleColor: "text-red-900",
      };

    case "timeout":
      return {
        icon: AlertTriangle,
        iconColor: "text-yellow-600",
        iconBg: "bg-yellow-100",
        title: "시간 초과",
        titleColor: "text-yellow-900",
      };

    case "cancelled":
      return {
        icon: XCircle,
        iconColor: "text-gray-600",
        iconBg: "bg-gray-100",
        title: "결제 취소됨",
        titleColor: "text-[#2E1C10]",
      };

    default:
      return {
        icon: Loader2,
        iconColor: "text-[#2E1C10]/40",
        iconBg: "bg-gray-100",
        title: "처리 중",
        titleColor: "text-[#2E1C10]",
      };
  }
}
