'use client';

import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { useHomeStore } from '@/store/homeStore';

export default function CuratedNews() {
  const { 
    nickname, 
    userCategories, 
    fetchUserCategories,
    selectedCategory, 
    setSelectedCategory, 
    curatedNews, 
    fetchCuratedNews, 
    isCuratedLoading, 
    curatedHasMore 
  } = useHomeStore();

  const { ref, inView } = useInView({ threshold: 0.1 });

  // 1. 탭 메뉴 구성 로직 점검: '종합' + 서버에서 받아온 관심분야
  const myCategories = useMemo(() => {
    const defaultTab = { section: 'ALL', displayName: '종합' };
    // userCategories가 배열인지 확인 후 합치기
    return [defaultTab, ...(Array.isArray(userCategories) ? userCategories : [])];
  }, [userCategories]);

  // 2. 컴포넌트 마운트 시 관심분야 API 호출
  useEffect(() => {
    fetchUserCategories();
  }, [fetchUserCategories]);

  // 무한 스크롤 및 카테고리 변경 시 데이터 호출 로직
  useEffect(() => {
    if (inView && curatedHasMore && !isCuratedLoading) {
      fetchCuratedNews();
    }
  }, [inView, curatedHasMore, isCuratedLoading, fetchCuratedNews]);

  useEffect(() => {
    fetchCuratedNews(true);
  }, [selectedCategory, fetchCuratedNews]);

  return (
    <section className="px-5">
      <p className="text-[16px] text-[#8E8E93] font-medium leading-[180%] tracking-[-0.16px]">
        관심사에 맞는 뉴스 큐레이션
      </p>
      <h2 className="text-[20px] text-white font-semibold mb-[5px]">
        {nickname || '사용자'}님 맞춤 뉴스
      </h2>

      {/* 3. 탭 메뉴 렌더링 영역 */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar py-[10px]">
        {myCategories.map((cat) => (
          <button
            key={cat.section}
            onClick={() => setSelectedCategory(cat.section)}
            className={`px-4 py-2 rounded-full text-[14px] font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.section
                ? 'bg-[#8E8FFA] text-white' // 활성화 상태 (보라색)
                : 'bg-[#1C1E22] text-[#8E8E93]' // 비활성화 상태
            }`}
          >
            {cat.displayName}
          </button>
        ))}
      </div>

      {/* 4. 뉴스 리스트 영역 (기존 스타일 유지) */}
      <div className="flex flex-col gap-6 mt-2">
        {curatedNews.length === 0 && !isCuratedLoading ? (
          <div className="py-10 text-center text-[#8E8E93]">표시할 뉴스가 없습니다.</div>
        ) : (
          curatedNews.map((news, idx) => (
            <div key={`${news.newsId}-${idx}`} className="flex gap-4 items-center group cursor-pointer">
              {/* 뉴스 썸네일 */}
              <div className="relative w-[100px] h-[75px] shrink-0 rounded-[12px] overflow-hidden bg-[#1C1E22]">
                <Image 
                  src={news.thumbnailUrl || "/home/news-placeholder.png"} 
                  alt="" 
                  fill 
                  className="object-cover group-active:scale-105 transition-transform" 
                />
              </div>

              {/* 뉴스 정보 */}
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-[15px] text-white font-medium line-clamp-2 leading-[140%] break-keep">
                  {news.title}
                </h3>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[10px] text-[#8E8E93] bg-[#1C1E22] px-2 py-0.5 rounded-[4px] font-bold">
                    {/* 뉴스 카테고리 표시 */}
                    {myCategories.find(c => c.section === news.category)?.displayName || news.category}
                  </span>
                  {news.terms?.slice(0, 3).map((term) => (
                    <span key={term.termId} className="text-[10px] text-[#8E8E93] bg-[#1C1E22] px-2 py-0.5 rounded-[4px]">
                      {term.displayName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {curatedHasMore && (
        <div ref={ref} className="flex h-[100px] items-center justify-center">
          {isCuratedLoading && (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#8E8FFA] border-t-transparent" />
          )}
        </div>
      )}
    </section>
  );
}