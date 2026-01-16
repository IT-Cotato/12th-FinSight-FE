'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function Header({ 
  title, 
  onBack, 
  showBackButton = true 
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div 
      style={{
        width: '390px',
        height: '100px',
        position: 'absolute',
        top: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '60px',
      }}
    >
      {/* 뒤로가기 버튼 */}
      {showBackButton && (
        <button 
          onClick={handleBack}
          style={{
            position: 'absolute',
            left: '20px',
            top: '65px',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <Image
            src="/icon-back.png"
            alt="뒤로가기"
            width={9}
            height={16}
          />
        </button>
      )}
      
      {/* 타이틀 */}
      <h1 
        style={{
          fontSize: '14px',           
          fontFamily: 'Pretendard',
          fontWeight: 500, 
          color: 'var(--color-bg-20, #D5D9E4)',
          lineHeight: '180%',
          textAlign:'center',
          letterSpacing: '-0.14px',
        }}
      >
        {title}
      </h1>
    </div>
  );
}