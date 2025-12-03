# NICEPAY 샌드박스 실결제 리허설 체크리스트

**문서 버전**: 1.0.0  
**작성일**: 2025-12-03  
**대상 환경**: NICEPAY Sandbox (개발/QA)  
**프로젝트**: 현풍닭칼국수 웹앱 (hyunpoong-kal)

---

## 📋 1. 개요

### 1.1 문서 목적
이 문서는 NICEPAY 샌드박스 환경에서 실제 결제 플로우를 리허설하고 검증하기 위한 체크리스트입니다. QA 담당자가 이 문서를 따라 테스트를 수행하면, NICEPAY 연동이 정상적으로 동작하는지 확인할 수 있습니다.

### 1.2 관련 모듈
- **프론트엔드**: `Checkout.tsx`, `PaymentReturn.tsx`, `PaymentCancel.tsx`, `Cart.tsx`
- **Firebase Functions**: `createPayment`, `approvePayment`, `cancelPayment`
- **Provider**: `NicepayProvider` (Mock/Sandbox/Live 모드 분기)
- **Scheduler**: `cleanupPendingOrders` (30분 이상 PENDING 주문 자동 취소)
- **결제 방식**: `APP_CARD` (NICEPAY PG), `MEET_CARD`, `MEET_CASH` (매장 결제)

---

## 🔧 2. 사전 준비사항

### 2.1 NICEPAY 샌드박스 계정
- [ ] NICEPAY 개발자 센터 가입 완료
- [ ] 샌드박스 MID (가맹점 ID) 발급 완료
- [ ] 샌드박스 Merchant Key 발급 완료
- [ ] 샌드박스 API Base URL 확인 (예: `https://sandbox-api.nicepay.co.kr/v1`)

### 2.2 Functions 환경 변수 설정
다음 환경 변수를 Firebase Functions 또는 `.env` 파일에 설정해야 합니다:

```bash
# Provider 모드
PAYMENT_PROVIDER_MODE=nicepay_sandbox

# NICEPAY 샌드박스 설정
NICEPAY_MID_SANDBOX=***YOUR_SANDBOX_MID***
NICEPAY_MERCHANT_KEY_SANDBOX=***YOUR_SANDBOX_KEY***
NICEPAY_API_BASE_SANDBOX=https://sandbox-api.nicepay.co.kr/v1
```

**⚠️ 주의**: 실제 값은 보안상 코드에 직접 작성하지 말고, 환경 변수로만 관리하세요.

### 2.3 배포 상태 확인
- [ ] Firebase Functions 배포 완료 (`npm run functions:deploy`)
- [ ] 프론트엔드 빌드 & 배포 완료 (`npm run build`)
- [ ] Functions 로그 접근 권한 확보 (Firebase Console)
- [ ] Admin 페이지 접근 권한 확보

### 2.4 테스트 데이터 준비
- [ ] 테스트용 매장 정보 등록 (주소, 영업시간 등)
- [ ] 최소 1개 이상의 메뉴 등록
- [ ] 테스트용 사용자 계정 준비 (전화번호 인증 가능)
- [ ] NICEPAY 샌드박스 테스트 카드번호 확보

---

## ⚙️ 3. 테스트 환경 설정 체크리스트

### 3.1 환경 변수 확인
- [ ] `.env` 또는 Functions config에 샌드박스 값 설정 완료
- [ ] `PAYMENT_PROVIDER_MODE=nicepay_sandbox` 확인
- [ ] `NODE_ENV !== "test"` 상태 확인 (test 모드는 자동으로 mock 사용)
- [ ] Functions 재배포 완료 (환경 변수 변경 시)

### 3.2 브라우저 환경
- [ ] 권장 브라우저: Chrome 최신 버전
- [ ] 브라우저 콘솔 열기 (F12) - 에러 확인용
- [ ] 시크릿/프라이빗 모드 사용 (캐시 영향 제거)
- [ ] 네트워크 탭 활성화 (API 호출 확인용)

