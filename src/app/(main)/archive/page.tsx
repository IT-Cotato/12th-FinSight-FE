"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { CategoryBar } from "@/components/study/CategoryBar";
import { ArchiveSortDropdown } from "@/components/archive/ArchiveSortDropdown";
import { getCategoryOrder, type CategoryOrderItem } from "@/lib/api/user";
import { getStorageFolders, getStorageNews, deleteNewsFromStorage, saveNewsToStorage, deleteStorageFolder, updateStorageFolder, updateStorageFolderOrder, type StorageFolder, type StorageNewsItem } from "@/lib/api/storage";
import { ArchiveNewsCard } from "@/components/archive/ArchiveNewsCard";
import { ArchiveNewsMenuBottomSheet } from "@/components/archive/ArchiveNewsMenuBottomSheet";
import { DeleteConfirmDialog } from "@/components/archive/DeleteConfirmDialog";
import { ArchiveCategoryEditBottomSheet } from "@/components/archive/ArchiveCategoryEditBottomSheet";
import { NewCategoryBottomSheet } from "@/components/study/NewCategoryBottomSheet";

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
  const [newsList, setNewsList] = useState<StorageNewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryMapping, setCategoryMapping] = useState<Map<string, string>>(new Map());
  const [isMenuBottomSheetOpen, setIsMenuBottomSheetOpen] = useState(false);
  const [isEditBottomSheetOpen, setIsEditBottomSheetOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isCategoryEditBottomSheetOpen, setIsCategoryEditBottomSheetOpen] = useState(false);
  const [selectedSavedItemId, setSelectedSavedItemId] = useState<number | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);

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

        // 카테고리 코드(영어) -> 한국어 매핑 생성
        const mapping = new Map<string, string>();
        items.forEach((item) => {
          mapping.set(item.code, item.nameKo);
        });
        setCategoryMapping(mapping);
      } catch (err) {
        console.warn("카테고리 순서 API 호출 실패, 기본 카테고리 사용:", err);
        setCategories(DEFAULT_CATEGORIES);
        // 기본 매핑 설정
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

  // 폴더 선택 시 해당 폴더의 뉴스 조회
  const fetchStorageNews = useCallback(async (folderId: number | null, page: number = 1) => {
    if (!folderId || activeTab !== "news") {
      setNewsList([]);
      return;
    }

    try {
      setLoadingNews(true);
      const response = await getStorageNews({
        folderId,
        page,
        size: 4,
      });
      
      setNewsList(response.data.news);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      console.error("보관함 뉴스 조회 실패:", err);
      setNewsList([]);
    } finally {
      setLoadingNews(false);
    }
  }, [activeTab]);

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
        
        // "기본" 폴더 찾아서 선택
        const defaultFolder = folderList.find((folder) => folder.name === "기본");
        if (defaultFolder && defaultFolder.category_id !== null) {
          setSelectedCategoryId(defaultFolder.category_id);
          // 뉴스 탭이고 기본 폴더가 있으면 해당 폴더의 뉴스 조회
          if (activeTab === "news") {
            fetchStorageNews(defaultFolder.category_id, 1);
          }
        } else {
          setSelectedCategoryId(null);
        }
      } catch (err) {
        console.warn("폴더 목록 조회 실패:", err);
        setFolders([]);
        setSelectedCategoryId(null);
      } finally {
        setLoadingFolders(false);
      }
    };

    fetchFolders();
  }, [activeTab, fetchStorageNews]);

  const handleSearchClick = () => {
    // 선택한 폴더 ID를 쿼리 파라미터로 전달
    const folderId = selectedCategoryId;
    console.log("검색 페이지로 이동 - 선택한 폴더 ID:", folderId);
    if (folderId !== null) {
      router.push(`/archive/search?folderId=${folderId}`);
    } else {
      router.push("/archive/search");
    }
  };

  const handleCategoryChange = (categoryId: number | null) => {
    console.log("카테고리바에서 폴더 선택:", { categoryId, folderName: folders.find(f => f.category_id === categoryId)?.name });
    setSelectedCategoryId(categoryId);
    setCurrentPage(1); // 폴더 변경 시 페이지 초기화
    if (activeTab === "news" && categoryId !== null) {
      fetchStorageNews(categoryId, 1);
    } else {
      setNewsList([]);
    }
  };

  const handleFilterClick = () => {
    setIsCategoryEditBottomSheetOpen(true);
  };

  const handleAddNewCategoryFromEdit = async () => {
    // 새 카테고리 생성 후 폴더 목록 다시 조회
    const folderType = activeTab === "news" ? "NEWS" : "TERM";
    try {
      const response = await getStorageFolders(folderType);
      const folderList: Category[] = response.data.map((folder: StorageFolder) => ({
        category_id: folder.folderId,
        name: folder.folderName,
      }));
      setFolders(folderList);
    } catch (err) {
      console.warn("폴더 목록 조회 실패:", err);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      // 폴더 삭제 API 호출
      await deleteStorageFolder(categoryId);
      
      // 삭제 후 폴더 목록 다시 조회
      const folderType = activeTab === "news" ? "NEWS" : "TERM";
      const response = await getStorageFolders(folderType);
      const folderList: Category[] = response.data.map((folder: StorageFolder) => ({
        category_id: folder.folderId,
        name: folder.folderName,
      }));
      setFolders(folderList);
      
      // 삭제된 폴더가 현재 선택된 폴더인 경우 선택 해제
      if (selectedCategoryId === categoryId) {
        setSelectedCategoryId(null);
        setNewsList([]);
      }
    } catch (err) {
      console.error("폴더 삭제 실패:", err);
    }
  };

  const handleEditCategoryName = async (categoryId: number, newName: string) => {
    try {
      // 폴더 이름 수정 API 호출
      await updateStorageFolder(categoryId, newName);
      
      // 수정 후 폴더 목록 다시 조회
      const folderType = activeTab === "news" ? "NEWS" : "TERM";
      const response = await getStorageFolders(folderType);
      const folderList: Category[] = response.data.map((folder: StorageFolder) => ({
        category_id: folder.folderId,
        name: folder.folderName,
      }));
      setFolders(folderList);
    } catch (err) {
      console.error("폴더 이름 수정 실패:", err);
    }
  };

  const handleSaveCategoryOrder = async (categories: Category[]) => {
    const folderType = activeTab === "news" ? "NEWS" : "TERM";
    
    try {
      // "기본" 폴더를 제외한 카테고리만 folders 배열로 변환
      const folders = categories
        .filter((cat): cat is Category & { category_id: number } => cat.category_id !== null)
        .map((cat, index) => ({
          folderId: cat.category_id,
          sortOrder: index + 1, // 1부터 시작하는 순서
        }));

      // 폴더 순서 저장 API 호출
      const response = await updateStorageFolderOrder(folderType, folders);

      // 응답으로 받은 폴더 목록으로 업데이트
      const folderList: Category[] = response.data.map((folder: StorageFolder) => ({
        category_id: folder.folderId,
        name: folder.folderName,
      }));
      setFolders(folderList);
    } catch (err) {
      console.error("폴더 순서 저장 실패:", err);
    }
  };

  const handleSortCategoryChange = (categoryId: number | null) => {
    setSelectedSortCategory(categoryId);
  };

  const handleGoToNews = () => {
    router.push("/study");
  };

  const handleNewsMenuClick = (savedItemId: number, newsId: number) => {
    setSelectedSavedItemId(savedItemId);
    setSelectedNewsId(newsId);
    setIsMenuBottomSheetOpen(true);
  };

  const handleDeleteClick = () => {
    setIsMenuBottomSheetOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteFromCategory = async () => {
    if (!selectedSavedItemId) {
      return;
    }

    try {
      await deleteNewsFromStorage(selectedSavedItemId);
      // 삭제 후 뉴스 목록 다시 조회
      if (selectedCategoryId !== null) {
        await fetchStorageNews(selectedCategoryId, currentPage);
      }
    } catch (err) {
      console.error("카테고리에서 삭제 실패:", err);
    }
  };

  const handleEditCategory = () => {
    setIsEditBottomSheetOpen(true);
  };

  const handleSelectCategoryForEdit = async (categoryId: number | null) => {
    if (!selectedNewsId || categoryId === null) {
      return;
    }

    try {
      // 새 폴더에 추가
      await saveNewsToStorage(selectedNewsId, [categoryId]);
      // 뉴스 목록 다시 조회
      if (selectedCategoryId !== null) {
        await fetchStorageNews(selectedCategoryId, currentPage);
      }
    } catch (err) {
      console.error("카테고리 수정 실패:", err);
    }
  };

  const handleAddNewCategory = async () => {
    // 새 카테고리 추가 후 폴더 목록 다시 조회
    const folderType = activeTab === "news" ? "NEWS" : "TERM";
    try {
      const response = await getStorageFolders(folderType);
      const folderList: Category[] = response.data.map((folder: StorageFolder) => ({
        category_id: folder.folderId,
        name: folder.folderName,
      }));
      setFolders(folderList);
    } catch (err) {
      console.warn("폴더 목록 조회 실패:", err);
    }
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

      {/* 콘텐츠 영역 */}
      {activeTab === "news" && selectedCategoryId !== null && newsList.length > 0 ? (
        /* 뉴스 리스트 */
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            {newsList.map((news) => (
              <ArchiveNewsCard
                key={news.newsId}
                newsId={news.newsId}
                title={news.title}
                thumbnailUrl={news.thumbnailUrl}
                category={categoryMapping.get(news.category) || news.category}
                href={`/study/${news.newsId}`}
                onMenuClick={() => handleNewsMenuClick(news.savedItemId, news.newsId)}
              />
            ))}
          </div>
        </div>
      ) : (
        /* 엠티뷰 */
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
      )}

      {/* 카테고리 편집 바텀시트 */}
      <ArchiveCategoryEditBottomSheet
        open={isCategoryEditBottomSheetOpen}
        onOpenChange={setIsCategoryEditBottomSheetOpen}
        categories={folders}
        onAddNewCategory={handleAddNewCategoryFromEdit}
        onDeleteCategory={handleDeleteCategory}
        onEditCategory={handleEditCategoryName}
        onSave={handleSaveCategoryOrder}
        folderType={activeTab === "news" ? "NEWS" : "TERM"}
      />

      {/* 뉴스 메뉴 바텀시트 */}
      <ArchiveNewsMenuBottomSheet
        open={isMenuBottomSheetOpen}
        onOpenChange={setIsMenuBottomSheetOpen}
        onDelete={handleDeleteClick}
        onEdit={handleEditCategory}
      />

      {/* 삭제 확인 다이얼로그 */}
      <DeleteConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={handleDeleteFromCategory}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />

      {/* 카테고리 수정 바텀시트 */}
      <NewCategoryBottomSheet
        open={isEditBottomSheetOpen}
        onOpenChange={setIsEditBottomSheetOpen}
        categories={folders.filter((f): f is Category & { category_id: number } => f.category_id !== null).map(f => ({ category_id: f.category_id!, name: f.name }))}
        onSelectCategory={handleSelectCategoryForEdit}
        onAddNewCategory={handleAddNewCategory}
        itemId={selectedNewsId || undefined}
      />
    </div>
  );
}
