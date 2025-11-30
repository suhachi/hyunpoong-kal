import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ReviewForm } from '../../components/review/ReviewForm';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { Button } from '../../components/ui/button';
import { ChevronLeft } from 'lucide-react';
import type { Order } from '../../types/order';

export function ReviewWrite() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId || !user) return;

      try {
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const orderData = docSnap.data() as Order;
          // 본인 주문 확인
          if (orderData.userId !== user.uid) {
            alert('잘못된 접근입니다.');
            navigate('/order-history');
            return;
          }
          // 이미 리뷰 작성했는지 확인
          if (orderData.reviewed) {
            alert('이미 리뷰를 작성한 주문입니다.');
            navigate('/order-history');
            return;
          }
          setOrder(orderData);
        } else {
          alert('주문을 찾을 수 없습니다.');
          navigate('/order-history');
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6F3] flex items-center justify-center">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!order || !user) return null;

  return (
    <div className="min-h-screen bg-[#F9F6F3] pb-20">
      {/* 헤더 */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-50 border-b border-[#E5DDD5]">
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-6 h-6 text-[#2E1C10]" />
        </Button>
        <h1 className="text-lg font-medium text-[#2E1C10]">리뷰 쓰기</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5DDD5]">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-[#2E1C10] mb-1">
              음식은 입에 맞으셨나요?
            </h2>
            <p className="text-sm text-gray-500">
              솔직한 리뷰는 큰 힘이 됩니다.
            </p>
          </div>

          <ReviewForm
            order={order}
            userId={user.uid}
            onSuccess={() => {
              navigate('/order-history');
            }}
            onCancel={() => navigate(-1)}
          />
        </div>
      </div>
    </div>
  );
}
