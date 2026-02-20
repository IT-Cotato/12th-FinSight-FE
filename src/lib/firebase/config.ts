// Firebase 설정 파일

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";
import { getAnalytics, Analytics } from "firebase/analytics";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDM6J24zGtAzSf08a3eS_ZDte4-LuaxfsY",
  authDomain: "finsight-pwa.firebaseapp.com",
  projectId: "finsight-pwa",
  storageBucket: "finsight-pwa.firebasestorage.app",
  messagingSenderId: "667333552486",
  appId: "1:667333552486:web:f63f36e4940c9abb6480a7",
  measurementId: "G-TBB6T3SEW2"
};

// Firebase 앱 초기화 (중복 초기화 방지)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Analytics 초기화 (브라우저 환경에서만)
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn("Analytics initialization failed:", error);
  }
}

// Messaging 초기화 (브라우저 환경에서만)
let messaging: Messaging | null = null;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  try {
    // Service Worker 등록 확인
    navigator.serviceWorker.ready.then((registration) => {
      console.log("Service Worker ready:", registration);
    }).catch((error) => {
      console.warn("Service Worker registration error:", error);
    });

    messaging = getMessaging(app);
  } catch (error) {
    console.warn("Messaging initialization failed:", error);
  }
}

export { app, analytics, messaging };
