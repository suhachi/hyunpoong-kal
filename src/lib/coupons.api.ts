/**
 * 쿠폰 API
 * USE_FIREBASE=false: Mock 데이터 반환
 * USE_FIREBASE=true: Firestore 연동
 * v1.0 STEP 5: Firebase 전환
 */

import { USE_FIREBASE, getEnv } from '../config/env';
import { db } from './firebase';
import {
  storeCouponsCollection,
  storeCouponDocRef,
  type CouponDoc,
} from './firebase/firestore-schema';
import {
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import type { Coupon, CouponFilters, CouponStats, CouponIssue } from '../types/coupon';
import { getCouponStatus } from '../types/coupon';

// ============================================================================
// Mock 모드 함수 (기존 로직 보전)
// ============================================================================

// Mock 데이터 (샘플 데이터 제거)
let mockCoupons: Coupon[] = [];

/**
 * Mock 모드: 쿠폰 목록 조회
 */
async function getCouponsMock(
  uid: string,
  filters: CouponFilters = {}
): Promise<Coupon[]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  let filtered = mockCoupons.filter(c => c.uid === uid);

  // 상태 필터
  if (filters.status) {
    filtered = filtered.filter(c => getCouponStatus(c) === filters.status);
  }

  // 타입 필터
  if (filters.type) {
    filtered = filtered.filter(c => c.type === filters.type);
  }

  // 정렬
  switch (filters.sortBy) {
    case 'issuedAt':
      filtered.sort((a, b) => b.issuedAt - a.issuedAt);
      break;
    case 'expiresAt':
      filtered.sort((a, b) => a.expiresAt - b.expiresAt);
      break;
    case 'amount':
      filtered.sort((a, b) => b.amount - a.amount);
      break;
    default:
      filtered.sort((a, b) => b.issuedAt - a.issuedAt);
  }

  return filtered;
}

/**
 * Mock 모드: 사용 가능한 쿠폰만 조회
 */
async function getAvailableCouponsMock(
  uid: string,
  orderAmount: number
): Promise<Coupon[]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  return mockCoupons.filter(c =>
    c.uid === uid &&
    !c.used &&
    Date.now() <= c.expiresAt &&
    orderAmount >= c.minSpend
  );
}

/**
 * Mock 모드: 쿠폰 사용
 */
async function useCouponMock(
  couponId: string,
  orderId: string
): Promise<Coupon> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const coupon = mockCoupons.find(c => c.id === couponId);
  if (!coupon) {
    throw new Error('쿠폰을 찾을 수 없습니다');
  }

  if (coupon.used) {
    throw new Error('이미 사용된 쿠폰입니다');
  }

  if (Date.now() > coupon.expiresAt) {
    throw new Error('만료된 쿠폰입니다');
  }

  coupon.used = true;
  coupon.usedAt = Date.now();
  coupon.orderId = orderId;

  return coupon;
}

/**
 * Mock 모드: 쿠폰 발급
 */
async function issueCouponMock(
  issue: CouponIssue,
  by: string,
  byName: string
): Promise<Coupon[]> {
  await new Promise(resolve => setTimeout(resolve, 500));

  // targetType에 따라 대상 사용자 결정
  let targetUsers: string[] = [];
  if (issue.targetType === 'user' && issue.targetUserId) {
    targetUsers = [issue.targetUserId];
  } else if (issue.targetType === 'phone') {
    // 전화번호로 지정된 경우 Mock에서는 임시 사용자 ID 생성
    targetUsers = ['user-phone-' + (issue.targetPhone || 'unknown')];
  } else {
    // 'all' 또는 기존 targetUsers 사용
    targetUsers = issue.targetUsers || ['user-001'];
  }

  const expiresAt = Date.now() + issue.expiryDays * 24 * 60 * 60 * 1000;

  const issued: Coupon[] = targetUsers.slice(0, issue.issueLimit || 999).map((uid, index) => {
    const coupon: Coupon = {
      id: `coupon-${Date.now()}-${index}`,
      uid,
      type: issue.type,
      amount: issue.amount,
      minSpend: issue.minSpend,
      issuedAt: Date.now(),
      expiresAt,
      used: false,
      title: issue.title,
      description: issue.description,
    };
    mockCoupons.push(coupon);
    return coupon;
  });

  return issued;
}

