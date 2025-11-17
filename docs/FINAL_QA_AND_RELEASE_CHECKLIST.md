# 최종 QA & 릴리즈 체크리스트 (hyunpoong-kal)

## 1. 사전 조건
- [ ] 모든 E2E 테스트 통과 (`admin`, `order flow`, 기타 핵심 플로우)
- [ ] TypeScript 빌드 에러 없음 (`pnpm run build`)
- [ ] env 설정 점검 완료 (ENVIRONMENT_SETUP.md 기준)

## 2. 기능/화면 QA 체크
- [ ] 고객 주문 플로우 (메뉴 선택 → 장바구니 → 결제/주문 생성 → 주문 조회)
- [ ] 관리자 주문 관리 (주문 목록 조회, 상태 변경)
- [ ] 관리자 설정 탭 (결제/배달/지도/FCM/운영 탭 렌더링 및 기본 동작)
- [ ] PWA 설치 및 기본 동작 (모바일 홈 화면 추가, 오프라인 동작 범위)

## 3. 테스트 실행 체크리스트
- [ ] `pnpm run build`
- [ ] `pnpm exec playwright test -c src/playwright.config.ts --project=chromium`
- [ ] (선택) 다른 브라우저/모바일 뷰포트에서 수동 테스트

## 4. 릴리즈 전 수동 점검 항목
- [ ] 주요 페이지 콘솔 에러 없음 (Home, Cart, Checkout, OrderTracking, Admin)
- [ ] Lighthouse 간단 점수 확인 (Performance / PWA)
- [ ] 관리자 권한/역할(Owner/Staff) 동작 확인

## 5. 롤백 플랜 확인
- [ ] 이전 버전 배포 태그/릴리즈 노트 확인
- [ ] Firebase Hosting/Functions 이전 버전 롤백 방법 숙지
- [ ] Firestore/Storage 백업 시점 및 복구 절차 문서 확인

## 6. 승인
- [ ] PM/Owner 최종 승인
- [ ] 배포 담당자/운영 담당자 OK

## 7. TODO (세부 페이지/기능 추가)
- [ ] 추가 QA 항목: 
- [ ] 추가 기능/화면: 

---
관련 문서: ENVIRONMENT_SETUP.md, DEPLOYMENT_RUNBOOK.md, DATA_AND_ACCOUNT_MIGRATION_PLAN.md
