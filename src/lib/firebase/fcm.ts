// FCM (Firebase Cloud Messaging) 토큰 관리 유틸리티

import { messaging } from "./config";
import { getToken, onMessage, MessagePayload } from "firebase/messaging";
import { registerFCMToken } from "@/lib/api/fcm";

// VAPID 키는 Firebase Console > 프로젝트 설정 > 클라우드 메시징에서 확인 가능
// Web Push 인증서 키를 여기에 설정해야 합니다
const VAPID_KEY = process.env.NEXT_PUBLIC_FCM_VAPID_KEY || "";

/**
 * FCM 토큰 발급 및 서버에 등록
 */
export async function requestFCMPermissionAndRegister(): Promise<string | null> {
  if (!messaging) {
    console.warn("Firebase Messaging is not available");
    return null;
  }

  try {
    // 알림 권한 요청
    const permission = await Notification.requestPermission();
    
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return null;
    }

    // FCM 토큰 발급
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    if (!token) {
      console.warn("No FCM token available");
      return null;
    }

    // 서버에 토큰 등록
    try {
      await registerFCMToken({
        fcmToken: token,
        deviceType: "WEB",
      });
      console.log("FCM token registered successfully");
    } catch (error) {
      console.error("Failed to register FCM token:", error);
      // 토큰 발급은 성공했지만 서버 등록 실패 시에도 토큰은 반환
    }

    // 토큰을 localStorage에 저장 (선택사항)
    if (typeof window !== "undefined") {
      localStorage.setItem("fcmToken", token);
    }

    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}

/**
 * 현재 FCM 토큰 가져오기
 */
export async function getCurrentFCMToken(): Promise<string | null> {
  if (!messaging) {
    return null;
  }

  try {
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });
    return token || null;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}

/**
 * 포그라운드에서 메시지 수신 시 처리
 * @param callback 메시지 수신 시 실행할 콜백 함수
 */
export function onForegroundMessage(
  callback: (payload: MessagePayload) => void
): () => void {
  if (!messaging) {
    console.warn("Firebase Messaging is not available");
    return () => {};
  }

  return onMessage(messaging, callback);
}

/**
 * 알림 권한 상태 확인
 */
export function getNotificationPermission(): NotificationPermission {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
}
