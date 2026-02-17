"use client";

import Image from "next/image";
import Link from "next/link";

type NewsCardProps = {
  title: string;
  thumbnailUrl: string;
  thumbnailAlt?: string;
  tags: string[];
  href: string;
};

export function NewsCard({
  title,
  thumbnailUrl,
  thumbnailAlt = "뉴스 썸네일",
  tags,
  href,
}: NewsCardProps) {
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
        <h3 className="flex flex-col items-start gap-[2px] flex-shrink-0 overflow-hidden text-[15px] font-semibold text-gray-10 leading-[150%] tracking-[-0.15px] line-clamp-2">
          {title}
        </h3>

        {/* 태그 */}
        <div className="flex w-full items-center gap-[5px]">
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

