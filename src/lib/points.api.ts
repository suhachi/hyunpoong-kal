/**
 * 포인트 리워드 시스템 API
 * Phase 3-3: Points System
 * v1.0 STEP 5: Firebase 전환 + 트랜잭션 구현
 * 
 * Mock/Firebase 전환 가능
 */

import { USE_FIREBASE, FEATURE_FLAGS, getEnv } from '../config/env';
import { db } from './firebase';
import {
  pointsBalanceDocRef,
  storePointsTransactionsCollection,
  storePointsTransactionDocRef,
  type PointsBalanceDoc,
  type PointsTransactionDoc,
  type PointsTransactionType,
} from './firebase/firestore-schema';
import {
  getDoc,
  setDoc,
  runTransaction,
  serverTimestamp,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  type Timestamp,
} from 'firebase/firestore';
import type {
  PointsLedger,
  PointsBalance,
  PointsHistory,
  EarnPointsParams,
  SpendPointsParams,
  PointsPolicy,
} from '../types/points';

/**
 * 포인트 정책 (환경 변수 기반)
 */
export const POINTS_POLICY: PointsPolicy = {
  earnRate: FEATURE_FLAGS.pointsRate,
  minUse: FEATURE_FLAGS.pointsMinUse,
  expireDays: FEATURE_FLAGS.pointsExpireDays,
  reviewPhotoBonus: 200,
  reviewTextBonus: 100,
};

/**
 * 만료일 계산
 */
function calculateExpiryDate(): number {
  return Date.now() + (POINTS_POLICY.expireDays * 24 * 60 * 60 * 1000);
}

// ============================================================================
// Mock 구현 (localStorage)
// ============================================================================

const STORAGE_KEY_LEDGER = 'points_ledger';
const STORAGE_KEY_BALANCE = 'points_balance';

/**
 * Mock: 포인트 원장 저장
 */
function mockSaveLedger(ledger: PointsLedger[]): void {
  localStorage.setItem(STORAGE_KEY_LEDGER, JSON.stringify(ledger));
}

/**
 * Mock: 포인트 원장 로드
 */
function mockLoadLedger(): PointsLedger[] {
  const data = localStorage.getItem(STORAGE_KEY_LEDGER);
  return data ? JSON.parse(data) : [];
}

/**
 * Mock: 잔액 저장
 */
function mockSaveBalance(balances: Record<string, PointsBalance>): void {
  localStorage.setItem(STORAGE_KEY_BALANCE, JSON.stringify(balances));
}

/**
 * Mock: 잔액 로드
 */
function mockLoadBalance(): Record<string, PointsBalance> {
  const data = localStorage.getItem(STORAGE_KEY_BALANCE);
  return data ? JSON.parse(data) : {};
}

/**
 * Mock: 포인트 적립
 */
async function mockEarnPoints(params: EarnPointsParams): Promise<PointsLedger> {
  const ledger = mockLoadLedger();
  const balances = mockLoadBalance();

  // 새 원장 생성
  const newEntry: PointsLedger = {
    id: `pts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    uid: params.uid,
    type: 'earn',
    amount: params.amount,
    ref: params.ref,
    note: params.note,
    at: Date.now(),
    expiresAt: calculateExpiryDate(),
  };

  // 원장 추가
  ledger.push(newEntry);
  mockSaveLedger(ledger);

  // 잔액 업데이트
  const currentBalance = balances[params.uid]?.balance || 0;
  balances[params.uid] = {
    uid: params.uid,
    balance: currentBalance + params.amount,
    updatedAt: Date.now(),
  };
  mockSaveBalance(balances);

  console.log(`[Points Mock] Earned ${params.amount} points for ${params.uid}`);
  return newEntry;
}

/**
 * Mock: 포인트 사용
 */
async function mockSpendPoints(params: SpendPointsParams): Promise<PointsLedger> {
  const ledger = mockLoadLedger();
  const balances = mockLoadBalance();

  const currentBalance = balances[params.uid]?.balance || 0;

  // 잔액 부족 체크
  if (currentBalance < params.amount) {
    throw new Error('포인트 잔액이 부족합니다');
  }

  // 최소 사용 금액 체크
  if (params.amount < POINTS_POLICY.minUse) {
    throw new Error(`최소 ${POINTS_POLICY.minUse.toLocaleString()}P부터 사용 가능합니다`);
  }

  // 새 원장 생성 (음수로 기록)
  const newEntry: PointsLedger = {
    id: `pts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    uid: params.uid,
    type: 'spend',
    amount: -params.amount,
    ref: params.ref,
    note: params.note,
    at: Date.now(),
  };

  // 원장 추가
  ledger.push(newEntry);
  mockSaveLedger(ledger);

  // 잔액 업데이트
  balances[params.uid] = {
    uid: params.uid,
    balance: currentBalance - params.amount,
    updatedAt: Date.now(),
  };
  mockSaveBalance(balances);

  console.log(`[Points Mock] Spent ${params.amount} points for ${params.uid}`);
  return newEntry;
}

