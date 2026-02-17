"use client";

import Image from "next/image";

type Props = {
  index: number;
  text: string;
  variant: "default" | "correct" | "wrongSelected";
};

export default function QuizExplainChoice({ index, text, variant }: Props) {
  const base = "w-[350px] rounded-xl border px-5 py-4 text-left text-b3";

  const styles =
    variant === "correct"
      ? "bg-primary-60 border-primary-50"
      : variant === "wrongSelected"
        ? "bg-primary-90 border-bg-80"
        : "bg-primary-100 border-primary-90";

  const iconSrc =
    variant === "correct"
      ? "/quiz/icon-correct.svg"
      : variant === "wrongSelected"
        ? "/quiz/icon-incorrect.svg"
        : null;

  return (
    <div className={`${base} ${styles}`}>
      {iconSrc ? (
        // 정답/오답 컴포넌트
        <div className="flex items-center gap-3">
          <Image src={iconSrc} alt="" width={20} height={20} />
          <p className="text-gray-10 text-b2">
            <span>{index + 1}. </span>
            {text}
          </p>
        </div>
      ) : (
        // 그 외 컴포넌트
        <p className="text-gray-10 text-b2">
          <span>{index + 1}. </span>
          {text}
        </p>
      )}
    </div>
  );
}
