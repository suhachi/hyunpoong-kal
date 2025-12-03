import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { approvePayment } from "@/lib/nicepay";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function PaymentReturn() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<"processing" | "success" | "failed">("processing");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const processPayment = async () => {
            const orderId = searchParams.get("orderId");
            let authToken = searchParams.get("authToken");
            const authUrl = searchParams.get("authUrl"); // 일부 환경에서 다를 수 있음
            const resultCode = searchParams.get("resultCode");
            const resultMsg = searchParams.get("resultMsg");

            // 세션 스토리지에서 authToken 조회 (URL에 없을 경우 대비)
            if (orderId && !authToken) {
                const storedToken = sessionStorage.getItem(`payment_auth_${orderId}`);
                if (storedToken) {
                    console.log("Found authToken in sessionStorage");
                    authToken = storedToken;
                }
            }

            // 1. 기본 파라미터 체크
            if (!orderId || (!authToken && !authUrl)) {
                // 취소/실패로 리다이렉트 된 경우
                if (resultCode !== "0000") {
                    setStatus("failed");
                    setErrorMessage(resultMsg || "결제가 취소되거나 실패했습니다.");
                    return;
                }
                setStatus("failed");
                setErrorMessage("필수 결제 정보가 누락되었습니다.");
                return;
            }

            try {
                // 2. 결제 승인 요청
                // authToken이 없으면 authUrl에서 추출하거나 다른 방식일 수 있으나, 
                // 현재 lib/nicepay.ts는 approvePayment(orderId, authToken)을 기대함.
                // NICEPAY 표준: authUrl을 그대로 넘기거나 authToken을 넘김.
                // 여기서는 authToken이 있다고 가정하고 진행.
                await approvePayment(orderId, authToken || "");

                // 성공 시 세션 스토리지 정리
                sessionStorage.removeItem(`payment_auth_${orderId}`);

                setStatus("success");
                toast.success("결제가 정상적으로 완료되었습니다.");
            } catch (error: any) {
                console.error("Payment approval failed:", error);
                setStatus("failed");
                setErrorMessage(error.message || "결제 승인 중 오류가 발생했습니다.");
            }
        };

        processPayment();
    }, [searchParams]);

    if (status === "processing") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F6F3] p-4">
                <Loader2 className="w-12 h-12 text-[#D61C1C] animate-spin mb-4" />
                <h2 className="text-xl font-bold text-[#2E1C10]">결제 승인 중입니다...</h2>
                <p className="text-[#2E1C10]/60 mt-2">잠시만 기다려 주세요.</p>
            </div>
        );
    }

    if (status === "success") {
        const orderId = searchParams.get("orderId");
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F6F3] p-4 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-[#2E1C10] mb-2">결제 완료!</h2>
                <p className="text-[#2E1C10]/60 mb-8">주문이 성공적으로 접수되었습니다.</p>
                <Button
                    className="bg-[#D61C1C] hover:bg-[#D61C1C]/90 w-full max-w-xs"
                    onClick={() => navigate(`/order/${orderId}?result=success`)}
                >
                    주문 상세 보기
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F6F3] p-4 text-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-[#2E1C10] mb-2">결제 실패</h2>
            <p className="text-[#2E1C10]/60 mb-8">{errorMessage}</p>
            <div className="flex gap-3 w-full max-w-xs">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/cart")}
                >
                    장바구니로
                </Button>
                <Button
                    className="bg-[#D61C1C] hover:bg-[#D61C1C]/90 flex-1"
                    onClick={() => navigate("/checkout")}
                >
                    다시 시도
                </Button>
            </div>
        </div>
    );
}
