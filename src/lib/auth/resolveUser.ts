import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { USE_FIREBASE } from '../../config/env';
import type { AuthUser } from '../../contexts/AuthContext';

export function loadMockUserFromStorage(): AuthUser | null {
  try {
    const mockUserData = localStorage.getItem('mockUser');
    if (!mockUserData) {
      console.warn('[Auth] mockUser가 localStorage에 없습니다');
      return null;
    }
    const parsed = JSON.parse(mockUserData) as AuthUser;
    return parsed;
  } catch (error) {
    console.error('[Auth] Mock 사용자 로드 실패:', error);
    return null;
  }
}

export async function resolveUserFromFirebaseUser(firebaseUser: FirebaseUser): Promise<AuthUser> {
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  const userData = userDoc.data() as any | undefined;

  const displayName =
    userData?.displayName ||
    firebaseUser.displayName ||
    '손님';

  // 관리자 이메일 주소에 대한 기본 역할 설정
  const adminEmails = ['admin@hyunpoongkalguksu.com'];
  let role: AuthUser['role'] = (userData?.role as AuthUser['role']) || 'customer';

  // Firestore에 role이 없고 관리자 이메일인 경우 기본값 설정
  if (!userData?.role && adminEmails.includes(firebaseUser.email || '')) {
    role = 'owner';
  }

  const authUser: AuthUser = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName,
    role,
    photoURL: firebaseUser.photoURL || userData?.photoURL,
    storeId: userData?.storeId,
    phoneNumber: userData?.phoneNumber || firebaseUser.phoneNumber || undefined,
    createdAt: userData?.createdAt?.toDate
      ? userData.createdAt.toDate()
      : undefined,
  };

  return authUser;
}

export async function resolveUser(
  firebaseUser: FirebaseUser | null
): Promise<AuthUser | null> {
  if (USE_FIREBASE && firebaseUser) {
    try {
      const authUser = await resolveUserFromFirebaseUser(firebaseUser);
      return authUser;
    } catch (error) {
      console.error('[Auth] Firestore 사용자 정보 로드 실패:', error);
    }
  }
  const mockUser = loadMockUserFromStorage();
  if (mockUser) {
    return mockUser;
  }
  return null;
}
