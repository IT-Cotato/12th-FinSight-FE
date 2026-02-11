'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useHomeStore } from '@/store/homeStore';
import { useOnboardingStore } from '@/store/onboardingStore';

// API 데이터 타입 정의
interface NewsItem {
  id: number;
  title: string;
  category: string;
  author: string;
  thumbnailUrl: string;
}

export default function HomePage() {
  const { 
    isGuideChecked, isNewsSaved, isQuizSolved, 
    checkGuide, toggleNewsSaved, toggleQuizSolved 
  } = useHomeStore();

  const nickname = useOnboardingStore((state) => state.nickname) || '사용자';
  
  const [popularNews, setPopularNews] = useState<NewsItem[]>([]);
  const [customNews, setCustomNews] = useState<NewsItem[]>([]);
  const [categories] = useState<string[]>(['종합', '금융', '증권', '산업/재계']);
  const [activeCategory, setActiveCategory] = useState('종합');

  return (
    <div className="relative w-full min-h-dvh bg-[#131416] text-white font-pretendard pb-[100px] overflow-x-hidden select-none">
      {/* 1. 상단 섹션 (Figma Scale 적용: W 390px / H 463px) */}
      <section className="relative w-full h-[463px] pt-[60px] flex flex-col items-center shrink-0">
        {/* 배경 그라데이션 */}
        <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(ellipse_at_85%_21%,_#151540_0%,_#131416_80%)] opacity-80 pointer-events-none" />
        
        {/* 인사말 */}
        <div className="relative z-10 text-center mb-[30px]">
          <h1 className="text-[22px] text-[var(--color-primary-10)] font-semibold leading-[130%] tracking-[-0.22px]">
            {nickname}님 반가워요!
          </h1>
          <p className="text-[16px] text-[var(--color-gray-50)] font-semibold leading-[180%] tracking-[-0.16px]">
            오늘의 학습 가이드 확인하기
          </p>
        </div>

        {/* 캐릭터 영역 */}
        <div className="relative z-10" onClick={checkGuide}>
          <div className={!isGuideChecked ? 'animate-shake' : 'animate-float'}>
            <Image src="/img-character-main.png" alt="핀토" width={111} height={155} priority />
          </div>
          {!isGuideChecked && (
            <div className="absolute top-[15px] right-[15px] w-[10px] h-[10px] bg-[#4B61FF] rounded-full border-[2px] border-[#131416]" />
          )}
        </div>

        {/* 일일 체크리스트 (섹션 내 하단 고정) */}
        <div className="absolute bottom-[40px] w-full px-5 z-10">
          <header className="mb-4 text-left">
            <p className="text-[12px] text-[var(--color-gray-50)] mb-1">금융 인사이트를 넓히는 습관</p>
            <h2 className="text-[18px] font-bold text-white leading-[130%]">일일 체크리스트</h2>
          </header>
          <div className="grid grid-cols-2 gap-3">
            <CheckItem title="뉴스 1개 저장하기" icon="📄" isActive={isNewsSaved} onClick={toggleNewsSaved} />
            <CheckItem title="퀴즈 1개 풀기" icon="❓" isActive={isQuizSolved} onClick={toggleQuizSolved} />
          </div>
        </div>
      </section>

      {/* 2. 실시간 인기 뉴스 (hide-scrollbar 적용) */}
      <section className="mt-[20px] mb-[40px]">
        <div className="flex justify-between items-center px-5 mb-4">
          <h2 className="text-[18px] font-bold text-white">실시간 인기 뉴스</h2>
          <button className="text-[var(--color-gray-50)] text-[12px] active:opacity-50">더보기 &gt;</button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-5 hide-scrollbar touch-pan-x">
          {(popularNews.length > 0 ? popularNews : [1, 2, 3]).map((news, idx) => (
            <div key={idx} className="shrink-0 w-[145px] aspect-[145/180] relative rounded-xl overflow-hidden bg-[#1C1E22] active:scale-95 transition-transform">
              <Image src={typeof news === 'number' ? `/img-news-thumb-${news}.png` : news.thumbnailUrl} alt="news" fill className="object-cover opacity-60" />
              <div className="absolute inset-0 p-3 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-[var(--color-primary-40)] text-[16px] font-bold italic mb-1 text-left">{idx + 1}</p>
                <p className="text-[13px] font-medium leading-tight line-clamp-2 text-white text-left">
                  {typeof news === 'number' ? '삼성전자 영업익 20조 달성 배경' : news.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 맞춤 뉴스 (hide-scrollbar 적용) */}
      <section className="px-5">
        <h2 className="text-[18px] font-bold mb-4 text-white text-left">{nickname}님 맞춤 뉴스</h2>
        <div className="flex gap-2 mb-5 overflow-x-auto hide-scrollbar touch-pan-x">
          {categories.map((tag) => (
            <button 
              key={tag} 
              onClick={() => setActiveCategory(tag)}
              className={`px-4 py-1.5 shrink-0 rounded-full text-[13px] active:scale-90 transition-transform ${activeCategory === tag ? 'bg-[#4B61FF] text-white' : 'bg-[#1C1E22] text-[var(--color-gray-50)]'}`}
            >
              {tag}
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          {(customNews.length > 0 ? customNews : [1, 2, 3, 4, 5]).map((news, idx) => (
            <div key={idx} className="flex gap-4 items-center bg-transparent active:bg-white/5 p-1 rounded-xl transition-colors">
              <div className="w-[80px] h-[80px] bg-[#1C1E22] rounded-xl shrink-0 overflow-hidden relative">
                <Image src={typeof news === 'number' ? "/img-news-placeholder.png" : news.thumbnailUrl} alt="thumb" fill className="object-cover" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-[14px] font-medium leading-[140%] line-clamp-2 mb-2 text-white">
                  {typeof news === 'number' ? '"비트코인, 지금이 마지막 탈출 기회일 수도"... 섬뜩한 \'폭락\' 전망 나온 이유는' : news.title}
                </h3>
                <div className="flex gap-2">
                  <span className="text-[10px] text-[var(--color-gray-60)] px-2 py-0.5 bg-[#1C1E22] rounded">
                    {typeof news === 'number' ? '가상화폐' : news.category}
                  </span>
                  <span className="text-[10px] text-[var(--color-gray-60)] px-2 py-0.5 bg-[#1C1E22] rounded">
                    {typeof news === 'number' ? '분석자' : news.author}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CheckItem({ title, icon, isActive, onClick }: { title: string, icon: string, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-center gap-2 py-[18px] rounded-2xl border transition-all active:scale-95 ${isActive ? 'bg-[rgba(75,97,255,0.15)] border-[#4B61FF]' : 'bg-[#1C1E22] border-transparent'}`}>
      <span className={isActive ? 'opacity-100' : 'opacity-40 text-[18px]'}>{isActive ? '✅' : icon}</span>
      <span className={`text-[14px] font-medium ${isActive ? 'text-[#4B61FF]' : 'text-[var(--color-gray-10)]'}`}>{title}</span>
    </button>
  );
}