#!/bin/bash

###############################################################################
# Firebase 배포 스크립트
# 현풍닭칼국수 PWA (hp-kal) - Firebase 리소스 일괄 배포
# 프로젝트: hp-kal
###############################################################################

set -e  # 오류 발생 시 중단

echo "======================================"
echo "Firebase 배포 시작 - hp-kal"
echo "======================================"
echo ""

# 프로젝트 확인
echo "🔍 Firebase 프로젝트 확인"
firebase use hp-kal
echo ""

# 1. Firestore Rules 배포
echo "🔒 Step 1: Firestore Rules 배포"
firebase deploy --only firestore:rules
echo "✅ Firestore Rules 배포 완료"
echo ""

# 2. Firestore Indexes 배포
echo "📇 Step 2: Firestore Indexes 배포"
firebase deploy --only firestore:indexes
echo "✅ Firestore Indexes 배포 완료"
echo ""

# 3. Storage Rules 배포
echo "🗄️  Step 3: Storage Rules 배포"
firebase deploy --only storage
echo "✅ Storage Rules 배포 완료"
echo ""

# 4. Functions 빌드 및 배포 (선택)
read -p "Functions도 배포하시겠습니까? (y/N): " deploy_functions
if [[ $deploy_functions =~ ^[Yy]$ ]]; then
  echo "📦 Step 4: Firebase Functions 빌드 및 배포"
  cd functions
  npm install
  npm run build
  cd ..
  firebase deploy --only functions
  echo "✅ Functions 배포 완료"
  echo ""
fi

# 5. Hosting 배포 (선택)
read -p "Hosting도 배포하시겠습니까? (y/N): " deploy_hosting
if [[ $deploy_hosting =~ ^[Yy]$ ]]; then
  echo "🌐 Step 5: Hosting 빌드 및 배포"
  npm run build
  firebase deploy --only hosting
  echo "✅ Hosting 배포 완료"
  echo ""
fi

echo "======================================"
echo "✨ Firebase 배포 완료!"
echo "======================================"
echo ""
echo "📌 배포된 리소스:"
echo "  ✅ Firestore Rules"
echo "  ✅ Firestore Indexes"
echo "  ✅ Storage Rules"
[[ $deploy_functions =~ ^[Yy]$ ]] && echo "  ✅ Functions"
[[ $deploy_hosting =~ ^[Yy]$ ]] && echo "  ✅ Hosting"
echo ""
echo "🔗 프로젝트 URL:"
echo "  https://hp-kal.web.app"
echo "  https://console.firebase.google.com/project/hp-kal"
echo ""
echo "📊 로그 및 모니터링:"
echo "  firebase functions:log"
echo "  firebase functions:log --only [function-name]"
echo ""
echo "⚙️  Functions 환경 변수 설정:"
echo "  firebase functions:config:set nice.mid=\"YOUR_MID\""
echo "  firebase functions:config:set nice.key=\"YOUR_KEY\""
echo "  firebase functions:config:set nice.site=\"YOUR_SITE\""
echo ""
echo "🔧 CORS 설정 (필요 시):"
echo "  gsutil cors set cors.json gs://hp-kal.appspot.com"
echo ""
