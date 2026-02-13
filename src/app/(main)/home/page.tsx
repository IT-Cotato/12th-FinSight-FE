'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // useRouter 임포트 유지됨
import { useHomeStore } from '@/store/homeStore';
import PopularNews from '@/components/home/popularNews';
import CuratedNews from '@/components/home/curatedNews';

export default function HomePage() {
  const router = useRouter(); // 라우터 인스턴스 사용

  const { 
    nickname, fetchNickname, fetchPopularNews, fetchCuratedNews,
    fetchGuideData, guideMessage,
    isGuideChecked, isGuideRead, checkGuide,
    isNewsSaved, isQuizSolved, isQuizReviewChecked,
    toggleNewsSaved, toggleQuizSolved, toggleQuizReview,
  } = useHomeStore();

  useEffect(() => {
    fetchNickname();
    fetchPopularNews();
    fetchCuratedNews(true);
    fetchGuideData();
  }, [fetchNickname, fetchPopularNews, fetchCuratedNews, fetchGuideData]);

  // '퀴즈 1개 풀기' 클릭 핸들러 추가
  const handleQuizClick = () => {
    toggleQuizSolved(); // 기존 토글 기능 수행
    router.push('/study'); // study 페이지로 이동
  };

  return (
    <div className="w-full min-h-screen bg-[#131416]">
      <div className="relative mx-auto w-full min-h-screen font-pretendard select-none bg-[#131416]">
        
        {/* 상단 섹션 */}
        <section 
          className="relative w-full h-[463px] flex flex-col items-center shrink-0"
          style={{
            background: 'radial-gradient(133.24% 115.81% at 50% 100%, #151540 5.77%, #131416 100%)'
          }}
        >
          <div className="relative z-10 text-center mt-[60px]">
            <h1 className="text-[22px] text-[--color-primary-10] font-semibold leading-[130%] tracking-[-0.22px]">
              {nickname || '사용자'}님 반가워요!
            </h1>
            <p className="text-[16px] text-[--color-bg-30] font-medium leading-[180%] tracking-[-0.16px]">
              오늘의 학습 가이드 확인하기
            </p>
          </div>

          {/* 캐릭터 인터랙션 영역 */}
          <div 
            className="relative z-10 flex-1 flex flex-col items-center justify-center mt-[30px] cursor-pointer"
            onClick={checkGuide}
          >
            {/* 1. 말풍선 */}
            {isGuideChecked && (
              <div className="absolute top-[0] left-[79.43px] z-30 animate-fade-in">
                <div className="relative bg-primary-30 text-gray-90 text-[12px] px-[15px] py-1 rounded-[16px] whitespace-nowrap font-medium">
                  {guideMessage}
                </div>
              </div>
            )}

            {/* 캐릭터 본체 */}
            <div className={`relative z-20 ${!isGuideRead ? 'animate-shake' : 'animate-float'}`}>
              <Image src="/img-character-main.png" alt="핀토" width={111} height={155} priority />
            </div>  
              {/* 편지 봉투 아이콘: 피그마 위치 및 크기 정밀 고정 */}
            <div className={`absolute top-[-5px] z-30 transition-all duration-500 ease-in-out ${
              isGuideChecked ? 'left-[32px]' : 'right-[125px]'
            }`}>
              {/* 부모 컨테이너에 크기를 명시하여 이미지 스케일 보존 */}
              <div className="relative w-[63px] h-[48px]">
                <Image 
                  src="/home/notif.svg" 
                  alt="알림" 
                  fill 
                  className="object-contain" 
                />
                  
                {/* 원형 도트 아이콘 */}
                {!isGuideRead && (
                  <div className="absolute top-[-2px] right-[-2px] z-10 w-[13px] h-[13px]">
                    <Image 
                      src="/home/dot.svg" 
                      alt="알림 도트" 
                      fill 
                      className="object-contain" 
                    />
                  </div>
                )}
              </div>
            </div>
            

            {/* 캐릭터 그림자 애니메이션 */}
            <div className="mt-[-36px] px-[78px] mb-3">
              <Image src="/home/Ellipse.svg" alt="핀토 그림자" width={234} height={52} priority />
            </div>
          </div>

          <div className="relative z-10 w-full">
            <header className="px-5 mb-4 text-left">
              <p className="text-[14px] text-[--color-bg-30] font-medium mb-1 leading-[180%] tracking-[-0.14px]">금융 인사이트를 넓히는 습관</p>
              <h2 className="text-[18px] font-semibold text-[--color-bg-20] leading-[130%] tracking-[-0.18px]">일일 체크리스트</h2>
            </header>

            <div className="flex gap-3 overflow-x-auto px-5 mb-5 touch-pan-x text-[14px] text-[--color-bg-10] hide-scrollbar">
              <CheckItem title="뉴스 1개 저장하기" iconPath="/home/news.svg" isActive={isNewsSaved} onClick={toggleNewsSaved} />
              
              {/* 퀴즈 1개 풀기 항목의 onClick을 handleQuizClick으로 교체 */}
              <CheckItem 
                title="퀴즈 1개 풀기" 
                iconPath="/home/img-word.svg" 
                isActive={isQuizSolved} 
                onClick={handleQuizClick} 
              />
              
              <CheckItem title="보관한 퀴즈 복습하기" iconPath="/home/quiz.svg" isActive={isQuizReviewChecked} onClick={toggleQuizReview} />
            </div>
          </div>
        </section>

        {/* 뉴스 섹션 및 하단 여백 */}
        <div className="flex flex-col w-full py-5">
          <PopularNews />
          <CuratedNews />
        </div>
      </div>
    </div>
  );
}

function CheckItem({ title, iconPath, isActive, onClick }: { title: string, iconPath: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center justify-center py-[10px] px-5 transition-all active:scale-95 shrink-0 ${
        isActive 
          ? 'rounded-[16px] border border-bg-50 bg-bg-60' 
          : 'rounded-[16px] border border-primary-70 bg-primary-80'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="relative w-[26px] h-[26px]">
          <Image src={isActive ? "/home/check.svg" : iconPath} alt="아이콘" fill className="object-contain" />
        </div>
        <span className={`text-[14px] font-medium leading-[180%] tracking-[-0.14px] whitespace-nowrap ${
          isActive ? 'text-bg-40' : 'text-bg-10'
        }`}>
          {title}
        </span>
      </div>
    </button>
  );
}