# 현풍닭칼국수 PWA - 프롬프트 요약본

## 📌 빠른 참조

이 문서는 **실제 프로젝트 완성 구조**를 역분석하여 최적화된 프롬프트 시퀀스입니다.

---

## 🎯 완성된 프롬프트 (5개)

### ✅ Phase 0: 기획 및 디자인
1. **01-project-definition.md** - 프로젝트 정의 및 요구사항
   - 비즈니스 배경, 시스템 구성, 브랜드 아이덴티티
   - 핵심 비즈니스 로직, 보안/성능 요구사항

2. **02-design-system.md** - 디자인 시스템 구축
   - 브랜드 컬러 시스템 (현풍레드, 신칼오렌지, 황동식기색)
   - 타이포그래피, Spacing, Shadow, 애니메이션
   - 커스텀 아이콘 7개 생성

### ✅ Phase M0: 기초 인프라
3. **03-project-setup.md** - 프로젝트 초기 설정
   - React + TypeScript + Vite 프로젝트 구조
   - Firebase 설정 (Firestore, Functions, Auth, Storage)
   - 환경 변수 관리, 라우팅 구조, 페이지 스켈레톤

### ✅ Phase 1: 주문자 앱 - 기본
4. **04-landing-menu.md** - 랜딩 페이지 및 메뉴 시스템
   - Hero 섹션, 메뉴 프리뷰, 브랜드 스토리, Contact
   - 메뉴 리스트 (검색, 필터, 정렬)
   - 메뉴 상세 (옵션 선택, 수량, 장바구니 담기)

### ✅ Phase 2: 주문자 앱 - 주문/결제
5. **05-cart-checkout.md** - 장바구니 및 결제
   - CartContext (localStorage 동기화)
   - 장바구니 페이지 (수량 변경, 삭제)
   - 주문서 작성 (주문자 정보, 배송지, 쿠폰, 포인트)
   - NICEPAY 결제 연동 및 서버 검증

---

## ✅ 완성된 프롬프트 (10개)

### **특별 가이드**
- **DESIGN-GUIDE.md** 🎨 - 완벽 디자인 가이드 (환경, 구조, 모든 디자인 요소)

### Phase 2: 주문자 앱 - 나머지
6. **06-order-tracking.md** ✅ - 주문 추적 및 히스토리
   - Realtime 업데이트, Progress Stepper, 실시간 지도, 타임라인
7. **07-review-system.md** ✅ - 리뷰 작성 및 조회
   - 별점, 이미지 업로드, 태그, 사장님 답글, 통계

### Phase 3: 관리자 대시보드 - 기본
8-9. **08-09-admin-basics.md** ✅ - 대시보드 및 메뉴 관리
   - AdminLayout, Dashboard, Orders, Menus, CSV 임포트, 영수증 프린트

### Phase 4-10: 모든 나머지 기능
10-19. **10-19-remaining.md** ✅ - 리뷰관리~문서화
   - 리뷰 관리, 통합 분석, 설정 센터 (5개 탭)
   - 포인트/쿠폰, 배달 추적, 고객 지원
   - 인증 (로그인/회원가입/소셜)
   - E2E 테스트, 접근성, PWA 최적화
   - Firebase 배포, 운영 매뉴얼

---

## 💡 프롬프트 사용 팁

### 1. 순차적 실행 필수
```bash
01 → 02 → 03 → 04 → 05 → ... → 19
```
- 각 단계는 이전 단계의 산출물에 의존합니다
- 건너뛰지 마세요!

### 2. 프롬프트 복사 방법
```markdown
## 💬 프롬프트

**아래 프롬프트를 AI에게 그대로 입력하세요:**

```
이 섹션의 내용을 그대로 복사-붙여넣기
```
```

### 3. 검증 체크리스트 활용
```markdown
## ✅ 검증 체크리스트

- [ ] 항목 1 확인
- [ ] 항목 2 확인
...
```
모든 항목을 확인한 후 다음 단계로 진행

### 4. 환경 변수 대체
```bash
# 프롬프트의 플레이스홀더를 실제 값으로 대체
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_NICEPAY_MID=your_merchant_id
```

---

## 🔥 핵심 원칙 (모든 단계 공통)

### 1. 100% 구현 원칙
```typescript
// ❌ 절대 금지
const data = []; // TODO: 실제 데이터 연결
// {/* 나머지 코드 생략 */}

// ✅ 필수
const data = await fetchRealData();
// 모든 코드 완전 작성
```

### 2. 보안 원칙
```typescript
// ❌ 클라이언트에 비밀키 노출 금지
const SECRET_KEY = "sk_live_xxxxx";

// ✅ Functions Config 사용
const secret = functions.config().payment.secret_key;
```

