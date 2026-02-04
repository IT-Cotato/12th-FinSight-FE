'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthContainer from '../AuthContainer';
import { login } from '@/api/auth'; // auth.ts의 login 함수 import


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Focus 상태
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Touch 상태
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // 비밀번호 표시/숨김 상태
  const [showPassword, setShowPassword] = useState(false);

  // 이메일 유효성 검사
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 수정: 로그인 처리 - auth.ts의 login 함수 사용
  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // 수정: auth.ts의 login 함수 호출
      await login({ email, password });
      
      // 수정: 로그인 성공 시 홈으로 이동 (토큰 저장은 auth.ts에서 처리됨)
      router.push('/home');

    } catch (err: any) {
      // 수정: 에러 처리
      if (err.message?.includes('로그인')) {
        setError('이메일 또는 비밀번호가 일치하지 않습니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title="로그인"
      currentStep={0}
      totalSteps={0}
      contentMarginTop="153px"
      buttonText="로그인"
      buttonDisabled={!isValidEmail(email) || password.length < 6}
      onNext={handleLogin}
      onBack={() => router.back()}
    >
      {/* 이메일 */}
      <div className="mb-6">
        <label className="block text-[var(--color-bg-10)] font-pretendard text-[18px] leading-[130%] tracking-[-0.18px]">
          이메일
        </label>
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
          className={`w-[350px] h-[60px] ${
            emailTouched && isEmailFocused 
              ? 'bg-[var(--color-bg-70)]' 
              : 'bg-[var(--color-bg-80)]'
          } rounded-lg pl-[25px] py-[18px] text-[14px] font-pretendard border-none outline-none ${
            email ? 'text-[var(--color-gray-20)]' : 'text-[var(--color-gray-50)]'
          } tracking-[-0.14px] leading-[180%]`}
          placeholder="이메일 입력"
          autoFocus
        />
      </div>

      {/* 비밀번호 입력 - relative로 감싸고 아이콘 추가 */}
        <div className="mb-6 relative">
        <label className="block text-[var(--color-bg-10)] font-pretendard text-[18px] leading-[130%] tracking-[-0.18px] mb-[12px]">
            비밀번호
        </label>
        <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
            setPassword(e.target.value);
            if (!passwordTouched) setPasswordTouched(true);
            setError('');
            }}
            onFocus={() => {
            setIsPasswordFocused(true);
            if (!passwordTouched) setPasswordTouched(true);
            }}
            onBlur={() => setIsPasswordFocused(false)}
            className={`w-[350px] h-[60px] ${
            passwordTouched && isPasswordFocused 
                ? 'bg-[var(--color-bg-70)]' 
                : 'bg-[var(--color-bg-80)]'
            } rounded-lg pl-[25px] pr-[60px] py-[18px] text-[14px] font-pretendard border-none outline-none ${
            password ? 'text-[var(--color-gray-20)]' : 'text-[var(--color-gray-50)]'
            } tracking-[-0.14px] leading-[180%]`}
            placeholder="비밀번호 입력"
        />

        {/* 눈 아이콘 버튼 */}
        {password.length > 0 && (
            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[15px] mt-[30px] transform -translate-y-1/2 bg-transparent border-none cursor-pointer p-0"
            >
            <Image
                src={showPassword ? '/eye-on.png' : '/eye-off.png'}
                alt="비밀번호 표시/숨김"
                width={20}
                height={12}
            />
            </button>
        )}
        </div>

      {/* 하단 안내 텍스트 */}
      {error && (
        <div className="absolute bottom-[114px] left-5 right-5 text-center">
            <p className="text-[var(--color-primary-30)] font-pretendard text-[14px] text-center font-medium leading-[130%] tracking-[-0.14px]">
            존재하지 않는 회원정보입니다. <br /> 이메일 주소와 비밀번호를 다시 확인해주세요.
            </p>
        </div>
      )}
    </AuthContainer>
  );
}