"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import QuizQuestionCard from "@/components/quiz/QuizQuestionCard";
import QuizExplainChoice from "@/components/quiz/QuizExplainChoice";

import { useQuizResultStore } from "@/store/quiz-result-store";
import { QUIZ_SUBMIT_MOCK } from "@/lib/mock/quiz";
import type { QuizSubmitResponse } from "@/types/quiz";

export default function QuizExplainPage() {
  const router = useRouter();
  const params = useParams<{ quizSetId: string }>();
  const sp = useSearchParams();

  const quizSetId = Number(params.quizSetId);
  const questionIndex = Number(sp.get("questionIndex"));

  const { lastSubmit } = useQuizResultStore();
  const submit = (lastSubmit ?? QUIZ_SUBMIT_MOCK) as QuizSubmitResponse;
  const data = submit.data;

  const result = useMemo(() => {
    return data.results.find((r) => r.questionIndex === questionIndex) ?? null;
  }, [data.results, questionIndex]);

  // 에러 처리
  if (!result) {
    return (
      <div className="min-h-screen bg-bg-100 px-6 pt-16">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-b3 text-gray-20"
        >
          ← 뒤로
        </button>
        <p className="mt-6 text-b3 text-gray-20">
          해설 정보를 불러올 수 없어요.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-100">
      {/* 상단 헤더 */}
      <header className="relative px-6 pt-14">
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-4 top-12 p-4"
          aria-label="뒤로가기"
        >
          <Image src="/quiz/icon-back.svg" alt="" width={9} height={9} />
        </button>

        <p className="text-center text-h4 font-semibold text-primary-30">
          해설
        </p>
      </header>

      <main className="px-6 pb-28 pt-10">
        {/* 질문 카드 */}
        <QuizQuestionCard
          qNo={result.questionIndex + 1}
          question={result.question}
        />

        {/* 보기 */}
        <div className="mt-8 space-y-4">
          {result.options.map((opt, idx) => {
            let variant: "default" | "correct" | "wrongSelected" = "default";
            if (idx === result.answerIndex) variant = "correct";
            else if (!result.correct && idx === result.selectedIndex)
              variant = "wrongSelected";

            return (
              <QuizExplainChoice
                key={idx}
                index={idx}
                text={opt}
                variant={variant}
              />
            );
          })}
        </div>

        {/* 정답 + 해설 */}
        <section className="mt-8 rounded-xl border border-primary-80 bg-transparent p-6">
          <p className="text-h4 font-semibold text-bg-10">
            정답: {result.answerIndex + 1}
          </p>

          {/* 해설 */}
          {result.explanations?.length ? (
            <div className="mt-6 space-y-4">
              {result.explanations.map((e, i) => (
                <p key={i} className="text-b2 text-bg-30">
                  <span>{`A${i + 1}. `}</span>
                  {e}
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-b2 text-bg-20">
              해설 데이터가 아직 준비되지 않았어요.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
