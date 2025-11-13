"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsConfirm = void 0;
const https_1 = require("firebase-functions/v2/https");
const zod_1 = require("zod");
const secrets_1 = require("../lib/secrets");
const cors_1 = require("../lib/cors");
const firestore_1 = require("../lib/firestore");
const REGION = 'asia-northeast3';
class AppError extends Error {
    status;
    code;
    constructor(message, status, code) {
        super(message);
        this.name = 'AppError';
        this.status = status;
        this.code = code;
    }
}
function ok(data) {
    return { ok: true, data };
}
function fail(code, message) {
    return { ok: false, code, message };
}
const ConfirmInput = zod_1.z.object({
    orderId: zod_1.z.string().min(1),
    paymentKey: zod_1.z.string().min(1),
    amount: zod_1.z.number().int().positive(),
});
exports.paymentsConfirm = (0, https_1.onRequest)({ region: REGION, secrets: [secrets_1.TOSS_SECRET_KEY] }, async (req, res) => {
    if (!(0, cors_1.allowCors)(req, res))
        return;
    try {
        if (req.method !== 'POST') {
            throw new AppError('Method Not Allowed', 405, 'METHOD_NOT_ALLOWED');
        }
        const parsed = ConfirmInput.safeParse(req.body ?? {});
        if (!parsed.success) {
            throw new AppError('Invalid input', 422, 'INVALID_INPUT');
        }
        const { orderId, paymentKey, amount } = parsed.data;
        // 멱등 처리: paymentEvents에 존재 시 바로 OK 리턴
        const idemRef = firestore_1.db
            .collection('paymentEvents')
            .where('paymentKey', '==', paymentKey)
            .limit(1);
        const idemSnap = await idemRef.get();
        if (!idemSnap.empty) {
            res.status(200).json(ok({ idempotent: true }));
            return;
        }
        // Mock confirm flow (local testing) — either enabled via env or paymentKey prefix
        const MOCK = process.env.MOCK_PAYMENTS === 'true' || (paymentKey || '').startsWith('pay_mock_');
        let tossJson = null;
        if (MOCK) {
            // Simulate a successful Toss confirm response
            tossJson = { receipt: { url: null }, card: null, method: 'mock', status: 'DONE' };
        }
        else {
            // Toss Confirm API 호출
            const secretKey = secrets_1.TOSS_SECRET_KEY.value();
            if (!secretKey) {
                throw new AppError('Secret not configured', 500, 'SECRET_MISSING');
            }
            const auth = Buffer.from(`${secretKey}:`).toString('base64');
            const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, paymentKey, amount }),
            });
            tossJson = await tossRes.json();
            if (!tossRes.ok) {
                throw new AppError(`PG_CONFIRM_FAILED: ${tossJson?.message ?? tossRes.statusText}`, 400, 'PG_CONFIRM_FAILED');
            }
        }
        // 주문 트랜잭션 업데이트(검증 + 상태 전이)
        await (0, firestore_1.withOrderTx)(orderId, async (ref, snap) => {
            if (!snap.exists) {
                throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
            }
            const data = snap.data();
            const currentStatus = data.status ?? 'pending';
            const expectedAmount = data.amount;
            if (typeof expectedAmount !== 'number' || expectedAmount !== amount) {
                throw new AppError('Amount mismatch', 409, 'AMOUNT_MISMATCH');
            }
            // 허용 전이: pending|paid -> confirmed
            if (!['pending', 'paid'].includes(currentStatus)) {
                throw new AppError(`Invalid status transition from ${currentStatus}`, 409, 'INVALID_STATUS');
            }
            const update = {
                status: 'confirmed',
                confirmedAt: firestore_1.Timestamp.now(),
                payment: {
                    vendor: 'toss',
                    paymentKey,
                    receiptUrl: tossJson?.receipt?.url ?? null,
                    card: tossJson?.card ?? null,
                    method: tossJson?.method ?? null,
                },
                updatedAt: firestore_1.Timestamp.now(),
            };
            // 멱등 트랜잭션 내에서 업데이트
            ref.update(update);
        });
        // 이벤트 로그 기록(멱등 키)
        await firestore_1.db.collection('paymentEvents').add({
            type: 'CONFIRM',
            paymentKey,
            orderId,
            vendor: 'toss',
            raw: { ok: true },
            createdAt: firestore_1.Timestamp.now(),
        });
        res.status(200).json(ok({ orderId, status: 'confirmed' }));
    }
    catch (e) {
        const status = e?.status ?? 400;
        const code = e?.code ?? 'UNKNOWN';
        res.status(status).json(fail(code, e?.message ?? 'Unknown error'));
    }
});
//# sourceMappingURL=confirm.js.map