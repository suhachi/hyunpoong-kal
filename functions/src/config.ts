/**
 * Cloud Functions 공통 설정
 * v1.0 STEP 6: Functions 기본 셋업
 */

import * as functions from "firebase-functions";

// STEP6 NOTE: functions 섹션 존재, 현재 설정 요약
// - firebase.json에 functions 섹션 추가됨
// - source: "functions", runtime: "nodejs20"

export const REGION = "asia-northeast3"; // 서울 리전

export const RUNTIME_OPTS: functions.RuntimeOptions = {
  region: REGION,
  memory: "256MB",
  timeoutSeconds: 60,
};

export const POINTS_POLICY = {
  ORDER_REWARD_RATE: 0.01, // 예: 결제금액의 1%
  REVIEW_TEXT_BONUS: 100,
  REVIEW_PHOTO_BONUS: 200,
};

export const SCHEDULE_TIMEZONE = "Asia/Seoul";
