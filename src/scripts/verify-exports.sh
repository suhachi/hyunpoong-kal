#!/bin/bash

###############################################################################
# Export 형태 검증 스크립트
# 프로젝트: hp-kal
# 목적: pages 디렉토리의 모든 파일에서 export 방식 확인
###############################################################################

echo "======================================"
echo "Export 형태 검증"
echo "======================================"
echo ""

# 색상 코드
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 카운터
named_count=0
default_count=0

echo "📁 고객용 앱 페이지 (pages/app/)"
echo "======================================"

# 고객용 앱 페이지 확인
for file in pages/app/*.tsx; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    
    # export default 확인
    if grep -q "^export default" "$file"; then
      echo -e "${RED}⚠️  $filename${NC} - Default export"
      ((default_count++))
    # export function 확인
    elif grep -q "^export function" "$file"; then
      echo -e "${GREEN}✅ $filename${NC} - Named export"
      ((named_count++))
    # export const 확인
    elif grep -q "^export const" "$file"; then
      echo -e "${GREEN}✅ $filename${NC} - Named export (const)"
      ((named_count++))
    else
      echo -e "${YELLOW}❓ $filename${NC} - Unknown export"
    fi
  fi
done

echo ""
echo "📁 관리자 페이지 (pages/admin/)"
echo "======================================"

# 관리자 페이지 확인
for file in pages/admin/*.tsx; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    
    # export default 확인
    if grep -q "^export default" "$file"; then
      echo -e "${RED}⚠️  $filename${NC} - Default export"
      ((default_count++))
    # export function 확인
    elif grep -q "^export function" "$file"; then
      echo -e "${GREEN}✅ $filename${NC} - Named export"
      ((named_count++))
    # export const 확인
    elif grep -q "^export const" "$file"; then
      echo -e "${GREEN}✅ $filename${NC} - Named export (const)"
      ((named_count++))
    else
      echo -e "${YELLOW}❓ $filename${NC} - Unknown export"
    fi
  fi
done

echo ""
echo "📁 기타 페이지 (pages/)"
echo "======================================"

# 기타 페이지 확인
for file in pages/*.tsx; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    
    # export default 확인
    if grep -q "^export default" "$file"; then
      echo -e "${RED}⚠️  $filename${NC} - Default export"
      ((default_count++))
    # export function 확인
    elif grep -q "^export function" "$file"; then
      echo -e "${GREEN}✅ $filename${NC} - Named export"
      ((named_count++))
    # export const 확인
    elif grep -q "^export const" "$file"; then
      echo -e "${GREEN}✅ $filename${NC} - Named export (const)"
      ((named_count++))
    else
      echo -e "${YELLOW}❓ $filename${NC} - Unknown export"
    fi
  fi
done

echo ""
echo "======================================"
echo "📊 통계"
echo "======================================"
echo -e "${GREEN}✅ Named exports:   $named_count${NC}"
echo -e "${RED}⚠️  Default exports: $default_count${NC}"
echo ""

total=$((named_count + default_count))
if [ $total -gt 0 ]; then
  named_pct=$((named_count * 100 / total))
  default_pct=$((default_count * 100 / total))
  
  echo "📈 비율:"
  echo "  Named:   $named_pct%"
  echo "  Default: $default_pct%"
  echo ""
fi

if [ $default_count -gt 0 ]; then
  echo "⚠️  권장 사항:"
  echo "  $default_count개의 Default export를 Named export로 변경하는 것을 권장합니다."
  echo ""
  echo "📚 자세한 내용:"
  echo "  /docs/99-analysis/라우트-임포트-전체-분석-보고서.md"
else
  echo "✅ 모든 페이지가 Named export를 사용하고 있습니다!"
fi

echo ""
