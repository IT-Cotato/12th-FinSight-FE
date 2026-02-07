"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";

type Category = {
  category_id: number;
  name: string;
};

type CategoryEditBottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSave: (categories: Category[]) => void;
};

export function CategoryEditBottomSheet({
  open,
  onOpenChange,
  categories,
  onSave,
}: CategoryEditBottomSheetProps) {
  // "종합"(category_id: 0)을 제외한 카테고리만 편집
  const editableCategories = categories.filter((cat) => cat.category_id !== 0);
  const [editedCategories, setEditedCategories] = useState<Category[]>(editableCategories);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // categories가 변경되면 editedCategories 업데이트
  useEffect(() => {
    const filtered = categories.filter((cat) => cat.category_id !== 0);
    setEditedCategories(filtered);
  }, [categories]);

  // 초기화
  const handleReset = () => {
    const filtered = categories.filter((cat) => cat.category_id !== 0);
    setEditedCategories(filtered);
  };

  // 저장 - "종합"을 맨 앞에 추가
  const handleSave = () => {
    const generalCategory = categories.find((cat) => cat.category_id === 0);
    const finalCategories = generalCategory
      ? [generalCategory, ...editedCategories]
      : editedCategories;
    onSave(finalCategories);
    onOpenChange(false);
  };

  // 터치 시작 (모바일)
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0];
    setTouchStartY(touch.clientY);
    setDraggedIndex(index);
    setIsDragging(index);
  };

  // 터치 이동 (모바일)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedIndex === null) return;
    e.preventDefault();

    const touch = e.touches[0];
    const currentY = touch.clientY;

    // 모든 아이템 요소 가져오기
    const allItems = document.querySelectorAll('[data-category-item]');
    let targetIndex = draggedIndex;

    // 터치 위치에 해당하는 아이템 찾기
    for (let idx = 0; idx < allItems.length; idx++) {
      if (idx === draggedIndex) continue;
      
      const rect = allItems[idx].getBoundingClientRect();
      
      // 터치 위치가 이 아이템 영역 안에 있는지 확인
      if (currentY >= rect.top && currentY <= rect.bottom) {
        const itemCenterY = rect.top + rect.height / 2;
        // 아이템의 위쪽 절반이면 그 위에, 아래쪽 절반이면 그 아래에 배치
        targetIndex = currentY < itemCenterY ? idx : idx + 1;
        break;
      }
    }

    // 배열 범위 체크
    if (targetIndex < 0) targetIndex = 0;
    if (targetIndex > editedCategories.length - 1) targetIndex = editedCategories.length - 1;

    // 위치가 변경되었으면 배열 재정렬
    if (targetIndex !== draggedIndex) {
      const newCategories = [...editedCategories];
      const draggedItem = newCategories[draggedIndex];
      newCategories.splice(draggedIndex, 1);
      newCategories.splice(targetIndex, 0, draggedItem);
      setEditedCategories(newCategories);
      setDraggedIndex(targetIndex);
    }
  };

  // 터치 종료 (모바일)
  const handleTouchEnd = () => {
    setTouchStartY(null);
    setDraggedIndex(null);
    setIsDragging(null);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 z-50 bg-bg-90 rounded-t-[20px] border-t-2 border-bg-80 shadow-[0_0_20px_0_rgba(11,11,11,0.70)] safe-area-inset-bottom data-[state=open]:animate-[slide-up_300ms_ease-out] data-[state=closed]:animate-[slide-down_250ms_ease-in]">
          <div className="flex flex-col max-h-[150vh]">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-5 pt-10 pb-5">
              <Dialog.Title className="text-sh3 text-gray-10">
                카테고리 순서 선택
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="flex items-center justify-center w-5 h-5"
                  aria-label="닫기"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M5 5L15 15M15 5L5 15"
                      stroke="#D5D9E4"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </Dialog.Close>
            </div>

            {/* 카테고리 목록 */}
            <div className="flex flex-col">
                {editedCategories.map((category, index) => (
                  <div
                    key={category.category_id}
                    data-category-item
                    onTouchStart={(e) => handleTouchStart(e, index)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className={`flex items-center justify-between px-5 py-[14px] select-none ${
                      isDragging === index ? "opacity-50" : ""
                    }`}
                    style={{ touchAction: "none" }}
                  >
                    <span className="text-b1 text-gray-10">
                      {category.name}
                    </span>
                    {/* 드래그 핸들 아이콘 */}
                    <div className="flex flex-col gap-1">
                      <div className="w-4 h-0.5 bg-bg-40"></div>
                      <div className="w-4 h-0.5 bg-bg-40"></div>
                      <div className="w-4 h-0.5 bg-bg-40"></div>
                    </div>
                  </div>
                ))}
            </div>

            {/* 하단 버튼 */}
            <div className="flex gap-[10px] px-5 mb-9 mt-[14px]">
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
