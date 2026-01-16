'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthContainer from '../AuthContainer';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: 이메일, 2: 인증번호, 3: 새 비밀번호
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);

  // Focus 상태
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isCodeFocused, setIsCodeFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordConfirmFocused, setIsPasswordConfirmFocused] = useState(false);

  // Touch 상태
  const [emailTouched, setEmailTouched] = useState(false);
  const [codeTouched, setCodeTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordConfirmTouched, setPasswordConfirmTouched] = useState(false);

  // 비밀번호 확인 칸 표시 여부
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 이메일 유효성 검사
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 유효성 검사
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

  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === passwordConfirm && passwordConfirm.length > 0;

  // 타이머
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? `0${s}` : s}`;
  };


  // 인증번호 전송
  const handleSendVerificationCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      /* [실제 API 연동 시 주석 해제]
      const response = await fetch('/api/auth/forgot-password/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 404) {
          setError('가입되지 않은 이메일입니다.');
          setLoading(false);
          return;
        }
        throw new Error('전송 실패');
      }
      */

      // Mock 테스트
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 성공 후 Step 2로 이동
      setStep(2);
      setTimeLeft(180);
      setVerificationCode('');
      setCodeTouched(false);
      alert('인증번호가 전송되었습니다! (테스트용: 123456)');
      
    } catch (err) {
      setError('인증번호 전송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      /* [실제 API 연동 시 주석 해제]
      const response = await fetch('/api/auth/forgot-password/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      
      if (!response.ok) throw new Error('인증 실패');
      */

      // Mock 테스트
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (verificationCode === '123456') {
        setStep(3); // ✅ 수정: 새 비밀번호 입력 단계로
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

  // 비밀번호 재설정 완료
  const handleResetPassword = async () => {
    setLoading(true);
    
    try {
      /* [실제 API 연동 시 주석 해제]
      const response = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode, newPassword: password }),
      });
      
      if (!response.ok) throw new Error('비밀번호 재설정 실패');
      */

      // Mock 테스트
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('비밀번호가 재설정되었습니다!');
      router.push('/login');
      
    } catch (err) {
      setError('비밀번호 재설정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const titleStyle = {
    color: 'var(--color-bg-10, #EAEFF5)',
    top: '135px',
    left: '20px',
    fontFamily: 'Pretendard',
    fontSize: '22px',
    fontWeight: 600,
    lineHeight: '130%',
    letterSpacing: '-0.22px',
  };

  const renderStepContent = () => {
    switch (step) {
      // Step 1: 이메일 입력
      case 1:
        return (
          <>
            <h2 style={titleStyle}>
              이메일을 입력해주세요
            </h2>
            
            <div className="mt-8">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!emailTouched) setEmailTouched(true);
                  setError('');
                }}
                onFocus={() => {
                  setIsEmailFocused(true);
                  if (!emailTouched) setEmailTouched(true);
                }}
                onBlur={() => setIsEmailFocused(false)}
                style={{
                  width: '350px',
                  height: '60px',
                  backgroundColor: (emailTouched && isEmailFocused) 
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
                  color: email ? 'var(--color-gray-20)' : 'var(--color-gray-50)',
                }}
                placeholder="example@email.com"
                autoFocus
              />

              {/* 에러 메시지 */}
              {error && (
                <p style={{
                  color: 'var(--color-primary-30)',
                  fontSize: '14px',
                  marginTop: '12px',
                  fontFamily: 'Pretendard',
                  fontWeight: '500',
                }}>
                  {error}
                </p>
              )}
            </div>
          </>
        );

      // ✅ Step 2: 인증번호 입력
      case 2:
        return (
          <>
            <h2 style={titleStyle}>
              인증번호를 입력해주세요
            </h2>
            
            <div className="mt-8">
              {/* 이메일 표시 (비활성화) */}
              <input
                type="email"
                value={email}
                disabled
                style={{
                  width: '350px',
                  height: '60px',
                  backgroundColor: 'var(--color-bg-70)',
                  borderRadius: '8px',
                  padding: '18px 116px 18px 25px',
                  fontSize: '16px',
                  letterSpacing: '-0.14px',
                  lineHeight: '180%',
                  fontWeight: '500',
                  fontFamily: 'Pretendard',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-gray-20)',
                  marginBottom: '12px',
                }}
              />

              {/* 인증번호 입력 필드 */}
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length <= 6) {
                      setVerificationCode(value);
                      if (!codeTouched) setCodeTouched(true);
                    }
                  }}
                  onFocus={() => {
                    setIsCodeFocused(true);
                    if (!codeTouched) setCodeTouched(true);
                  }}
                  onBlur={() => setIsCodeFocused(false)}
                  placeholder="인증번호 입력"
                  maxLength={6}
                  autoFocus
                  style={{
                    width: '350px',
                    height: '60px',
                    backgroundColor: isCodeFocused
                      ? 'var(--color-bg-70)'
                      : 'var(--color-bg-80)',
                    borderRadius: '8px',
                    padding: '18px 116px 18px 25px',
                    fontSize: '16px',
                    fontFamily: 'Pretendard',
                    border: 'none',
                    outline: 'none',
                    color: verificationCode ? 'var(--color-gray-20)' : 'var(--color-gray-50)',
                  }}
                />
                
                {/* 재전송 버튼 */}
                <button
                  onClick={handleSendVerificationCode}
                  style={{
                    position: 'absolute',
                    right: '21px',
                    top: '19px',
                    color: 'var(--color-primary-30)',
                    fontSize: '12px',
                    fontWeight: '500',
                    fontFamily: 'Pretendard',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  재전송
                </button>
              </div>

              {/* 시간 만료 메시지 */}
              {timeLeft === 0 && (
                <p style={{
                  color: 'var(--color-primary-30)',
                  fontSize: '14px',
                  marginTop: '12px',
                  fontFamily: 'Pretendard',
                }}>
                  3분이 지나 인증번호가 만료되었어요. 다시 전송해주세요.
                </p>
              )}

              {/* 에러 메시지 */}
              {error && (
                <p style={{
                  color: 'var(--color-primary-30)',
                  fontSize: '14px',
                  marginTop: '12px',
                  fontFamily: 'Pretendard',
                  fontWeight: '500',
                }}>
                  인증번호가 일치하지 않습니다.
                </p>
              )}
            </div>
          </>
        );

      // Step 3: 새 비밀번호 입력
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
              fontFamily: 'Pretendard',
              letterSpacing: '-0.16px',
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
                  if (e.target.value.length > 0) setPasswordTouched(true);
                  else setPasswordTouched(false);
                }}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                disabled={showPasswordConfirm}
                style={{
                  width: '350px',
                  height: '60px',
                  backgroundColor: (passwordTouched || isPasswordFocused) 
                    ? 'var(--color-bg-70)' 
                    : 'var(--color-bg-80)',
                  borderRadius: '8px',
                  padding: '18px 116px 18px 25px',
                  fontSize: '14px',
                  fontFamily: 'Pretendard',
                  fontWeight: '500',
                  lineHeight: '180%',
                  letterSpacing: '-0.14px',
                  border: 'none',
                  outline: 'none',
                  color: password ? 'var(--color-gray-20)' : 'var(--color-gray-50)',
                }}
                placeholder="비밀번호 입력"
              />

              {/* 비밀번호 유효성 메시지 */}
              {password.length > 0 && !passwordValidation.isValid && (
                <p style={{
                  color: 'var(--color-primary-30)',
                  fontSize: '14px',
                  marginTop: '12px',
                  fontFamily: 'Pretendard',
                }}>
                  사용불가 비밀번호입니다.(영문, 숫자 6 ~ 18자리)
                </p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            {showPasswordConfirm && (
              <div className="mt-3">
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value);
                    if (e.target.value.length > 0) setPasswordConfirmTouched(true);
                    else setPasswordConfirmTouched(false);
                  }}
                  onFocus={() => setIsPasswordConfirmFocused(true)}
                  onBlur={() => setIsPasswordConfirmFocused(false)}
                  autoFocus
                  style={{
                    width: '350px',
                    height: '60px',
                    backgroundColor: (passwordConfirmTouched || isPasswordConfirmFocused)
                      ? 'var(--color-bg-70)'
                      : 'var(--color-bg-80)',
                    borderRadius: '8px',
                    padding: '18px 25px',
                    fontSize: '16px',
                    fontFamily: 'Pretendard',
                    border: 'none',
                    outline: 'none',
                    color: passwordConfirm ? 'var(--color-gray-20)' : 'var(--color-gray-50)',
                  }}
                  placeholder="비밀번호 확인"
                />

                {passwordConfirm.length > 0 && !passwordsMatch && (
                <p style={{
                  color: 'var(--color-primary-30)',
                  fontSize: '14px',
                  marginTop: '12px',
                  fontFamily: 'Pretendard',
                }}>
                  비밀번호가 일치하지 않습니다. 다시 확인해주세요.
                </p>
              )}
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <AuthContainer
      title="비밀번호 찾기"
      currentStep={0}
      totalSteps={0}
      contentMarginTop="135px"
      buttonText={
        step === 1 
          ? "인증번호 전송"
          : step === 2 
            ? "인증하기"
            : "완료"
      }
      buttonDisabled={
        step === 1 
          ? !isValidEmail(email)  // 이메일 형식 체크
          : step === 2
            ? !verificationCode || verificationCode.length < 4  // 인증번호 4자리 이상
            : showPasswordConfirm 
              ? !passwordsMatch 
              : !passwordValidation.isValid
      }
      onNext={() => {
        if (step === 1) {
          handleSendVerificationCode();
        } else if (step === 2) {
          handleVerifyCode();
        } else if (step === 3) {
          if (!showPasswordConfirm) {
            setShowPasswordConfirm(true);
          } else {
            handleResetPassword();
          }
        }
      }}
      onBack={handleBack}
    >
      {renderStepContent()}
    </AuthContainer>
  );
}