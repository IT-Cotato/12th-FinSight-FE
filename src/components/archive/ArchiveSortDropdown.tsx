"use client";

import { useState, useRef, useEffect } from "react";

export type ArchiveCategoryOption = number | null;

type Category = {
  category_id: number | null;
  name: string;
};

type ArchiveSortDropdownProps = {
  value: ArchiveCategoryOption;
  onChange: (value: ArchiveCategoryOption) => void;
  categories?: Category[];
};

// 기본 카테고리 목록
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

export function ArchiveSortDropdown({ 
  value, 
  onChange, 
  categories = DEFAULT_CATEGORIES 
}: ArchiveSortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCategory = categories.find((cat) => cat.category_id === value);
  const currentLabel = currentCategory?.name || "종합";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative px-5" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-[5px] px-[10px] text-center text-b3 text-bg-20"
        aria-label="정렬 옵션 선택"
      >
        <span>{currentLabel}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="7"
          viewBox="0 0 10 7"
          fill="none"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M1.00003 1L4.84386 5.80478C4.92392 5.90486 5.07614 5.90486 5.1562 5.80478L9.00003 1"
            stroke="#D5D9E4"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-[rgba(0,0,0,0.50)] z-[5]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-5 inline-flex flex-col items-start justify-center gap-[5px] bg-bg-80 rounded-[16px] shadow-[0_0_20px_0_rgba(11,11,11,0.70)] z-10 py-[12px] pl-[20px] pr-[73px] max-h-[300px] overflow-y-auto">
            {categories.map((category) => {
              const isSelected = category.category_id === value;
              return (
                <button
                  key={category.category_id ?? "all"}
                  onClick={() => {
                    onChange(category.category_id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-[10px] text-left text-b2 transition-colors ${
                    isSelected
                      ? "text-primary-30"
                      : "text-gray-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={isSelected ? "" : "invisible"}
                  >
                    <path
                      d="M1 5.72222L4.83467 9.93872C5.30286 10.4535 6.14064 10.3446 6.46169 9.72726L11 1"
                      stroke="#9C95FA"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {category.name}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
