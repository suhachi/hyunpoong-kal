# Scripts 디렉토리

**프로젝트**: 현풍닭칼국수 배달앱 (hp-kal)  
**디렉토리**: `/scripts/`  
**버전**: 2.0 (2024-11-08 업데이트)

---

## 📜 스크립트 목록

### 1. rebrand.sh ⭐⭐⭐⭐⭐ (화이트라벨 핵심)
**목적**: 현풍닭칼국수 PWA를 다른 음식점 브랜드로 자동 변환

**버전**: 2.0 (2024-11-08)

**주요 개선사항**:
- ✅ 최신 코드 구조 반영 (2024-11-08)
- ✅ design-tokens.ts 업데이트 지원
- ✅ design-lock.css 전체 컬러 변경
- ✅ 컬러 검증 기능 추가
- ✅ 파일 검증 자동화
- ✅ 더 상세한 로그 및 안내

**기능**:
- ✅ 가게명 자동 변경
- ✅ 브랜드 컬러 자동 변경 (3가지: Primary, Secondary, Accent)
- ✅ 6개 파일 일괄 변경
- ✅ 자동 백업 생성 (타임스탬프 포함)
- ✅ 확인 프롬프트 (실수 방지)
- ✅ 컬러 검증 (헥스 코드 형식)
- ✅ 파일 검증 (변경 사항 자동 확인)
- ✅ 상세한 로그 (컬러 출력)
- ✅ 다음 단계 안내

**사용 방법**:
```bash
# 실행 권한 부여 (최초 1회)
chmod +x scripts/rebrand.sh

# 스크립트 실행
./scripts/rebrand.sh "새가게명" "#Primary" "#Secondary" "#Accent"

# 예시: 부산갈비집
./scripts/rebrand.sh "부산갈비집" "#8B4513" "#FF6B35" "#D4AF37"
```

