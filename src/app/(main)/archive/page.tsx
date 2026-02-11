"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { CategoryBar } from "@/components/study/CategoryBar";
import { ArchiveSortDropdown } from "@/components/archive/ArchiveSortDropdown";
import { getCategoryOrder, type CategoryOrderItem } from "@/lib/api/user";
import { getStorageFolders, type StorageFolder } from "@/lib/api/storage";

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

export default function ArchivePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("news");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSortCategory, setSelectedSortCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [folders, setFolders] = useState<Category[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(false);

  // 카테고리 순서 조회
  useEffect(() => {
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
      } catch (err) {
        console.warn("카테고리 순서 API 호출 실패, 기본 카테고리 사용:", err);
        setCategories(DEFAULT_CATEGORIES);
      }
    };

    fetchCategoryOrder();
  }, []);

  // 폴더 목록 조회 - 탭에 따라 다른 타입으로 조회
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoadingFolders(true);
        const folderType = activeTab === "news" ? "NEWS" : "TERM";
        const response = await getStorageFolders(folderType);
        
        // StorageFolder를 Category 형식으로 변환
        const folderList: Category[] = response.data.map((folder: StorageFolder) => ({
          category_id: folder.folderId,
          name: folder.folderName,
        }));
        
        setFolders(folderList);
      } catch (err) {
        console.warn("폴더 목록 조회 실패:", err);
        setFolders([]);
      } finally {
        setLoadingFolders(false);
      }
    };

    fetchFolders();
    // 탭 변경 시 선택된 폴더 초기화
    setSelectedCategoryId(null);
  }, [activeTab]);

  const handleSearchClick = () => {
    router.push("/study/search");
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };

  const handleFilterClick = () => {
    // 필터 기능 구현 (나중에 추가)
  };

  const handleSortCategoryChange = (categoryId: number | null) => {
    setSelectedSortCategory(categoryId);
  };

  const handleGoToNews = () => {
    router.push("/study");
  };

  return (
    <div className="flex flex-col bg-bg-100">
      {/* 헤더 */}
      <Header
        title="보관함"
        rightSlot={
          <button onClick={handleSearchClick} aria-label="검색">
            <Image
              src="/study/search.png"
              alt="검색"
              width={19}
              height={19}
            />
          </button>
        }
      />

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-bg-50 px-5">
        <button
          onClick={() => setActiveTab("news")}
          className={`flex-1 py-4 text-center text-b2 transition-colors relative ${
            activeTab === "news"
              ? "text-bg-10"
              : "text-bg-40"
          }`}
        >
          뉴스
          {activeTab === "news" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("terms")}
          className={`flex-1 py-4 text-center text-b2 transition-colors relative ${
            activeTab === "terms"
              ? "text-bg-10"
              : "text-bg-40"
          }`}
        >
          용어
          {activeTab === "terms" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />
          )}
        </button>
      </div>

      {/* 보관함 카테고리바 */}
      <CategoryBar
        categories={folders}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={handleCategoryChange}
        onEditClick={handleFilterClick}
      />

      {/* 보관함 정렬소트 */}
      <ArchiveSortDropdown 
        value={selectedSortCategory} 
        onChange={handleSortCategoryChange}
        categories={categories}
      />

      {/* 엠티뷰 */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-20">
        <div className="flex flex-col items-center gap-[5px]">
          {/* 문어 캐릭터 이미지 */}
          <div className="relative">
            <Image
              src="/study/img-sweat.svg"
              alt="빈 보관함"
              width={130}
              height={166}
              className="object-contain"
            />
          </div>

          {/* 메시지 */}
          <p className="text-b1 text-bg-30 text-center">
            {activeTab === "news" 
              ? "아직 저장한 뉴스가 없어요!" 
              : "아직 저장한 용어가 없어요!"}
          </p>

          {/* 뉴스 읽으러 가기 버튼 */}
          <button
            onClick={handleGoToNews}
            className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-[8px] bg-bg-70"
          >
            <Image
              src="/archive/book-icon.svg"
              alt="책 아이콘"
              width={24}
              height={18}
            />
            <span className="text-b4 text-bg-20">
              뉴스 읽으러 가기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
