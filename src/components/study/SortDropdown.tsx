"use client";

import { useState, useRef, useEffect } from "react";

export type SortOption = "latest" | "popular";

type SortDropdownProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLabel = SORT_OPTIONS.find((option) => option.value === value)?.label || "최신순";

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
        className="inline-flex items-center gap-[5px] px-[10px] py-[5px] text-center text-b3 text-bg-20"
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
          <div className="absolute top-full left-5 inline-flex h-[79px] flex-col items-start justify-center gap-[5px] bg-bg-80 rounded-[16px] shadow-[0_0_20px_0_rgba(11,11,11,0.70)] z-10 py-[12px] pl-[20px] pr-[73px]">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 text-left text-sm transition-colors ${
                  value === option.value
                    ? "text-primary-30"
                    : "text-gray-300 hover:bg-bg-70"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className={value === option.value ? "" : "invisible"}
                >
                  <path
                    d="M1 5.72222L4.83467 9.93872C5.30286 10.4535 6.14064 10.3446 6.46169 9.72726L11 1"
                    stroke="#9C95FA"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

