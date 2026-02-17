"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { DeleteConfirmDialog } from "@/components/archive/DeleteConfirmDialog";
import { createStorageFolder } from "@/lib/api/storage";

type Category = {
  category_id: number | null;
  name: string;
};

type ArchiveCategoryEditBottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onAddNewCategory: () => void;
  onDeleteCategory?: (categoryId: number) => void;
  onEditCategory?: (categoryId: number, newName: string) => void;
  onSave?: (categories: Category[]) => void;
  folderType?: "NEWS" | "TERM";
};

export function ArchiveCategoryEditBottomSheet({
  open,
  onOpenChange,
  categories,
  onAddNewCategory,
  onDeleteCategory,
  onEditCategory,
  onSave,
  folderType = "NEWS",
}: ArchiveCategoryEditBottomSheetProps) {
  // "기본" 폴더를 제외한 편집 가능한 카테고리만 필터링
  const editableCategories = categories.filter((cat) => cat.category_id !== null);
  const [editedCategories, setEditedCategories] = useState<Category[]>(editableCategories);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // categories가 변경되면 editedCategories 업데이트
  useEffect(() => {
    const filtered = categories.filter((cat) => cat.category_id !== null);
    setEditedCategories(filtered);
  }, [categories]);

  // 바텀시트가 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setIsCreatingNewCategory(false);
      setNewCategoryName("");
      setEditingCategoryId(null);
      setEditingName("");
    }
  }, [open]);

  // 새 카테고리 추가 버튼 클릭
  const handleAddNewCategoryClick = () => {
    setIsCreatingNewCategory(true);
  };

  // 새 카테고리 생성 취소
  const handleBackFromNewCategory = () => {
    setIsCreatingNewCategory(false);
    setNewCategoryName("");
  };

  // 새 카테고리 생성 저장
  const handleSaveNewCategory = async () => {
    if (!newCategoryName.trim()) {
      return;
    }

    try {
      // 폴더 생성 API 호출
      const response = await createStorageFolder(folderType, newCategoryName.trim());
      
      // 생성된 폴더를 로컬 상태에 추가
      const newCategory: Category = {
        category_id: response.data.folderId,
        name: response.data.folderName,
      };
      setEditedCategories((prev) => [...prev, newCategory]);
      
      // 부모 컴포넌트에 알림
      onAddNewCategory();
      
      // 상태 초기화
      setIsCreatingNewCategory(false);
      setNewCategoryName("");
    } catch (err) {
      console.error("폴더 생성 실패:", err);
    }
  };

  // 초기화
  const handleReset = () => {
    const filtered = categories.filter((cat) => cat.category_id !== null);
    setEditedCategories(filtered);
  };

  // 저장
  const handleSave = () => {
    if (onSave) {
      const defaultFolder = categories.find((cat) => cat.name === "기본");
      const finalCategories = defaultFolder
        ? [defaultFolder, ...editedCategories]
        : editedCategories;
      onSave(finalCategories);
    }
    onOpenChange(false);
  };

  // 삭제 버튼 클릭
  const handleDeleteClick = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setIsDeleteConfirmOpen(true);
  };

  // 삭제 확인
  const handleDeleteConfirm = () => {
    if (categoryToDelete !== null) {
      if (onDeleteCategory) {
        onDeleteCategory(categoryToDelete);
      }
      setEditedCategories((prev) => prev.filter((cat) => cat.category_id !== categoryToDelete));
      setCategoryToDelete(null);
    }
  };

  // 편집 버튼 클릭
  const handleEditClick = (categoryId: number) => {
    const category = editedCategories.find((cat) => cat.category_id === categoryId);
    if (category && category.category_id !== null) {
      setEditingCategoryId(category.category_id);
      setEditingName(category.name);
      // input에 포커스
      setTimeout(() => {
        editInputRef.current?.focus();
      }, 0);
    }
  };

  // 편집 취소
  const handleEditCancel = () => {
    setEditingCategoryId(null);
    setEditingName("");
  };

  // 편집 저장
  const handleEditSave = (categoryId: number) => {
    if (editingName.trim() && editingName.trim() !== editedCategories.find(c => c.category_id === categoryId)?.name) {
      // 로컬 상태 업데이트
      setEditedCategories((prev) =>
        prev.map((cat) =>
          cat.category_id === categoryId ? { ...cat, name: editingName.trim() } : cat
        )
      );
      
      // 부모 컴포넌트에 알림
      if (onEditCategory) {
        onEditCategory(categoryId, editingName.trim());
      }
    }
    setEditingCategoryId(null);
    setEditingName("");
  };

  // Enter 키로 저장
  const handleEditKeyDown = (e: React.KeyboardEvent, categoryId: number) => {
    if (e.key === "Enter") {
      handleEditSave(categoryId);
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  // 터치 시작 (모바일)
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0];
    setDraggedIndex(index);
    setIsDragging(index);
  };

  // 터치 이동 (모바일)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (draggedIndex === null) return;
      e.preventDefault();

      const touch = e.touches[0];
      const currentY = touch.clientY;

      const allItems = container.querySelectorAll('[data-category-item]');
      let targetIndex = draggedIndex;

      for (let idx = 0; idx < allItems.length; idx++) {
        if (idx === draggedIndex) continue;
        
        const rect = allItems[idx].getBoundingClientRect();
        
        if (currentY >= rect.top && currentY <= rect.bottom) {
          const itemCenterY = rect.top + rect.height / 2;
          targetIndex = currentY < itemCenterY ? idx : idx + 1;
          break;
        }
      }

      if (targetIndex < 0) targetIndex = 0;
      if (targetIndex > editedCategories.length - 1) targetIndex = editedCategories.length - 1;

      if (targetIndex !== draggedIndex) {
        setEditedCategories((prev) => {
          const newCategories = [...prev];
          const draggedItem = newCategories[draggedIndex];
          newCategories.splice(draggedIndex, 1);
          newCategories.splice(targetIndex, 0, draggedItem);
          return newCategories;
        });
        setDraggedIndex(targetIndex);
      }
    };

    const handleTouchEnd = () => {
      setDraggedIndex(null);
      setIsDragging(null);
    };

    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [draggedIndex, editedCategories.length]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="w-full max-w-[420px] left-auto right-auto rounded-t-[20px] border-bg-80 p-0"
      >
        {/* 드래그 핸들 */}
        <div className="flex justify-center pt-5">
          <div className="w-20 h-[4.5px] bg-bg-40 rounded-full" />
        </div>

        {isCreatingNewCategory ? (
          /* 새 카테고리 생성 화면 */
          <div className="flex flex-col min-h-[50vh] gap-[22px]">
            {/* 헤더 */}
            <div className="px-5 flex flex-col gap-[10px] pt-[30px]">
              <button
                onClick={handleBackFromNewCategory}
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
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="이름을 입력해주세요."
                className="w-full h-[60px] pl-[25px] pr-4 py-[18px] bg-bg-70 rounded-[8px] text-b1 text-gray-20 placeholder:text-gray-50 placeholder:text-b2 focus:outline-none focus:ring-0"
                autoFocus
                maxLength={20}
              />
            </div>

            {/* 저장 버튼 */}
            <div className="mt-auto px-5 pb-9 flex justify-end">
              <button
                onClick={handleSaveNewCategory}
                disabled={!newCategoryName.trim()}
                className="w-[150px] px-2.5 py-2 bg-primary-50 rounded-[8px] text-b2 text-gray-10 disabled:bg-primary-20 disabled:cursor-not-allowed transition-colors"
              >
                저장하기
              </button>
            </div>
          </div>
        ) : (
          /* 카테고리 편집 화면 */
          <div className="flex flex-col max-h-[80vh]">
            {/* 헤더 */}
            <div className="px-5 pt-[30px] pb-[15px]">
              <SheetTitle className="text-sh3 text-gray-10">
                내 카테고리 편집
              </SheetTitle>
            </div>

            {/* 새 카테고리 추가 */}
            <button
              onClick={handleAddNewCategoryClick}
              className="flex items-center gap-[10px] px-5 py-[14px]"
            >
            <div className="w-5 h-5 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M8.75 1.25L8.75 16.25"
                  stroke="#9C95FA"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M16.25 8.75L1.25 8.75"
                  stroke="#9C95FA"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-b1 text-primary-30">새 카테고리 추가</span>
          </button>

          {/* 카테고리 목록 */}
          <div ref={containerRef} className="flex flex-col overflow-y-auto">
            {editedCategories.map((category, index) => (
              <div
                key={category.category_id}
                data-category-item
                onTouchStart={(e) => handleTouchStart(e, index)}
                className={`flex items-center justify-between px-5 py-[14px] gap-[10px] ${
                  isDragging === index ? "opacity-50" : ""
                }`}
                style={{ touchAction: "none" }}
              >
                {/* 삭제 아이콘 */}
                <button
                  onClick={() => category.category_id !== null && handleDeleteClick(category.category_id)}
                  className="flex items-center justify-center w-6 h-6"
                  aria-label="삭제"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M0.75 0.75L10.75 10.75M10.75 0.75L0.75 10.75"
                      stroke="#D5D9E4"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {/* 카테고리 이름 또는 편집 input */}
                {editingCategoryId === category.category_id ? (
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => category.category_id !== null && handleEditSave(category.category_id)}
                    onKeyDown={(e) => category.category_id !== null && handleEditKeyDown(e, category.category_id)}
                    className="flex-1 bg-bg-80 border border-bg-40 rounded-[8px] px-[10px] text-b3 text-gray-40 focus:outline-none focus:ring-0"
                    autoFocus
                    maxLength={20}
                  />
                ) : (
                  <span className="flex-1 text-b1 text-gray-10">
                    {category.name}
                  </span>
                )}

                {/* 편집 및 드래그 아이콘 */}
                <div className="flex items-center gap-4">
                  {/* 편집 아이콘 */}
                  <button
                    onClick={() => category.category_id !== null && handleEditClick(category.category_id)}
                    className="flex items-center justify-center w-6 h-6"
                    aria-label="편집"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                    >
                      <path
                        d="M13.435 0.707107C13.8255 0.316582 14.4587 0.316583 14.8492 0.707107L16.2634 2.12132C16.6539 2.51184 16.6539 3.14501 16.2634 3.53553L14.8492 4.94975L12.0208 2.12132L13.435 0.707107Z"
                        fill="#D5D9E4"
                      />
                      <path
                        d="M1.41417 15.5563L2.12127 12.0208L11.3137 2.82843L14.1421 5.65685L4.9497 14.8492L1.41417 15.5563Z"
                        fill="#D5D9E4"
                      />
                    </svg>
                  </button>

                  {/* 드래그 핸들 아이콘 */}
                  <div className="flex flex-col gap-1">
                    <div className="w-4 h-0.5 bg-bg-40"></div>
                    <div className="w-4 h-0.5 bg-bg-40"></div>
                    <div className="w-4 h-0.5 bg-bg-40"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

            {/* 하단 버튼 */}
            <div className="flex gap-[10px] px-5 mb-9 mt-4">
              <button
                onClick={handleReset}
                className="flex flex-[13] shrink-0 items-center justify-center gap-[10px] px-[10px] py-[14px] rounded-[12px] bg-bg-50 text-b1 text-gray-10"
              >
                초기화
              </button>
              <button
                onClick={handleSave}
                className="flex flex-[21] shrink-0 items-center justify-center gap-[10px] px-[10px] py-[14px] rounded-[12px] bg-primary-50 text-b1 text-gray-10"
              >
                저장하기
              </button>
            </div>
          </div>
        )}

        {/* 삭제 확인 다이얼로그 */}
        <DeleteConfirmDialog
          open={isDeleteConfirmOpen}
          onOpenChange={setIsDeleteConfirmOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setCategoryToDelete(null);
            setIsDeleteConfirmOpen(false);
          }}
          title="카테고리를 삭제할까요?"
          description={`카테고리를 삭제하면,\n삭제된 내용은 복구할 수 없어요.`}
        />

      </SheetContent>
    </Sheet>
  );
}
