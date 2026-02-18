'use client';

import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useHomeStore } from '@/store/homeStore';
import { CategoryBar } from '@/components/study/CategoryBar';
import { NewsCard } from '@/components/study/NewsCard';

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

  const myCategories = useMemo(() => {
    const defaultTab = { section: 'ALL', displayName: '종합' };
    return [defaultTab, ...(Array.isArray(userCategories) ? userCategories : [])];
  }, [userCategories]);

  const formattedCategories = useMemo(() => {
    return myCategories.map((cat, index) => ({
      category_id: index,
      name: cat.displayName,
      section: cat.section
    }));
  }, [myCategories]);

  const selectedCategoryId = useMemo(() => {
    const found = formattedCategories.find(c => c.section === selectedCategory);
    return found ? found.category_id : 0;
  }, [selectedCategory, formattedCategories]);

  useEffect(() => {
    fetchUserCategories();
  }, [fetchUserCategories]);

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

      <div className='mx-[-20px]'>
        <CategoryBar 
          categories={formattedCategories}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={(id) => {
            const target = formattedCategories.find(c => c.category_id === id);
            if (target) setSelectedCategory(target.section);
          }}
        />
      </div>

      <div className="flex flex-col mx-[-20px] mt-2">
        {curatedNews.length === 0 && !isCuratedLoading ? (
          <div className="py-10 text-center text-[#8E8E93]">표시할 뉴스가 없습니다.</div>
        ) : (
          curatedNews.map((news, idx) => {
            // 💡 [수정 포인트 1] ID 방어 로직: newsId가 없으면 id라도 사용하고, 둘 다 없으면 렌더링하지 않음
            const currentNewsId = news.newsId || (news as any).id;
            if (!currentNewsId) return null;

            const categoryName = myCategories.find(c => c.section === news.category)?.displayName || news.category;
            const newsTags = [categoryName, ...(news.terms?.map(t => t.displayName) || [])].slice(0, 3);

            return (
              <div key={`${currentNewsId}-${idx}`} className="news-card-custom">
                <NewsCard 
                  title={news.title}
                  thumbnailUrl={news.thumbnailUrl || "/home/news-placeholder.png"}
                  tags={newsTags}
                  // 💡 [수정 포인트 2] 검증된 ID를 주소에 사용
                  href={`/study/${currentNewsId}`}
                />
                
                <style jsx global>{`
                  .news-card-custom .flex-shrink-0.w-20.h-20 {
                    width: 98px !important;
                    height: 75px !important;
                  }
                `}</style>
              </div>
            );
          })
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