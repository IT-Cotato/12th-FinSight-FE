type Props = {
  comparison: {
    currentWeek: {
      newsSaved: number;
      quizSolved: number;
      quizReviewed: number;
    };
    previousWeek: {
      newsSaved: number;
      quizSolved: number;
      quizReviewed: number;
    };
    change: {
      newsSavedChange: number;
      quizSolvedChange: number;
      quizReviewedChange: number;
    };
  };
};

function BarPair({
  prev,
  curr,
  delta,
}: {
  prev: number;
  curr: number;
  delta: number;
}) {
  const max = Math.max(prev, curr, 1);
  const prevH = Math.round((prev / max) * 100);
  const currH = Math.round((curr / max) * 100);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-end gap-2">
        <div className="relative h-[90px] w-[30px] overflow-hidden rounded">
          <div
            className="absolute bottom-0 left-0 right-0 rounded bg-primary-30"
            style={{ height: `${prevH}%` }}
          />
          <span className="absolute bottom-1 w-full text-center text-xs text-primary-70">
            {prev}
          </span>
        </div>

        <div className="relative h-[90px] w-[30px] overflow-hidden rounded">
          <div
            className="absolute bottom-0 left-0 right-0 overflow-hidden rounded bg-primary-50"
            style={{ height: `${currH}%` }}
          />
          <span className="absolute bottom-1 w-full text-center text-xs text-primary-10">
            {curr}
          </span>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-40">
        {delta > 0 ? `▲ ${delta}` : delta < 0 ? `▼ ${Math.abs(delta)}` : "-"}
      </div>
    </div>
  );
}

export default function WeeklyBars({ comparison }: Props) {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 justify-items-center">
        <BarPair
          prev={comparison.previousWeek.newsSaved}
          curr={comparison.currentWeek.newsSaved}
          delta={comparison.change.newsSavedChange}
        />
        <BarPair
          prev={comparison.previousWeek.quizSolved}
          curr={comparison.currentWeek.quizSolved}
          delta={comparison.change.quizSolvedChange}
        />
        <BarPair
          prev={comparison.previousWeek.quizReviewed}
          curr={comparison.currentWeek.quizReviewed}
          delta={comparison.change.quizReviewedChange}
        />
      </div>
    </div>
  );
}
