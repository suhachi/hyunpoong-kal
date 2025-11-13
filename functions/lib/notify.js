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
exports.onOrderStatusChange = exports.sendUserPush = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
const admin = __importStar(require("firebase-admin"));
const cors_1 = require("./utils/cors");
const config_1 = require("./config");
if (!admin.apps.length) {
    admin.initializeApp();
}
async function getUserTokens(uid) {
    const snap = await admin
        .firestore()
        .collection('users')
        .doc(uid)
        .collection('fcmTokens')
        .get();
    return snap.docs.map((doc) => doc.id).filter(Boolean);
}
async function pushTo(uid, title, body, data = {}) {
    const tokens = await getUserTokens(uid);
    if (!tokens.length) {
        return { ok: false, reason: 'NO_TOKENS' };
    }
    const response = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title, body },
        data,
    });
    return {
        ok: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
    };
}
exports.sendUserPush = (0, https_1.onRequest)({ region: config_1.region, cors: false }, async (req, res) => {
    if (!(0, cors_1.allowCors)(req, res, config_1.allowedOrigins))
        return;
    if (req.method !== 'POST') {
        res.status(405).json({ ok: false, reason: 'METHOD_NOT_ALLOWED' });
        return;
    }
    const authHeader = (req.headers.authorization || '').toString();
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : '';
    if (!token) {
        res.status(401).json({ ok: false, reason: 'NO_TOKEN' });
        return;
    }
    let decoded;
    try {
        decoded = await admin.auth().verifyIdToken(token);
    }
    catch (error) {
        res.status(401).json({ ok: false, reason: 'INVALID_TOKEN' });
        return;
    }
    const rawBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { title = '테스트 알림', body = '푸시 동작 확인', data = {} } = rawBody || {};
    try {
        const result = await pushTo(decoded.uid, title, body, data);
        res.json(result);
    }
    catch (error) {
        console.error('[sendUserPush] push error', error);
        res.status(500).json({ ok: false, reason: 'INTERNAL_ERROR', message: error?.message });
    }
});
exports.onOrderStatusChange = (0, firestore_1.onDocumentUpdated)({ region: config_1.region, document: 'stores/{storeId}/orders/{orderId}' }, async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    if (!before || !after)
        return;
    if (before.status === after.status)
        return;
    const uid = after.userId;
    if (!uid)
        return;
    const orderId = event.params.orderId;
    const status = after.status;
    const title = `주문 상태: ${status}`;
    const body = `주문번호 ${orderId}가 ${status}로 변경되었습니다.`;
    try {
        await pushTo(uid, title, body, {
            orderId,
            status,
        });
    }
    catch (error) {
        console.error('[onOrderStatusChange] push error', error);
    }
});
//# sourceMappingURL=notify.js.map