/**
 * Firestore 서버 사이드 헬퍼
 * v1.0 STEP 6: Functions 기본 셋업
 */

import * as admin from "firebase-admin";

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;
export const Timestamp = admin.firestore.Timestamp;