### 3.3 접근 URL
- [ ] 프론트엔드 URL 확인 (예: `https://your-app.web.app`)
- [ ] Admin 페이지 URL 확인 (예: `https://your-app.web.app/admin`)
- [ ] Firebase Console URL 확인 (Functions 로그용)

---

## 🧪 4. 테스트 시나리오 목록

| ID | 시나리오 | 우선순위 | 예상 소요 시간 |
|:---|:---|:---:|:---:|
| **S1** | APP_CARD 정상 결제 성공 플로우 | 최상 | 5분 |
| **S2** | 결제창에서 사용자 취소 플로우 | 상 | 3분 |
| **S3** | 결제 실패 (카드 한도/오류) 플로우 | 상 | 3분 |
| **S4** | PaymentReturn 페이지 멱등성 확인 | 중 | 2분 |
| **S5** | PENDING 주문 자동 취소 확인 | 중 | 35분 |
| **S6** | MEET_CARD/MEET_CASH 회귀 테스트 | 중 | 5분 |

**총 시나리오**: 6개  
**총 예상 소요 시간**: 약 53분

---

## 📝 5. 시나리오별 세부 체크리스트

### S1. APP_CARD 정상 결제 성공 플로우

**목적**: NICEPAY 샌드박스를 통한 정상 결제 플로우 검증

#### 테스트 단계
- [ ] **1)** 프론트엔드 메인 페이지 접속
- [ ] **2)** 메뉴 페이지로 이동 (`/menu`)
- [ ] **3)** 메뉴 1개 선택 후 "장바구니 담기" 클릭
- [ ] **4)** 장바구니 페이지로 이동 (`/cart`)
- [ ] **5)** 배달/포장 선택 (배달 선택 시 주소 입력 필수)
- [ ] **6)** 주소검색 버튼 클릭 → 주소 입력 (예: "서울특별시 테스트로 123")
- [ ] **7)** 상세 주소 입력 (예: "테스트빌딩 101호")
- [ ] **8)** "결제하기" 버튼 클릭 → Checkout 페이지 이동
- [ ] **9)** 결제수단에서 **"앱 내 카드결제 (APP_CARD)"** 선택
- [ ] **10)** 필수 정보 확인 (전화번호, 이메일 등)
- [ ] **11)** "주문하기" 버튼 클릭

#### NICEPAY 결제창 확인
- [ ] **12)** NICEPAY 샌드박스 결제창으로 리다이렉트 확인
  - URL에 `nicepay` 또는 `sandbox` 포함 여부 확인
  - NICEPAY 로고 표시 확인
- [ ] **13)** 테스트 카드번호 입력 (NICEPAY 제공 샌드박스 카드)
  - 카드번호: `***` (NICEPAY 문서 참조)
  - 유효기간: `12/25`
  - CVC: `123`
  - 비밀번호 앞 2자리: `00`
- [ ] **14)** "결제하기" 버튼 클릭

#### PaymentReturn 페이지 확인
- [ ] **15)** 결제 완료 후 `/order/return` 페이지로 자동 리다이렉트 확인
- [ ] **16)** 로딩 화면 표시 ("결제 승인 중입니다...")
- [ ] **17)** 성공 화면 표시
  - ✅ 녹색 체크 아이콘
  - "결제 완료!" 문구
  - "주문이 성공적으로 접수되었습니다." 메시지
- [ ] **18)** "주문 상세 보기" 버튼 클릭
- [ ] **19)** `/order/{orderId}` 페이지로 이동 확인
- [ ] **20)** 주문 상세 정보 표시 확인
  - 주문 상태: "접수됨" 또는 "결제 완료"
  - 결제 방법: "앱 내 카드결제"
  - 결제 금액 정확성

