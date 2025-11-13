"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.allowedOrigins = exports.region = void 0;
exports.region = 'asia-northeast3';
exports.allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://hyun-poong.web.app',
    'https://hyun-poong.firebaseapp.com',
];
exports.config = {
    region: 'asia-northeast3',
    cors: {
        origins: ['http://localhost:5181', 'http://localhost:5173'],
    },
};
//# sourceMappingURL=config.js.map