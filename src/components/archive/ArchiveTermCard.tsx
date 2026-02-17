"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ArchiveTermCardProps = {
  termId: number;
  term: string;
  description: string;
  onMenuClick?: (e: React.MouseEvent) => void;
  onClick?: () => void;
};

export function ArchiveTermCard({
  termId,
  term,
  description,
  onMenuClick,
  onClick,
}: ArchiveTermCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMenuClick?.(e);
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="w-full bg-bg-80 rounded-lg overflow-hidden">
      <div
        onClick={handleCardClick}
        className="px-4 py-3 flex items-center justify-between cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="text-gray-10 text-b2 font-semibold">
            {term}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-3">
          {/* 화살표 아이콘 */}
          <button
            onClick={handleArrowClick}
            className="flex items-center justify-center"
            aria-label={isExpanded ? "접기" : "펼치기"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="7"
              viewBox="0 0 10 7"
              fill="none"
              className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            >
              <path
                d="M1.00003 1L4.84386 5.80478C4.92392 5.90486 5.07614 5.90486 5.1562 5.80478L9.00003 1"
                stroke="#D5D9E4"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          
          {/* 케밥 메뉴 아이콘 */}
          <button
            onClick={handleMenuClick}
            className="flex flex-col gap-[2px] p-1"
            aria-label="메뉴"
          >
            <div className="w-[3px] h-[3px] bg-bg-30 rounded-full" />
            <div className="w-[3px] h-[3px] bg-bg-30 rounded-full" />
            <div className="w-[3px] h-[3px] bg-bg-30 rounded-full" />
          </button>
        </div>
      </div>

      {/* 설명 영역 (펼치기/접기) */}
      {isExpanded && (
        <div className="px-4 pb-3 pt-0 flex flex-col gap-3">
          <div className="text-gray-30 text-b3 leading-relaxed">
            {description}
          </div>
          
          {/* 이 용어가 들어간 뉴스 검색 버튼 */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/study/search?q=${encodeURIComponent(term)}`);
            }}
            className="w-full flex items-center justify-center gap-2 px-[10px] py-[8px] text-b2 text-gray-30 rounded-[8px] bg-bg-70"
          >
            <Image
              src="/study/img-insight.png"
              alt="검색"
              width={16}
              height={16}
            />
            <span>이 용어가 들어간 뉴스 검색</span>
          </button>
        </div>
      )}
    </div>
  );
}
