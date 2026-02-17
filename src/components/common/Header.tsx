"use client";

type HeaderProps = {
  title?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  centerSlot?: React.ReactNode;
  variant?: "title" | "center";
};

export function Header({
  title,
  leftSlot,
  rightSlot,
  centerSlot,
  variant = "title",
}: HeaderProps) {
  return (
    <header className="flex w-full items-center pt-[60px] px-[20px] pb-[10px]">
      {/* Left */}
      <div className="flex items-center min-w-0">
        {leftSlot}
      </div>

      {/* Center */}
      {variant === "title" ? (
          <h1 className="absolute left-1/2 -translate-x-1/2 text-sh4 text-bg-20 text-center whitespace-nowrap">
            {title}
          </h1>
      ) : (
        <div className="mx-3 flex-1 min-w-0">
          {centerSlot}
        </div>
      )}

      {/* Right */}
      <div className="ml-auto flex items-center">
        {rightSlot}
      </div>
    </header>
  );
}