/**
 * Mock: 포인트 잔액 조회
 */
async function mockGetBalance(uid: string): Promise<number> {
  const balances = mockLoadBalance();
  return balances[uid]?.balance || 0;
}

/**
 * Mock: 포인트 내역 조회
 */
async function mockGetHistory(uid: string): Promise<PointsHistory> {
  const ledger = mockLoadLedger();
  const userLedger = ledger
    .filter((entry) => entry.uid === uid)
    .sort((a, b) => b.at - a.at);

  const balance = await mockGetBalance(uid);

  // 만료 예정 포인트 계산
  const now = Date.now();
  const expiringMap = new Map<number, number>();

  userLedger
    .filter((entry) => entry.type === 'earn' && entry.expiresAt && entry.expiresAt > now)
    .forEach((entry) => {
      if (entry.expiresAt) {
        const existing = expiringMap.get(entry.expiresAt) || 0;
        expiringMap.set(entry.expiresAt, existing + entry.amount);
      }
    });

  const expiringPoints = Array.from(expiringMap.entries())
    .map(([expiresAt, amount]) => ({ amount, expiresAt }))
    .sort((a, b) => a.expiresAt - b.expiresAt);

  return {
    ledger: userLedger,
    balance,
    expiringPoints,
  };
}

/**
 * Mock: 만료된 포인트 처리
 */
