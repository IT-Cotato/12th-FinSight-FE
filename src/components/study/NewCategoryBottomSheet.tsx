"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { getStorageFolders, createStorageFolder, getStorageFoldersByItemId, getStorageNews, deleteNewsFromStorage, saveNewsToStorage, getStorageTerms, deleteTermFromStorage, saveTermToStorage, type StorageFolder } from "@/lib/api/storage";

type Category = {
  category_id: number;
  name: string;
  count?: number;
};

type NewCategoryBottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSelectCategory?: (categoryId: number | null) => void; // 선택적: 내부에서 처리할 수도 있음
  onAddNewCategory: () => void;
  itemId?: number; // 뉴스 ID 또는 단어 ID
  folderType?: "NEWS" | "TERM"; // 폴더 타입
  title?: string; // 바텀시트 제목
  subtitle?: string; // 바텀시트 부제목
  onToggleComplete?: () => void; // 저장/삭제 완료 후 콜백
};

// 새 카테고리 생성 폼 컴포넌트
type NewCategoryFormProps = {
  categoryName: string;
  onCategoryNameChange: (name: string) => void;
  onBack: () => void;
  onSave: () => void;
};

function NewCategoryForm({
  categoryName,
  onCategoryNameChange,
  onBack,
  onSave,
}: NewCategoryFormProps) {
  return (
    <div className="flex flex-col min-h-[50vh] gap-[22px]">
      {/* 드래그 핸들 */}
      <div className="flex justify-center pt-5">
        <div className="w-20 h-[4.5px] bg-bg-40 rounded-full" />
      </div>

      {/* 헤더 */}
      <div className="px-5 flex flex-col gap-[10px]">
        <button
          onClick={onBack}
          aria-label="뒤로가기"
          className="flex items-center justify-center w-6 h-6"
          type="button"
        >
          <svg
            width="10"
            height="17"
            viewBox="0 0 10 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-bg-20"
          >
            <path
              d="M7.83582 1.25L1.54292 7.54289C1.1524 7.93342 1.1524 8.56658 1.54292 8.95711L7.83582 15.25"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <SheetTitle className="text-sh2 text-gray-10">새 카테고리</SheetTitle>
      </div>

      {/* 입력 필드 */}
      <div className="px-5">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => onCategoryNameChange(e.target.value)}
          placeholder="이름을 입력해주세요."
          className="w-full h-[60px] pl-[25px] pr-4 py-[18px] bg-bg-70 rounded-[8px] text-b1 text-gray-20 placeholder:text-gray-50 placeholder:text-b2 focus:outline-none focus:ring-0"
          autoFocus
          maxLength={20}
        />
      </div>

      {/* 저장 버튼 */}
      <div className="mt-auto px-5 pb-9 flex justify-end">
        <button
          onClick={onSave}
          disabled={!categoryName.trim()}
          className="w-[150px] px-2.5 py-2 bg-primary-50 rounded-[8px] text-b2 text-gray-10 disabled:bg-primary-20 disabled:cursor-not-allowed transition-colors"        
        >
          만들기
        </button>
      </div>
    </div>
  );
}

// 카테고리 선택 리스트 컴포넌트
type CategorySelectListProps = {
  categories: Category[];
  onSelectCategory: (categoryId: number | null) => void;
  onAddNewCategory: () => void;
  loading?: boolean;
  savedFolderIds?: number[]; // 저장된 폴더 ID 목록
  title?: string; // 바텀시트 제목
  subtitle?: string; // 바텀시트 부제목
};

