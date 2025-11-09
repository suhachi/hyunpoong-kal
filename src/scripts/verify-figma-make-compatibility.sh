#!/bin/bash

###############################################################################
# Figma Make 호환성 검증 스크립트
# 
# 방어적 코드가 올바르게 적용되었는지 검증합니다.
# 
# 개발사: KS컴퍼니 (사업자번호: 553-17-00098)
###############################################################################

set -e

echo "=========================================="
echo "🔍 Figma Make 호환성 검증"
echo "=========================================="
echo ""

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

SUCCESS_COUNT=0
WARNING_COUNT=0
ERROR_COUNT=0

# 검증 함수
check_pattern() {
  local file=$1
  local pattern=$2
  local description=$3
  
  echo -n "  [$file] $description ... "
  
  if grep -q "$pattern" "$file"; then
    echo -e "${GREEN}✅ 통과${NC}"
    ((SUCCESS_COUNT++))
    return 0
  else
    echo -e "${RED}❌ 실패${NC}"
    ((ERROR_COUNT++))
    return 1
  fi
}

check_warning_pattern() {
  local file=$1
  local pattern=$2
  local description=$3
  
  echo -n "  [$file] $description ... "
  
  if grep -q "$pattern" "$file"; then
    echo -e "${YELLOW}⚠️  주의${NC}"
    ((WARNING_COUNT++))
    return 1
  else
    echo -e "${GREEN}✅ 통과${NC}"
    ((SUCCESS_COUNT++))
    return 0
  fi
}

echo "📋 1. config/env.ts 검증"
echo "----------------------------------------"

# ENV 상수 체크
check_pattern "config/env.ts" "typeof import.meta === 'undefined'" \
  "ENV: import.meta 타입 체크"

check_pattern "config/env.ts" "import.meta.env" \
  "ENV: import.meta.env 체크"

check_pattern "config/env.ts" "Figma Make" \
  "ENV: Figma Make 감지 로깅"

# getEnv 함수 체크
check_pattern "config/env.ts" "const getEnv.*typeof import.meta" \
  "getEnv: import.meta 안전 체크"

check_pattern "config/env.ts" "console.warn.*Figma Make" \
  "getEnv: 경고 메시지"

# 위험한 패턴 체크
check_warning_pattern "config/env.ts" "import\.meta\.env\[" \
  "위험: 직접 import.meta.env 접근 (없어야 함)"

echo ""
echo "📋 2. main.tsx 검증"
echo "----------------------------------------"

# Service Worker 안전 체크
check_pattern "main.tsx" "try.*typeof import.meta" \
  "Service Worker: try-catch 블록"

check_pattern "main.tsx" "catch.*error.*PWA.*Service Worker" \
  "Service Worker: 에러 핸들링"

# 네트워크 리스너 안전 체크
check_pattern "main.tsx" "try.*setupNetworkListeners" \
  "네트워크 리스너: try-catch 블록"

check_pattern "main.tsx" "catch.*error.*PWA.*네트워크" \
  "네트워크 리스너: 에러 핸들링"

echo ""
echo "📋 3. 위험 패턴 검색"
echo "----------------------------------------"

# App.tsx에서 직접 import.meta 접근 체크
if grep -n "import\.meta\.env" App.tsx 2>/dev/null; then
  echo -e "  ${YELLOW}⚠️  App.tsx에서 직접 import.meta.env 접근 발견${NC}"
  ((WARNING_COUNT++))
else
  echo -e "  ${GREEN}✅ App.tsx: 직접 접근 없음${NC}"
  ((SUCCESS_COUNT++))
fi

# contexts에서 직접 import.meta 접근 체크
CONTEXT_FILES=$(find contexts -name "*.tsx" 2>/dev/null || true)
if [ -n "$CONTEXT_FILES" ]; then
  for file in $CONTEXT_FILES; do
    if grep -q "import\.meta\.env" "$file" 2>/dev/null; then
      echo -e "  ${YELLOW}⚠️  $file에서 직접 import.meta.env 접근 발견${NC}"
      ((WARNING_COUNT++))
    fi
  done
else
  echo -e "  ${GREEN}✅ contexts: 직접 접근 없음${NC}"
  ((SUCCESS_COUNT++))
fi

echo ""
echo "📋 4. 파일 존재 확인"
echo "----------------------------------------"

# 백업 파일 존재 확인
if [ -f "App.simple.tsx" ]; then
  echo -e "  ${GREEN}✅ App.simple.tsx 백업 파일 존재${NC}"
  ((SUCCESS_COUNT++))
else
  echo -e "  ${YELLOW}⚠️  App.simple.tsx 백업 파일 없음${NC}"
  ((WARNING_COUNT++))
fi

# 문서 확인
if [ -f "docs/미리보기-화면-진단-보고서.md" ]; then
  echo -e "  ${GREEN}✅ 진단 보고서 존재${NC}"
  ((SUCCESS_COUNT++))
else
  echo -e "  ${RED}❌ 진단 보고서 없음${NC}"
  ((ERROR_COUNT++))
fi

if [ -f "미리보기-문제-빠른해결.md" ]; then
  echo -e "  ${GREEN}✅ 빠른 해결 가이드 존재${NC}"
  ((SUCCESS_COUNT++))
else
  echo -e "  ${RED}❌ 빠른 해결 가이드 없음${NC}"
  ((ERROR_COUNT++))
fi

echo ""
echo "=========================================="
echo "📊 검증 결과 요약"
echo "=========================================="
echo ""
echo -e "${GREEN}✅ 성공: $SUCCESS_COUNT${NC}"
echo -e "${YELLOW}⚠️  경고: $WARNING_COUNT${NC}"
echo -e "${RED}❌ 실패: $ERROR_COUNT${NC}"
echo ""

# 최종 결과
if [ $ERROR_COUNT -eq 0 ]; then
  if [ $WARNING_COUNT -eq 0 ]; then
    echo -e "${GREEN}🎉 모든 검증 통과! Figma Make 호환성 완벽!${NC}"
    exit 0
  else
    echo -e "${YELLOW}⚠️  경고가 있지만 기본 기능은 작동합니다.${NC}"
    exit 0
  fi
else
  echo -e "${RED}❌ 검증 실패! 수정이 필요합니다.${NC}"
  exit 1
fi
