import Image from "next/image";
import type { WeeklyReport } from "@/types/mypage";
import WeeklyBars from "./WeeklyBars";
import BalanceRings from "./BalanceRings";
import ChecklistRow from "./ChecklistRow";

type Props = {
  report: WeeklyReport;
  hasAnyRecord: boolean;

  // 주차별 이동 가능 여부
  canPrev: boolean;
  canNext: boolean;

  onPrev: () => void;
  onNext: () => void;
  onGoStudy: () => void;
};

const MODE_ICON: Record<string, string> = {
  STOCK: "/mypage/icon-stock.svg",
  INDUSTRY: "/mypage/icon-industry.svg",
  PROPERTY: "/mypage/icon-property.svg",
  VENTURE: "/mypage/icon-venture.svg",
  GLOBAL: "/mypage/icon-global.svg",
  ECONOMY: "/mypage/icon-economy.svg",
  LIFE: "/mypage/icon-life.svg",
  FINANCE: "/mypage/icon-finance.svg",
};

const MODE_LABEL: Record<string, string> = {
  STOCK: "증권 전문가",
  INDUSTRY: "산업/재계 전문가",
  PROPERTY: "부동산 전문가",
  VENTURE: "증기/벤처 전문가",
  GLOBAL: "글로벌 경제 전문가",
  ECONOMY: "경제 일반 전문가",
  LIFE: "생활경제 전문가",
  FINANCE: "금융 전문가",
};

function getWeekTitle(weekStart?: string) {
  if (!weekStart) return "이번 주 학습 리포트";

  const d = new Date(weekStart);
  // 월
  const month = d.getMonth() + 1;
  // 주차 계산
  const weekNo = Math.floor((d.getDate() - 1) / 7) + 1;

  return `${month}월 ${weekNo}주차 학습 리포트`;
}

export default function WeeklyReportCard({
  report,
  hasAnyRecord,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onGoStudy,
}: Props) {
  const title = getWeekTitle(report.weekStart);

  const modeKey = report.mode ?? "FINANCE";
  const modeIconSrc = MODE_ICON[modeKey] ?? "/mypage/icon-finance.svg";
  const modeLabel = MODE_LABEL[modeKey] ?? "금융 전문가";

  return (
    <section className="mt-6 px-5 pb-6">
      <div className="rounded-xl border border-primary-90 bg-primary-100 p-5">
        <div className="flex items-center justify-between">
          {/* 이전 주 */}
          <button
            type="button"
            onClick={canPrev ? onPrev : undefined}
            disabled={!canPrev}
            className="p-2 disabled:cursor-not-allowed"
            aria-label="이전 주"
          >
            <Image
              src={
                canPrev
                  ? "/mypage/icon-back.svg"
                  : "/mypage/icon-back-disabled.svg"
              }
              alt="prev"
              width={20}
              height={20}
            />
          </button>

          {/* 타이틀 */}
          <h3 className="text-h4 font-semibold text-gray-10">{title}</h3>

          {/* 다음 주 */}
          <button
            type="button"
            onClick={canNext ? onNext : undefined}
            disabled={!canNext}
            className="p-2 disabled:cursor-not-allowed"
            aria-label="다음 주"
          >
            <Image
              src={
                canNext
                  ? "/mypage/icon-next.svg"
                  : "/mypage/icon-next-disabled.svg"
              }
              alt="next"
              width={20}
              height={20}
            />
          </button>
        </div>

        {!hasAnyRecord ? (
          <div className="mt-10 flex flex-col items-center gap-6 pb-6">
            <p className="text-newshead text-bg-30">
              기록된 학습이 없어요.
              <br />
              학습을 시작해볼까요?
            </p>

            <button
              type="button"
              onClick={onGoStudy}
              className="flex h-[30px] items-center rounded-md bg-bg-70 px-2 text-b4 text-bg-20"
            >
              <Image
                src="/quiz/icon-book.svg"
                alt="book"
                width={30}
                height={30}
              />
              뉴스 읽으러 가기
            </button>
          </div>
        ) : (
          <div className="mt-6">
            {/* 분야별 아이콘 + 메세지 */}
            <div className="flex flex-col items-center">
              <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-black/10">
                <div className="relative h-[150px] w-[150px]">
                  <Image
                    src={modeIconSrc}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <p className="mt-2 text-b3">
                <span className="text-gray-40">이번 주는 </span>
                <span className="text-primary-30">{modeLabel}</span>
                <span className="text-gray-40"> 모드였네요!</span>
              </p>
            </div>

            {/* 주간 리포트 */}
            <div className="mt-6 rounded-xl border border-primary-90 bg-primary-100 py-4">
              <div className="grid grid-cols-[auto_1px_auto_1px_auto] items-center text-center">
                <div>
                  <p className="text-b3 text-gray-20">저장한 뉴스</p>
                  <p className="text-h5 font-semibold text-gray-20">
                    {report.weeklySummary.newsSaved}개
                  </p>
                </div>
                <div className="mx-auto h-10 w-px bg-bg-70" />
                <div>
                  <p className="text-b3 text-gray-20">퀴즈 풀이</p>
                  <p className="text-h5 font-semibold text-gray-20">
                    {report.weeklySummary.quizSolved}회
                  </p>
                </div>
                <div className="mx-auto h-10 w-px bg-bg-70" />
                <div>
                  <p className="text-b3 text-gray-20">퀴즈 복습</p>
                  <p className="text-h5 font-semibold text-gray-20">
                    {report.weeklySummary.quizReviewed}회
                  </p>
                </div>
              </div>
            </div>

            {/* 주간 그래프 */}
            <WeeklyBars comparison={report.weeklyComparison} />
            {/* 학습 밸런스 */}
            <BalanceRings items={report.categoryBalance} />
            {/* 일일 체크리스트 달성률 */}
            <ChecklistRow items={report.checklistStatus} />
          </div>
        )}
      </div>
    </section>
  );
}
