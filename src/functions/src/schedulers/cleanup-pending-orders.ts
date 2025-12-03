/**
 * PENDING 주문 자동 만료/취소 Scheduler
 * 
 * 목적:
 * - 결제 실패/이탈로 pending 상태로 방치된 APP_CARD 주문을 자동으로 정리
 * - MEET_CARD/MEET_CASH는 자동 취소 대상에서 제외 (매장에서 직접 처리)
 * 
 * 실행 주기: 10분마다
 * 타임존: Asia/Seoul
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { REGION } from "../config";

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// 정책 상수
const PAYMENT_PENDING_TIMEOUT_MINUTES = 30; // 30분 이상 pending이면 자동 취소

/**
 * PENDING 주문 자동 취소 Scheduler
 */
export const cleanupPendingOrders = functions
  .region(REGION)
  .pubsub.schedule("every 10 minutes")
  .timeZone("Asia/Seoul")
  .onRun(async (context) => {
    console.log("[cleanupPendingOrders] Scheduler triggered");

    try {
      // 1) 기준 시각 계산
      const now = new Date();
      const cutoffTime = new Date(now.getTime() - PAYMENT_PENDING_TIMEOUT_MINUTES * 60 * 1000);
      const cutoffTimestamp = admin.firestore.Timestamp.fromDate(cutoffTime);

      console.log(
        `[cleanupPendingOrders] Cutoff time: ${cutoffTime.toISOString()} (${PAYMENT_PENDING_TIMEOUT_MINUTES} minutes ago)`
      );

      // 2) orders 컬렉션에서 조건에 맞는 문서 조회
      // 조건:
      // - status == 'pending'
      // - payment.method == 'app_card'
      // - createdAt <= cutoffTime
      const querySnapshot = await db
        .collection("orders")
        .where("status", "==", "pending")
        .where("payment.method", "==", "app_card")
        .where("createdAt", "<=", cutoffTimestamp)
        .get();

      if (querySnapshot.empty) {
        console.log("[cleanupPendingOrders] No orders to cleanup");
        return null;
      }

      console.log(`[cleanupPendingOrders] Found ${querySnapshot.size} pending orders to cancel`);

      // 3) 각 주문을 'cancelled' 상태로 업데이트
      const batch = db.batch();
      let count = 0;

      for (const doc of querySnapshot.docs) {
        const orderRef = doc.ref;
        batch.update(orderRef, {
          status: "cancelled",
          "payment.status": "failed",
          "payment.cancelReason": "payment_timeout",
          "payment.cancelledAt": admin.firestore.FieldValue.serverTimestamp(),
          "meta.autoCanceledBy": "system",
          "meta.autoCanceledAt": admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        count++;
      }

      await batch.commit();

      console.log(`[cleanupPendingOrders] Successfully canceled ${count} orders`);

      return { success: true, count };
    } catch (error) {
      console.error("[cleanupPendingOrders] Error:", error);
      // Scheduler는 에러를 throw해도 재시도되므로, 로그만 남기고 정상 종료
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  });

