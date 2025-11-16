# ENV Guide — Firebase Order-flow E2E

## 1. 기본 원칙

- `.env.local`
  - 기본값: `VITE_USE_FIREBASE=false`
  - 용도: **일반 로컬 개발 / Mock 주문 흐름 / Phase 1 안정화**

- `.env.local.firebase`
  - 기본값: `VITE_USE_FIREBASE=true`
  - 용도: **Phase 2 — Firebase 기반 주문 흐름 + @orderflow E2E 테스트 실행**
  - 생성 방법: `env/.env.local.firebase.example` 파일을 복사하여 실제 키를 채움

## 2. 파일 생성 방법

```bash
cp env/.env.local.firebase.example .env.local.firebase
# 그 다음 .env.local.firebase 열어서 실제 Firebase 프로젝트 키/설정 입력
```

## 3. 사용 시나리오

### 3.1 Mock 모드로 개발할 때

```bash
# .env.local 에서 VITE_USE_FIREBASE=false 유지
pnpm dev
```

- 주문 데이터: localStorage 기반 Mock 흐름 유지
- 관리자/고객 기본 UI 개발 및 Phase1 회귀 테스트 용이

### 3.2 Firebase Order-flow E2E 테스트할 때

```bash
# .env.local.firebase 생성 및 키 입력 후 활성화 방법 예시
cp env/.env.local.firebase.example .env.local.firebase
# (편의에 따라 .env.local 에 이름 변경하거나 심볼릭 링크 사용)

# Playwright @orderflow 시나리오 실행
pnpm run test:e2e:orderflow
```

- 주문 데이터: Firestore `orders` 컬렉션에 저장
- 실시간 상태: OrderTracking에서 onSnapshot 기반 반영
- 관리자 화면: Firestore 쿼리 기반 주문 조회

### 3.3 env 파일 전환 전략

- 동시에 두 env 파일을 활성화하지 말고, 항상 **현재 모드 하나만** `.env.local` 이름으로 동작하도록 유지
- 전환 방식 예시:
  - 복사: `cp .env.local.firebase .env.local`
  - 링크(Windows 제외): `ln -sf .env.local.firebase .env.local`
  - IDE 환경변수 프로파일 기능 활용

## 4. 주의 사항

- `.env.local`, `.env.local.firebase` 실제 키/시크릿 포함 → Git 커밋 금지 (`.gitignore` 규칙 존재)
- `env/.env.local.firebase.example` 에는 절대 실제 키를 넣지 않는다 (플레이스홀더 유지)
- `VITE_USE_FIREBASE` 플래그 동작:
  - `false` → localStorage/Mock 주문 흐름 (Phase1)
  - `true` → Firestore/Firebase Functions 기반 주문 흐름 (Phase2 실주문 + E2E)
- Payments 관련 설정은 Phase3 실결제 이전까지 sandbox 유지 권장

## 5. 스크립트 활용

`package.json` 에 추가된 E2E 전용 스크립트:

```json
"test:e2e:orderflow": "playwright test src/e2e/order-flow.spec.ts --project=chromium --grep '@orderflow'"
```

실행 전 체크리스트:
1. `.env.local` 이 Firebase 모드(`VITE_USE_FIREBASE=true`)인지 확인
2. Firebase API Key / VAPID Key 등 실제 값 채워졌는지 확인
3. Firestore Rules/Functions 호출 권한 정상인지 확인

실행:
```bash
pnpm run test:e2e:orderflow
```

## 6. FAQ

**Q. 왜 별도 파일 `.env.local.firebase` 를 쓰나요?**
- Mock 모드와 Firebase 모드 간 충돌/혼동을 방지하고, 빠른 전환을 위해 분리

**Q. example 파일에 실제 키를 넣으면 안 되는 이유는?**
- Git 저장소(history)에 시크릿이 남아 보안 위험 발생 → 반드시 플레이스홀더 유지

**Q. OrderTracking에서 `order-complete.*` testId가 안 보입니다.**
- 주문 `status='done'` 상태에서만 렌더링 → 초기 상태는 텍스트 셀렉터로 주문번호 추출

**Q. 관리자 화면에 주문이 늦게 뜹니다.**
- Firestore 쿼리/네트워크 지연 고려 → 테스트에서 timeout을 20초로 확장

## 7. 향후 개선 포인트

- OrderTracking 초기 상태용 testId 추가 (`order-tracking.page`, `order-tracking.order-id` 등)
- Firebase Emulator를 CI 파이프라인에 통합하여 외부 네트워크 의존도 감소
- Payments 실연동(Phase3) 시 환경 변수 세분화 (`VITE_PAY_ENV`, `VITE_PAY_PROVIDER` 등)

---
문서 버전: 2025-11-16 / Phase2-Step2 완료 기준
