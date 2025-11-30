/**
 * 포맷팅 유틸리티
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

/**
 * 가격 포맷팅
 */
export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

/**
 * 전화번호 포맷팅
 * @example formatPhoneNumber('01012345678') => '010-1234-5678'
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return "";

  // 숫자만 추출
  const cleaned = phone.replace(/\D/g, "");

  // 010-1234-5678 형식으로 변환
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }

  // 02-123-4567 형식 (서울)
  if (cleaned.length === 10 && cleaned.startsWith("02")) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
  }

  // 031-123-4567 형식 (지역번호)
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
}

/**
 * 사업자번호 포맷팅
 * @example formatBusinessNumber('5531700098') => '553-17-00098'
 */
export function formatBusinessNumber(number: string): string {
  if (!number) return "";

  const cleaned = number.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
  }

  return number;
}

/**
 * 퍼센트 포맷팅
 * @example formatPercent(0.03) => '3%'
 */
export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(0)}%`;
}

/**
 * 거리 포맷팅
 * @example formatDistance(1500) => '1.5km'
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * 시간 포맷팅 (분)
 * @example formatDuration(90) => '1시간 30분'
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}시간 ${mins}분`;
  }
  if (hours > 0) {
    return `${hours}시간`;
  }
  return `${mins}분`;
}

/**
 * 숫자를 한글로 변환
 * @example formatNumberToKorean(1234) => '1천234'
 */
export function formatNumberToKorean(num: number): string {
  if (num < 10000) {
    return num.toLocaleString("ko-KR");
  }

  const man = Math.floor(num / 10000);
  const rest = num % 10000;

  if (rest === 0) {
    return `${man}만`;
  }

  return `${man}만 ${rest.toLocaleString("ko-KR")}`;
}
