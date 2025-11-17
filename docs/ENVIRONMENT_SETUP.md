# 환경설정 가이드 (ENVIRONMENT_SETUP)

## 1. 개요
- 현풍닭칼국수 PWA(hyunpoong-kal)의 환경변수 및 모드 전환 규칙을 정리한 문서입니다.
- 모든 환경변수는 `src/config/env.ts`를 통해서만 접근합니다.
- `import.meta.env`를 페이지/컴포넌트/라이브러리에서 직접 사용하면 안 됩니다.

## 2. 모드 개요 (Mock vs Firebase)
- Mock 모드: 로컬 개발 및 E2E 테스트 기본 모드
- Firebase 모드: 실제 Firebase Auth/Firestore/Storage/Functions 연동 모드
- 전환 플래그: `VITE_USE_FIREBASE` + `USE_FIREBASE` (src/config/env.ts 내부)

## 3. 필수 환경변수 목록
| 키 | 사용 위치 | 용도 요약 |
|---|---|---|
| VITE_USE_FIREBASE | src/config/env.ts | Mock vs Firebase 모드 전환 플래그 |
| VITE_FIREBASE_API_KEY | src/config/env.ts | Firebase API 키 |
| VITE_FIREBASE_AUTH_DOMAIN | src/config/env.ts | Firebase Auth 도메인 |
| VITE_FIREBASE_PROJECT_ID | src/config/env.ts | Firebase 프로젝트 ID |
| VITE_FIREBASE_STORAGE_BUCKET | src/config/env.ts | Firebase 스토리지 버킷 |
| VITE_FIREBASE_MESSAGING_SENDER_ID | src/config/env.ts | Firebase 메시징 Sender ID |
| VITE_FIREBASE_APP_ID | src/config/env.ts | Firebase App ID |
| VITE_FIREBASE_MEASUREMENT_ID | src/config/env.ts | Firebase 측정 ID |
| VITE_FCM_VAPID_KEY | src/lib/fcm.ts 등 | FCM VAPID Key |
| VITE_NICEPAY_MID | src/config/env.ts | NICEPAY MID |
| VITE_NICEPAY_CLIENT_KEY | src/config/env.ts | NICEPAY Client Key |
| VITE_NICEPAY_CLIENT_ID | src/lib/admin/settingsCenter.api.ts | NICEPAY Client ID |
| VITE_NICEPAY_MID_DEV | src/lib/nicepay.ts | NICEPAY 개발 MID |
| VITE_NICEPAY_KEY_DEV | src/lib/nicepay.ts | NICEPAY 개발 Key |
| VITE_NICEPAY_MID_PROD | src/lib/nicepay.ts | NICEPAY 운영 MID |
| VITE_NICEPAY_KEY_PROD | src/lib/nicepay.ts | NICEPAY 운영 Key |
| VITE_PROVIDER_A_API_URL | src/config/env.ts | 배달 Provider A API URL |
| VITE_PROVIDER_A_API_KEY | src/config/env.ts | 배달 Provider A API Key |
| VITE_PROVIDER_A_MERCHANT_ID | src/config/env.ts | 배달 Provider A Merchant ID |
| VITE_DELIVERY_ENABLED | src/config/env.ts | 배달 기능 활성화 플래그 |
| VITE_DELIVERY_PROVIDER | src/config/env.ts | 배달 Provider 종류 |
| VITE_DELIVERY_WEBHOOK_SECRET | src/config/env.ts | 배달 Webhook Secret |
| VITE_SUPPORT_ENABLED | src/config/env.ts | 고객지원 기능 활성화 |
| VITE_POINTS_ENABLED | src/config/env.ts | 포인트 기능 활성화 |
| VITE_POINTS_RATE | src/config/env.ts | 포인트 적립율 |
| VITE_POINTS_MIN_USE | src/config/env.ts | 포인트 최소 사용 금액 |
| VITE_POINTS_EXPIRE_DAYS | src/config/env.ts | 포인트 만료일 |
| VITE_KAKAO_MAP_KEY | src/pages/admin/Settings/MapsTab.tsx | Kakao 지도 API Key |
| VITE_GOOGLE_MAPS_API_KEY | src/pages/admin/Settings/MapsTab.tsx | Google 지도 API Key |

## 4. 로컬 개발(.env.local) 설정 예시
### Mock 모드 예시
```
VITE_USE_FIREBASE=false
```
### Firebase 모드 예시
```
VITE_USE_FIREBASE=true
VITE_FIREBASE_API_KEY=실제키
VITE_FIREBASE_AUTH_DOMAIN=실제도메인
...
```

## 5. 스테이징/프로덕션 설정 전략
- `.env.production`, Vercel/Firebase Hosting 환경변수 등 관리 방식 개요
- 운영 환경에서는 실제 발급받은 값으로 교체 필요

## 6. 새 환경변수/플래그 추가 규칙 (Phase2 이후 공통 규칙)
1. src/config/env.ts에 getEnv('VITE_...')로 추가 (직접 import.meta.env 사용 금지)
2. 필요한 곳에서 env.ts에서 export한 상수/객체만 import해서 사용
3. env/.env.local.example에 새 키 추가
4. docs/ENVIRONMENT_SETUP.md의 필수 환경변수 목록 및 예시 설정에 새 키 추가
5. pnpm run build 및 관련 E2E 테스트로 검증

## 7. 릴리즈 전 환경 변수 최종 점검 체크리스트

- [ ] `.env.local` / `.env.production` 에 필수 VITE_ 키가 모두 설정되어 있는지 확인
- [ ] Firebase 프로젝트 ID / API 키 / Auth 도메인이 운영 프로젝트로 지정되어 있는지 확인
- [ ] 테스트용/개발용 키가 운영 환경에 남아있지 않은지 확인
- [ ] 민감 정보(API 키, 비밀번호 등)가 Git 커밋에 포함되지 않았는지 확인
- [ ] functions:config 또는 Secret Manager 에 등록된 값과 ENV가 일치하는지 확인

> ⚠️ 운영 환경에서는 env/.env.local.example 파일을 직접 사용하지 말고, 배포 플랫폼의 환경변수 설정을 사용할 것!

## 7. 트러블슈팅 & 자주 있는 실수
- env 누락/오타로 인한 대표 이슈: 빌드/런타임 에러, 기능 미동작
- 해결 방법: .env 템플릿/가이드 참고, 키/값 오타 확인, env.ts에서 getEnv로만 접근