#### Admin 페이지 확인
- [ ] **21)** Admin 페이지 로그인 (`/admin`)
- [ ] **22)** 주문 관리 페이지 이동
- [ ] **23)** 방금 생성한 주문 확인
  - 주문 상태: `APPROVED` 또는 `ACCEPTED`
  - 결제 상태: `approved`
  - TID (거래 고유번호) 존재 확인

#### Functions 로그 확인
- [ ] **24)** Firebase Console → Functions → 로그 페이지 이동
- [ ] **25)** `approvePayment` 함수 로그 확인
  - `ResultCode: "0000"` (성공 코드)
  - `ResultMsg: "정상처리"` 또는 유사 메시지
  - TID 값 존재
  - 에러 로그 없음

#### Pass 기준
- ✅ 모든 체크박스 완료
- ✅ 결제 성공 화면 표시
- ✅ 주문 상태 `APPROVED`
- ✅ Functions 로그에서 `ResultCode: "0000"`

---

### S2. 결제창에서 사용자 취소 플로우

**목적**: 사용자가 NICEPAY 결제창에서 취소 시 정상 처리 확인

#### 테스트 단계
- [ ] **1)** S1의 1~11단계 동일하게 진행 (주문하기 버튼까지)
- [ ] **2)** NICEPAY 샌드박스 결제창 표시 확인
- [ ] **3)** 결제창에서 **"취소" 또는 "뒤로가기"** 버튼 클릭

#### PaymentCancel 페이지 확인
- [ ] **4)** `/order/cancel` 페이지로 리다이렉트 확인
- [ ] **5)** 취소 안내 화면 표시
  - ❌ 빨간색 X 아이콘 또는 경고 아이콘
  - "결제를 취소하셨습니다." 문구
- [ ] **6)** "장바구니로 돌아가기" 버튼 존재 확인
- [ ] **7)** "다시 시도" 버튼 존재 확인
- [ ] **8)** "장바구니로 돌아가기" 클릭 → `/cart` 페이지 이동 확인

#### Admin 페이지 확인
- [ ] **9)** Admin 주문 관리 페이지에서 주문 상태 확인
  - 주문 상태: `PENDING` (승인되지 않은 상태)
  - 결제 상태: `pending` 또는 `failed`

#### Functions 로그 확인
- [ ] **10)** `approvePayment` 함수가 호출되지 않았는지 확인
- [ ] **11)** 에러 로그 없음 (취소는 정상 플로우)

#### Pass 기준
- ✅ 취소 안내 페이지 정상 표시
- ✅ 장바구니로 복귀 가능
- ✅ 주문 상태 `PENDING` 유지

---

### S3. 결제 실패 (카드 한도/오류) 플로우

**목적**: NICEPAY에서 결제 실패 시 에러 처리 확인

#### 테스트 단계
- [ ] **1)** S1의 1~11단계 동일하게 진행
- [ ] **2)** NICEPAY 샌드박스 결제창에서 **실패용 테스트 카드** 사용
  - NICEPAY 문서에서 "한도초과" 또는 "오류 발생" 테스트 카드번호 확인
  - 또는 잘못된 카드번호 입력 (예: `0000-0000-0000-0000`)
- [ ] **3)** "결제하기" 버튼 클릭

#### PaymentReturn 페이지 확인 (실패 케이스)
- [ ] **4)** `/order/return` 페이지로 리다이렉트 확인
- [ ] **5)** 실패 화면 표시
  - ❌ 빨간색 X 아이콘
  - "결제 실패" 문구
  - 실패 사유 메시지 (예: "한도초과", "카드 오류")
- [ ] **6)** "장바구니로" 버튼 존재 확인
- [ ] **7)** "다시 시도" 버튼 존재 확인
- [ ] **8)** "다시 시도" 클릭 → `/checkout` 페이지 이동 확인

