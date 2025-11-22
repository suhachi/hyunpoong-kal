"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timestamp = exports.FieldValue = exports.db = void 0;
exports.withOrderTx = withOrderTx;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
Object.defineProperty(exports, "FieldValue", { enumerable: true, get: function () { return firestore_1.FieldValue; } });
Object.defineProperty(exports, "Timestamp", { enumerable: true, get: function () { return firestore_1.Timestamp; } });
if (!(0, app_1.getApps)().length) {
    (0, app_1.initializeApp)();
}
exports.db = (0, firestore_1.getFirestore)();
async function withOrderTx(orderId, fn) {
    const ref = exports.db.collection('orders').doc(orderId);
    return exports.db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        return fn(ref, snap);
    });
}
//# sourceMappingURL=firestore.js.map