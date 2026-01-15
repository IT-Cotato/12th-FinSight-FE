"use client";

import Image from "next/image";

type Category = {
  category_id: number;
  name: string;
};

type CategoryBarProps = {
  categories: Category[];
  selectedCategoryId: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  onEditClick?: () => void;
};

export function CategoryBar({
  categories,
  selectedCategoryId,
  onCategoryChange,
  onEditClick,
}: CategoryBarProps) {
  return (
    <div className="w-full overflow-x-auto pb-3 scrollbar-hide">
      <div className="inline-flex items-center gap-2 py-[10px] pl-5 pr-0">
        {/* 수정 아이콘 */}
        <button
          onClick={onEditClick}
          className="flex-shrink-0 flex items-center justify-center w-9 h-[35px] py-[6px] px-0 gap-[10px] rounded-[16px] bg-bg-70 border border-bg-60"
          aria-label="수정"
        >
          <Image
            src="/study/edit.png"
            alt="수정"
            width={16}
            height={15}
          />
        </button>

        {/* 카테고리 버튼들 */}
        {categories.map((category) => {
          const isSelected = category.category_id === selectedCategoryId;
          return (
            <button
              key={category.category_id}
              onClick={() => onCategoryChange(category.category_id)}
              className={`flex-shrink-0 flex items-center justify-center px-[15px] py-[6px] rounded-[16px] gap-[10px] text-b3 transition-colors ${
                isSelected
                  ? "bg-primary-50 border border-primary-40"
                  : "bg-bg-70 border border-bg-60"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

