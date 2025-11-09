# Firebase 문서 디렉토리

**프로젝트**: 현풍닭칼국수 배달앱 (hp-kal)  
**디렉토리**: `/docs/06-firebase/`

---

## 📚 문서 목록

### 1. Firebase 정보 전체 정리
**파일**: `01-Firebase-정보-전체-정리.md`

**내용**:
- Firebase 프로젝트 정보 (hp-kal)
- 설정 파일 (firebase.json, firestore.rules 등)
- Firestore 보안 규칙 및 인덱스
- Storage 규칙 및 CORS 설정
- Functions 설정
- 환경 변수 및 배포 명령어
- 프로젝트 URL 및 모니터링

**언제 참조**: Firebase 배포, 설정 변경, 트러블슈팅

---

### 2. Firebase 적용 완료 보고서
**파일**: `02-Firebase-적용-완료보고서.md`

**내용**:
- Firebase 정보 적용 작업 요약
- 변경된 파일 목록
- firebase.json 업데이트 내용
- CORS 설정 파일 생성
- 배포 스크립트 개선
- 환경 변수 설정 가이드
- 배포 방법 및 체크리스트

**언제 참조**: 프로젝트 적용 확인, 배포 준비

---

### 3. CORS 설정 가이드 ⭐
**파일**: `03-CORS-설정-가이드.md`

**내용**:
- CORS란 무엇인가
- 왜 CORS 설정이 필요한가
- Google Cloud Console에서 설정하는 방법 (단계별 스크린샷 가이드)
- gsutil 명령어로 설정하는 방법
- CORS 설정 확인 및 테스트 방법
- 트러블슈팅 (권한, 캐시, 명령어 오류 등)
- CORS 설정 변경 시나리오

**언제 참조**: Storage 이미지 업로드 CORS 오류 발생 시, 새 도메인 추가 시

---

### 4. CORS 빠른 참조 ⚡
**파일**: `04-CORS-빠른참조.md`

**내용**:
- 3가지 CORS 설정 방법 (자동 스크립트, 수동 명령어, Console)
- 빠른 확인 방법
- 주요 문제 해결
- 1페이지 요약

**언제 참조**: CORS 설정을 빠르게 적용해야 할 때

---

## 🔗 관련 파일

### 프로젝트 루트
```
/firebase.json                  - Firebase 설정
/firestore.rules                - Firestore 보안 규칙
/firestore.indexes.json         - Firestore 인덱스
/storage.rules                  - Storage 보안 규칙
/cors.json                      - CORS 설정
```

### Functions
```
/functions/                     - Firebase Functions
  ├── package.json
  ├── src/
  │   ├── index.ts
  │   ├── orders.ts
  │   └── lib/
  └── tsconfig.json
```

### 클라이언트
```
/lib/firebase.ts                - Firebase 초기화
/config/env.ts                  - 환경 변수 설정
```

---

## 🚀 빠른 시작

### 1. Firebase CLI 설치
```bash
npm install -g firebase-tools
```

### 2. Firebase 로그인
```bash
firebase login
```

### 3. 프로젝트 선택
```bash
firebase use hp-kal
```

### 4. 배포
```bash
# 전체 배포
firebase deploy

# 또는 스크립트 사용
./scripts/deploy-firebase.sh
```

---

## 📖 주요 명령어

### Firebase 배포
```bash
# 전체 배포
firebase deploy

# 개별 배포
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
firebase deploy --only functions
firebase deploy --only hosting

# 배포 스크립트 (대화형)
./scripts/deploy-firebase.sh
```

### CORS 설정
```bash
# 자동 스크립트 (권장)
./scripts/apply-cors.sh

# 수동 명령어
gsutil cors set cors.json gs://hp-kal.appspot.com

# 설정 확인
gsutil cors get gs://hp-kal.appspot.com
```

### 에뮬레이터
```bash
firebase emulators:start
```

### 로그 및 모니터링
```bash
firebase functions:log
firebase functions:log --only [function-name]
```

---

## 🔐 보안

### Firestore Rules
- ✅ 사용자 인증 확인
- ✅ 본인 데이터만 접근
- ✅ 관리자 권한 분리
- ✅ 불변 필드 보호

### Storage Rules
- ✅ 파일 크기 제한 (메뉴 5MB, 리뷰 3MB)
- ✅ MIME 타입 검증 (이미지만)
- ✅ 본인만 업로드

---

## 🌐 프로젝트 URL

### Production
- **웹 앱**: https://hp-kal.web.app
- **Firebase Console**: https://console.firebase.google.com/project/hp-kal

### 로컬 개발
- **개발 서버**: http://localhost:5173
- **Emulator UI**: http://localhost:4000

---

## 📞 문의

- **고객센터**: 1566-5046
- **이메일**: help@shinkal.co.kr
- **개발사**: KS컴퍼니 (사업자번호: 553-17-00098)

---

**최종 업데이트**: 2025-10-29  
**작성자**: 개발팀
