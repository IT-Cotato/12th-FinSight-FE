"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import Loading from "@/components/common/Loading";
import { CategoryBar } from "@/components/study/CategoryBar";
import { SortDropdown, type SortOption } from "@/components/study/SortDropdown";
import { NewsCard } from "@/components/study/NewsCard";
import { CategoryEditBottomSheet } from "@/components/study/CategoryEditBottomSheet";
import {
  getNewsList,
  type NewsItem,
  type NewsCategory,
  type NewsSort,
} from "@/lib/api/news";
import { CATEGORY_MAP } from "@/store/homeStore";
import {
  getCategoryOrder,
  updateCategoryOrder,
  type CategoryOrderItem,
} from "@/lib/api/user";

type Category = {
  category_id: number | null;
  name: string;
};

// 기본 카테고리 (API 실패 시 사용)
const DEFAULT_CATEGORIES: Category[] = [
  { category_id: null, name: "종합" },
  { category_id: 1, name: "금융" },
  { category_id: 2, name: "증권" },
  { category_id: 3, name: "산업/재계" },
  { category_id: 4, name: "부동산" },
  { category_id: 5, name: "중기/벤처" },
  { category_id: 6, name: "글로벌 경제" },
  { category_id: 7, name: "경제 일반" },
  { category_id: 8, name: "생활 경제" },
];

// 목 데이터 (API 응답이 없을 때 사용)
const MOCK_NEWS: NewsItem[] = [
  {
    newsId: 1,
    category: "FINANCE",
    title:
      "\"비트코인, 지금이 마지막 탈출 기회일 수도\"...섬뜩한 '폭락' 전망 나온 이유는",
    thumbnailUrl: "/study/thumbnail.png",
    coreTerms: [
      { termId: 9001, term: "카테고리" },
      { termId: 9002, term: "용어1" },
      { termId: 9003, term: "용어2" },
      { termId: 9004, term: "용어3" },
    ],
  },
  {
    newsId: 2,
    category: "STOCK",
    title:
      "\"비트코인, 지금이 마지막 탈출 기회일 수도\"...섬뜩한 '폭락' 전망 나온 이유는",
    thumbnailUrl: "/study/thumbnail.png",
    coreTerms: [
      { termId: 9001, term: "카테고리" },
      { termId: 9002, term: "용어1" },
      { termId: 9003, term: "용어2" },
      { termId: 9004, term: "용어3" },
    ],
  },
  {
    newsId: 3,
    category: "INDUSTRY",
    title:
      "\"비트코인, 지금이 마지막 탈출 기회일 수도\"...섬뜩한 '폭락' 전망 나온 이유는",
    thumbnailUrl: "/study/thumbnail.png",
    coreTerms: [
      { termId: 9001, term: "카테고리" },
      { termId: 9002, term: "용어1" },
      { termId: 9003, term: "용어2" },
      { termId: 9004, term: "용어3" },
    ],
  },
  {
    newsId: 4,
    category: "REAL_ESTATE",
    title:
      "\"비트코인, 지금이 마지막 탈출 기회일 수도\"...섬뜩한 '폭락' 전망 나온 이유는",
    thumbnailUrl: "/study/thumbnail.png",
    coreTerms: [
      { termId: 9001, term: "카테고리" },
      { termId: 9002, term: "용어1" },
      { termId: 9003, term: "용어2" },
      { termId: 9004, term: "용어3" },
    ],
  },
];

// 카테고리 ID를 API 카테고리 값으로 변환
const categoryIdToApiCategory = (
  categoryId: number | null,
  categoryItems: CategoryOrderItem[]
): NewsCategory => {
  if (!categoryId) return "ALL";

  const item = categoryItems.find(
    (item) => item.categoryId === categoryId
  );

  return (item?.code as NewsCategory) || "ALL";
};

// 정렬 옵션을 API 정렬 값으로 변환
const sortOptionToApiSort = (sort: SortOption): NewsSort => {
  return sort === "latest" ? "LATEST" : "POPULARITY";
};

