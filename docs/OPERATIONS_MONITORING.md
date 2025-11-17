# 운영 모니터링 및 장애 대응 Runbook

## 참고 문서
- [최종 QA & 릴리즈 체크리스트](FINAL_QA_AND_RELEASE_CHECKLIST.md)
- [배포 Runbook](DEPLOYMENT_RUNBOOK.md)
- [데이터 및 계정 마이그레이션 계획](DATA_AND_ACCOUNT_MIGRATION_PLAN.md)
- [관리자 사용 가이드](ADMIN_USER_GUIDE.md)
- [최종 프로젝트 보고서](FINAL_PROJECT_REPORT_hyunpoong-kal.md)


## 1. 개요
- 서비스 이름: 현풍닭칼국수 PWA (hyunpoong-kal)
- 대상 환경: 개발 / 스테이징 / 운영
- 핵심 지표 예시: 응답 속도, 에러율, 주문 성공률 등

## 2. 실시간 서비스 상태 모니터링
- 모니터링 도구/지표: Vercel 상태, Firebase status, 브라우저 에러 로그, Cloud Functions 로그 등
- 모니터링 주기: 실시간/1일 1회/주간 등
- 담당자 Role: 운영 담당자, 개발 담당자, QA 담당자 (실명은 TODO: 담당자 지정)

## 3. 장애 정의 및 등급
- L1(치명적): 전체 서비스 다운, 주문 불가
- L2(중간): 일부 기능 장애, 주문 일부 실패
- L3(경미): UI 오류, 통계 지연 등

## 4. 장애 발생 시 대응 절차
1) 탐지/신고 (운영 담당자, 자동 모니터링)
2) 1차 원인 파악 (개발/운영 담당자)
3) 임시 조치 (운영 담당자)
4) 근본 원인 분석 (개발 담당자)
5) 재발 방지 조치 (개발/운영 담당자)

## 5. 장애 후 회고(Postmortem)
- 발생 시간: <>
- 영향 범위: <>
- 원인: <>
- 조치: <>
- 재발 방지: <>
- 담당자: TODO: 실명 기입
