// 인증번호 발송 요청
export interface SendVerificationRequest {
  email: string;
}

// 인증번호 발송 응답
export interface SendVerificationResponse {
  status: string;
  data: object;  // 빈 객체 타입
}

// 비밀번호 찾기용 인증번호 발송
export interface SendPasswordResetCodeRequest {
  email: string;
}

export interface SendPasswordResetCodeResponse {
  status: string;
  data: object;
}

// 인증번호 확인
export interface VerifyCodeRequest {
    email: string;
    code: string;
}

export interface VerifyCodeResponse {
    status: string;
    data: object;
}

// 비밀번호 재설정
export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  status: string;
  data: object;
}

// 로그인
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// 토큰 재발급
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  status: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// 닉네임 중복 확인
export interface CheckNicknameRequest {
  nickname: string;
}

export interface CheckNicknameResponse {
  status: string;
  data: object;
}

// 카카오 로그인
export interface KakaoLoginRequest {
  code: string;
}

export interface KakaoLoginResponse {
  status: string;
  data: {
    accessToken: string;
    refreshToken: string;
    kakaoId: string;
    isNewUser: boolean;
  };
}

// 카카오 회원가입
export interface KakaoSignupRequest {
  kakaoId: string;
  nickname: string;
}

export interface KakaoSignupResponse {
  status: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// 일반 회원가입 요청
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

// 일반 회원가입 응답
export interface SignupResponse {
  status: boolean;
  message?: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}