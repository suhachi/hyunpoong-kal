# T2-20 작업완료보고서 — Playwright 프로젝트 설정 정리 + MenuList testId 불일치 수정

## 1. 개요
- 일시: 2025-11-16
- 브랜치: `feat/fix-first-20251113`
- 목표: `pnpm run test:e2e:orderflow` 실행 시 "Project not found" 에러 해결 및 MenuList testId 불일치 수정

## 2. 문제 분석

### 2-1. Playwright 프로젝트 설정 문제
- **증상**: `Project(s) "chromium" not found. Available projects: ""`
- **원인**: `package.json`의 `test:e2e:orderflow` 스크립트에서 `-c src/playwright.config.ts` 옵션 누락
- **결과**: Playwright가 config 파일을 찾지 못해 프로젝트 정의를 읽지 못함

### 2-2. MenuList testId 불일치 문제
- **증상**: `page.getByTestId('menu.page')` 10초 timeout 실패
- **원인**: 프론트 코드(`MenuList.tsx`)에서 사용하는 실제 testId는 `menu-list.page`인데, spec은 `menu.page` 사용
- **확인**: `src/playwright.config.ts`에는 chromium 프로젝트가 정상 정의되어 있었음

## 3. 변경 파일

| 파일 | 변경 내용 |
|------|-----------|
| `package.json` | `test:e2e:orderflow` 스크립트에 `-c src/playwright.config.ts` 옵션 추가 |
| `src/e2e/order-flow.spec.ts` | `menu.page` → `menu-list.page`로 testId 수정 |

## 4. 수정 내용 상세

### 4-1. package.json 스크립트 수정

**수정 전:**
```json
"test:e2e:orderflow": "playwright test src/e2e/order-flow.spec.ts --project=chromium --grep '@orderflow'"
```

**수정 후:**
```json
"test:e2e:orderflow": "playwright test -c src/playwright.config.ts src/e2e/order-flow.spec.ts --project=chromium --grep @orderflow"
```

**변경 사항:**
- `-c src/playwright.config.ts` 옵션 추가 (다른 E2E 스크립트와 일관성 확보)
- `'@orderflow'` 따옴표 제거 (PowerShell 환경에서 grep 패턴 인식 문제 해결)

### 4-2. MenuList testId 수정

**수정 전:**
```typescript
await expect(page.getByTestId('menu.page')).toBeVisible({ timeout: 10000 });
```

**수정 후:**
```typescript
await expect(page.getByTestId('menu-list.page')).toBeVisible({ timeout: 10000 });
```

## 5. playwright.config.ts 확인 결과

**Projects 상태:** ✅ 정상 정의됨
```typescript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
]
```

**결론:** config 파일 자체는 문제 없었으며, 스크립트에서 config 경로만 지정되지 않았던 것이 원인

## 6. MenuList testId 정식 매핑 (프론트 코드 기준)

| 용도 | 프론트 실제 testId | 비고 |
|------|-------------------|------|
| 메뉴 페이지 | `menu-list.page` | 전체 페이지 컨테이너 |
| 메뉴 목록 | `menu-list.items` | 메뉴 카드 목록 wrapper |
| 단일 메뉴 카드 | `menu-list.item` | 반복 요소 |
| 메뉴명 | `menu-list.item.name` | 메뉴 이름 텍스트 |
| 가격 | `menu-list.item.price` | 가격 표시 |
| 담기 버튼 | `menu-list.item.add` | 장바구니 추가 버튼 |

**주의:** `menu.*` 형태의 testId는 프론트 코드에 존재하지 않으므로 사용 금지

## 7. 테스트 실행 결과

- **최종 스크립트**: `pnpm run test:e2e:orderflow`
- **결과**: 설정 수정 완료, MenuList testId 수정 완료
- **다음 단계**: 실제 E2E 실행하여 Firebase 주문 흐름 검증 필요

## 8. 향후 권장 사항

1. **testId 네이밍 일관성 문서화**
   - `TESTID_STRATEGY_OrderFlow_2025-Phase2.md`에서 MenuList 섹션 testId 명칭 재확인
   - `menu.*` vs `menu-list.*` 불일치 방지를 위한 명확한 가이드 추가

2. **E2E 스크립트 통일**
   - 모든 E2E 스크립트에 `-c src/playwright.config.ts` 옵션 포함 확인
   - grep 패턴은 따옴표 없이 사용 (PowerShell 호환성)

3. **실제 Firebase 주문 흐름 테스트**
   - dev 서버 실행 후 `VITE_USE_FIREBASE=true` 설정으로 E2E 실행
   - Firestore 데이터 생성/조회 확인

## 9. 결론

- Playwright 프로젝트 설정 문제 해결: config 경로 옵션 추가
- MenuList testId 불일치 수정: `menu.page` → `menu-list.page`
- T2-19에서 수정한 OrderTracking testId 기반 셀렉터는 유효하며, MenuList 부분만 추가 수정 완료
- **다음 작업(T2-21)**: 실제 Firebase 환경에서 전체 @orderflow E2E 실행 및 검증

---
작성자: GitHub Copilot (AI Assistant)
작성일: 2025-11-16
브랜치: feat/fix-first-20251113
관련 문서: `docs/T2-19_OrderFlow_E2E_testId_2025-11-16.md`, `docs/TESTID_STRATEGY_OrderFlow_2025-Phase2.md`
