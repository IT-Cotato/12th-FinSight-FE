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

          <div 
            className="relative z-10 flex-1 flex flex-col items-center justify-center mt-[30px] cursor-pointer"
            onClick={checkGuide}
          >
            {isGuideChecked && (
              <div 
                className="absolute z-30 animate-fade-in flex items-center"
                style={{
                  top: '-30px',
                  left: '50%',
                  transform: 'translateX(-52%)',
                  maxWidth: 'calc(100vw - 40px)',  // ✅ 화면 밖으로 안 나가게
                  gap: '5.43px',  // ✅ 아이콘-말풍선 간격
                }}
              >
                <div 
                  className="flex-shrink-0"
                  style={{
                    width: '63px',
                    height: '48px',
                    boxShadow: '0 0 20px 0 rgba(21, 21, 64, 0.70)',
                  }}
                >
                  <Image 
                    src="/home/notif.svg" 
                    alt="편지" 
                    width={63} 
                    height={48}
                    style={{ width: '63px', height: '48px' }}
                  />
                </div>
                
                <div 
                  className="relative bg-primary-30 text-gray-90 font-medium"
                  style={{
                    fontSize: '12px',
                    lineHeight: '180%',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    borderRadius: '16px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {guideMessage}
                </div>
              </div>
            )}

            <div className={`relative z-20 ${!isGuideRead ? 'animate-shake' : 'animate-float'}`}>
              <Image src="/img-character-main.png" alt="핀토" width={111} height={155} priority />
              
              {!isGuideChecked && (
                <div 
                  className="absolute z-30"
                  style={{
                    top: '3px',
                    right: '-20px',
                  }}
                >
                  <div className="relative" style={{ width: '63px', height: '48px' }}>
                    <Image 
                      src="/home/notif.svg" 
                      alt="알림" 
                      width={63} 
                      height={48}
                      style={{ width: '63px', height: '48px' }}
                    />
                    {!isGuideRead && (
                      <div 
                        className="absolute z-10 w-[13px] h-[13px]"
                        style={{
                          top: '6px',
                          right: '10px',
                        }}
                      >
                        <Image src="/home/dot.svg" alt="알림 도트" width={13} height={13} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-[-36px] px-[78px] mb-3">
              <Image src="/home/Ellipse.svg" alt="핀토 그림자" width={234} height={52} priority />
            </div>
          </div>

          <DailyMissionSection />
        </section>

        <div className="flex flex-col w-full py-5">
          <PopularNews />
          <CuratedNews />
        </div>
      </div>
    </div>
  );
}