/**
 * Mock 모드: 쿠폰 통계
 */
async function getCouponStatsMock(): Promise<CouponStats> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const stats: CouponStats = {
    totalIssued: mockCoupons.length,
    totalUsed: mockCoupons.filter(c => c.used).length,
    totalAmount: mockCoupons.filter(c => c.used).reduce((sum, c) => sum + c.amount, 0),
    expiredCount: mockCoupons.filter(c => !c.used && Date.now() > c.expiresAt).length,
  };

  return stats;
}

/**
 * Mock 모드: 만료 처리
 */
async function expireCouponsMock(): Promise<number> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const expiredCount = mockCoupons.filter(
    c => !c.used && Date.now() > c.expiresAt
  ).length;

  return expiredCount;
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
 * CouponDoc → Coupon 변환
 */
function buildCouponFromDoc(doc: CouponDoc & { couponId: string }): Coupon {
  // CouponDoc의 type은 'percentage' | 'fixed'이지만,
  // 도메인 Coupon의 type은 'photo_review' | 'welcome' | 'event' | 'compensation' | 'admin'
  // 현재는 쿠폰 코드 기반 시스템이므로, CouponDoc의 name/description을 활용
  // TODO: 향후 CouponDoc에 도메인 type 필드 추가 고려
  
  return {
    id: doc.couponId,
    uid: '', // CouponDoc에는 userId가 없음 (쿠폰 템플릿이므로)
    type: 'admin', // 기본값 (실제로는 쿠폰 발급 시 설정)
    amount: doc.type === 'fixed' ? doc.value : 0, // percentage는 계산 필요
    minSpend: doc.minOrderAmount || 0,
    issuedAt: timestampToMs(doc.createdAt),
    expiresAt: timestampToMs(doc.validUntil),
    used: false, // 쿠폰 템플릿은 사용 여부가 없음
    title: doc.name,
    description: doc.code,
  };
}

/**
 * Coupon → CouponDoc 변환 (생성용)
 */
function buildCouponDocFromEntity(params: {
  storeId: string;
  couponId: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  usageLimit?: number;
  userLimit?: number;
  targetType?: 'all' | 'user' | 'phone';
  targetUserId?: string;
  targetPhone?: string;
}): Omit<CouponDoc, 'createdAt' | 'updatedAt'> {
  const doc: Omit<CouponDoc, 'createdAt' | 'updatedAt'> = {
    couponId: params.couponId,
    storeId: params.storeId,
    code: params.code,
    name: params.name,
    type: params.type,
    value: params.value,
    minOrderAmount: params.minOrderAmount,
    maxDiscountAmount: params.maxDiscountAmount,
    validFrom: params.validFrom as any,
    validUntil: params.validUntil as any,
    isActive: params.isActive,
    usageLimit: params.usageLimit,
    usageCount: 0,
    userLimit: params.userLimit,
  };

  // 발급 대상 정보 추가 (있는 경우만)
  if (params.targetType) {
    doc.targetType = params.targetType;
  }
  if (params.targetUserId) {
    doc.targetUserId = params.targetUserId;
  }
  if (params.targetPhone) {
    doc.targetPhone = params.targetPhone;
  }

  return doc;
}

/**
 * 사용자 쿠폰 목록 조회
 */
export async function getCoupons(
  uid: string,
  filters: CouponFilters = {}
): Promise<Coupon[]> {
  if (!USE_FIREBASE) {
    return await getCouponsMock(uid, filters);
  }

  // Firebase 모드: 현재는 쿠폰 템플릿만 조회 (사용자별 발급 쿠폰은 별도 컬렉션 필요)
  // TODO: 향후 userCoupons/{userId}/coupons 서브컬렉션 추가 고려
  try {
    const storeId = getStoreId();
    const colRef = storeCouponsCollection(storeId);
    const q = query(colRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const coupons: Coupon[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as CouponDoc;
      const couponId = data.couponId || docSnap.id;
      return buildCouponFromDoc({ ...data, couponId });
    });

    // 클라이언트 측 필터링
    let filtered = coupons;

    if (filters.status) {
      filtered = filtered.filter(c => getCouponStatus(c) === filters.status);
    }

    if (filters.type) {
      filtered = filtered.filter(c => c.type === filters.type);
    }

    return filtered;
  } catch (error) {
    console.error('Failed to fetch coupons from Firestore:', error);
    return [];
  }
}