#### Functions 로그 확인
- [ ] **9)** `approvePayment` 함수 로그 확인
  - `ResultCode: "XXXX"` (0000이 아닌 에러 코드)
  - `ResultMsg: "한도초과"` 또는 유사 에러 메시지
  - `failCode`, `failReason` 필드 존재

#### Pass 기준
- ✅ 실패 화면 정상 표시
- ✅ 에러 메시지 명확히 표시
- ✅ 재시도 가능
- ✅ Functions 로그에서 에러 코드 확인

---

### S4. PaymentReturn 페이지 멱등성 확인

**목적**: 결제 승인 후 페이지 새로고침 시 중복 승인 방지 확인

#### 사전 조건
- [ ] S1 시나리오를 통해 정상 결제 완료된 주문 1건 준비

#### 테스트 단계
- [ ] **1)** S1 완료 후 `/order/return?orderId=***` 페이지에 머물러 있는 상태
- [ ] **2)** 브라우저 **새로고침 (F5)** 실행
- [ ] **3)** 페이지 로딩 확인

#### 멱등성 확인
- [ ] **4)** 성공 화면이 다시 표시되는지 확인
  - "결제 완료!" 문구 유지
  - 에러 메시지 없음
- [ ] **5)** "주문 상세 보기" 버튼 정상 동작 확인

#### Functions 로그 확인
- [ ] **6)** `approvePayment` 함수 로그 확인
  - 첫 번째 호출: `ResultCode: "0000"` (실제 승인)
  - 두 번째 호출 (새로고침): "Already approved (idempotent)" 로그 확인
  - NICEPAY API가 **두 번째는 호출되지 않았는지** 확인

#### Admin 페이지 확인
- [ ] **7)** 주문이 **중복 생성되지 않았는지** 확인
- [ ] **8)** 결제 상태가 여전히 `approved` 1건인지 확인

#### Pass 기준
- ✅ 새로고침 시 에러 없음
- ✅ 중복 승인 API 호출 없음
- ✅ 주문 중복 생성 없음
- ✅ Functions 로그에서 "idempotent" 확인

---

### S5. PENDING 주문 자동 취소 확인

**목적**: `cleanupPendingOrders` Scheduler가 30분 이상 PENDING 주문을 자동 취소하는지 확인

#### 사전 조건
- [ ] `cleanupPendingOrders` Scheduler 배포 완료
- [ ] Scheduler 실행 주기: 10분마다

#### 테스트 단계 (Option A: 시간 대기)
- [ ] **1)** S2 시나리오를 통해 PENDING 상태 주문 생성 (결제 취소)
- [ ] **2)** 주문 생성 시각 기록 (예: 14:00)
- [ ] **3)** Admin 페이지에서 주문 상태 확인: `PENDING`
- [ ] **4)** **30분 대기**
- [ ] **5)** 다음 Scheduler 실행 시각까지 대기 (최대 10분 추가)
- [ ] **6)** Admin 페이지에서 주문 상태 재확인

#### 기대 결과
- [ ] **7)** 주문 상태가 `PENDING` → `CANCELLED`로 변경
- [ ] **8)** 결제 상태가 `pending` → `failed`로 변경
- [ ] **9)** `payment.cancelReason: "payment_timeout"` 확인
- [ ] **10)** `meta.autoCanceledBy: "system"` 확인

#### Functions 로그 확인
- [ ] **11)** `cleanupPendingOrders` 함수 로그 확인
  - "Cleaned up X pending orders" 메시지
  - 취소된 주문 ID 목록
  - 에러 없음

#### 테스트 단계 (Option B: 시간 조작 - 개발 환경만)
**⚠️ 주의**: 이 방법은 개발 환경에서만 사용 가능합니다.

- [ ] **1)** Firestore에서 테스트 주문의 `createdAt` 필드를 **31분 전**으로 수동 변경
- [ ] **2)** Scheduler 수동 실행 또는 다음 실행 시각 대기 (10분 이내)
- [ ] **3)** 주문 상태 재확인

