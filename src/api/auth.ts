import { apiClient } from './client';
import type {
  SendVerificationRequest,
  SendVerificationResponse,
  SendPasswordResetCodeRequest,  // 비밀번호 찾기용 인증번호
  SendPasswordResetCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResetPasswordRequest,    // 비밀번호 재설정
  ResetPasswordResponse,
  LoginRequest,              // 토큰 관련
  LoginResponse,             
  RefreshTokenRequest,       
  RefreshTokenResponse,
  CheckNicknameRequest,      // 닉네임 중복 여부 확인
  CheckNicknameResponse,
} from '@/types/api';

// 회원가입 - 인증번호 발송
export const sendVerificationCode = async (
  data: SendVerificationRequest
): Promise<SendVerificationResponse> => {
  try {
    const response = await apiClient.post<SendVerificationResponse>(
      '/auth/send-code',
      data
    );
    return response.data;
  } catch (error: any) {
    throw {
      status: 'error',
      message: error.response?.data?.message || '인증번호 발송에 실패했습니다.',
    };
  }
};

// 비밀번호 찾기 - 인증번호 발송
export const sendPasswordResetCode = async (
  data: SendPasswordResetCodeRequest
): Promise<SendPasswordResetCodeResponse> => {
  try {
    const response = await apiClient.post<SendPasswordResetCodeResponse>(
      '/auth/password/send-code',  // 비밀번호 찾기 전용 경로
      data
    );
    return response.data;
  } catch (error: any) {
    throw {
      status: 'error',
      message: error.response?.data?.message || '인증번호 발송에 실패했습니다.',
    };
  }
};

// 기존: 인증번호 확인
export const verifyCode = async (
  data: VerifyCodeRequest
): Promise<VerifyCodeResponse> => {
  try {
    const response = await apiClient.post<VerifyCodeResponse>(
      '/auth/verify-code',
      data
    );
    return response.data;
  } catch (error: any) {
    throw {
      status: 'error',
      message: error.response?.data?.message || '인증번호가 일치하지 않습니다.',
    };
  }
};

// 비밀번호 재설정
export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  try {
    const response = await apiClient.post<ResetPasswordResponse>(
      '/auth/password/reset',
      data
    );
    return response.data;
  } catch (error: any) {
    throw {
      status: 'error',
      message: error.response?.data?.message || '비밀번호 재설정에 실패했습니다.',
    };
  }
};

// 로그인
export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    
    // 토큰 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    
    return response.data;
  } catch (error: any) {
    throw {
      status: 'error',
      message: error.response?.data?.message || '로그인에 실패했습니다.',
    };
  }
};

// 토큰 재발급
export const refreshAccessToken = async (
  data: RefreshTokenRequest
): Promise<RefreshTokenResponse> => {
  try {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', data);
    return response.data;
  } catch (error: any) {
    throw {
      status: 'error',
      message: error.response?.data?.message || '토큰 재발급에 실패했습니다.',
    };
  }
};

// 닉네임 중복 확인
export const checkNickname = async (
  data: CheckNicknameRequest
): Promise<CheckNicknameResponse> => {
  try {
    const response = await apiClient.post<CheckNicknameResponse>(
      '/auth/check-nickname',
      data
    );
    return response.data;
  } catch (error: any) {
    throw {
      status: 'error',
      message: error.response?.data?.message || '닉네임 확인에 실패했습니다.',
    };
  }
};