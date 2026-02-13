"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/common/Header";
import { CategoryBar } from "@/components/study/CategoryBar";
import { ArchiveNewsCard } from "@/components/archive/ArchiveNewsCard";
import { ArchiveSortDropdown } from "@/components/archive/ArchiveSortDropdown";
import { getCategoryOrder } from "@/lib/api/user";
import { getStorageFolders, searchStorageNews, type StorageNewsSearchItem } from "@/lib/api/storage";

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

// 보관함 검색 페이지
export default function ArchiveSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [searched, setSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("news");
  const [newsList, setNewsList] = useState<StorageNewsSearchItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [defaultFolderId, setDefaultFolderId] = useState<number | null>(null);
  const [folders, setFolders] = useState<Category[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [categoryMapping, setCategoryMapping] = useState<Map<string, string>>(new Map());
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // URL 쿼리 파라미터에서 폴더 ID 읽기 (최우선)
  const urlFolderId = searchParams.get("folderId") ? parseInt(searchParams.get("folderId")!, 10) : null;
  
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
    
    if (activeTab !== "news") {
      return;
    }

    const searchParams = {
      folderId: folderIdToSearch,
      q: keyword.trim(),
      page: 1,
      size: 12,
    };

    console.log("보관함 검색 요청:", {
      url: `/api/storage/news/search`,
      params: searchParams,
      selectedFolderId,
      defaultFolderId,
      folderIdToSearch,
      "사용된 폴더 ID": folderIdToSearch,
      "선택된 폴더": selectedFolderId ? "사용자 선택" : (defaultFolderId ? "기본 폴더" : "없음"),
    });

    try {
      setLoading(true);
      setSearched(true);
      setCurrentPage(1);

      const response = await searchStorageNews(searchParams);

      console.log("보관함 검색 응답:", {
        newsCount: response.data.news.length,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalElements: response.data.totalElements,
        hasNext: response.data.hasNext,
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
  };

  // 페이지 변경
  const handlePageChange = async (page: number) => {
    if (!keyword.trim() || page < 1 || page > totalPages) return;
    
    // URL에서 받은 폴더 ID > selectedFolderId > defaultFolderId 순서로 우선순위
    const folderIdToSearch = (urlFolderId && !isNaN(urlFolderId)) 
      ? urlFolderId 
      : (selectedFolderId ?? defaultFolderId);
    if (!folderIdToSearch || activeTab !== "news") {
      return;
    }

    const searchParams = {
      folderId: folderIdToSearch,
      q: keyword.trim(),
      page,
      size: 12,
    };

    console.log("보관함 검색 페이지 변경 요청:", {
      url: `/api/storage/news/search`,
      params: searchParams,
    });

    try {
      setLoading(true);

      const response = await searchStorageNews(searchParams);

      console.log("보관함 검색 페이지 변경 응답:", {
        newsCount: response.data.news.length,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
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

  // 폴더 변경 시 재검색
  useEffect(() => {
    if (searched && keyword.trim() && activeTab === "news") {
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
        size: 12,
      };

      console.log("보관함 검색 요청 (폴더 변경):", {
        url: `/api/storage/news/search`,
        params: searchParams,
        urlFolderId,
        selectedFolderId,
        defaultFolderId,
        folderIdToSearch,
        "사용된 폴더 ID": folderIdToSearch,
        "선택된 폴더": urlFolderId ? "URL에서 받음" : (selectedFolderId ? "사용자 선택" : (defaultFolderId ? "기본 폴더" : "없음")),
      });

      const performSearch = async () => {
        try {
          setLoading(true);
          setCurrentPage(1);

          const response = await searchStorageNews(searchParams);

          console.log("보관함 검색 응답 (폴더 변경):", {
            newsCount: response.data.news.length,
            totalPages: response.data.totalPages,
            currentPage: response.data.currentPage,
            totalElements: response.data.totalElements,
            hasNext: response.data.hasNext,
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
      };

      performSearch();
    }
  }, [selectedFolderId, activeTab, keyword, searched, defaultFolderId]);

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
      {searched && newsList.length > 0 && (
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
      {searched && newsList.length > 0 && (
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
      </div>
    </div>
  );
}
