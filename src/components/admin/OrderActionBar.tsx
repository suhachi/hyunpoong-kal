import {
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Printer,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Truck,
  CookingPot,
  Receipt,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { Order, OrderStatus, ORDER_STATUS_TRANSITIONS, PaymentMethod } from "@/types/order";
import { getOrderStatusLabelForAdmin, getStatusColor } from "@/lib/orders.utils";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { printOrderReceipt } from "@/utils/printReceipt";
import { toast } from "sonner";
import { updateOrderStatus } from "@/lib/admin/orders.api";
import { Fragment } from "react";

interface OrderActionBarProps {
  order: Order;
  onUpdate?: () => void;
}

export function OrderActionBar({ order, onUpdate }: OrderActionBarProps) {
  const possibleNextStatuses = ORDER_STATUS_TRANSITIONS[order.status] || [];

  const handleStatusUpdate = async (status: OrderStatus) => {
    try {
      await updateOrderStatus(order.orderId, status);
      toast.success("주문 상태가 변경되었습니다");
      onUpdate?.();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("상태 변경에 실패했습니다");
    }
  };

  const handlePrint = () => {
    printOrderReceipt(order);
  };

  // 결제 수단 아이콘
  const getPaymentIcon = () => {
    switch (order.payment.method) {
      case PaymentMethod.APP_CARD:
        return <Smartphone className="w-4 h-4 text-purple-600" />;
      case PaymentMethod.MEET_CARD:
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case PaymentMethod.MEET_CASH:
        return <Receipt className="w-4 h-4 text-green-600" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getPaymentLabel = () => {
    switch (order.payment.method) {
      case PaymentMethod.APP_CARD:
        return "앱 결제";
      case PaymentMethod.MEET_CARD:
        return "만나서 카드";
      case PaymentMethod.MEET_CASH:
        return "만나서 현금";
      default:
        return order.payment.method;
    }
  };

  return (
    <Fragment>
      <Card className="border-none shadow-none bg-transparent">
        <div className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.status,
                )}`}
              >
                {getOrderStatusLabelForAdmin(order.status)}
              </span>
              <span className="text-lg font-bold">{formatPrice(order.finalAmount)}</span>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {getPaymentIcon()}
              <span>{getPaymentLabel()}</span>
              {/* PG 결제 상세 정보 표시 */}
              {order.payment.method === PaymentMethod.APP_CARD && order.payment.status === "paid" && (
                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-md border border-green-100">
                  결제완료 ({order.payment.cardName || "카드"})
                </span>
              )}
              {order.payment.method === PaymentMethod.APP_CARD && order.payment.status === "failed" && (
                <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-md border border-red-100">
                  결제실패
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              주문서
            </Button>

            {possibleNextStatuses.length > 0 && (
              <div className="flex gap-2">
                {possibleNextStatuses.includes(OrderStatus.ACCEPTED) && (
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleStatusUpdate(OrderStatus.ACCEPTED)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    주문 접수
                  </Button>
                )}
                {possibleNextStatuses.includes(OrderStatus.COOKING) && (
                  <Button
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => handleStatusUpdate(OrderStatus.COOKING)}
                  >
                    <CookingPot className="w-4 h-4 mr-2" />
                    조리 시작
                  </Button>
                )}
                {possibleNextStatuses.includes(OrderStatus.DELIVERING) && (
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => handleStatusUpdate(OrderStatus.DELIVERING)}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    배달 출발
                  </Button>
                )}
                {possibleNextStatuses.includes(OrderStatus.COMPLETED) && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusUpdate(OrderStatus.COMPLETED)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    배달 완료
                  </Button>
                )}
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {possibleNextStatuses.includes(OrderStatus.CANCELLED) && (
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => handleStatusUpdate(OrderStatus.CANCELLED)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    주문 취소
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* PG 결제 상세 정보 (App 결제일 때만 확장 표시) */}
        {order.payment.method === PaymentMethod.APP_CARD && order.payment.pgTid && (
          <div className="mt-2 px-4 py-2 bg-gray-50 rounded-lg text-xs text-gray-500 flex gap-4">
            <span>PG 거래번호: {order.payment.pgTid}</span>
            {order.payment.approvedAt && (
              <span>
                승인일시: {formatDateTime(order.payment.approvedAt instanceof Date ? order.payment.approvedAt : (order.payment.approvedAt as any).toDate())}
              </span>
            )}
            {order.payment.pgReceiptUrl && (
              <a 
                href={order.payment.pgReceiptUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 hover:underline flex items-center"
              >
                <Receipt className="w-3 h-3 mr-1" />
                매출전표 확인
              </a>
            )}
          </div>
        )}
      </Card>
    </Fragment>
  );
}
