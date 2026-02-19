"use client";

import { useEffect } from "react";
import { useFCM } from "@/hooks/useFCM";

/**
 * FCM 초기화 및 토큰 등록 컴포넌트
 * 앱이 시작될 때 자동으로 FCM 토큰을 등록합니다.
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

    // 알림 권한이 이미 허용되어 있거나, 아직 요청하지 않은 경우에만 토큰 등록
    if (permission === "granted" || permission === "default") {
      // 약간의 지연을 두어 앱 초기화가 완료된 후 토큰 등록
      const timer = setTimeout(() => {
        registerToken().catch((error) => {
          console.error("Failed to register FCM token:", error);
        });
      }, 2000); // 2초 후 토큰 등록

      return () => clearTimeout(timer);
    }
  }, [permission, registerToken]);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
}
