import axios from 'axios';

// 1. 기본 설정
export const apiClient = axios.create({
  // 환경 변수가 없을 때를 대비한 기본값 유지
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://finsight-deploy.duckdns.org/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 요청 인터셉터: 창고(localStorage)에서 열쇠(토큰) 꺼내서 배달원에게 주기
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        // Bearer 형식으로 헤더에 부착
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. 응답 인터셉터: 토큰 만료 시 자동으로 재발급 받기
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401(인증 만료) 에러가 발생했을 때만 동작
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          try {
            // 💡 주의: 재발급 시에는 apiClient 대신 일반 axios를 사용하거나 별도 설정을 해야 무한 루프를 방지합니다.
            const response = await axios.post(
              `${apiClient.defaults.baseURL}/auth/refresh`, // baseURL을 그대로 활용
              { refreshToken }
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data.data;

            // 새 토큰 저장
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            // 원래 실패했던 요청에 새 토큰을 넣어서 다시 시도
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(originalRequest);
          } catch (refreshError) {
            // 리프레시 토큰까지 문제가 있다면 강제 로그아웃
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        } else {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);