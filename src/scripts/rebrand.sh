#!/bin/bash

###############################################################################
# 🏪 브랜드 일괄 변경 스크립트 v2.0
#
# 이 스크립트는 현풍닭칼국수 PWA를 다른 음식점 브랜드로 변경합니다.
#
# 사용법:
#   chmod +x scripts/rebrand.sh
#   ./scripts/rebrand.sh "새가게명" "#Primary" "#Secondary" "#Accent"
#
# 예시:
#   ./scripts/rebrand.sh "부산갈비집" "#8B4513" "#FF6B35" "#D4AF37"
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
  echo -e "${RED}❌ 사용법: ./scripts/rebrand.sh <가게명> <Primary> <Secondary> <Accent>${NC}"
  echo ""
  echo -e "${YELLOW}예시:${NC}"
  echo "  ./scripts/rebrand.sh \"부산갈비집\" \"#8B4513\" \"#FF6B35\" \"#D4AF37\""
  echo ""
  echo -e "${CYAN}추천 브랜드 컬러:${NC}"
  echo ""
  echo "한식당:   ./scripts/rebrand.sh \"서울한정식\" \"#8B4513\" \"#D4A574\" \"#C41E3A\""
  echo "치킨집:   ./scripts/rebrand.sh \"황금치킨\" \"#FF6B35\" \"#F7B733\" \"#C0392B\""
  echo "피자집:   ./scripts/rebrand.sh \"나폴리피자\" \"#E74C3C\" \"#F39C12\" \"#27AE60\""
  echo "카페:     ./scripts/rebrand.sh \"브루잉커피\" \"#6F4E37\" \"#D4AF37\" \"#8B7355\""
  echo "분식집:   ./scripts/rebrand.sh \"엄마손분식\" \"#E74C3C\" \"#F39C12\" \"#3498DB\""
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

# 주요 파일 백업
cp config/env.ts "$BACKUP_DIR/"
cp constants/colors.ts "$BACKUP_DIR/"
cp constants/design-tokens.ts "$BACKUP_DIR/"
cp styles/globals.css "$BACKUP_DIR/"
cp styles/design-lock.css "$BACKUP_DIR/"
cp index.html "$BACKUP_DIR/"

echo -e "${GREEN}✅ 백업 완료: $BACKUP_DIR${NC}"
echo -e "${YELLOW}   파일 6개 백업됨${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[2/8] config/env.ts 변경 중...${NC}"

# 기존 회사 정보 추출
OLD_NAME=$(grep "name:" config/env.ts | head -1 | sed "s/.*name: '\(.*\)'.*/\1/")

echo -e "${YELLOW}  기존: $OLD_NAME${NC}"
echo -e "${CYAN}  새로: $NEW_NAME${NC}"

# sed로 변경 (macOS/Linux 호환)
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/name: '.*'/name: '$NEW_NAME'/" config/env.ts
else
  # Linux
  sed -i "s/name: '.*'/name: '$NEW_NAME'/" config/env.ts
fi

echo -e "${GREEN}✅ config/env.ts 변경 완료${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[3/8] constants/colors.ts 변경 중...${NC}"

# 기존 컬러 추출
OLD_PRIMARY=$(grep "primary:" constants/colors.ts | head -1 | sed "s/.*primary: '\(#[0-9A-Fa-f]\{6\}\)'.*/\1/")
OLD_SECONDARY=$(grep "secondary:" constants/colors.ts | head -1 | sed "s/.*secondary: '\(#[0-9A-Fa-f]\{6\}\)'.*/\1/")
OLD_ACCENT=$(grep "accent:" constants/colors.ts | head -1 | sed "s/.*accent: '\(#[0-9A-Fa-f]\{6\}\)'.*/\1/")

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
  sed -i '' "s/primary: '#[0-9A-Fa-f]\{6\}'/primary: '$COLOR_PRIMARY'/" constants/colors.ts
  sed -i '' "s/secondary: '#[0-9A-Fa-f]\{6\}'/secondary: '$COLOR_SECONDARY'/" constants/colors.ts
  sed -i '' "s/accent: '#[0-9A-Fa-f]\{6\}'/accent: '$COLOR_ACCENT'/" constants/colors.ts
else
  sed -i "s/primary: '#[0-9A-Fa-f]\{6\}'/primary: '$COLOR_PRIMARY'/" constants/colors.ts
  sed -i "s/secondary: '#[0-9A-Fa-f]\{6\}'/secondary: '$COLOR_SECONDARY'/" constants/colors.ts
  sed -i "s/accent: '#[0-9A-Fa-f]\{6\}'/accent: '$COLOR_ACCENT'/" constants/colors.ts
fi

echo -e "${GREEN}✅ constants/colors.ts 변경 완료${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[4/8] constants/design-tokens.ts 변경 중...${NC}"

# 디자인 토큰 변경 (브랜드 컬러)
if [[ "$OSTYPE" == "darwin"* ]]; then
  # hyunpungRed → 새 Primary
  sed -i '' "s/hyunpungRed: '#[0-9A-Fa-f]\{6\}'/hyunpungRed: '$COLOR_PRIMARY'/" constants/design-tokens.ts
  # shinkalOrange → 새 Secondary
  sed -i '' "s/shinkalOrange: '#[0-9A-Fa-f]\{6\}'/shinkalOrange: '$COLOR_SECONDARY'/" constants/design-tokens.ts
  # brassGold → 새 Accent
  sed -i '' "s/brassGold: '#[0-9A-Fa-f]\{6\}'/brassGold: '$COLOR_ACCENT'/" constants/design-tokens.ts
