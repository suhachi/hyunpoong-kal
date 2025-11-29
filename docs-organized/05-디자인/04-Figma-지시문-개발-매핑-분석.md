# Figma 디자인 지시문 → 개발 구현 매핑 분석

**문서 버전:** 1.0  
**작성일:** 2025-10-29  
**프로젝트:** 현풍닭칼국수 PWA  
**개발사:** KS컴퍼니 (사업자번호: 553-17-00098)

---

## 📋 Executive Summary

### 목적
팀장의 Figma 디자인 작업지시문(A~N, 14개 Phase)을 개발 구현 관점에서 분석하고, 현재 구현 상태와 매핑하여 누락 기능을 식별

### 결과
- **완료:** 70% (10/14 Phase 기본 구현 완료)
- **부분 구현:** 20% (3/14 Phase UI/UX 개선 필요)
- **미구현:** 10% (1/14 Phase 신규 구현 필요)

### 우선순위 구현 항목
1. 🔴 **Phase A:** 쿠폰 적용 UI/UX 강화
2. 🔴 **Phase E:** 최소 주문금액 업셀 UX
3. 🟡 **Phase D:** 배달비 거리기반 시각화
4. 🟡 **Phase H:** 결제 단계별 상태 UI

---

## 📊 전체 Phase 구현 현황

| Phase | 주제 | 현재 상태 | 완성도 | 우선순위 |
|-------|------|-----------|--------|----------|
| A | 쿠폰 적용 | 🟡 부분 구현 | 60% | 🔴 High |
| B | 포인트 리워드 | ✅ 완료 | 90% | 🟢 Low |
| C | 주문 내역/재주문 | ✅ 완료 | 95% | 🟢 Low |
| D | 배달비 거리기반 | 🟡 부분 구현 | 70% | 🟡 Med |
| E | 최소 주문금액 업셀 | ❌ 미구현 | 30% | 🔴 High |
| F | 온보딩/약관/푸시 | ✅ 완료 | 85% | 🟢 Low |
| G | 주류 보호/성인인증 | ✅ 완료 | 90% | 🟢 Low |
| H | 결제 NICEPAY | 🟡 부분 구현 | 70% | 🟡 Med |
| I | CSV 업·다운 | ✅ 완료 | 100% | 🟢 Low |
| J | 이미지 파이프라인 | ✅ 완료 | 85% | 🟢 Low |
| K | FCM 알림 Inbox | ✅ 완료 | 90% | 🟢 Low |
| L | 마이페이지/정책 | ✅ 완료 | 80% | 🟢 Low |
| M | PWA 품질/접근성 | ✅ 완료 | 85% | 🟢 Low |
| N | 집계/KPI/Export | ✅ 완료 | 95% | 🟢 Low |

**전체 평균 완성도: 81.4%**

---

## 🔍 Phase별 상세 분석

### ✅ Phase A: 쿠폰 적용 UI/UX

#### 지시문 요구사항
```
목표: 결제 전 금액 산정 + 최소금액/만료/중복/사용횟수 검증 + 명확한 피드백

프레임:
- A1 Checkout_Summary: Subtotal/Delivery/Coupon/Points/Total (금액 변화 하이라이트)
- A2 Coupon_Apply: 코드 입력·추천 리스트·적용/해제
- A3 Coupon_Validation: 상태별 화면 (최소금액미달/만료/중복/횟수초과/성공)

카피:
- "최소 주문금액 {X}원 이상일 때만 사용 가능해요."
- "이미 다른 쿠폰이 적용되어 있어요. 기존 쿠폰을 해제해 주세요."
```

#### 현재 구현 상태

**파일:**
- `/pages/app/Checkout.tsx` (결제 페이지)
- `/pages/app/Coupons.tsx` (쿠폰 목록)
- `/types/coupon.ts` (타입 정의)
- `/lib/coupons.api.ts` (API)

**구현된 기능:**
- ✅ 쿠폰 목록 조회
- ✅ 쿠폰 적용/해제
- ✅ 최소 주문금액 검증
- ✅ 만료일 체크
- ✅ 사용 가능 여부 체크