async function mockExpirePoints(): Promise<void> {
  const ledger = mockLoadLedger();
  const balances = mockLoadBalance();
  const now = Date.now();

  // 만료 대상 찾기
  const toExpire = ledger.filter(
    (entry) =>
      entry.type === 'earn' &&
      entry.expiresAt &&
      entry.expiresAt <= now &&
      !ledger.some((e) => e.ref?.kind === 'admin' && e.ref?.id === entry.id)
  );

  if (toExpire.length === 0) {
    return;
  }

  // 만료 원장 생성
  toExpire.forEach((entry) => {
    const expireEntry: PointsLedger = {
      id: `pts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uid: entry.uid,
      type: 'expire',
      amount: -entry.amount,
      ref: {
        kind: 'admin',
        id: entry.id,
      },
      note: '포인트 만료',
      at: now,
    };

    ledger.push(expireEntry);

    // 잔액 차감
    if (balances[entry.uid]) {
      balances[entry.uid].balance -= entry.amount;
      balances[entry.uid].updatedAt = now;
    }
  });

  mockSaveLedger(ledger);
  mockSaveBalance(balances);

  console.log(`[Points Mock] Expired ${toExpire.length} point entries`);
}

/**
 * Mock: 관리자 포인트 조정
 */
async function mockAdjustPoints(
  uid: string,
  amount: number,
  note: string
): Promise<PointsLedger> {
  const ledger = mockLoadLedger();
  const balances = mockLoadBalance();

  const newEntry: PointsLedger = {
    id: `pts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    uid,
    type: 'adjust',
    amount,
    ref: {
      kind: 'admin',
      id: 'admin_adjust',
    },
    note,
    at: Date.now(),
    expiresAt: amount > 0 ? calculateExpiryDate() : undefined,
  };

  ledger.push(newEntry);
  mockSaveLedger(ledger);

  const currentBalance = balances[uid]?.balance || 0;
  balances[uid] = {
    uid,
    balance: currentBalance + amount,
    updatedAt: Date.now(),
  };
  mockSaveBalance(balances);

  console.log(`[Points Mock] Adjusted ${amount} points for ${uid}`);
  return newEntry;
}

/**
 * Mock: 모든 사용자 포인트 조회 (관리자)
 */
async function mockGetAllBalances(): Promise<
  Array<PointsBalance & { phone?: string; name?: string }>
> {
  const balances = mockLoadBalance();
  
  return Object.values(balances).map((balance) => ({
    ...balance,
    phone: `010-****-****`, // Mock 데이터
    name: `사용자${balance.uid.slice(-4)}`,
  }));
}

// ============================================================================
// Firebase 구현
// ============================================================================

/**
 * storeId 가져오기 헬퍼
 */
function getStoreId(): string {
  return getEnv('VITE_STORE_ID', 'hyunpoong_main');
}

/**
 * Timestamp → number (milliseconds) 변환
 */
function timestampToMs(ts: Timestamp | undefined): number {
  if (!ts) return Date.now();
  if (typeof ts === 'string') return Date.parse(ts);
  if (typeof ts.toDate === 'function') return ts.toDate().getTime();
  if ((ts as any).seconds && typeof (ts as any).seconds === 'number') {
    return (ts as any).seconds * 1000;
  }
  return Date.now();
}

/**
 * PointsTransactionDoc → PointsLedger 변환
 */
function buildPointsLedgerFromDoc(doc: PointsTransactionDoc, docId: string): PointsLedger {
  return {
    id: docId,
    uid: doc.userId,
    type: doc.type,
    amount: doc.amount,
    ref: doc.ref,
    note: doc.note || '',
    at: timestampToMs(doc.at),
    expiresAt: doc.expiresAt ? timestampToMs(doc.expiresAt) : undefined,
  };
}

/**
 * Firebase: 포인트 적립
 */
async function firebaseEarnPoints(params: EarnPointsParams): Promise<PointsLedger> {
  const { uid, amount, ref, note } = params;
  const storeId = getStoreId();

  if (amount <= 0) {
    throw new Error('적립 포인트는 0보다 커야 합니다');
  }

  // 만료일 계산
  const expiresAt = calculateExpiryDate();
  const expiresAtTimestamp = new Date(expiresAt) as any;

  await runTransaction(db, async (tx) => {
    const balanceRef = pointsBalanceDocRef(uid);
    const balanceSnap = await tx.get(balanceRef);

    const now = serverTimestamp();
    let prev: PointsBalanceDoc | null = null;

    if (balanceSnap.exists()) {
      prev = balanceSnap.data() as PointsBalanceDoc;
    }

    const nextBalance: PointsBalanceDoc = {
      userId: uid,
      balance: (prev?.balance ?? 0) + amount,
      totalEarned: (prev?.totalEarned ?? 0) + amount,
      totalSpent: prev?.totalSpent ?? 0,
      totalExpired: prev?.totalExpired ?? 0,
      updatedAt: now as any,
    };

    tx.set(balanceRef, nextBalance);

    // 포인트 거래 문서 생성
    const txCol = storePointsTransactionsCollection(storeId);
    const txDocRef = doc(txCol);
    const txDoc: PointsTransactionDoc = {
      txId: txDocRef.id,
      storeId,
      userId: uid,
      type: 'earn',
      amount,
      ref: {
        kind: ref.kind === 'order' ? 'order' : ref.kind === 'review' ? 'review' : 'admin',
        id: ref.id,
      },
      note: note || '',
      expiresAt: expiresAtTimestamp,
      at: now as any,
    };

    tx.set(txDocRef, txDoc);
  });

  // 생성된 거래 문서 읽기 (트랜잭션 완료 후)
  const txCol = storePointsTransactionsCollection(storeId);
  const q = query(txCol, where('userId', '==', uid), orderBy('at', 'desc'));
  const snapshot = await getDocs(q);
  const latestDoc = snapshot.docs[0];
  
  if (!latestDoc) {
    throw new Error('포인트 적립 후 거래 내역을 읽을 수 없습니다');
  }

  return buildPointsLedgerFromDoc(latestDoc.data() as PointsTransactionDoc, latestDoc.id);
}

/**
 * Firebase: 포인트 사용
 */
async function firebaseSpendPoints(params: SpendPointsParams): Promise<PointsLedger> {
  const { uid, amount, ref, note } = params;
  const storeId = getStoreId();

  if (amount <= 0) {
    throw new Error('사용 포인트는 0보다 커야 합니다');
  }

  // 최소 사용 금액 체크
  if (amount < POINTS_POLICY.minUse) {
    throw new Error(`최소 ${POINTS_POLICY.minUse.toLocaleString()}P부터 사용 가능합니다`);
  }

  await runTransaction(db, async (tx) => {
    const balanceRef = pointsBalanceDocRef(uid);
    const balanceSnap = await tx.get(balanceRef);

    if (!balanceSnap.exists()) {
      throw new Error('포인트 잔액이 부족합니다.');
    }

    const prev = balanceSnap.data() as PointsBalanceDoc;
    const current = prev.balance ?? 0;

    if (current < amount) {
      throw new Error('포인트 잔액이 부족합니다.');
    }

    const now = serverTimestamp();

    const nextBalance: PointsBalanceDoc = {
      userId: uid,
      balance: current - amount,
      totalEarned: prev.totalEarned ?? 0,
      totalSpent: (prev.totalSpent ?? 0) + amount,
      totalExpired: prev.totalExpired ?? 0,
      updatedAt: now as any,
    };

    tx.set(balanceRef, nextBalance);

    // 포인트 거래 문서 생성
    const txCol = storePointsTransactionsCollection(storeId);
    const txDocRef = doc(txCol);
    const txDoc: PointsTransactionDoc = {
      txId: txDocRef.id,
      storeId,
      userId: uid,
      type: 'spend',
      amount: -amount,
      ref: {
        kind: ref.kind === 'order' ? 'order' : ref.kind === 'review' ? 'review' : 'admin',
        id: ref.id,
      },
      note: note || '',
      at: now as any,
    };

    tx.set(txDocRef, txDoc);
  });

  // 생성된 거래 문서 읽기
  const txCol = storePointsTransactionsCollection(storeId);
  const q = query(txCol, where('userId', '==', uid), orderBy('at', 'desc'));
  const snapshot = await getDocs(q);
  const latestDoc = snapshot.docs[0];
  
  if (!latestDoc) {
    throw new Error('포인트 사용 후 거래 내역을 읽을 수 없습니다');
  }

  return buildPointsLedgerFromDoc(latestDoc.data() as PointsTransactionDoc, latestDoc.id);
}

/**
 * Firebase: 포인트 잔액 조회
 */
async function firebaseGetBalance(uid: string): Promise<number> {
  const balanceRef = pointsBalanceDocRef(uid);
  const snap = await getDoc(balanceRef);
  
  if (!snap.exists()) {
    return 0;
  }
  
  const data = snap.data() as PointsBalanceDoc;
  return data.balance ?? 0;
}

/**
 * Firebase: 포인트 내역 조회
 */
async function firebaseGetHistory(uid: string): Promise<PointsHistory> {
  const storeId = getStoreId();
  const txCol = storePointsTransactionsCollection(storeId);
  const q = query(txCol, where('userId', '==', uid), orderBy('at', 'desc'));
  const snapshot = await getDocs(q);

  const ledger: PointsLedger[] = snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as PointsTransactionDoc;
    return buildPointsLedgerFromDoc(data, docSnap.id);
  });

  const balance = await firebaseGetBalance(uid);

  // 만료 예정 포인트 계산
  const now = Date.now();
  const expiringMap = new Map<number, number>();

  ledger
    .filter((entry) => entry.type === 'earn' && entry.expiresAt && entry.expiresAt > now)
    .forEach((entry) => {
      if (entry.expiresAt) {
        const existing = expiringMap.get(entry.expiresAt) || 0;
        expiringMap.set(entry.expiresAt, existing + entry.amount);
      }
    });

  const expiringPoints = Array.from(expiringMap.entries())
    .map(([expiresAt, amount]) => ({ amount, expiresAt }))
    .sort((a, b) => a.expiresAt - b.expiresAt);

  return {
    ledger,
    balance,
    expiringPoints,
  };
}