#### Pass 기준
- ✅ 30분 이상 PENDING 주문 자동 취소
- ✅ 상태 변경: `PENDING` → `CANCELLED`
- ✅ `cancelReason: "payment_timeout"`
- ✅ Functions 로그 정상

---

### S6. MEET_CARD/MEET_CASH 회귀 테스트

**목적**: NICEPAY 연동 후에도 매장 결제 방식이 정상 동작하는지 확인 (회귀 방지)

#### S6-1. MEET_CASH 플로우
- [ ] **1)** 메뉴 선택 → 장바구니 담기
- [ ] **2)** 포장 선택 (배달 주소 불필요)
- [ ] **3)** Checkout 페이지 이동
- [ ] **4)** 결제수단에서 **"만나서 현금결제 (MEET_CASH)"** 선택
- [ ] **5)** "주문하기" 버튼 클릭
- [ ] **6)** **NICEPAY 결제창으로 리다이렉트되지 않는지** 확인
- [ ] **7)** 즉시 `/order/{orderId}` 페이지로 이동 확인
- [ ] **8)** 주문 상세 페이지에서 "만나서 결제" 안내 문구 확인
- [ ] **9)** Admin 페이지에서 주문 상태 확인
  - 주문 상태: `PENDING` 또는 `ACCEPTED`
  - 결제 방법: `MEET_CASH`
  - 결제 상태: `pending`

#### S6-2. MEET_CARD 플로우
- [ ] **10)** S6-1과 동일하게 진행하되, 결제수단을 **"만나서 카드결제 (MEET_CARD)"** 선택
- [ ] **11)** NICEPAY 결제창 미표시 확인
- [ ] **12)** 주문 완료 페이지 정상 표시
- [ ] **13)** Admin 페이지에서 결제 방법 `MEET_CARD` 확인

#### Functions 로그 확인
- [ ] **14)** `createPayment`, `approvePayment` 함수가 **호출되지 않았는지** 확인
- [ ] **15)** NICEPAY API 호출 로그 없음

#### Pass 기준
- ✅ MEET_CASH/MEET_CARD 선택 시 PG 미호출
- ✅ 주문 즉시 생성
- ✅ "만나서 결제" 안내 표시
- ✅ Functions 로그에서 NICEPAY 호출 없음

---

## 🐛 6. 오류/이슈 발생 시 기록 템플릿

테스트 중 문제가 발생하면 아래 템플릿을 사용하여 이슈를 기록하세요.

```markdown
### 이슈 #[번호]

**시나리오 ID**: S1 / S2 / S3 / S4 / S5 / S6  
**발생 시각**: 2025-12-03 14:30  
**재현 단계**: S1의 12단계 (NICEPAY 결제창 리다이렉트)

**기대 결과**:
- NICEPAY 샌드박스 결제창으로 리다이렉트

**실제 결과**:
- 404 에러 페이지 표시
- URL: `https://...`

**관련 로그**:
```
[Functions 로그]
Error: NICEPAY API call failed
ResultCode: "9999"
ResultMsg: "시스템 오류"
```

**브라우저 콘솔 에러**:
```
TypeError: Cannot read property 'redirectUrl' of undefined
```

**스크린샷**:
- `/screenshots/issue-001-payment-redirect-error.png`

