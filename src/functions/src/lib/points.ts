/**
 * 포인트 서버 사이드 헬퍼
 * v1.0 STEP 6: Functions 기본 셋업
 * 
 * 클라이언트 src/lib/points.api.ts와 같은 스키마를 사용하지만,
 * admin SDK로 구현하여 서버 사이드에서 실행
 */

import { db, FieldValue, Timestamp } from './firestore';

interface EarnPointsParams {
  userId: string;
  storeId: string;
  amount: number;
  refKind: 'order' | 'review' | 'admin';
  refId: string;
  note: string;
  expiresAt?: Date;
}

interface SpendPointsParams {
  userId: string;
  storeId: string;
  amount: number;
  refKind: 'order' | 'review' | 'admin';
  refId: string;
  note: string;
}

/**
 * 서버 사이드: 포인트 적립
 */
export async function earnPointsServer(params: EarnPointsParams): Promise<void> {
  const { userId, storeId, amount, refKind, refId, note, expiresAt } = params;

  if (amount <= 0) {
    throw new Error('적립 포인트는 0보다 커야 합니다');
  }

  await db.runTransaction(async (tx) => {
    const balanceRef = db.collection('pointsBalances').doc(userId);
    const balanceSnap = await tx.get(balanceRef);

    const now = FieldValue.serverTimestamp();
    let prev: any = null;

    if (balanceSnap.exists) {
      prev = balanceSnap.data();
    }

    const nextBalance = {
      userId,
      balance: (prev?.balance ?? 0) + amount,
      totalEarned: (prev?.totalEarned ?? 0) + amount,
      totalSpent: prev?.totalSpent ?? 0,
      totalExpired: prev?.totalExpired ?? 0,
      updatedAt: now,
    };

    tx.set(balanceRef, nextBalance);

    // 포인트 거래 문서 생성
    const txCol = db
      .collection('stores')
      .doc(storeId)
      .collection('pointsTransactions');
    const txDocRef = txCol.doc();
    const txDoc = {
      txId: txDocRef.id,
      storeId,
      userId,
      type: 'earn' as const,
      amount,
      ref: {
        kind: refKind,
        id: refId,
      },
      note,
      expiresAt: expiresAt ? Timestamp.fromDate(expiresAt) : undefined,
      at: now,
    };

    tx.set(txDocRef, txDoc);
  });
}

/**
 * 서버 사이드: 포인트 환불/차감
 */
export async function refundPointsServer(params: SpendPointsParams): Promise<void> {
  const { userId, storeId, amount, refKind, refId, note } = params;

  if (amount <= 0) {
    throw new Error('환불 포인트는 0보다 커야 합니다');
  }

  await db.runTransaction(async (tx) => {
    const balanceRef = db.collection('pointsBalances').doc(userId);
    const balanceSnap = await tx.get(balanceRef);

    if (!balanceSnap.exists) {
      throw new Error('포인트 잔액이 부족합니다.');
    }

    const prev = balanceSnap.data()!;
    const current = prev.balance ?? 0;

    if (current < amount) {
      throw new Error('포인트 잔액이 부족합니다.');
    }

    const now = FieldValue.serverTimestamp();

    const nextBalance = {
      userId,
      balance: current - amount,
      totalEarned: prev.totalEarned ?? 0,
      totalSpent: (prev.totalSpent ?? 0) + amount,
      totalExpired: prev.totalExpired ?? 0,
      updatedAt: now,
    };

    tx.set(balanceRef, nextBalance);

    // 포인트 거래 문서 생성
    const txCol = db
      .collection('stores')
      .doc(storeId)
      .collection('pointsTransactions');
    const txDocRef = txCol.doc();
    const txDoc = {
      txId: txDocRef.id,
      storeId,
      userId,
      type: 'spend' as const,
      amount: -amount,
      ref: {
        kind: refKind,
        id: refId,
      },
      note,
      at: now,
    };

    tx.set(txDocRef, txDoc);
  });
}

