# T2-19 작업완료보고서 — Firebase @orderflow E2E에서 OrderTracking testId 적용

## 1. 개요
- 일시: 2025-11-16
- 브랜치: `feat/fix-first-20251113`
- 대상: `src/e2e/order-flow.spec.ts`
- 목표: T2-18에서 추가한 `order-tracking.*`, `order-complete.*` testId를 활용해 Firebase 주문 흐름(@orderflow) E2E의 OrderTracking 관련 셀렉터를 안정화

## 2. 변경 파일
| 파일 | 변경 내용 |
|------|-----------|
| `src/e2e/order-flow.spec.ts` | @orderflow Firebase Order flow 블록에서 OrderTracking 관련 셀렉터를 testId 기반으로 리팩터 |

## 3. 주요 셀렉터 변경 요약
| 변경 유형 | 기존 | 변경 후 |
|----------|------|---------|
| 주문번호 선택 | `page.locator('text=주문번호:').first()` | `page.getByTestId('order-tracking.order-id')` |
| 상태 확인 | 텍스트 기반 상태 확인(고정 문자열) | `page.getByTestId('order-tracking.status')` + 정규식 `/주문\|접수\|조리\|배달\|포장\|완료/` |
| 페이지 구조 확인 | URL 이동만 확인 | `order-tracking.page`, `order-tracking.header`, `order-tracking.timeline`, `order-tracking.items`, `order-tracking.item`, `order-tracking.total`를 `getByTestId`로 검증 |
| 대기 방식 | 암묵적/하드 타이머 없음 | testId 기반 `toBeVisible`/`toHaveText` expect로 명시적 대기 |

## 4. 구현 방식 요약
- OrderTracking 페이지 진입 후:
  - `order-tracking.page` 가시성으로 페이지 로드 확인
  - `order-tracking.order-id`, `order-tracking.status`로 주문번호/상태 존재 확인
  - `order-tracking.timeline`, `order-tracking.items`, `order-tracking.item`, `order-tracking.total`로 타임라인·메뉴·합계 영역 가시성 검증
- 상태 텍스트는 `/주문|접수|조리|배달|포장|완료/` 정규식을 사용해 특정 문구에 과도하게 락인되지 않도록 처리.
- 하드 타이머(`waitForTimeout`)는 사용하지 않고, testId + expect 기반으로만 대기.

## 5. 테스트 실행 결과
- 실행 명령: `pnpm run test:e2e:orderflow`
- 결과: **실패 (테스트 미실행)**
- 원인:
  - Playwright 설정에 `chromium` 프로젝트 정의가 없는데
  - `package.json`의 `test:e2e:orderflow` 스크립트가 `--project=chromium` 옵션을 고정 사용
  - 에러 메시지: `Project(s) "chromium" not found. Available projects: ""`
- Firebase 환경 변수 전환(`VITE_USE_FIREBASE='true'`)은 정상 동작하여 환경 전환 자체는 성공.

## 6. 향후 조치 제안
1. `playwright.config.ts`에서 `projects` 설정을 확인:
   - `projects` 배열이 없거나, `name: 'chromium'` 프로젝트가 정의되지 않은 상태라면 아래 두 가지 중 하나 선택:
     - (A) `chromium` 프로젝트를 config에 추가
     - (B) `package.json`의 `test:e2e:orderflow` 스크립트에서 `--project=chromium` 제거

2. 현 상태에서는:
   - **T2-19 범위(셀렉터 리팩터)는 완료**되었고
   - 테스트 불통은 **Playwright 프로젝트 설정 문제**로 분류.

## 7. 결론
- Firebase 주문 흐름 @orderflow E2E에서 OrderTracking 관련 selector를 텍스트/구조 의존 → testId 기반으로 전환 완료.
- 실제 테스트 실행은 Playwright 프로젝트 정의 문제로 인해 미실행 상태이며, **T2-20에서 Playwright config/스크립트 정리 후 재실행 필요**.

---
작성자: GitHub Copilot (AI Assistant)
작성일: 2025-11-16
브랜치: feat/fix-first-20251113
관련 문서: `docs/T2-18_OrderTracking_testId_2025-11-16.md`, `docs/TESTID_STRATEGY_OrderFlow_2025-Phase2.md`