**누락된 UI/UX:**
- ❌ 금액 변화 하이라이트 애니메이션
- ❌ 쿠폰 적용 전/후 명확한 비교 UI
- ❌ InlineError + Toast 동시 피드백
- ❌ 추천 쿠폰 리스트 (장바구니 금액 기반)
- ❌ 중복 적용 시도 시 기존 쿠폰 해제 가이드

**Gap:** UI/UX 개선 필요 (60% → 100%)

#### 구현 필요 사항

```typescript
// 1. Checkout Summary 컴포넌트 개선
<CheckoutSummary
  subtotal={subtotal}
  deliveryFee={deliveryFee}
  couponDiscount={couponDiscount}
  pointsUsed={pointsUsed}
  total={total}
  highlightChanges={true}  // ← 애니메이션
/>

// 2. 쿠폰 적용 모달 개선
<CouponApplyModal
  availableCoupons={recommendedCoupons}  // ← 추천 로직
  currentCoupon={appliedCoupon}
  onApply={handleApply}
  validation={couponValidation}  // ← 상세 검증 결과
/>

// 3. 인라인 에러 + 토스트
{validationError && (
  <InlineError message={validationError.message} />
)}
toast.error(validationError.message);
```

---

### ✅ Phase B: 포인트 리워드/사용/만료

#### 지시문 요구사항
```
목표: 적립/사용/만료 시각화, 결제 반영, 영수증 표기

프레임:
- B1 Points_Use: 입력/슬라이더/최대 사용 CTA, 잔액/만료 예정 배지
- B2 Points_Receipt_Line: "적립 예정 {N}P" / "사용 {N}P"

카피:
- "최대 {N}포인트까지 사용 가능합니다. 만료 임박 {M}P."
```

#### 현재 구현 상태

**파일:**
- `/pages/app/Points.tsx`
- `/types/points.ts`
- `/lib/points.api.ts`

**구현된 기능:**
- ✅ 포인트 적립/사용 로직
- ✅ 만료일 관리
- ✅ 결제 시 포인트 차감
- ✅ 영수증 포인트 표시

**우수한 점:**
- ✅ 슬라이더 UI 구현
- ✅ 실시간 금액 반영
- ✅ 만료 예정 배지
- ✅ 최대 사용 가능 포인트 표시

**Gap:** 90% 완성 (UI 미세 조정만 필요)

---

### ✅ Phase C: 주문 내역/재주문

#### 지시문 요구사항
```
목표: 필터/무한스크롤·상세·재주문 경고 UX

프레임:
- C1 Orders_List: 기간/상태 필터, 정렬, empty/끝 도달
- C2 Order_Detail: 상품/합계/쿠폰/포인트/결제/영수증/상태/"재주문" CTA

상호작용:
- 재주문 클릭 → "품절/가격 변경" 경고 모달 → 장바구니 복원/대체 안내
```

#### 현재 구현 상태

**파일:**
- `/pages/app/OrderHistory.tsx`
- `/pages/app/OrderTracking.tsx`
- `/components/admin/OrderDetailDrawer.tsx`

**구현된 기능:**
- ✅ 주문 목록 필터링
- ✅ 상태별 필터
- ✅ 주문 상세 정보
- ✅ 재주문 버튼
- ✅ 영수증 다운로드

**우수한 점:**
- ✅ 완전한 주문 관리 시스템
- ✅ 실시간 상태 업데이트
- ✅ 상세 정보 Drawer

**Gap:** 95% 완성 (재주문 경고 모달 추가 권장)

---

### 🟡 Phase D: 배달비 거리기반 UI

#### 지시문 요구사항
```
목표: 주소→좌표→구간표 요금 산정 결과와 불가권역 차단 UX

프레임:
- D1 Address_Input: 검색/최근 사용/지도 미니뷰
- D2 Fee_Result: 0~1/1~3/3~5km 구간표, 야간비 표시, 금액 변화 하이라이트
- D3 Not_Serviced: 불가권역 안내 + 대체 옵션

카피:
- "현재 위치는 배달 가능 권역을 벗어났어요. 포장 주문은 가능해요."
```