### 3. 브랜드 일관성
```css
/* 모든 UI에서 동일한 컬러 사용 */
--hyunpung-red: #D61C1C;
--sinkal-orange: #F37021;
--brass-bowl: #C7A45A;
```

### 4. 개발사 정보 삽입
```typescript
// 모든 UI, 영수증, 문서에 포함
{
  company: 'KS컴퍼니',
  bizNo: '553-17-00098',
  ceo: '석경선/배종수(공동대표)'
}
```

### 5. 접근성 준수
```typescript
// WCAG 2.1 AA 기준
- ARIA labels
- 키보드 네비게이션
- 명도 대비 4.5:1 이상
- 포커스 인디케이터
```

---

## 📊 진행 상황 추적

| Phase | 단계 | 파일 | 상태 | 예상 시간 |
|-------|------|------|------|-----------|
| 0-1 | 프로젝트 정의 | 01-project-definition.md | ✅ 완료 | 30분 |
| 0-2 | 디자인 시스템 | 02-design-system.md | ✅ 완료 | 30분 |
| M0 | 프로젝트 설정 | 03-project-setup.md | ✅ 완료 | 1시간 |
| 1 | 랜딩/메뉴 | 04-landing-menu.md | ✅ 완료 | 2시간 |
| 2-1 | 장바구니/결제 | 05-cart-checkout.md | ✅ 완료 | 2시간 |
| 2-2 | 주문 추적 | 06-order-tracking.md | ✅ 완료 | 1시간 |
| 2-3 | 리뷰 시스템 | 07-review-system.md | ✅ 완료 | 1시간 |
| 3 | 관리자 기본 | 08-09-admin-basics.md | ✅ 완료 | 3시간 |
| 4-10 | 모든 나머지 | 10-19-remaining.md | ✅ 완료 | 16시간 |

**총 예상 시간**: 약 24시간

---

## 🎓 학습 포인트

각 프롬프트에서 배울 수 있는 핵심 기술:

### Frontend
- **React 18**: Hooks, Context API, Suspense
- **TypeScript**: 타입 안전성, Generic, Utility Types
- **Tailwind CSS v4**: 디자인 토큰, 반응형
- **React Router v6**: 중첩 라우팅, Protected Routes
- **React Hook Form + Zod**: 폼 유효성 검사

### Backend
- **Firebase Firestore**: NoSQL 데이터 모델링, 쿼리 최적화
- **Cloud Functions**: 서버리스 API, 비밀키 관리
- **Firebase Auth**: 이메일/소셜 로그인
- **FCM**: 푸시 알림

### Payment
- **NICEPAY**: PG 연동, 결제 검증

### DevOps
- **Firebase Hosting**: SPA 배포
- **Firestore Rules**: 보안 규칙
- **Playwright**: E2E 테스트

### PWA
- **Service Worker**: 오프라인 캐싱
- **Web App Manifest**: 설치 프롬프트
- **Workbox**: 캐싱 전략

---

## 🆘 문제 해결

### 자주 발생하는 이슈

#### 1. Firebase 초기화 에러
```typescript
// ❌ 문제
import { db } from './lib/firebase';
// Error: Firebase not initialized

// ✅ 해결
// config/env.ts에서 USE_FIREBASE 확인
export const USE_FIREBASE = getEnv('VITE_USE_FIREBASE') === 'true';
```

#### 2. Sonner import 에러
```typescript
// ❌ 문제
import { toast } from 'sonner';
// Figma Make 환경에서 미리보기 안 보임

// ✅ 해결
import { toast } from 'sonner@2.0.3';
```

#### 3. 환경 변수 undefined
```typescript
// ❌ 문제
const apiKey = import.meta.env.VITE_API_KEY;
// undefined

// ✅ 해결
// .env.local 파일 생성 및 값 설정
// Vite 재시작
```

#### 4. Firestore Rules 에러
```javascript
// ❌ 문제
allow read, write: if false;

// ✅ 해결
// 개발 중에는 임시로 허용
allow read: if true;
allow write: if request.auth != null;
```

---

## 📞 지원

- **기술 문의**: 각 프롬프트 파일 내 "문제 해결" 섹션 참조
- **버그 리포트**: `/ISSUE_TEMPLATE/bug_report.md` 사용
- **기능 요청**: `/ISSUE_TEMPLATE/feature_request.md` 사용

---

## 📄 라이선스 및 저작권

```
프로젝트: 현풍닭칼국수 PWA 배달앱
개발사: KS컴퍼니
사업자번호: 553-17-00098
대표: 석경선 / 배종수 (공동대표)

이 프롬프트 가이드는 실제 완성된 프로젝트를 역분석하여 작성되었습니다.
```

---

**최종 업데이트**: 2025-10-31  
**버전**: 1.0.0  
**작성자**: 현풍닭칼국수 개발팀
