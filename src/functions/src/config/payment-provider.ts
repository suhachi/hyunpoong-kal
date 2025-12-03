/**
 * Payment Provider 모드 설정
 * 
 * 테스트/개발/운영 환경별로 안전하게 토글 가능
 */

export type PaymentProviderMode = "mock" | "nicepay_sandbox" | "nicepay_live";

/**
 * 현재 Payment Provider 모드 결정
 * 
 * 우선순위:
 * 1. PAYMENT_PROVIDER_MODE 환경 변수
 * 2. NODE_ENV=test면 무조건 mock
 * 3. 기본값: mock (안전한 기본 설정)
 */
export const getPaymentProviderMode = (): PaymentProviderMode => {
  // E2E/Unit 테스트 환경에서는 무조건 mock
  if (process.env.NODE_ENV === "test") {
    return "mock";
  }

  const raw = process.env.PAYMENT_PROVIDER_MODE ?? "mock";
  
  if (raw === "nicepay_sandbox" || raw === "nicepay_live") {
    return raw;
  }
  
  // 기본값: mock (안전한 설정)
  return "mock";
};

/**
 * NICEPAY 환경 설정
 */
export interface NicepayEnvConfig {
  baseUrl: string;
  mid: string;
  merchantKey: string;
  clientKey?: string;
}

/**
 * NICEPAY 환경별 설정 가져오기
 * 
 * @param mode - Provider 모드
 * @returns NICEPAY API 설정
 */
export const getNicepayEnvConfig = (mode: PaymentProviderMode): NicepayEnvConfig => {
  if (mode === "nicepay_live") {
    // 운영 환경
    return {
      baseUrl: process.env.NICEPAY_API_BASE_LIVE || "https://api.nicepay.co.kr/v1",
      mid: process.env.NICEPAY_MID_LIVE || "",
      merchantKey: process.env.NICEPAY_MERCHANT_KEY_LIVE || "",
      clientKey: process.env.NICEPAY_CLIENT_KEY_LIVE || "",
    };
  } else if (mode === "nicepay_sandbox") {
    // 샌드박스 환경
    return {
      baseUrl: process.env.NICEPAY_API_BASE_SANDBOX || "https://sandbox-api.nicepay.co.kr/v1",
      mid: process.env.NICEPAY_MID_SANDBOX || "nicepay00m",
      merchantKey: process.env.NICEPAY_MERCHANT_KEY_SANDBOX || "",
      clientKey: process.env.NICEPAY_CLIENT_KEY_SANDBOX || "",
    };
  } else {
    // Mock 모드 (더미 값)
    return {
      baseUrl: "https://mock-nicepay.local",
      mid: "MOCK_MID",
      merchantKey: "MOCK_KEY",
      clientKey: "MOCK_CLIENT_KEY",
    };
  }
};

/**
 * 환경 변수 검증
 * 
 * 실제 NICEPAY 모드일 때 필수 값이 설정되어 있는지 확인
 */
export const validateNicepayEnv = (mode: PaymentProviderMode): void => {
  if (mode === "mock") {
    return; // Mock 모드는 검증 불필요
  }

  const config = getNicepayEnvConfig(mode);

  if (!config.mid || !config.merchantKey) {
    console.error(`[PaymentProvider] NICEPAY ${mode} 모드이지만 필수 환경 변수가 설정되지 않았습니다.`);
    throw new Error(`NICEPAY ${mode}: MID 또는 MERCHANT_KEY가 설정되지 않았습니다.`);
  }

  console.log(`[PaymentProvider] NICEPAY ${mode} 모드 활성화 (MID: ${config.mid.substring(0, 4)}***)`);
};

