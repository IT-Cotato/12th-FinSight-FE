"use client";

interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  text,
  onClick,
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full h-[60px] rounded-xl text-b1 text-gray-10 transition-colors
        ${disabled ? "bg-primary-20" : "bg-primary-50"}
        ${className}
      `}
    >
      {text}
    </button>
  );
}
