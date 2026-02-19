// FCM (Firebase Cloud Messaging) API 관련 함수들

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || null;

/**
 * 액세스 토큰을 가져옵니다.
 */
function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
}

/**
 * API 요청을 위한 공통 헤더를 생성합니다.
 */
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export type FCMTokenRegisterRequest = {
  fcmToken: string;
  deviceType: "WEB" | "IOS" | "ANDROID";
};

export type FCMTokenRegisterResponse = {
  status: string;
  data: Record<string, never>;
};

/**
 * FCM 토큰 등록
 * @param params FCM 토큰 등록 요청 파라미터
 * @returns FCM 토큰 등록 응답
 */
export async function registerFCMToken(
  params: FCMTokenRegisterRequest
): Promise<FCMTokenRegisterResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/fcm/token`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(params),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to register FCM token: ${response.statusText}`);
  }

  return response.json();
}
