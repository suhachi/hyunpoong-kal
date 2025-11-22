"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowCors = allowCors;
function allowCors(req, res, origins) {
    const origin = (req.headers?.origin || '');
    if (origins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return false;
    }
    return true;
}
//# sourceMappingURL=cors.js.map