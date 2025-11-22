/**
 * Firebase Functions
 * 현풍닭칼국수 PWA 백엔드 트리거 및 스케줄러
 * v1.0 STEP 6~7: Cloud Functions + FCM 트리거 구현
 * 
 * STEP6 NOTE: 현재 export되고 있는 functions 목록 요약
 * - onReviewCreated: 리뷰 생성 트리거 (기존)
 * - onReviewReportCreated: 리뷰 신고 트리거 (기존)
 * - onOrderUpdated: 주문 상태 변경 트리거 (기존, orders/{orderId} 구조)
 * - scheduledCouponExpiration: 쿠폰 만료 스케줄러 (기존)
 * - weeklyReport: 주간 리포트 스케줄러 (기존)
 * - payAuthorize, payCancel, generateReceipt, requestCashReceipt: HTTPS Functions (기존)
 * 
 * v1.0 새로 추가:
 * - onOrderStatusChanged: stores/{storeId}/orders/{orderId} 상태 변경 트리거
 * - onReviewCreatedV1: stores/{storeId}/reviews/{reviewId} 생성 트리거
 * - onScheduleExpirePoints: 포인트 만료 스케줄러
 * - onScheduleExpireCoupons: 쿠폰 만료 스케줄러 (v1.0 구조)
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendPushToUser, sendPushToAdmins } from './lib/push';
import { issueCoupon, issuePhotoReviewCoupon } from './lib/coupons';
import { getStatusChangeMessage, getStatusChangeTitle } from './lib/report';
import { authorizePayment, cancelPayment, issueCashReceipt } from './lib/nicepay';
import { generateReceiptPDF, ReceiptData } from './lib/pdf';
import { RUNTIME_OPTS, POINTS_POLICY, REGION } from './config';
import { earnPointsServer, refundPointsServer } from './lib/points';
import { notifyUser } from './lib/fcm';
import { db, Timestamp } from './lib/firestore';

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}

// ============================================================================
// v1.0: 주문 상태 변경 트리거 (stores/{storeId}/orders/{orderId})
// ============================================================================

/**
 * v1.0 주문 상태 변경 트리거
 * stores/{storeId}/orders/{orderId} 문서의 status 변경을 감지하여
 * 포인트 적립/환불 + FCM 알림 실행
 */
export const onOrderStatusChanged = functions
  .region(REGION)
  .runWith(RUNTIME_OPTS)
  .firestore.document('stores/{storeId}/orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const { storeId, orderId } = context.params as { storeId: string; orderId: string };

    if (!before || !after) {
      console.log('[onOrderStatusChanged] Missing before/after data');
      return;
    }

    const prevStatus = before.status as string | undefined;
    const nextStatus = after.status as string | undefined;

    // 상태가 변하지 않았다면 아무 것도 하지 않음
    if (prevStatus === nextStatus) {
      return;
    }

    console.log('[onOrderStatusChanged]', { storeId, orderId, prevStatus, nextStatus });

    const userId = after.userId as string | undefined;
    const finalAmount = after.finalAmount as number | undefined;

    if (!userId || finalAmount === undefined) {
      console.warn('[onOrderStatusChanged] Missing userId or finalAmount', { userId, finalAmount });
      return;
    }

    try {
      // 1) 주문 완료 -> 포인트 적립
      if (prevStatus !== 'completed' && nextStatus === 'completed') {
        const amount = Math.floor(finalAmount * POINTS_POLICY.ORDER_REWARD_RATE);

        if (amount > 0) {
          console.log('[onOrderStatusChanged] Earning points', { userId, storeId, orderId, amount });

          await earnPointsServer({
            userId,
            storeId,
            amount,
            refKind: 'order',
            refId: orderId,
            note: '주문 적립',
          });

          await notifyUser({
            userId,
            title: '주문이 완료되었어요',
            body: `주문이 완료되어 ${amount}포인트가 적립되었습니다.`,
            data: {
              type: 'order_completed',
              storeId,
              orderId,
            },
          });

          console.log('[onOrderStatusChanged] Points earned and notification sent', { userId, amount });
        }
      }

      // 2) 완료 → 취소, 또는 다른 상태 → 취소 시 환불 로직
      if (nextStatus === 'cancelled' && prevStatus !== 'cancelled') {
        // 주문 완료 상태였다면 적립된 포인트 환불
        if (prevStatus === 'completed') {
          const earnedAmount = Math.floor(finalAmount * POINTS_POLICY.ORDER_REWARD_RATE);
          if (earnedAmount > 0) {
            try {
              await refundPointsServer({
                userId,
                storeId,
                amount: earnedAmount,
                refKind: 'order',
                refId: orderId,
                note: '주문 취소 환불',
              });
              console.log('[onOrderStatusChanged] Refunded points for cancelled order', { userId, orderId, amount: earnedAmount });
            } catch (refundError) {
              console.error('[onOrderStatusChanged] Failed to refund points:', refundError);
            }
          }
        }
        console.log('[onOrderStatusChanged] Order cancelled', { userId, orderId });
      }
    } catch (error) {
      console.error('[onOrderStatusChanged] Error:', error);
    }
  });

