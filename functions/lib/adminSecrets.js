"use strict";
/**
 * Admin Secret Manager
 * Owner 전용: 배달대행사 API 키/웹훅 시크릿을 Google Secret Manager에 저장
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSetCourierSecrets = void 0;
const https_1 = require("firebase-functions/v2/https");
const secret_manager_1 = require("@google-cloud/secret-manager");
const zod_1 = require("zod");
/**
 * 안전 게이트:
 * - Firebase Auth 로그인 필수
 * - 사용자 role이 'owner' 이어야 함
 * - App Check 컨텍스트 필수
 */
const payloadSchema = zod_1.z.object({
    provider: zod_1.z.enum(["mock", "tosspickup", "xyz"]).default("mock"),
    apiKey: zod_1.z.string().min(10, "API Key too short"),
    webhookSecret: zod_1.z.string().min(8, "Webhook secret too short"),
});
const sm = new secret_manager_1.SecretManagerServiceClient();
/**
 * Secret이 없으면 생성하고, 있으면 새 버전 추가
 */
async function upsertSecret(projectId, secretId, value) {
    const parent = `projects/${projectId}`;
    const name = `${parent}/secrets/${secretId}`;
    // 시크릿 존재 확인 → 없으면 생성
    const [exists] = await sm.getSecret({ name }).catch(async () => {
        const [created] = await sm.createSecret({
            parent,
            secretId,
            secret: { replication: { automatic: {} } },
        });
        return [created];
    });
    // 버전 추가
    await sm.addSecretVersion({
        parent: exists.name,
        payload: { data: Buffer.from(value, "utf8") },
    });
}
exports.adminSetCourierSecrets = (0, https_1.onCall)({ region: "asia-northeast3", enforceAppCheck: true }, async (request) => {
    // 인증 확인
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Login required");
    }
    // owner 권한 확인
    const token = request.auth.token;
    if (token.role !== "owner") {
        throw new https_1.HttpsError("permission-denied", "Owner only");
    }
    const { provider, apiKey, webhookSecret } = payloadSchema.parse(request.data);
    const projectId = process.env.GCLOUD_PROJECT;
    // Secret 이름 규칙
    const keyName = `courier_api_key_${provider}`;
    const hookName = `courier_webhook_secret_${provider}`;
    await upsertSecret(projectId, keyName, apiKey);
    await upsertSecret(projectId, hookName, webhookSecret);
    // 민감값 로그 금지
    console.log(`[adminSetCourierSecrets] Saved secrets for provider: ${provider}`);
    return { ok: true, provider };
});
//# sourceMappingURL=adminSecrets.js.map