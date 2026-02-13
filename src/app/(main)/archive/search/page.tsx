"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/common/Header";
import { CategoryBar } from "@/components/study/CategoryBar";
import { ArchiveNewsCard } from "@/components/archive/ArchiveNewsCard";
import { ArchiveTermCard } from "@/components/archive/ArchiveTermCard";
import { ArchiveSortDropdown } from "@/components/archive/ArchiveSortDropdown";
import { getCategoryOrder } from "@/lib/api/user";
import { getStorageFolders, searchStorageNews, searchStorageTerms, type StorageNewsSearchItem, type StorageTermsSearchItem } from "@/lib/api/storage";

type TabType = "news" | "terms";

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

// 동적 렌더링 설정 (useSearchParams 사용으로 인해 필요)
export const dynamic = 'force-dynamic';

// 보관함 검색 페이지
export default function ArchiveSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [searched, setSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("news");
  const [newsList, setNewsList] = useState<StorageNewsSearchItem[]>([]);
  const [termsList, setTermsList] = useState<StorageTermsSearchItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [defaultFolderId, setDefaultFolderId] = useState<number | null>(null);
  const [folders, setFolders] = useState<Category[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [categoryMapping, setCategoryMapping] = useState<Map<string, string>>(new Map());
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // URL 쿼리 파라미터에서 폴더 ID와 탭 읽기
  const urlFolderId = searchParams.get("folderId") ? parseInt(searchParams.get("folderId")!, 10) : null;
  const urlTab = searchParams.get("tab") as TabType | null;
  
  // URL에서 받은 탭으로 초기 activeTab 설정
  useEffect(() => {
    if (urlTab === "news" || urlTab === "terms") {
      setActiveTab(urlTab);
    }
  }, [urlTab]);
  
  useEffect(() => {
    if (urlFolderId && !isNaN(urlFolderId)) {
      console.log("검색 페이지 초기화 - URL에서 받은 폴더 ID:", urlFolderId);
      setSelectedFolderId(urlFolderId);
    }
  }, [urlFolderId]);

  // 카테고리 순서 조회
  useEffect(() => {
    const fetchCategoryOrder = async () => {
      try {
        const response = await getCategoryOrder();
        const items = response.data.categories;

        const sortedCategories: Category[] = [
          { category_id: null, name: "종합" },
          ...items.map((item) => ({
            category_id: item.categoryId,
            name: item.nameKo,
          })),
        ];

        setCategories(sortedCategories);

        const mapping = new Map<string, string>();
        items.forEach((item) => {
          mapping.set(item.code, item.nameKo);
        });
        setCategoryMapping(mapping);
      } catch (err) {
        console.warn("카테고리 순서 API 호출 실패, 기본 카테고리 사용:", err);
        setCategories(DEFAULT_CATEGORIES);
        const defaultMapping = new Map<string, string>([
          ["FINANCE", "금융"],
          ["STOCK", "증권"],
          ["INDUSTRY", "산업/재계"],
          ["REAL_ESTATE", "부동산"],
          ["VENTURE", "중기/벤처"],
          ["GLOBAL", "글로벌 경제"],
          ["GENERAL", "경제 일반"],
          ["LIVING", "생활 경제"],
        ]);
        setCategoryMapping(defaultMapping);
      }
    };

    fetchCategoryOrder();
  }, []);

  // 폴더 목록 조회
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const folderType = activeTab === "news" ? "NEWS" : "TERM";
        const response = await getStorageFolders(folderType);
        const folderList: Category[] = response.data.map((folder) => ({
          category_id: folder.folderId,
          name: folder.folderName,
        }));
        
        // URL에서 받은 폴더 ID가 있으면 우선 사용
        const currentSelectedId = urlFolderId && !isNaN(urlFolderId) ? urlFolderId : selectedFolderId;
        
        // "기본" 폴더 찾아서 기본값으로 설정
        const defaultFolder = folderList.find((folder) => folder.name === "기본");
        if (defaultFolder && defaultFolder.category_id !== null) {
          // "기본" 폴더가 있을 때만 defaultFolderId 설정
          setDefaultFolderId(defaultFolder.category_id);
          // URL에서 받은 폴더 ID가 없고, 현재 선택된 폴더도 없을 때만 기본 폴더로 설정
          if (!currentSelectedId) {
            setSelectedFolderId(defaultFolder.category_id);
          }
          // "기본" 폴더를 제외한 나머지 폴더만 표시
          const otherFolders = folderList.filter((folder) => folder.name !== "기본");
          setFolders(otherFolders);
        } else {
          // "기본" 폴더가 없으면 defaultFolderId를 null로 설정
          setDefaultFolderId(null);
          // URL에서 받은 폴더 ID가 없고, 현재 선택된 폴더도 없을 때만 첫 번째 폴더로 설정
          if (folderList.length > 0 && folderList[0].category_id !== null) {
            if (!currentSelectedId) {
              setSelectedFolderId(folderList[0].category_id);
            }
            setFolders(folderList);
          } else {
            setFolders([]);
          }
        }
      } catch (err) {
        console.warn("폴더 목록 조회 실패:", err);
        setFolders([]);
      }
    };

    fetchFolders();
  }, [activeTab, urlFolderId, selectedFolderId]);

  // 검색 실행
  const handleSearch = async () => {
    if (!keyword.trim()) return;
    
    // folderId가 필수이므로 선택된 폴더가 없으면 검색하지 않음
    // URL에서 받은 폴더 ID > selectedFolderId > defaultFolderId 순서로 우선순위
    const folderIdToSearch = (urlFolderId && !isNaN(urlFolderId)) 
      ? urlFolderId 
      : (selectedFolderId ?? defaultFolderId);
    if (!folderIdToSearch) {
      console.warn("폴더가 선택되지 않았습니다. 폴더 목록을 기다리는 중...");
      // 폴더 목록이 아직 로드되지 않았을 수 있으므로 잠시 대기 후 재시도
      setTimeout(() => {
        const retryFolderId = (urlFolderId && !isNaN(urlFolderId)) 
          ? urlFolderId 
          : (selectedFolderId ?? defaultFolderId);
        if (retryFolderId) {
          handleSearch();
        }
      }, 500);
      return;
    }

    const searchParams = {
      folderId: folderIdToSearch,
      q: keyword.trim(),
      page: 1,
      size: activeTab === "news" ? 12 : 10,
    };

    try {
      setLoading(true);
      setSearched(true);
      setCurrentPage(1);

      if (activeTab === "news") {
        console.log("보관함 뉴스 검색 요청:", {
          url: `/api/storage/news/search`,
          params: searchParams,
        });

        const response = await searchStorageNews(searchParams);

        console.log("보관함 뉴스 검색 응답:", {
          newsCount: response.data.news.length,
          totalPages: response.data.totalPages,
        });

        setNewsList(response.data.news);
        setTotalPages(response.data.totalPages);
        setTermsList([]);
      } else {
        console.log("보관함 용어 검색 요청:", {
          url: `/api/storage/terms/search`,
          params: searchParams,
        });

        const response = await searchStorageTerms(searchParams);

        console.log("보관함 용어 검색 응답:", {
          termsCount: response.data.terms.length,
          totalPages: response.data.totalPages,
        });

        setTermsList(response.data.terms);
        setTotalPages(response.data.totalPages);
        setNewsList([]);
      }
    } catch (err) {
      console.error("검색 실패:", err);
      if (activeTab === "news") {
        setNewsList([]);
      } else {
        setTermsList([]);
      }
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경
  const handlePageChange = async (page: number) => {
    if (!keyword.trim() || page < 1 || page > totalPages) return;
    
    // URL에서 받은 폴더 ID > selectedFolderId > defaultFolderId 순서로 우선순위
    const folderIdToSearch = (urlFolderId && !isNaN(urlFolderId)) 
      ? urlFolderId 
      : (selectedFolderId ?? defaultFolderId);
    if (!folderIdToSearch) {
      return;
    }

    const searchParams = {
      folderId: folderIdToSearch,
      q: keyword.trim(),
      page,
      size: activeTab === "news" ? 12 : 10,
    };

    try {
      setLoading(true);

      if (activeTab === "news") {
        const response = await searchStorageNews(searchParams);
        setNewsList(response.data.news);
        setTotalPages(response.data.totalPages);
      } else {
        const response = await searchStorageTerms(searchParams);
        setTermsList(response.data.terms);
        setTotalPages(response.data.totalPages);
      }

      setCurrentPage(page);

      // 페이지 상단으로 스크롤
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("페이지 변경 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // 폴더 변경 시 재검색
  useEffect(() => {
    if (searched && keyword.trim()) {
      // URL에서 받은 폴더 ID > selectedFolderId > defaultFolderId 순서로 우선순위
      const folderIdToSearch = (urlFolderId && !isNaN(urlFolderId)) 
        ? urlFolderId 
        : (selectedFolderId ?? defaultFolderId);
      if (!folderIdToSearch) {
        return;
      }

      const searchParams = {
        folderId: folderIdToSearch,
        q: keyword.trim(),
        page: 1,
        size: activeTab === "news" ? 12 : 10,
      };

      const performSearch = async () => {
        try {
          setLoading(true);
          setCurrentPage(1);

          if (activeTab === "news") {
            const response = await searchStorageNews(searchParams);
            setNewsList(response.data.news);
            setTotalPages(response.data.totalPages);
            setTermsList([]);
          } else {
            const response = await searchStorageTerms(searchParams);
            setTermsList(response.data.terms);
            setTotalPages(response.data.totalPages);
            setNewsList([]);
          }
        } catch (err) {
          console.error("검색 실패:", err);
          if (activeTab === "news") {
            setNewsList([]);
          } else {
            setTermsList([]);
          }
          setTotalPages(1);
        } finally {
          setLoading(false);
        }
      };

      performSearch();
    }
  }, [selectedFolderId, activeTab, keyword, searched, defaultFolderId, urlFolderId]);

  const handleFolderChange = (folderId: number | null) => {
    console.log("폴더 변경:", { folderId, selectedFolderId, defaultFolderId });
    setSelectedFolderId(folderId);
  };

  // 카테고리 이름 가져오기
  const getCategoryName = (category: string): string => {
    return categoryMapping.get(category) || category;
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

      {/* 탭 (뉴스/용어) - 검색 결과가 있을 때만 표시 */}
      {searched && (newsList.length > 0 || termsList.length > 0) && (
        <div className="flex border-b border-bg-50 px-5">
          <button
            onClick={() => setActiveTab("news")}
            className={`flex-1 py-3 text-center text-b2 ${
              activeTab === "news"
                ? "text-bg-10 border-b-2 border-bg-10"
                : "text-gray-40"
            }`}
          >
            뉴스
          </button>
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex-1 py-3 text-center text-b2 ${
              activeTab === "terms"
                ? "text-bg-10 border-b-2 border-bg-10"
                : "text-gray-40"
            }`}
          >
            용어
          </button>
        </div>
      )}

      {/* 카테고리 바 및 정렬 */}
      {searched && (newsList.length > 0 || termsList.length > 0) && (
        <>
          {/* 보관함 카테고리바 */}
          <CategoryBar
            categories={defaultFolderId ? [{ category_id: defaultFolderId, name: "기본" }, ...folders] : folders}
            selectedCategoryId={selectedFolderId}
            onCategoryChange={handleFolderChange}
          />

          {/* 보관함 정렬소트 */}
          <ArchiveSortDropdown 
            value={selectedCategoryId} 
            onChange={setSelectedCategoryId}
            categories={categories}
          />
        </>
      )}

      {/* 결과 영역 */}
      <div className="flex-1 min-h-0 flex flex-col">
        {!searched && (
          <div className="flex flex-1 items-center justify-center">
            <SearchEmptyView />
          </div>
        )}

        {loading && newsList.length === 0 && termsList.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-gray-400">검색 중...</p>
          </div>
        )}

        {searched && !loading && newsList.length === 0 && termsList.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <SearchNoResult />
          </div>
        )}

        {searched && activeTab === "news" && newsList.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="grid grid-cols-2 gap-4">
                {newsList.map((news) => (
                  <ArchiveNewsCard
                    key={news.savedItemId}
                    newsId={news.newsId}
                    title={news.title}
                    thumbnailUrl={news.thumbnailUrl}
                    category={getCategoryName(news.category)}
                    href={`/study/${news.newsId}`}
                  />
                ))}
              </div>
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

        {searched && activeTab === "terms" && termsList.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex flex-col gap-4">
                {termsList.map((term) => (
                  <div
                    key={term.savedItemId}
                    className="w-full bg-bg-80 rounded-lg p-5 flex flex-col gap-4"
                  >
                    {/* 용어 제목과 메뉴 */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sh5 text-gray-10 flex-1 break-words">
                        {term.term}
                      </h3>
                      <button
                        className="flex flex-col gap-[2px] p-1 flex-shrink-0"
                        aria-label="메뉴"
                      >
                        <div className="w-[3px] h-[3px] bg-bg-30 rounded-full" />
                        <div className="w-[3px] h-[3px] bg-bg-30 rounded-full" />
                        <div className="w-[3px] h-[3px] bg-bg-30 rounded-full" />
                      </button>
                    </div>

                    {/* 용어 설명 */}
                    <p className="text-b3 text-gray-20 leading-relaxed break-words">
                      {term.description}
                    </p>

                    {/* 이 용어가 들어간 뉴스 검색 버튼 */}
                    <button
                      onClick={() => {
                        router.push(`/study/search?q=${encodeURIComponent(term.term)}`);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-[10px] py-[8px] text-b2 text-gray-30 rounded-[8px] bg-bg-70"
                    >
                      <Image
                        src="/study/img-insight.png"
                        alt="검색"
                        width={16}
                        height={16}
                      />
                      <span>이 용어가 들어간 뉴스 검색</span>
                    </button>
                  </div>
                ))}
              </div>
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
