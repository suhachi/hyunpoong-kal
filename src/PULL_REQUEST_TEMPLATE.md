# 🎯 PR 제목

<!-- v1.0.0 — 핵심 기능 구현 완료 (결제/쿠폰/배달비/주문내역/이미지파이프라인/FCM/관제) -->

## 📋 요약

<!-- 이 PR에서 구현한 주요 기능을 간단히 요약해주세요 -->

### 구현된 기능
- [ ] 결제 (NICEPAY) - 승인/망취소/환불
- [ ] 쿠폰 시스템 - 적용/검증
- [ ] 거리기반 배달비 - 구간표/야간비/불가권역
- [ ] 주문 관리 - 내역/상세/재주문
- [ ] 이미지 파이프라인 - WebP/리사이즈/썸네일
- [ ] FCM 푸시 알림 - 주문상태/딥링크/인박스
- [ ] 배달 관제 - Provider API/Webhook/관제 UI

---

## 🔄 변경 사항

### Backend (Firebase)

#### Firestore 스키마
<!-- 새로 추가된 컬렉션이나 필드를 나열해주세요 -->
```
- orders
- deliveryTasks
- deliveryEvents
- notifications
```

#### Cloud Functions
<!-- 새로 추가되거나 수정된 함수를 나열해주세요 -->
```
- functions/payments/
- functions/images/
- functions/delivery/
- functions/notifications/
```

#### Security Rules
<!-- Firestore/Storage Rules 변경사항 -->
```
- [ ] Firestore Rules 업데이트
- [ ] Storage Rules 업데이트
- [ ] HMAC 서명 검증 추가
```

### Frontend

#### 신규 컴포넌트
<!-- 새로 추가된 컴포넌트 목록 -->
```
- [ ] UpsellCard.tsx
- [ ] UpsellSection.tsx
- [ ] CheckoutSummary.tsx
- [ ] InlineError.tsx
- [ ] DeliveryFeeBreakdown.tsx
- [ ] PaymentProgress.tsx
```

#### 페이지 수정
<!-- 수정된 페이지 목록 -->
```
- [ ] Checkout.tsx
- [ ] Cart.tsx
- [ ] OrderHistory.tsx
- [ ] Admin/Delivery.tsx
```

---

## 🧪 테스트

### 스모크 테스트 (6/6)
- [ ] 결제 승인/망취소/환불
- [ ] 쿠폰 최소금액/만료/중복/사용횟수 검증
- [ ] 배달비 산정 (0.9km/2km/4.5km) + 불가권역
- [ ] 재주문 (품절/가격변경 경고)
- [ ] 이미지 업로드 → orig/thumb/resized 생성
- [ ] FCM 수신/딥링크

### 성능 테스트
- [ ] Lighthouse 점수 ≥ 90
- [ ] 번들 사이즈 < 1MB
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s

---

## 📸 스크린샷

<!-- 주요 UI 변경사항을 스크린샷으로 첨부해주세요 -->

### Before
<!-- 변경 전 -->

### After
<!-- 변경 후 -->

---

## 🔐 보안 체크리스트

- [ ] `.env.local` Git 제외 (.gitignore)
- [ ] Functions config 설정 완료
- [ ] API 키 노출 검증
- [ ] Firestore Rules 검토
- [ ] Storage Rules 검토
- [ ] HMAC 서명 검증

---

## 📚 문서

### 작성된 문서
- [ ] 완료 보고서
- [ ] API 문서
- [ ] 배포 가이드
- [ ] 환경 변수 가이드

### 관련 문서 링크
<!-- 관련 문서 링크를 추가해주세요 -->
- `/docs/04-operations/02-v1.0.0-PR-본문.md`
- `/docs/04-operations/03-v1.0.0-릴리즈-노트.md`

---

## 🔗 관련 이슈

<!-- 관련 이슈 번호를 추가해주세요 -->
Closes #
Related to #

---

## ✅ 배포 체크리스트

### 환경 설정
- [ ] `.env.local` 키 전체 입력
- [ ] `functions:config` 설정 완료
- [ ] VAPID 키 설정

### 배포 순서
- [ ] `firebase deploy --only firestore:indexes,firestore:rules,storage`
- [ ] `firebase deploy --only functions`
- [ ] `firebase deploy --only hosting`

### 배포 후 확인
- [ ] 메인 플로우 (장바구니→결제→주문→재주문)
- [ ] 관제 화면 실시간 반영
- [ ] Webhook 서명 검증 OK
- [ ] FCM 수신/딥링크 OK

---

## 👥 리뷰어

@석경선 @배종수

---

## 🏷️ 라벨

<!-- 적절한 라벨을 선택해주세요 -->
- [ ] `feature` - 새로운 기능
- [ ] `bugfix` - 버그 수정
- [ ] `hotfix` - 긴급 수정
- [ ] `refactor` - 리팩토링
- [ ] `docs` - 문서 작업
- [ ] `release` - 릴리즈
- [ ] `qa-check` - QA 필요
- [ ] `ready-to-deploy` - 배포 준비 완료

---

**KS컴퍼니** | 사업자번호: 553-17-00098 | 대표: 석경선/배종수(공동대표)
