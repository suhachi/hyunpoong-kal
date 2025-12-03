"use strict";
/**
 * Cloud Functions 공통 설정
 * v1.0 STEP 6: Functions 기본 셋업
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCHEDULE_TIMEZONE = exports.POINTS_POLICY = exports.RUNTIME_OPTS = exports.REGION = void 0;
// STEP6 NOTE: functions 섹션 존재, 현재 설정 요약
// - firebase.json에 functions 섹션 추가됨
// - source: "functions", runtime: "nodejs20"
exports.REGION = "asia-northeast3"; // 서울 리전
exports.RUNTIME_OPTS = {
    memory: "256MB",
    timeoutSeconds: 60,
};
exports.POINTS_POLICY = {
    ORDER_REWARD_RATE: 0.01, // 예: 결제금액의 1%
    REVIEW_TEXT_BONUS: 100,
    REVIEW_PHOTO_BONUS: 200,
};
exports.SCHEDULE_TIMEZONE = "Asia/Seoul";
