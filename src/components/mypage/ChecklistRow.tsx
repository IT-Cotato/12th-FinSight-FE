import Image from "next/image";

type Props = {
  items: Array<{ dayOfWeek: string; completionCount: number }>;
};

export default function ChecklistRow({ items }: Props) {
  const order = ["월", "화", "수", "목", "금", "토", "일"];
  const map = new Map(items.map((i) => [i.dayOfWeek, i.completionCount]));

  // 랭킹 계산
  const values = order.map((d) => map.get(d) ?? 0);
  const positives = values
    .map((v, idx) => ({ v, idx }))
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v);

  // 1위
  const top1Idx = positives[0]?.idx;
  // 2위
  const top2Idx = positives[1]?.idx;

  function badgeClass(idx: number) {
    if (idx === top1Idx) {
      return {
        wrap: "bg-primary-30 border-primary-20",
        text: "text-primary-80",
      };
    }
    if (idx === top2Idx) {
      return {
        wrap: "bg-primary-50 border-primary-40",
        text: "text-primary-20",
      };
    }
    return {
      wrap: "bg-primary-70 border-primary-60",
      text: "text-primary-30",
    };
  }

  return (
    <div className="mt-8">
      <p className="text-b3 text-gray-40">일일 체크리스트 달성률</p>

      <div className="mt-4 rounded-xl border border-primary-90 bg-primary-100 px-4 py-4">
        <div className="grid grid-cols-7 gap-2 text-center">
          {order.map((d, idx) => {
            const v = map.get(d) ?? 0;

            return (
              <div key={d} className="flex flex-col items-center gap-2">
                <span className="text-b4 text-gray-40">{d}</span>

                {v === 0 ? (
                  <div className="flex h-7 w-7">
                    <Image
                      src="/mypage/icon-x.svg"
                      alt="x"
                      width={40}
                      height={40}
                    />
                  </div>
                ) : (
                  <div
                    className={[
                      "flex h-7 w-7 items-center justify-center rounded-full border",
                      badgeClass(idx).wrap,
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "text-h4 font-semibold",
                        badgeClass(idx).text,
                      ].join(" ")}
                    >
                      {v}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
