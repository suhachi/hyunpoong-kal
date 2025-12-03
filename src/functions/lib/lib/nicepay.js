"use strict";
/**
 * NICEPAY 결제 연동
 * DEV/STG/PRD 환경별 엔드포인트 관리
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
exports.authorizePayment = authorizePayment;
exports.cancelPayment = cancelPayment;
exports.issueCashReceipt = issueCashReceipt;
const functions = __importStar(require("firebase-functions"));
// NICEPAY 환경 설정
const NICEPAY_CONFIG = {
    dev: {
        endpoint: "https://sandbox-api.nicepay.co.kr",
        mid: functions.config().nice?.mid || "NICE_DEV_MID",
        key: functions.config().nice?.key || "NICE_DEV_KEY",
        siteCode: functions.config().nice?.site || "NICE_DEV_SITE_CODE",
    },
    prod: {
        endpoint: "https://api.nicepay.co.kr",
        mid: functions.config().nice?.mid_prod || "",
        key: functions.config().nice?.key_prod || "",
        siteCode: functions.config().nice?.site_prod || "",
    },
};
const ENV = functions.config().app?.env || "dev";
/**
 * 결제 승인
 */
async function authorizePayment(data) {
    const config = NICEPAY_CONFIG[ENV];
    try {
        console.log("NICEPAY authorize request:", {
            mid: config.mid,
            amount: data.amount,
            orderId: data.orderId,
        });
        // Simulated Payment Authorization
        return {
            success: true,
            tid: `TID${Date.now()}`,
            amount: data.amount,
            orderId: data.orderId,
            approvedAt: new Date().toISOString(),
        };
    }
    catch (error) {
        console.error("NICEPAY authorize error:", error);
        throw new Error("결제 승인에 실패했습니다");
    }
}
/**
 * 결제 취소 (망취소)
 */
async function cancelPayment(data) {
    const config = NICEPAY_CONFIG[ENV];
    try {
        console.log("NICEPAY cancel request:", {
            mid: config.mid,
            tid: data.tid,
            reason: data.reason,
        });
        // Simulated Payment Cancellation
        return {
            success: true,
            tid: data.tid,
            canceledAt: new Date().toISOString(),
            reason: data.reason,
        };
    }
    catch (error) {
        console.error("NICEPAY cancel error:", error);
        throw new Error("결제 취소에 실패했습니다");
    }
}
/**
 * 현금영수증 발급
 */
async function issueCashReceipt(data) {
    const config = NICEPAY_CONFIG[ENV];
    try {
        console.log("NICEPAY cash receipt request:", {
            mid: config.mid,
            tid: data.tid,
            phoneOrBizNo: data.phoneOrBizNo,
        });
        // Simulated Cash Receipt Issuance
        return {
            success: true,
            tid: data.tid,
            receiptNo: `CR${Date.now()}`,
            issuedAt: new Date().toISOString(),
        };
    }
    catch (error) {
        console.error("NICEPAY cash receipt error:", error);
        throw new Error("현금영수증 발급에 실패했습니다");
    }
}