/**
 * Firebase: 만료된 포인트 처리
 * TODO: Cloud Functions 스케줄러로 이동 예정
 */
async function firebaseExpirePoints(): Promise<void> {
  const storeId = getStoreId();
  const txCol = storePointsTransactionsCollection(storeId);
  const now = Date.now();

  // 만료 대상 찾기 (earn 타입이고 expiresAt이 지난 것)
  const q = query(
    txCol,
    where('type', '==', 'earn'),
    where('expiresAt', '<=', new Date(now) as any)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return;
  }

  // 사용자별로 그룹화하여 만료 처리
  const userExpireMap = new Map<string, number>();

  snapshot.docs.forEach((docSnap) => {
    const data = docSnap.data() as PointsTransactionDoc;
    const userId = data.userId;
    const amount = Math.abs(data.amount);
    const existing = userExpireMap.get(userId) || 0;
    userExpireMap.set(userId, existing + amount);
  });

  // 각 사용자별로 만료 트랜잭션 실행
  for (const [userId, totalExpireAmount] of userExpireMap.entries()) {
    await runTransaction(db, async (tx) => {
      const balanceRef = pointsBalanceDocRef(userId);
      const balanceSnap = await tx.get(balanceRef);

      if (!balanceSnap.exists()) {
        return; // 잔액이 없으면 스킵
      }

      const prev = balanceSnap.data() as PointsBalanceDoc;
      const current = prev.balance ?? 0;
      const actualExpireAmount = Math.min(current, totalExpireAmount);

      if (actualExpireAmount <= 0) {
        return;
      }

      const now = serverTimestamp();

      const nextBalance: PointsBalanceDoc = {
        userId,
        balance: current - actualExpireAmount,
        totalEarned: prev.totalEarned ?? 0,
        totalSpent: prev.totalSpent ?? 0,
        totalExpired: (prev.totalExpired ?? 0) + actualExpireAmount,
        updatedAt: now as any,
      };

      tx.set(balanceRef, nextBalance);

      // 만료 거래 문서 생성
      const txDocRef = doc(txCol);
      const txDoc: PointsTransactionDoc = {
        txId: txDocRef.id,
        storeId,
        userId,
        type: 'expire',
        amount: -actualExpireAmount,
        ref: {
          kind: 'admin',
          id: 'expire_batch',
        },
        note: '포인트 만료',
        at: now as any,
      };

      tx.set(txDocRef, txDoc);
    });
  }
}

