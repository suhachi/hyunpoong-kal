import { PaymentProvider } from "./interface";
import { MockPaymentProvider } from "./mock";
import { NicePayProvider } from "./nicepay";

const providers: Record<string, PaymentProvider> = {
  mock: new MockPaymentProvider(),
  nicepay: new NicePayProvider(),
};

export function getPaymentProvider(name?: string): PaymentProvider {
  const providerName = name || process.env.PAYMENT_PROVIDER || "mock";
  const provider = providers[providerName];
  
  if (!provider) {
    console.warn(`Payment provider '${providerName}' not found, falling back to mock.`);
    return providers["mock"];
  }
  
  return provider;
}

