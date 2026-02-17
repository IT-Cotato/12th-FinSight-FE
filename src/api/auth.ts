import { apiClient } from './client';
import type {
  SendVerificationRequest,
  SendVerificationResponse,
  SendPasswordResetCodeRequest,
  SendPasswordResetCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  CheckNicknameRequest,
  CheckNicknameResponse,
  KakaoLoginRequest,
  KakaoLoginResponse,
  KakaoSignupRequest,
  KakaoSignupResponse,
} from '@/types/api';

// 회원가입 - 인증번호 발송
export const sendVerificationCode = async (data: SendVerificationRequest): Promise<SendVerificationResponse> => {
  try {
    const response = await apiClient.post<SendVerificationResponse>('/auth/send-code', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: '인증번호 발송에 실패했습니다.' };
  }
};

// 비밀번호 찾기 - 인증번호 발송
export const sendPasswordResetCode = async (data: SendPasswordResetCodeRequest): Promise<SendPasswordResetCodeResponse> => {
  try {
    const response = await apiClient.post<SendPasswordResetCodeResponse>('/auth/password/send-code', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: '인증번호 발송에 실패했습니다.' };
  }
};

// 인증번호 확인
export const verifyCode = async (data: VerifyCodeRequest): Promise<VerifyCodeResponse> => {
  try {
    const response = await apiClient.post<VerifyCodeResponse>('/auth/verify-code', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: '인증번호가 일치하지 않습니다.' };
  }
};

// 비밀번호 재설정
export const resetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  try {
    const response = await apiClient.post<ResetPasswordResponse>('/auth/password/reset', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: '비밀번호 재설정에 실패했습니다.' };
  }
};

// 로그인 (토큰 저장 로직 유지)
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    
    // 💡 안전한 토큰 저장을 위해 분기 처리 유지
    if (typeof window !== 'undefined' && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: '로그인에 실패했습니다.' };
  }
};

// 토큰 재발급
export const refreshAccessToken = async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
  try {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', data);
    
    // 💡 재발급 받은 토큰도 다시 저장해줘야 합니다.
    if (typeof window !== 'undefined' && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: '토큰 재발급에 실패했습니다.' };
  }
};

// 닉네임 중복 확인
export const checkNickname = async (data: CheckNicknameRequest): Promise<CheckNicknameResponse> => {
  try {
    const response = await apiClient.post<CheckNicknameResponse>('/auth/check-nickname', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: '닉네임 확인에 실패했습니다.' };
  }
};

// 카카오 로그인
export const kakaoLogin = async (data: KakaoLoginRequest): Promise<KakaoLoginResponse> => {
  try {
    console.log('카카오 로그인 API 호출:', {
      url: '/auth/kakao/login',
      code: data.code,
    });
    
    const response = await apiClient.post<KakaoLoginResponse>('/auth/kakao/login', data);
    
    console.log('카카오 로그인 성공:', response.data);
    
    // 토큰 저장
    if (typeof window !== 'undefined' && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('카카오 로그인 API 에러 상세:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      fullError: error,
    });
    
    throw error.response?.data || { message: '카카오 로그인에 실패했습니다.' };
  }
};

// 카카오 회원가입
export const kakaoSignup = async (data: KakaoSignupRequest): Promise<KakaoSignupResponse> => {
  try {
    const response = await apiClient.post<KakaoSignupResponse>('/auth/kakao/signup', data);
    
    // 토큰 저장
    if (typeof window !== 'undefined' && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: '카카오 회원가입에 실패했습니다.' };
  }
};