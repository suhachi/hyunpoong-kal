import { useRef, useState } from 'react';
import { Bell, Printer, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { generateReceipt } from '../../lib/functions';
import { updateOrderStatus } from '../../lib/admin/orders.api';
import { getStatusList, getStatusColor, getOrderStatusLabelForAdmin } from '../../lib/orders.utils';
import type { Order, OrderStatus } from '../../types/order';

interface OrderActionBarProps {
  order: Order;
  onUpdate?: () => void;
}

export function OrderActionBar({ order, onUpdate }: OrderActionBarProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      const result = await updateOrderStatus(order.orderId, newStatus);
      if (result.success) {
        toast.success('상태가 변경되었습니다', {
          description: `${getOrderStatusLabelForAdmin(order.status)} → ${getOrderStatusLabelForAdmin(newStatus)}`,
        });
        onUpdate?.();
      } else {
        toast.error('상태 변경 실패', {
          description: result.error,
        });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('상태 변경 중 오류가 발생했습니다');
    }
  };

  const handleBellRing = () => {
    // 자리표시자: 실제로는 주방 벨 시스템 연동
    toast.success('알림이 전송되었습니다', {
      description: '주방에 새로운 주문 알림을 보냈습니다.',
    });
  };

  const handlePrint = () => {
    try {
      // 브라우저 프린트 API 사용
      window.print();

      toast.success('인쇄 창이 열렸습니다', {
        description: `주문번호: ${order.orderId.slice(0, 8).toUpperCase()}`,
      });
    } catch (error) {
      console.error('Failed to print:', error);
      toast.error('인쇄 실패', {
        description: '프린터 설정을 확인해주세요.',
      });
    }
  };

  const handleDownloadReceipt = async () => {
    setDownloading(true);
    try {
      const receiptUrl = await generateReceipt(order.orderId);

      // 새 탭에서 열기
      window.open(receiptUrl, '_blank');
      toast.success('영수증이 다운로드되었습니다');
    } catch (error) {
      console.error('Failed to download receipt:', error);
      toast.error('영수증 다운로드에 실패했습니다');
    } finally {
      setDownloading(false);
    }
  };

  return (
      <div className="flex items-center gap-1 mr-auto">
        {getStatusList(order.deliveryType).map((status) => (
          <Button
            key={status}
            size="sm"
            variant={order.status === status ? 'default' : 'outline'}
            className={`${
              order.status === status 
                ? getStatusColor(status) 
                : 'text-gray-500 hover:text-gray-700'
            } h-8 px-3 text-xs`}
            disabled={order.status === status}
            onClick={() => handleStatusChange(status)}
          >
            {getOrderStatusLabelForAdmin(status)}
          </Button>
        ))}
      </div>

      <div className="h-4 w-px bg-gray-200 mx-2" />

      <Button
        variant="outline"
        size="sm"
        onClick={handleBellRing}
        className="gap-2"
      >
        <Bell className="w-4 h-4" />
        알림
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="gap-2"
      >
        <Printer className="w-4 h-4" />
        주문서
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadReceipt}
        disabled={downloading}
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        영수증
      </Button>
    </div >
  );
}
