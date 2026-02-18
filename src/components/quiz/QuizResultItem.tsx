import Image from "next/image";

type Props = {
  kind: "correct" | "incorrect";
  title: string;
  onClick: () => void;
};

export default function QuizResultItem({ kind, title, onClick }: Props) {
  const isCorrect = kind === "correct";

  const match = title.match(/^(Q\d+\.)\s*(.*)$/);
  const qLabel = match?.[1];
  const restText = match?.[2] ?? title;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-[350px] h-[60px] items-center gap-3 rounded-xl border px-3 py-5 text-left",
        isCorrect
          ? "bg-primary-100 border-primary-90"
          : "bg-primary-90 border-bg-80",
      ].join(" ")}
    >
      <div className="flex h-9 w-9 items-center justify-center">
        <Image
          src={
            isCorrect ? "/quiz/icon-correct.svg" : "/quiz/icon-incorrect.svg"
          }
          alt=""
          width={20}
          height={20}
        />
      </div>

      <p className="flex-1 min-w-0 truncate text-b2 text-gray-10">
        {qLabel && <span className="mr-1 text-primary-30">{qLabel}</span>}
        <span className="text-gray-10">{restText}</span>
      </p>
      <Image src="/quiz/icon-next.svg" alt="" width={9} height={9} />
    </button>
  );
}
