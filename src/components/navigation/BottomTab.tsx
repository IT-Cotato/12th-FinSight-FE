"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type BottomTabItem = {
  key: string;
  label: string;
  href: string;
  icon: string;
};

const TAB_ITEMS: BottomTabItem[] = [
  {
    key: "home",
    label: "홈",
    href: "/home",
    icon: "/bottomTab/home.svg",
  },
  {
    key: "study",
    label: "학습",
    href: "/study",
    icon: "/bottomTab/study.svg",
  },
  {
    key: "archive",
    label: "보관함",
    href: "/archive",
    icon: "/bottomTab/archive.svg",
  },
  {
    key: "mypage",
    label: "마이페이지",
    href: "/mypage",
    icon: "/bottomTab/mypage.svg",
  },
];

export function BottomTab() {
  const pathname = usePathname();

  return (
    /* 1. 화면 하단 고정 및 중앙 정렬 (최대 너비 430px 제한) */
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[430px]">
      <div className="w-full rounded-t-[20px] border-t-[0.4px] border-bg-70 bg-bg-90 shadow-[0_0_5px_0_rgba(47,56,71,0.5)]">
        <div className="flex items-center justify-between w-full h-[90px] pt-[13px] pb-[31.74px] px-10">
          {TAB_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/home" && pathname.startsWith(`${item.href}/`));

            const iconPath = isActive 
              ? item.icon.replace(".svg", "_active.svg") 
              : item.icon;

            return (
              <Link
                key={item.key}
                href={item.href}
                className="flex flex-col items-center justify-center transition-colors"
              >
                {/* 아이콘: 24x24(w-6 h-6) 영역 내 중앙 정렬 */}
                <div className="relative flex items-center justify-center w-6 h-6">
                  <Image
                    src={iconPath}
                    alt={item.label}
                    width={19} 
                    height={20}
                    className="object-contain" 
                  />
                </div>
                
                {/* 텍스트: mt-[5px]로 피그마의 미세 간격 유지 */}
                <span className={`text-[10px] mt-[5px] leading-none transition-colors font-medium ${
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