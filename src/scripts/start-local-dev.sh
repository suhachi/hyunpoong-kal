#!/bin/bash

##############################################################################
# 🚀 현풍닭칼국수 PWA - 로컬 개발 환경 시작 스크립트 v2.0
##############################################################################
#
# 용도: 로컬 개발을 시작할 때 디자인이 안 깨지도록 완벽하게 설정
#
# 사용법:
#   chmod +x scripts/start-local-dev.sh
#   ./scripts/start-local-dev.sh
#
##############################################################################

set -e  # 에러 발생 시 즉시 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 현풍닭칼국수 PWA 로컬 개발 환경 시작"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: 기존 프로세스 종료
echo -e "${BLUE}[1/8]${NC} 기존 개발 서버 종료 중..."
if command -v killall &> /dev/null; then
  killall node 2>/dev/null || true
elif command -v taskkill &> /dev/null; then
  taskkill /F /IM node.exe 2>nul || true
fi
echo -e "${GREEN}✅${NC} 기존 프로세스 정리 완료"
echo ""

# Step 2: 캐시 삭제
echo -e "${BLUE}[2/8]${NC} 캐시 삭제 중..."
rm -rf node_modules/.vite 2>/dev/null || true
rm -rf dist 2>/dev/null || true
rm -rf .parcel-cache 2>/dev/null || true
echo -e "${GREEN}✅${NC} 캐시 삭제 완료"
echo ""

# Step 3: 필수 파일 검증
echo -e "${BLUE}[3/8]${NC} 필수 파일 검증 중..."

MISSING_FILES=()

if [ ! -f "postcss.config.js" ]; then
  MISSING_FILES+=("postcss.config.js")
fi

if [ ! -f "tailwind.config.js" ]; then
  MISSING_FILES+=("tailwind.config.js")
fi

if [ ! -f "styles/globals.css" ]; then
  MISSING_FILES+=("styles/globals.css")
fi

if [ ! -f "styles/design-lock.css" ]; then
  MISSING_FILES+=("styles/design-lock.css")
fi

if [ ! -f "main.tsx" ]; then
  MISSING_FILES+=("main.tsx")
fi

if [ ${#MISSING_FILES[@]} -ne 0 ]; then
  echo -e "${RED}❌ 다음 파일이 누락되었습니다:${NC}"
  for file in "${MISSING_FILES[@]}"; do
    echo "   - $file"
  done
  echo ""
  echo "프로젝트 루트 디렉토리에서 실행하고 있는지 확인하세요."
  exit 1
fi

echo -e "${GREEN}✅${NC} 필수 파일 검증 완료"
echo ""

# Step 4: main.tsx CSS import 검증
echo -e "${BLUE}[4/8]${NC} main.tsx CSS import 검증 중..."

if ! grep -q "import './styles/globals.css'" main.tsx; then
  echo -e "${RED}❌ main.tsx에 globals.css import가 없습니다!${NC}"
  exit 1
fi

if ! grep -q "import './styles/design-lock.css'" main.tsx; then
  echo -e "${RED}❌ main.tsx에 design-lock.css import가 없습니다!${NC}"
  exit 1
fi

echo -e "${GREEN}✅${NC} CSS import 검증 완료"
echo ""

# Step 5: package.json 의존성 검증
echo -e "${BLUE}[5/8]${NC} 의존성 패키지 검증 중..."

if ! grep -q "\"tailwindcss\"" package.json; then
  echo -e "${RED}❌ tailwindcss가 package.json에 없습니다!${NC}"
  exit 1
fi

if ! grep -q "\"@tailwindcss/postcss\"" package.json; then
  echo -e "${YELLOW}⚠️  @tailwindcss/postcss를 설치합니다...${NC}"
  npm install @tailwindcss/postcss@4.0.0 --save-dev
fi

echo -e "${GREEN}✅${NC} 의존성 검증 완료"
echo ""

# Step 6: npm install 실행
echo -e "${BLUE}[6/8]${NC} npm install 실행 중..."
npm install
echo -e "${GREEN}✅${NC} 패키지 설치 완료"
echo ""

# Step 7: 디자인 잠금 검증
echo -e "${BLUE}[7/8]${NC} 디자인 잠금 상태 검증 중..."

if grep -q "#D61C1C" styles/design-lock.css && \
   grep -q "#F37021" styles/design-lock.css && \
   grep -q "#C7A45A" styles/design-lock.css; then
  echo -e "${GREEN}✅${NC} 브랜드 컬러 잠금 확인"
  echo "   Primary:   #D61C1C (현풍레드)"
  echo "   Secondary: #F37021 (신칼오렌지)"
  echo "   Accent:    #C7A45A (황동식기색)"
else
  echo -e "${YELLOW}⚠️  브랜드 컬러가 설정되지 않았습니다.${NC}"
fi
echo ""

# Step 8: 개발 서버 시작
echo -e "${BLUE}[8/8]${NC} 개발 서버 시작 중..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 준비 완료!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "다음 단계:"
echo "  1. 브라우저에서 http://localhost:5173 접속"
echo "  2. Ctrl+Shift+R로 강제 새로고침"
echo "  3. F12 → Console에서 에러 확인"
echo ""
echo -e "${YELLOW}⚠️  참고:${NC}"
echo "  - 포트가 5173이 아니면 문제가 있는 것입니다."
echo "  - 디자인이 깨지면 Ctrl+C로 종료 후 다시 실행하세요."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 개발 서버 실행
npm run dev
