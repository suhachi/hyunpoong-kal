#!/bin/bash

# Phase 3 리팩토링 검증 스크립트
# KS컴퍼니 (사업자번호: 553-17-00098)

echo "==================================="
echo "Phase 3 리팩토링 검증 시작"
echo "==================================="
echo ""

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 카운터
PASS=0
FAIL=0

# 검증 함수
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1 존재"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} $1 없음"
    ((FAIL++))
  fi
}

check_import() {
  if grep -q "$2" "$1"; then
    echo -e "${GREEN}✓${NC} $1에서 $2 import 확인"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} $1에서 $2 import 없음"
    ((FAIL++))
  fi
}

check_usage() {
  if grep -q "$2" "$1"; then
    echo -e "${GREEN}✓${NC} $1에서 $2 사용 확인"
    ((PASS++))
  else
    echo -e "${YELLOW}!${NC} $1에서 $2 사용 없음 (선택사항일 수 있음)"
  fi
}

echo "1. 공통 컴포넌트 파일 확인"
echo "-----------------------------------"
check_file "components/shared/OrderStatusBadge.tsx"
check_file "components/shared/PriceBreakdown.tsx"
check_file "components/shared/OrderCard.tsx"
check_file "components/shared/index.ts"
echo ""

echo "2. Custom Hook 파일 확인"
echo "-----------------------------------"
check_file "hooks/useOrders.ts"
check_file "hooks/usePagination.ts"
check_file "hooks/index.ts"
echo ""

echo "3. 유틸리티 파일 확인"
echo "-----------------------------------"
check_file "lib/utils/performance.ts"
echo ""

echo "4. OrderStatusBadge 적용 확인"
echo "-----------------------------------"
check_import "components/admin/OrderTable.tsx" "OrderStatusBadge"
check_usage "components/admin/OrderTable.tsx" "<OrderStatusBadge"
echo ""

echo "5. PriceBreakdown 적용 확인"
echo "-----------------------------------"
check_import "pages/app/Cart.tsx" "PriceBreakdown"
check_usage "pages/app/Cart.tsx" "<PriceBreakdown"
check_import "pages/app/OrderTracking.tsx" "PriceBreakdown"
check_usage "pages/app/OrderTracking.tsx" "<PriceBreakdown"
echo ""

echo "6. React.memo 적용 확인"
echo "-----------------------------------"
check_usage "components/shared/OrderStatusBadge.tsx" "memo"
check_usage "components/shared/PriceBreakdown.tsx" "memo"
check_usage "components/shared/OrderCard.tsx" "memo"
check_usage "components/app/UpsellCard.tsx" "memo"
check_usage "components/app/UpsellSection.tsx" "memo"
check_usage "components/app/CheckoutSummary.tsx" "memo"
echo ""

echo "7. useMemo/useCallback 적용 확인"
echo "-----------------------------------"
check_usage "components/app/UpsellSection.tsx" "useMemo"
check_usage "components/app/CheckoutSummary.tsx" "useMemo"
check_usage "hooks/useOrders.ts" "useCallback"
check_usage "hooks/usePagination.ts" "useCallback"
echo ""

echo "8. 중복 코드 제거 확인"
echo "-----------------------------------"
if ! grep -q "const statusConfig.*Record<OrderStatus" "components/admin/OrderTable.tsx"; then
  echo -e "${GREEN}✓${NC} OrderTable.tsx에서 statusConfig 중복 제거 확인"
  ((PASS++))
else
  echo -e "${RED}✗${NC} OrderTable.tsx에 아직 statusConfig 중복 존재"
  ((FAIL++))
fi

if ! grep -q "const formatPrice = (price: number)" "components/app/UpsellCard.tsx"; then
  echo -e "${GREEN}✓${NC} UpsellCard.tsx에서 formatPrice 중복 제거 확인"
  ((PASS++))
else
  echo -e "${RED}✗${NC} UpsellCard.tsx에 아직 formatPrice 중복 존재"
  ((FAIL++))
fi
echo ""

echo "9. KS컴퍼니 크레딧 확인"
echo "-----------------------------------"
check_usage "components/shared/OrderStatusBadge.tsx" "553-17-00098"
check_usage "components/shared/PriceBreakdown.tsx" "553-17-00098"
check_usage "components/shared/OrderCard.tsx" "553-17-00098"
check_usage "hooks/useOrders.ts" "553-17-00098"
check_usage "hooks/usePagination.ts" "553-17-00098"
check_usage "lib/utils/performance.ts" "553-17-00098"
echo ""

echo "==================================="
echo "검증 결과"
echo "==================================="
echo -e "${GREEN}통과: $PASS${NC}"
echo -e "${RED}실패: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}✓ Phase 3 리팩토링 검증 성공!${NC}"
  exit 0
else
  echo -e "${RED}✗ Phase 3 리팩토링 검증 실패${NC}"
  echo "실패한 항목을 확인하고 수정해주세요."
  exit 1
fi
