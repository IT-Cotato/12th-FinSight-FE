'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthContainer from '../../(auth)/AuthContainer';

export default function SignupPage() {
  const router = useRouter();
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

  // 3단계 - 비밀번호 관련 state
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordConfirmFocused, setIsPasswordConfirmFocused] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordConfirmTouched, setPasswordConfirmTouched] = useState(false);

  const [emailError, setEmailError] = useState('');

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

  // 이메일 유효성 검사 함수
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 4단계 약관 동의
  const [allAgreed, setAllAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  const isButtonEnabled = () => {
  switch (step) {
    case 1:
      return name.trim().length > 0;
    case 2:
      return isValidEmail(email) && !isCodeSent;
    case 3:
      return verificationCode.length >= 4;
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
    /* [실제 API 연동 시 주석 해제]
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        termsAgreed,
        privacyAgreed,
      }),
    });

    if (!response.ok) throw new Error('회원가입 실패');
    const data = await response.json();
    */

    // ✨ Mock (테스트용): 1초 대기 후 성공 처리
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // ✅ 회원가입 성공 시 온보딩 화면으로 이동
    router.push('/onboarding');
    
  } catch (error) {
    console.error('Signup error:', error);
    setError('회원가입에 실패했습니다. 다시 시도해주세요.');
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

  //---------------- 반드시 수정 (API 연동 대비 버전) -------------------
  
  /** 1. 인증번호 전송 API 호출 */
const handleSendVerificationCode = async () => {
  setLoading(true);
  setError('');
  setEmailError(''); // 이메일 에러 초기화
  
  try {
    /* [실제 API 연동 시 주석 해제]
    const response = await fetch('/api/auth/send-verification-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      if (response.status === 409 || data.error === 'ALREADY_REGISTERED') {
        setEmailError('이미 가입한 이메일입니다.');
        setLoading(false);
        return;
      }
      throw new Error('전송 실패');
    }
    const data = await response.json();
    */

    // ✨ Mock (테스트용): 1초 대기 후 성공 처리
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 🧪 테스트용: 특정 이메일은 이미 가입된 것으로 처리
    if (email === 'test@test.com') {
      setEmailError('이미 가입한 이메일입니다.');
      setLoading(false);
      return;
    }
    
    setIsCodeSent(true);      // 인증번호 입력창 활성화
    setTimeLeft(180);         // 타이머 3분 리셋
    setVerificationCode('');  // 인증번호 입력란 초기화
    setError('');
    // ✅ 수정: 재전송 시 인증번호 터치 상태 초기화
    setCodeTouched(false);
    alert('인증번호가 전송되었습니다! (테스트용: 123456)');
    
  } catch (err) {
    setError('인증번호 전송에 실패했습니다. 다시 시도해주세요.');
  } finally {
    setLoading(false);
  }
};

  /** 2. 인증번호 확인 API 호출 */
  const handleVerifyCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      /* [실제 API 연동 시 주석 해제]
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      if (!response.ok) throw new Error('인증 실패');
      const data = await response.json();
      */

      // ✨ Mock (테스트용): 1초 대기 후 번호 대조
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (verificationCode === '123456') {
        // 인증 성공 시에만 다음 Step으로 이동
        setStep(3); 
        setError('');
      } else {
        setError('인증번호가 일치하지 않습니다.');
      }
      
    } catch (err) {
      setError('인증 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  //----------------------반드시 수정-----------------------

  // ✨ 뒤로가기 핸들러 추가
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);  // 이전 단계로
    } else {
      router.back();  // 1단계면 진짜 뒤로가기
    }
  };

  const handleNext = () => {
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
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
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
                  if (e.key === 'Enter' && name) {
                    handleNext();
                  }
                }}
                className="w-full p-4 rounded-lg text-white"
              />
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

            {/* 비밀번호 입력 */}
            <div className="mt-6">
              <input
                type="password"
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
                // disabled 처리
                disabled={showPasswordConfirm}
              />

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

            {/* 비밀번호 확인 칸 - 조건부 렌더링 */}
            {showPasswordConfirm && (
              <div className="mt-3">
                <input
                  type="password"
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
                    padding: '18px 25px',
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

                <textarea
                  placeholder="어쩌구 저쩌구"
                  readOnly
                  style={{
                    width: '100%',
                    height: '140px',
                    backgroundColor: 'var(--color-bg-100)',
                    borderRadius: '8px',
                    border: '1.5px solid var(--color-gray-90)',
                    padding: '16px 265px 102px 20px',
                    alignItems: 'center',
                    fontStyle: 'normal',
                    fontSize: '12px',
                    fontWeight: '500',
                    fontFamily: 'Pretendard',
                    textAlign: 'center',
                    color: 'var(--color-gray-50)',
                    lineHeight: '180%',
                    letterSpacing: '-0.12px',
                    overflow: 'auto',
                    resize: 'none',
                    outline: 'none',
                    // 스크롤바 숨기기
                    scrollbarWidth: 'none',  // Firefox
                    msOverflowStyle: 'none',  // IE, Edge
                  }}
                  // Chrome, Safari 스크롤바 숨기기
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

                <textarea
                  placeholder="어쩌구 저쩌구"
                  readOnly
                  style={{
                    width: '100%',
                    height: '140px',
                    backgroundColor: 'var(--color-bg-100)',
                    borderRadius: '8px',
                    border : '1.5px solid var(--color-gray-90)',
                    padding: '16px 265px 102px 20px',
                    alignItems: 'center',
                    fontSize: '12px',
                    fontWeight: '500',
                    fontStyle: 'normal',
                    fontFamily: 'Pretendard',
                    textAlign: 'center',
                    color: 'var(--color-gray-50)',
                    lineHeight: '180%',
                    letterSpacing: '-0.12px',
                    overflow: 'auto',
                    resize: 'none',
                    outline: 'none',
                    // 스크롤바 숨기기
                    scrollbarWidth: 'none',  // Firefox
                    msOverflowStyle: 'none',  // IE, Edge
                  }}
                  // Chrome, Safari 스크롤바 숨기기
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
      title="회원가입"
      currentStep={step}
      totalSteps={4}
      buttonText={
        step === 2 
          ? (isCodeSent ? "인증하기" : "인증번호 전송")
          : step === 4
            ? "가입하기"  // ✅ 추가: step 4일 때 버튼 텍스트
            : "다음"
      }
      buttonDisabled={
        step === 1 ? !name :
        step === 2 ? (isCodeSent ? !verificationCode || verificationCode.length < 4 : !isValidEmail(email)) :
        step === 3 ? (
          // 밀번호 확인 칸이 안 보이면 → 비밀번호 유효성만 체크
          // 비밀번호 확인 칸이 보이면 → 비밀번호 일치 여부도 체크
          showPasswordConfirm 
            ? !passwordsMatch 
            : !validatePassword(password).isValid
        ) :
        step === 4 ? !(termsAgreed && privacyAgreed) :  // ✅ 추가: step 4 조건
        false
      }
      onNext={() => {
        if (step === 2) {
          if (!isCodeSent) {
            handleSendVerificationCode();
          } else {
            handleVerifyCode();
          }
        } else if (step === 3) {
          // 비밀번호 확인 칸이 안 보이면 → 비밀번호 확인 칸 표시
          if (!showPasswordConfirm) {
            setShowPasswordConfirm(true);
          } else {
            // 비밀번호 확인까지 완료 → 다음 단계로
            handleNext();
          }
        } else if (step === 4) {
          // ✅ 추가: step 4일 때 회원가입 완료 처리
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