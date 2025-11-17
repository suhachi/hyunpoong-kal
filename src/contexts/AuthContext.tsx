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
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { USE_FIREBASE } from '../config/env';
import { resolveUser } from '../lib/auth/resolveUser';

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
