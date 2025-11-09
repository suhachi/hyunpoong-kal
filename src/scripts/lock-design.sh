#!/bin/bash

###############################################################################
# 🔒 디자인 CSS 잠금 스크립트
#
# 이 스크립트는 디자인이 절대 깨지지 않도록 보호합니다.
#
# 사용법:
#   chmod +x scripts/lock-design.sh
#   ./scripts/lock-design.sh
#
# KS컴퍼니 (사업자번호: 553-17-00098)
###############################################################################

set -e

echo "🔒 디자인 CSS 잠금을 시작합니다..."
echo ""

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 체크 함수
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✅ $1 파일이 존재합니다.${NC}"
    return 0
  else
    echo -e "${RED}❌ $1 파일이 없습니다!${NC}"
    return 1
  fi
}

# 1단계: 파일 존재 확인
echo -e "${BLUE}[1/5] 파일 존재 확인 중...${NC}"
echo ""

FILES_OK=true

if ! check_file "styles/design-lock.css"; then
  FILES_OK=false
fi

if ! check_file "constants/design-tokens.ts"; then
  FILES_OK=false
fi

if ! check_file "tailwind.lock.config.js"; then
  FILES_OK=false
fi

if [ "$FILES_OK" = false ]; then
  echo ""
  echo -e "${RED}❌ 필수 파일이 없습니다. 먼저 파일을 생성해주세요.${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}✅ 모든 필수 파일이 존재합니다.${NC}"
echo ""

# 2단계: main.tsx에 design-lock.css import 확인
echo -e "${BLUE}[2/5] main.tsx 확인 중...${NC}"
echo ""

if grep -q "design-lock.css" main.tsx; then
  echo -e "${GREEN}✅ main.tsx에 design-lock.css가 이미 추가되어 있습니다.${NC}"
else
  echo -e "${YELLOW}⚠️  main.tsx에 design-lock.css를 추가합니다...${NC}"
  
  # globals.css import 다음 줄에 design-lock.css import 추가
  sed -i.bak "/globals.css/a\\
import './styles/design-lock.css'; // 🔒 디자인 CSS 잠금 (절대 변경 금지!)
" main.tsx
  
  echo -e "${GREEN}✅ design-lock.css가 추가되었습니다.${NC}"
fi

echo ""

# 3단계: Tailwind 설정 백업 (선택 사항)
echo -e "${BLUE}[3/5] Tailwind 설정 백업...${NC}"
echo ""

read -p "Tailwind 설정을 잠금 버전으로 교체하시겠습니까? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  if [ -f "tailwind.config.js" ]; then
    echo -e "${YELLOW}⚠️  기존 tailwind.config.js를 백업합니다...${NC}"
    cp tailwind.config.js tailwind.backup.config.js
    echo -e "${GREEN}✅ tailwind.backup.config.js로 백업되었습니다.${NC}"
    
    echo -e "${YELLOW}⚠️  잠금 설정으로 교체합니다...${NC}"
    cp tailwind.lock.config.js tailwind.config.js
    echo -e "${GREEN}✅ Tailwind 잠금 설정이 적용되었습니다.${NC}"
  else
    echo -e "${YELLOW}⚠️  tailwind.config.js가 없습니다. 건너뜁니다.${NC}"
  fi
else
  echo -e "${BLUE}ℹ️  Tailwind 설정 변경을 건너뜁니다.${NC}"
fi

echo ""

# 4단계: CSS 변수 검증
echo -e "${BLUE}[4/5] CSS 변수 검증 중...${NC}"
echo ""

# 브랜드 컬러 검증
if grep -q "#D61C1C" styles/design-lock.css; then
  echo -e "${GREEN}✅ 현풍레드 (#D61C1C) 확인${NC}"
else
  echo -e "${RED}❌ 현풍레드가 없습니다!${NC}"
  exit 1
fi

if grep -q "#F37021" styles/design-lock.css; then
  echo -e "${GREEN}✅ 신칼오렌지 (#F37021) 확인${NC}"
else
  echo -e "${RED}❌ 신칼오렌지가 없습니다!${NC}"
  exit 1
fi

if grep -q "#C7A45A" styles/design-lock.css; then
  echo -e "${GREEN}✅ 황동식기색 (#C7A45A) 확인${NC}"
else
  echo -e "${RED}❌ 황동식기색이 없습니다!${NC}"
  exit 1
fi

echo ""

# 5단계: 개발 서버 재시작 안내
echo -e "${BLUE}[5/5] 완료!${NC}"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ 디자인 CSS 잠금이 완료되었습니다!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}다음 단계:${NC}"
echo ""
echo -e "  1. 개발 서버 재시작:"
echo -e "     ${BLUE}npm run dev${NC}"
echo ""
echo -e "  2. 브라우저에서 확인:"
echo -e "     ${BLUE}http://localhost:5173${NC}"
echo ""
echo -e "  3. 개발자 도구 콘솔에서 검증:"
echo -e "     ${BLUE}getComputedStyle(document.documentElement).getPropertyValue('--color-hyunpung-red')${NC}"
echo -e "     ${GREEN}→ 결과: #D61C1C${NC}"
echo ""

echo -e "${YELLOW}적용된 기능:${NC}"
echo ""
echo -e "  ✅ 브랜드 컬러 절대 변경 불가"
echo -e "  ✅ 타이포그래피 완전 고정"
echo -e "  ✅ Border Radius 고정"
echo -e "  ✅ Shadow 고정"
echo -e "  ✅ Z-Index 충돌 방지"
echo -e "  ✅ 간격 체계 고정"
echo -e "  ✅ 폰트 로딩 보호"
echo -e "  ✅ 레이아웃 시프트 방지"
echo -e "  ✅ 접근성 보호"
echo -e "  ✅ 반응형 보호"
echo ""

echo -e "${YELLOW}복원 방법 (문제 발생 시):${NC}"
echo ""
echo -e "  ${BLUE}# main.tsx에서 design-lock.css import 제거${NC}"
echo -e "  ${BLUE}# Tailwind 설정 복원:${NC}"
echo -e "  ${BLUE}cp tailwind.backup.config.js tailwind.config.js${NC}"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}자세한 가이드: /docs/03-development/43-디자인-CSS-잠금-가이드.md${NC}"
echo ""

exit 0
