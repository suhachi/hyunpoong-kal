# Contexts - Full Source Code

**Generated**: 2025-11-14-1904  
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

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { USE_FIREBASE } from '../config/env';

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
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signInWithGoogle: () => Promise<AuthUser>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock 사용자 데이터 (개발용)
const MOCK_USERS = {
  'admin@hyunpungkalguksu.com': {
    uid: 'admin-001',
    email: 'admin@hyunpungkalguksu.com',
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

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[AuthContext] 🔍 USE_FIREBASE:', USE_FIREBASE);
    
    if (USE_FIREBASE && auth) {
      // Firebase Auth 리스너
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            // Firestore에서 사용자 추가 정보 가져오기
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            const userData = userDoc.data();
            
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '사용자',
              photoURL: firebaseUser.photoURL || undefined,
              role: userData?.role || 'customer',
              storeId: userData?.storeId,
              createdAt: userData?.createdAt?.toDate(),
            });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('[AuthContext] 사용자 정보 로드 실패:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    } else {
      // Mock Auth
      console.log('[AuthContext] 🔍 USE_FIREBASE:', USE_FIREBASE);
      console.log('[AuthContext] 🔍 Mock 모드 초기화 시작');
      try {
        const mockUserData = localStorage.getItem('mockUser');
        console.log('[AuthContext] 📦 mockUserData:', mockUserData);
        if (mockUserData) {
          const parsed = JSON.parse(mockUserData);
          console.log('[AuthContext] ✅ 파싱 성공:', parsed);
          setUser(parsed);
        } else {
          console.warn('[AuthContext] ⚠️ mockUser가 localStorage에 없습니다');
        }
      } catch (error) {
        console.error('[AuthContext] ❌ Mock 사용자 로드 실패:', error);
      } finally {
        setLoading(false);
        console.log('[AuthContext] 🏁 초기화 완료, loading=false');
      }
    }
  }, []);

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

      const authUser: AuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: firebaseUser.displayName || '사용자',
        photoURL: firebaseUser.photoURL || undefined,
        role: userData?.role || 'customer',
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

      let authUser: AuthUser;

      if (!userDoc.exists()) {
        // 신규 사용자면 Firestore에 저장
        authUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '사용자',
          photoURL: firebaseUser.photoURL || undefined,
          role: 'customer',
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
        authUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '사용자',
          photoURL: firebaseUser.photoURL || undefined,
          role: userData?.role || 'customer',
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

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
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
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  // 로컬 스토리지에서 장바구니 복원
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setItems(data.items || []);
        setDeliveryTypeState(data.deliveryType || 'delivery');
        setDeliveryAddressState(data.deliveryAddress);
        setRequestsState(data.requests || '');
        setCouponId(data.couponId);
        setCouponDiscount(data.couponDiscount || 0);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // 장바구니 상태 변경 시 로컬 스토리지 저장
  useEffect(() => {
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