export default function StudyPage() {
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null); // null = 종합(ALL)
  const [sortOption, setSortOption] = useState<SortOption>("latest");
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [categoryItems, setCategoryItems] = useState<CategoryOrderItem[]>([]);

  // 카테고리 순서 조회
  const fetchCategoryOrder = async () => {
    try {
      const response = await getCategoryOrder();
      const items = response.data.categories;

      // 종합을 맨 앞에 추가하고, API에서 받은 카테고리 사용
      const sortedCategories: Category[] = [
        { category_id: null, name: "종합" },
        ...items.map((item) => ({
          category_id: item.categoryId,
          name: item.nameKo,
        })),
      ];

      setCategories(sortedCategories); 
      setCategoryItems(items);
    } catch (err) {
      console.warn("카테고리 순서 API 호출 실패, 기본 카테고리 사용:", err);
      // 기본 카테고리 사용
      setCategories(DEFAULT_CATEGORIES);
      setCategoryItems([]);
    }
  };

  // 뉴스 리스트 조회
  const fetchNewsList = async (cursor?: string, reset = false) => {
    try {
      setLoading(true);

      const response = await getNewsList({
        category: categoryIdToApiCategory(selectedCategoryId, categoryItems),
        sort: sortOptionToApiSort(sortOption),
        size: 40,
        cursor,
      });

      // 초기 로드 시 뉴스 리스트 초기화
      if (reset) {
        setNewsList(response.data.news);
      } else {
        setNewsList((prev) => [...prev, ...response.data.news]); // 더보기 버튼 클릭 시 뉴스 리스트 추가
      }

      setNextCursor(response.data.nextCursor);
      setHasNext(response.data.hasNext); 
    } catch (err) {
      // API 실패 시 목 데이터 사용
      console.warn("API 호출 실패, 목 데이터 사용:", err);
      if (reset) {
        setNewsList(MOCK_NEWS);
      } else {
        setNewsList((prev) => [...prev, ...MOCK_NEWS]);
      }
      setNextCursor(null);
      setHasNext(false);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  // 카테고리 순서 초기 로드
  useEffect(() => {
    fetchCategoryOrder();
  }, []);

  // 초기 로드 및 카테고리/정렬 변경 시
  useEffect(() => {
    if (categoryItems.length > 0) {
      fetchNewsList(undefined, true); // 초기 로드 시 뉴스 리스트 초기화
    }
  }, [selectedCategoryId, sortOption, categoryItems]);

  const handleSearchClick = () => {
    router.push("/study/search"); // 검색 페이지로 이동
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort); // 정렬 옵션 변경
  };

  const handleCategoryEditClick = () => {
    // 바텀시트가 열릴 때 최신 카테고리 순서를 가져옴
    fetchCategoryOrder();
    setIsCategoryEditOpen(true);
  };

  const handleCategorySave = async (editedCategories: Category[]) => {
    try {
      // 종합(category_id: null)을 제외한 카테고리만 orders 배열로 변환
      const orders = editedCategories
        .filter((cat): cat is Category & { category_id: number } => cat.category_id !== null)
        .map((cat, index) => ({
          categoryId: cat.category_id,
          sortOrder: index + 1, // 1부터 시작하는 순서
        }));

      // API 호출로 카테고리 순서 저장
      await updateCategoryOrder(orders);

      // 성공 시 로컬 state 업데이트
      setCategories(editedCategories);

      // 카테고리 순서를 다시 가져와서 최신 상태로 동기화
      await fetchCategoryOrder();
    } catch (err) {
      console.error("카테고리 순서 저장 실패:", err);
    }
  };

  const handleLoadMore = () => {
    if (hasNext && nextCursor && !loading) {
      fetchNewsList(nextCursor, false);
    }
  };

  return (
    <div className="flex flex-col bg-bg-100">
      {/* 헤더 */}
      <Header
        title="학습"
        rightSlot={
          <button onClick={handleSearchClick} aria-label="검색">
            <Image src="/study/search.png" alt="검색" width={19} height={19} />
          </button>
        }
      />

      {/* 카테고리 바 */}
      <CategoryBar
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={handleCategoryChange}
        onEditClick={handleCategoryEditClick}
      />

      {/* 정렬 드롭다운 */}
      <SortDropdown value={sortOption} onChange={handleSortChange} />

      {/* 뉴스 리스트 */}
      <div className="flex-1">
        {loading && newsList.length === 0 ? (
          <Loading className="min-h-[60vh]" />
        ) : newsList.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-400">뉴스가 없습니다.</p>
          </div>
        ) : (
          newsList.map((news) => {
            // 카테고리바가 "종합"으로 선택되어 있을 때만 카테고리를 태그 맨 앞에 추가
            const categoryName = "#" + CATEGORY_MAP[news.category];
            const baseTags = news.coreTerms?.map((term) => term.term) || [];

            // 종합 선택 시 카테고리를 태그 맨 앞에 추가 (카테고리 매핑이 있을 때만)
            const tags = selectedCategoryId === null && categoryName
              ? [categoryName, ...baseTags].slice(0, 3)
              : baseTags.slice(0, 3);

            return (
              <NewsCard
                key={news.newsId}
                title={news.title}
                thumbnailUrl={news.thumbnailUrl}
                tags={tags}
                href={`/study/${news.newsId}`}
                newsId={news.newsId}
              />
            );
          })
        )}
      </div>

      {/* 기사 더보기 버튼 */}
      {hasNext && nextCursor && (
        <div className="px-4 py-4 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="flex items-center justify-center w-full gap-[5px] px-[10px] py-[10px] rounded-[8px] border border-bg-80 bg-bg-90 text-center text-b3 text-gray-40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>기사 더보기</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="7"
              viewBox="0 0 10 7"
              fill="none"
            >
              <path
                d="M0.650024 0.649902L4.49385 5.45469C4.57392 5.55477 4.72613 5.55477 4.8062 5.45469L8.65002 0.649902"
                stroke="#D5D5D5"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* 카테고리 편집 바텀시트 */}
      <CategoryEditBottomSheet
        open={isCategoryEditOpen}
        onOpenChange={setIsCategoryEditOpen}
        categories={categories}
        onSave={handleCategorySave}
      />
    </div>
  );
}
