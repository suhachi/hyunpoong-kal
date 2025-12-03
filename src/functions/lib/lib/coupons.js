"use strict";
/**
 * 쿠폰 발급 유틸리티
 * 자동 쿠폰 발급 로직
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
exports.issueCoupon = issueCoupon;
exports.issuePhotoReviewCoupon = issuePhotoReviewCoupon;
exports.issueFirstOrderCoupon = issueFirstOrderCoupon;
exports.issueRepeatOrderCoupon = issueRepeatOrderCoupon;
const admin = __importStar(require("firebase-admin"));
/**
 * 사용자에게 쿠폰 발급
 */
async function issueCoupon(params) {
    const { uid, amount, min, days, type, description } = params;
    const expiresAt = admin.firestore.Timestamp.fromDate(new Date(Date.now() + days * 24 * 60 * 60 * 1000));
    const couponData = {
        userId: uid,
        type,
        amount,
        minOrderAmount: min,
        status: "unused",
        issuedAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt,
        description: description || `${type} 쿠폰`,
    };
    const docRef = await admin.firestore().collection("coupons").add(couponData);
    console.log(`Coupon issued: ${docRef.id} for user ${uid}`);
    return docRef.id;
}
/**
 * 사진 리뷰 쿠폰 발급
 */
async function issuePhotoReviewCoupon(uid) {
    return issueCoupon({
        uid,
        amount: 3000,
        min: 15000,
        days: 30,
        type: "photo_review",
        description: "사진 리뷰 감사 쿠폰",
    });
}
/**
 * 첫 주문 쿠폰 발급
 */
async function issueFirstOrderCoupon(uid) {
    return issueCoupon({
        uid,
        amount: 5000,
        min: 20000,
        days: 7,
        type: "first_order",
        description: "첫 주문 환영 쿠폰",
    });
}
/**
 * 재구매 쿠폰 발급
 */
async function issueRepeatOrderCoupon(uid) {
    return issueCoupon({
        uid,
        amount: 2000,
        min: 10000,
        days: 14,
        type: "repeat_order",
        description: "단골 고객 감사 쿠폰",
    });
}
