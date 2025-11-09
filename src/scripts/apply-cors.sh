#!/bin/bash

###############################################################################
# Firebase Storage CORS 설정 스크립트
# 프로젝트: hp-kal
# 작성일: 2025-10-29
###############################################################################

set -e

echo "======================================"
echo "Firebase Storage CORS 설정"
echo "프로젝트: hp-kal"
echo "======================================"
echo ""

# 1. Google Cloud SDK 설치 확인
echo "🔍 Step 1: Google Cloud SDK 확인..."
if ! command -v gcloud &> /dev/null; then
  echo "❌ gcloud 명령어를 찾을 수 없습니다."
  echo ""
  echo "Google Cloud SDK를 먼저 설치하세요:"
  echo "  Mac:    brew install google-cloud-sdk"
  echo "  Linux:  curl https://sdk.cloud.google.com | bash"
  echo "  Windows: https://cloud.google.com/sdk/docs/install"
  echo ""
  exit 1
fi
echo "✅ Google Cloud SDK 설치됨"
echo ""

# 2. gsutil 확인
echo "🔍 Step 2: gsutil 확인..."
if ! command -v gsutil &> /dev/null; then
  echo "❌ gsutil 명령어를 찾을 수 없습니다."
  echo "Google Cloud SDK를 재설치하거나 PATH를 확인하세요."
  exit 1
fi
echo "✅ gsutil 사용 가능"
echo ""

# 3. 인증 확인
echo "🔍 Step 3: 인증 확인..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
  echo "⚠️  인증되지 않았습니다."
  echo ""
  read -p "지금 인증하시겠습니까? (y/N): " do_auth
  if [[ $do_auth =~ ^[Yy]$ ]]; then
    gcloud auth login
    gcloud auth application-default login
  else
    echo "취소되었습니다."
    exit 1
  fi
fi

active_account=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
echo "✅ 인증된 계정: $active_account"
echo ""

# 4. 프로젝트 확인
echo "🔍 Step 4: 프로젝트 확인..."
current_project=$(gcloud config get-value project 2>/dev/null || echo "")

if [ -z "$current_project" ]; then
  echo "⚠️  프로젝트가 설정되지 않았습니다."
  echo ""
  read -p "hp-kal 프로젝트를 설정하시겠습니까? (y/N): " set_project
  if [[ $set_project =~ ^[Yy]$ ]]; then
    gcloud config set project hp-kal
    current_project="hp-kal"
  else
    echo "취소되었습니다."
    exit 1
  fi
fi

echo "현재 프로젝트: $current_project"

if [ "$current_project" != "hp-kal" ]; then
  echo ""
  echo "⚠️  현재 프로젝트가 hp-kal이 아닙니다."
  read -p "hp-kal로 변경하시겠습니까? (y/N): " change_project
  if [[ $change_project =~ ^[Yy]$ ]]; then
    gcloud config set project hp-kal
    echo "✅ 프로젝트를 hp-kal로 변경했습니다."
  else
    echo "취소되었습니다."
    exit 1
  fi
fi
echo ""

# 5. CORS 파일 확인
echo "🔍 Step 5: CORS 설정 파일 확인..."
if [ ! -f "cors.json" ]; then
  echo "❌ cors.json 파일을 찾을 수 없습니다."
  echo ""
  echo "프로젝트 루트 디렉토리에서 실행하세요."
  echo "현재 위치: $(pwd)"
  exit 1
fi
echo "✅ cors.json 파일 발견"
echo ""

# 6. CORS 내용 표시
echo "📄 CORS 설정 내용:"
echo "======================================"
cat cors.json
echo ""
echo "======================================"
echo ""

# 7. 버킷 확인
echo "🔍 Step 6: Storage 버킷 확인..."
if ! gsutil ls gs://hp-kal.appspot.com &> /dev/null; then
  echo "❌ 버킷 gs://hp-kal.appspot.com에 접근할 수 없습니다."
  echo ""
  echo "다음을 확인하세요:"
  echo "  1. 프로젝트 권한 (Storage Admin 이상)"
  echo "  2. 버킷 이름 (hp-kal.appspot.com)"
  echo "  3. 인증 계정"
  echo ""
  exit 1
fi
echo "✅ 버킷 접근 가능: gs://hp-kal.appspot.com"
echo ""

# 8. 현재 CORS 설정 확인
echo "🔍 Step 7: 현재 CORS 설정 확인..."
current_cors=$(gsutil cors get gs://hp-kal.appspot.com 2>/dev/null || echo "")
if [ -n "$current_cors" ]; then
  echo "⚠️  기존 CORS 설정이 있습니다:"
  echo "======================================"
  echo "$current_cors"
  echo "======================================"
  echo ""
  read -p "기존 설정을 덮어쓰시겠습니까? (y/N): " overwrite
  if [[ ! $overwrite =~ ^[Yy]$ ]]; then
    echo "취소되었습니다."
    exit 0
  fi
else
  echo "✅ 기존 CORS 설정 없음"
fi
echo ""

# 9. CORS 설정 적용 확인
echo "======================================"
echo "🚀 CORS 설정을 적용하시겠습니까?"
echo "======================================"
echo ""
echo "버킷: gs://hp-kal.appspot.com"
echo "파일: cors.json"
echo ""
read -p "계속하시겠습니까? (y/N): " confirm

if [[ ! $confirm =~ ^[Yy]$ ]]; then
  echo ""
  echo "취소되었습니다."
  exit 0
fi

# 10. CORS 설정 적용
echo ""
echo "🚀 CORS 설정 적용 중..."
if gsutil cors set cors.json gs://hp-kal.appspot.com; then
  echo "✅ CORS 설정이 성공적으로 적용되었습니다!"
else
  echo "❌ CORS 설정 적용에 실패했습니다."
  exit 1
fi
echo ""

# 11. 적용된 설정 확인
echo "🔍 Step 8: 적용된 CORS 설정 확인..."
echo "======================================"
gsutil cors get gs://hp-kal.appspot.com
echo "======================================"
echo ""

# 12. 완료
echo "======================================"
echo "✨ CORS 설정 완료!"
echo "======================================"
echo ""
echo "📌 다음 도메인에서 Storage 접근 가능:"
echo "  ✅ https://hp-kal.web.app"
echo "  ✅ https://hp-kal.firebaseapp.com"
echo "  ✅ http://localhost:5173"
echo ""
echo "🧪 테스트 방법:"
echo "  1. 관리자 페이지 > 메뉴 관리 > 이미지 업로드"
echo "  2. 고객 앱 > 리뷰 작성 > 사진 추가"
echo "  3. 브라우저 개발자 도구 > Network 탭 확인"
echo ""
echo "📚 자세한 내용:"
echo "  /docs/06-firebase/03-CORS-설정-가이드.md"
echo ""