#### 현재 구현 상태

**파일:**
- `/lib/admin/settings.api.ts` (거리기반 요금)
- `/components/admin/FeesForm.tsx`

**구현된 기능:**
- ✅ 거리 구간별 요금 설정
- ✅ 야간 배달비 설정
- ✅ 최소 주문금액 설정

**누락된 UI:**
- ❌ 주소 입력 시 실시간 배달비 계산 표시
- ❌ 구간표 시각화 (0~1km, 1~3km, 3~5km)
- ❌ 불가권역 안내 화면
- ❌ 지도 미니뷰

**Gap:** 70% (백엔드 완료, 프론트엔드 UI 개선 필요)

#### 구현 필요 사항

```typescript
// Checkout.tsx에서 배달비 시각화
<DeliveryFeeBreakdown
  distance={deliveryDistance}
  baseRate={feeByDistance}
  nightSurcharge={isNightTime ? nightFee : 0}
  total={deliveryFee}
  zones={[
    { range: '0-1km', fee: 2000, current: distance <= 1 },
    { range: '1-3km', fee: 3000, current: distance > 1 && distance <= 3 },
    { range: '3-5km', fee: 4000, current: distance > 3 && distance <= 5 },
  ]}
/>
```

---

### ❌ Phase E: 최소 주문금액 업셀 UX

#### 지시문 요구사항
```
목표: 임계값 미달 시 결제 버튼 차단 + "더 담기" 제안

프레임:
- E1 MinOrder_Block: 비활성 결제 버튼 + UpsellCard(추천 메뉴)

상호작용:
- 'X원 더 담기' 클릭 → 추천 섹션으로 스크롤/이동
```

#### 현재 구현 상태

**파일:**
- `/pages/app/Checkout.tsx`

**구현된 기능:**
- ✅ 최소 주문금액 검증
- ✅ 미달 시 결제 버튼 비활성화
- ✅ 부족 금액 표시

**누락된 UI:**
- ❌ UpsellCard 컴포넌트 (추천 메뉴)
- ❌ "X원 더 담기" CTA
- ❌ 추천 메뉴 섹션으로 스크롤
- ❌ 스마트 추천 로직 (인기 메뉴, 최근 본 메뉴)

**Gap:** 30% (핵심 UX 미구현)

#### 구현 필요 사항

```typescript
// 1. UpsellCard 컴포넌트 생성
<UpsellSection
  missingAmount={minOrderAmount - cartTotal}
  recommendedItems={getRecommendedItems(missingAmount)}
  onAddToCart={(item) => addToCart(item)}
/>

// 2. Checkout 페이지 통합
{cartTotal < minOrderAmount && (
  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <p className="text-[#2E1C10]">
      최소 주문금액까지 <strong>{formatPrice(minOrderAmount - cartTotal)}</strong> 더 필요해요
    </p>
    <Button onClick={scrollToRecommended}>
      추천 메뉴 보기
    </Button>
    <UpsellSection ... />
  </div>
)}

// 3. 추천 로직
function getRecommendedItems(missingAmount: number) {
  return menus
    .filter(m => m.price <= missingAmount && !m.soldOut)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);
}
```

---

### ✅ Phase F: 온보딩/약관/푸시

#### 현재 구현 상태
- ✅ 온보딩 플로우 (초기 설정)
- ✅ 약관 동의 체크박스
- ✅ FCM 푸시 권한 요청
- ✅ A2HS 설치 배너

**Gap:** 85% 완성

---

### ✅ Phase G: 주류 보호/성인인증

#### 현재 구현 상태
- ✅ `isAlcohol` 필드 (`types/menu.ts`)
- ✅ 성인인증 로직
- ✅ 주류 포함 시 인증 게이트

**Gap:** 90% 완성

---

### 🟡 Phase H: 결제 NICEPAY

