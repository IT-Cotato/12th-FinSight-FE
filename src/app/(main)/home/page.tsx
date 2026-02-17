'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useHomeStore } from '@/store/homeStore';
import PopularNews from '@/components/home/popularNews';
import CuratedNews from '@/components/home/curatedNews';
import DailyMissionSection from '@/components/home/DailyMission';

export default function HomePage() {
  const { 
    nickname, fetchNickname, fetchPopularNews, fetchCuratedNews,
    fetchGuideData, guideMessage,
    isGuideChecked, isGuideRead, checkGuide
  } = useHomeStore();

  useEffect(() => {
    fetchNickname();
    fetchPopularNews();
    fetchCuratedNews(true);
    fetchGuideData();
  }, [fetchNickname, fetchPopularNews, fetchCuratedNews, fetchGuideData]);

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
            {isGuideChecked && (
              <div className="absolute top-[0] left-[79.43px] z-30 animate-fade-in">
                <div className="relative bg-primary-30 text-gray-90 text-[12px] px-[15px] py-1 rounded-[16px] whitespace-nowrap font-medium">
                  {guideMessage}
                </div>
              </div>
            )}

            <div className={`relative z-20 ${!isGuideRead ? 'animate-shake' : 'animate-float'}`}>
              <Image src="/img-character-main.png" alt="핀토" width={111} height={155} priority />
            </div>  

            <div className={`absolute top-[-5px] z-30 transition-all duration-500 ease-in-out ${
              isGuideChecked ? 'left-[32px]' : 'right-[125px]'
            }`}>
              <div className="relative w-[63px] h-[48px]">
                <Image src="/home/notif.svg" alt="알림" fill className="object-contain" />
                {!isGuideRead && (
                  <div className="absolute top-[-2px] right-[-2px] z-10 w-[13px] h-[13px]">
                    <Image src="/home/dot.svg" alt="알림 도트" fill className="object-contain" />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-[-36px] px-[78px] mb-3">
              <Image src="/home/Ellipse.svg" alt="핀토 그림자" width={234} height={52} priority />
            </div>
          </div>

          {/* 체크리스트 영역: 외부 컴포넌트로 대체 */}
          <DailyMissionSection />
        </section>

        {/* 뉴스 섹션 */}
        <div className="flex flex-col w-full py-5">
          <PopularNews />
          <CuratedNews />
        </div>
      </div>
    </div>
  );
}