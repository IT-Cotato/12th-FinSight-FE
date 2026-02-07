import Image from 'next/image';

interface Interest {
  id: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
}

interface InterestSelectionProps {
  interests: Interest[];
  selectedInterests: string[];
  toggleInterest: (id: string) => void;
  handleNext: () => void;
  isButtonEnabled: boolean;
}

export default function InterestSelection({
  interests,
  selectedInterests,
  toggleInterest,
  handleNext,
  isButtonEnabled,
}: InterestSelectionProps) {
  return (
    <div className="flex flex-col h-full pt-[77px] pb-[34px]"
      style={{
        background: 'var(--color-bg-100)',
      }}
    >
      {/* 수정: px-5 추가하여 제목과 설명을 감쌈 */}
      <div className="px-5">
        <h1 className="text-[var(--color-gray-10)] top-[77px] ml-[20px] bottom-[14px] font-pretendard text-[22px] font-bold leading-[130%] tracking-[-0.22px] mb-[14px]">
          관심 분야를 선택해주세요
        </h1>
        <p className="text-[var(--color-gray-50)] font-pretendard text-[14px] font-medium leading-[130%] tracking-[-0.14px] ml-5">
          3개 이상 골라 주세요.<br />
          관심 분야는 언제든 수정 가능해요.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-[16px] gap-y-[20px] flex-1 content-start mt-[37px] mx-auto" style={{ width: 'fit-content' }}>
        {interests.map((interest) => (
          <button
            key={interest.id}
            onClick={() => toggleInterest(interest.id)}
            className="flex flex-1 items-center justify-center w-[157px] h-[110px] pt-[15px] pb-[15px] gap-[5px] rounded-lg border-2 transition-all duration-200"
            style={{
              backgroundColor: selectedInterests.includes(interest.id)
                ? 'var(--color-primary-90)'
                : 'var(--color-bg-80)',
              borderColor: selectedInterests.includes(interest.id)
                ? 'var(--color-primary-50)'
                : 'var(--color-bg-70)',
            }}
          >
          <div className="relative flex flex-col items-center w-full h-full">  
            <div className="flex-1 flex items-center justify-center">
              <Image
                src={interest.image}
                alt={interest.id}
                width={interest.imageWidth}
                height={interest.imageHeight}
                className="object-contain"
              />
            </div>
            <span 
              className="font-pretendard text-[14px] text-center font-medium leading-[180%] tracking-[-0.14px] mt-[8px]"
              style={{
                color: selectedInterests.includes(interest.id)
                  ? 'var(--color-gray-10)'
                  : 'var(--color-gray-40)',
              }}
            >
              {interest.id}
            </span>
          </div>
          </button>
        ))}
      </div>

      {/* 하단 영역: 높이를 h-[100px] 정도로 고정된 박스로 만듭니다. */}
      <div className="px-5 shrink-0 pb-[34px] mt-auto">
        <div className="flex flex-col items-center justify-end h-[92px] mt-[28px]"> 
          <div className="h-[24px] flex items-center justify-center">
            {selectedInterests.length > 0 && selectedInterests.length < 3 && (
              <p className="text-[var(--color-primary-40)] font-pretendard text-[14px] text-center font-medium leading-[130%] tracking-[-0.14px]">
                3개 이상 선택해주세요.
              </p>
            )}
          </div>
          
          <button
            onClick={handleNext}
            disabled={!isButtonEnabled}
            className={`
              w-full h-[60px] rounded-xl text-center font-pretendard text-[16px] leading-[180%] font-medium transition-all mt-2
              ${isButtonEnabled
                ? 'bg-[var(--color-primary-50)] text-[var(--color-gray-10)]'
                : 'bg-[var(--color-primary-20)] text-[var(--color-gray-10)]'
              }
            `}
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}