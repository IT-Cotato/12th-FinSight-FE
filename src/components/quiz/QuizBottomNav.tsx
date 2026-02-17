import Image from "next/image";

type Props = {
  canPrev: boolean;
  canNext: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export default function QuizBottomNav({
  canPrev,
  canNext,
  isLast,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="fixed bottom-[80px] left-0 right-0 z-[60] px-6">
      <div className="flex justify-center gap-24">
        {/* 이전문제 */}
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className={[
            "flex h-[46px] w-[130px] items-center justify-center gap-4 rounded-xl",
            canPrev ? "bg-primary-40 text-gray-10" : "bg-bg-40 text-gray-10",
          ].join(" ")}
        >
          <Image src="/quiz/icon-back.svg" alt="" width={9} height={9} />
          <span className="text-b2">이전문제</span>
        </button>

        {/* 다음문제 / 제출 */}
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className={[
            "flex h-[46px] w-[130px] items-center justify-center gap-4 rounded-xl",
            canNext
              ? "bg-primary-60 text-gray-10"
              : "bg-primary-20 text-gray-10",
          ].join(" ")}
        >
          <span className="text-b2">{isLast ? "제출하기" : "다음문제"}</span>
          <Image src="/quiz/icon-next.svg" alt="" width={9} height={9} />
        </button>
      </div>
    </div>
  );
}