/**
 * 사용 가능한 쿠폰만 조회 (결제 시)
 */
export async function getAvailableCoupons(
  uid: string,
  orderAmount: number
): Promise<Coupon[]> {
  if (!USE_FIREBASE) {
    return await getAvailableCouponsMock(uid, orderAmount);
  }

  // Firebase 모드: 활성 쿠폰 중 사용 가능한 것만 조회
  try {
    const storeId = getStoreId();
    const colRef = storeCouponsCollection(storeId);
    const now = new Date();
    const q = query(
      colRef,
      where('isActive', '==', true),
      where('validFrom', '<=', now as any),
      where('validUntil', '>=', now as any)
    );
    const snapshot = await getDocs(q);

    const coupons: Coupon[] = snapshot.docs
      .map((docSnap) => {
        const data = docSnap.data() as CouponDoc;
        const couponId = data.couponId || docSnap.id;
        return buildCouponFromDoc({ ...data, couponId });
      })
      .filter(c => {
        // 최소 주문 금액 체크
        const minSpend = c.minSpend || 0;
        return orderAmount >= minSpend;
      });

    return coupons;
  } catch (error) {
    console.error('Failed to fetch available coupons from Firestore:', error);
    return [];
  }
}

/**
 * 쿠폰 코드로 쿠폰 찾기 + 유효성 체크
 */
async function firebaseFindCouponByCode(params: {
  storeId: string;
  code: string;
  userId?: string;
  now?: Date;
}): Promise<Coupon | null> {
  const { storeId, code, userId, now = new Date() } = params;
  const colRef = storeCouponsCollection(storeId);
  const q = query(colRef, where('code', '==', code.toUpperCase()));
  const snap = await getDocs(q);
  
  if (snap.empty) return null;

  const docSnap = snap.docs[0];
  const data = docSnap.data() as CouponDoc;
  const couponId = data.couponId || docSnap.id;
  const coupon = buildCouponFromDoc({ ...data, couponId });

  // 유효기간/활성 여부 체크
  const nowTs = now.getTime();
  const validFrom = timestampToMs(data.validFrom);
  const validUntil = timestampToMs(data.validUntil);
  
  if (!data.isActive || nowTs < validFrom || nowTs > validUntil) {
    return null;
  }

  // 사용 횟수 제한 체크
  if (data.usageLimit && data.usageCount >= data.usageLimit) {
    return null;
  }

  // TODO: userLimit / 사용자별 사용 이력 연동은 후속 STEP에서 확장

  return coupon;
}

/**
 * 쿠폰 사용
 */
export async function useCoupon(
  couponId: string,
  orderId: string
): Promise<Coupon> {
  if (!USE_FIREBASE) {
    return await useCouponMock(couponId, orderId);
  }

  // Firebase 모드: 쿠폰 사용 횟수 증가
  try {
    const storeId = getStoreId();
    const ref = storeCouponDocRef(storeId, couponId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      throw new Error('쿠폰을 찾을 수 없습니다');
    }

    const data = snapshot.data() as CouponDoc;

    // 유효성 체크
    const now = new Date();
    const validFrom = timestampToMs(data.validFrom);
    const validUntil = timestampToMs(data.validUntil);
    const nowTs = now.getTime();

    if (!data.isActive || nowTs < validFrom || nowTs > validUntil) {
      throw new Error('만료되었거나 비활성화된 쿠폰입니다');
    }

    if (data.usageLimit && data.usageCount >= data.usageLimit) {
      throw new Error('쿠폰 사용 횟수가 초과되었습니다');
    }

    // 사용 횟수 증가
    await updateDoc(ref, {
      usageCount: data.usageCount + 1,
      updatedAt: serverTimestamp(),
    });

    const updatedData = (await getDoc(ref)).data() as CouponDoc;
    return buildCouponFromDoc({ ...updatedData, couponId });
  } catch (error) {
    console.error('Failed to use coupon in Firestore:', error);
    throw error;
  }
}

