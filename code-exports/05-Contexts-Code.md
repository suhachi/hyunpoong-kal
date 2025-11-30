# Contexts - Full Source Code

**Generated**: 2025-11-30-1558  
**Project**: hyunpoong-kal  
**Company**: KS Company (BRN: 553-17-00098)

---

## Overview

Complete source code of React Contexts (AuthContext, CartContext, etc.).

---
## src\contexts\AuthContext.tsx

```tsx
/**
 * 인증 컨텍스트
 * Firebase Auth와 Mock Auth를 지원하는 통합 인증 시스템
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import React, { createContext, useContext, useState, useEffect, useLayoutEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { USE_FIREBASE } from '../config/env';
import { resolveUser, loadMockUserFromStorage } from '../lib/auth/resolveUser';
import {
  sendVerificationCode,
  verifyPhoneCode,
  normalizePhoneNumber,
  type ConfirmationResult,
} from '../lib/auth/phone';

export type UserRole = 'customer' | 'owner' | 'admin';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  storeId?: string; // owner인 경우 관리하는 매장 ID
  createdAt?: Date;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  initializing: boolean; // STEP-8-2: Mock 모드 초기화 상태
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signInWithGoogle: () => Promise<AuthUser>;
  signInWithPhone: (phoneNumber: string, code: string, displayName?: string) => Promise<AuthUser>;
  signUpWithPhone: (phoneNumber: string, code: string, displayName: string) => Promise<void>;
  sendPhoneVerificationCode?: (phone: string) => Promise<ConfirmationResult>;
  verifyAndSignInWithPhone?: (confirmationResult: ConfirmationResult, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 개발/테스트용 Mock 계정 (실운영 시 Firebase Auth 계정으로 대체 예정)
const MOCK_USERS = {
  'admin@hyunpoongkalguksu.com': {
    uid: 'admin-001',
    email: 'admin@hyunpoongkalguksu.com',
    displayName: '관리자',
    role: 'owner' as UserRole,
    storeId: 'store-hyunpung',
  },
  'customer@example.com': {
    uid: 'user-001',
    email: 'customer@example.com',
    displayName: '김고객',
    role: 'customer' as UserRole,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  // Mock 모드에서는 initializing을 false로 시작 (ProtectedRoute 차단 방지)
  const [initializing, setInitializing] = useState(USE_FIREBASE ? true : false);

  // Mock 모드: useLayoutEffect로 즉시 mockUser 반영 (렌더링 전에 완료)
  useLayoutEffect(() => {
    if (!USE_FIREBASE) {
      const mu = loadMockUserFromStorage();
      setUser(mu || null);
      setInitializing(false);
      setLoading(false);
      console.log('[AuthContext] 🎯 Mock 모드 즉시 초기화 완료:', mu ? 'user 있음' : 'user 없음');
      return;
    }
    // Firebase 모드는 아래 useEffect에서 처리
  }, []);

  // AuthResolver는 외부 파일로 이동 (동작 동일, 위치만 이동)

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[AuthContext] 🔍 USE_FIREBASE:', USE_FIREBASE);
    
    if (USE_FIREBASE && auth) {
      // Firebase Auth 리스너
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            const resolved = (await resolveUser(firebaseUser)) as AuthUser;
            setUser(resolved);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('[AuthContext] 사용자 정보 로드 실패:', error);
          setUser(null);
        } finally {
          setLoading(false);
          setInitializing(false);
        }
      });

      return () => unsubscribe();
    }
    // Mock 모드는 useLayoutEffect에서 이미 처리됨
  }, []);

  // 기존 3회 재확인 로직 제거 (useLayoutEffect에서 즉시 처리)

  // 이메일 회원가입
  const signUp = async (email: string, password: string, displayName: string) => {
    if (USE_FIREBASE && auth) {
      // Firebase 회원가입
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 프로필 업데이트
      await updateProfile(firebaseUser, { displayName });

      // Firestore에 사용자 정보 저장
      const newUser: AuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName,
        role: 'customer',
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...newUser,
        createdAt: new Date(),
      });

      setUser(newUser);
    } else {
      // Mock 회원가입
      const newUser: AuthUser = {
        uid: `user-${Date.now()}`,
        email,
        displayName,
        role: 'customer',
        createdAt: new Date(),
      };
      
      localStorage.setItem('mockUser', JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  // 이메일 로그인
  const signIn = async (email: string, password: string): Promise<AuthUser> => {
    if (USE_FIREBASE && auth) {
      // Firebase 로그인
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Firestore에서 사용자 정보 가져오기
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();

      // 관리자 이메일 주소에 대한 기본 역할 설정
      const adminEmails = ['admin@hyunpoongkalguksu.com'];
      let role: UserRole = (userData?.role as UserRole) || 'customer';
      if (!userData?.role && adminEmails.includes(firebaseUser.email || '')) {
        role = 'owner';
      }

      const authUser: AuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: firebaseUser.displayName || '사용자',
        photoURL: firebaseUser.photoURL || undefined,
        role,
        storeId: userData?.storeId,
        createdAt: userData?.createdAt?.toDate(),
      };

      setUser(authUser);
      return authUser;
    } else {
      // Mock 로그인
      const mockUser = MOCK_USERS[email as keyof typeof MOCK_USERS];
      if (mockUser) {
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        setUser(mockUser);
        return mockUser;
      } else {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    }
  };

  // 구글 로그인
  const signInWithGoogle = async (): Promise<AuthUser> => {
    if (USE_FIREBASE && auth) {
      // Firebase 구글 로그인
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      // Firestore에서 사용자 정보 확인
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      // 관리자 이메일 주소에 대한 기본 역할 설정
      const adminEmails = ['admin@hyunpoongkalguksu.com'];
      const defaultRole = adminEmails.includes(firebaseUser.email || '') ? 'owner' : 'customer';

      let authUser: AuthUser;

      if (!userDoc.exists()) {
        // 신규 사용자면 Firestore에 저장
        authUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '사용자',
          photoURL: firebaseUser.photoURL || undefined,
          role: defaultRole,
          createdAt: new Date(),
        };

        await setDoc(userDocRef, {
          ...authUser,
          createdAt: new Date(),
        });

        setUser(authUser);
      } else {
        // 기존 사용자
        const userData = userDoc.data();
        let role: UserRole = (userData?.role as UserRole) || defaultRole;
        if (!userData?.role && adminEmails.includes(firebaseUser.email || '')) {
          role = 'owner';
        }
        
        authUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '사용자',
          photoURL: firebaseUser.photoURL || undefined,
          role,
          storeId: userData?.storeId,
          createdAt: userData?.createdAt?.toDate(),
        };

        setUser(authUser);
      }

      return authUser;
    } else {
      // Mock 구글 로그인
      const mockUser: AuthUser = {
        uid: 'google-user-001',
        email: 'google@example.com',
        displayName: '구글 사용자',
        photoURL: 'https://via.placeholder.com/150',
        role: 'customer',
        createdAt: new Date(),
      };
      
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
  };

  // 로그아웃
  const signOut = async () => {
    if (USE_FIREBASE && auth) {
      await firebaseSignOut(auth);
    } else {
      localStorage.removeItem('mockUser');
    }
    setUser(null);
  };

  // 전화번호 로그인
  const signInWithPhone = async (
    phoneNumber: string,
    code: string,
    displayName?: string
  ): Promise<AuthUser> => {
    if (USE_FIREBASE && auth) {
      // Firebase Phone Auth는 sendVerificationCode와 verifyPhoneCode를 별도로 호출해야 함
      // 여기서는 이미 verifyPhoneCode가 완료된 상태라고 가정
      // 실제로는 Signup/Login 컴포넌트에서 sendVerificationCode → verifyPhoneCode 순서로 호출
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        throw new Error('인증이 완료되지 않았습니다.');
      }

      // Firestore에서 사용자 정보 확인
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      let authUser: AuthUser;
      
      if (!userDoc.exists()) {
        // 신규 사용자 (로그인 시도했지만 회원 정보 없음)
        authUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: displayName || '사용자',
          role: 'customer',
          createdAt: new Date(),
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...authUser,
          phoneNumber: normalizePhoneNumber(phoneNumber),
          createdAt: new Date(),
        });
      } else {
        // 기존 사용자
        const userData = userDoc.data();
        authUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: userData?.displayName || displayName || '사용자',
          role: (userData?.role as UserRole) || 'customer',
          storeId: userData?.storeId,
          createdAt: userData?.createdAt?.toDate(),
        };
      }
      
      setUser(authUser);
      return authUser;
    } else {
      // Mock 전화번호 로그인
      const mockUser: AuthUser = {
        uid: `phone-${Date.now()}`,
        email: '',
        displayName: displayName || '전화번호 사용자',
        role: 'customer',
        createdAt: new Date(),
      };
      
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
  };

  // 전화번호 회원가입
  const signUpWithPhone = async (
    phoneNumber: string,
    code: string,
    displayName: string
  ): Promise<void> => {
    if (USE_FIREBASE && auth) {
      // Firebase Phone Auth는 sendVerificationCode와 verifyPhoneCode를 별도로 호출해야 함
      // 여기서는 이미 verifyPhoneCode가 완료된 상태라고 가정
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        throw new Error('인증이 완료되지 않았습니다.');
      }

      // 프로필 업데이트
      await updateProfile(firebaseUser, { displayName });

      // Firestore에 사용자 정보 저장
      const newUser: AuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName,
        role: 'customer',
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...newUser,
        phoneNumber: normalizePhoneNumber(phoneNumber),
        createdAt: new Date(),
      });

      setUser(newUser);
    } else {
      // Mock 전화번호 회원가입
      const newUser: AuthUser = {
        uid: `phone-${Date.now()}`,
        email: '',
        displayName,
        role: 'customer',
        createdAt: new Date(),
      };
      
      localStorage.setItem('mockUser', JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  // 프로필 업데이트
  const updateUserProfile = async (data: Partial<AuthUser>) => {
    if (!user) return;

    if (USE_FIREBASE && auth?.currentUser) {
      // Firebase 프로필 업데이트
      if (data.displayName) {
        await updateProfile(auth.currentUser, { displayName: data.displayName });
      }
      
      // Firestore 업데이트
      await setDoc(doc(db, 'users', user.uid), data, { merge: true });
    } else {
      // Mock 프로필 업데이트
      const updatedUser = { ...user, ...data };
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  // 인증 코드 전송
  const sendPhoneVerificationCode = async (phone: string): Promise<ConfirmationResult> => {
    if (USE_FIREBASE) {
      const normalizedPhone = normalizePhoneNumber(phone);
      return await sendVerificationCode(normalizedPhone);
    } else {
      console.warn('[Auth] Mock sendPhoneVerificationCode called', phone);
      // Mock 모드에서는 가짜 확인 결과 반환
      return {
        verificationId: 'mock-verification-id',
        confirm: async (code: string) => {
          if (code === '123456') {
            return {
              user: {
                uid: `phone-${Date.now()}`,
                phoneNumber: phone,
              }
            } as any;
          }
          throw new Error('Invalid code');
        }
      } as ConfirmationResult;
    }
  };

  // 인증 코드 확인 및 로그인
  const verifyAndSignInWithPhone = async (
    confirmationResult: ConfirmationResult,
    code: string
  ): Promise<void> => {
    if (USE_FIREBASE) {
      await verifyPhoneCode(confirmationResult, code);
      // verifyPhoneCode 내부에서 signInWithCredential을 호출하므로
      // onAuthStateChanged가 트리거되어 사용자 상태가 업데이트됨
    } else {
      console.warn('[Auth] Mock verifyAndSignInWithPhone called', code);
      if (code !== '123456') {
        throw new Error('인증번호가 올바르지 않습니다.');
      }
      // Mock 로그인 처리
      await signInWithPhone('01012345678', code);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    initializing,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithPhone,
    signUpWithPhone,
    sendPhoneVerificationCode,
    verifyAndSignInWithPhone,
    signOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

```

