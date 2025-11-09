#!/bin/bash

###############################################################################
# 리팩토링 Phase 2 검증 스크립트
# KS컴퍼니 (사업자번호: 553-17-00098)
###############################################################################

echo "🔍 리팩토링 Phase 2 검증 시작..."
echo ""

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 결과 카운터
PASS=0
FAIL=0

###############################################################################
# 1. formatPrice 패턴 검증
###############################################################################
echo "1️⃣  formatPrice() 적용 검증"
echo "----------------------------------------"

# .toLocaleString()원 패턴 검색 (제외: functions/, docs/, node_modules/)
OLD_PATTERN=$(grep -r "\.toLocaleString().*원\|원.*\.toLocaleString()" \
  --include="*.tsx" --include="*.ts" \
  --exclude-dir=node_modules \
  --exclude-dir=functions \
  --exclude-dir=docs \
  pages/ components/ lib/ 2>/dev/null | wc -l)

if [ "$OLD_PATTERN" -eq 0 ]; then
  echo -e "${GREEN}✅ PASS${NC}: 중복 패턴 없음 (모두 formatPrice로 변경됨)"
  ((PASS++))
else
  echo -e "${RED}❌ FAIL${NC}: 아직 $OLD_PATTERN 개의 중복 패턴이 남아있음"
  echo "   다음 명령으로 확인: grep -r \"\.toLocaleString().*원\" pages/ components/ lib/"
  ((FAIL++))
fi
echo ""

###############################################################################
# 2. formatDateTime 패턴 검증
###############################################################################
echo "2️⃣  formatDateTime() 적용 검증"
echo "----------------------------------------"

# toLocaleString('ko-KR') 패턴 검색
OLD_DATE_PATTERN=$(grep -r "toLocaleString\s*(\s*['\"]ko-KR['\"]" \
  --include="*.tsx" --include="*.ts" \
  --exclude-dir=node_modules \
  --exclude-dir=functions \
  --exclude-dir=docs \
  pages/ components/ 2>/dev/null | wc -l)

if [ "$OLD_DATE_PATTERN" -eq 0 ]; then
  echo -e "${GREEN}✅ PASS${NC}: 중복 패턴 없음 (모두 formatDateTime으로 변경됨)"
  ((PASS++))
else
  echo -e "${RED}❌ FAIL${NC}: 아직 $OLD_DATE_PATTERN 개의 중복 패턴이 남아있음"
  echo "   다음 명령으로 확인: grep -r \"toLocaleString.*ko-KR\" pages/ components/"
  ((FAIL++))
fi
echo ""

###############################################################################
# 3. 상수 적용 검증
###############################################################################
echo "3️⃣  ORDER_LIMITS 상수 적용 검증"
echo "----------------------------------------"

# Cart.tsx에 하드코딩된 MIN_ORDER 상수가 없는지 확인
if grep -q "const MIN_ORDER_DELIVERY\|const MIN_ORDER_PICKUP" pages/app/Cart.tsx 2>/dev/null; then
  echo -e "${RED}❌ FAIL${NC}: Cart.tsx에 하드코딩된 MIN_ORDER 상수가 남아있음"
  ((FAIL++))
else
  echo -e "${GREEN}✅ PASS${NC}: Cart.tsx에서 ORDER_LIMITS 상수 사용 중"
  ((PASS++))
fi
echo ""

###############################################################################
# 4. Import 일관성 검증
###############################################################################
echo "4️⃣  유틸리티 함수 Import 검증"
echo "----------------------------------------"

# formatPrice, formatDateTime을 lib/utils에서 import하는지 확인
CORRECT_IMPORTS=$(grep -r "import.*formatPrice\|import.*formatDateTime" \
  --include="*.tsx" \
  pages/ components/ 2>/dev/null | \
  grep "from.*lib/utils" | wc -l)

if [ "$CORRECT_IMPORTS" -gt 0 ]; then
  echo -e "${GREEN}✅ PASS${NC}: $CORRECT_IMPORTS 개 파일에서 올바른 import 사용 중"
  ((PASS++))
else
  echo -e "${YELLOW}⚠️  WARNING${NC}: formatPrice/formatDateTime import를 찾을 수 없음"
  echo "   (사용하지 않는 파일일 수 있음)"
fi
echo ""

###############################################################################
# 5. TypeScript 컴파일 검증
###############################################################################
echo "5️⃣  TypeScript 컴파일 검증"
echo "----------------------------------------"

if command -v tsc &> /dev/null; then
  if tsc --noEmit 2>&1 | grep -q "error TS"; then
    echo -e "${RED}❌ FAIL${NC}: TypeScript 컴파일 에러 있음"
    echo "   tsc --noEmit 명령으로 확인하세요"
    ((FAIL++))
  else
    echo -e "${GREEN}✅ PASS${NC}: TypeScript 컴파일 에러 없음"
    ((PASS++))
  fi
else
  echo -e "${YELLOW}⚠️  SKIP${NC}: tsc 명령을 찾을 수 없음"
fi
echo ""

###############################################################################
# 6. 파일 존재 검증
###############################################################################
echo "6️⃣  필수 파일 존재 검증"
echo "----------------------------------------"

REQUIRED_FILES=(
  "lib/utils/format.ts"
  "lib/utils/index.ts"
  "constants/validation.ts"
  "constants/index.ts"
)

ALL_FILES_EXIST=true
for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅${NC} $file"
  else
    echo -e "${RED}❌${NC} $file (누락)"
    ALL_FILES_EXIST=false
  fi
done

if [ "$ALL_FILES_EXIST" = true ]; then
  ((PASS++))
else
  ((FAIL++))
fi
echo ""

###############################################################################
# 결과 요약
###############################################################################
echo "========================================"
echo "📊 검증 결과 요약"
echo "========================================"
echo -e "${GREEN}통과${NC}: $PASS"
echo -e "${RED}실패${NC}: $FAIL"
echo ""

if [ "$FAIL" -eq 0 ]; then
  echo -e "${GREEN}🎉 모든 검증 통과!${NC}"
  echo "리팩토링 Phase 2가 성공적으로 완료되었습니다."
  exit 0
else
  echo -e "${RED}⚠️  일부 검증 실패${NC}"
  echo "위의 실패 항목을 확인하고 수정해주세요."
  exit 1
fi
