"use strict";
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
exports.createOnSitePaymentOrder = exports.getPaymentResult = exports.cancelPayment = exports.approvePayment = exports.createPayment = exports.confirmPayment = exports.createPaymentIntent = exports.cleanupPendingOrders = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const providers_1 = require("./payments/providers");
const config_1 = require("./config");
const nicepay_handlers_1 = require("./payments/nicepay-handlers");
// Schedulers
var cleanup_pending_orders_1 = require("./schedulers/cleanup-pending-orders");
Object.defineProperty(exports, "cleanupPendingOrders", { enumerable: true, get: function () { return cleanup_pending_orders_1.cleanupPendingOrders; } });
// Firebase Admin should be initialized in index.ts, but double check here just in case
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
/**
 * 결제 요청 생성 (createPaymentIntent)
 * - 주문 상태 검증
 * - 멱등성 키(clientOrderId) 확인
 * - PG 초기화 요청
 */
exports.createPaymentIntent = functions
    .region(config_1.REGION)
    .runWith(config_1.RUNTIME_OPTS)
    .https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "로그인이 필요합니다");
    }
    const { orderId, amount, clientOrderId, method } = data;
    const providerName = process.env.VITE_PAYMENT_PROVIDER || "nicepay"; // or from data
    console.log(`[Payment] createPaymentIntent: ${orderId}, ${method}, ${providerName}`);
    try {
        // 1. 주문 조회 및 검증
        const orderRef = db.collection("orders").doc(orderId);
        const orderDoc = await orderRef.get();
        if (!orderDoc.exists) {
            throw new functions.https.HttpsError("not-found", "주문을 찾을 수 없습니다");
        }
        const order = orderDoc.data();
        // 본인 주문 확인
        if (order?.userId !== context.auth.uid) {
            throw new functions.https.HttpsError("permission-denied", "권한이 없습니다");
        }
        // 이미 결제된 주문인지 확인
        if (order?.status === "paid" || order?.payment?.status === "paid") {
            throw new functions.https.HttpsError("failed-precondition", "이미 결제된 주문입니다");
        }
        // 금액 검증
        if (order?.finalAmount !== amount) {
            throw new functions.https.HttpsError("invalid-argument", "결제 금액이 일치하지 않습니다");
        }
        // 2. Payment Provider Init
        const provider = (0, providers_1.getPaymentProvider)(providerName);
        const initResult = await provider.initPayment(data);
        // 3. 주문에 결제 시도 정보 업데이트 (PENDING)
        await orderRef.update({
            "payment.method": method,
            "payment.status": "pending",
            "payment.pgProvider": providerName,
            "payment.pgOrderId": initResult.pgOrderId,
            "clientOrderId": clientOrderId,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return initResult;
    }
    catch (error) {
        console.error("[Payment] Init Error:", error);
        throw new functions.https.HttpsError("internal", error.message || "결제 초기화 실패");
    }
});
/**
 * 결제 승인/검증 (confirmPayment)
 * - PG 승인 결과 검증
 * - 주문 상태 업데이트 (Transaction)
 */
exports.confirmPayment = functions
    .region(config_1.REGION)
    .runWith(config_1.RUNTIME_OPTS)
    .https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "로그인이 필요합니다");
    }
    const { orderId, pgToken, pgOrderId } = data;
    console.log(`[Payment] confirmPayment: ${orderId}, ${pgOrderId}`);
    try {
        // 1. 주문 조회
        const orderRef = db.collection("orders").doc(orderId);
        // Transaction 사용
        await db.runTransaction(async (t) => {
            const orderDoc = await t.get(orderRef);
            if (!orderDoc.exists)
                throw new functions.https.HttpsError("not-found", "주문 없음");
            const order = orderDoc.data();
            if (order?.payment?.status === "paid") {
                // 이미 처리됨 (멱등성)
                return { success: true, message: "Already paid" };
            }
            // 2. Payment Provider Confirm
            const providerName = order?.payment?.pgProvider || "mock";
            const provider = (0, providers_1.getPaymentProvider)(providerName);
            const result = await provider.confirmPayment({
                orderId,
                pgOrderId,
                pgToken,
                amount: order?.finalAmount // 검증용
            });
            if (result.success) {
                // 3. 성공 시 상태 업데이트
                t.update(orderRef, {
                    "status": "accepted", // 결제 완료 시 '접수됨' 상태로 (정책에 따라 다름)
                    "payment.status": "paid", // or APPROVED
                    "payment.approvedAt": admin.firestore.FieldValue.serverTimestamp(),
                    "payment.pgTid": result.pgTid,
                    "payment.pgReceiptUrl": result.pgReceiptUrl,
                    "payment.cardName": result.cardName,
                    "payment.cardNum": result.cardNum,
                    "updatedAt": admin.firestore.FieldValue.serverTimestamp(),
                });
            }
            else {
                // 4. 실패 시 상태 업데이트
                t.update(orderRef, {
                    "payment.status": "failed",
                    "payment.failReason": result.failReason,
                    "payment.failCode": result.failCode,
                    "payment.failedAt": admin.firestore.FieldValue.serverTimestamp(),
                    "updatedAt": admin.firestore.FieldValue.serverTimestamp(),
                });
                // Transaction 내에서 에러를 던지면 롤백되므로, 여기서는 롤백하지 않고 실패 상태를 기록함.
                // 하지만 클라이언트에게는 에러를 던져야 함.
                throw new functions.https.HttpsError("aborted", result.failReason || "결제 승인 실패");
            }
        });
        return { success: true };
    }
    catch (error) {
        console.error("[Payment] Confirm Error:", error);
        // HttpsError는 그대로 전달
        if (error instanceof functions.https.HttpsError)
            throw error;
        throw new functions.https.HttpsError("internal", error.message || "결제 승인 처리 중 오류");
    }
});
/**
 * 프론트엔드 호환성을 위한 별칭 Export
 * src/lib/nicepay.ts에서 사용하는 함수 이름과 일치
 */
exports.createPayment = functions
    .region(config_1.REGION)
    .runWith(config_1.RUNTIME_OPTS)
    .https.onCall(nicepay_handlers_1.createPaymentHandler);
exports.approvePayment = functions
    .region(config_1.REGION)
    .runWith(config_1.RUNTIME_OPTS)
    .https.onCall(nicepay_handlers_1.approvePaymentHandler);
exports.cancelPayment = functions
    .region(config_1.REGION)
    .runWith(config_1.RUNTIME_OPTS)
    .https.onCall(nicepay_handlers_1.cancelPaymentHandler);
exports.getPaymentResult = functions
    .region(config_1.REGION)
    .runWith(config_1.RUNTIME_OPTS)
    .https.onCall(nicepay_handlers_1.getPaymentResultHandler);
exports.createOnSitePaymentOrder = functions
    .region(config_1.REGION)
    .runWith(config_1.RUNTIME_OPTS)
    .https.onCall(nicepay_handlers_1.createOnSitePaymentOrderHandler);