---

## src\contexts\CartContext.tsx

```tsx
import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import type { CartContextType, CartItem, DeliveryType, DeliveryAddress } from '../types/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'hyunpung_cart';
const MIN_ORDER_DELIVERY = 15000;
const MIN_ORDER_PICKUP = 5000;
const BASE_DELIVERY_FEE = 3000;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryTypeState] = useState<DeliveryType>('delivery');
  const [deliveryAddress, setDeliveryAddressState] = useState<DeliveryAddress | undefined>();
  const [requests, setRequestsState] = useState<string>('');
  const [couponId, setCouponId] = useState<string | undefined>();
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // T2-15: Cart hydration / storage sync 안정화 리팩터
  // - Phase 1: Mock/Firebase 공통에서 결정적 초기화 보장 (loadFromStorage 단일화)
  // - forceReload를 얇은 wrapper로 단순화하여 중복 로직 제거
  // - 이벤트(storage / visibility / focus) 한 곳에서 바인딩
  // TODO(T2-15): Phase 2에서 order-flow E2E 재활성화 후 디버그 로그 제거 + 필요 시 testId 기반 개선
  // 단일 진실: localStorage에서 장바구니 로드 (JSON 파싱 실패 시 안전하게 무시)
  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const data = JSON.parse(stored);
      setItems(data.items || []);
      setDeliveryTypeState(data.deliveryType || 'delivery');
      setDeliveryAddressState(data.deliveryAddress);
      setRequestsState(data.requests || '');
      setCouponId(data.couponId);
      setCouponDiscount(data.couponDiscount || 0);
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // 초기 마운트 + 이벤트 바인딩(useEffect 하나만 사용)
  useEffect(() => {
    loadFromStorage();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) loadFromStorage();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') loadFromStorage();
    };
    const handleFocus = () => {
      loadFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 장바구니 상태 변경 시 로컬 스토리지 저장 (초기 마운트 제외)
  const isInitialMount = useRef(true);
  useEffect(() => {
    // 초기 마운트 시에는 저장하지 않음 (loadFromStorage가 먼저 실행되도록)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          items,
          deliveryType,
          deliveryAddress,
          requests,
          couponId,
          couponDiscount,
        })
      );
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items, deliveryType, deliveryAddress, requests, couponId, couponDiscount]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      // 동일한 메뉴와 옵션이 있는지 확인
      const existingIndex = prev.findIndex(
        (i) =>
          i.menuId === item.menuId &&
          i.options.noodle === item.options.noodle &&
          i.options.spicy === item.options.spicy &&
          JSON.stringify(i.options.toppings?.sort()) === JSON.stringify(item.options.toppings?.sort())
      );

      if (existingIndex >= 0) {
        // 기존 항목 수량 증가
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        updated[existingIndex].subtotal = 
          (item.menuPrice + item.optionPrices.noodle + item.optionPrices.toppings) * 
          updated[existingIndex].quantity;
        return updated;
      }

      // 새 항목 추가
      return [...prev, item];
    });
  };

  const removeItem = (menuId: string) => {
    setItems((prev) => prev.filter((item) => item.menuId !== menuId));
  };

  const updateQuantity = (menuId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.menuId === menuId) {
          const unitPrice = item.menuPrice + item.optionPrices.noodle + item.optionPrices.toppings;
          return {
            ...item,
            quantity,
            subtotal: unitPrice * quantity,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponId(undefined);
    setCouponDiscount(0);
    setRequestsState('');
  };

  const setDeliveryType = (type: DeliveryType) => {
    setDeliveryTypeState(type);
  };

  const setDeliveryAddress = (address: DeliveryAddress) => {
    setDeliveryAddressState(address);
  };

  const setRequests = (req: string) => {
    setRequestsState(req);
  };

  const applyCoupon = (id: string, discount: number) => {
    setCouponId(id);
    setCouponDiscount(discount);
  };

  const removeCoupon = () => {
    setCouponId(undefined);
    setCouponDiscount(0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.subtotal, 0);
  };

  const getDeliveryFee = () => {
    if (deliveryType === 'pickup') return 0;
    
    const subtotal = getSubtotal();
    
    // 최소 주문 금액 미달 시 배달 불가
    if (subtotal < MIN_ORDER_DELIVERY) return 0;
    
    // 실제로는 거리 기반 계산
    // TODO: 주소에서 거리 계산 후 배달비 산정
    return BASE_DELIVERY_FEE;
  };

  const getTotalAmount = () => {
    const subtotal = getSubtotal();
    const deliveryFee = getDeliveryFee();
    return subtotal + deliveryFee - couponDiscount;
  };

  // forceReload: loadFromStorage thin wrapper (추가 부작용 없이 재동기화 전용)
  const forceReload = useCallback(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <CartContext.Provider
      value={{
        items,
        deliveryType,
        deliveryAddress,
        requests,
        couponId,
        couponDiscount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setDeliveryType,
        setDeliveryAddress,
        setRequests,
        applyCoupon,
        removeCoupon,
        getTotalItems,
        getSubtotal,
        getDeliveryFee,
        getTotalAmount,
        forceReload,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

```

---
