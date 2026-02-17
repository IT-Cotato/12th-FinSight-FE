import { apiFetch } from './fetcher'; // 기존 fetcher.ts를 가져옵니다.

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://finsight-deploy.duckdns.org';

// 토큰 재발급 함수
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    // 리프레시 요청은 fetch를 직접 씁니다 (무한루프 방지)
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) throw new Error('Refresh failed');

    const data = await res.json();
    // 백엔드 응답 구조에 따라 data.data.accessToken 인지 data.accessToken 인지 확인 필요
    const { accessToken, refreshToken: newRefreshToken } = data.data || data; 

    // 새 토큰 저장
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

    return accessToken;
  } catch (error) {
    // 재발급 실패 시 로그아웃
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw error;
  }
};

// client.ts를 대체할 최종 함수
export const authFetch = async <T = any>(
  path: string, 
  options: RequestInit = {}
): Promise<T> => {
  try {
    // 1. 기존 fetcher로 요청 시도
    return await apiFetch<T>(path, options);
  } catch (error: any) {
    // 2. 401(토큰 만료) 에러가 발생하면 잡아서 처리
    if (error.status === 401) {
      try {
        // 토큰 재발급 시도
        const newToken = await refreshAccessToken();
        
        // 3. 재발급 성공 시, 새 토큰을 끼워서 '원래 요청' 재시도
        return await apiFetch<T>(path, {
          ...options,
          // apiFetch는 options.token이 있으면 그걸 우선 사용에 넣어줍니다.
          token: newToken, 
        } as any);
      } catch (refreshError) {
        // 재발급도 실패하면 원래 에러 던짐
        throw error;
      }
    }
    // 401이 아닌 다른 에러는 그냥 던짐
    throw error;
  }
};