import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// AuthResolver: Firebase → localStorage(mockUser) → minimal default
// 반환 객체는 AuthContext의 AuthUser와 동일한 shape를 따릅니다.
export async function resolveUser(firebaseUser: FirebaseUser): Promise<{
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'owner' | 'admin';
  photoURL?: string;
  storeId?: string;
  createdAt: Date;
}> {
  let resolved: any = null;
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();
    if (userData) {
      resolved = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || (userData as any).displayName || '사용자',
        photoURL: firebaseUser.photoURL || undefined,
        role: ((userData as any).role as any) || 'customer',
        storeId: (userData as any).storeId ?? undefined,
        createdAt: (userData as any).createdAt?.toDate?.() || new Date(),
      };
    }
  } catch (e) {
    // no-op: fallback으로 진행
    // console.warn('[resolveUser] Firestore userDoc read 실패, mockUser fallback 진행', e);
  }

  if (!resolved) {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('mockUser') : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        resolved = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || parsed.email || '',
          displayName: parsed.displayName || firebaseUser.displayName || '사용자',
          role: (parsed.role as any) || 'customer',
          storeId: parsed.storeId ?? undefined,
          createdAt: new Date(),
        };
      }
    } catch (e) {
      // no-op: 최종 디폴트로 진행
      // console.error('[resolveUser] mockUser fallback 실패', e);
    }
  }

  if (!resolved) {
    resolved = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '사용자',
      role: 'customer',
      storeId: undefined,
      createdAt: new Date(),
    };
  }

  return resolved;
}
