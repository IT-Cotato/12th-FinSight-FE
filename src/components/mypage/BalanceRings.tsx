type Props = {
  items: Array<{ section: string; percentage: number }>;
};

function Ring({ label, percent }: { label: string; percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));

  const size = 84;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dashoffset = c * (1 - clamped / 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[84px] w-[84px]">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* 배경 링(100%) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            style={{ stroke: "var(--color-primary-90)", opacity: 0.5 }}
          />

          {/* 진행 링(%) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={dashoffset}
            style={{
              stroke: "var(--color-primary-40)",
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
              transition: "stroke-dashoffset 300ms ease",
            }}
          />
        </svg>

        {/* 가운데 텍스트 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-b4 text-primary-30">{label}</p>
            <p className="text-h5 text-semibold text-primary-20">{clamped}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BalanceRings({ items }: Props) {
  const nameMap: Record<string, string> = {
    FINANCE: "금융",
    STOCK: "증권",
    INDUSTRY: "산업/재계",
    REAL_ESTATE: "부동산",
    SME: "중기/벤쳐",
    GLOBAL: "글로벌 경제",
    GENERAL: "경제 일반",
    LIVING: "생활 경제",
    ALL: "종합",
  };

  return (
    <div className="mt-8">
      <p className="text-b3 text-gray-40">학습 밸런스</p>
      <div className="mt-4 grid grid-cols-3 justify-items-center gap-3">
        {items.slice(0, 3).map((it) => {
          const normalized = it.section?.trim().toUpperCase();

          return (
            <Ring
              key={it.section}
              label={nameMap[normalized] ?? "기타"}
              percent={it.percentage}
            />
          );
        })}
      </div>
    </div>
  );
}
