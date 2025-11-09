#!/bin/bash

##############################################################################
# 🔍 디자인 설정 검증 스크립트
##############################################################################
#
# 용도: 디자인이 깨지지 않도록 모든 설정을 검증
#
# 사용법:
#   chmod +x scripts/verify-design.sh
#   ./scripts/verify-design.sh
#
##############################################################################

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 디자인 설정 검증 시작"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. 파일 존재 여부 검증
echo "[1/8] 필수 파일 검증..."
echo ""

FILES=(
  "postcss.config.js:PostCSS 설정"
  "tailwind.config.js:Tailwind 설정"
  "vite.config.ts:Vite 설정"
  "styles/globals.css:메인 CSS"
  "styles/design-lock.css:디자인 잠금 CSS"
  "main.tsx:엔트리 포인트"
  "package.json:패키지 설정"
)

for item in "${FILES[@]}"; do
  IFS=':' read -r file desc <<< "$item"
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅${NC} $desc ($file)"
  else
    echo -e "${RED}❌${NC} $desc ($file) - 파일 없음!"
    ERRORS=$((ERRORS + 1))
  fi
done
echo ""

# 2. main.tsx CSS import 검증
echo "[2/8] main.tsx CSS import 검증..."
echo ""

if [ -f "main.tsx" ]; then
  if grep -q "import './styles/globals.css'" main.tsx; then
    echo -e "${GREEN}✅${NC} globals.css import 확인"
  else
    echo -e "${RED}❌${NC} globals.css import 누락!"
    ERRORS=$((ERRORS + 1))
  fi
  
  if grep -q "import './styles/design-lock.css'" main.tsx; then
    echo -e "${GREEN}✅${NC} design-lock.css import 확인"
  else
    echo -e "${RED}❌${NC} design-lock.css import 누락!"
    ERRORS=$((ERRORS + 1))
  fi
fi
echo ""

# 3. globals.css 검증
echo "[3/8] globals.css 내용 검증..."
echo ""

if [ -f "styles/globals.css" ]; then
  if grep -q '@import "tailwindcss"' styles/globals.css; then
    echo -e "${GREEN}✅${NC} Tailwind import 확인"
  else
    echo -e "${RED}❌${NC} Tailwind import 누락!"
    ERRORS=$((ERRORS + 1))
  fi
  
  if grep -q ':root' styles/globals.css; then
    echo -e "${GREEN}✅${NC} CSS 변수 정의 확인"
  else
    echo -e "${YELLOW}⚠️${NC}  CSS 변수가 정의되지 않음"
    WARNINGS=$((WARNINGS + 1))
  fi
fi
echo ""

# 4. design-lock.css 브랜드 컬러 검증
echo "[4/8] 브랜드 컬러 검증..."
echo ""

if [ -f "styles/design-lock.css" ]; then
  if grep -q "#D61C1C" styles/design-lock.css; then
    echo -e "${GREEN}✅${NC} 현풍레드 (#D61C1C) 확인"
  else
    echo -e "${RED}❌${NC} 현풍레드 누락!"
    ERRORS=$((ERRORS + 1))
  fi
  
  if grep -q "#F37021" styles/design-lock.css; then
    echo -e "${GREEN}✅${NC} 신칼오렌지 (#F37021) 확인"
  else
    echo -e "${RED}❌${NC} 신칼오렌지 누락!"
    ERRORS=$((ERRORS + 1))
  fi
  
  if grep -q "#C7A45A" styles/design-lock.css; then
    echo -e "${GREEN}✅${NC} 황동식기색 (#C7A45A) 확인"
  else
    echo -e "${RED}❌${NC} 황동식기색 누락!"
    ERRORS=$((ERRORS + 1))
  fi
fi
echo ""

# 5. postcss.config.js 검증
echo "[5/8] PostCSS 설정 검증..."
echo ""

if [ -f "postcss.config.js" ]; then
  if grep -q "@tailwindcss/postcss" postcss.config.js; then
    echo -e "${GREEN}✅${NC} Tailwind PostCSS 플러그인 확인"
  else
    echo -e "${RED}❌${NC} Tailwind PostCSS 플러그인 누락!"
    ERRORS=$((ERRORS + 1))
  fi
fi
echo ""

# 6. package.json 의존성 검증
echo "[6/8] package.json 의존성 검증..."
echo ""

if [ -f "package.json" ]; then
  if grep -q '"tailwindcss"' package.json; then
    echo -e "${GREEN}✅${NC} tailwindcss 패키지 확인"
  else
    echo -e "${RED}❌${NC} tailwindcss 패키지 누락!"
    ERRORS=$((ERRORS + 1))
  fi
  
  if grep -q '"@tailwindcss/postcss"' package.json; then
    echo -e "${GREEN}✅${NC} @tailwindcss/postcss 패키지 확인"
  else
    echo -e "${YELLOW}⚠️${NC}  @tailwindcss/postcss 패키지 누락"
    WARNINGS=$((WARNINGS + 1))
  fi
  
  if grep -q '"postcss"' package.json; then
    echo -e "${GREEN}✅${NC} postcss 패키지 확인"
  else
    echo -e "${RED}❌${NC} postcss 패키지 누락!"
    ERRORS=$((ERRORS + 1))
  fi
fi
echo ""

# 7. vite.config.ts 검증
echo "[7/8] Vite 설정 검증..."
echo ""

if [ -f "vite.config.ts" ]; then
  if grep -q "postcss" vite.config.ts; then
    echo -e "${GREEN}✅${NC} PostCSS 설정 확인"
  else
    echo -e "${YELLOW}⚠️${NC}  Vite에 PostCSS 설정이 명시되지 않음"
    WARNINGS=$((WARNINGS + 1))
  fi
fi
echo ""

# 8. node_modules 검증
echo "[8/8] 설치된 패키지 검증..."
echo ""

if [ -d "node_modules" ]; then
  if [ -d "node_modules/tailwindcss" ]; then
    echo -e "${GREEN}✅${NC} tailwindcss 설치됨"
  else
    echo -e "${RED}❌${NC} tailwindcss가 설치되지 않음!"
    ERRORS=$((ERRORS + 1))
  fi
  
  if [ -d "node_modules/@tailwindcss/postcss" ] || [ -d "node_modules/@tailwindcss" ]; then
    echo -e "${GREEN}✅${NC} @tailwindcss/postcss 설치됨"
  else
    echo -e "${YELLOW}⚠️${NC}  @tailwindcss/postcss가 설치되지 않음"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${RED}❌${NC} node_modules 디렉토리 없음 - npm install 필요!"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# 결과 출력
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "검증 결과"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}🎉 완벽합니다! 모든 설정이 정상입니다.${NC}"
  echo ""
  echo "다음 단계:"
  echo "  npm run dev"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠️  경고: $WARNINGS개${NC}"
  echo ""
  echo "경고 사항이 있지만 작동할 가능성이 높습니다."
  echo ""
  echo "권장 조치:"
  echo "  npm install @tailwindcss/postcss@4.0.0 --save-dev"
  exit 0
else
  echo -e "${RED}❌ 에러: $ERRORS개${NC}"
  echo -e "${YELLOW}⚠️  경고: $WARNINGS개${NC}"
  echo ""
  echo "해결 방법:"
  echo "  1. ./scripts/start-local-dev.sh 실행"
  echo "  2. 또는 수동으로 문제를 해결하세요."
  exit 1
fi
