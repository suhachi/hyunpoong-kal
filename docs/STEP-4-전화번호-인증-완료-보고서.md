# STEP 4: 전화번호 인증 기반 회원가입 완료 보고서

**작성일**: 2025-01-XX  
**프로젝트**: 현풍닭칼국수 PWA (hyunpoong-kal)

---

## ✅ 4-1) AuthContext 구조 확인

### 확인 결과
- ✅ `src/contexts/AuthContext.tsx` - 기본 Auth 구조 존재
- ✅ 이메일/비밀번호 기반 로그인 구현됨
- ✅ Google 로그인 구현됨
- ⚠️ 전화번호 인증 미구현

---

## ✅ 4-2) Phone Auth 유틸 추가

### 생성된 파일
**파일**: `src/lib/auth/phone.ts`

### 주요 함수
1. **`getOrCreateRecaptcha(containerId)`**:
   - reCAPTCHA Verifier 생성 또는 반환
   - invisible 모드 사용

2. **`sendVerificationCode(phoneNumber, containerId)`**:
   - 전화번호 인증 코드 발송
   - 전화번호 자동 정규화 (한국 번호 → +82 형식)
   - 에러 메시지 한글화

3. **`verifyPhoneCode(confirmationResult, code)`**:
   - 인증 코드 확인 및 로그인
   - 세션 만료/코드 만료 처리

4. **`normalizePhoneNumber(phoneNumber)`**:
   - 전화번호 형식 정규화
   - 010 → +8210 자동 변환

5. **`clearRecaptcha()`**:
   - reCAPTCHA 정리

---

## ✅ 4-3) AuthContext에 Phone Auth 함수 추가

### 추가된 함수
**파일**: `src/contexts/AuthContext.tsx`

1. **`signInWithPhone(phoneNumber, code, displayName?)`**:
   - 전화번호로 로그인
   - 기존 사용자면 Firestore에서 정보 조회
   - 신규 사용자면 기본 정보로 생성

2. **`signUpWithPhone(phoneNumber, code, displayName)`**:
   - 전화번호로 회원가입
   - Firestore에 사용자 정보 저장
   - 전화번호 정보 포함

### 인터페이스 업데이트
```typescript
interface AuthContextType {
  // ... 기존 함수들
  signInWithPhone: (phoneNumber: string, code: string, displayName?: string) => Promise<AuthUser>;
  signUpWithPhone: (phoneNumber: string, code: string, displayName: string) => Promise<void>;
}
```

---

## ⚠️ 4-4) Signup/Login UI 연동 (다음 단계)

### 현재 상태
- ✅ Phone Auth 유틸 구현 완료
- ✅ AuthContext에 함수 추가 완료
- ⚠️ **Signup/Login UI에 전화번호 인증 탭 추가 필요**

### 다음 작업 (UI 추가)
1. **Signup.tsx**:
   - "전화번호로 가입" 탭 추가
   - 전화번호 입력 필드
   - 인증번호 발송 버튼
   - 인증번호 입력 필드
   - 이름 입력 필드
   - 가입 완료 버튼

2. **Login.tsx**:
   - "전화번호로 로그인" 탭 추가
   - 전화번호 입력 필드
   - 인증번호 발송 버튼
   - 인증번호 입력 필드
   - 로그인 버튼

3. **reCAPTCHA 컨테이너**:
   - `<div id="recaptcha-container"></div>` 추가

---

## 📋 변경 파일 목록

### 새로 생성된 파일
1. ✅ `src/lib/auth/phone.ts` - Phone Auth 유틸리티

### 수정된 파일
2. ✅ `src/contexts/AuthContext.tsx` - Phone Auth 함수 추가

### 다음 단계 (UI 추가 필요)
3. ⚠️ `src/pages/app/Signup.tsx` - 전화번호 가입 UI 추가
4. ⚠️ `src/pages/app/Login.tsx` - 전화번호 로그인 UI 추가

---

## 🎯 사용 예시

### Signup 컴포넌트에서 사용
```typescript
import { sendVerificationCode, verifyPhoneCode } from '../../lib/auth/phone';
import { useAuth } from '../../contexts/AuthContext';

const [phoneNumber, setPhoneNumber] = useState('');
const [code, setCode] = useState('');
const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

// 인증번호 발송
const handleSendCode = async () => {
  const result = await sendVerificationCode(phoneNumber);
  setConfirmationResult(result);
  toast.success('인증번호가 발송되었습니다');
};

// 인증번호 확인 및 가입
const handleVerifyAndSignup = async () => {
  if (!confirmationResult) return;
  
  await verifyPhoneCode(confirmationResult, code);
  await signUpWithPhone(phoneNumber, code, displayName);
  toast.success('회원가입이 완료되었습니다');
};
```

---

## ⚠️ 주의사항

1. **reCAPTCHA 설정**:
   - Firebase Console에서 reCAPTCHA 설정 필요
   - 도메인 등록 필요

2. **전화번호 형식**:
   - 한국 번호는 자동으로 +82 형식으로 변환
   - 다른 국가 번호는 + 국가코드 형식 필요

3. **Mock 모드**:
   - 현재 Mock 모드에서는 실제 SMS 발송 안 됨
   - Firebase 모드에서만 실제 인증 가능

---

## ✅ STEP 4 완료 (백엔드)

**상태**: ✅ 백엔드 완료, ⚠️ UI 추가 필요  
**다음 단계**: STEP 5 (통합 검증) 또는 Signup/Login UI에 전화번호 인증 탭 추가

---

**보고서 작성자**: AI Assistant  
**최종 업데이트**: 2025-01-XX

