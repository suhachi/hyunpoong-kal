#!/bin/bash

###############################################################################
# 🏪 브랜드 일괄 변경 스크립트 v2.0
#
# 이 스크립트는 현풍닭칼국수 PWA를 다른 음식점 브랜드로 변경합니다.
#
# 사용법:
#   chmod +x rebrand-scripts/rebrand.sh
#   ./rebrand-scripts/rebrand.sh "새가게명" "#Primary" "#Secondary" "#Accent"
#
# 예시:
#   ./rebrand-scripts/rebrand.sh "부산갈비집" "#8B4513" "#FF6B35" "#D4AF37"
#
# KS컴퍼니 (사업자번호: 553-17-00098)
# 버전: 2.0 (2024-11-08 업데이트)
###############################################################################

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# 파라미터 확인
if [ $# -lt 4 ]; then
  echo -e "${RED}❌ 사용법: ./rebrand-scripts/rebrand.sh <가게명> <Primary> <Secondary> <Accent>${NC}"
  echo ""
  echo -e "${YELLOW}예시:${NC}"
  echo "  ./rebrand-scripts/rebrand.sh \"부산갈비집\" \"#8B4513\" \"#FF6B35\" \"#D4AF37\""
  echo ""
  echo -e "${CYAN}추천 브랜드 컬러:${NC}"
  echo ""
  echo "한식당:   ./rebrand-scripts/rebrand.sh \"서울한정식\" \"#8B4513\" \"#D4A574\" \"#C41E3A\""
  echo "치킨집:   ./rebrand-scripts/rebrand.sh \"황금치킨\" \"#FF6B35\" \"#F7B733\" \"#C0392B\""
  echo "피자집:   ./rebrand-scripts/rebrand.sh \"나폴리피자\" \"#E74C3C\" \"#F39C12\" \"#27AE60\""
  echo "카페:     ./rebrand-scripts/rebrand.sh \"브루잉커피\" \"#6F4E37\" \"#D4AF37\" \"#8B7355\""
  echo "분식집:   ./rebrand-scripts/rebrand.sh \"엄마손분식\" \"#E74C3C\" \"#F39C12\" \"#3498DB\""
  echo ""
  exit 1
fi

# 변수 설정
NEW_NAME=$1
COLOR_PRIMARY=$2
COLOR_SECONDARY=$3
COLOR_ACCENT=$4

# 컬러 검증 (헥스 코드)
if [[ ! $COLOR_PRIMARY =~ ^#[0-9A-Fa-f]{6}$ ]] || \
   [[ ! $COLOR_SECONDARY =~ ^#[0-9A-Fa-f]{6}$ ]] || \
   [[ ! $COLOR_ACCENT =~ ^#[0-9A-Fa-f]{6}$ ]]; then
  echo -e "${RED}❌ 오류: 컬러는 #000000 형식이어야 합니다${NC}"
  exit 1
fi

# 헤더 출력
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🏪 브랜드 변경 스크립트 v2.0${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}가게명:${NC} $NEW_NAME"
echo -e "${CYAN}Primary:${NC} $COLOR_PRIMARY (메인 컬러)"
echo -e "${CYAN}Secondary:${NC} $COLOR_SECONDARY (포인트 컬러)"
echo -e "${CYAN}Accent:${NC} $COLOR_ACCENT (엑센트 컬러)"
echo ""

# 확인
read -p "계속하시겠습니까? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}취소되었습니다.${NC}"
  exit 0
fi

echo ""
echo -e "${BLUE}[1/8] 백업 생성 중...${NC}"

# 백업 디렉토리 생성
BACKUP_DIR="./backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# 주요 파일 백업 (src/ 경로 포함)
cp src/config/env.ts "$BACKUP_DIR/" 2>/dev/null || cp config/env.ts "$BACKUP_DIR/" 2>/dev/null || true
cp src/constants/colors.ts "$BACKUP_DIR/" 2>/dev/null || cp constants/colors.ts "$BACKUP_DIR/" 2>/dev/null || true
cp src/constants/design-tokens.ts "$BACKUP_DIR/" 2>/dev/null || cp constants/design-tokens.ts "$BACKUP_DIR/" 2>/dev/null || true
cp src/styles/globals.css "$BACKUP_DIR/" 2>/dev/null || cp styles/globals.css "$BACKUP_DIR/" 2>/dev/null || true
cp src/styles/design-lock.css "$BACKUP_DIR/" 2>/dev/null || cp styles/design-lock.css "$BACKUP_DIR/" 2>/dev/null || true
cp index.html "$BACKUP_DIR/"

echo -e "${GREEN}✅ 백업 완료: $BACKUP_DIR${NC}"
echo -e "${YELLOW}   파일 6개 백업됨${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[2/8] config/env.ts 변경 중...${NC}"

# 파일 경로 확인 (src/ 우선)
ENV_FILE="src/config/env.ts"
if [ ! -f "$ENV_FILE" ]; then
  ENV_FILE="config/env.ts"
fi

# 기존 회사 정보 추출
OLD_NAME=$(grep "name:" "$ENV_FILE" | head -1 | sed "s/.*name: '\(.*\)'.*/\1/")

echo -e "${YELLOW}  기존: $OLD_NAME${NC}"
echo -e "${CYAN}  새로: $NEW_NAME${NC}"

# sed로 변경 (macOS/Linux 호환)
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/name: '.*'/name: '$NEW_NAME'/" "$ENV_FILE"
else
  # Linux
  sed -i "s/name: '.*'/name: '$NEW_NAME'/" "$ENV_FILE"
fi

echo -e "${GREEN}✅ $ENV_FILE 변경 완료${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[3/8] constants/colors.ts 변경 중...${NC}"

# 파일 경로 확인
COLORS_FILE="src/constants/colors.ts"
if [ ! -f "$COLORS_FILE" ]; then
  COLORS_FILE="constants/colors.ts"
fi

# 기존 컬러 추출
OLD_PRIMARY=$(grep "primary:" "$COLORS_FILE" | head -1 | sed "s/.*primary: '\(#[0-9A-Fa-f]\{6\}\)'.*/\1/")
OLD_SECONDARY=$(grep "secondary:" "$COLORS_FILE" | head -1 | sed "s/.*secondary: '\(#[0-9A-Fa-f]\{6\}\)'.*/\1/")
OLD_ACCENT=$(grep "accent:" "$COLORS_FILE" | head -1 | sed "s/.*accent: '\(#[0-9A-Fa-f]\{6\}\)'.*/\1/")

echo -e "${YELLOW}  기존:${NC}"
echo -e "    Primary:   $OLD_PRIMARY"
echo -e "    Secondary: $OLD_SECONDARY"
echo -e "    Accent:    $OLD_ACCENT"
echo -e "${CYAN}  새로:${NC}"
echo -e "    Primary:   $COLOR_PRIMARY"
echo -e "    Secondary: $COLOR_SECONDARY"
echo -e "    Accent:    $COLOR_ACCENT"

# 컬러 변경
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s/primary: '#[0-9A-Fa-f]\{6\}'/primary: '$COLOR_PRIMARY'/" "$COLORS_FILE"
  sed -i '' "s/secondary: '#[0-9A-Fa-f]\{6\}'/secondary: '$COLOR_SECONDARY'/" "$COLORS_FILE"
  sed -i '' "s/accent: '#[0-9A-Fa-f]\{6\}'/accent: '$COLOR_ACCENT'/" "$COLORS_FILE"
else
  sed -i "s/primary: '#[0-9A-Fa-f]\{6\}'/primary: '$COLOR_PRIMARY'/" "$COLORS_FILE"
  sed -i "s/secondary: '#[0-9A-Fa-f]\{6\}'/secondary: '$COLOR_SECONDARY'/" "$COLORS_FILE"
  sed -i "s/accent: '#[0-9A-Fa-f]\{6\}'/accent: '$COLOR_ACCENT'/" "$COLORS_FILE"
fi

echo -e "${GREEN}✅ $COLORS_FILE 변경 완료${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[4/8] constants/design-tokens.ts 변경 중...${NC}"

# 파일 경로 확인
DESIGN_TOKENS_FILE="src/constants/design-tokens.ts"
if [ ! -f "$DESIGN_TOKENS_FILE" ]; then
  DESIGN_TOKENS_FILE="constants/design-tokens.ts"
fi

# 디자인 토큰 변경 (브랜드 컬러)
if [[ "$OSTYPE" == "darwin"* ]]; then
  # hyunpungRed → 새 Primary
  sed -i '' "s/hyunpungRed: '#[0-9A-Fa-f]\{6\}'/hyunpungRed: '$COLOR_PRIMARY'/" "$DESIGN_TOKENS_FILE"
  # shinkalOrange → 새 Secondary
  sed -i '' "s/shinkalOrange: '#[0-9A-Fa-f]\{6\}'/shinkalOrange: '$COLOR_SECONDARY'/" "$DESIGN_TOKENS_FILE"
  # brassGold → 새 Accent
  sed -i '' "s/brassGold: '#[0-9A-Fa-f]\{6\}'/brassGold: '$COLOR_ACCENT'/" "$DESIGN_TOKENS_FILE"
else
  sed -i "s/hyunpungRed: '#[0-9A-Fa-f]\{6\}'/hyunpungRed: '$COLOR_PRIMARY'/" "$DESIGN_TOKENS_FILE"
  sed -i "s/shinkalOrange: '#[0-9A-Fa-f]\{6\}'/shinkalOrange: '$COLOR_SECONDARY'/" "$DESIGN_TOKENS_FILE"
  sed -i "s/brassGold: '#[0-9A-Fa-f]\{6\}'/brassGold: '$COLOR_ACCENT'/" "$DESIGN_TOKENS_FILE"
fi

echo -e "${GREEN}✅ $DESIGN_TOKENS_FILE 변경 완료${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[5/8] styles/globals.css 변경 중...${NC}"

# 파일 경로 확인
GLOBALS_CSS="src/styles/globals.css"
if [ ! -f "$GLOBALS_CSS" ]; then
  GLOBALS_CSS="styles/globals.css"
fi

# CSS 변수 변경 (주석 포함 검색)
if [[ "$OSTYPE" == "darwin"* ]]; then
  # Primary 관련
  sed -i '' "s/#D61C1C/$COLOR_PRIMARY/g" "$GLOBALS_CSS"
  # Secondary 관련
  sed -i '' "s/#F37021/$COLOR_SECONDARY/g" "$GLOBALS_CSS"
  # Accent 관련
  sed -i '' "s/#C7A45A/$COLOR_ACCENT/g" "$GLOBALS_CSS"
else
  sed -i "s/#D61C1C/$COLOR_PRIMARY/g" "$GLOBALS_CSS"
  sed -i "s/#F37021/$COLOR_SECONDARY/g" "$GLOBALS_CSS"
  sed -i "s/#C7A45A/$COLOR_ACCENT/g" "$GLOBALS_CSS"
fi

echo -e "${GREEN}✅ $GLOBALS_CSS 변경 완료${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[6/8] styles/design-lock.css 변경 중...${NC}"

# 파일 경로 확인
DESIGN_LOCK_CSS="src/styles/design-lock.css"
if [ ! -f "$DESIGN_LOCK_CSS" ]; then
  DESIGN_LOCK_CSS="styles/design-lock.css"
fi

# CSS 잠금 파일 변경
if [[ "$OSTYPE" == "darwin"* ]]; then
  # Primary 관련 (모든 인스턴스)
  sed -i '' "s/#D61C1C/$COLOR_PRIMARY/g" "$DESIGN_LOCK_CSS"
  # Secondary 관련 (모든 인스턴스)
  sed -i '' "s/#F37021/$COLOR_SECONDARY/g" "$DESIGN_LOCK_CSS"
  # Accent 관련 (모든 인스턴스)
  sed -i '' "s/#C7A45A/$COLOR_ACCENT/g" "$DESIGN_LOCK_CSS"
else
  sed -i "s/#D61C1C/$COLOR_PRIMARY/g" "$DESIGN_LOCK_CSS"
  sed -i "s/#F37021/$COLOR_SECONDARY/g" "$DESIGN_LOCK_CSS"
  sed -i "s/#C7A45A/$COLOR_ACCENT/g" "$DESIGN_LOCK_CSS"
fi

echo -e "${GREEN}✅ $DESIGN_LOCK_CSS 변경 완료${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[7/8] index.html 변경 중...${NC}"

# HTML 메타 태그 변경
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s/<title>.*<\/title>/<title>$NEW_NAME - 배달주문<\/title>/" index.html
  sed -i '' "s/content=\".*온라인 주문\"/content=\"$NEW_NAME 온라인 주문\"/" index.html
  # 메타 description도 변경
  sed -i '' "s/content=\".*맛집\"/content=\"$NEW_NAME 맛집\"/" index.html
else
  sed -i "s/<title>.*<\/title>/<title>$NEW_NAME - 배달주문<\/title>/" index.html
  sed -i "s/content=\".*온라인 주문\"/content=\"$NEW_NAME 온라인 주문\"/" index.html
  sed -i "s/content=\".*맛집\"/content=\"$NEW_NAME 맛집\"/" index.html
fi

echo -e "${GREEN}✅ index.html 변경 완료${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[8/8] 변경 사항 검증 중...${NC}"

# 변경된 파일 확인
echo -e "${CYAN}변경된 파일 (6개):${NC}"
echo "  ✅ $ENV_FILE"
echo "  ✅ $COLORS_FILE"
echo "  ✅ $DESIGN_TOKENS_FILE"
echo "  ✅ $GLOBALS_CSS"
echo "  ✅ $DESIGN_LOCK_CSS"
echo "  ✅ index.html"
echo ""

# 컬러 확인
echo -e "${CYAN}새로운 브랜드 컬러:${NC}"
echo -e "  ${MAGENTA}●${NC} Primary:   $COLOR_PRIMARY"
echo -e "  ${MAGENTA}●${NC} Secondary: $COLOR_SECONDARY"
echo -e "  ${MAGENTA}●${NC} Accent:    $COLOR_ACCENT"
echo ""

# 파일 검증
echo -e "${CYAN}파일 검증:${NC}"
grep -q "$NEW_NAME" "$ENV_FILE" && echo -e "  ✅ $ENV_FILE - 가게명 변경됨"
grep -q "$COLOR_PRIMARY" "$COLORS_FILE" && echo -e "  ✅ $COLORS_FILE - Primary 변경됨"
grep -q "$COLOR_PRIMARY" "$GLOBALS_CSS" && echo -e "  ✅ $GLOBALS_CSS - CSS 변수 변경됨"
grep -q "$COLOR_PRIMARY" "$DESIGN_LOCK_CSS" && echo -e "  ✅ $DESIGN_LOCK_CSS - 잠금 파일 변경됨"
grep -q "$NEW_NAME" index.html && echo -e "  ✅ index.html - 타이틀 변경됨"
echo ""

echo -e "${GREEN}✅ 모든 변경 및 검증 완료!${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 브랜드 변경 완료!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}다음 단계:${NC}"
echo ""
echo -e "${CYAN}1. 개발 서버 실행${NC}"
echo -e "   ${BLUE}npm run dev${NC}"
echo -e "   → http://localhost:5173에서 확인"
echo ""

echo -e "${CYAN}2. 디자인 잠금 확인${NC}"
echo -e "   ${BLUE}npm run design:verify${NC}"
echo -e "   → 브랜드 컬러가 정상적으로 적용되었는지 확인"
echo ""

echo -e "${CYAN}3. 추가 변경이 필요한 파일들:${NC}"
echo ""
echo -e "   ${YELLOW}a) 메뉴 데이터${NC}"
echo -e "      ${BLUE}vi src/data/menus.json${NC}"
echo -e "      → 메뉴 이름, 가격, 설명 변경"
echo ""

echo -e "   ${YELLOW}b) 연락처 정보${NC}"
echo -e "      ${BLUE}vi src/components/Footer.tsx${NC}"
echo -e "      → 전화번호, 주소, 영업시간 변경"
echo ""

echo -e "   ${YELLOW}c) 브랜드 스토리 (선택)${NC}"
echo -e "      ${BLUE}vi src/components/BrandStory.tsx${NC}"
echo -e "      → 가게 소개, 역사 등"
echo ""

echo -e "${CYAN}4. Firebase 프로젝트 설정${NC}"
echo -e "   ${BLUE}https://console.firebase.google.com${NC}"
echo -e "   → 새 프로젝트 생성 또는 기존 프로젝트 사용"
echo ""

echo -e "${CYAN}5. 환경 변수 설정${NC}"
echo -e "   ${BLUE}cp .env.example .env.local${NC}"
echo -e "   ${BLUE}vi .env.local${NC}"
echo -e "   → Firebase 키, 결제 정보 등 입력"
echo ""

echo -e "${CYAN}6. 빌드 및 배포${NC}"
echo -e "   ${BLUE}npm run build${NC}"
echo -e "   ${BLUE}firebase deploy${NC}"
echo ""

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}백업 정보${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}백업 위치:${NC} $BACKUP_DIR"
echo ""
echo -e "${CYAN}복원 방법:${NC}"
echo -e "  ${BLUE}cp $BACKUP_DIR/env.ts $ENV_FILE${NC}"
echo -e "  ${BLUE}cp $BACKUP_DIR/colors.ts $COLORS_FILE${NC}"
echo -e "  ${BLUE}cp $BACKUP_DIR/design-tokens.ts $DESIGN_TOKENS_FILE${NC}"
echo -e "  ${BLUE}cp $BACKUP_DIR/globals.css $GLOBALS_CSS${NC}"
echo -e "  ${BLUE}cp $BACKUP_DIR/design-lock.css $DESIGN_LOCK_CSS${NC}"
echo -e "  ${BLUE}cp $BACKUP_DIR/index.html .${NC}"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${MAGENTA}💡 팁:${NC}"
echo -e "  • ${CYAN}상세 가이드:${NC} rebrand-scripts/배달앱-복제-스크립트-상세-가이드.md"
echo -e "  • ${CYAN}빠른 참조:${NC} rebrand-scripts/REBRAND-QUICK-REFERENCE.md"
echo -e "  • ${CYAN}화이트라벨 가이드:${NC} src/WHITE-LABEL-README.md"
echo ""

exit 0