**우선순위**: 높음 / 중간 / 낮음  
**상태**: 미해결 / 해결 중 / 해결 완료  
**담당자**: [이름]
```

---

## ✅ 7. 최종 완료 조건

모든 테스트가 완료되었다고 판단하려면 다음 조건을 모두 충족해야 합니다:

### 7.1 시나리오 완료
- [ ] **S1**: APP_CARD 정상 결제 성공 - PASS
- [ ] **S2**: 결제창 사용자 취소 - PASS
- [ ] **S3**: 결제 실패 처리 - PASS
- [ ] **S4**: PaymentReturn 멱등성 - PASS
- [ ] **S5**: PENDING 주문 자동 취소 - PASS
- [ ] **S6**: MEET_CARD/MEET_CASH 회귀 - PASS

### 7.2 품질 기준
- [ ] 이상 동작/에러 이슈 **0건** 또는 모두 해결
- [ ] Functions 로그에 비정상 `ResultCode` 없음 (0000 외 에러 코드)
- [ ] 브라우저 콘솔에 치명적 에러 없음
- [ ] Admin 페이지에서 모든 주문 상태 정상 확인

### 7.3 문서화
- [ ] 테스트 결과 요약 문서 작성
- [ ] 발견된 이슈 목록 정리 (있는 경우)
- [ ] 스크린샷/로그 증빙 자료 보관

---

## 📊 8. 테스트 결과 요약 템플릿

테스트 완료 후 아래 템플릿을 작성하여 보고하세요.

```markdown
# NICEPAY 샌드박스 테스트 결과 보고서

**테스트 일시**: 2025-12-03 14:00 ~ 15:00  
**테스터**: [이름]  
**환경**: NICEPAY Sandbox

## 시나리오 결과

| ID | 시나리오 | 결과 | 비고 |
|:---|:---|:---:|:---|
| S1 | APP_CARD 정상 결제 | ✅ PASS | - |
| S2 | 결제창 사용자 취소 | ✅ PASS | - |
| S3 | 결제 실패 처리 | ✅ PASS | - |
| S4 | PaymentReturn 멱등성 | ✅ PASS | - |
| S5 | PENDING 주문 자동 취소 | ✅ PASS | 35분 소요 |
| S6 | MEET_* 회귀 테스트 | ✅ PASS | - |

**총 시나리오**: 6개  
**PASS**: 6개  
**FAIL**: 0개

## 발견된 이슈
- 없음

## 종합 의견
모든 시나리오가 정상적으로 동작하며, NICEPAY 샌드박스 연동이 성공적으로 완료되었습니다. 운영 환경 배포 준비가 완료되었습니다.

## 다음 단계
1. 운영 환경 NICEPAY 계정 발급
2. `PAYMENT_PROVIDER_MODE=nicepay_live` 설정
3. 운영 배포 및 실결제 모니터링
```

---

## 📚 9. 참고 자료

### 9.1 관련 문서
- `ENV_SETUP_GUIDE.md` - 환경 변수 설정 가이드
- `NICEPAY_REAL_API_AUDIT.md` - NICEPAY 실제 API 연동 검수 보고서
- `B_TO_A_GRADE_IMPROVEMENT_REPORT.md` - E2E 테스트 시나리오

### 9.2 NICEPAY 문서
- NICEPAY 개발자 센터: `https://developer.nicepay.co.kr`
- 샌드박스 테스트 카드: NICEPAY 문서 참조
- API 명세서: NICEPAY 제공 문서

### 9.3 Firebase Console
- Functions 로그: `https://console.firebase.google.com/project/[PROJECT_ID]/functions/logs`
- Firestore 데이터: `https://console.firebase.google.com/project/[PROJECT_ID]/firestore`

---

## 📝 10. 체크리스트 요약

**총 시나리오**: 6개 (S1 ~ S6)  
**총 체크 항목**: 약 120개  
**예상 소요 시간**: 약 53분 (S5 포함 시)

**핵심 검증 포인트**:
1. ✅ NICEPAY 샌드박스 결제창 리다이렉트
2. ✅ 결제 승인 성공 처리
3. ✅ 결제 취소/실패 처리
4. ✅ 멱등성 보장 (중복 승인 방지)
5. ✅ PENDING 주문 자동 정리
6. ✅ MEET_* 결제 방식 회귀 방지

**작성자**: Antigravity AI Assistant  
**버전**: 1.0.0  
**최종 수정일**: 2025-12-03
