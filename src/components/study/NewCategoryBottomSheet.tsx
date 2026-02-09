"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

type Category = {
  category_id: number;
  name: string;
  count?: number;
};

type NewCategoryBottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSelectCategory: (categoryId: number | null) => void;
  onAddNewCategory: () => void;
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
};

function CategorySelectList({
  categories,
  onSelectCategory,
  onAddNewCategory,
}: CategorySelectListProps) {
  return (
    <div className="flex flex-col">
      {/* 드래그 핸들 */}
      <div className="flex justify-center pt-5 pb-[30px]">
        <div className="w-20 h-[4.5px] bg-bg-40 rounded-full" />
      </div>

      {/* 헤더 */}
      <div className="px-5 pb-4">
        <p className="text-sh5 text-gray-40 mb-1">보관함에 저장할</p>
        <SheetTitle className="text-sh2 text-gray-10">카테고리 선택</SheetTitle>
      </div>

      {/* 카테고리 리스트 */}
      <div className="px-5 flex flex-col items-start gap-[5px]">
        {/* 기본 폴더 */}
        <button
          onClick={() => onSelectCategory(null)}
          className="w-full flex items-center gap-3 px-0 py-[14px] text-left border-bg-50 border-b-[0.8px]"
        >
          <svg
            width="14"
            height="19"
            viewBox="0 0 14 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-bg-20"
          >
            <path
              d="M13 16.5V2C13 1.44772 12.5523 1 12 1H2C1.44772 1 1 1.44772 1 2V16.5C1 17.4027 2.10158 17.8433 2.72414 17.1897L6.27586 13.4603C6.66995 13.0466 7.33005 13.0466 7.72414 13.4603L11.2759 17.1897C11.8984 17.8433 13 17.4027 13 16.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          {/* TODO: 기본 폴더 개수 API 연동 후 변경 */}
          <span className="text-b2 text-bg-20">기본 폴더 (0)</span>
        </button>

        {/* 사용자 카테고리들 */}
        {categories
          .filter((cat) => cat.category_id !== 0)
          .map((category) => (
            <div key={category.category_id}>
              <button
                onClick={() => onSelectCategory(category.category_id)}
                className="w-full flex items-center gap-3 px-0 py-[14px] text-left border-bg-50 border-b-[0.8px]"
              >
                <svg
                  width="14"
                  height="19"
                  viewBox="0 0 14 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-bg-20"
                >
                  <path
                    d="M13 16.5V2C13 1.44772 12.5523 1 12 1H2C1.44772 1 1 1.44772 1 2V16.5C1 17.4027 2.10158 17.8433 2.72414 17.1897L6.27586 13.4603C6.66995 13.0466 7.33005 13.0466 7.72414 13.4603L11.2759 17.1897C11.8984 17.8433 13 17.4027 13 16.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="text-b2 text-bg-20">
                  {category.name} ({category.count || 0})
                </span>
              </button>
            </div>
          ))}

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
}: NewCategoryBottomSheetProps) {
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // 바텀시트가 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setIsCreatingNewCategory(false);
      setNewCategoryName("");
    }
  }, [open]);

  const handleCategorySelect = (categoryId: number | null) => {
    onSelectCategory(categoryId);
    onOpenChange(false);
  };

  const handleAddNewCategoryClick = () => {
    setIsCreatingNewCategory(true);
  };

  const handleBackClick = () => {
    setIsCreatingNewCategory(false);
    setNewCategoryName("");
  };

  const handleSaveNewCategory = () => {
    if (newCategoryName.trim()) {
      onAddNewCategory();
      // TODO: 실제로 새 카테고리를 생성하는 API 호출
      setIsCreatingNewCategory(false);
      setNewCategoryName("");
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
            categories={categories}
            onSelectCategory={handleCategorySelect}
            onAddNewCategory={handleAddNewCategoryClick}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
