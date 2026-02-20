/*
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/home');
} */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function RootPage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{minHeight: '100vh', width: '100%' }}>
      {showSplash ? <SplashScreen /> : <LoginSelectScreen />}
    </div>
  );
}

function SplashScreen() {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#131416',
        zIndex: 100,
      }}
    >
      <div style={{ 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '268px' 
      }}>
        <Image 
          src="/img-logo-symbol.png" 
          alt="Logo" 
          width={120} 
          height={120} 
          priority 
        />
        <Image 
          src="/img-logo-type.png" 
          alt="FinSight" 
          width={130} 
          height={35}
          priority 
        />
      </div>
    </div>
  );
}

function LoginSelectScreen() {
  const [loading, setLoading] = useState(false);

  const handleKakaoLogin = () => {
    setLoading(true);
    
    // 카카오 OAuth 인증 URL 생성
    const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    // 프론트엔드 callback URL 사용
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || 
      `${window.location.origin}/auth/kakao/callback`;
    
    if (!kakaoClientId) {
      alert('카카오 로그인 설정이 완료되지 않았습니다.');
      setLoading(false);
      return;
    }

    // 카카오 인증 페이지로 리다이렉트
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#131416',
        overflow: 'auto',
      }}
    >
      <div 
        style={{
          position: 'relative',
          width: '390px',
          minHeight: '100vh',
          maxHeight: '844px',
        }}
      >
        {/* 배경 이미지 */}
        <Image
          src="/intro-2.png"
          alt="Background"
          width={390}
          height={844}
          style={{ 
            width: '390px',
            height: '100%',
            minHeight: '100vh',
            objectFit: 'cover',
          }}
          priority
        />

        {/* 클릭 영역 */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
          
          {/* 카카오 로그인 버튼 */}
          <button 
            onClick={handleKakaoLogin}
            disabled={loading}
            style={{
              position: 'absolute',
              bottom: '167px',
              left: '20px',
              width: '350px',
              height: '60px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '12px',
            }}
          />

          {/* 이메일 로그인 버튼 */}
          <Link 
            href="/login"
            style={{
              position: 'absolute',
              bottom: '93px',
              left: '20px',
              width: '350px',
              height: '60px',
              display: 'block',
              borderRadius: '12px',
            }}
          >
            <div style={{ width: '100%', height: '100%' }} />
          </Link>

          {/* 회원가입 / 비밀번호 찾기 */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '0',
            right: '0',
            height: '44px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}>
            <Link 
              href="/signup" 
              style={{ 
                color: '#8E8E93',
                fontSize: '12px',
                fontWeight: '500',
                textDecoration: 'none',
                padding: '12px 16px', 
                minWidth: '64px',
                textAlign: 'center',
              }} 
            >
            </Link>
            
            <div style={{ 
              width: '1px', 
              height: '12px',
              backgroundColor: '#8E8E93',
            }} />
            
            <Link 
              href="/find-password"
              style={{ 
                color: '#8E8E93',
                fontSize: '12px',
                fontWeight: '500',
                textDecoration: 'none',
                padding: '12px 16px',
                minWidth: '90px',
                textAlign: 'center',
              }} 
            >
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}