**변경되는 파일 (6개)**:
| # | 파일 | 변경 내용 |
|---|------|----------|
| 1 | `config/env.ts` | 가게명 |
| 2 | `constants/colors.ts` | BRAND_COLORS (primary, secondary, accent) |
| 3 | `constants/design-tokens.ts` | BRAND_COLORS (hyunpungRed, shinkalOrange, brassGold) |
| 4 | `styles/globals.css` | CSS 변수 (#D61C1C → 새 Primary 등) |
| 5 | `styles/design-lock.css` | CSS 잠금 (!important 포함, 전체 컬러) |
| 6 | `index.html` | <title>, 메타 태그 |

**출력 예시**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏪 브랜드 변경 스크립트 시작
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

가게명: 부산갈비집
Primary: #8B4513
Secondary: #FF6B35
Accent: #D4AF37

계속하시겠습니까? (y/N): y

[1/8] 백업 생성 중...
✅ 백업 완료: ./backup-20241107-153042

[2/8] config/env.ts 변경 중...
  기존: 현풍닭칼국수
  새로: 부산갈비집
✅ config/env.ts 변경 완료

[3/8] constants/colors.ts 변경 중...
✅ constants/colors.ts 변경 완료

...

🎉 브랜드 변경 완료!

다음 단계:
  1. 개발 서버 실행: npm run dev
  2. 브라우저 확인: http://localhost:5173
  3. 메뉴 데이터 변경: vi data/menus.json
```

**추천 브랜드 컬러**:
```bash
# 한식당
./scripts/rebrand.sh "서울한정식" "#8B4513" "#D4A574" "#C41E3A"

# 치킨집
./scripts/rebrand.sh "황금치킨" "#FF6B35" "#F7B733" "#C0392B"

# 피자집
./scripts/rebrand.sh "나폴리피자" "#E74C3C" "#F39C12" "#27AE60"

# 카페
./scripts/rebrand.sh "브루잉커피" "#6F4E37" "#D4AF37" "#8B7355"

# 분식집
./scripts/rebrand.sh "엄마손분식" "#E74C3C" "#F39C12" "#3498DB"
```

**상세 가이드**: `/scripts/REBRAND-SCRIPT-GUIDE.md`

---

### 2. deploy-firebase.sh
**목적**: Firebase 리소스 일괄 배포

**기능**:
- ✅ Firestore Rules 배포
- ✅ Firestore Indexes 배포
- ✅ Storage Rules 배포
- ✅ Functions 배포 (선택)
- ✅ Hosting 배포 (선택)
- ✅ 배포 후 정보 제공

**사용 방법**:
```bash
# 실행 권한 부여
chmod +x scripts/deploy-firebase.sh

# 스크립트 실행
./scripts/deploy-firebase.sh

# 대화형으로 Functions, Hosting 배포 선택
```

**출력 예시**:
```
======================================
Firebase 배포 시작 - hp-kal
======================================

🔍 Firebase 프로젝트 확인
현재 프로젝트: hp-kal

🔒 Step 1: Firestore Rules 배포
✅ Firestore Rules 배포 완료

📇 Step 2: Firestore Indexes 배포
✅ Firestore Indexes 배포 완료

🗄️  Step 3: Storage Rules 배포
✅ Storage Rules 배포 완료

Functions도 배포하시겠습니까? (y/N): _
```

---

### 3. apply-cors.sh ⭐
**목적**: Firebase Storage CORS 설정 자동 적용

**기능**:
- ✅ Google Cloud SDK 설치 확인
- ✅ 인증 상태 확인
- ✅ 프로젝트 확인 및 전환
- ✅ CORS 파일 검증
- ✅ 버킷 접근 확인
- ✅ 현재 CORS 설정 표시
- ✅ CORS 설정 적용
- ✅ 적용 결과 확인

**사용 방법**:
```bash
# 실행 권한 부여
chmod +x scripts/apply-cors.sh

# 스크립트 실행 (프로젝트 루트에서)
./scripts/apply-cors.sh

# 안내에 따라 진행
```

**출력 예시**:
```
======================================
Firebase Storage CORS 설정
프로젝트: hp-kal
======================================

🔍 Step 1: Google Cloud SDK 확인...
✅ Google Cloud SDK 설치됨

🔍 Step 2: gsutil 확인...
✅ gsutil 사용 가능

🔍 Step 3: 인증 확인...
✅ 인증된 계정: user@example.com

🔍 Step 4: 프로젝트 확인...
현재 프로젝트: hp-kal

🔍 Step 5: CORS 설정 파일 확인...
✅ cors.json 파일 발견

📄 CORS 설정 내용:
======================================
[
  {
    "origin": [
      "https://hp-kal.web.app",
      "https://hp-kal.firebaseapp.com",
      "http://localhost:5173"
    ],
    ...
  }
]
======================================

계속하시겠습니까? (y/N): _
```

---

## 🚀 빠른 시작

### 모든 스크립트 실행 권한 부여
```bash
chmod +x scripts/*.sh
```

### 브랜드 변경 (화이트라벨) ⭐
```bash
./scripts/rebrand.sh "새가게명" "#컬러1" "#컬러2" "#컬러3"
```

### Firebase 전체 배포
```bash
./scripts/deploy-firebase.sh
```

### CORS 설정만 적용
```bash
./scripts/apply-cors.sh
```

---

## 📋 사전 요구사항

### rebrand.sh
- ✅ Bash 쉘 (macOS, Linux, Git Bash)
- ✅ sed 명령어 (대부분 OS에 기본 설치)
- ✅ 실행 권한 (`chmod +x`)

### deploy-firebase.sh
- ✅ Firebase CLI 설치 (`npm install -g firebase-tools`)
- ✅ Firebase 로그인 (`firebase login`)
- ✅ 프로젝트 선택 (`firebase use hp-kal`)

### apply-cors.sh
- ✅ Google Cloud SDK 설치
  - Mac: `brew install google-cloud-sdk`
  - Linux: `curl https://sdk.cloud.google.com | bash`
  - Windows: https://cloud.google.com/sdk/docs/install
- ✅ Google 인증 (`gcloud auth login`)
- ✅ 프로젝트 권한 (Storage Admin 이상)

---

## 🔧 트러블슈팅

### "Permission denied" 오류
```bash
# 실행 권한 부여
chmod +x scripts/deploy-firebase.sh
chmod +x scripts/apply-cors.sh
```

### "command not found: firebase"
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 설치 확인
firebase --version
```

### "command not found: gcloud"
```bash
# Google Cloud SDK 설치 (Mac)
brew install google-cloud-sdk

# PATH 추가 (필요 시)
source "$(brew --prefix)/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/path.bash.inc"
```

### "AccessDeniedException: 403"
- 프로젝트 소유자에게 권한 요청
- IAM & Admin에서 "Storage Admin" 역할 부여 필요

---

## 📚 관련 문서

### 화이트라벨 (rebrand.sh)
- **상세 가이드**: `/scripts/REBRAND-SCRIPT-GUIDE.md`
- **화이트라벨 개요**: `/WHITE-LABEL-README.md`
- **빠른 시작**: `/WHITE-LABEL-QUICK-START.md`
- **파일 목록**: `/docs/05-company/03-화이트라벨-파일-목록.md`

### Firebase
- **Firebase 전체 정보**: `/docs/06-firebase/01-Firebase-정보-전체-정리.md`
- **Firebase 적용 완료**: `/docs/06-firebase/02-Firebase-적용-완료보고서.md`
- **CORS 설정 가이드**: `/docs/06-firebase/03-CORS-설정-가이드.md`
- **CORS 빠른 참조**: `/docs/06-firebase/04-CORS-빠른참조.md`

---

## 🎯 전체 스크립트 목록

### 사용 가능 (7개)
- ✅ `rebrand.sh` - 브랜드 자동 변경 (화이트라벨)
- ✅ `deploy-firebase.sh` - Firebase 일괄 배포
- ✅ `apply-cors.sh` - CORS 설정 적용
- ✅ `lock-design.sh` - 디자인 CSS 잠금
- ✅ `verify-exports.sh` - Export 검증
- ✅ `verify-figma-make-compatibility.sh` - Figma Make 호환성
- ✅ `verify-phase3.sh` - Phase 3 검증

### 향후 추가 예정
- [ ] `backup-firestore.sh` - Firestore 데이터 백업
- [ ] `restore-firestore.sh` - Firestore 데이터 복원
- [ ] `validate-rules.sh` - Firestore Rules 문법 검증
- [ ] `test-cors.sh` - CORS 설정 자동 테스트
- [ ] `cleanup-storage.sh` - Storage 미사용 파일 정리

---

**작성일**: 2025-10-29  
**작성자**: 개발팀  
**버전**: 1.0
