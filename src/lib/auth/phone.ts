/**
 * Firebase Phone Authentication 유틸리티
 *
 * 전화번호 인증 기반 로그인/회원가입 지원
 */

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";

// ConfirmationResult를 다른 모듈에서 사용할 수 있도록 export
export type { ConfirmationResult };
import { auth } from "../firebase";

let recaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * reCAPTCHA Verifier 생성 또는 반환
 *
 * @param containerId - reCAPTCHA를 렌더링할 컨테이너 ID
 */
export function getOrCreateRecaptcha(
  containerId: string = "recaptcha-container",
): RecaptchaVerifier {
  if (recaptchaVerifier) {
    return recaptchaVerifier;
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      console.log("[Phone Auth] reCAPTCHA verified");
    },
    "expired-callback": () => {
      console.log("[Phone Auth] reCAPTCHA expired");
      recaptchaVerifier = null;
    },
  });

  return recaptchaVerifier;
}

interface AuthError {
  code?: string;
  message?: string;
}

/**
 * 전화번호 인증 코드 발송
 *
 * @param phoneNumber - 전화번호 (예: +821012345678)
 * @param containerId - reCAPTCHA 컨테이너 ID
 * @returns ConfirmationResult
 */
export async function sendVerificationCode(
  phoneNumber: string,
  containerId: string = "recaptcha-container",
): Promise<ConfirmationResult> {
  try {
    const verifier = getOrCreateRecaptcha(containerId);

    // 전화번호 형식 정규화 (한국 번호 자동 변환)
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    console.log("[Phone Auth] Sending verification code to:", normalizedPhone);

    const confirmationResult = await signInWithPhoneNumber(auth, normalizedPhone, verifier);

    console.log("[Phone Auth] Verification code sent successfully");

    return confirmationResult;
  } catch (error) {
    const authError = error as AuthError;
    console.error("[Phone Auth] Failed to send verification code:", error);

    // reCAPTCHA 초기화
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }

    // 에러 메시지 한글화
    if (authError.code === "auth/invalid-phone-number") {
      throw new Error("올바른 전화번호 형식이 아닙니다.");
    } else if (authError.code === "auth/too-many-requests") {
      throw new Error("너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.");
    } else if (authError.code === "auth/captcha-check-failed") {
      throw new Error("reCAPTCHA 검증에 실패했습니다. 페이지를 새로고침해주세요.");
    }

    throw new Error("인증번호 발송에 실패했습니다. 다시 시도해주세요.");
  }
}

/**
 * 인증 코드 확인 및 로그인
 *
 * @param confirmationResult - sendVerificationCode에서 반환된 ConfirmationResult
 * @param code - 사용자가 입력한 인증 코드
 */
export async function verifyPhoneCode(
  confirmationResult: ConfirmationResult,
  code: string,
): Promise<void> {
  try {
    console.log("[Phone Auth] Verifying code...");

    await confirmationResult.confirm(code);

    console.log("[Phone Auth] Phone verification successful");

    // reCAPTCHA 정리
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }
  } catch (error) {
    const authError = error as AuthError;
    console.error("[Phone Auth] Failed to verify code:", error);

    // 에러 메시지 한글화
    if (authError.code === "auth/invalid-verification-code") {
      throw new Error("인증번호가 올바르지 않습니다.");
    } else if (authError.code === "auth/code-expired") {
      throw new Error("인증번호가 만료되었습니다. 다시 발송해주세요.");
    } else if (authError.code === "auth/session-expired") {
      throw new Error("세션이 만료되었습니다. 다시 시도해주세요.");
    }

    throw new Error("인증번호 확인에 실패했습니다. 다시 시도해주세요.");
  }
}

/**
 * 전화번호 형식 정규화
 * 한국 번호는 자동으로 +82 형식으로 변환
 *
 * @param phoneNumber - 입력된 전화번호
 * @returns 정규화된 전화번호 (예: +821012345678)
 */
export function normalizePhoneNumber(phoneNumber: string): string {
  // 공백 및 하이픈 제거
  const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, "");

  // 이미 +82로 시작하면 그대로 반환
  if (cleaned.startsWith("+82")) {
    return cleaned;
  }

  // 010으로 시작하는 한국 번호 변환
  if (cleaned.startsWith("010")) {
    return `+82${cleaned.substring(1)}`;
  }

  // 82로 시작하면 + 추가
  if (cleaned.startsWith("82")) {
    return `+${cleaned}`;
  }

  // 그 외는 그대로 반환 (이미 정규화된 경우)
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
}

/**
 * reCAPTCHA 정리
 */
export function clearRecaptcha(): void {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
}
