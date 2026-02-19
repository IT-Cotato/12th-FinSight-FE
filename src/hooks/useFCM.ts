"use client";

import { useEffect, useState, useCallback } from "react";
import {
  requestFCMPermissionAndRegister,
  getCurrentFCMToken,
  onForegroundMessage,
  getNotificationPermission,
  type MessagePayload,
} from "@/lib/firebase/fcm";

/**
 * FCM 푸시 알림 관리 훅
 */
export function useFCM() {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 알림 권한 상태 확인
  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  // FCM 토큰 발급 및 등록
  const registerToken = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fcmToken = await requestFCMPermissionAndRegister();
      setToken(fcmToken);
      setPermission(getNotificationPermission());
      return fcmToken;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to register FCM token");
      setError(error);
      console.error("FCM registration error:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 현재 토큰 가져오기
  const getToken = useCallback(async () => {
    try {
      const fcmToken = await getCurrentFCMToken();
      setToken(fcmToken);
      return fcmToken;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to get FCM token");
      setError(error);
      return null;
    }
  }, []);

  // 포그라운드 메시지 수신 리스너 설정
  useEffect(() => {
    if (!token) return;

    const unsubscribe = onForegroundMessage((payload: MessagePayload) => {
      console.log("Foreground message received:", payload);
      
      // 알림 표시 (선택사항)
      if (payload.notification) {
        const { title, body, icon } = payload.notification;
        
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(title || "알림", {
            body: body || "",
            icon: icon || "/icon.png",
            badge: "/icon.png",
          });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [token]);

  return {
    token,
    permission,
    isLoading,
    error,
    registerToken,
    getToken,
  };
}
