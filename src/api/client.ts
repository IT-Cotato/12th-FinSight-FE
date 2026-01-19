import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://13.62.157.0:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (수정: accessToken 사용)
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (자동 토큰 재발급)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          try {
            // 토큰 재발급 API 호출
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
              { refreshToken }
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data.data;

            // 새 토큰 저장
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            // 원래 요청에 새 토큰 적용
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            // 원래 요청 재시도
            return apiClient(originalRequest);
          } catch (refreshError) {
            // 리프레시 토큰도 만료 → 로그아웃
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        } else {
          // 리프레시 토큰 없음 → 로그인 페이지로
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);