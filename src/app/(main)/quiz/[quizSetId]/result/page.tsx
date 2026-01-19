"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import BonusToast from "@/components/quiz/BonusToast";
import QuizResultStats from "@/components/quiz/QuizResultStats";
import QuizResultItem from "@/components/quiz/QuizResultItem";
import { MOCK_QUESTIONS, MOCK_SUBMIT_RESULT } from "@/lib/mock/quiz";
import type { QuizSubmitResponse } from "@/types/quiz";
import { isQuizSubmitSuccess } from "@/types/quiz";
import { useQuizResultStore } from "@/store/quiz-result-store";

export default function QuizResultPage() {
  const router = useRouter();
  const params = useParams<{ quizSetId: string }>();
  const quizSetId = Number(params.quizSetId);

  // 현재 : mock 데이터
  // 추후 : submit 응답을 전역(Zustand)으로 넘겨서 여기서 렌더 예정
  const { lastSubmit } = useQuizResultStore();
  const submit: QuizSubmitResponse = lastSubmit ?? MOCK_SUBMIT_RESULT;

  const data = isQuizSubmitSuccess(submit) ? submit.data : null;

  const totalScore = data?.level_info.total_exp ?? 420;
  const level = data?.level_info.current_lv ?? 3;

  // 보너스 토스트: 전부 맞으면 +20점(현재 룰)
  const showBonusToast = Boolean(
    data && data.correct_count === data.total_count,
  );
  const bonusText = "보너스 +20점!";

  // 결과 리스트에 문제 텍스트 매핑
  const resultItems = useMemo(() => {
    if (!data) return [];

    return data.results.map((r, idx) => {
      const qText =
        MOCK_QUESTIONS.find((q) => q.question_id === r.question_id)
          ?.question_text ?? "문제 정보를 불러올 수 없어요.";

      return {
        key: r.question_id,
        kind:
          r.is_correct === "Y" ? ("correct" as const) : ("incorrect" as const),
        title: `Q${idx + 1}. ${qText}`,
      };
    });
  }, [data]);

  return (
    <div className="min-h-screen bg-bg-100">
      <div className="min-h-screen">
        {/* 토스트 */}
        <BonusToast show={showBonusToast} bonusText={bonusText} />

        <main className="px-6 pb-28 pt-12">
          {/* 상단 문구 */}
          <h1 className="text-center text-h4 font-semibold text-primary-30">
            퀴즈 완료!
          </h1>

          {/* 캐릭터 */}
          <div className="mx-auto mt-4 flex h-[250px] w-[230px] justify-center">
            <Image
              src="/quiz/character-money.svg"
              alt=""
              width={230}
              height={250}
              className="h-[250px] w-[230px] object-contain"
              priority
            />
          </div>

          {/* 서브 문구 */}
          <p className="mt-3 text-center text-b2 text-gray-20">
            {data && data.correct_count === data.total_count ? (
              <>
                이해가 완벽해요.
                <br />
                다음 뉴스로 넘어가 볼까요?
              </>
            ) : (
              <>
                거의 다 왔어요!
                <br />
                헷갈렸던 문제만 해설로 확인해볼까요?
              </>
            )}
          </p>

          {/* 통계 */}
          <QuizResultStats
            correctCount={data?.correct_count ?? 2}
            score={data?.score ?? 20}
            totalScore={totalScore}
            level={level}
          />

          {/* 문항별 결과 */}
          <div className="mt-8 space-y-4">
            {resultItems.map((item) => (
              <QuizResultItem
                key={item.key}
                kind={item.kind}
                title={item.title}
                onClick={() => {
                  // 다음 단계(해설 화면)에서 사용할 라우트
                  router.push(
                    `/quiz/${quizSetId}/result/explain?questionId=${item.key}`,
                  );
                }}
              />
            ))}
          </div>

          {/* 다음 버튼 */}
          <div className="mt-8">
            <button
              type="button"
              onClick={() => {
                // 퀴즈 종료(추후 구현) 화면으로 이동
                router.push("/quiz");
              }}
              className="
                h-[60px] w-[350px] rounded-xl bg-primary-50
                text-b1 text-gray-10
              "
            >
              다음
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
