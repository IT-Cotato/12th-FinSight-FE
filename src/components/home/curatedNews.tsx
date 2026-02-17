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

  // 탭 메뉴 구성 로직 점검: '종합' + 서버에서 받아온 관심분야
  const myCategories = useMemo(() => {
    const defaultTab = { section: 'ALL', displayName: '종합' };
    return [defaultTab, ...(Array.isArray(userCategories) ? userCategories : [])];
  }, [userCategories]);

  const formattedCategories = useMemo(() => {
      return myCategories.map((cat, index) => ({
        category_id: index, // 0부터 시작하는 숫자 ID 부여
        name: cat.displayName,
        section: cat.section // 내부 추적용
      }));
    }, [myCategories]);

  // 현재 선택된 string(section)을 기반으로 현재 선택된 category_id 찾기
  const selectedCategoryId = useMemo(() => {
    const found = formattedCategories.find(c => c.section === selectedCategory);
    return found ? found.category_id : 0;
  }, [selectedCategory, formattedCategories]);

  // 초기 카테고리 로드
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

      {/* 기존 탭 렌더링 영역 -> CategoryBar 컴포넌트로 교체 */}
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

      {/*  뉴스 리스트 영역 */}
      <div className="flex flex-col mx-[-20px] mt-2"> {/* NewsCard 자체 패딩을 고려하여 mx-[-20px] 추가 */}
        {curatedNews.length === 0 && !isCuratedLoading ? (
          <div className="py-10 text-center text-[#8E8E93]">표시할 뉴스가 없습니다.</div>
        ) : (
          curatedNews.map((news, idx) => {
            // 카테고리DisplayName + 키워드 3개를 합쳐서 tags 생성
            const categoryName = myCategories.find(c => c.section === news.category)?.displayName || news.category;
            const newsTags = [categoryName, ...(news.terms?.map(t => t.displayName) || [])].slice(0, 3);

            return (
              /* NewsCard 내부의 썸네일 크기를 강제로 조정  */
              <div key={`${news.newsId}-${idx}`} className="news-card-custom">
                <NewsCard 
                  title={news.title}
                  thumbnailUrl={news.thumbnailUrl || "/home/news-placeholder.png"}
                  tags={newsTags}
                  href={`/study/${news.newsId}`}
                />
                
                {/* 홈에서만 뉴스 썸네일 크기를 아래처럼 덮어 씌움
*/}
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