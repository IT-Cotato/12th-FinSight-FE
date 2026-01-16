'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: 첫 화면, 2: 두 번째 화면
  const [showText, setShowText] = useState(false);

  // 첫 화면에서 3초 후 텍스트 표시
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        setShowText(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      setShowText(true); // 두 번째 화면에서는 버튼 바로 표시
    } else {
      // 마지막: 관심 분야 선택 또는 홈으로 이동
      router.push('/home'); // 또는 '/interests'
    }
  };

  return (
    <div 
      className="relative w-[390px] h-[844px] mx-auto overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 200% 200% at 85% 21.21%, #151540 5.77%, #131416 100%)',
      }}
    >
      {/* 상단 텍스트 */}
      <div className="absolute top-[140px] left-0 right-0 text-center px-5">
        {step === 1 ? (
          <h1 className="text-[var(--color-primary-30)] font-pretendard text-[20px] font-semibold leading-[130%] tracking-[-0.2px]">
            반갑습니다!<br />
            저는 당신의 금융 학습 메이트<br />
            핀토입니다
          </h1>
        ) : (
          <h1 className="text-[var(--color-gray-10)] font-pretendard text-[22px] font-semibold leading-[140%] tracking-[-0.22px]">
            관심 분야 선택으로<br />
            <span className="text-[var(--color-primary-50)]">Finsight</span>를 시작해보세요!
          </h1>
        )}
      </div>

      {/* 중앙 캐릭터 이미지 - 둥둥 떠다니는 애니메이션 */}
      <div className="absolute top-[340px] left-1/2 transform -translate-x-1/2">
        <div className="animate-float">
          <Image
            src="/img-character-main.png"
            alt="핀토 캐릭터"
            width={184}
            height={258}
            priority
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      {step === 1 && showText && (
        <div 
          className="absolute bottom-[64px] left-0 right-0 text-center"
          style={{
            animation: 'fadeIn 0.3s ease-in',
          }}
        >
          <p className="text-[var(--color-gray-50)] font-pretendard text-[16px] font-medium tracking-[-0.16px]">
            탭하여 넘어가기
          </p>
        </div>
      )}

      {/* 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}