// ============================================================================
// v1.0: 리뷰 작성 트리거 (stores/{storeId}/reviews/{reviewId})
// ============================================================================

/**
 * v1.0 리뷰 작성 트리거
 * stores/{storeId}/reviews/{reviewId} 문서가 새로 생성될 때,
 * 리뷰 종류에 따라 포인트 적립 + FCM 알림
 */
export const onReviewCreatedV1 = functions
  .region(REGION)
  .runWith(RUNTIME_OPTS)
  .firestore.document('stores/{storeId}/reviews/{reviewId}')
  .onCreate(async (snap, context) => {
    const review = snap.data();
    const { storeId, reviewId } = context.params as { storeId: string; reviewId: string };

    const userId = review.userId as string | undefined;
    if (!userId) {
      console.warn('[onReviewCreatedV1] Missing userId', { storeId, reviewId });
      return;
    }

    const hasPhoto = Array.isArray(review.images) && review.images.length > 0;
    const base = hasPhoto ? POINTS_POLICY.REVIEW_PHOTO_BONUS : POINTS_POLICY.REVIEW_TEXT_BONUS;

    console.log('[onReviewCreatedV1]', { storeId, reviewId, userId, hasPhoto, base });

    if (base <= 0) {
      console.log('[onReviewCreatedV1] No points to earn', { base });
      return;
    }

    try {
      await earnPointsServer({
        userId,
        storeId,
        amount: base,
        refKind: 'review',
        refId: reviewId,
        note: hasPhoto ? '포토 리뷰 적립' : '텍스트 리뷰 적립',
      });

      await notifyUser({
        userId,
        title: '리뷰 감사합니다',
        body: `${base}포인트가 적립되었습니다.`,
        data: {
          type: 'review_created',
          storeId,
          reviewId,
        },
      });

      console.log('[onReviewCreatedV1] Points earned and notification sent', { userId, amount: base });
    } catch (error) {
      console.error('[onReviewCreatedV1] Error:', error);
    }
  });

// ============================================================================
// v1.0: 포인트 만료 스케줄러
// ============================================================================

/**
 * 포인트 만료 스케줄러
 * 매일 04:00 KST에 실행되어 만료된 포인트를 처리
 */
export const onScheduleExpirePoints = functions
  .region(REGION)
  .runWith(RUNTIME_OPTS)
  .pubsub.schedule('0 4 * * *')
  .timeZone('Asia/Seoul')
  .onRun(async () => {
    console.log('[SCHEDULE] onScheduleExpirePoints started');

    // TODO:
    // - stores/*/pointsTransactions 또는 별도 expire 기준을 조회
    // - 만료 대상 포인트를 찾아서
    //   - pointsBalances 업데이트
    //   - pointsTransactions 에 expire 트랜잭션 기록

    console.log('[SCHEDULE] onScheduleExpirePoints completed (TODO: implement)');
  });

