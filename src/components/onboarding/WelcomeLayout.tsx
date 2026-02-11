import Image from 'next/image';

interface WelcomeLayoutProps {
  step: 1 | 2;
  showText: boolean;
  onNext: () => void;
}

export default function WelcomeLayout({ step, showText, onNext }: WelcomeLayoutProps) {
  return (
    <>
      {step === 1 && (
        <div className="flex flex-col items-center justify-between h-full">
          {/* 제목 영역 */}
          <div className="pt-[clamp(120px,24vh,199px)] px-5 text-center">
            <h1 className="text-[var(--color-primary-30)] font-pretendard text-[20px] font-semibold leading-[130%] tracking-[-0.2px]">
              반갑습니다!<br />
              저는 당신의 금융 학습 메이트<br />
              핀토입니다
            </h1>
          </div>

          {/* 캐릭터 이미지 - 중앙 정렬 */}
          <div className="flex items-center justify-center mt-[63px]">
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

          <div className="pb-[64px] text-center w-full mt-[153px]">
            {showText && (
              <p
                className="text-[var(--color-gray-50)] font-pretendard text-[14px] text-center font-medium leading-[180%] tracking-[-0.16px] cursor-pointer animate-fadeIn"
                onClick={onNext}
              >
                탭하여 넘어가기
              </p>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col items-center justify-between h-full">
          {/* 제목 영역 */}
          <div className="pt-[clamp(120px,24vh,199px)] px-5 text-center">
            <h1 className="text-[var(--color-primary-30)] font-pretendard text-[20px] font-semibold text-center leading-[130%] tracking-[-0.2px]">
              관심 분야 선택으로<br />
              Finsight를 시작해보세요!
            </h1>
          </div>

          {/* 캐릭터 이미지 */}
          <div className="flex items-center justify-center mt-[63px]">
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
          <div className="mb-[34px] px-5 w-full mt-[153px]">
            <button
              onClick={onNext}
              className="w-full max-w-[350px] mx-auto block h-[60px] bg-[var(--color-primary-50)] rounded-xl text-center text-[var(--color-gray-10)] font-pretendard text-[16px] leading-[180%] font-medium tracking-[-0.16px] animate-slideUp"
            >
              관심 분야 선택하기
            </button>
          </div>
        </div>
      )}
    </>
  );
}