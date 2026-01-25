"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";

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

export function NewCategoryBottomSheet({
  open,
  onOpenChange,
  categories,
  onSelectCategory,
  onAddNewCategory,
}: NewCategoryBottomSheetProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
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
    setSelectedCategoryId(categoryId);
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
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed bottom-0 right-auto left-auto z-50 bg-bg-90 w-full max-w-[420px] rounded-t-[20px] shadow-lg min-h-[50vh] max-h-[80vh] overflow-y-auto data-[state=open]:animate-[sheet-up_300ms_ease-out] data-[state=closed]:animate-[sheet-down_250ms_ease-in]">
          {isCreatingNewCategory ? (
            // 새 카테고리 생성 폼
            <div className="flex flex-col min-h-[50vh]">
              {/* 드래그 핸들 */}
              <div className="flex justify-center pt-3 pb-10">
                <div className="w-12 h-1 bg-bg-60 rounded-full" />
              </div>

              {/* 헤더 */}
              <div className="px-5 pb-4 flex flex-col gap-[10px]">
                <button
                  onClick={handleBackClick}
                  className="flex items-center justify-center w-6 h-6"
                  aria-label="뒤로가기"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-30"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <Dialog.Title className="text-sh2 text-gray-10">새 카테고리</Dialog.Title>
              </div>

              {/* 입력 필드 */}
              <div className="px-5 mb-4">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="이름을 입력해주세요."
                  className="w-full h-14 pl-6 pr-6 py-4 bg-bg-70 rounded-lg text-b1 text-gray-20 placeholder:text-gray-50 focus:outline-none focus:ring-0"
                  autoFocus
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
            // 카테고리 선택 리스트
            <div className="flex flex-col">
              {/* 드래그 핸들 */}
              <div className="flex justify-center pt-3 pb-10">
                <div className="w-12 h-1 bg-bg-60 rounded-full" />
              </div>

              {/* 헤더 */}
              <div className="px-5 pb-4">
                <p className="text-sh5 text-gray-40 mb-1">보관함에 저장할</p>
                <Dialog.Title className="text-sh2 text-gray-10">카테고리 선택</Dialog.Title>
              </div>

              {/* 카테고리 리스트 */}
              <div className="px-5 py-2">
                {/* 기본 폴더 */}
                <button
                  onClick={() => handleCategorySelect(null)}
                  className="w-full flex items-center gap-3 px-0 py-[14px] text-left"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24" 
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-bg-20"
                  >
                    <path
                      d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17L5 21V5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  {/* TODO: 기본 폴더 개수 API 연동 후 변경 */}
                  <span className="text-b2 text-bg-20">기본 폴더 (0)</span>
                </button>

                {/* 구분선 */}
                <div className="h-px bg-bg-60" />

                {/* 사용자 카테고리들 */}
                {categories
                  .filter((cat) => cat.category_id !== 0)
                  .map((category) => (
                    <div key={category.category_id}>
                      <button
                        onClick={() => handleCategorySelect(category.category_id)}
                        className="w-full flex items-center gap-3 px-0 py-[14px] text-left"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-white"
                        >
                          <path
                            d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17L5 21V5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                        <span className="text-b1 text-gray-10">
                          {category.name} ({category.count || 0})
                        </span>
                      </button>
                      <div className="h-px bg-bg-60" />
                    </div>
                  ))}

                {/* 새 카테고리 추가 */}
                <button
                  onClick={handleAddNewCategoryClick}
                  className="w-full flex items-center gap-3 px-0 py-[14px] text-left"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary-30"
                  >
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="text-center justify-start text-b2 text-primary-30 leading-6">새 카테고리 추가</div>
                </button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
