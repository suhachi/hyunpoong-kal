import { initializeApp } from "firebase/app";

import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

import { getMessaging, getToken, onMessage } from "firebase/messaging";



const firebaseConfig = {

  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,

  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,

  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

  appId: import.meta.env.VITE_FIREBASE_APP_ID,

  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,

};



export const app = initializeApp(firebaseConfig);



// Analytics (지원 브라우저에서만)

export let analytics: any = null;

isAnalyticsSupported().then((supported) => {

  if (supported) analytics = getAnalytics(app);

});



// Services

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);



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



export function onForegroundMessage(handler: (payload: any) => void) {

  if (!messaging) return;

  onMessage(messaging, handler);

}