// ============================================================================
// v1.0: 쿠폰 만료 스케줄러
// ============================================================================

/**
 * 쿠폰 만료 스케줄러
 * 매일 04:05 KST에 실행되어 만료된 쿠폰을 비활성화
 */
export const onScheduleExpireCoupons = functions
  .region(REGION)
  .runWith(RUNTIME_OPTS)
  .pubsub.schedule('5 4 * * *')
  .timeZone('Asia/Seoul')
  .onRun(async () => {
    console.log('[SCHEDULE] onScheduleExpireCoupons started');

    // TODO:
    // - stores/*/coupons 에서 validUntil < now 이고 isActive=true 인 쿠폰 검색
    // - isActive=false 로 업데이트

    console.log('[SCHEDULE] onScheduleExpireCoupons completed (TODO: implement)');
  });

// ============================================================================
// 기존 트리거 (호환성 유지)
// ============================================================================

// ============================================================================
// 1. 리뷰 생성 트리거: 사진 리뷰 쿠폰 자동 발급 (기존 구조)
// ============================================================================
export const onReviewCreated = functions.firestore
  .document('reviews/{reviewId}')
  .onCreate(async (snap, context) => {
    const review = snap.data();
    const reviewId = context.params.reviewId;

    // 이미 보상 발급된 경우 스킵
    if (review?.rewardIssued || !review?.userId) {
      return;
    }

    // 사진 리뷰 확인
    const hasPhoto = Array.isArray(review.photos) && review.photos.length > 0;
    if (!hasPhoto) {
      return;
    }

    try {
      // 사진 리뷰 쿠폰 발급 (3,000원 / 30일 / 15,000원 이상 주문시 사용)
      await issuePhotoReviewCoupon(review.userId);

      // 리뷰에 보상 발급 완료 표시
      await snap.ref.update({ rewardIssued: true });

      // 푸시 알림 전송
      await sendPushToUser(review.userId, {
        notification: {
          title: '🎁 리뷰 감사 쿠폰이 발급되었어요',
          body: '소중한 후기 감사합니다. 다음 주문에 사용해 보세요!',
        },
        data: {
          type: 'coupon_issued',
          couponType: 'photo_review',
        },
      });

      console.log(`Photo review coupon issued for user ${review.userId}`);
    } catch (error) {
      console.error('Failed to issue photo review coupon:', error);
    }
  });

// ============================================================================
// 2. 리뷰 신고 트리거: 3건 이상 시 자동 숨김 + 관리자 알림
// ============================================================================
export const onReviewReportCreated = functions.firestore
  .document('reviews_reports/{reportId}')
  .onCreate(async (snap, context) => {
    const report = snap.data();
    const reviewId = report?.reviewId;

    if (!reviewId) {
      return;
    }

    const db = admin.firestore();

    try {
      // 해당 리뷰의 전체 신고 건수 조회
      const reportsSnapshot = await db
        .collection('reviews_reports')
        .where('reviewId', '==', reviewId)
        .get();

      const reportCount = reportsSnapshot.size;

      console.log(`Review ${reviewId} has ${reportCount} reports`);

      // 신고 3건 이상 시 자동 숨김 처리
      if (reportCount >= 3) {
        await db.collection('reviews').doc(reviewId).set(
          {
            hidden: true,
            hiddenReason: 'auto-reported',
            hiddenAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        // 관리자들에게 알림
        await sendPushToAdmins({
          notification: {
            title: '⚠️ 리뷰 신고 누적 알림',
            body: `신고 ${reportCount}건 누적된 리뷰가 자동 숨김 처리되었습니다.`,
          },
          data: {
            type: 'review_auto_hidden',
            reviewId,
            reportCount: String(reportCount),
          },
        });

        console.log(`Review ${reviewId} auto-hidden due to ${reportCount} reports`);
      }
    } catch (error) {
      console.error('Failed to process review report:', error);
    }
  });

// ============================================================================
// 3. 주문 상태 변경 트리거: 고객에게 푸시 알림
// ============================================================================
export const onOrderUpdated = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const orderId = context.params.orderId;

    if (!before || !after) {
      return;
    }

    // 상태 변경이 없으면 스킵
    if (before.status === after.status) {
      return;
    }

    try {
      const title = getStatusChangeTitle(after.status);
      const message = getStatusChangeMessage(after.status);

      await sendPushToUser(after.userId, {
        notification: {
          title,
          body: message,
        },
        data: {
          type: 'order_status_changed',
          orderId,
          status: String(after.status),
          orderNumber: String(after.orderNumber || ''),
        },
      });

      console.log(
        `Order ${orderId} status changed: ${before.status} → ${after.status}`
      );
    } catch (error) {
      console.error('Failed to send order status notification:', error);
    }
  });

