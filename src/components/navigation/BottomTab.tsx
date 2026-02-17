"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type BottomTabItem = {
  key: string;
  label: string;
  href: string;
  icon: string;
  activeIcon: string;
};

const TAB_ITEMS: BottomTabItem[] = [
  {
    key: "home",
    label: "홈",
    href: "/home",
    icon: "/bottomTab/icon-home.svg",
    activeIcon: "/bottomTab/icon-home-active.svg",
  },
  {
    key: "study",
    label: "학습",
    href: "/study",
    icon: "/bottomTab/icon-study.svg",
    activeIcon: "/bottomTab/icon-study-active.svg",
  },
  {
    key: "archive",
    label: "보관함",
    href: "/archive",
    icon: "/bottomTab/icon-archive.svg",
    activeIcon: "/bottomTab/icon-archive-active.svg",
  },
  {
    key: "mypage",
    label: "마이페이지",
    href: "/mypage",
    icon: "/bottomTab/icon-mypage.svg",
    activeIcon: "/bottomTab/icon-mypage-active.svg",
  },
];

export function BottomTab() {
  const pathname = usePathname();

  return (
    /* 1. 화면 하단 고정 및 중앙 정렬 (최대 너비 420px 제한) */
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[420px]">
      <div className="w-full rounded-t-[20px] border-t-[0.4px] border-bg-70 bg-bg-90 shadow-[0_0_5px_0_rgba(47,56,71,0.5)]">
        <div className="flex items-center justify-between w-full h-[90px] pt-[13px] pb-[31.74px] px-10">
          {TAB_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/home" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.key}
              href={item.href}
              className="flex flex-col items-center justify-center transition-colors"
            >
              <Image
                src={isActive ? item.activeIcon : item.icon}
                alt={item.label}
                width={24}
                height={24}
                className={`h-6 w-6 transition-all ${
                  isActive ? "" : "opacity-60"
                }`}
              />
              <span className={`text-[10px] mt-1 transition-colors ${
                isActive ? "text-white" : "text-gray-400"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
        </div>
      </div>
    </nav>
  );
}

export default BottomTab;