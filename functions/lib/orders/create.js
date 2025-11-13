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
exports.createOrder = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const auth_1 = require("firebase-admin/auth");
const firestore_1 = require("firebase-admin/firestore");
const cors_1 = require("../utils/cors");
const config_1 = require("../config");
const crypto_1 = require("crypto");
if (!admin.apps.length) {
    admin.initializeApp();
}
exports.createOrder = (0, https_1.onRequest)({ region: config_1.region, cors: false, timeoutSeconds: 20 }, async (req, res) => {
    try {
        if (!(0, cors_1.allowCors)(req, res, config_1.allowedOrigins))
            return;
        if (req.method !== 'POST') {
            res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
            return;
        }
        // Auth: Firebase ID token (Bearer)
        const authHeader = (req.headers.authorization || '').toString();
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;
        if (!token) {
            res.status(401).json({ ok: false, error: 'NO_TOKEN' });
            return;
        }
        const decoded = await (0, auth_1.getAuth)().verifyIdToken(token);
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { storeId, items, amount } = body || {};
        if (!storeId || !Array.isArray(items) || !Number.isFinite(amount)) {
            res.status(400).json({ ok: false, error: 'BAD_REQUEST' });
            return;
        }
        const cleanItems = items.map((it) => ({
            menuId: String(it.menuId),
            name: String(it.name ?? ''),
            quantity: Number(it.quantity ?? 1),
            price: Number(it.price ?? 0),
            options: it.options ?? {},
        }));
        const orderId = `ORD-${(0, crypto_1.randomUUID)()}`;
        const db = (0, firestore_1.getFirestore)();
        const docRef = db.doc(`stores/${storeId}/orders/${orderId}`);
        await docRef.set({
            orderId,
            storeId,
            userId: decoded.uid,
            items: cleanItems,
            amount,
            status: 'confirmed',
            payment: { vendor: 'none', status: 'SKIPPED' },
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
        res.status(200).json({ ok: true, orderId, status: 'confirmed' });
        return;
    }
    catch (e) {
        console.error('[createOrder] error:', e);
        res.status(500).json({ ok: false, error: 'INTERNAL', message: e?.message });
        return;
    }
});
//# sourceMappingURL=create.js.map