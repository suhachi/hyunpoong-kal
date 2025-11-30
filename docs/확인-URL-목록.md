# 확인할 URL 목록

**프로젝트**: 현풍닭칼국수 PWA (hyun-poong)  
**작성일**: 2025-01-XX

---

## 🌐 배포된 앱 URL

### 프로덕션
- **고객 앱**: https://hyun-poong.web.app
- **대체 URL**: https://hyun-poong.firebaseapp.com

### 개발/테스트
- **로컬 개발 서버**: http://localhost:5173 (Vite 기본 포트)
- **로컬 미리보기**: `npm run preview` 실행 후 표시되는 URL

---

## 🔧 Firebase Functions 엔드포인트

### NICEPAY 결제 Functions
**리전**: `asia-northeast3` (서울)  
**프로젝트 ID**: `hyun-poong`

1. **createPayment**
   ```
   https://asia-northeast3-hyun-poong.cloudfunctions.net/createPayment
   ```

2. **approvePayment**
   ```
   https://asia-northeast3-hyun-poong.cloudfunctions.net/approvePayment
   ```

3. **getPaymentResult**
   ```
   https://asia-northeast3-hyun-poong.cloudfunctions.net/getPaymentResult
   ```

4. **cancelPayment**
   ```
   https://asia-northeast3-hyun-poong.cloudfunctions.net/cancelPayment
   ```

5. **createOnSitePaymentOrder**
   ```
   https://asia-northeast3-hyun-poong.cloudfunctions.net/createOnSitePaymentOrder
   ```

### 배달대행 Webhook
6. **handleSaenggakdaeroWebhook**
   ```
   https://asia-northeast3-hyun-poong.cloudfunctions.net/handleSaenggakdaeroWebhook
   ```
   - **용도**: '생각대로' 배달대행사에서 주문 상태 변경 시 호출
   - **등록 위치**: 배달대행사 콘솔의 Webhook URL 설정

---

## 📱 주요 페이지 URL

### 고객 앱
- **홈**: https://hyun-poong.web.app/
- **메뉴 목록**: https://hyun-poong.web.app/menu
- **메뉴 상세**: https://hyun-poong.web.app/menu/{menuId}
- **장바구니**: https://hyun-poong.web.app/cart
- **결제**: https://hyun-poong.web.app/checkout
- **주문 내역**: https://hyun-poong.web.app/order-history
- **주문 추적**: https://hyun-poong.web.app/order/{orderId}
- **로그인**: https://hyun-poong.web.app/login
- **회원가입**: https://hyun-poong.web.app/signup

### 관리자 대시보드
- **대시보드**: https://hyun-poong.web.app/admin
- **주문 관리**: https://hyun-poong.web.app/admin/orders
- **메뉴 관리**: https://hyun-poong.web.app/admin/menus
- **설정**: https://hyun-poong.web.app/admin/settings

---

## 🔗 NICEPAY 관련 URL

### 결제 결과 수신 URL
- **Return URL**: `{현재 도메인}/order/return`
  - 예: https://hyun-poong.web.app/order/return
- **Cancel URL**: `{현재 도메인}/order/cancel`
  - 예: https://hyun-poong.web.app/order/cancel

### NICEPAY Sandbox (개발용)
- **API 엔드포인트**: https://sandbox-api.nicepay.co.kr
- **결제창 URL**: https://sandbox.nicepay.co.kr/demo/auth

### NICEPAY Production (운영용)
- **API 엔드포인트**: https://api.nicepay.co.kr
- **결제창 URL**: https://nicepay.co.kr/auth

---

## 🧪 테스트/검증 URL

### 로컬 개발 환경
1. **개발 서버 실행**:
   ```bash
   cd hyunpoong-kal
   npm run dev
   ```
   - 기본 URL: http://localhost:5173

2. **빌드 미리보기**:
   ```bash
   npm run build
   npm run preview
   ```
   - 미리보기 URL은 실행 후 표시됨

### Firebase Functions 로컬 테스트
```bash
cd hyunpoong-kal/src/functions
npm run serve
```
- Functions 로컬 URL: http://localhost:5001/hyun-poong/asia-northeast3/{functionName}

---

## 📋 확인 체크리스트

### Critical 기능 확인
- [ ] **NICEPAY 결제 플로우**
  - Checkout → 앱 카드 결제 선택
  - 결제창 팝업 열림 확인
  - 결제 결과 폴링 확인

- [ ] **메뉴 상세 이동**
  - 홈 → 추천 메뉴 클릭 → 상세 페이지 이동
  - 메뉴 목록 → 메뉴 카드 클릭 → 상세 페이지 이동

- [ ] **Phone Auth**
  - AuthContext에 `sendPhoneVerificationCode`, `verifyAndSignInWithPhone` 메서드 존재 확인
  - (UI는 아직 미구현)

### 배달대행 Webhook 테스트
- [ ] **Webhook 엔드포인트 확인**
  - Postman 등으로 POST 요청 테스트
  - 주문 상태 업데이트 확인

---

## ⚠️ 주의사항

1. **Functions URL**: 실제 배포 후에만 활성화됨
   - 로컬 테스트는 `npm run serve` 사용

2. **NICEPAY URL**: 환경 변수에 따라 Sandbox/Production 자동 전환
   - 개발: Sandbox
   - 프로덕션: Production

3. **Webhook URL**: 배달대행사 콘솔에 등록 필요
   - IP 화이트리스트 설정 권장

---

**최종 업데이트**: 2025-01-XX