function CategorySelectList({
  categories,
  onSelectCategory,
  onAddNewCategory,
  loading = false,
  savedFolderIds = [],
  title = "카테고리 선택",
  subtitle = "보관함에 저장할",
}: CategorySelectListProps) {
  return (
    <div className="flex flex-col">
      {/* 드래그 핸들 */}
      <div className="flex justify-center pt-5 pb-[30px]">
        <div className="w-20 h-[4.5px] bg-bg-40 rounded-full" />
      </div>

      {/* 헤더 */}
      <div className="px-5 pb-4">
        {subtitle && subtitle.trim() !== "" && (
          <p className="text-sh5 text-gray-40 mb-1">{subtitle}</p>
        )}
        <SheetTitle className="text-sh2 text-gray-10">{title}</SheetTitle>
      </div>

      {/* 카테고리 리스트 */}
      <div className="px-5 flex flex-col items-start gap-[5px]">
        {loading ? (
          <div className="flex items-center justify-center py-8 w-full">
            <p className="text-b2 text-gray-40">로딩 중...</p>
          </div>
        ) : (
          <>
            {categories.map((category) => {
              const isSaved = savedFolderIds.includes(category.category_id);
              return (
                <div key={category.category_id} className="w-full border-bg-50 border-b-[0.8px]">
                  <button
                    onClick={() => onSelectCategory(category.category_id)}
                    className="w-full flex items-center gap-3 px-0 py-[14px] text-left"
                  >
                    <svg
                      width="14"
                      height="19"
                      viewBox="0 0 14 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={isSaved ? "text-primary-30" : "text-bg-20"}
                    >
                      <path
                        d="M13 16.5V2C13 1.44772 12.5523 1 12 1H2C1.44772 1 1 1.44772 1 2V16.5C1 17.4027 2.10158 17.8433 2.72414 17.1897L6.27586 13.4603C6.66995 13.0466 7.33005 13.0466 7.72414 13.4603L11.2759 17.1897C11.8984 17.8433 13 17.4027 13 16.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill={isSaved ? "currentColor" : "none"}
                      />
                    </svg>
                    <span className="text-b2 text-bg-20">
                      {category.name} ({category.count || 0})
                    </span>
                  </button>
                </div>
              );
            })}

            {/* 새 카테고리 추가 */}
            <button
              onClick={onAddNewCategory}
              className="w-full flex items-center gap-3 py-[14px] text-left"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary-30"
              >
                <path
                  d="M8.75 1.25L8.75 16.25"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M16.25 8.75L1.25 8.75"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center text-b2 text-primary-30">새 카테고리 추가</div>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function NewCategoryBottomSheet({
  open,
  onOpenChange,
  categories,
  onSelectCategory,
  onAddNewCategory,
  itemId,
  folderType = "NEWS",
  title,
  subtitle,
  onToggleComplete,
}: NewCategoryBottomSheetProps) {
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [folders, setFolders] = useState<Category[]>([]);
  const [optimisticFolders, setOptimisticFolders] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedFolderIds, setSavedFolderIds] = useState<number[]>([]);

  // displayCategories: optimisticFolders가 있으면 사용, 없으면 folders가 있으면 folders 사용, 없으면 categories prop 사용
  const displayCategories = useMemo(() => {
    if (optimisticFolders) return optimisticFolders;
    return folders.length > 0 ? folders : categories;
  }, [optimisticFolders, folders, categories]);

  // 폴더 목록 조회 함수 (로딩 상태 포함)
  const fetchFolders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getStorageFolders(folderType);
      const folderList: Category[] = response.data.map((folder: StorageFolder) => ({
        category_id: folder.folderId,
        name: folder.folderName,
        count: folder.itemCount,
      }));
      setFolders(folderList);
      return response;
    } catch (err) {
      console.warn("폴더 목록 조회 실패:", err);
      setFolders([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [folderType]);

  // 폴더 목록 조회 함수 (백그라운드 동기화용, 로딩 상태 없음)
  const syncFolders = useCallback(async () => {
    try {
      const response = await getStorageFolders(folderType);
      const folderList: Category[] = response.data.map((folder: StorageFolder) => ({
        category_id: folder.folderId,
        name: folder.folderName,
        count: folder.itemCount,
      }));
      setFolders(folderList);
      return response;
    } catch (err) {
      console.warn("폴더 목록 동기화 실패:", err);
      throw err;
    }
  }, [folderType]);

  // 저장된 폴더 목록 조회 함수
  const fetchSavedFolders = useCallback(async () => {
    if (!itemId) {
      setSavedFolderIds([]);
      return;
    }

    try {
      const response = await getStorageFoldersByItemId(itemId, folderType);
      const savedIds = response.data.map((folder: StorageFolder) => folder.folderId);
      setSavedFolderIds(savedIds);
    } catch (err) {
      console.warn("저장된 폴더 목록 조회 실패:", err);
      setSavedFolderIds([]);
    }
  }, [itemId, folderType]);

  // 바텀시트가 열릴 때 폴더 목록 및 저장된 폴더 목록 조회
  useEffect(() => {
    if (open) {
      fetchFolders();
      fetchSavedFolders();
    }
  }, [open, fetchFolders, fetchSavedFolders]);

  // 바텀시트가 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setIsCreatingNewCategory(false);
      setNewCategoryName("");
    }
  }, [open]);

  // 폴더에서 아이템 삭제 (savedItemId 찾기)
  const findSavedItemId = useCallback(async (folderId: number): Promise<number | null> => {
    if (!itemId) return null;

    try {
      if (folderType === "NEWS") {
        // 뉴스의 경우: 폴더의 뉴스 목록에서 해당 newsId 찾기
        const response = await getStorageNews({ folderId, size: 1000 });
        const savedItem = response.data.news.find((item) => item.newsId === itemId);
        return savedItem?.savedItemId || null;
      } else {
        // 용어의 경우: 폴더의 용어 목록에서 해당 termId 찾기
        const response = await getStorageTerms({ folderId, size: 1000 });
        const savedItem = response.data.terms.find((item) => item.termId === itemId);
        return savedItem?.savedItemId || null;
      }
    } catch (err) {
      console.error("savedItemId 조회 실패:", err);
      return null;
    }
  }, [itemId, folderType]);

  const handleCategorySelect = async (categoryId: number | null) => {
    if (!itemId || categoryId === null) {
      if (onSelectCategory) {
        onSelectCategory(categoryId);
      }
      onOpenChange(false);
      return;
    }

    const isSaved = savedFolderIds.includes(categoryId);

    // Optimistic update: 로컬 상태 먼저 업데이트
    const prevSavedFolderIds = [...savedFolderIds];
    const currentDisplayCategories = displayCategories;
    const prevDisplayCategories = [...currentDisplayCategories];

    if (isSaved) {
      // UI 먼저 업데이트 (삭제)
      setSavedFolderIds((prev) => prev.filter((id) => id !== categoryId));
      setOptimisticFolders(
        currentDisplayCategories.map((category) =>
          category.category_id === categoryId
            ? { ...category, count: Math.max(0, (category.count || 0) - 1) }
            : category
        )
      );
    } else {
      // UI 먼저 업데이트 (저장)
      setSavedFolderIds((prev) => [...prev, categoryId]);
      setOptimisticFolders(
        currentDisplayCategories.map((category) =>
          category.category_id === categoryId
            ? { ...category, count: (category.count || 0) + 1 }
            : category
        )
      );
    }

    try {
      if (isSaved) {
        // 이미 저장된 폴더면 삭제
        const savedItemId = await findSavedItemId(categoryId);
        if (savedItemId) {
          if (folderType === "NEWS") {
            await deleteNewsFromStorage(savedItemId);
          } else {
            await deleteTermFromStorage(savedItemId);
          }
        }
      } else {
        // 저장되지 않은 폴더면 저장
        if (folderType === "NEWS") {
          await saveNewsToStorage(itemId, [categoryId]);
        } else {
          await saveTermToStorage(itemId, [categoryId]);
        }
      }

      // 백그라운드에서 동기화 (에러가 나도 UI는 이미 업데이트됨, 로딩 상태 없이 조용히 업데이트)
      Promise.all([
        fetchSavedFolders(),
        syncFolders(),
      ]).then(() => {
        // 동기화 완료 후 optimistic 상태 초기화
        setOptimisticFolders(null);
      }).catch((err) => {
        console.error("동기화 실패:", err);
        // 에러 발생 시 이전 상태로 롤백
        setSavedFolderIds(prevSavedFolderIds);
        setOptimisticFolders(prevDisplayCategories);
      });

      // 기존 onSelectCategory 콜백 호출 (호환성 유지)
      if (onSelectCategory) {
        onSelectCategory(categoryId);
      }

      // 완료 콜백 호출
      if (onToggleComplete) {
        onToggleComplete();
      }

      // 바텀시트는 닫지 않음 (여러 폴더 선택 가능하도록)
    } catch (err) {
      console.error("폴더 저장/삭제 실패:", err);
      // 에러 발생 시 이전 상태로 롤백
      setSavedFolderIds(prevSavedFolderIds);
      setOptimisticFolders(prevDisplayCategories);
    }
  };

  const handleAddNewCategoryClick = () => {
    setIsCreatingNewCategory(true);
  };

  const handleBackClick = () => {
    setIsCreatingNewCategory(false);
    setNewCategoryName("");
  };

  const handleSaveNewCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        // 폴더 생성 API 호출
        await createStorageFolder(folderType, newCategoryName.trim());
        // 폴더 목록 다시 조회
        await fetchFolders();
        setIsCreatingNewCategory(false);
        setNewCategoryName("");
        onAddNewCategory();
      } catch (err) {
        console.error("폴더 생성 실패:", err);
        // 에러 발생 시에도 폼은 닫지 않고 사용자에게 알림할 수 있도록 함
        // 필요시 에러 메시지 표시 로직 추가 가능
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="w-full max-w-[420px] left-auto right-auto min-h-[50vh] max-h-[80vh] overflow-y-auto p-0 rounded-t-[20px] border-bg-80 scrollbar-hide"
      >
        {isCreatingNewCategory ? (
          <NewCategoryForm
            categoryName={newCategoryName}
            onCategoryNameChange={setNewCategoryName}
            onBack={handleBackClick}
            onSave={handleSaveNewCategory}
          />
        ) : (
          <CategorySelectList
            categories={displayCategories.length > 0 ? displayCategories : folders.length > 0 ? folders : categories}
            onSelectCategory={handleCategorySelect}
            onAddNewCategory={handleAddNewCategoryClick}
            loading={loading}
            savedFolderIds={savedFolderIds}
            title={title}
            subtitle={subtitle}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