/**
 * Firebase: 관리자 포인트 조정
 */
async function firebaseAdjustPoints(
  uid: string,
  amount: number,
  note: string
): Promise<PointsLedger> {
  const storeId = getStoreId();

  await runTransaction(db, async (tx) => {
    const balanceRef = pointsBalanceDocRef(uid);
    const balanceSnap = await tx.get(balanceRef);

    const now = serverTimestamp();
    let prev: PointsBalanceDoc | null = null;

    if (balanceSnap.exists()) {
      prev = balanceSnap.data() as PointsBalanceDoc;
    }

    const nextBalance: PointsBalanceDoc = {
      userId: uid,
      balance: (prev?.balance ?? 0) + amount,
      totalEarned: amount > 0 ? (prev?.totalEarned ?? 0) + amount : (prev?.totalEarned ?? 0),
      totalSpent: amount < 0 ? (prev?.totalSpent ?? 0) - amount : (prev?.totalSpent ?? 0),
      totalExpired: prev?.totalExpired ?? 0,
      updatedAt: now as any,
    };

    tx.set(balanceRef, nextBalance);

    // 포인트 거래 문서 생성
    const txCol = storePointsTransactionsCollection(storeId);
    const txDocRef = doc(txCol);
    const expiresAt = amount > 0 ? (new Date(calculateExpiryDate()) as any) : undefined;
    const txDoc: PointsTransactionDoc = {
      txId: txDocRef.id,
      storeId,
      userId: uid,
      type: 'adjust',
      amount,
      ref: {
        kind: 'admin',
        id: 'admin_adjust',
      },
      note,
      expiresAt,
      at: now as any,
    };

    tx.set(txDocRef, txDoc);
  });

  // 생성된 거래 문서 읽기
  const txCol = storePointsTransactionsCollection(storeId);
  const q = query(txCol, where('userId', '==', uid), orderBy('at', 'desc'));
  const snapshot = await getDocs(q);
  const latestDoc = snapshot.docs[0];
  
  if (!latestDoc) {
    throw new Error('포인트 조정 후 거래 내역을 읽을 수 없습니다');
  }

  return buildPointsLedgerFromDoc(latestDoc.data() as PointsTransactionDoc, latestDoc.id);
}

/**
 * Firebase: 모든 사용자 포인트 조회 (관리자)
 */
async function firebaseGetAllBalances(): Promise<
  Array<PointsBalance & { phone?: string; name?: string }>
> {
  // TODO: users 컬렉션과 조인하여 phone/name 가져오기
  // 현재는 pointsBalances만 조회
  const balancesRef = collection(db, 'pointsBalances');
  const snapshot = await getDocs(balancesRef);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as PointsBalanceDoc;
    return {
      uid: data.userId,
      balance: data.balance,
      updatedAt: timestampToMs(data.updatedAt),
      phone: undefined, // TODO: users 컬렉션에서 조인
      name: undefined, // TODO: users 컬렉션에서 조인
    };
  });
}

