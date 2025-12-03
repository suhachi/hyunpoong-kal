"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentProvider = getPaymentProvider;
const mock_1 = require("./mock");
const nicepay_1 = require("./nicepay");
const providers = {
    mock: new mock_1.MockPaymentProvider(),
    nicepay: new nicepay_1.NicePayProvider(),
};
function getPaymentProvider(name) {
    const providerName = name || process.env.PAYMENT_PROVIDER || "mock";
    const provider = providers[providerName];
    if (!provider) {
        console.warn(`Payment provider '${providerName}' not found, falling back to mock.`);
        return providers["mock"];
    }
    return provider;
}
