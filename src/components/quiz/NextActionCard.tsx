"use client";

import Image from "next/image";

type Props = {
  iconSrc: string;
  title: string;
  desc: string;
  badgeText?: string;
  iconScale?: number;
  onClick?: () => void;
};

export default function NextActionCard({
  iconSrc,
  title,
  desc,
  badgeText,
  iconScale = 1,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        h-[110px] w-[350px] rounded-xl border border-primary-90 bg-primary-100
        px-5 text-left
      "
    >
      <div className="flex items-center gap-4">
        <div className="relative h-[50px] w-[50px]">
          <Image
            src={iconSrc}
            alt=""
            fill
            className="object-contain"
            style={{
              transform: `scale(${iconScale})`,
              transformOrigin: "center",
            }}
          />
        </div>

        <div className="flex-1">
          <p className="text-h5 font-semibold text-gray-10">{title}</p>
          <p className="mt-2 text-b4 text-gray-40">{desc}</p>

          {badgeText && (
            <span
              className="
                mt-0 h-[22px] w-[70px] items-center rounded-full
                bg-primary-30 px-3 py-1 text-b5 text-gray-100
              "
            >
              {badgeText}
            </span>
          )}
        </div>

        <div className="relative h-5 w-5">
          <Image
            src="/quiz/icon-next.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>
    </button>
  );
}
