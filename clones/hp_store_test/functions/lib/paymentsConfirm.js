"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsConfirm = void 0;
const https_1 = require("firebase-functions/v2/https");
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("./config");
exports.paymentsConfirm = (0, https_1.onRequest)({ region: config_1.config.region, cors: config_1.config.cors.origins }, async (req, res) => {
    try {
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }
        const { paymentKey, orderId, amount } = req.body || {};
        if (!paymentKey || !orderId || !amount) {
            res.status(400).json({ ok: false, error: 'MISSING_FIELDS' });
            return;
        }
        const secret = process.env.TOSS_SECRET_KEY;
        if (!secret) {
            res.status(500).json({ ok: false, error: 'SECRET_NOT_SET' });
            return;
        }
        const r = await (0, node_fetch_1.default)('https://api.tosspayments.com/v1/payments/confirm', {
            method: 'POST',
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${secret}:`).toString('base64'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentKey, orderId, amount }),
        });
        const data = await r.json();
        if (!r.ok) {
            res.status(400).json({ ok: false, step: 'confirm', data });
            return;
        }
        // TODO: 금액/상점 매칭 검증, idempotency, Firestore 트랜잭션 업데이트(orders/{orderId})
        res.status(200).json({ ok: true, data });
    }
    catch (e) {
        res.status(500).json({ ok: false, error: e?.message || 'INTERNAL_ERROR' });
    }
});
//# sourceMappingURL=paymentsConfirm.js.map