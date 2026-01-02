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
    icon: "/bottomTab/Home.svg",
  },
  {
    key: "study",
    label: "학습",
    href: "/study",
    icon: "/bottomTab/Study.svg",
  },
  {
    key: "archive",
    label: "보관함",
    href: "/archive",
    icon: "/bottomTab/Archive.svg",
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
    <nav className="pointer-events-none sticky bottom-0 z-40 flex w-full justify-center">
      <div className="pointer-events-auto w-full rounded-t-[20px] border-t-[0.4px] border-[var(--color-bg-70,#2F3847)] bg-[var(--color-bg-90,#171E26)] shadow-[0_0_5px_0_rgba(47,56,71,0.5)]">
        <div className="flex items-center justify-between w-full h-[90px] pt-[13px] pb-[35px] px-10">
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
                src={item.icon}
                alt={item.label}
                width={24}
                height={24}
                className={`h-6 w-6 transition-all ${
                  isActive
                    ? "brightness-0 invert"
                    : "opacity-60"
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

