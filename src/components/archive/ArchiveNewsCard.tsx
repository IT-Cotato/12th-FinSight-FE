"use client";

import Image from "next/image";
import Link from "next/link";

type ArchiveNewsCardProps = {
  newsId: number;
  title: string;
  thumbnailUrl: string;
  category: string;
  href: string;
  onMenuClick?: (e: React.MouseEvent) => void;
};

export function ArchiveNewsCard({
  newsId,
  title,
  thumbnailUrl,
  category,
  href,
  onMenuClick,
}: ArchiveNewsCardProps) {
  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMenuClick?.(e);
  };

  return (
    <Link href={href} className="block">
      <div className="w-40 h-44 relative bg-bg-100 overflow-hidden rounded-lg">
        {/* 썸네일 이미지 영역 */}
        <div className="w-40 h-24 left-0 top-0 absolute rounded-lg overflow-hidden">
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
          />
          {/* 더보기 메뉴 아이콘 (점 3개) */}
          <button
            onClick={handleMenuClick}
            className="absolute right-2 top-2.5 flex flex-col gap-[2px] p-1"
            aria-label="메뉴"
          >
            <div className="w-[3px] h-[3px] bg-bg-30 rounded-full" />
            <div className="w-[3px] h-[3px] bg-bg-30 rounded-full" />
            <div className="w-[3px] h-[3px] bg-bg-30 rounded-full" />
          </button>
        </div>

        {/* 제목 */}
        <div className="w-40 h-12 left-0 top-[102px] absolute justify-start text-gray-10 text-[15px] font-semibold leading-[150%] tracking-[-0.15px] overflow-hidden px-0 line-clamp-2">
          {title}
        </div>

        {/* 카테고리 태그 */}
        <div className="left-0 top-[158px] absolute inline-flex justify-start items-center gap-[5px]">
          <div className="px-1.5 py-px bg-bg-60 rounded-[8px] flex justify-center items-center gap-2.5">
            <div className="text-center justify-start text-b5 text-gray-30">
              {category}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
