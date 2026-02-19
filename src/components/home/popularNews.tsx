'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useHomeStore, type NewsItem, CATEGORY_MAP } from '@/store/homeStore';

export default function PopularNews() {
  const { popularNews, isLoadingNews, hasMoreNews, fetchPopularNews, loadMoreNews } = useHomeStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPopularNews();
  }, [fetchPopularNews]);

  const handleMoreClick = async () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
    
    if (hasMoreNews) {
      await loadMoreNews();
    }
  };

  return (
    <section className="mb-[40px]">
      <div className="flex justify-between items-end px-5 mb-4">
        <div>
          <p className="text-[16px] text-[--color-gray-40] font-medium leading-[180%] tracking-[-0.16px]">실시간 인기 뉴스</p>
          <h2 className="text-[20px] text-[--color-gray-20] font-semibold leading-[130%] tracking-[-0.2px]">많은 사람들이 보고 있어요</h2>
        </div>
        
        <button 
          onClick={handleMoreClick}
          disabled={!hasMoreNews && !isLoadingNews}
          className="flex items-center gap-2 text-[--color-gray-50] text-[13px] font-medium leading-[180%] tracking-[-0.13px] active:opacity-50 disabled:opacity-30"
        >
          더보기 
          <div className="relative w-[6px] h-[10px]">
            <Image src="/home/Vector-7.svg" alt="" fill className="object-contain" />
          </div>
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-5 hide-scrollbar touch-pan-x scroll-smooth items-center"
      >
        {popularNews.length === 0 && isLoadingNews ? (
          [1, 2, 3].map((i) => (
            <div key={`skeleton-${i}`} className="shrink-0 w-[140px] h-[200px] bg-[#1C1E22] rounded-[16px] animate-pulse" />
          ))
        ) : (
          <>
            {popularNews.map((news, idx) => (
              <PopularNewsCard key={`${news.newsId}-${idx}`} news={news} rank={idx + 1} />
            ))}
            
            {isLoadingNews && (
              <div className="shrink-0 w-[140px] h-[200px] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[--color-primary-80] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function PopularNewsCard({ news, rank }: { news: NewsItem; rank: number }) {
  // 영어 카테고리를 한글로 변환 (매핑된 게 없으면 원래 영어 사용)
  const categoryName = CATEGORY_MAP[news?.category] || news?.category;

  return (
    // Link로 감싸서 클릭 시 상세 페이지로 이동
    <Link href={`/study/${news.newsId}`}>
      <div className="relative shrink-0 w-[140px] h-[200px] rounded-[16px] overflow-hidden bg-[#1C1E22] active:scale-95 transition-transform group cursor-pointer">
        <Image 
          src={news?.thumbnailUrl || "/home/mockData.svg"}
          alt={news?.title || "뉴스 이미지"} 
          fill 
          className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute inset-0 p-3 flex flex-col justify-between">
          <h3 className="text-[13px] font-semibold leading-[140%] text-white line-clamp-2 break-keep">
            {news?.title}
          </h3>
          <div className="flex justify-between items-end">
            <span className="px-2 py-0.5 bg-[--color-primary-80] text-[--color-primary-10] text-[10px] font-bold rounded-full">
              {/* 변환된 한글 카테고리명 사용 */}
              #{categoryName}
            </span>
            <span 
              className="text-[40px] font-black leading-[1] text-white"
              style={{
                letterSpacing: '-2px',  // ✅ 자간 조정
                lineHeight: '0.9',  // ✅ 줄간격 축소
              }}
            >
              {rank}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}