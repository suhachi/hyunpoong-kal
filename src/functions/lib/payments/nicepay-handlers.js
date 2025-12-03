"use strict";
/**
 * NICEPAY Firebase Functions 핸들러
 *
 * 클라이언트 src/lib/nicepay.ts에서 호출하는 Functions 엔드포인트 구현
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentHandler = createPaymentHandler;
exports.approvePaymentHandler = approvePaymentHandler;
exports.getPaymentResultHandler = getPaymentResultHandler;
exports.cancelPaymentHandler = cancelPaymentHandler;
exports.createOnSitePaymentOrderHandler = createOnSitePaymentOrderHandler;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("../lib/firestore");
// NICEPAY 설정
const NICEPAY_CONFIG = {
    mid: process.env.NICEPAY_MID ?? "NICE_DEV_MID",
    clientKey: process.env.NICEPAY_CLIENT_KEY ?? "NICE_DEV_KEY",
    secretKey: process.env.NICEPAY_SECRET_KEY ?? "NICE_DEV_SECRET",
    apiUrl: process.env.NICEPAY_API_URL ?? "https://sandbox-api.nicepay.co.kr",
};
/**
 * SHA-256 해시 생성 (서버용)
 */
async function generateHash(data) {
    const crypto = await Promise.resolve().then(() => __importStar(require("crypto")));
    return crypto.createHash("sha256").update(data).digest("hex");
}
/**
 * 전문 생성일시 (YYYYMMDDhhmmss)
 */
function getEdiDate() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    return `${yyyy}${mm}${dd}${hh}${mi}${ss}`;
}
/**
 * createPayment 핸들러
 * NICEPAY Auth(결제창 URL) 요청 준비
 */
async function createPaymentHandler(data, context) {
    // 인증 확인
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "로그인이 필요합니다");
    }
    try {
        const { orderId, amount, goodsName } = data;
        console.log("[createPayment] Request:", { orderId, amount, goodsName });
        // Mock 응답 (실제 API 구현 시 교체)
        const ediDate = getEdiDate();
        // Hash generation placeholder usage
        await generateHash(`${NICEPAY_CONFIG.mid}${amount}${orderId}${ediDate}${NICEPAY_CONFIG.secretKey}`);
        // Mock authUrl 및 authToken 생성
        const authToken = `MOCK_TOKEN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const authUrl = `https://sandbox.nicepay.co.kr/demo/auth?orderId=${orderId}&token=${authToken}`;
        // 주문 문서에 결제 정보 저장 (pending 상태)
        await firestore_1.db.collection("orders").doc(orderId).update({
            "payment.authToken": authToken,
            "payment.authUrl": authUrl,
            "payment.status": "pending",
            "payment.requestedAt": admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log("[createPayment] Success:", { authUrl, authToken });
        return {
            authUrl,
            authToken,
        };
    }
    catch (error) {
        console.error("[createPayment] Error:", error);
        const message = error instanceof Error ? error.message : "결제 요청에 실패했습니다";
        throw new functions.https.HttpsError("internal", message);
    }
}
/**
 * approvePayment 핸들러 (멱등성 보장)
 * NICEPAY 승인 API 호출
 *
 * - 이미 승인된 주문은 NICEPAY를 다시 호출하지 않고 기존 결과를 반환한다.
 * - Firestore 트랜잭션을 이용해 동시 승인 요청을 방지한다.
 */
async function approvePaymentHandler(data, context) {
    // 인증 확인
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "로그인이 필요합니다");
    }
    try {
        const { orderId, authToken } = data;
        console.log("[approvePayment] Request:", { orderId, authToken });
        const orderRef = firestore_1.db.collection("orders").doc(orderId);
        // 트랜잭션을 사용한 멱등성 보장
        const result = await firestore_1.db.runTransaction(async (transaction) => {
            const orderDoc = await transaction.get(orderRef);
            if (!orderDoc.exists) {
                throw new functions.https.HttpsError("not-found", "주문을 찾을 수 없습니다");
            }
            const orderData = orderDoc.data();
            if (!orderData) {
                throw new functions.https.HttpsError("internal", "주문 데이터가 없습니다");
            }
            const paymentStatus = orderData.payment?.status;
            const paymentMethod = orderData.payment?.method;
            // 1. 멱등성 체크: 이미 승인된 경우 기존 결과 반환
            if (paymentStatus === "authorized" || paymentStatus === "approved") {
                console.log("[approvePayment] Already approved (idempotent):", orderId);
                return {
                    success: true,
                    orderId,
                    tid: orderData.payment?.tid || "",
                    amount: orderData.payment?.amount || orderData.finalAmount || 0,
                    resultCode: "0000",
                    resultMsg: "이미 승인된 주문입니다",
                    authToken: orderData.payment?.authToken || authToken,
                    cardName: orderData.payment?.cardName,
                    cardNum: orderData.payment?.cardNum,
                };
            }
            // 2. 취소/실패된 주문 체크
            if (paymentStatus === "cancelled" || paymentStatus === "failed") {
                throw new functions.https.HttpsError("failed-precondition", "이미 취소/실패된 주문입니다");
            }
            // 3. APP_CARD 체크
            if (paymentMethod !== "app_card") {
                throw new functions.https.HttpsError("invalid-argument", "앱 결제 방식이 아닙니다");
            }
            const amount = orderData.finalAmount || orderData.amount || 0;
            // Mock 응답 (실제 NICEPAY API 호출 시 교체)
            // TODO: 실제 환경에서는 NICEPAY REST API 호출 로직으로 교체
            const mockResult = {
                success: true,
                orderId,
                tid: `TID_${Date.now()}`,
                amount,
                resultCode: "0000",
                resultMsg: "결제가 완료되었습니다",
                authToken,
                cardName: "신한카드",
                cardNum: "1234-****-****-5678",
            };
            // 4. 주문 상태 업데이트 (트랜잭션 내)
            transaction.update(orderRef, {
                "payment.status": "authorized",
                "payment.tid": mockResult.tid,
                "payment.authToken": authToken,
                "payment.cardName": mockResult.cardName,
                "payment.cardNum": mockResult.cardNum,
                "payment.approvedAt": admin.firestore.FieldValue.serverTimestamp(),
                status: "accepted", // 주문 접수 완료
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            return mockResult;
        });
        console.log("[approvePayment] Success:", result);
        return result;
    }
    catch (error) {
        console.error("[approvePayment] Error:", error);
        // HttpsError는 그대로 전달
        if (error instanceof functions.https.HttpsError)
            throw error;
        const message = error instanceof Error ? error.message : "결제 승인에 실패했습니다";
        throw new functions.https.HttpsError("internal", message);
    }
    // TODO: 서버 측에서 이미 승인된 주문에 대해 중복 approve 요청이 오면 멱등적으로 처리하도록 보완 필요 (✅ 구현 완료)
}
/**
 * getPaymentResult 핸들러
 * NICEPAY 결제 결과 조회
 */
async function getPaymentResultHandler(data, context) {
    // 인증 확인
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "로그인이 필요합니다");
    }
    try {
        const { orderId } = data;
        console.log("[getPaymentResult] Request:", { orderId });
        const orderDoc = await firestore_1.db.collection("orders").doc(orderId).get();
        if (!orderDoc.exists) {
            throw new functions.https.HttpsError("not-found", "주문을 찾을 수 없습니다");
        }
        const orderData = orderDoc.data();
        const payment = orderData?.payment || {};
        // 결제 상태 확인
        if (payment.status === "authorized" || payment.status === "completed") {
            return {
                success: true,
                orderId,
                tid: payment.tid,
                amount: payment.amount || orderData?.finalAmount,
                resultCode: "0000",
                resultMsg: "결제가 완료되었습니다",
                authToken: payment.authToken,
            };
        }
        // 아직 처리 중
        return {
            success: false,
            orderId,
            resultCode: "PENDING",
            resultMsg: "결제 처리 중입니다",
        };
    }
    catch (error) {
        console.error("[getPaymentResult] Error:", error);
        const message = error instanceof Error ? error.message : "결제 결과 조회에 실패했습니다";
        throw new functions.https.HttpsError("internal", message);
    }
}
/**
 * cancelPayment 핸들러
 * NICEPAY 취소 API 호출
 */
