"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import BonusToast from "@/components/quiz/BonusToast";
import QuizResultStats from "@/components/quiz/QuizResultStats";
import QuizResultItem from "@/components/quiz/QuizResultItem";

import { useQuizResultStore } from "@/store/quiz-result-store";
import { QUIZ_SUBMIT_MOCK } from "@/lib/mock/quiz";
import type { QuizSubmitResponse } from "@/types/quiz";

export default function QuizResultPage() {
  const router = useRouter();
  const params = useParams<{ quizSetId: string }>();
  const quizSetId = Number(params.quizSetId);

  const { lastSubmit } = useQuizResultStore();
  const submit = (lastSubmit ?? QUIZ_SUBMIT_MOCK) as QuizSubmitResponse;
  const data = submit.data;
  console.log("submit data:", data);

  // 보너스 토스트: 전부 맞으면 +20점
  const showBonusToast = data.correctCount === data.results.length;
  const bonusText = "보너스 +20점!";

  // 결과 리스트에 문제 텍스트 매핑
  const resultItems = useMemo(() => {
    return data.results.map((r, idx) => ({
      key: r.questionIndex,
      kind: r.correct ? ("correct" as const) : ("incorrect" as const),
      title: `Q${idx + 1}. ${r.question}`,
    }));
  }, [data.results]);

  return (
    <div className="min-h-screen bg-bg-100">
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
          {showBonusToast ? (
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
          correctCount={data.correctCount}
          score={data.setScore}
          totalScore={data.totalExp}
          level={data.level}
        />

        {/* 문항별 결과 */}
        <div className="mt-8 space-y-4">
          {resultItems.map((item) => (
            <QuizResultItem
              key={item.key}
              kind={item.kind}
              title={item.title}
              onClick={() => {
                router.push(
                  `/quiz/${quizSetId}/result/explain?questionIndex=${item.key}`,
                );
              }}
            />
          ))}
        </div>

        {/* 다음 버튼 */}
        <div className="mt-8">
          <button
            type="button"
            // 퀴즈 종료 화면으로 이동
            onClick={() => router.push(`/quiz/${quizSetId}/result/next`)}
            className="h-[60px] w-[350px] rounded-xl bg-primary-50 text-b1 text-gray-10"
          >
            다음
          </button>
        </div>
      </main>
    </div>
  );
}
