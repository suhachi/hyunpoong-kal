/**
 * 유효성 검증 유틸리티
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { formatPrice } from "./format";

/**
 * 이메일 유효성 검증
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 전화번호 유효성 검증
 */
export function validatePhone(phone: string): boolean {
  // 숫자만 추출
  const cleaned = phone.replace(/\D/g, "");

  // 010-1234-5678 형식 (11자리)
  if (cleaned.length === 11 && cleaned.startsWith("010")) {
    return true;
  }

  // 02-123-4567 형식 (10자리, 서울)
  if (cleaned.length === 10 && cleaned.startsWith("02")) {
    return true;
  }

  // 031-123-4567 형식 (10자리, 지역번호)
  if (cleaned.length === 10) {
    return true;
  }

  return false;
}

/**
 * 사업자번호 유효성 검증
 */
export function validateBusinessNumber(number: string): boolean {
  const cleaned = number.replace(/\D/g, "");

  if (cleaned.length !== 10) {
    return false;
  }

  // 체크섬 검증 (간단한 버전)
  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * weights[i];
  }

  sum += Math.floor((parseInt(cleaned[8]) * 5) / 10);
  const checkDigit = (10 - (sum % 10)) % 10;

  return checkDigit === parseInt(cleaned[9]);
}

/**
 * 비밀번호 강도 검증
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  strength: "weak" | "medium" | "strong";
  message: string;
} {
  if (password.length < 8) {
    return {
      isValid: false,
      strength: "weak",
      message: "비밀번호는 8자 이상이어야 합니다",
    };
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const conditions = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  if (conditions < 2) {
    return {
      isValid: false,
      strength: "weak",
      message: "대소문자, 숫자, 특수문자 중 2가지 이상 포함해야 합니다",
    };
  }

  if (conditions === 2) {
    return {
      isValid: true,
      strength: "medium",
      message: "보통 강도의 비밀번호입니다",
    };
  }

  return {
    isValid: true,
    strength: "strong",
    message: "강력한 비밀번호입니다",
  };
}

/**
 * 주소 유효성 검증
 */
export function validateAddress(address: string): boolean {
  return address.trim().length >= 5;
}

/**
 * 금액 범위 검증
 */
export function validateAmount(
  amount: number,
  min: number,
  max: number,
): {
  isValid: boolean;
  message?: string;
} {
  if (amount < min) {
    return {
      isValid: false,
      message: `최소 금액은 ${formatPrice(min)}입니다`,
    };
  }

  if (amount > max) {
    return {
      isValid: false,
      message: `최대 금액은 ${formatPrice(max)}입니다`,
    };
  }

  return { isValid: true };
}

/**
 * 쿠폰 코드 유효성 검증
 */
export function validateCouponCode(code: string): boolean {
  // 영문 대문자와 숫자로만 구성, 6-12자
  const couponRegex = /^[A-Z0-9]{6,12}$/;
  return couponRegex.test(code);
}

/**
 * 리뷰 내용 유효성 검증
 */
export function validateReviewContent(content: string): {
  isValid: boolean;
  message?: string;
} {
  const trimmed = content.trim();

  if (trimmed.length < 10) {
    return {
      isValid: false,
      message: "리뷰는 최소 10자 이상 작성해주세요",
    };
  }

  if (trimmed.length > 500) {
    return {
      isValid: false,
      message: "리뷰는 최대 500자까지 작성 가능합니다",
    };
  }

  return { isValid: true };
}

/**
 * URL 유효성 검증
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