// ============================================================================
// Public API (Mock/Firebase 전환)
// ============================================================================

/**
 * 포인트 적립
 */
export async function earnPoints(params: EarnPointsParams): Promise<PointsLedger> {
  if (!FEATURE_FLAGS.points) {
    throw new Error('포인트 기능이 비활성화되어 있습니다');
  }

  return USE_FIREBASE ? firebaseEarnPoints(params) : mockEarnPoints(params);
}

/**
 * 포인트 사용
 */
export async function spendPoints(params: SpendPointsParams): Promise<PointsLedger> {
  if (!FEATURE_FLAGS.points) {
    throw new Error('포인트 기능이 비활성화되어 있습니다');
  }

  return USE_FIREBASE ? firebaseSpendPoints(params) : mockSpendPoints(params);
}

/**
 * 포인트 잔액 조회
 */
export async function getPointsBalance(uid: string): Promise<number> {
  if (!FEATURE_FLAGS.points) {
    return 0;
  }

  return USE_FIREBASE ? firebaseGetBalance(uid) : mockGetBalance(uid);
}

/**
 * 포인트 내역 조회
 */
export async function getPointsHistory(uid: string): Promise<PointsHistory> {
  if (!FEATURE_FLAGS.points) {
    return { ledger: [], balance: 0, expiringPoints: [] };
  }

  return USE_FIREBASE ? firebaseGetHistory(uid) : mockGetHistory(uid);
}

/**
 * 만료된 포인트 처리 (크론잡)
 */
export async function expirePoints(): Promise<void> {
  if (!FEATURE_FLAGS.points) {
    return;
  }

  return USE_FIREBASE ? firebaseExpirePoints() : mockExpirePoints();
}

/**
 * 관리자: 포인트 조정
 */
export async function adjustPoints(
  uid: string,
  amount: number,
  note: string
): Promise<PointsLedger> {
  if (!FEATURE_FLAGS.points) {
    throw new Error('포인트 기능이 비활성화되어 있습니다');
  }

  return USE_FIREBASE
    ? firebaseAdjustPoints(uid, amount, note)
    : mockAdjustPoints(uid, amount, note);
}

/**
 * 관리자: 모든 사용자 포인트 조회
 */
export async function getAllPointsBalances(): Promise<
  Array<PointsBalance & { phone?: string; name?: string }>
> {
  if (!FEATURE_FLAGS.points) {
    return [];
  }

  return USE_FIREBASE ? firebaseGetAllBalances() : mockGetAllBalances();
}

/**
 * 주문 금액에 따른 적립 포인트 계산
 */
export function calculateEarnPoints(orderAmount: number): number {
  return Math.floor(orderAmount * POINTS_POLICY.earnRate);
}

/**
 * 리뷰 작성 시 적립 포인트 계산
 */
export function calculateReviewPoints(hasPhoto: boolean): number {
  return hasPhoto ? POINTS_POLICY.reviewPhotoBonus : POINTS_POLICY.reviewTextBonus;
}

// ============================================================================
// v1.0 포인트/트랜잭션 설계 요약
// ============================================================================
/**
 * v1.0 포인트/트랜잭션 설계 요약
 *
 * - 주문 완료 시:
 *   - source: Cloud Functions onUpdate(orders/{orderId}) 또는 클라이언트
 *   - 조건: status가 'completed'로 변경되는 순간
 *   - 동작:
 *     - earnPoints({ userId, storeId, amount, refKind: 'order', refId: orderId, note: '주문 적립' })
 *
 * - 주문 취소 시:
 *   - status가 'cancelled'로 변경되는 순간
 *   - 동작:
 *     - 필요 시 spendPoints 또는 별도 refundPoints 헬퍼로 환불 처리
 *
 * - 리뷰 작성 시:
 *   - createReview 성공 이후
 *   - 동작:
 *     - earnPoints({ userId, storeId, amount: REVIEW_BONUS, refKind: 'review', refId: reviewId, note: '리뷰 작성 적립' })
 *
 * 실제 트리거/호출 위치:
 * - v1.0 STEP 7: Cloud Functions에서 onUpdate/onCreate 트리거로 연결 예정
 */
