# 배포 Runbook (hyunpoong-kal)

## 1. 개요
- 대상 환경: 개발 / 스테이징 / 운영
- 배포 대상: Vite 빌드, Firebase Hosting, Firebase Functions, Firestore 규칙 등

## 2. 사전 준비
- [ ] ENVIRONMENT_SETUP.md 및 FINAL_QA_AND_RELEASE_CHECKLIST.md 전체 통과
- [ ] Firebase CLI 로그인 (`firebase login`)
- [ ] 현재 firebase 프로젝트 alias 확인 (`firebase use`)

## 3. 빌드 & 배포 명령 예시
### 3.1 로컬 빌드
```bash
pnpm run build
```
### 3.2 Firebase 배포 (예시)
```bash
# Functions만
firebase deploy --only functions

# Hosting만
firebase deploy --only hosting

# Firestore 규칙/인덱스
firebase deploy --only firestore

# 전체 (주의: 운영 환경에서 신중히 사용)
firebase deploy
```

- 실제 프로젝트에서 사용하는 배포 조합을 TODO로 명시해 둘 것.

## 4. 롤백 절차
- Firebase 콘솔에서 이전 버전으로 Hosting 롤백
- Functions의 이전 릴리즈 버전으로 재배포
- Firestore 규칙/인덱스 변경 시, 이전 버전 백업 확인
- DB 백업/복구: Firestore/Storage export/import 명령어 및 절차 문서화

## 5. 배포 후 24시간 집중 모니터링 체크리스트
- [ ] 오류 로그(콘솔/Crashlytics/Log 도구) 급증 여부 확인
- [ ] 주문 실패율/에러율 변화 확인
- [ ] 응답 속도/타임아웃 이슈 확인
- [ ] 주요 페이지(PWA, 주문, 관리자)가 정상 동작하는지 수시 점검

## 6. TODO
- [ ] 실제 프로젝트 alias/배포 옵션/백업 경로 등 Owner가 채워야 할 항목

---
관련 문서: FINAL_QA_AND_RELEASE_CHECKLIST.md, DATA_AND_ACCOUNT_MIGRATION_PLAN.md, OPERATIONS_MONITORING.md
