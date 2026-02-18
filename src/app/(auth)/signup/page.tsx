'use client';

import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthContainer from '../../(auth)/AuthContainer';
import { sendVerificationCode, verifyCode, checkNickname, kakaoSignup } from '@/api/auth';

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 카카오 회원가입 모드 확인
  const kakaoId = searchParams.get('kakaoId');
  const isKakaoMode = !!kakaoId;
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [timeLeft, setTimeLeft] = useState(180); // 3분 타이머용

  // focus 상태 추가
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isCodeFocused, setIsCodeFocused] = useState(false);

  // 터치 상태 추적
  const [emailTouched, setEmailTouched] = useState(false);
  const [codeTouched, setCodeTouched] = useState(false);

  // 닉네임 중복 확인 관련 state
  const [nicknameError, setNicknameError] = useState('');
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);  // 닉네임 사용 가능 여부

  // 3단계 - 비밀번호 관련 state
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordConfirmFocused, setIsPasswordConfirmFocused] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordConfirmTouched, setPasswordConfirmTouched] = useState(false);

  const [emailError, setEmailError] = useState('');

  // 인증 완료 상태
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  //닉네임 중복 확인 함수
  const handleCheckNickname = async (nickname: string) => {
    if (!nickname.trim()) {
      setNicknameError('');
      setIsNicknameChecked(false);
      return;
    }

    try {
      const response = await checkNickname({ nickname });
      
      if (response.status) {
        // 사용 가능한 닉네임
        setNicknameError('');
        setIsNicknameChecked(true);
      }
    } catch (err: any) {
      // 이미 존재하는 닉네임
      setNicknameError('이미 존재하는 닉네임입니다.');
      setIsNicknameChecked(false);
    }
  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (pwd: string) => {
    const hasMinLength = pwd.length >= 6 && pwd.length <= 18;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    
    return {
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      isValid: hasMinLength && (hasUpperCase || hasLowerCase) && hasNumber 
    };
  };

  // 추가: 비밀번호 일치 여부 확인
  const passwordsMatch = password === passwordConfirm && passwordConfirm.length > 0;

  // 비밀번호 확인 칸 표시 여부
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const passwordValidation = validatePassword(password);

  // 비밀번호 표시/숨김 상태
  const [showPassword, setShowPassword] = useState(false);
  // 회원가입 비밀번호 확인용
  const [showPasswordConfirm2, setShowPasswordConfirm2] = useState(false);  

  // 이메일 유효성 검사 함수
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 4단계 약관 동의
  const [allAgreed, setAllAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // 마크다운 **텍스트**를 <strong>텍스트</strong>로 변환하고 줄바꿈 처리
  const markdownToHtml = (text: string) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  const isButtonEnabled = () => {
  switch (step) {
    case 1:
      return name.trim().length > 0;
    case 2:
      return isValidEmail(email) && !isCodeSent;
    case 3:
      return verificationCode.length == 6;
    case 4:
      return termsAgreed && privacyAgreed; // 두 필수 약관 모두 동의 시 활성화
    default:
      return false;
  }
};

// 회원가입 완료
const handleSignup = async () => {
  setLoading(true);

  try {
    // 카카오 모드일 때는 카카오 회원가입 API 호출
    if (isKakaoMode) {
      await kakaoSignup({
        kakaoId: kakaoId!,
        nickname: name.trim(),
      });
    } else {
      // 일반 회원가입 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    router.push('/onboarding');
  } catch (err: any) {
    if (isKakaoMode) {
      setNicknameError(err.message || '회원가입에 실패했습니다.');
    } else {
      setError(err.message || '회원가입에 실패했습니다.');
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCodeSent && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isCodeSent, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? `0${s}` : s}`;
  };

  //---------------- API 연동 -------------------
  
  /** 1. 인증번호 전송 API 호출 */
const handleSendVerificationCode = async () => {
  setLoading(true);
  setError('');
  setEmailError('');
  
  try {
    // API 호출
    const response = await sendVerificationCode({ email });
    
    if (response.status) {
      setIsCodeSent(true);
      setTimeLeft(180);
      setVerificationCode('');
      setError('');
      setCodeTouched(false);
      setIsCodeVerified(false); // 재전송 시 인증 상태 초기화
    }
  } catch (err: any) {
    // 에러 처리
    setEmailError(err.message || '인증번호 발송에 실패했습니다.');
  } finally {
    setLoading(false);
  }
};

  /** 2. 인증번호 확인 API 호출 */
const handleVerifyCode = async () => {
  setLoading(true);
  setError('');
  
  try {
    //  API 호출
    const response = await verifyCode({ 
      email, 
      code: verificationCode 
    });
    
    // 성공 처리 - 인증 완료 후 바로 다음 단계로
    if (response.status) {
      setIsCodeVerified(true);
      setError('');
      handleNext();  // 인증 성공 시 자동으로 다음 단계로
    }
  } catch (err: any) {
    setError(err.message || '인증번호가 일치하지 않습니다.');
    setIsCodeVerified(false);
  } finally {
    setLoading(false);
  }
};
  //---------------------- 수정 완료 -----------------------

  // 뒤로가기 핸들러 추가
  const handleBack = () => {
    // 카카오 모드일 때 step 4에서 뒤로가면 step 1로 이동
    if (isKakaoMode && step === 4) {
      setStep(1);
      return;
    }
    
    if (step > 1) {
      setStep(step - 1);  // 이전 단계로
    } else {
      router.back();  // 1단계면 진짜 뒤로가기
    }
  };

  const handleNext = async () => {
    // 카카오 모드이고 step 1(닉네임 입력) 완료 시 step 4(약관 동의)로 이동
    if (isKakaoMode && step === 1 && isNicknameChecked) {
      setStep(4);
      return;
    }
    
    // 일반 회원가입 플로우
    if (step < 4) {
      setStep(step + 1);
    } else {
      router.push('/onboarding');
    }
  };

  const titleStyle = {
    color: 'var(--color-bg-10, #EAEFF5)',
    top: '170px',
    left: '20px',
    fontFamily: 'Pretendard',
    fontSize: '22px',
    fontWeight: 600,
    lineHeight: '130%',
    letterSpacing: '-0.22px',
    marginBottom: '8px',
  };

  const renderStepContent = () => {
    // 카카오 모드일 때는 step 1과 step 4만 보여줌
    if (isKakaoMode && step !== 1 && step !== 4) {
      return null;
    }
    
    switch (step) {
      case 1:
        return (
          <>
            <h2 style={titleStyle}>
              FinSight에서 사용할<br />이름을 입력해주세요
            </h2>
            
            <div className="mt-8">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  // 닉네임 변경 시 중복 확인 초기화
                  setNicknameError('');
                  setIsNicknameChecked(false);
                }}
                onBlur={() => {
                  setIsNameFocused(false);
                  // 포커스 벗어날 때 닉네임 중복 확인
                  if (name.trim()) {
                    handleCheckNickname(name);
                  }
                }}
                onFocus={() => setIsNameFocused(true)}
                style={{
                    top: '256px',
                    left: '20px',
                    width: '350px',
                    height: '60px',
                    backgroundColor: isNameFocused 
                        ? 'var(--color-bg-70, #2F3847)' 
                        : 'var(--color-bg-80, #1D2937)',
                    borderRadius: '8px',
                    padding: '18px 116px 18px 25px', 
                    fontSize: '14px',
                    color: name ? '#FFFFFF' : 'var(--color-gray-50, #B1B1B1)',
                    letterSpacing: '-0.14px',
                    lineHeight: '180%',
                    fontWeight: '500',
                    fontFamily: 'Pretendard',
                    border: 'none',
                    outline: 'none'
                }}
                placeholder="이름 입력"
                enterKeyHint="next"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && name && isNicknameChecked) {  // 닉네임 확인 완료 시에만
                    handleNext();
                  }
                }}
                className="w-full p-4 rounded-lg text-white"
              />

              {/* 닉네임 중복 에러 메시지 */}
              {nicknameError && (
                <p 
                  style={{
                    color: 'var(--color-primary-30)',
                    fontSize: '14px',
                    marginTop: '12px',
                    fontFamily: 'Pretendard',
                    fontWeight: '500',
                    lineHeight: '180%',
                    letterSpacing: '-0.14px',
                  }}
                >
                  이미 존재하는 닉네임입니다.
                </p>
              )}
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <h2 style={titleStyle}>
              이메일을<br />입력해주세요
            </h2>
            
            <div className="mt-8">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // 입력하면 터치 상태를 true로 설정
                  if (!emailTouched) {
                    setEmailTouched(true);
                  }
                  // 새로 입력하면 에러 메시지 초기화
                  setEmailError('');
                }}
                onFocus={() => {
                  setIsEmailFocused(true);
                  // 포커스(클릭/선택)하면 터치 상태를 true로 설정
                  if (!emailTouched) {
                    setEmailTouched(true);
                  }
                }}
                onBlur={() => setIsEmailFocused(false)}
                disabled={isCodeSent}
                style={{
                    top: '228px',
                    left: '20px',
                    width: '350px',
                    height: '60px',
                    // 한번이라도 터치되었으면 밝은 색, 아니면 어두운 색
                    backgroundColor: isCodeSent
                      ? 'var(--color-bg-70)'
                      : (!emailError && emailTouched && isEmailFocused) 
                        ? 'var(--color-bg-70)' 
                        : 'var(--color-bg-80)',
                    borderRadius: '8px',
                    padding: '18px 116px 18px 25px', 
                    fontSize: '16px',
                    letterSpacing: '-0.14px',
                    lineHeight: '180%',
                    fontWeight: '500',
                    fontFamily: 'Pretendard',
                    border: 'none',
                    outline: 'none',
                    // 입력된 텍스트는 밝은 회색, placeholder는 중간 회색
                    color: email ? 'var(--color-gray-20, #F0F0F0)' : 'var(--color-gray-50, #B1B1B1)',
                }}
                placeholder="example@email.com"
                autoFocus={!isCodeSent}
                enterKeyHint="done"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isValidEmail(email) && !isCodeSent) {
                    handleSendVerificationCode();
                  }
                }}
              />
              
              {/* 이메일 에러 메시지 - 버튼 클릭 후 이미 가입된 이메일일 경우에만 표시 */}
              {emailError && !isCodeSent && (
                <p 
                  style={{
                    color: 'var(--color-primary-30, #9C95FA)',
                    fontSize: '14px',
                    marginTop: '12px',
                    fontFamily: 'Pretendard',
                    fontWeight: '500',
                    lineHeight: '180%',
                    letterSpacing: '-0.14px',
                  }}
                >
                  {emailError}
                </p>
              )}

              {/* 인증번호 입력 필드 */}
              {isCodeSent && (
                <div className="mt-3">
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 6) {
                          setVerificationCode(value);
                          if (!codeTouched) {
                            setCodeTouched(true);
                          }
                        }
                      }}
                      onFocus={() => {
                        setIsCodeFocused(true);
                        if (!codeTouched) {
                          setCodeTouched(true);
                        }
                      }}
                      onBlur={() => setIsCodeFocused(false)}
                      placeholder="인증번호 입력"
                      maxLength={6}
                      autoFocus
                      style={{
                        width: '350px',
                        height: '60px',
                        backgroundColor: isCodeFocused
                          ? 'var(--color-bg-70, #2F3847)'
                          : 'var(--color-bg-80, #1D2937)',
                        borderRadius: '8px',
                        padding: '18px 116px 18px 25px',
                        fontSize: '16px',
                        letterSpacing: '-0.14px',
                        lineHeight: '180%',
                        fontWeight: '500',
                        fontFamily: 'Pretendard',
                        border: 'none',
                        outline: 'none',
                        color: verificationCode ? 'var(--color-gray-20, #F0F0F0)' : 'var(--color-gray-50, #B1B1B1)',
                      }}
                      enterKeyHint="done"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && verificationCode.length >= 4) {
                          handleVerifyCode();
                        }
                      }}
                    />
                    
                    {/* 재전송 버튼 */}
                    <button
                      onClick={handleSendVerificationCode}
                      style={{
                        position: 'absolute',
                        right: '21px',
                        top: '19px',
                        color: 'var(--color-primary-30, #9C95FA)',
                        fontSize: '12px',
                        fontWeight: '500',
                        lineHeight: '180%',
                        letterSpacing: '-0.12px',
                        fontFamily: 'Pretendard',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      재전송
                    </button>
                  </div>

                  {/* 타이머 */}
                  {timeLeft > 0 && (
                    <div style={{
                      marginTop: '14px',
                      color: 'var(--color-primary-30, #9C95FA)',
                      fontSize: '14px',
                      fontWeight: '500',
                      lineHeight: '180%',
                      letterSpacing: '-0.14px',
                      fontFamily: 'Pretendard',
                    }}>
                      {formatTime(timeLeft)}
                    </div>
                  )}

                  {/* 시간 만료 메시지 */}
                  {timeLeft === 0 && (
                    <p style={{
                      color: 'var(--color-primary-30, #9C95FA)',
                      fontSize: '14px',
                      marginTop: '12px',
                      fontFamily: 'Pretendard',
                      fontWeight: '500',
                      lineHeight: '180%',
                      letterSpacing: '-0.14px',
                    }}>
                      3분이 지나 인증번호가 만료되었어요. 다시 전송해주세요.
                    </p>
                  )}

                  {/* 인증번호 에러 메시지 */}
                  {error && (
                    <p style={{
                      color: 'var(--color-primary-30, #9C95FA)',
                      fontSize: '14px',
                      marginTop: '12px',
                      fontFamily: 'Pretendard',
                      fontWeight: '500',
                      lineHeight: '180%',
                      letterSpacing: '-0.14px',
                    }}>
                      {error}
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        );
      
      case 3:      
        return (
          <>
            <h2 style={titleStyle}>
              비밀번호를 입력해주세요
            </h2>
            
            <p style={{
              color: 'var(--color-gray-50)',
              fontSize: '16px',
              fontWeight: '500',
              lineHeight: '180%',
              letterSpacing: '-0.16px',
              fontFamily: 'Pretendard',
              marginTop: '6px',
              marginBottom: '22px',
            }}>
              영문, 숫자 조합 6 ~ 18자리
            </p>

            {/* 비밀번호 입력 - 아이콘 추가 */}
            <div className="mt-6 relative">
              <input
                type={showPassword ? "text" : "password"}  // 동적으로 type 변경
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value.length > 0 && !passwordTouched) {
                    setPasswordTouched(true);
                  }
                  if (e.target.value.length === 0) {
                    setPasswordTouched(false);
                  }
                }}
                onFocus={() => {
                  setIsPasswordFocused(true);
                }}
                onBlur={() => {
                  setIsPasswordFocused(false);
                }}
                style={{
                  width: '350px',
                  height: '60px',
                  backgroundColor: (passwordTouched || isPasswordFocused) ? 'var(--color-bg-70)' : 'var(--color-bg-80)',
                  borderRadius: '8px',
                  padding: '18px 116px 18px 25px',
                  fontSize: '16px',
                  letterSpacing: '-0.16px',
                  lineHeight: '180%',
                  fontWeight: '500',
                  fontFamily: 'Pretendard',
                  border: 'none',
                  outline: 'none',
                  color: password ? 'var(--color-gray-20)' : 'var(--color-gray-50)',
                }}
                placeholder="비밀번호 입력"
                enterKeyHint="next"
                disabled={showPasswordConfirm}
              />

              {/* 눈 아이콘 버튼 */}
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '30px',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <Image
                    src={showPassword ? '/eye-on.png' : '/eye-off.png'}
                    alt="비밀번호 표시/숨김"
                    width={20}
                    height={12}
                  />
                </button>
              )}

              {/* 비밀번호 유효성 검사 메시지 */}
              {password.length > 0 && !passwordValidation.isValid && (
              <div style={{ marginTop: '12px' }}>
                <p style={{
                  color: 'var(--color-primary-30)',
                  fontSize: '14px',
                  fontWeight: '500',
                  lineHeight: '180%',
                  letterSpacing: '-0.14px',
                  fontFamily: 'Pretendard',
                }}>
                  사용불가 비밀번호입니다.(영문, 숫자 6 ~ 18자리)
                </p>
              </div>
              )}
            </div>

            {/* 비밀번호 확인 칸 - 아이콘 추가 */}
            {showPasswordConfirm && (
              <div className="mt-3 relative">
                <input
                  type={showPasswordConfirm2 ? "text" : "password"}  // 동적으로 type 변경
                  value={passwordConfirm}
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value);
                    if (e.target.value.length > 0 && !passwordConfirmTouched) {
                      setPasswordConfirmTouched(true);
                    }
                    if (e.target.value.length === 0) {
                      setPasswordConfirmTouched(false);
                    }
                  }}
                  onFocus={() => {
                    setIsPasswordConfirmFocused(true);
                  }}
                  onBlur={() => {
                    setIsPasswordConfirmFocused(false);
                  }}
                  style={{
                    width: '350px',
                    height: '60px',
                    backgroundColor: (passwordConfirmTouched || isPasswordConfirmFocused) ? '#2F3847' : '#1D2937',
                    borderRadius: '8px',
                    padding: '18px 116px 18px 25px',  // 오른쪽 padding 추가
                    fontSize: '16px',
                    letterSpacing: '-0.14px',
                    lineHeight: '180%',
                    fontWeight: '500',
                    fontFamily: 'Pretendard',
                    border: 'none',
                    outline: 'none',
                    color: passwordConfirm ? '#F0F0F0' : '#B1B1B1',
                  }}
                  placeholder="비밀번호 확인"
                  enterKeyHint="done"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && passwordsMatch) {
                      handleNext();
                    }
                  }}
                />

                {/* 눈 아이콘 버튼 (비밀번호 확인) */}
                {passwordConfirm.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm2(!showPasswordConfirm2)}
                    style={{
                      position: 'absolute',
                      right: '15px',
                      top: '30px',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <Image
                      src={showPasswordConfirm2 ? '/eye-on.png' : '/eye-off.png'}
                      alt="비밀번호 표시/숨김"
                      width={20}
                      height={12}
                    />
                  </button>
                )}

                {/* 비밀번호 일치 여부 메시지 */}
                {passwordConfirm.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <p style={{
                      color: 'var(--color-primary-30)',
                      fontSize: '14px',
                      fontWeight: '500',
                      lineHeight: '180%',
                      letterSpacing: '-0.14px',
                      fontFamily: 'Pretendard',
                    }}>
                      {passwordsMatch 
                        ? '비밀번호가 일치합니다.' 
                        : '비밀번호가 일치하지 않습니다.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        );
      
      case 4:
        return (
          <>
            <h2 style={titleStyle}>
              서비스 약관에 동의해주세요
            </h2>

            {/* 전체를 감싸는 컨테이너 */}
            <div style={{
              position: 'absolute',
              top: '243px',
              left: '20px',
              width: '350px',
            }}></div>

            <div className="mt-8">
              {/* 전체 동의하기 */}
              <button
                onClick={() => {
                  const newValue = !allAgreed;
                  setAllAgreed(newValue);
                  setTermsAgreed(newValue);
                  setPrivacyAgreed(newValue);
                }}
                style={{
                  width: '100%',
                  height: '60px',
                  backgroundColor: 'var(--color-bg-90)',
                  borderRadius: '12px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '18px 116px',
                  cursor: 'pointer',
                  gap: '10px',
                  marginBottom: '31px',
                  position: 'relative',
                }}
              >
                <img 
                  src={allAgreed ? '/Vector-2.png' : '/Vector-1.png'} 
                  alt="check"
                  style={{
                    width: '14px',
                    height: '14px',
                    position: 'absolute',
                    left: '28px',
                  }}
                />
                <span style={{
                  color: 'var(--color-gray-10)',
                  fontSize: '16px',
                  fontWeight: '500',
                  fontFamily: 'Pretendard',
                  lineHeight: '180%',
                  letterSpacing: '-0.16px',
                  width: '100%',
                  textAlign: 'center',
                }}>
                  전체 동의하기
                </span>
              </button>

              {/* 이용약관 (필수) */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '8px',
                }}>

                  {/* 체크박스 */}
                  <button
                    onClick={() => {
                      // termsAgreed만 토글
                      const newTermsValue = !termsAgreed;
                      setTermsAgreed(newTermsValue);
                      
                      // 전체 동의 상태 업데이트 (두 개 모두 체크되었는지 확인)
                      if (newTermsValue && privacyAgreed) {
                        setAllAgreed(true);
                      } else {
                        setAllAgreed(false);
                      }
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      marginRight: '12px',
                    }}
                  >
                    <img 
                      src={termsAgreed ? '/Vector-2.png' : '/Vector-1.png'} 
                      alt="checkbox"
                      style={{
                        width: '14px',
                        height: '14px',
                      }}
                    />
                  </button>
                  
                  {/* 텍스트는 클릭 불가 */}
                  <span style={{
                    color: 'var(--color-bg-10)',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'Pretendard',
                    textAlign: 'center',
                    lineHeight: '180%',
                    letterSpacing: '-0.14px',
                  }}>
                    이용약관 <span style={{ color: 'var(--color-primary-30)' }}>(필수)</span>
                  </span>
                </div>

                <div
                  dangerouslySetInnerHTML={{
                    __html: markdownToHtml(`**제 1 장 총 칙**

**제 1 조 (목적)**
본 약관은 FinSight(이하 "회사")가 제공하는 금융 뉴스 분석 및 학습 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

**제 2 조 (용어의 정의)**
1. "서비스"란 단말기(PC, 모바일 등)와 상관없이 회원이 이용할 수 있는 FinSight의 뉴스 큐레이션, AI 요약, 퀴즈, 학습 관리 제반 서비스를 의미합니다.
2. "회원"이란 본 약관에 동의하고 계정을 생성하여 서비스를 이용하는 자를 말합니다.
3. "AI 콘텐츠"란 Google Gemini API 등 인공지능 기술을 활용하여 생성된 뉴스 요약, 해설, 퀴즈 등을 의미합니다.

**제 2 장 이용계약 및 회원관리**

**제 3 조 (이용계약 체결 및 정보수집)**
1. 이용계약은 회원이 되고자 하는 자가 약관에 동의하고, 정해진 가입 절차를 완료함으로써 체결됩니다.
2. 회사는 원활한 서비스 제공을 위해 회원가입(온보딩) 단계에서 **3개 이상의 '관심 금융 카테고리'** 선택을 필수 조건으로 요구할 수 있습니다.
3. 회원은 이메일(일반 가입) 또는 카카오(Kakao) 등 소셜 연동을 통해 가입할 수 있습니다.

**제 4 조 (회원정보의 변경)**
1. 회원은 마이페이지를 통하여 언제든지 본인의 닉네임, 비밀번호, 관심 금융 카테고리를 수정할 수 있습니다.
2. 서비스 이용의 고유 식별값으로 사용되는 **이메일 주소(ID)는 수정이 불가능**합니다.

**제 3 장 서비스의 이용**

**제 5 조 (서비스의 제공 및 알고리즘 공개)**
회사는 투명한 정보 제공을 위해 다음과 같은 기준으로 뉴스를 배열 및 추천합니다.
1. **인기 뉴스:** 전체 조회수 순위와 8개 주요 카테고리별 최고 조회수 콘텐츠를 순환(Round-robin)하여 노출합니다. 별도의 기한 제한은 두지 않으며, 누적된 트래픽 데이터를 반영합니다.
2. **추천 뉴스:** 회원이 설정한 관심사 카테고리의 최신 뉴스를 우선적으로 노출하며, 정보 편향 방지를 위해 나머지 카테고리의 뉴스도 순차적으로 순환하여 제공합니다.
3. **AI 학습 지원:** Google Gemini LLM을 활용하여 뉴스 원문의 핵심 사실 요약, 용어 해설, 이해도 점검 퀴즈를 제공합니다.

**제 6 조 (서비스의 중단 및 모니터링)**
1. 회사는 시스템의 안정적인 운영을 위해 **Grafana Cloud** 등의 모니터링 도구를 활용하여 서버 상태, 로그, 트래픽 매트릭을 실시간으로 수집·분석합니다.
2. 천재지변, 시스템 점검 등 불가피한 사유가 발생한 경우 서비스 제공을 일시 중단할 수 있습니다.

**제 7 조 (책임제한)**
회사가 제공하는 AI 콘텐츠(요약, 퀴즈 등)는 인공지능 알고리즘에 의해 자동 생성된 정보로, 그 완전성이나 정확성을 보장하지 않습니다. 이를 참고하여 발생한 회원의 금융 투자 결과에 대해 회사는 책임을 지지 않습니다.

**부 칙**
본 약관은 2026년 2월 15일부터 시행합니다.`)
                  }}
                  style={{
                    width: '100%',
                    height: '140px',
                    backgroundColor: 'var(--color-bg-100)',
                    borderRadius: '8px',
                    border: '1.5px solid var(--color-gray-90)',
                    padding: '16px 20px',
                    fontStyle: 'normal',
                    fontSize: '12px',
                    fontWeight: '500',
                    fontFamily: 'Pretendard',
                    textAlign: 'left',
                    color: 'var(--color-gray-50)',
                    lineHeight: '180%',
                    letterSpacing: '-0.12px',
                    overflow: 'auto',
                    resize: 'none',
                    outline: 'none',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                  className="hide-scrollbar"
                />
              </div>

              {/* 개인정보 처리방침 (필수) */}
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '8px',
                }}>
                  {/* 체크박스 */}
                  <button
                    onClick={() => {
                      // privacyAgreed만 토글
                      const newPrivacyValue = !privacyAgreed;
                      setPrivacyAgreed(newPrivacyValue);
                              
                      // 전체 동의 상태 업데이트 (두 개 모두 체크되었는지 확인)
                      if (termsAgreed && newPrivacyValue) {
                        setAllAgreed(true);
                      } else {
                        setAllAgreed(false);
                      }
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      marginRight: '12px',
                    }}
                  >
                    <img 
                      src={privacyAgreed ? '/Vector-2.png' : '/Vector-1.png'} 
                      alt="checkbox"
                      style={{
                        width: '14px',
                        height: '14px',
                      }}
                    />
                  </button>
                  
                  {/* ✅ 텍스트는 클릭 불가 */}
                  <span style={{
                    color: 'var(--color-bg-10)',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'Pretendard',
                    textAlign: 'center',
                    lineHeight: '180%',
                    letterSpacing: '-0.14px',
                  }}>
                    개인정보 처리방침 <span style={{ color: 'var(--color-primary-30)' }}>(필수)</span>
                  </span>
                </div>

                <div
                  dangerouslySetInnerHTML={{
                    __html: markdownToHtml(`**FinSight(이하 "회사")**는 이용자의 개인정보를 중요시하며, 「개인정보보호법」 등 관련 법령을 준수하고 있습니다.

**제 1 조 (개인정보의 수집 및 이용 목적)**
회사는 다음의 목적을 위하여 개인정보를 처리합니다.
1. **회원 가입 및 관리:** 본인 식별, 가입 의사 확인, 회원자격 유지·관리 (이메일/소셜 로그인 연동)
2. **서비스 제공:** 관심사 기반 뉴스 피드 알고리즘 적용, 학습 현황(레벨, 퀴즈 점수) 저장 및 관리
3. **서비스 개선 및 보안:** AI 모델(Gemini) 응답 품질 개선, 접속 빈도 파악, 시스템 안정성 확보(Grafana 모니터링)

**제 2 조 (수집하는 개인정보의 항목)**
회사는 서비스 제공을 위해 아래와 같은 정보를 수집합니다.
1. **필수 항목:** 이메일 주소(ID), 비밀번호(이메일 가입 시), 닉네임, **관심 금융 카테고리(최소 3개 이상)**
2. **소셜 로그인 시(카카오):** 프로필 정보(닉네임, 이메일), 소셜 식별자(ID)
3. **자동 수집 항목:** 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 뉴스 조회 이력, 퀴즈 풀이 데이터

**제 3 조 (개인정보의 보유 및 이용 기간)**
회원 탈퇴 시까지 보유하는 것을 원칙으로 하며, 탈퇴 시 지체 없이 파기합니다. 단, 관계 법령 위반에 따른 수사 협조 등이 필요한 경우 해당 목적 달성 시까지 보관할 수 있습니다.

**제 4 조 (개인정보 처리의 위탁)**
회사는 서비스 향상 및 시스템 운영을 위해 다음과 같이 개인정보 처리 업무를 외부 전문 업체에 위탁하고 있습니다.

**수탁 업체** | **위탁 업무 내용**
Google (Gemini API) | 뉴스 콘텐츠 요약, 해설 및 퀴즈 생성을 위한 텍스트 데이터 처리
Grafana Labs | 시스템 성능 모니터링, 서버 로그 분석 및 장애 대응을 위한 데이터 보관
Kakao Corp. | 카카오 로그인 이용 시 본인 인증 및 식별값 처리

**제 5 조 (이용자의 권리)**
이용자는 언제든지 마이페이지를 통해 자신의 개인정보(닉네임, 관심사, 비밀번호 등)를 조회하거나 수정할 수 있으며, 회원 탈퇴를 요청할 수 있습니다. 단, 시스템 식별자인 이메일은 수정이 불가능합니다.

**제 6 조 (개인정보의 파기 절차)**
회사는 파기 사유가 발생한 개인정보를 선정하고, 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 영구 삭제합니다.

**제 7 조 (개인정보 보호책임자)**
• **성명:** 우재원
• **직책:** FinSight 프로젝트 대표 (PM)
• **연락처:** 010-2840-6742

**부 칙**
본 처리방침은 2026년 2월 15일부터 시행됩니다.`)
                  }}
                  style={{
                    width: '100%',
                    height: '140px',
                    backgroundColor: 'var(--color-bg-100)',
                    borderRadius: '8px',
                    border: '1.5px solid var(--color-gray-90)',
                    padding: '16px 20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    fontStyle: 'normal',
                    fontFamily: 'Pretendard',
                    textAlign: 'left',
                    color: 'var(--color-gray-50)',
                    lineHeight: '180%',
                    letterSpacing: '-0.12px',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                  className="hide-scrollbar"
                />
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <AuthContainer
      title={isKakaoMode ? "카카오 회원가입" : "회원가입"}
      currentStep={step}
      totalSteps={isKakaoMode ? 0 : 4}
      buttonText={
        isKakaoMode && step === 1
          ? "다음"
          : isKakaoMode && step === 4
            ? "가입하기"
            : step === 2 
              ? (isCodeSent ? "인증하기" : "인증번호 전송")
              : step === 4
                ? "가입하기"
                : "다음"
      }
      buttonDisabled={
        step === 1 ? (!name || !isNicknameChecked) :
        step === 2 ? (isCodeSent ? verificationCode.length < 4 : !isValidEmail(email)) :  // 인증번호 4자리 입력 시 활성화
        step === 3 ? (
          showPasswordConfirm 
            ? !passwordsMatch 
            : !validatePassword(password).isValid
        ) :
        step === 4 ? !(termsAgreed && privacyAgreed) :
        false
      }
      onNext={() => {
        // 카카오 모드일 때 step 1에서는 step 4로 이동, step 4에서는 회원가입 처리
        if (isKakaoMode && step === 1) {
          handleNext(); // step 4로 이동
          return;
        }
        
        if (isKakaoMode && step === 4) {
          handleSignup(); // 카카오 회원가입 처리
          return;
        }
        
        if (step === 2) {
          if (!isCodeSent) {
            handleSendVerificationCode();
          } else {
            handleVerifyCode();  // 인증하기 버튼 클릭 시 인증 시도
          }
        } else if (step === 3) {
          if (!showPasswordConfirm) {
            setShowPasswordConfirm(true);
          } else {
            handleNext();
          }
        } else if (step === 4) {
          handleSignup();
        } else {
          handleNext();
        }
      }}
      onBack={handleBack}
    >
      {renderStepContent()}
    </AuthContainer>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col mx-auto" style={{
        width: '390px',
        height: '844px',
        background: 'var(--color-bg-100, #131416)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ color: '#fff' }}>로딩 중...</p>
      </div>
    }>
      <SignupPageContent />
    </Suspense>
  );
}