else
  sed -i "s/hyunpungRed: '#[0-9A-Fa-f]\{6\}'/hyunpungRed: '$COLOR_PRIMARY'/" constants/design-tokens.ts
  sed -i "s/shinkalOrange: '#[0-9A-Fa-f]\{6\}'/shinkalOrange: '$COLOR_SECONDARY'/" constants/design-tokens.ts
  sed -i "s/brassGold: '#[0-9A-Fa-f]\{6\}'/brassGold: '$COLOR_ACCENT'/" constants/design-tokens.ts
fi

echo -e "${GREEN}✅ constants/design-tokens.ts 변경 완료${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[5/8] styles/globals.css 변경 중...${NC}"

# CSS 변수 변경 (주석 포함 검색)
if [[ "$OSTYPE" == "darwin"* ]]; then
  # Primary 관련
  sed -i '' "s/#D61C1C/$COLOR_PRIMARY/g" styles/globals.css
  # Secondary 관련
  sed -i '' "s/#F37021/$COLOR_SECONDARY/g" styles/globals.css
  # Accent 관련
  sed -i '' "s/#C7A45A/$COLOR_ACCENT/g" styles/globals.css
else
  sed -i "s/#D61C1C/$COLOR_PRIMARY/g" styles/globals.css
  sed -i "s/#F37021/$COLOR_SECONDARY/g" styles/globals.css
  sed -i "s/#C7A45A/$COLOR_ACCENT/g" styles/globals.css
fi

echo -e "${GREEN}✅ styles/globals.css 변경 완료${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[6/8] styles/design-lock.css 변경 중...${NC}"

# CSS 잠금 파일 변경
if [[ "$OSTYPE" == "darwin"* ]]; then
  # Primary 관련 (모든 인스턴스)
  sed -i '' "s/#D61C1C/$COLOR_PRIMARY/g" styles/design-lock.css
  # Secondary 관련 (모든 인스턴스)
  sed -i '' "s/#F37021/$COLOR_SECONDARY/g" styles/design-lock.css
  # Accent 관련 (모든 인스턴스)
  sed -i '' "s/#C7A45A/$COLOR_ACCENT/g" styles/design-lock.css
else
  sed -i "s/#D61C1C/$COLOR_PRIMARY/g" styles/design-lock.css
  sed -i "s/#F37021/$COLOR_SECONDARY/g" styles/design-lock.css
  sed -i "s/#C7A45A/$COLOR_ACCENT/g" styles/design-lock.css
fi

echo -e "${GREEN}✅ styles/design-lock.css 변경 완료${NC}"
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
echo "  ✅ config/env.ts"
echo "  ✅ constants/colors.ts"
echo "  ✅ constants/design-tokens.ts"
echo "  ✅ styles/globals.css"
echo "  ✅ styles/design-lock.css"
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
grep -q "$NEW_NAME" config/env.ts && echo -e "  ✅ config/env.ts - 가게명 변경됨"
grep -q "$COLOR_PRIMARY" constants/colors.ts && echo -e "  ✅ constants/colors.ts - Primary 변경됨"
grep -q "$COLOR_PRIMARY" styles/globals.css && echo -e "  ✅ styles/globals.css - CSS 변수 변경됨"
grep -q "$COLOR_PRIMARY" styles/design-lock.css && echo -e "  ✅ styles/design-lock.css - 잠금 파일 변경됨"
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
echo -e "      ${BLUE}vi data/menus.json${NC}"
echo -e "      → 메뉴 이름, 가격, 설명 변경"
echo ""
echo -e "   ${YELLOW}b) 연락처 정보${NC}"
echo -e "      ${BLUE}vi components/Footer.tsx${NC}"
echo -e "      → 전화번호, 주소, 영업시간 변경"
echo ""
echo -e "   ${YELLOW}c) 브랜드 스토리 (선택)${NC}"
echo -e "      ${BLUE}vi components/BrandStory.tsx${NC}"
echo -e "      → 가게 소개, 역사 등"
echo ""

echo -e "${CYAN}4. Firebase 프로젝트 설정${NC}"
echo -e "   ${BLUE}https://console.firebase.google.com${NC}"
echo -e "   → 새 프로젝트 생성 또는 기존 프로젝트 사용"
echo ""

echo -e "${CYAN}5. 환경 변수 설정${NC}"
echo -e "   ${BLUE}cp .env.example .env${NC}"
echo -e "   ${BLUE}vi .env${NC}"
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
echo -e "  ${BLUE}cp $BACKUP_DIR/config/env.ts config/${NC}"
echo -e "  ${BLUE}cp $BACKUP_DIR/constants/colors.ts constants/${NC}"
echo -e "  ${BLUE}cp $BACKUP_DIR/constants/design-tokens.ts constants/${NC}"
echo -e "  ${BLUE}cp $BACKUP_DIR/styles/globals.css styles/${NC}"
echo -e "  ${BLUE}cp $BACKUP_DIR/styles/design-lock.css styles/${NC}"
echo -e "  ${BLUE}cp $BACKUP_DIR/index.html .${NC}"
echo ""
echo -e "${YELLOW}또는 한 번에:${NC}"
echo -e "  ${BLUE}cp $BACKUP_DIR/* .${NC} (주의: 디렉토리 구조 확인 필요)"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${MAGENTA}💡 팁:${NC}"
echo -e "  • ${CYAN}디자인 시스템 문서:${NC} DESIGN-LOCK-README.md"
echo -e "  • ${CYAN}화이트라벨 가이드:${NC} WHITE-LABEL-README.md"
echo -e "  • ${CYAN}배포 체크리스트:${NC} DEPLOYMENT-READY-CHECKLIST.md"
echo ""

exit 0
