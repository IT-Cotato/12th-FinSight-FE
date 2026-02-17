type Stat = { label: string; value: string };

type Props = {
  correctCount: number;
  score: number;
  totalScore: number;
  level: number;
};

export default function QuizResultStats({
  correctCount,
  score,
  totalScore,
  level,
}: Props) {
  const stats: Stat[] = [
    { label: "정답", value: `${correctCount}개` },
    { label: "점수", value: `${score}점` },
    { label: "총 점수", value: `${totalScore}점` },
    { label: "레벨", value: `${level}` },
  ];

  return (
    <div className="mt-8 grid grid-cols-4 text-center">
      {stats.map((s) => (
        <div key={s.label}>
          <p className="text-b2 text-gray-30">{s.label}</p>
          <p className="mt-1 text-h4 font-semibold text-gray-10">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
