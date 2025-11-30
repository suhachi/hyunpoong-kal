import { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, Wallet, HandCoins, Loader2, AlertCircle, Gift, Smartphone } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { Separator } from '../../components/ui/separator';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Switch } from '../../components/ui/switch';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'sonner';
import { getPointsBalance, spendPoints, POINTS_POLICY } from '../../lib/points.api';
import { createOrder } from '../../lib/orders.api';
import { FEATURE_FLAGS } from '../../config/env';
import type { PaymentMethod } from '../../types/order';
import { CheckoutSummary } from '../../components/app/CheckoutSummary';
import { formatPrice } from '../../lib/utils';
import {
  initiatePayment,
  pollPaymentResult,
  openNicePayWindow,
} from '../../lib/nicepay';
import type { PaymentRequest } from '../../types/payment';

export function Checkout() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const {
    items,
    deliveryType,
    deliveryAddress,
    requests,
    couponDiscount,
    getSubtotal,
    getDeliveryFee,
    clearCart,
  } = useCart();

  // 인증 체크
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6F3] flex items-center justify-center">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 주문 완료 플래그 (리다이렉트 방지용)
  const isOrderCompleting = useRef(false);

  // 배달 시 기본값: 만나서 카드, 포장 시 기본값: 만나서 카드
  const isDelivery = deliveryType === 'delivery';
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('meet_card');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 포인트 관련 상태
  const [pointsBalance, setPointsBalance] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const baseTotal = subtotal - couponDiscount + deliveryFee;
  const pointsDiscount = usePoints ? pointsToUse : 0;
  const totalAmount = baseTotal - pointsDiscount;

  // 장바구니 비어있으면 리다이렉트 (단, 주문 완료 중일 때는 제외)
  useEffect(() => {
    if (items.length === 0 && !isOrderCompleting.current) {
      navigate('/cart');
    }
  }, [items, navigate]);

  // 포인트 잔액 로드
  useEffect(() => {
    if (FEATURE_FLAGS.points && user) {
      loadPointsBalance();
    }
  }, [user]);

  // 배달/포장 변경 시 결제 수단 초기화
  useEffect(() => {
    setPaymentMethod('meet_card');
  }, [deliveryType]);

  const uid = user.uid;

  async function loadPointsBalance() {
    if (!user) return;

    try {
      const balance = await getPointsBalance(uid);
      setPointsBalance(balance);
    } catch (error) {
      console.error('Failed to load points balance:', error);
      toast.error('포인트 잔액을 불러오는데 실패했습니다.');
    }
  }

  // 포인트 사용 토글
  function handlePointsToggle(checked: boolean) {
    if (!checked) {
      setUsePoints(false);
      setPointsToUse(0);
      return;
    }

    // 사용 가능한 최대 포인트 계산
    const maxUsable = Math.min(pointsBalance, baseTotal);

    if (maxUsable < POINTS_POLICY.minUse) {
      toast.error(`최소 ${POINTS_POLICY.minUse.toLocaleString()}P부터 사용 가능합니다`);
      return;
    }

    setUsePoints(true);
    setPointsToUse(maxUsable);
  }

  // 포인트 사용 금액 변경
  function handlePointsChange(value: string) {
    const amount = parseInt(value) || 0;
    const maxUsable = Math.min(pointsBalance, baseTotal);

    if (amount > maxUsable) {
      setPointsToUse(maxUsable);
    } else if (amount < 0) {
      setPointsToUse(0);
    } else {
      setPointsToUse(amount);
    }
  }

  // 배달 시 주소 필수 확인
  // 만나서 결제(meet_card, meet_cash)는 배달 주소가 필요 없음
  const canProceed = agreeTerms && phone && (
    deliveryType === 'pickup' ||
    deliveryAddress ||
    paymentMethod === 'meet_card' ||
    paymentMethod === 'meet_cash'
  );

  const handlePayment = async () => {
    if (!canProceed) {
      toast.error('필수 정보를 입력해 주세요');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. 주문 생성 (Firebase 또는 localStorage)
      const newOrder = await createOrder({
        storeId: 'store-hyunpung',
        userId: uid,
        items: items.map((item) => ({
          menuId: item.menuId,
          menuName: item.menuName,
          menuImage: item.menuImage || '',
          quantity: item.quantity,
          options: item.options,
          price: item.menuPrice,
          subtotal: item.subtotal,
        })),
        subtotal,
        discount: couponDiscount,
        couponId: undefined,
        deliveryFee,
        finalAmount: totalAmount,
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : undefined,
        phone,
        email: email || undefined,
        requests: requests || undefined,
        payment: {
          method: paymentMethod,
          status: (paymentMethod === 'meet_card' || paymentMethod === 'meet_cash')
            ? 'pending'
            : 'authorized',
          amount: totalAmount,
        },
      });

      const orderId = newOrder.orderId;

      // 2. 포인트 사용 처리
      if (usePoints && pointsToUse > 0) {
        try {
          await spendPoints({
            uid,
            amount: pointsToUse,
            ref: {
              kind: 'order',
              id: orderId,
            },
            note: `주문 결제 시 포인트 사용`,
          });
        } catch (error) {
          console.error('Points spend error:', error);
          // 포인트 차감 실패해도 주문은 유지 (주문 완료 후 포인트 차감 실패 처리)
          toast.warning('포인트 차감 중 오류가 발생했습니다');
        }
      }

      // 3. 주문 완료 플래그 설정 (useEffect 리다이렉트 방지)
      isOrderCompleting.current = true;

      // 4. 성공 메시지 및 주문 트래킹으로 이동 (먼저 실행)
      if (paymentMethod === 'meet_card' || paymentMethod === 'meet_cash' || paymentMethod === 'app_card') {
        // 모든 결제 방식: 주문 접수 완료 (Mock 모드)

        const message = paymentMethod === 'app_card'
          ? '결제가 완료되었습니다 (테스트)'
          : '주문이 접수되었습니다';

        toast.success(<span data-testid="toast.order.success">{message}</span>, { duration: 5000 });
        // 토스트 DOM 마운트 확보를 위한 짧은 지연
        await new Promise((r) => setTimeout(r, 75));

        const resultParam = paymentMethod === 'app_card' ? 'success' : 'on_site';
        navigate(`/order/${orderId}?result=${resultParam}`);
      }
      // NICEPAY 로직 제거 (Mock 모드에서는 불필요)

      // 5. 장바구니 비우기 (navigate 완료 후 실행)
      setTimeout(() => clearCart(), 100);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : '결제 처리 중 오류가 발생했습니다');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pb-32" data-testid="checkout.page">
      <div className="px-4 py-6 space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-2xl text-[#2E1C10] mb-1">
            결제
          </h1>
          <p className="text-[#2E1C10]/60">
            결제 정보를 입력해 주세요
          </p>
          <Alert className="mt-3">
            현재 이 앱은 실제 PG 연동 없이 Mock 기반 주문 생성만 지원합니다. (결제는 Phase 3 이후 연동 예정)
          </Alert>
        </div>

        {/* 주문 요약 */}
        <div className="bg-white rounded-2xl p-4 space-y-3">
          <h2 className="text-[#2E1C10]">주문 요약</h2>

          {/* 주문 아이템 목록 */}
          <div className="space-y-2">
            {items.slice(0, 3).map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-[#2E1C10]/80">
                  {item.menuName} x {item.quantity}
                </span>
                <span className="text-[#2E1C10]">
                  {formatPrice(item.subtotal)}
                </span>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-sm text-[#2E1C10]/60">
                외 {items.length - 3}개 메뉴
              </p>
            )}
          </div>

          <Separator />

          {/* CheckoutSummary 컴포넌트 사용 (금액 변화 애니메이션) */}
          <CheckoutSummary
            subtotal={subtotal}
            deliveryFee={deliveryType === 'delivery' ? deliveryFee : 0}
            couponDiscount={couponDiscount}
            pointsUsed={pointsDiscount}
            total={totalAmount}
            highlightChanges={true}
          />
        </div>

        {/* 포인트 사용 */}
        {FEATURE_FLAGS.points && (
          <div className="bg-white rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#D61C1C]" />
                <h2 className="text-[#2E1C10]">포인트 사용</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#2E1C10]/60">
                  보유: {pointsBalance.toLocaleString()}P
                </span>
                <Switch
                  checked={usePoints}
                  onCheckedChange={handlePointsToggle}
                  disabled={pointsBalance < POINTS_POLICY.minUse}
                />
              </div>
            </div>

            {usePoints && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={pointsToUse}
                    onChange={(e) => handlePointsChange(e.target.value)}
                    placeholder="사용할 포인트"
                    min={0}
                    max={Math.min(pointsBalance, baseTotal)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPointsToUse(Math.min(pointsBalance, baseTotal))}
                  >
                    전액 사용
                  </Button>
                </div>
                <p className="text-xs text-[#2E1C10]/60">
                  최소 {POINTS_POLICY.minUse.toLocaleString()}P부터 사용 가능 •
                  최대 {Math.min(pointsBalance, baseTotal).toLocaleString()}P 사용 가능
                </p>
                {pointsToUse > 0 && (
                  <div className="flex justify-between text-sm p-3 bg-[#FBF9F6] rounded-lg">
                    <span className="text-[#2E1C10]/60">포인트 할인</span>
                    <span className="text-[#D61C1C] font-medium">
                      -{formatPrice(pointsToUse)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {pointsBalance < POINTS_POLICY.minUse && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 text-sm">
                  포인트가 {POINTS_POLICY.minUse.toLocaleString()}P 미만입니다.
                  주문 후 포인트를 적립하세요!
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* 연락처 정보 */}
        <div className="space-y-4">
          <h2 className="text-[#2E1C10]">연락처 정보</h2>
          <div>
            <Label htmlFor="phone">전화번호 *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="010-1234-5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">이메일 (선택)</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-[#2E1C10]/60 mt-1">
              이메일 영수증을 받으실 수 있어요
            </p>
          </div>
        </div>

        {/* 배달 주소 (배달 시만) */}
        {deliveryType === 'delivery' && !deliveryAddress && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              배달 주소를 입력해 주세요.{' '}
              <button className="underline" onClick={() => navigate('/cart')}>
                장바구니에서 설정
              </button>
            </AlertDescription>
          </Alert>
        )}

        {deliveryType === 'delivery' && deliveryAddress && (
          <div className="bg-white rounded-2xl p-4">
            <h2 className="text-[#2E1C10] mb-2">배달 주소</h2>
            <p className="text-sm text-[#2E1C10]">{deliveryAddress.address}</p>
            <p className="text-sm text-[#2E1C10]/60">{deliveryAddress.detail}</p>
          </div>
        )}

        {/* 결제 수단 */}
        <div>
          <h2 className="text-[#2E1C10] mb-3">결제 수단</h2>
          <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
            {/* 앱 결제 (Mock) */}
            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-[#2E1C10]/10 mb-2">
              <RadioGroupItem value="app_card" id="payment-app-card" />
              <Label htmlFor="payment-app-card" className="flex items-center gap-2 cursor-pointer flex-1">
                <Smartphone className="w-5 h-5 text-[#D61C1C]" />
                <div>
                  <p className="text-[#2E1C10]">앱 결제</p>
                  <p className="text-sm text-[#2E1C10]/60">앱에서 바로 결제합니다. (현재는 테스트 모드로 결제 없이 주문만 생성됩니다)</p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-[#2E1C10]/10 mb-2">
              <RadioGroupItem value="meet_card" id="payment-meet-card" />
              <Label htmlFor="payment-meet-card" className="flex items-center gap-2 cursor-pointer flex-1">
                <CreditCard className="w-5 h-5 text-[#C7A45A]" />
                <div>
                  <p className="text-[#2E1C10]">만나서 카드 결제</p>
                  <p className="text-sm text-[#2E1C10]/60">
                    {isDelivery ? '배달 기사님 또는 매장에서 카드 단말기로 결제합니다.' : '매장에서 카드 단말기로 결제합니다.'}
                  </p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-[#2E1C10]/10">
              <RadioGroupItem value="meet_cash" id="payment-meet-cash" />
              <Label htmlFor="payment-meet-cash" className="flex items-center gap-2 cursor-pointer flex-1">
                <HandCoins className="w-5 h-5 text-[#C7A45A]" />
                <div>
                  <p className="text-[#2E1C10]">만나서 현금 결제</p>
                  <p className="text-sm text-[#2E1C10]/60">
                    {isDelivery ? '배달 기사님 또는 매장에서 현금으로 결제합니다.' : '매장에서 현금으로 결제합니다.'}
                  </p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* 약관 동의 */}
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
            />
            <Label htmlFor="terms" className="cursor-pointer leading-relaxed">
              <span className="text-[#2E1C10]">
                전자금융거래 이용약관, 주문 내역 확인 및 결제 동의
              </span>
            </Label>
          </div>
          <p className="text-xs text-[#2E1C10]/60 pl-6">
            위 내용을 확인하였으며 결제에 동의합니다.
          </p>
        </div>
      </div>

      {/* 하단 고정 결제 버튼 */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-[#2E1C10]/10 px-4 py-4">
        <Button
          size="lg"
          className="w-full bg-[#D61C1C] hover:bg-[#D61C1C]/90"
          disabled={!canProceed || isProcessing}
          onClick={handlePayment}
          data-testid="checkout.button.submit"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              결제 처리 중...
            </>
          ) : (
            `${formatPrice(totalAmount)} 결제하기`
          )}
        </Button>
      </div>
    </div>
  );
}
