import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentCancel() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F6F3] p-4 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm max-w-sm w-full">
                <div className="flex justify-center mb-4">
                    <XCircle className="w-12 h-12 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-[#2E1C10] mb-2">결제가 취소되었습니다</h2>
                <p className="text-[#2E1C10]/60 mb-6">
                    사용자가 결제를 취소했습니다.<br />
                    주문을 계속하시려면 다시 시도해 주세요.
                </p>
                <div className="space-y-3">
                    <Button
                        className="w-full bg-[#D61C1C] hover:bg-[#D61C1C]/90"
                        onClick={() => navigate("/checkout")}
                    >
                        결제 다시 시도
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate("/cart")}
                    >
                        장바구니로 돌아가기
                    </Button>
                </div>
            </div>
        </div>
    );
}