#### 지시문 요구사항
```
목표: 승인 2단계 전형과 예외 UX

프레임:
- H1 Payment_Methods: 결제수단 선택
- H2 Payment_Redirect: 외부 인증 진행, 타임아웃 티커
- H3 Payment_Success: 영수증 링크
- H4 Payment_Fail: 망취소/재시도/문의
- H5 Refund_Request: 환불 사유 입력

상태: loading/취소/부분환불/시간초과
```

#### 현재 구현 상태

**파일:**
- `/lib/nicepay.ts`
- `/pages/app/Checkout.tsx`

**구현된 기능:**
- ✅ NICEPAY 결제 연동
- ✅ 결제 성공/실패 처리
- ✅ 환불 요청

**누락된 UI:**
- ❌ Payment_Redirect 로딩 화면 (타임아웃 티커)
- ❌ Payment_Fail 상세 안내 (망취소 설명)
- ❌ 결제 단계별 Progress Indicator
- ❌ 시간초과 시 자동 재시도 안내

**Gap:** 70% (로직 완료, UI 강화 필요)

---

### ✅ Phase I: CSV 업·다운

#### 현재 구현 상태
- ✅ `/components/admin/MenuCSVImport.tsx`
- ✅ 파일 선택/검증/미리보기/적용/롤백
- ✅ 템플릿 다운로드
- ✅ 행별 오류 표시

**Gap:** 100% 완성 ⭐

---

### ✅ Phase J: 이미지 파이프라인

#### 현재 구현 상태
- ✅ `/lib/imageUtils.ts`
- ✅ Firebase Storage 업로드
- ✅ 썸네일 생성
- ✅ WebP 변환

**Gap:** 85% 완성

---

### ✅ Phase K: FCM 알림 Inbox

#### 현재 구현 상태
- ✅ `/pages/app/Notifications.tsx`
- ✅ 카테고리 필터 (전체/주문/프로모션)
- ✅ 읽음/안 읽음 상태
- ✅ 딥링크 처리

**Gap:** 90% 완성

---

### ✅ Phase L: 마이페이지

#### 현재 구현 상태
- ✅ `/pages/app/My.tsx`
- ✅ 주소 관리
- ✅ 회원 탈퇴 (30일 유예)
- ✅ 동의 이력

**Gap:** 80% 완성

---

### ✅ Phase M: PWA 품질

#### 현재 구현 상태
- ✅ Skeleton 로딩 (`components/ui/skeleton.tsx`)
- ✅ Empty State 패턴
- ✅ Error Boundary
- ✅ Offline 감지

**Gap:** 85% 완성

---

### ✅ Phase N: 집계/KPI

#### 현재 구현 상태
- ✅ `/pages/admin/Analytics.tsx`
- ✅ `/pages/admin/IntegratedAnalytics.tsx`
- ✅ 매출/AOV/재주문율
- ✅ CSV/Excel Export

**Gap:** 95% 완성

---

## 🎯 우선순위 구현 계획

### 🔴 High Priority (즉시 구현)

#### 1. Phase E: 최소 주문금액 업셀 UX
```
목표: 30% → 100%
시간: 2시간
파일: /components/app/UpsellCard.tsx (신규)
      /pages/app/Checkout.tsx (수정)
```

**구현 내용:**
- UpsellCard 컴포넌트
- 추천 메뉴 로직
- 스크롤 인터랙션

#### 2. Phase A: 쿠폰 적용 UI/UX 강화
```
목표: 60% → 100%
시간: 3시간
파일: /components/app/CouponApplyModal.tsx (신규)
      /components/app/CheckoutSummary.tsx (신규)
      /pages/app/Checkout.tsx (수정)
```

**구현 내용:**
- 금액 변화 애니메이션
- 추천 쿠폰 리스트
- InlineError + Toast 피드백
- 중복 적용 가이드

### 🟡 Medium Priority (다음 단계)

#### 3. Phase D: 배달비 거리기반 UI
```
목표: 70% → 95%
시간: 2시간
파일: /components/app/DeliveryFeeBreakdown.tsx (신규)
```

#### 4. Phase H: 결제 단계별 UI
```
목표: 70% → 90%
시간: 2시간
파일: /components/app/PaymentProgress.tsx (신규)
```

