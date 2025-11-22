"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsWebhook = void 0;
const https_1 = require("firebase-functions/v2/https");
const cors_js_1 = require("../lib/cors.js");
const firestore_js_1 = require("../lib/firestore.js");
const REGION = 'asia-northeast3';
function ok(data) {
    return { ok: true, data };
}
exports.paymentsWebhook = (0, https_1.onRequest)({ region: REGION }, async (req, res) => {
    if (!(0, cors_js_1.allowCors)(req, res))
        return;
    try {
        // TODO: Toss-Signature 검증 로직 추가
        // const signature = req.headers['toss-signature'];
        // if (!validateSignature(signature, req.body)) {
        //   throw new Error('INVALID_SIGNATURE');
        // }
        const event = req.body;
        const eventType = event?.eventType;
        // 주문 상태 동기화
        if (eventType === 'payment.approved') {
            const orderId = event?.data?.orderId;
            await firestore_js_1.db
                .collection('orders')
                .doc(orderId)
                .update({
                'payment.webhookApproved': true,
                updatedAt: firestore_js_1.Timestamp.now(),
            });
        }
        // 이벤트 로그 기록
        await firestore_js_1.db.collection('webhookEvents').add({
            type: eventType,
            orderId: event?.data?.orderId,
            raw: event,
            createdAt: firestore_js_1.Timestamp.now(),
        });
        res.status(200).json(ok({ received: true }));
    }
    catch (e) {
        res.status(400).json({ ok: false, error: e?.message ?? 'Unknown error' });
    }
});
//# sourceMappingURL=webhook.js.map