/**
 * 쿠폰 발급 (관리자)
 */
export async function issueCoupon(
  issue: CouponIssue,
  by: string,
  byName: string
): Promise<Coupon[]> {
  if (!USE_FIREBASE) {
    return await issueCouponMock(issue, by, byName);
  }

  // Firebase 모드: 쿠폰 템플릿 생성
  // TODO: 향후 userCoupons/{userId}/coupons 서브컬렉션에 사용자별 발급 쿠폰 생성
  try {
    const storeId = getStoreId();
    const colRef = storeCouponsCollection(storeId);
    const now = new Date();
    const validUntil = new Date(now.getTime() + issue.expiryDays * 24 * 60 * 60 * 1000);

    // 쿠폰 코드 생성 (간단한 랜덤 코드)
    const code = `COUPON-${Date.now().toString(36).toUpperCase()}`;

    const couponDocData = buildCouponDocFromEntity({
      storeId,
      couponId: '', // addDoc 시점에는 id 없음
      code,
      name: issue.title,
      type: 'fixed', // CouponIssue의 type을 매핑 필요 (현재는 fixed로 가정)
      value: issue.amount,
      minOrderAmount: issue.minSpend,
      validFrom: now,
      validUntil,
      isActive: true,
      usageLimit: issue.issueLimit,
      userLimit: issue.targetType === 'user' ? 1 : issue.targetUsers?.length,
      // 발급 대상 정보 저장
      targetType: issue.targetType || 'all',
      targetUserId: issue.targetUserId,
      targetPhone: issue.targetPhone,
    });

    const docRef = await addDoc(colRef, {
      ...couponDocData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const snapshot = await getDoc(docRef);
    const data = snapshot.data() as CouponDoc;
    const couponId = snapshot.id;

    return [buildCouponFromDoc({ ...data, couponId })];
  } catch (error) {
    console.error('Failed to issue coupon in Firestore:', error);
    throw error;
  }
}

/**
 * 쿠폰 통계 (관리자)
 */
export async function getCouponStats(): Promise<CouponStats> {
  if (!USE_FIREBASE) {
    return await getCouponStatsMock();
  }

  // Firebase 모드: Firestore에서 집계
  try {
    const storeId = getStoreId();
    const colRef = storeCouponsCollection(storeId);
    const snapshot = await getDocs(colRef);

    const coupons = snapshot.docs.map(docSnap => {
      const data = docSnap.data() as CouponDoc;
      return buildCouponFromDoc({ ...data, couponId: docSnap.id });
    });

    const stats: CouponStats = {
      totalIssued: coupons.length,
      totalUsed: coupons.filter(c => c.used).length,
      totalAmount: coupons.filter(c => c.used).reduce((sum, c) => sum + c.amount, 0),
      expiredCount: coupons.filter(c => !c.used && Date.now() > c.expiresAt).length,
    };

    return stats;
  } catch (error) {
    console.error('Failed to fetch coupon stats from Firestore:', error);
    return {
      totalIssued: 0,
      totalUsed: 0,
      totalAmount: 0,
      expiredCount: 0,
    };
  }
}

/**
 * 만료 처리 (스케줄러용)
 * TODO: Cloud Functions Scheduler로 매일 04:00 실행 예정
 */
export async function expireCoupons(): Promise<number> {
  if (!USE_FIREBASE) {
    return await expireCouponsMock();
  }

  // Firebase 모드: 만료된 쿠폰 비활성화
  try {
    const storeId = getStoreId();
    const colRef = storeCouponsCollection(storeId);
    const now = new Date();
    const q = query(
      colRef,
      where('isActive', '==', true),
      where('validUntil', '<', now as any)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return 0;
    }

    // 배치 업데이트
    const batch = snapshot.docs.map(docSnap => {
      const ref = storeCouponDocRef(storeId, docSnap.id);
      return updateDoc(ref, {
        isActive: false,
        updatedAt: serverTimestamp(),
      });
    });

    await Promise.all(batch);

    return snapshot.size;
  } catch (error) {
    console.error('Failed to expire coupons in Firestore:', error);
    return 0;
  }
}
