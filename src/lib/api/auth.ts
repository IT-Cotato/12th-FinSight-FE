// 공통 인증 관련 유틸리티 함수들

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || null;

/**
 * 액세스 토큰을 가져옵니다.
 */
export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
}

/**
 * API 요청을 위한 공통 헤더를 생성합니다.
 */
export function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * 401 에러 발생 시 토큰 재발급을 시도합니다.
 * @returns 토큰 재발급 성공 여부
 */
export async function handle401Error(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    // 리프레시 토큰 없음 → 로그인 페이지로
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
    return false;
  }

  try {
    // 토큰 재발급 API 호출
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("토큰 재발급 실패");
    }

    const data = await response.json();
    const { accessToken, refreshToken: newRefreshToken } = data.data;

    // 새 토큰 저장
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return true;
  } catch (error) {
    // 리프레시 토큰도 만료 → 로그아웃
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    return false;
  }
}

/**
 * 인증이 포함된 fetch 요청을 수행합니다.
 * 401 에러 발생 시 자동으로 토큰 재발급 후 재시도합니다.
 * @param url 요청 URL
 * @param options fetch 옵션
 * @returns Response 객체
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // 기본 헤더에 인증 헤더 추가
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // 401 에러 발생 시 토큰 재발급 후 재시도
  if (response.status === 401) {
    const tokenRefreshed = await handle401Error();
    if (tokenRefreshed) {
      // 토큰 재발급 성공 시 재시도
      response = await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      });
    } else {
      // 토큰 재발급 실패 (로그인 페이지로 리다이렉트됨)
      throw new Error("인증에 실패했습니다. 다시 로그인해주세요.");
    }
  }

  return response;
}