---

## 📋 구현 체크리스트

### Phase A: 쿠폰 적용
- [ ] CheckoutSummary 컴포넌트 (금액 변화 하이라이트)
- [ ] CouponApplyModal 개선 (추천 쿠폰)
- [ ] InlineError 컴포넌트
- [ ] 중복 적용 가이드 모달
- [ ] 쿠폰 적용 애니메이션

### Phase E: 업셀 UX
- [ ] UpsellCard 컴포넌트
- [ ] 추천 메뉴 로직 (인기도 기반)
- [ ] "X원 더 담기" 메시지
- [ ] 추천 섹션 스크롤
- [ ] 최소 금액 안내 배너

### Phase D: 배달비 UI
- [ ] DeliveryFeeBreakdown 컴포넌트
- [ ] 구간표 시각화
- [ ] 야간비 배지
- [ ] 불가권역 안내 화면

### Phase H: 결제 UI
- [ ] PaymentProgress 컴포넌트
- [ ] Payment_Redirect 로딩 (타임아웃)
- [ ] Payment_Fail 상세 안내
- [ ] 망취소 설명 모달

---

## 🏗️ 컴포넌트 설계

### 1. UpsellCard

```typescript
// /components/app/UpsellCard.tsx

interface UpsellCardProps {
  menu: Menu;
  missingAmount: number;
  onAddToCart: (menu: Menu) => void;
}

export function UpsellCard({ menu, missingAmount, onAddToCart }: UpsellCardProps) {
  return (
    <div className="flex gap-3 p-3 bg-white rounded-lg border border-[#C7A45A]/20">
      <img src={menu.image} className="w-16 h-16 rounded object-cover" />
      <div className="flex-1">
        <h4 className="font-medium text-[#2E1C10]">{menu.name}</h4>
        <p className="text-sm text-[#2E1C10]/60">{formatPrice(menu.price)}</p>
      </div>
      <Button
        size="sm"
        onClick={() => onAddToCart(menu)}
        className="self-center"
      >
        담기
      </Button>
    </div>
  );
}
```

### 2. CheckoutSummary

```typescript
// /components/app/CheckoutSummary.tsx

interface CheckoutSummaryProps {
  subtotal: number;
  deliveryFee: number;
  couponDiscount: number;
  pointsUsed: number;
  total: number;
  highlightChanges?: boolean;
}

export function CheckoutSummary(props: CheckoutSummaryProps) {
  const prevTotal = usePrevious(props.total);
  const hasChanged = prevTotal !== undefined && prevTotal !== props.total;

  return (
    <div className="space-y-2">
      <SummaryLine label="상품 금액" amount={props.subtotal} />
      <SummaryLine label="배달비" amount={props.deliveryFee} />
      
      {props.couponDiscount > 0 && (
        <SummaryLine 
          label="쿠폰 할인" 
          amount={-props.couponDiscount}
          className="text-[#D61C1C]"
          animate={hasChanged}
        />
      )}
      
      {props.pointsUsed > 0 && (
        <SummaryLine 
          label="포인트 사용" 
          amount={-props.pointsUsed}
          className="text-[#F37021]"
        />
      )}
      
      <Separator />
      
      <SummaryLine 
        label="총 결제금액" 
        amount={props.total}
        className="font-bold text-lg"
        animate={hasChanged}
      />
    </div>
  );
}
```

### 3. DeliveryFeeBreakdown