async function cancelPaymentHandler(data, context) {
    // 인증 확인
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "로그인이 필요합니다");
    }
    try {
        const { orderId, tid, cancelReason } = data;
        console.log("[cancelPayment] Request:", { orderId, tid, cancelReason });
        // Mock 응답 (실제 API 구현 시 교체)
        const orderDoc = await firestore_1.db.collection("orders").doc(orderId).get();
        if (!orderDoc.exists) {
            throw new functions.https.HttpsError("not-found", "주문을 찾을 수 없습니다");
        }
        const orderData = orderDoc.data();
        const amount = orderData?.payment?.amount || orderData?.finalAmount || 0;
        const mockResult = {
            success: true,
            orderId,
            tid,
            amount,
            resultCode: "0000",
            resultMsg: "결제가 취소되었습니다",
        };
        // 주문 상태 업데이트
        await firestore_1.db
            .collection("orders")
            .doc(orderId)
            .update({
            "payment.status": "cancelled",
            "payment.cancelledAt": admin.firestore.FieldValue.serverTimestamp(),
            "payment.cancelReason": cancelReason || "사용자 취소",
            status: "cancelled",
        });
        console.log("[cancelPayment] Success:", mockResult);
        return mockResult;
    }
    catch (error) {
        console.error("[cancelPayment] Error:", error);
        const message = error instanceof Error ? error.message : "결제 취소에 실패했습니다";
        throw new functions.https.HttpsError("internal", message);
    }
}
/**
 * createOnSitePaymentOrder 핸들러
 * 만나서 결제용 주문 생성
 */
async function createOnSitePaymentOrderHandler(data, context) {
    // 인증 확인
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "로그인이 필요합니다");
    }
    try {
        const { orderId, amount, goodsName, buyerName, buyerTel, buyerEmail } = data;
        console.log("[createOnSitePaymentOrder] Request:", { orderId, amount, goodsName });
        // 주문 문서 생성 또는 업데이트 (pending 상태)
        const orderRef = firestore_1.db.collection("orders").doc(orderId);
        const orderDoc = await orderRef.get();
        if (!orderDoc.exists) {
            // 새 주문 생성
            await orderRef.set({
                orderId,
                userId: context.auth.uid,
                finalAmount: amount,
                status: "pending",
                payment: {
                    method: "meet_card",
                    status: "pending",
                    amount,
                },
                customerInfo: {
                    name: buyerName,
                    phone: buyerTel,
                    email: buyerEmail,
                },
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        else {
            // 기존 주문 업데이트
            await orderRef.update({
                "payment.method": "meet_card",
                "payment.status": "pending",
                "payment.amount": amount,
                status: "pending",
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        console.log("[createOnSitePaymentOrder] Success:", { orderId });
        return { orderId };
    }
    catch (error) {
        console.error("[createOnSitePaymentOrder] Error:", error);
        const message = error instanceof Error ? error.message : "주문 생성에 실패했습니다";
        throw new functions.https.HttpsError("internal", message);
    }
}
