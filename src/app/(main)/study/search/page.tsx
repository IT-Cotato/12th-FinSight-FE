"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Header } from "@/components/common/Header";
import { useRouter, useSearchParams } from "next/navigation";
import { NewsCard } from "@/components/study/NewsCard";
import { CategoryBar } from "@/components/study/CategoryBar";
import { SortDropdown, type SortOption } from "@/components/study/SortDropdown";
import {
  searchNews,
  type NewsItem,
  type NewsCategory,
  type NewsSort,
} from "@/lib/api/news";
import { getCategoryOrder, type CategoryOrderItem } from "@/lib/api/user";
import { CATEGORY_MAP } from "@/store/homeStore";

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

// 카테고리 ID를 API 카테고리 값으로 변환
const categoryIdToApiCategory = (
  categoryId: number | null,
  categoryMapping: Map<number, string>
): NewsCategory => {
  if (!categoryId) return "ALL";
  const code = categoryMapping.get(categoryId);
  return (code as NewsCategory) || "ALL";
};

// 정렬 옵션을 API 정렬 값으로 변환
const sortOptionToApiSort = (sort: SortOption): NewsSort => {
  return sort === "latest" ? "LATEST" : "POPULARITY";
};

// 뒤로가기 버튼
function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="뒤로가기"
      className="flex items-center justify-center"
    >
      <Image
        src="/study/icon-back.svg"
        alt="뒤로가기"
        width={9}
        height={16}
      />
    </button>
  );
}

// 검색 기본 화면
function SearchEmptyView() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-[15px]">
      <Image
        src="/study/img-search.svg"
        alt="검색 기본 화면"
        width={219}
        height={155}
      />
      <p className="text-b1 text-bg-30">키워드와 내용을 검색해보세요</p>
    </div>
  );
}

// 검색 결과 없음 화면
function SearchNoResult() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-[15px]">
      <Image
        src="/study/img-sweat.svg"
        alt="검색 결과 없음"
        width={130}
        height={166}
      />
      <p className="text-b1 text-bg-30">일치하는 검색 결과가 없어요!</p>
    </div>
  );
}

// 페이지네이션 컴포넌트
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 px-4 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="이전 페이지"
      >
        <span className="text-b3 text-gray-40">&lt;</span>
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage
              ? "bg-primary-50 text-gray-10"
              : "text-gray-40"
          } text-b3`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="다음 페이지"
      >
        <span className="text-b3 text-gray-40">&gt;</span>
      </button>
    </div>
  );
}

// 검색 페이지
export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [searched, setSearched] = useState(false);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("latest");
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [categoryMapping, setCategoryMapping] = useState<Map<number, string>>(new Map());

  // 카테고리 순서 조회
  const fetchCategoryOrder = async () => {
    try {
      const response = await getCategoryOrder();
      const categoryItems = response.data.categories;

      const sortedCategories: Category[] = [
        { category_id: null, name: "종합" },
        ...categoryItems
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((item) => ({
            category_id: item.categoryId,
            name: item.nameKo,
          })),
      ];

      setCategories(sortedCategories);

      const mapping = new Map<number, string>();
      categoryItems.forEach((item) => {
        mapping.set(item.categoryId, item.code);
      });
      setCategoryMapping(mapping);
    } catch (err) {
      console.warn("카테고리 순서 API 호출 실패, 기본 카테고리 사용:", err);
      setCategories(DEFAULT_CATEGORIES);
      const defaultMapping = new Map<number, string>([
        [1, "FINANCE"],
        [2, "STOCK"],
        [3, "INDUSTRY"],
        [4, "REAL_ESTATE"],
        [5, "VENTURE"],
        [6, "GLOBAL"],
        [7, "GENERAL"],
        [8, "LIVING"],
      ]);
      setCategoryMapping(defaultMapping);
    }
  };

  // 검색 실행
  const handleSearch = useCallback(async () => {
    if (!keyword.trim()) return;

    try {
      setLoading(true);
      setSearched(true);
      setCurrentPage(1);

      const response = await searchNews({
        q: keyword.trim(),
        category: categoryIdToApiCategory(selectedCategoryId, categoryMapping),
        sort: sortOptionToApiSort(sortOption),
        page: 1,
      });

      setNewsList(response.data.news);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("검색 실패:", err);
      setNewsList([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [keyword, selectedCategoryId, categoryMapping, sortOption]);

  // 페이지 변경
  const handlePageChange = async (page: number) => {
    if (!keyword.trim() || page < 1 || page > totalPages) return;

    try {
      setLoading(true);

      const response = await searchNews({
        q: keyword.trim(),
        category: categoryIdToApiCategory(selectedCategoryId, categoryMapping),
        sort: sortOptionToApiSort(sortOption),
        page,
      });

      setNewsList(response.data.news);
      setCurrentPage(page);
      setTotalPages(response.data.totalPages);

      // 페이지 상단으로 스크롤
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("페이지 변경 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리/정렬 변경 시 재검색
  useEffect(() => {
    if (searched && keyword.trim()) {
      handleSearch();
    }
  }, [selectedCategoryId, sortOption]);

  // URL 쿼리 파라미터에서 검색어 읽기 및 자동 검색
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      const decodedQ = decodeURIComponent(q);
      setKeyword(decodedQ);
      setSearched(false); // 검색어가 변경되면 searched 초기화
    }
  }, [searchParams]);

  // 카테고리 순서 초기 로드
  useEffect(() => {
    fetchCategoryOrder();
  }, []);

  // URL 쿼리 파라미터가 있고 카테고리 매핑이 준비되면 자동 검색
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && categoryMapping.size > 0 && keyword && !searched) {
      const decodedQ = decodeURIComponent(q);
      if (decodedQ === keyword.trim()) {
        handleSearch();
      }
    }
  }, [searchParams, categoryMapping, keyword, searched, handleSearch]);

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-bg-100">
      {/* 검색 입력 영역 헤더 */}
      <Header
        variant="center"
        leftSlot={<BackButton />}
        centerSlot={
          <div className="flex w-full items-center h-[40px] px-5 gap-[10px] rounded-[8px] bg-bg-80">
            <Image
              src="/study/search.png"
              alt="검색"
              width={13}
              height={13}
            />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="검색어를 입력해주세요."
              className="w-full bg-bg-80 text-gray-50 outline-none focus:outline-none ring-0 focus:ring-0 focus:ring-offset-0"
            />
          </div>
        }
      />

      {/* 검색 결과가 있을 때만 카테고리 바와 정렬 표시 */}
      {searched && newsList.length > 0 && (
        <>
          {/* 카테고리 바 */}
          <CategoryBar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={handleCategoryChange}
          />

          {/* 정렬 드롭다운 */}
          <SortDropdown value={sortOption} onChange={handleSortChange} />
        </>
      )}

      {/* 결과 영역 */}
      <div className="flex-1 min-h-0 flex flex-col">
        {!searched && (
          <div className="flex flex-1 items-center justify-center">
            <SearchEmptyView />
          </div>
        )}

        {loading && newsList.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-gray-400">검색 중...</p>
          </div>
        )}

        {searched && !loading && newsList.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <SearchNoResult />
          </div>
        )}

        {searched && newsList.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto">
              {newsList.map((news) => {
                // 카테고리바가 "종합"으로 선택되어 있을 때만 카테고리를 태그 맨 앞에 추가
                const categoryName = CATEGORY_MAP[news.category];
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
              })}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
