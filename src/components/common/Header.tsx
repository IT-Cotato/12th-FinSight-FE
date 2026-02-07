"use client";

type HeaderProps = {
  title: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

export function Header({ title, leftSlot, rightSlot }: HeaderProps) {
  return (
    <header className="relative flex items-center w-full pt-[60px] px-[20px] pb-[10px]">
      {/* Left */}
      <div className="flex items-center min-w-0">
        {leftSlot}
      </div>

      {/* Center */}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-sh4 text-bg-20 text-center">
        {title}
      </h1>

      {/* Right */}
      <div className="ml-auto flex items-center">
        {rightSlot}
      </div>
    </header>
  );
}