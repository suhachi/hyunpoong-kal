import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmPaymentClient } from "@/lib/payments.client";
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "failed">("processing");
  const [message, setMessage] = useState("결제를 확인하고 있습니다...");
  const processedRef = useRef(false); // 멱등성 방지 (React.StrictMode double invoke issue)

  // URL 파라미터 파싱
  const orderId = searchParams.get("orderId");
  const pgOrderId = searchParams.get("pgOrderId") || undefined; // Mock/NicePay specific keys
  const resultCode = searchParams.get("resultCode"); // 0000 is usually success
  const resultMsg = searchParams.get("resultMsg");
  // NICEPAY specific params might be different (AuthToken etc), adapting generic logic here.
  // For our Mock provider, we used redirectUrl like: ?orderId=...&pgOrderId=...&resultCode=...

  useEffect(() => {
    if (processedRef.current) return;
    
    if (!orderId) {
        setStatus("failed");
        setMessage("잘못된 접근입니다 (주문번호 누락)");
        return;
    }

    // 이미 실패로 온 경우 (PG에서 실패 리턴)
    if (resultCode && resultCode !== "0000") {
        setStatus("failed");
        setMessage(resultMsg || "결제에 실패했습니다");
        processedRef.current = true;
        return;
    }

    const processPayment = async () => {
        processedRef.current = true;
        try {
            // 결제 승인 요청
            await confirmPaymentClient({
                orderId,
                pgOrderId,
                // NICEPAY의 경우 auth token 등이 필요할 수 있음.
                // 여기서는 Mock Provider 기준 & 일반적 Flow로 구현
            });
            
            setStatus("success");
            setMessage("결제가 성공적으로 완료되었습니다!");
            
            // 3초 후 주문 상세 페이지로 이동
            setTimeout(() => {
                navigate(`/order/${orderId}?result=success`, { replace: true });
            }, 3000);

        } catch (error: any) {
            console.error("Payment confirm error:", error);
            setStatus("failed");
            setMessage(error.message || "결제 승인 처리 중 오류가 발생했습니다");
        }
    };

    processPayment();
  }, [orderId, pgOrderId, resultCode, resultMsg, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center bg-white shadow-lg rounded-2xl">
        {status === "processing" && (
            <div className="space-y-4">
                <Loader2 className="w-16 h-16 mx-auto text-[#D61C1C] animate-spin" />
                <h2 className="text-xl font-bold text-[#2E1C10]">결제 확인 중</h2>
                <p className="text-gray-500">{message}</p>
                <p className="text-xs text-gray-400">잠시만 기다려주세요...</p>
            </div>
        )}

        {status === "success" && (
            <div className="space-y-4">
                <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
                <h2 className="text-xl font-bold text-[#2E1C10]">결제 성공!</h2>
                <p className="text-gray-500">{message}</p>
                <Button 
                    className="w-full mt-4 bg-[#D61C1C] hover:bg-[#D61C1C]/90"
                    onClick={() => navigate(`/order/${orderId}?result=success`, { replace: true })}
                >
                    주문 내역 보기
                </Button>
            </div>
        )}

        {status === "failed" && (
            <div className="space-y-4">
                <XCircle className="w-16 h-16 mx-auto text-red-500" />
                <h2 className="text-xl font-bold text-[#2E1C10]">결제 실패</h2>
                <p className="text-gray-500">{message}</p>
                <div className="flex gap-2 mt-4">
                    <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate("/cart")}
                    >
                        장바구니로
                    </Button>
                    <Button 
                        className="flex-1 bg-[#D61C1C] hover:bg-[#D61C1C]/90"
                        onClick={() => navigate("/checkout")}
                    >
                        다시 시도
                    </Button>
                </div>
            </div>
        )}
      </Card>
    </div>
  );
}

