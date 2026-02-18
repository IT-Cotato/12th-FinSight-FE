"use client";

type Category = {
  category_id: number | null;
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
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="inline-flex items-center gap-2 py-[10px] pl-5 pr-0">
        {/* 수정 아이콘 : onEditClick 프롭이 전달되었을 때만 이 버튼 렌더링 */}
        {onEditClick && (
          <button
            onClick={onEditClick}
            className="flex-shrink-0 flex items-center justify-center w-9 h-[35px] py-[6px] px-0 gap-[10px] rounded-[16px] bg-bg-70 border border-bg-60"
            aria-label="수정"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
            <line x1="1.55005" y1="3.4165" x2="16.05" y2="3.4165" stroke="#B1B1B1" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="1.55005" y1="11.75" x2="16.05" y2="11.75" stroke="#B1B1B1" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12.0002 0.75C13.3246 0.750111 14.4503 1.87735 14.4504 3.33301C14.4504 4.78882 13.3247 5.91688 12.0002 5.91699C10.6757 5.91699 9.55005 4.78889 9.55005 3.33301C9.55022 1.87728 10.6758 0.75 12.0002 0.75Z" fill="#2F3847" stroke="#B1B1B1" strokeWidth="1.5"/>
            <path d="M3.2002 9.0835C4.52455 9.08361 5.65022 10.2108 5.65039 11.6665C5.65039 13.1223 4.52465 14.2504 3.2002 14.2505C1.87566 14.2505 0.75 13.1224 0.75 11.6665C0.750168 10.2108 1.87576 9.0835 3.2002 9.0835Z" fill="#2F3847" stroke="#B1B1B1" strokeWidth="1.5"/>
          </svg>
        </button>
        )}

        {/* 카테고리 버튼들 */}
        {categories.map((category) => {
          const isSelected = category.category_id === selectedCategoryId;
          return (
            <button
              key={category.category_id ?? "all"}
              onClick={() => onCategoryChange(category.category_id)}
              className={`flex-shrink-0 flex items-center justify-center px-[15px] py-[6px] rounded-[16px] gap-[10px] text-b3 text-gray-10 transition-colors ${
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