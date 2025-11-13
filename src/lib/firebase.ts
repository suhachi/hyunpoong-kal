import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { FIREBASE_CONFIG, USE_FIREBASE } from '../config/env';

// Firebase 설정
const firebaseConfig = {
  apiKey: FIREBASE_CONFIG.apiKey || "YOUR_API_KEY",
  authDomain: FIREBASE_CONFIG.authDomain || "your-project.firebaseapp.com",
  projectId: FIREBASE_CONFIG.projectId || "your-project",
  storageBucket: FIREBASE_CONFIG.storageBucket || "your-project.appspot.com",
  messagingSenderId: FIREBASE_CONFIG.messagingSenderId || "123456789",
  appId: FIREBASE_CONFIG.appId || "1:123456789:web:abcdef",
  measurementId: FIREBASE_CONFIG.measurementId || "G-XXXXXXXXXX"
};

// Firebase 초기화 (USE_FIREBASE가 true일 때만)
let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreDb: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;
let analyticsInstance: Analytics | null = null;

if (USE_FIREBASE) {
  // eslint-disable-next-line no-console
  console.log('[Firebase] 초기화 시작 (USE_FIREBASE=true)');
  try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    firestoreDb = getFirestore(app);
    storageInstance = getStorage(app);
    analyticsInstance = typeof window !== 'undefined' ? getAnalytics(app) : null;
    // eslint-disable-next-line no-console
    console.log('[Firebase] 초기화 완료');
  } catch (error) {
    console.error('[Firebase] 초기화 실패:', error);
  }
} else {
  // eslint-disable-next-line no-console
  console.log('[Firebase] SKIP init: USE_FIREBASE=false (Mock 모드)');
}

// Mock Firestore (개발용)
const mockDb = {
  collection: () => ({
    doc: () => ({
      get: () => Promise.resolve({ exists: false, data: () => null }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve(),
      delete: () => Promise.resolve(),
    }),
    add: () => Promise.resolve({ id: 'mock-id' }),
    get: () => Promise.resolve({ docs: [], empty: true }),
    where: () => mockDb.collection(),
    orderBy: () => mockDb.collection(),
    limit: () => mockDb.collection(),
  }),
} as any;

// Export (null일 경우 mock 반환)
export const auth = authInstance;
export const storage = storageInstance;
export const analytics = analyticsInstance;
export const db = USE_FIREBASE && firestoreDb ? firestoreDb : mockDb;
export default app;
