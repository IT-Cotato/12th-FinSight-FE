type Props = {
  currentLv: number;
  nextLv: number;
  percent: number;
};

export default function LevelProgress({ currentLv, nextLv, percent }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  const labelPos = Math.max(4, Math.min(96, clamped));

  return (
    <section className="mt-6 px-5">
      {/* 퍼센트 : 진행률 따라 이동) */}
      <div className="relative h-4">
        <span
          className="
            absolute -translate-x-3/4
            text-b5 text-primary-30
          "
          style={{ left: `${labelPos}%` }}
        >
          {clamped}%
        </span>
      </div>

      {/* 레벨 + 진행 바 */}
      <div className="flex items-center gap-2">
        {/* 현재 레벨 */}
        <span className="text-b5 text-primary-30">Lv.{currentLv}</span>

        {/* 진행 바 */}
        <div className="relative h-[14px] flex-1 rounded-full bg-primary-90">
          <div
            className="h-[14px] rounded-full transition-[width]"
            style={{
              width: `${clamped}%`,
              background:
                "linear-gradient(90deg, var(--color-primary-30), var(--color-primary-50))",
            }}
          />
        </div>

        {/* 다음 레벨 */}
        <span className="text-b5 text-primary-30">Lv.{nextLv}</span>
      </div>
    </section>
  );
}
