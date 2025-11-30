import { initializeApp } from "firebase/app";

import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from "firebase/analytics";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

import { getMessaging, getToken, onMessage, type MessagePayload } from "firebase/messaging";

// Storage 버킷 이름: 환경 변수 우선, 없으면 기본값 사용
const STORAGE_BUCKET =
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hyun-poong.firebasestorage.app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hyun-poong",
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
} as const;

export const app = initializeApp(firebaseConfig);

// DEBUG 모드에서만 전체 firebaseConfig 로그 출력
if (import.meta.env.MODE !== "production") {
  console.log("========================================");
  console.log("[Firebase Config] Actual Runtime Values:");
  console.log("========================================");
  console.log("storageBucket:", app.options.storageBucket);
  console.log("projectId:", app.options.projectId);
  console.log("authDomain:", app.options.authDomain);
  console.log(
    "apiKey:",
    app.options.apiKey ? `${app.options.apiKey.substring(0, 20)}...` : "undefined",
  );
  console.log("messagingSenderId:", app.options.messagingSenderId);
  console.log("appId:", app.options.appId);
  console.log("measurementId:", app.options.measurementId);
  console.log("----------------------------------------");
  console.log("[Firebase Config] Full Config Object:");
  console.log(
    JSON.stringify(
      {
        apiKey: app.options.apiKey ? `${app.options.apiKey.substring(0, 20)}...` : undefined,
        authDomain: app.options.authDomain,
        projectId: app.options.projectId,
        storageBucket: app.options.storageBucket,
        messagingSenderId: app.options.messagingSenderId,
        appId: app.options.appId,
        measurementId: app.options.measurementId,
      },
      null,
      2,
    ),
  );
  console.log("========================================");
}

// Analytics (지원 브라우저에서만)
export let analytics: Analytics | null = null;

isAnalyticsSupported().then(supported => {
  if (supported) analytics = getAnalytics(app);
});

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Storage: firebaseConfig의 storageBucket 사용 (명시적 버킷 지정 제거)
export const storage = getStorage(app);

interface FirebaseStorageInternal {
  _location?: { bucket: string };
  _bucket?: { name: string };
}

// 🛡️ 재발 방지: Storage 버킷 검증 (FATAL 차단)
const storageInternal = storage as unknown as FirebaseStorageInternal;
const activeBucket = storageInternal._location?.bucket || storageInternal._bucket?.name || "UNKNOWN";

// appspot.com 버킷 사용 시 즉시 차단
if (activeBucket.includes("appspot.com")) {
  const errorMsg = `[FATAL] WRONG STORAGE BUCKET DETECTED → appspot.com fallback 발생. Bucket: ${activeBucket}. 환경 변수 VITE_FIREBASE_STORAGE_BUCKET를 확인하세요.`;
  console.error(errorMsg);
  throw new Error("INVALID_STORAGE_BUCKET: " + errorMsg);
}

// 🔍 Storage 버킷 진단 로그 (개발/운영 모두)
if (import.meta.env.MODE !== "production") {
  console.log("[Firebase Storage] Initialized");
  console.log("[Firebase Storage] Config storageBucket:", app.options.storageBucket);
  console.log("[Firebase Storage] Actual bucket:", activeBucket);
  if (activeBucket !== app.options.storageBucket) {
    console.warn("[Firebase Storage] ⚠️ 버킷 불일치 감지!");
    console.warn("[Firebase Storage] Config:", app.options.storageBucket);
    console.warn("[Firebase Storage] Actual:", activeBucket);
  }
}

// FCM

export const messaging = (() => {
  try {
    return getMessaging(app);
  } catch {
    return null;
  }
})();

export async function requestFcmToken() {
  if (!messaging) return null;

  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    return token;
  } catch (err) {
    console.error("FCM token error:", err);

    return null;
  }
}

export function onForegroundMessage(handler: (payload: MessagePayload) => void) {
  if (!messaging) return;

  onMessage(messaging, handler);
}
