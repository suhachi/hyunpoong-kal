import { functions } from "./firebase";
import { httpsCallable } from "firebase/functions";
import { 
  PaymentRequestPayload, 
  PaymentInitResult, 
  PaymentConfirmPayload, 
  PaymentResult 
} from "./payments/provider"; // Assuming we can import types from here or duplicate if needed.
// Actually provider.ts is in src/lib/payments/provider.ts. 
// So we should import from "@/lib/payments/provider" if configured, or relative path.

/**
 * 결제 초기화 (Server Function 호출)
 */
export async function createPaymentIntentClient(payload: PaymentRequestPayload): Promise<PaymentInitResult> {
  try {
    const createPaymentIntent = httpsCallable<PaymentRequestPayload, PaymentInitResult>(functions, "createPaymentIntent");
    const result = await createPaymentIntent(payload);
    return result.data;
  } catch (error: any) {
    console.error("createPaymentIntentClient failed:", error);
    throw new Error(error.message || "결제 초기화 실패");
  }
}

/**
 * 결제 승인/검증 (Server Function 호출)
 */
export async function confirmPaymentClient(payload: PaymentConfirmPayload): Promise<PaymentResult> {
  try {
    const confirmPayment = httpsCallable<PaymentConfirmPayload, PaymentResult>(functions, "confirmPayment");
    const result = await confirmPayment(payload);
    return result.data;
  } catch (error: any) {
    console.error("confirmPaymentClient failed:", error);
    throw new Error(error.message || "결제 승인 실패");
  }
}

