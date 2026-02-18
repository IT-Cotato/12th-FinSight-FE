"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type NewsCardProps = {
  title: string;
  thumbnailUrl: string;
  thumbnailAlt?: string;
  tags: string[];
  href: string;
  newsId?: number | string;
};

export function NewsCard({
  title,
  thumbnailUrl,
  thumbnailAlt = "뉴스 썸네일",
  tags,
  href,
  newsId,
}: NewsCardProps) {
  const [isRead, setIsRead] = useState(false);

  // 읽은 기사인지 확인
  useEffect(() => {
    // newsId가 없으면 href에서 추출 시도
    const id = newsId || (href.match(/\/study\/(\d+)/)?.[1]);
    if (!id) return;
    
    const readNewsIds = JSON.parse(
      localStorage.getItem("readNewsIds") || "[]"
    ) as (string | number)[];
    
    setIsRead(readNewsIds.includes(String(id)) || readNewsIds.includes(Number(id)));
  }, [newsId, href]);
  const cardContent = (
    <>
      {/* 썸네일 */}
      <div className="flex-shrink-0 w-[98px] h-[75px] rounded-[8px] overflow-hidden bg-bg-70">
        <Image
          src={thumbnailUrl}
          alt={thumbnailAlt}
          width={98}
          height={75}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-col items-start justify-between flex-1 min-w-0 h-[75px]">
        {/* 제목 */}
        <h3 className={`flex flex-col items-start gap-[2px] flex-shrink-0 overflow-hidden text-[15px] font-semibold leading-[150%] tracking-[-0.15px] line-clamp-2 ${
          isRead ? "text-gray-60" : "text-gray-10"
        }`}>
          {title}
        </h3>

        {/* 태그 */}
        <div className="flex w-full flex-wrap items-start gap-[5px]">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center justify-center px-[6px] py-[1px] rounded-[8px] bg-bg-60 text-b5 text-gray-30 whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <Link href={href} className="block">
      <article className="flex w-full items-start gap-[18px] p-5 bg-bg-100">{cardContent}</article>
    </Link>
  );
}

