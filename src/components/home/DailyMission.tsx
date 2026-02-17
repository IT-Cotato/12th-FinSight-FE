'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useHomeStore } from '@/store/homeStore';

export default function DailyMissionSection() {
  const router = useRouter();
  const { isNewsSaved, isQuizSolved, isQuizReviewChecked, fetchMissionStatus } = useHomeStore();

  // 마운트 시 서버에서 최신 상태 불러오기
  useEffect(() => {
    fetchMissionStatus();
  }, [fetchMissionStatus]);

  // 학습탭 다녀온 후 돌아왔을 때도 상태 갱신
  useEffect(() => {
    const handleFocus = () => fetchMissionStatus();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchMissionStatus]);

  const handleNewsClick = () => router.push('/study');
  const handleQuizClick = () => router.push('/study');
  const handleQuizReviewClick = () => router.push('/archive');

  const missions = [
    {
      id: 'news',
      title: '뉴스 1개 저장하기',
      iconPath: '/home/news.svg',
      isActive: isNewsSaved,
      onClick: handleNewsClick,
    },
    {
      id: 'quiz',
      title: '퀴즈 1개 풀기',
      iconPath: '/home/img-word.svg',
      isActive: isQuizSolved,
      onClick: handleQuizClick,
    },
    {
      id: 'review',
      title: '보관한 퀴즈 복습하기',
      iconPath: '/home/quiz.svg',
      isActive: isQuizReviewChecked,
      onClick: handleQuizReviewClick,
    },
  ];

  const sortedMissions = [...missions].sort((a, b) => Number(a.isActive) - Number(b.isActive));

  return (
    <div className="relative z-10 w-full">
      <header className="px-5 mb-4 text-left">
        <p className="text-[14px] text-[--color-bg-30] font-medium mb-1 leading-[180%] tracking-[-0.14px]">
          금융 인사이트를 넓히는 습관
        </p>
        <h2 className="text-[18px] font-semibold text-[--color-bg-20] leading-[130%] tracking-[-0.18px]">
          일일 체크리스트
        </h2>
      </header>

      <div className="flex gap-3 overflow-x-auto px-5 mb-5 touch-pan-x text-[14px] text-[--color-bg-10] hide-scrollbar">
        {sortedMissions.map((mission) => (
          <CheckItem
            key={mission.id}
            title={mission.title}
            iconPath={mission.iconPath}
            isActive={mission.isActive}
            onClick={mission.onClick}
          />
        ))}
      </div>
    </div>
  );
}

// CheckItem은 그대로 유지
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