```typescript
// /components/app/DeliveryFeeBreakdown.tsx

interface Zone {
  range: string;
  fee: number;
  current: boolean;
}

interface DeliveryFeeBreakdownProps {
  distance: number;
  zones: Zone[];
  nightSurcharge?: number;
  total: number;
}

export function DeliveryFeeBreakdown(props: DeliveryFeeBreakdownProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#2E1C10]/60">배달 거리</span>
        <span className="font-medium">{props.distance.toFixed(1)}km</span>
      </div>

      <div className="space-y-2">
        {props.zones.map((zone) => (
          <div
            key={zone.range}
            className={cn(
              "flex items-center justify-between p-2 rounded",
              zone.current && "bg-[#D61C1C]/10 border border-[#D61C1C]/20"
            )}
          >
            <span className="text-sm">{zone.range}</span>
            <span className={cn(
              "font-medium",
              zone.current && "text-[#D61C1C]"
            )}>
              {formatPrice(zone.fee)}
            </span>
          </div>
        ))}
      </div>

      {props.nightSurcharge && (
        <div className="flex items-center justify-between text-[#F37021]">
          <span className="text-sm">야간 배달 추가</span>
          <span className="font-medium">+{formatPrice(props.nightSurcharge)}</span>
        </div>
      )}

      <Separator />

      <div className="flex items-center justify-between font-bold">
        <span>배달비</span>
        <span className="text-[#D61C1C]">{formatPrice(props.total)}</span>
      </div>
    </div>
  );
}
```

---

## 📚 구현 우선순위 로드맵

### Week 1: High Priority
```
Day 1-2: Phase E (업셀 UX) → 30% → 100%
Day 3-5: Phase A (쿠폰 UI) → 60% → 100%
```

### Week 2: Medium Priority
```
Day 1-2: Phase D (배달비 UI) → 70% → 95%
Day 3-4: Phase H (결제 UI) → 70% → 90%
Day 5: QA & 버그 수정
```

### Week 3: Polish
```
- 접근성 개선 (AA 준수)
- 애니메이션 미세 조정
- 반응형 테스트
- 다크모드 테마
```

---

## 🎨 디자인 토큰 적용

### 현재 상태
```css
/* /styles/globals.css */
:root {
  --color-primary: #D61C1C;        /* 현풍레드 */
  --color-secondary: #F37021;      /* 신칼오렌지 */
  --color-accent: #C7A45A;         /* 황동식기색 */
  --color-text: #2E1C10;           /* 진한 브라운 */
}
```

### Variables 구조 제안
```
[Foundation]
├── Color
│   ├── Brand/Primary (D61C1C)
│   ├── Brand/Secondary (F37021)
│   ├── Brand/Accent (C7A45A)
│   ├── Neutral/50~900
│   ├── Success/Warning/Danger/Info
│   └── Semantic
│       ├── Text/Primary/Secondary/Inverse
│       ├── Surface/Base/Alt/Inverse
│       └── Border/Focus
├── Typography
│   ├── H1~H3
│   ├── Body/Caption
│   └── Tabular (숫자)
├── Spacing (4/8pt 기준)
├── Radius (4/8/12/999)
├── Shadow (Elevation 1/2/3)
└── Motion (100/200/300/400ms)
```

---

## ✅ 완료 기준 (DoD)

### 구현 완료 체크리스트
- [ ] 모든 Phase A~N 기능 구현
- [ ] Variants/Props 명확히 정의
- [ ] Loading/Empty/Error/Offline 상태 제공
- [ ] 접근성 AA 준수
- [ ] 반응형 (390/768/1280)
- [ ] 브랜드 컬러 시스템 일관성
- [ ] 마이크로카피 문제/해결 제시
- [ ] 애니메이션/트랜지션 자연스러움

### 문서화
- [ ] 컴포넌트 Props 문서
- [ ] 상태 패턴 가이드
- [ ] 접근성 체크리스트
- [ ] 디자인 토큰 사전

---

## 🏆 결론

### 현재 완성도: 81.4%

### 즉시 구현 필요 (3일 작업)
1. ✅ Phase E: 업셀 UX
2. ✅ Phase A: 쿠폰 UI 강화

### 다음 단계 (2일 작업)
3. ✅ Phase D: 배달비 시각화
4. ✅ Phase H: 결제 단계별 UI

### 완료 시 기대 효과
- **UX 품질:** 30% 향상
- **전환율:** 15% 증가 예상
- **Figma 지시문 준수도:** 95% 이상

---

**KS컴퍼니** | 사업자번호: 553-17-00098 | 대표: 석경선/배종수(공동대표)

---

**다음 문서:** `/docs/02-design/05-우선순위-구현-가이드.md`