// ============================================================================
// 4. 쿠폰 만료 배치: 매일 04:00 KST (기존 구조: coupons 컬렉션)
// ============================================================================
export const scheduledCouponExpiration = functions.pubsub
  .schedule('0 4 * * *')
  .timeZone('Asia/Seoul')
  .onRun(async (context) => {
    console.log('[SCHEDULE] scheduledCouponExpiration started');

    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();

    try {
      // 만료된 미사용 쿠폰 조회
      const expiredCoupons = await db
        .collection('coupons')
        .where('expiresAt', '<=', now)
        .where('status', '==', 'unused')
        .get();

      if (expiredCoupons.empty) {
        console.log('[SCHEDULE] scheduledCouponExpiration: No expired coupons found');
        return;
      }

      // 배치로 상태 업데이트
      const batch = db.batch();
      expiredCoupons.forEach((doc) => {
        batch.update(doc.ref, {
          status: 'expired',
          expiredAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();

      console.log(`[SCHEDULE] scheduledCouponExpiration: Expired ${expiredCoupons.size} coupons`);
    } catch (error) {
      console.error('[SCHEDULE] scheduledCouponExpiration: Failed to expire coupons:', error);
    }

    console.log('[SCHEDULE] scheduledCouponExpiration completed');
  });

// ============================================================================
// 5. 주간 리포트: 매주 월요일 09:00 KST
// ============================================================================
export const weeklyReport = functions.pubsub
  .schedule('0 9 * * 1')
  .timeZone('Asia/Seoul')
  .onRun(async (context) => {
    console.log('[SCHEDULE] weeklyReport started');

    const db = admin.firestore();

    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // TODO: 실제 집계 로직 구현
      // - 주문 건수, 매출, 평균 주문 금액
      // - 리뷰 수, 평균 평점
      // - 인기 메뉴 Top 5
      // - 시간대별 주문 분포

      const reportData = {
        period: {
          start: admin.firestore.Timestamp.fromDate(weekAgo),
          end: admin.firestore.Timestamp.fromDate(now),
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        summary: {
          totalOrders: 0,
          totalRevenue: 0,
          avgOrderAmount: 0,
          totalReviews: 0,
          avgRating: 0,
        },
        topMenus: [],
        hourlyDistribution: [],
      };

      await db.collection('weekly_reports').add(reportData);

      // 관리자에게 알림
      await sendPushToAdmins({
        notification: {
          title: '📊 주간 리포트가 생성되었습니다',
          body: '지난 주 운영 현황을 확인하세요.',
        },
        data: {
          type: 'weekly_report',
        },
      });

      console.log('[SCHEDULE] weeklyReport: Weekly report generated');
    } catch (error) {
      console.error('[SCHEDULE] weeklyReport: Failed to generate weekly report:', error);
    }

    console.log('[SCHEDULE] weeklyReport completed');
  });

// ============================================================================
// HTTPS Functions: 결제 및 영수증
// ============================================================================

/**
 * 결제 승인 (NICEPAY)
 */
export const payAuthorize = functions.https.onCall(async (data, context) => {
  // 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      '로그인이 필요합니다'
    );
  }

  try {
    const result = await authorizePayment(data);
    return result;
  } catch (error: any) {
    console.error('Payment authorization failed:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * 결제 취소 (망취소)
 */
export const payCancel = functions.https.onCall(async (data, context) => {
  // 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      '로그인이 필요합니다'
    );
  }

  try {
    const result = await cancelPayment(data);
    return result;
  } catch (error: any) {
    console.error('Payment cancellation failed:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * 영수증 PDF 생성
 */
export const generateReceipt = functions.https.onCall(async (data, context) => {
  // 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      '로그인이 필요합니다'
    );
  }

  const { orderId } = data;

  if (!orderId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      '주문 ID가 필요합니다'
    );
  }

  try {
    const db = admin.firestore();
    const orderDoc = await db.collection('orders').doc(orderId).get();

    if (!orderDoc.exists) {
      throw new functions.https.HttpsError('not-found', '주문을 찾을 수 없습니다');
    }

    const order = orderDoc.data() as any;

    // 본인 주문이거나 관리자인지 확인
    const isOwner = order.userId === context.auth.uid;
    const userDoc = await db.collection('users').doc(context.auth.uid).get();
    const isAdmin = ['owner', 'admin'].includes(userDoc.get('role'));

    if (!isOwner && !isAdmin) {
      throw new functions.https.HttpsError(
        'permission-denied',
        '권한이 없습니다'
      );
    }

    // 영수증 데이터 준비
    const receiptData: ReceiptData = {
      orderId,
      orderNumber: order.orderNumber || orderId.slice(0, 8).toUpperCase(),
      orderDate: order.createdAt?.toDate().toLocaleString('ko-KR') || '',
      storeName: '현풍닭칼국수',
      storePhone: '1588-0000',
      storeAddress: '대구광역시 달성군 현풍면',
      customerName: order.customerInfo?.name || '고객',
      customerPhone: order.customerInfo?.phone || '',
      items: order.items || [],
      itemsTotal: order.itemsTotal || 0,
      deliveryFee: order.deliveryFee || 0,
      discount: order.discount || 0,
      finalAmount: order.finalAmount || 0,
      paymentMethod: order.payment?.method || '카드',
      developerInfo: {
        company: 'KS컴퍼니',
        bizNo: '553-17-00098',
        ceo: '석경선/배종수(공동대표)',
      },
    };

    const url = await generateReceiptPDF(receiptData);

    return { url };
  } catch (error: any) {
    console.error('Failed to generate receipt:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * 현금영수증 발급
 */
export const requestCashReceipt = functions.https.onCall(
  async (data, context) => {
    // 인증 확인
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        '로그인이 필요합니다'
      );
    }

    const { orderId, phoneOrBizNo } = data;

    if (!orderId || !phoneOrBizNo) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        '주문 ID와 전화번호/사업자번호가 필요합니다'
      );
    }

    try {
      const db = admin.firestore();
      const orderDoc = await db.collection('orders').doc(orderId).get();

      if (!orderDoc.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          '주문을 찾을 수 없습니다'
        );
      }

      const order = orderDoc.data() as any;

      // 본인 주문인지 확인
      if (order.userId !== context.auth.uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          '권한이 없습니다'
        );
      }

      // NICEPAY 현금영수증 발급
      const result = await issueCashReceipt({
        tid: order.payment?.tid || '',
        phoneOrBizNo,
        amount: order.finalAmount,
      });

      // 주문에 현금영수증 정보 저장
      await orderDoc.ref.update({
        'payment.cashReceipt': {
          phoneOrBizNo,
          issuedAt: admin.firestore.FieldValue.serverTimestamp(),
          receiptNo: result.receiptNo,
        },
      });

      return { success: true, receiptNo: result.receiptNo };
    } catch (error: any) {
      console.error('Failed to issue cash receipt:', error);
      throw new functions.https.HttpsError('internal', error.message);
    }
  }
);
