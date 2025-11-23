# T2-18 작업완료보고서 — OrderTracking 페이지 testId 보강

## 1. 개요
- 일시: 2025-11-16
- 브랜치: `feat/fix-first-20251113`
- 대상: `src/pages/app/OrderTracking.tsx`
- 목표: 상태별(placed/accepted/cooking/out_for_delivery/pickup_ready/done) 텍스트 변화와 무관하게 E2E가 안정적으로 선택 가능한 공통 testId 추가
- 범위 제외: 비즈니스 로직, Firestore 연동, 기존 E2E 스펙 수정, env 설정, 패키지 구성

## 2. 변경 파일
| 파일 | 변경 내용 |
|------|-----------|
| `src/pages/app/OrderTracking.tsx` | 공통 및 완료 상태용 testId 추가 (`order-tracking.*`, `order-complete.*` 보강) |
| `docs/TESTID_STRATEGY_OrderFlow_2025-Phase2.md` | OrderTracking 섹션 표/가이드 추가 |
| `docs/T2-18_OrderTracking_testId_2025-11-16.md` | 본 보고서 신규 작성 |

## 3. 추가된 testId 목록
| testId | 용도 | 조건 |
|--------|------|------|
| `order-tracking.page` | 페이지 최상위 컨테이너 | 항상 |
| `order-tracking.header` | 상단 상태/아이콘/주문번호 카드 래퍼 | 항상 |
| `order-tracking.status` | 현재 주문 상태 라벨 | 항상 |
| `order-tracking.order-id` | 주문번호 표시 영역 (텍스트 래퍼) | 항상 |
| `order-tracking.timeline` | 타임라인 전체 컨테이너 | 항상 |
| `order-tracking.items` | 주문 메뉴 리스트 래퍼 | 항상 |
| `order-tracking.item` | 단일 메뉴 항목 | 반복 |
| `order-tracking.total` | 최종 결제/요약 영역(PriceBreakdown 래핑) | 항상 |
| `order-complete.page` | 완료 화면 컨테이너 | `status === 'done'` |
| `order-complete.message` | 완료 메시지 텍스트 | `status === 'done'` |
| `order-complete.order-id` | 완료 화면 주문번호 표시 | `status === 'done'` |

## 4. 구현 방식 요약
- 기존 최상위 `<div className="pb-6" ...>`를 외부 래퍼 `<div data-testid="order-tracking.page">`로 감싸 안정적 루트 testId 확보.
- 완료 상태 조건부 testId(`order-complete.*`)는 내부 span으로 이동하여 공통 testId(`order-tracking.status`, `order-tracking.order-id`)를 유지하면서 중복 불가 문제 해결.
- 타임라인, 아이템 리스트, 개별 아이템, 최종 합계 영역에 각각 testId 부여.
- UI/스타일/텍스트 변경 없음. 로직(상태 계산, 렌더 조건) 변경 없음.

## 5. 검증 절차
1. 타입 컴파일: `pnpm build` → 오류 없음 확인.
2. (ESLint 스크립트 미존재) 현재 `package.json`에 lint 스크립트/의존성 없으므로 ESLint 실행 불가. 추후 도입 시 재검증 권장.
3. 브라우저 수동 확인 (Firebase/Mock 모드 공통):
   - 다양한 주문 상태에서 Elements 패널로 각 testId 존재 여부 확인.
   - 완료 상태에서 `order-complete.*` + `order-tracking.*` 동시 존재 확인.
4. 기존 기능(상태 업데이트, 타임라인 표시, PriceBreakdown, 리뷰 버튼 등) 정상 동작.

## 6. E2E 활용 예 (향후 교체 용)
```typescript
// 주문번호 추출 (텍스트 split 대신 testId 사용)
const orderIdText = await page.getByTestId('order-tracking.order-id').textContent();
const orderId = orderIdText?.split(':').pop()?.trim();

// 상태 라벨 확인
await expect(page.getByTestId('order-tracking.status')).toHaveText(/주문 접수|조리 중|배달 중|완료|포장 완료/);

// 타임라인 존재
await expect(page.getByTestId('order-tracking.timeline')).toBeVisible();

// 아이템 최소 1개 확인
await expect(page.getByTestId('order-tracking.item').first()).toBeVisible();

// 완료 상태 전환 후
await expect(page.getByTestId('order-complete.page')).toBeVisible();
await expect(page.getByTestId('order-complete.message')).toBeVisible();
```

## 7. 향후 개선 포인트
- `TimelineItem` 단위에도 세분화된 testId (예: `order-tracking.timeline.step`) 추가 가능성 검토.
- 배달 추적(GPS) 영역 별도 testId (`order-tracking.delivery-tracking`) 추가 (필요 시).
- PriceBreakdown 내부 세부 항목(`subtotal`, `delivery-fee` 등) testId 확장.

## 8. 결론
- OrderTracking 페이지 testId 보강 완료로 텍스트 기반 취약 셀렉터 의존 감소.
- 완료 상태 이전에도 안정적 루트/주문번호/상태/타임라인/아이템/합계 접근 가능.
- E2E 리팩터(Phase 2 후속)에서 `getByTestId()`로 전면 교체 가능 상태 확보.

---
작성자: GitHub Copilot (AI Assistant)
작성일: 2025-11-16
브랜치: feat/fix-first-20251113
관련 문서: `docs/TESTID_STRATEGY_OrderFlow_2025-Phase2.md`
