"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowCors = allowCors;
const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:5181',
    'https://hyunpoong.firebaseapp.com',
];
function allowCors(req, res) {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.set('Access-Control-Allow-Origin', origin);
        res.set('Vary', 'Origin');
    }
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return false;
    }
    return true;
}
//# sourceMappingURL=cors.js.map