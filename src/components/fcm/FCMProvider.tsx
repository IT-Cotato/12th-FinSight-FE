"use client";

import { useEffect } from "react";
import { useFCM } from "@/hooks/useFCM";
import { getMyNotification } from "@/lib/api/mypage";

/**
 * FCM 초기화 및 토큰 등록 컴포넌트
 * 마이페이지 알림 설정이 ON인 경우에만 FCM 토큰을 자동 등록합니다.
 */
export function FCMProvider() {
  const { registerToken, permission } = useFCM();

  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window === "undefined") return;

    // Service Worker 지원 확인
    if (!("serviceWorker" in navigator)) {
      console.warn("Service Worker is not supported");
      return;
    }

    const initFCM = async () => {
      try {
        // 마이페이지 알림 설정이 ON인 경우에만 토큰 등록
        const notificationEnabled = await getMyNotification();
        if (!notificationEnabled) return;

        // 알림 권한이 이미 허용되어 있거나, 아직 요청하지 않은 경우에만 토큰 등록
        if (permission === "granted" || permission === "default") {
          await registerToken();
        }
      } catch (error) {
        console.warn("FCM 초기화 실패 (로그인 전이거나 알림 OFF):", error);
      }
    };

    // 약간의 지연을 두어 앱 초기화가 완료된 후 토큰 등록
    const timer = setTimeout(initFCM, 2000);

    return () => clearTimeout(timer);
  }, [permission, registerToken]);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
}
