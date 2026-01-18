'use client';

import { useOnboardingStore } from '@/store/onboardingStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: 첫 화면, 2: 두 번째 화면, 3: 관심 분야 선택
  const [showText, setShowText] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // 관심 분야 데이터
  const interests = [
    { id: '금융', image: '/img-금융.png', imageWidth: 54, imageHeight: 50},
    { id: '증권', image: '/img-증권.png', imageWidth: 60, imageHeight: 50 },
    { id: '산업/재계', image: '/img-산업재계.png', imageWidth: 52, imageHeight: 50 },
    { id: '중기/벤쳐', image: '/img-중기벤쳐.png', imageWidth: 43, imageHeight: 50 },
    { id: '부동산', image: '/img-부동산.png', imageWidth: 71, imageHeight: 50 },
    { id: '글로벌 경제', image: '/img-글로벌경제.png', imageWidth: 69, imageHeight: 50 },
    { id: '생활경제', image: '/img-생활경제.png', imageWidth: 48, imageHeight: 50},
    { id: '경제 일반', image: '/img-경제일반.png', imageWidth: 52, imageHeight: 50},
  ];

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
    } else if (step === 2) {
      setStep(3); // 관심 분야 선택 화면으로
    } else {
      // 관심 분야 선택 완료 후 홈으로
      router.push('/home');
    }
  };

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const isButtonEnabled = selectedInterests.length >= 3;

  return (
    <div 
      className="relative w-[390px] h-[844px] mx-auto overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 200% 200% at 85% 21.21%, #151540 5.77%, #131416 100%)',
      }}
    >
      {/* Step 1: 첫 번째 화면 */}
      {step === 1 && (
        <>
          <div className="absolute top-[199px] left-0 right-0 text-center px-5">
            <h1 className="text-[var(--color-primary-30)] font-pretendard text-[20px] font-semibold leading-[130%] tracking-[-0.2px]">
              반갑습니다!<br />
              저는 당신의 금융 학습 메이트<br />
              핀토입니다
            </h1>
          </div>

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

          {showText && (
            <div 
              className="absolute bottom-[64px] left-0 right-0 text-center"
              onClick={handleNext}
              style={{
                animation: 'fadeIn 0.5s ease-in',
                cursor: 'pointer',
              }}
            >
              <p
                className="text-[var(--color-gray-50)] font-pretendard text-[14px] text-center font-medium leading-[180%] tracking-[-0.16px]"
                style={{cursor: 'pointer'}}
              >
                탭하여 넘어가기
              </p>
            </div>
          )}
        </>
      )}

      {/* Step 2: 두 번째 화면 */}
      {step === 2 && (
        <>
          <div className="absolute top-[199px] left-0 right-0 text-center px-5">
            <h1 className="top-[206px] left-[94px] text-[var(--color-primary-30)] font-pretendard text-[20px] font-semibold text-center leading-[130%] tracking-[-0.2px]">
              관심 분야 선택으로<br />
              Finsight를 시작해보세요!
            </h1>
          </div>

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

          {/* div 제거하고 버튼에 직접 애니메이션 적용 */}
          <button
            onClick={handleNext}
            className="absolute bottom-[34px] left-5 w-[350px] h-[60px] bg-[var(--color-primary-50)] rounded-xl text-center text-[var(--color-gray-10)] font-pretendard text-[16px] leading-[180%] font-medium tracking-[-0.16px]"
            style={{
              animation: 'slideUp 0.8s ease-out',
            }}
          >
            관심 분야 선택하기
          </button>
        </>
      )}

      {/* Step 3: 관심 분야 선택 화면 */}
      {step === 3 && (
        <div className="flex flex-col h-full pt-[77px] pb-[34px]"
          style={{
            background: 'var(--color-bg-100)',
          }}
          >
          <h1 className="text-[var(--color-gray-10)] top-[77px] ml-[20px] bottom-[14px] font-pretendard text-[22px] font-bold leading-[130%] tracking-[-0.22px] mb-[14px]">
            관심 분야를 선택해주세요
          </h1>
          <p className="text-[var(--color-gray-50)] font-pretendard text-[14px] font-medium leading-[130%] tracking-[-0.14px] ml-5">
            3개 이상 골라 주세요.<br />
            관심 분야는 언제든 수정 가능해요.
          </p>

          {/* 관심 분야 그리드 */}
          <div className="grid grid-cols-2 ml-[30px] mr-[30px] gap-x-4 gap-y-5 flex-1 content-start mt-[37px]">
            {interests.map((interest) => (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`
                  flex flex-col items-center justify-center
                  w-[157px] h-[110px]
                  py-[15px 48px]
                  gap-[5px]
                  rounded-lg
                  border-2
                  transition-all duration-200
                  ${selectedInterests.includes(interest.id)
                    ? 'bg-[var(--color-primary-90)] border-[var(--color-primary-50)]'
                    : 'bg-[var(--color-bg-80)] border-[var(--color-bg-70)]'
                  }
                `}
              >
                {/* relative 포지셔닝으로 텍스트 위치 고정 */}
                <div className="relative flex flex-col items-center w-full h-full">
                  {/* 이미지 크기 개별 설정할 수 있도록 */}
                  <div className="flex-1 flex items-center justify-center ">
                    <Image
                      src={interest.image}
                      alt={interest.id}
                      width={interest.imageWidth}  //  개별 이미지 너비
                      height={interest.imageHeight} // 개별 이미지 높이
                      className="object-contain mb-[30.5px]"
                    />
                  </div>
                  {/* 텍스트를 하단에서 8px 위에 고정 */}
                  <span className={`
                    absolute bottom-[8px]
                    font-pretendard text-[14px] text-center font-medium leading-[180%] tracking-[-0.14px]
                    ${selectedInterests.includes(interest.id)
                      ? 'text-[var(--color-gray-10)]'
                      : 'text-[var(--color-gray-40)]'
                    }
                  `}>
                    {interest.id}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* 시작하기 버튼 */}
            <div className="px-5">
            {/* 3개 미만 선택 시 경고 문구 */}
            {selectedInterests.length > 0 && selectedInterests.length < 3 && (
              <p className="text-[var(--color-primary-40)] font-pretendard text-[14px] text-center font-medium leading-[180%] tracking-[-0.14px] mb-1">
                3개 이상 선택해주세요.
              </p>
            )}
            
            <button
              onClick={handleNext}
              disabled={!isButtonEnabled}
              className={`
                w-full h-[60px] rounded-xl text-center font-pretendard text-[16px] leading-[180%] font-medium tracking-[-0.16px]
                transition-all duration-200
                ${isButtonEnabled
                  ? 'bg-[var(--color-primary-50)] text-[var(--color-gray-10)]'
                  : 'bg-[var(--color-primary-20)] text-[var(--color-gray-10)] cursor-not-allowed'
                }
              `}
            >
              시작하기
            </button>
          </div>
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
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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