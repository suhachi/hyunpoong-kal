import { useState, useEffect, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  CreditCard,
  HandCoins,
  Loader2,
  AlertCircle,
  Gift,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { getPointsBalance, spendPoints, POINTS_POLICY } from "@/lib/points.api";
import { createOrder } from "@/lib/orders.api";
import { initiatePayment } from "@/lib/nicepay"; // NICEPAY 헬퍼 사용
import { FEATURE_FLAGS, NICEPAY_CONFIG, MAX_DELIVERY_RADIUS_KM, STORE_ID } from "@/config/env";
import { PaymentMethod, PaymentStatus } from "@/types/order";
import type { PaymentRequest } from "@/types/payment";
import { CheckoutSummary } from "@/components/app/CheckoutSummary";
import { formatPrice } from "@/lib/utils";
import { calculateDistanceKm } from "@/lib/distance";
import { getDoc } from "firebase/firestore";
import { storeDocRef, type StoreDoc } from "@/lib/firebase/firestore-schema";
import { v4 as uuidv4 } from "uuid"; // clientOrderId 생성용

export function Checkout() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const {
    state: {
      items,
      deliveryType,
      deliveryAddress,
      requests,
      couponDiscount,
      couponId,
    },
    actions: {
      getSubtotal,
      getDeliveryFee,
      clearCart,
    }
  } = useCart();

  // 1. 모든 Hooks를 최상단으로 이동
  const isOrderCompleting = useRef(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.MEET_CARD);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 포인트 관련 상태
  const [pointsBalance, setPointsBalance] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);

  // 매장 정보 (배달 범위 체크용)
  const [storeInfo, setStoreInfo] = useState<StoreDoc | null>(null);

  // 2. Derived State 계산 (Hooks 아래, Early Return 위)
  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const baseTotal = subtotal - couponDiscount + deliveryFee;
  const pointsDiscount = usePoints ? pointsToUse : 0;
  const totalAmount = baseTotal - pointsDiscount;
  const isDelivery = deliveryType === "delivery";
  const uid = user?.uid;

  const useOnlinePayment = import.meta.env.VITE_USE_ONLINE_PAYMENT === "true";

  // 3. useEffects (조건부 로직은 내부에서 처리)

  // 장바구니 비어있으면 리다이렉트 (단, 주문 완료 중일 때는 제외)
  useEffect(() => {
    if (authLoading) return; // 로딩 중이면 대기
    if (items.length === 0 && !isOrderCompleting.current) {
      navigate("/cart");
    }
  }, [items, navigate, authLoading]);

  // 매장 정보 로드 (배달 범위 체크용)
  useEffect(() => {
    async function loadStoreInfo() {
      try {
        const docRef = storeDocRef(STORE_ID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStoreInfo(docSnap.data() as StoreDoc);
        }
      } catch (error) {
        console.error("Failed to load store info:", error);
        // 매장 정보 로드 실패는 치명적이지 않으므로 에러 무시 (배달 범위 체크만 스킵됨)
      }
    }

    loadStoreInfo();
  }, []);

  // 포인트 잔액 로드
  useEffect(() => {
    async function loadPointsBalance() {
      if (!user) return;

      try {
        const balance = await getPointsBalance(user.uid);
        setPointsBalance(balance);
      } catch (error) {
        console.error("Failed to load points balance:", error);
        toast.error("포인트 잔액을 불러오는데 실패했습니다.");
      }
    }

    if (FEATURE_FLAGS.points && user) {
      loadPointsBalance();
    }
  }, [user]);

  // 배달/포장 변경 시 결제 수단 초기화
  useEffect(() => {
    setPaymentMethod(PaymentMethod.MEET_CARD);
  }, [deliveryType]);

  // 사용자 전화번호 프리필
  useEffect(() => {
    if (user?.phoneNumber) {
      setPhone(user.phoneNumber);
    }
  }, [user]);

  // 4. 핸들러 함수들
  const handlePointsToggle = (checked: boolean) => {
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
  };

  const handlePointsChange = (value: string) => {
    const amount = parseInt(value) || 0;
    const maxUsable = Math.min(pointsBalance, baseTotal);

    if (amount > maxUsable) {
      setPointsToUse(maxUsable);
    } else if (amount < 0) {
      setPointsToUse(0);
    } else {
      setPointsToUse(amount);
    }
  };

  const canProceed =
    agreeTerms &&
    phone &&
    (deliveryType === "pickup" || (deliveryType === "delivery" && deliveryAddress?.address));

  const handlePayment = async () => {
    if (!user || !uid) {
      toast.error("로그인이 필요합니다");
      return;
    }

    if (!canProceed) {
      if (!phone) {
        toast.error("전화번호를 입력해 주세요");
        document.getElementById("phone")?.focus();
        return;
      }
      if (!agreeTerms) {
        toast.error("결제 약관에 동의해 주세요");
        return;
      }
      if (deliveryType === "delivery" && !deliveryAddress?.address) {
        toast.error("배달 주소를 먼저 설정해 주세요 (장바구니에서 설정 버튼 사용)");
        navigate("/cart");
        return;
      }
      toast.error("필수 정보를 입력해 주세요");
      return;
    }

    // 배달 주소 최종 검증 (2차 방어막)
    if (deliveryType === "delivery" && !deliveryAddress?.address) {
      console.error("[Checkout] CRITICAL: 배달 주문인데 주소가 없음");
      toast.error("배달 주소를 먼저 설정해 주세요");
      navigate("/cart");
      return;
    }

    // 배달 가능 범위 체크 (T-ADDR-03, T-ADDR-04)
    // 우선순위: storeInfo.deliveryRadiusKm > MAX_DELIVERY_RADIUS_KM > OFF
    const storeRadiusKm = storeInfo?.deliveryRadiusKm;
    const effectiveRadiusKm =
      typeof storeRadiusKm === "number" && storeRadiusKm > 0
        ? storeRadiusKm
        : MAX_DELIVERY_RADIUS_KM;

    if (
      deliveryType === "delivery" &&
      effectiveRadiusKm > 0
    ) {
      const storeLat = storeInfo?.address?.lat;
      const storeLng = storeInfo?.address?.lng;
      const customerLat = deliveryAddress?.lat;
      const customerLng = deliveryAddress?.lng;

      // 좌표가 모두 있을 때만 거리 체크
      if (
        typeof storeLat === "number" &&
        typeof storeLng === "number" &&
        typeof customerLat === "number" &&
        typeof customerLng === "number"
      ) {
        const distanceKm = calculateDistanceKm(
          storeLat,
          storeLng,
          customerLat,
          customerLng,
        );

        if (distanceKm > effectiveRadiusKm) {
          toast.error(
            `배달 가능 범위(${effectiveRadiusKm}km)를 벗어났습니다. 매장 인근 주소로 다시 시도해 주세요.`,
          );
          setIsProcessing(false);
          return;
        }
      }
      // 좌표가 없으면 거리 체크를 건너뛰고 기존 플로우 진행 (안전 모드)
    }

    setIsProcessing(true);

    try {
      // 멱등성 키 생성
      const clientOrderId = uuidv4();

      // 1. 주문 생성 (Firebase 또는 localStorage)
      // 앱 결제인 경우 PENDING 상태로 시작
      const initialStatus = paymentMethod === PaymentMethod.APP_CARD
        ? PaymentStatus.PENDING
        : PaymentStatus.PENDING; // 만나서 결제도 승인 전이므로 PENDING

      const newOrder = await createOrder({
        storeId: "store-hyunpung",
        userId: uid,
        items: items.map(item => ({
          menuId: item.menuId,
          menuName: item.menuName,
          menuImage: item.menuImage || "",
          quantity: item.quantity,
          options: item.options,
          price: item.menuPrice,
          subtotal: item.subtotal,
        })),
        subtotal,
        discount: couponDiscount,
        couponId: couponId,
        couponApplied: !!couponDiscount,
        deliveryFee,
        finalAmount: totalAmount,
        deliveryType,
        deliveryAddress: deliveryType === "delivery" ? deliveryAddress : undefined,
        phone,
        phoneNumber: phone,
        email: email || undefined,
        requests: requests || undefined,
        payment: {
          method: paymentMethod,
          status: initialStatus,
          amount: totalAmount,
        },
        clientOrderId, // 멱등성 키 전달
      });

      const orderId = newOrder.orderId;

      // 2. 앱 결제(PG) 프로세스
      // A-2: 결제 방식이 APP_CARD이고, 온라인 결제가 활성화되어 있을 때만 NICEPAY 연동
      if (
        paymentMethod === PaymentMethod.APP_CARD &&
        FEATURE_FLAGS.onlinePayment &&
        NICEPAY_CONFIG.mid
      ) {
        try {
          const origin = window.location.origin;

          // 2) PaymentRequest 구성
          const paymentRequest: PaymentRequest = {
            orderId,
            amount: totalAmount,
            goodsName: items[0].menuName + (items.length > 1 ? ` 외 ${items.length - 1}건` : ""),
            buyerName: user.displayName || "고객",
            buyerTel: phone,
            buyerEmail: email,
            returnUrl: `${origin}/order/return`,
            cancelUrl: `${origin}/order/cancel`,
          };

          // 3) NICEPAY 결제 생성 (initiatePayment 사용)
          const { authUrl, authToken } = await initiatePayment(paymentRequest);

          // 4) authToken 저장 (로컬/세션) - Return 페이지에서 검증용
          sessionStorage.setItem(`payment_auth_${orderId}`, authToken);

          // 5) PG사 결제 페이지로 리다이렉트
          if (authUrl) {
            window.location.href = authUrl;
            return; // 리다이렉트되므로 이후 로직 중단
          } else {
            throw new Error("PG 결제 URL을 받아오지 못했습니다.");
          }
        } catch (pgError: any) {
          console.error("PG Init Error:", pgError);
          toast.error("결제 초기화 실패: " + pgError.message);
          setIsProcessing(false);
          // TODO: 결제 요청 실패 시 PENDING 상태로 남은 주문 처리(취소/만료) 로직 추가 검토
          return; // 중단
        }
      }

      // MEET_CARD / MEET_CASH:
      //  - PG(NICEPAY)를 거치지 않고 주문만 생성한다.
      //  - 추후 매장 POS에서 결제 완료 처리(승인) 상태로 변경될 수 있다.

      // 3. 만나서 결제 (또는 앱결제 미사용 시 Mock 처리) - 기존 로직
      // 포인트 사용 처리 (여기서 처리하거나 서버에서 처리)
      // 앱 결제의 경우 confirmPayment 성공 시 서버에서 포인트 처리하는 것이 안전함.
      // 만나서 결제의 경우 여기서 처리.
      if (usePoints && pointsToUse > 0) {
        try {
          await spendPoints({
            uid,
            amount: pointsToUse,
            ref: {
              kind: "order",
              id: orderId,
            },
            note: `주문 결제 시 포인트 사용`,
          });
        } catch (error) {
          console.error("Points spend error:", error);
          // 포인트 차감 실패해도 주문은 유지 (주문 완료 후 포인트 차감 실패 처리)
          toast.warning("포인트 차감 중 오류가 발생했습니다");
        }
      }

      // 주문 완료 플래그 설정 (useEffect 리다이렉트 방지)
      isOrderCompleting.current = true;

      // 성공 메시지 및 주문 트래킹으로 이동
      const message = "주문이 접수되었습니다";
      toast.success(<span data-testid="toast.order.success">{message}</span>, { duration: 5000 });
      await new Promise(r => setTimeout(r, 75));

      const resultParam = "on_site";
      navigate(`/order/${orderId}?result=${resultParam}`);

      // 장바구니 비우기 (navigate 완료 후 실행)
      setTimeout(() => clearCart(), 100);

    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "결제 처리 중 오류가 발생했습니다");
      setIsProcessing(false);
    } finally {
      // 앱 결제 리다이렉트 시에는 finally가 실행되지 않을 수 있음 (페이지 이동)
      if (paymentMethod !== PaymentMethod.APP_CARD) {
        setIsProcessing(false);
      }
    }
  };

  // 5. 렌더링 로직 (Early Return은 여기부터 허용)
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

  return (
    <div className="pb-32" data-testid="checkout.page">
      <div className="px-4 py-6 space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-2xl text-[#2E1C10] mb-1">결제</h1>
          <p className="text-[#2E1C10]/60">결제 정보를 입력해 주세요</p>
          {!useOnlinePayment && (
            <Alert className="mt-3">
              현재 이 앱은 실제 PG 연동 없이 Mock 기반 주문 생성만 지원합니다. (결제는 Phase 3 이후
              연동 예정)
            </Alert>
          )}
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
                <span className="text-[#2E1C10]">{formatPrice(item.subtotal)}</span>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-sm text-[#2E1C10]/60">외 {items.length - 3}개 메뉴</p>
            )}
          </div>

          <Separator />

          {/* CheckoutSummary 컴포넌트 사용 (금액 변화 애니메이션) */}
          <CheckoutSummary
            subtotal={subtotal}
            deliveryFee={deliveryType === "delivery" ? deliveryFee : 0}
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
                    onChange={e => handlePointsChange(e.target.value)}
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
                  최소 {POINTS_POLICY.minUse.toLocaleString()}P부터 사용 가능 • 최대{" "}
                  {Math.min(pointsBalance, baseTotal).toLocaleString()}P 사용 가능
                </p>
                {pointsToUse > 0 && (
                  <div className="flex justify-between text-sm p-3 bg-[#FBF9F6] rounded-lg">
                    <span className="text-[#2E1C10]/60">포인트 할인</span>
                    <span className="text-[#D61C1C] font-medium">-{formatPrice(pointsToUse)}</span>
                  </div>
                )}
              </div>
            )}

            {pointsBalance < POINTS_POLICY.minUse && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 text-sm">
                  포인트가 {POINTS_POLICY.minUse.toLocaleString()}P 미만입니다. 주문 후 포인트를
                  적립하세요!
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
              onChange={e => setPhone(e.target.value)}
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
              onChange={e => setEmail(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-[#2E1C10]/60 mt-1">이메일 영수증을 받으실 수 있어요</p>
          </div>
        </div>

        {/* 배달 주소 (배달 시만) */}
        {deliveryType === "delivery" && !deliveryAddress?.address && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              배달 주소를 먼저 설정해 주세요 (장바구니에서 설정 버튼 사용)
            </AlertDescription>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate("/cart")}>
              장바구니로 이동
            </Button>
          </Alert>
        )}

        {deliveryType === "delivery" && deliveryAddress && (
          <div className="bg-white rounded-2xl p-4">
            <h2 className="text-[#2E1C10] mb-2">배달 주소</h2>
            <p className="text-sm text-[#2E1C10]">{deliveryAddress.address}</p>
            <p className="text-sm text-[#2E1C10]/60">{deliveryAddress.detail}</p>
          </div>
        )}

        {/* 결제 수단 */}
        <div>
          <h2 className="text-[#2E1C10] mb-3">결제 수단</h2>
          <RadioGroup
            value={paymentMethod}
            onValueChange={v => setPaymentMethod(v as PaymentMethod)}
          >
            {/* 앱 결제 */}
            {useOnlinePayment && (
              <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-[#2E1C10]/10 mb-2">
                <RadioGroupItem value={PaymentMethod.APP_CARD} id="payment-app-card" />
                <Label
                  htmlFor="payment-app-card"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <Smartphone className="w-5 h-5 text-[#D61C1C]" />
                  <div>
                    <p className="text-[#2E1C10]">앱 결제</p>
                    <p className="text-sm text-[#2E1C10]/60">
                      신용카드/간편결제로 바로 결제합니다.
                    </p>
                  </div>
                </Label>
              </div>
            )}

            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-[#2E1C10]/10 mb-2">
              <RadioGroupItem value={PaymentMethod.MEET_CARD} id="payment-meet-card" />
              <Label
                htmlFor="payment-meet-card"
                className="flex items-center gap-2 cursor-pointer flex-1"
              >
                <CreditCard className="w-5 h-5 text-[#C7A45A]" />
                <div>
                  <p className="text-[#2E1C10]">만나서 카드 결제</p>
                  <p className="text-sm text-[#2E1C10]/60">
                    {isDelivery
                      ? "배달 기사님 또는 매장에서 카드 단말기로 결제합니다."
                      : "매장에서 카드 단말기로 결제합니다."}
                  </p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-[#2E1C10]/10">
              <RadioGroupItem value={PaymentMethod.MEET_CASH} id="payment-meet-cash" />
              <Label
                htmlFor="payment-meet-cash"
                className="flex items-center gap-2 cursor-pointer flex-1"
              >
                <HandCoins className="w-5 h-5 text-[#C7A45A]" />
                <div>
                  <p className="text-[#2E1C10]">만나서 현금 결제</p>
                  <p className="text-sm text-[#2E1C10]/60">
                    {isDelivery
                      ? "배달 기사님 또는 매장에서 현금으로 결제합니다."
                      : "매장에서 현금으로 결제합니다."}
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
              onCheckedChange={checked => setAgreeTerms(checked as boolean)}
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
          disabled={isProcessing}
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
