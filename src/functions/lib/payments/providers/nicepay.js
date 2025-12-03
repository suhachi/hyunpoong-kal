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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nicepayProvider = exports.NicePayProvider = void 0;
const crypto = __importStar(require("crypto"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const payment_provider_1 = require("../../config/payment-provider");
/**
 * NICEPAY Provider (Mock/Sandbox/Live 통합)
 *
 * 모드별 동작:
 * - mock: 더미 응답 반환 (E2E/테스트용)
 * - nicepay_sandbox: NICEPAY 샌드박스 API 호출
 * - nicepay_live: NICEPAY 운영 API 호출
 */
class NicePayProvider {
    constructor() {
        this.mode = (0, payment_provider_1.getPaymentProviderMode)();
        this.config = (0, payment_provider_1.getNicepayEnvConfig)(this.mode);
        console.log(`[NicePayProvider] Initialized in ${this.mode} mode`);
    }
    /**
     * SHA-256 해시 생성 (전자서명용)
     */
    generateHash(data) {
        return crypto.createHash("sha256").update(data).digest("hex");
    }
    /**
     * 전문 생성일시 (YYYYMMDDhhmmss)
     */
    getEdiDate() {
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
     * Basic Auth 헤더 생성
     */
    getBasicAuthHeader() {
        return "Basic " + Buffer.from(`${this.config.mid}:${this.config.merchantKey}`).toString("base64");
    }
    async initPayment(payload) {
        console.log(`[NicePay.${this.mode}] initPayment:`, { orderId: payload.orderId, amount: payload.amount });
        if (this.mode === "mock") {
            return this.initPaymentMock(payload);
        }
        return this.initPaymentReal(payload);
    }
    /**
     * Mock: 결제 초기화 (테스트용)
     */
    initPaymentMock(payload) {
        const pgOrderId = `MOCK_OID_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const redirectUrl = `${payload.returnUrl}?orderId=${payload.orderId}&pgOrderId=${pgOrderId}&authToken=mock_token`;
        return {
            redirectUrl,
            pgOrderId,
            paymentData: {
                mockMode: true,
            },
        };
    }
    /**
     * Real: 실제 NICEPAY 결제 초기화 (샌드박스/운영)
     *
     * NICEPAY 결제창 호출 방식:
     * 1. 서버에서 SignData 생성 (전자서명)
     * 2. 결제 인증 요청 API 호출
     * 3. 반환된 authUrl을 프론트에 전달
     */
    async initPaymentReal(payload) {
        try {
            const ediDate = this.getEdiDate();
            // NICEPAY SignData 생성 (MID + orderId + amount + ediDate + merchantKey)
            const signDataRaw = `${this.config.mid}${payload.orderId}${payload.amount}${ediDate}${this.config.merchantKey}`;
            const signData = this.generateHash(signDataRaw);
            // NICEPAY 인증 요청 파라미터
            const requestBody = {
                MID: this.config.mid,
                Moid: payload.orderId,
                Amt: payload.amount.toString(),
                GoodsName: payload.goodsName,
                BuyerName: payload.buyerName || "고객",
                BuyerTel: payload.buyerTel || "",
                BuyerEmail: payload.buyerEmail || "",
                ReturnURL: payload.returnUrl,
                CancelURL: payload.cancelUrl || payload.returnUrl,
                EdiDate: ediDate,
                SignData: signData,
            };
            console.log("[NicePay] 결제 초기화 요청:", { MID: this.config.mid, Moid: payload.orderId, Amt: payload.amount });
            // NICEPAY REST API 호출
            const response = await (0, node_fetch_1.default)(`${this.config.baseUrl}/payments/auth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.getBasicAuthHeader(),
                },
                body: JSON.stringify(requestBody),
            });
            const result = await response.json();
            if (!response.ok || result.ResultCode !== "0000") {
                console.error("[NicePay] 결제 초기화 실패:", result);
                throw new Error(result.ResultMsg || "NICEPAY 인증 요청 실패");
            }
            console.log("[NicePay] 결제 초기화 성공:", { authToken: result.AuthToken?.substring(0, 10) + "..." });
            return {
                redirectUrl: result.AuthUrl || result.PaymentUrl,
                pgOrderId: payload.orderId,
                paymentData: {
                    authToken: result.AuthToken,
                    ediDate,
                },
            };
        }
        catch (error) {
            console.error("[NicePay] initPaymentReal 에러:", { error: error.message, orderId: payload.orderId });
            throw new Error(`NICEPAY 결제 초기화 실패: ${error.message}`);
        }
    }
    async confirmPayment(payload) {
        console.log(`[NicePay.${this.mode}] confirmPayment:`, { orderId: payload.orderId });
        if (this.mode === "mock") {
            return this.confirmPaymentMock(payload);
        }
        return this.confirmPaymentReal(payload);
    }
    /**
     * Mock: 결제 승인 (테스트용)
     */
    confirmPaymentMock(payload) {
        return {
            success: true,
            approvedAt: new Date().toISOString(),
            approvedAmount: payload.amount || 0,
            pgOrderId: payload.pgOrderId || `MOCK_OID_${Date.now()}`,
            pgTid: `MOCK_TID_${Date.now()}`,
            pgReceiptUrl: "https://mock.pg.com/receipt/12345",
            cardName: "현풍카드",
            cardNum: "1234-****-****-5678",
        };
    }
    /**
     * Real: 실제 NICEPAY 결제 승인 (샌드박스/운영)
     *
     * NICEPAY 승인 프로세스:
     * 1. AuthToken을 사용하여 승인 요청
     * 2. 카드사 승인 결과 수신
     * 3. TID(거래 고유번호) 및 영수증 URL 반환
     */
    async confirmPaymentReal(payload) {
        try {
            const ediDate = this.getEdiDate();
            const { orderId, pgToken, amount } = payload;
            if (!pgToken && !orderId) {
                throw new Error("pgToken 또는 orderId가 필요합니다");
            }
            // NICEPAY SignData 생성 (승인용)
            const signDataRaw = `${this.config.mid}${orderId}${amount}${ediDate}${this.config.merchantKey}`;
            const signData = this.generateHash(signDataRaw);
            // NICEPAY 승인 요청 파라미터
            const requestBody = {
                MID: this.config.mid,
                TID: pgToken, // 인증 결과로 받은 TID
                Moid: orderId,
                Amt: amount?.toString() || "0",
                EdiDate: ediDate,
                SignData: signData,
            };
            console.log("[NicePay] 결제 승인 요청:", { MID: this.config.mid, TID: pgToken?.substring(0, 10) + "..." });
            // NICEPAY REST API 호출
            const response = await (0, node_fetch_1.default)(`${this.config.baseUrl}/payments/approve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.getBasicAuthHeader(),
                },
                body: JSON.stringify(requestBody),
                timeout: 30000, // 30초 타임아웃
            });
            const result = await response.json();
            // 성공 여부 체크
            if (response.ok && result.ResultCode === "0000") {
                console.log("[NicePay] 결제 승인 성공:", { TID: result.TID });
                return {
                    success: true,
                    approvedAt: new Date().toISOString(),
                    approvedAmount: parseInt(result.Amt || "0"),
                    pgOrderId: result.Moid || orderId,
                    pgTid: result.TID,
                    pgReceiptUrl: result.ReceiptUrl || `https://npg.nicepay.co.kr/issue/IssueLoader.do?TID=${result.TID}`,
                    cardName: result.CardName || result.CardCode,
                    cardNum: result.CardNo || result.CardNum,
                };
            }
            else {
                // 승인 실패
                console.error("[NicePay] 결제 승인 실패:", result);
                return {
                    success: false,
                    failCode: result.ResultCode || "UNKNOWN",
                    failReason: result.ResultMsg || "결제 승인에 실패했습니다",
                };
            }
        }
        catch (error) {
            console.error("[NicePay] confirmPaymentReal 에러:", { error: error.message, orderId: payload.orderId });
            return {
                success: false,
                failCode: "NETWORK_ERROR",
                failReason: `네트워크 오류: ${error.message}`,
            };
        }
    }
    async cancelPayment(payload) {
        console.log(`[NicePay.${this.mode}] cancelPayment:`, { tid: payload.tid });
        if (this.mode === "mock") {
            return this.cancelPaymentMock(payload);
        }
        return this.cancelPaymentReal(payload);
    }
    /**
     * Mock: 결제 취소 (테스트용)
     */
    cancelPaymentMock(payload) {
        return {
            success: true,
            pgTid: payload.tid,
            approvedAmount: payload.amount,
            approvedAt: new Date().toISOString(),
        };
    }
    /**
     * Real: 실제 NICEPAY 결제 취소 (샌드박스/운영)
     *
     * NICEPAY 취소 프로세스:
     * 1. TID(거래번호)와 취소 사유 전송
     * 2. 부분 취소 또는 전액 취소 처리
     * 3. 취소 결과 TID 반환
     */
    async cancelPaymentReal(payload) {
        try {
            const ediDate = this.getEdiDate();
            const { tid, reason, amount } = payload;
            // NICEPAY SignData 생성 (취소용)
            const signDataRaw = `${this.config.mid}${tid}${amount}${ediDate}${this.config.merchantKey}`;
            const signData = this.generateHash(signDataRaw);
            // NICEPAY 취소 요청 파라미터
            const requestBody = {
                MID: this.config.mid,
                TID: tid,
                CancelAmt: amount.toString(),
                CancelMsg: reason || "관리자 취소",
                PartialCancelCode: "0", // 0: 전액취소, 1: 부분취소
                EdiDate: ediDate,
                SignData: signData,
            };
            console.log("[NicePay] 결제 취소 요청:", { MID: this.config.mid, TID: tid, CancelAmt: amount });
            const response = await (0, node_fetch_1.default)(`${this.config.baseUrl}/payments/cancel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.getBasicAuthHeader(),
                },
                body: JSON.stringify(requestBody),
                timeout: 30000,
            });
            const result = await response.json();
            if (response.ok && result.ResultCode === "0000") {
                console.log("[NicePay] 결제 취소 성공:", { CancelTID: result.CancelTID || result.TID });
                return {
                    success: true,
                    pgTid: result.CancelTID || result.TID || tid,
                    approvedAmount: parseInt(result.CancelAmt || "0"),
                    approvedAt: new Date().toISOString(),
                };
            }
            else {
                console.error("[NicePay] 결제 취소 실패:", result);
                return {
                    success: false,
                    failCode: result.ResultCode || "CANCEL_FAIL",
                    failReason: result.ResultMsg || "결제 취소에 실패했습니다",
                };
            }
        }
        catch (error) {
            console.error("[NicePay] cancelPaymentReal 에러:", { error: error.message, tid: payload.tid });
            return {
                success: false,
                failCode: "NETWORK_ERROR",
                failReason: `네트워크 오류: ${error.message}`,
            };
        }
    }
}
exports.NicePayProvider = NicePayProvider;
// Singleton export
exports.nicepayProvider = new NicePayProvider();
