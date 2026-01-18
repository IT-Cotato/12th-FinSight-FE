"use client";

import Image from "next/image";

type Props = {
  title: string;
  description: string;
  countText: string;
  iconSrc?: string;
  iconSize?: number;
  iconScale?: number;
  onClick?: () => void;
};

export default function QuizOptionCard({
  title,
  description,
  countText,
  iconSrc,
  iconSize = 50,
  iconScale = 1,
  onClick,
}: Props) {
  return (
    <div className="mt-10 grid justify-items-center gap-4">
      <button
        type="button"
        onClick={onClick}
        className="
        relative mt-8 h-[200px] w-[157px] rounded-2xl
        border border-primary-90 bg-primary-100
        pt-5
      "
      >
        {/* 아이콘 */}
        <div
          className="absolute -top-[26px] left-1/2"
          style={{
            width: iconSize,
            height: iconSize,
            transform: `translateX(-50%) scale(${iconScale})`,
            transformOrigin: "center",
          }}
        >
          {iconSrc ? (
            <Image
              src={iconSrc}
              alt=""
              fill
              className="object-contain"
              priority
            />
          ) : (
            <div className="h-full w-full" />
          )}
        </div>

        <div className="flex flex-col items-center text-center">
          <h3 className="mt-0 text-h4 text-primary-30">{title}</h3>

          <p className="mt-3 whitespace-pre-line text-b3 text-gray-50">
            {description}
          </p>

          <p className="mt-8 text-b4 font-medium text-primary-40">
            {countText}
          </p>
        </div>
      </button>
    </div>
  );
}
