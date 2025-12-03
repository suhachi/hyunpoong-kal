"use strict";
/**
 * FCM 알림 헬퍼
 * v1.0 STEP 6: Functions 기본 셋업
 *
 * 현재는 토큰 스키마 확정 전이라도 골격만 제공
 * 향후 users/{userId}/fcmTokens 컬렉션 구조로 확장 예정
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyUser = notifyUser;
/**
 * 사용자에게 FCM 알림 전송
 * TODO: users/{userId}/fcmTokens 컬렉션에서 토큰 목록을 가져오는 구조로 확장 예정
 */
async function notifyUser(params) {
    const { userId, title, body, data } = params;
    // TODO: users/{userId}/fcmTokens 컬렉션에서 토큰 목록을 가져오는 구조로 확장 예정
    // 현재는 토큰 조회 대신 로깅만 수행
    console.log("[FCM][TODO] notifyUser called", { userId, title, body, data });
    // 향후 구현 예시:
    // const tokensSnap = await db
    //   .collection('users')
    //   .doc(userId)
    //   .collection('fcmTokens')
    //   .where('active', '==', true)
    //   .get();
    //
    // const tokens = tokensSnap.docs.map(doc => doc.data().token);
    // if (tokens.length === 0) return;
    //
    // await admin.messaging().sendMulticast({
    //   tokens,
    //   notification: { title, body },
    //   data: data || {},
    // });
}
