# STEP 3: 배달대행 API Provider ('생각대로') 스켈레톤 완료 보고서

**작성일**: 2025-01-XX  
**프로젝트**: 현풍닭칼국수 PWA (hyunpoong-kal)

---

## ✅ 3-1) Delivery Provider 구조 확인

### 확인 결과
- ✅ `src/lib/delivery/provider.ts` - Provider 레지스트리 존재
- ✅ `src/lib/delivery/providers/mock.ts` - Mock Provider 구현됨
- ✅ `src/lib/delivery/providers/providerA.ts` - Provider A 스켈레톤 존재
- ✅ `src/types/delivery.ts` - 타입 정의 완료

---

## ✅ 3-2) SaenggakdaeroProvider 추가

### 생성된 파일
**파일**: `src/lib/delivery/providers/saenggakdaero.ts`

### 주요 내용
1. **SaenggakdaeroClient 클래스**:
   - API 요청 처리
   - 현재는 Mock 응답 (TODO 주석으로 실제 API 연동 위치 표시)

2. **상태 매핑 함수**:
   ```typescript
   function mapSaenggakdaeroStatus(status: string): DeliveryStatus {
     const statusMap: Record<string, DeliveryStatus> = {
       'REQUESTED': 'assigned',
       'ASSIGNED': 'assigned',
       'PICKED_UP': 'picked_up',
       'IN_TRANSIT': 'delivering',
       'DELIVERED': 'completed',
       'CANCELLED': 'canceled',
     };
     return statusMap[status] || 'assigned';
   }
   ```

3. **DeliveryProvider 구현**:
   - `createTask()` - 배달 태스크 생성
   - `getTask()` - 배달 태스크 조회
   - `cancelTask()` - 배달 태스크 취소

### Provider 레지스트리 등록
**파일**: `src/lib/delivery/provider.ts`

```typescript
const providers: Record<string, DeliveryProvider> = {
  mock: mockDelivery,
  providerA: providerA,
  saenggakdaero: saenggakdaeroProvider, // ✅ 추가됨
};
```

---

## ✅ 3-3) 환경 변수 설정 추가

**파일**: `src/config/env.ts`

```typescript
// '생각대로' 배달대행사 설정
export const SAENGGAKDAERO_CONFIG = {
  apiUrl: getEnv('VITE_SAENGGAKDAERO_API_URL', 'https://api.saenggakdaero.com'),
  apiKey: getEnv('VITE_SAENGGAKDAERO_API_KEY', 'YOUR_API_KEY_HERE'),
  merchantId: getEnv('VITE_SAENGGAKDAERO_MERCHANT_ID', 'YOUR_MERCHANT_ID'),
};
```

### 환경 변수 목록
- `VITE_SAENGGAKDAERO_API_URL` - API 엔드포인트
- `VITE_SAENGGAKDAERO_API_KEY` - API 키
- `VITE_SAENGGAKDAERO_MERCHANT_ID` - 상점 ID

---

## ✅ 3-4) Webhook(Firebase Functions) 스켈레톤

### 생성된 파일
**파일**: `src/functions/src/delivery-webhook-saenggakdaero.ts`

### 주요 기능
1. **Webhook 엔드포인트**: `handleSaenggakdaeroWebhook`
   - POST 요청 처리
   - CORS 설정 포함
   - OPTIONS 요청 처리

2. **주문 상태 업데이트**:
   - `PICKED_UP` / `IN_TRANSIT` → `delivering`
   - `DELIVERED` → `completed`
   - Firestore 주문 문서 업데이트

3. **보안 TODO**:
   - IP 화이트리스트 검증
   - 시그니처 검증 (배달대행사에서 제공하는 경우)

### Functions index.ts에 export 추가
**파일**: `src/functions/src/index.ts`

```typescript
export { handleSaenggakdaeroWebhook } from './delivery-webhook-saenggakdaero';
```

### Webhook URL
배달대행사 콘솔에 등록할 URL:
```
https://{region}-{project-id}.cloudfunctions.net/handleSaenggakdaeroWebhook
```

---

## 📋 변경 파일 목록

### 새로 생성된 파일
1. ✅ `src/lib/delivery/providers/saenggakdaero.ts` - '생각대로' Provider 구현
2. ✅ `src/functions/src/delivery-webhook-saenggakdaero.ts` - Webhook 엔드포인트

### 수정된 파일
3. ✅ `src/lib/delivery/provider.ts` - Provider 레지스트리에 추가
4. ✅ `src/config/env.ts` - '생각대로' 환경 변수 추가
5. ✅ `src/functions/src/index.ts` - Webhook export 추가

---

## 🎯 다음 단계 (실제 연동 시)

### 1. 환경 변수 설정
`.env` 또는 `.env.production` 파일에 실제 값 입력:
```env
VITE_SAENGGAKDAERO_API_URL=https://api.saenggakdaero.com
VITE_SAENGGAKDAERO_API_KEY=실제_API_키
VITE_SAENGGAKDAERO_MERCHANT_ID=실제_상점_ID
VITE_DELIVERY_PROVIDER=saenggakdaero
```

### 2. API 스펙 확인
- '생각대로' 배달대행사에서 제공하는 실제 API 스펙 문서 확인
- `saenggakdaero.ts`의 TODO 주석 부분을 실제 스펙에 맞게 수정

### 3. Webhook 등록
- 배달대행사 콘솔에서 Webhook URL 등록
- IP 화이트리스트 및 시그니처 검증 설정

### 4. 테스트
- Mock 모드로 기본 플로우 테스트
- 실제 API 연동 후 Sandbox 환경에서 테스트
- Webhook 콜백 테스트

---

## ⚠️ 주의사항

1. **현재 상태**: 스켈레톤만 구현됨 (Mock 응답)
2. **실제 연동**: 배달대행 계약 후 API 스펙에 맞춰 수정 필요
3. **보안**: Webhook 엔드포인트에 IP 화이트리스트 및 시그니처 검증 추가 필요

---

## ✅ STEP 3 완료

**상태**: ✅ 완료  
**다음 단계**: STEP 4 (전화번호 인증 기반 회원가입)

---

**보고서 작성자**: AI Assistant  
**최종 업데이트**: 2025-01-XX

