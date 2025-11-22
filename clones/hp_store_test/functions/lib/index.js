"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSetCourierSecrets = exports.onOrderStatusChange = exports.sendUserPush = exports.createOrder = exports.paymentsWebhook = exports.paymentsConfirm = exports.aiChat = void 0;
const https_1 = require("firebase-functions/v2/https");
const openai_1 = __importDefault(require("openai"));
// v2: 옵션으로 region/secrets/cors 지정
exports.aiChat = (0, https_1.onRequest)({
    region: "asia-northeast3",
    secrets: ["OPENAI_API_KEY"],
    cors: [
        "http://localhost:5173",
        "https://hyun-poong.web.app",
        "https://hyun-poong.firebaseapp.com",
    ],
}, async (req, res) => {
    try {
        const body = req.body;
        const toMessage = (role, text) => ({
            role,
            content: [{ type: "input_text", text }],
            type: "message",
        });
        const input = body?.messages && Array.isArray(body.messages)
            ? // responses.create 최신 타입: content를 파트 배열로 변환
                body.messages.map((m) => toMessage(m.role, m.content))
            : [toMessage("user", body?.prompt ?? "hello")];
        const client = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
        const r = await client.responses.create({
            model: "gpt-4o-mini",
            input,
        });
        res.json({ output: r.output_text ?? "", id: r.id });
    }
    catch (e) {
        res.status(500).json({ error: e?.message ?? "internal" });
    }
});
var confirm_1 = require("./payments/confirm");
Object.defineProperty(exports, "paymentsConfirm", { enumerable: true, get: function () { return confirm_1.paymentsConfirm; } });
var webhook_1 = require("./payments/webhook");
Object.defineProperty(exports, "paymentsWebhook", { enumerable: true, get: function () { return webhook_1.paymentsWebhook; } });
var create_1 = require("./orders/create");
Object.defineProperty(exports, "createOrder", { enumerable: true, get: function () { return create_1.createOrder; } });
var notify_1 = require("./notify");
Object.defineProperty(exports, "sendUserPush", { enumerable: true, get: function () { return notify_1.sendUserPush; } });
Object.defineProperty(exports, "onOrderStatusChange", { enumerable: true, get: function () { return notify_1.onOrderStatusChange; } });
var adminSecrets_1 = require("./adminSecrets");
Object.defineProperty(exports, "adminSetCourierSecrets", { enumerable: true, get: function () { return adminSecrets_1.adminSetCourierSecrets; } });
//# sourceMappingURL=index.js.map