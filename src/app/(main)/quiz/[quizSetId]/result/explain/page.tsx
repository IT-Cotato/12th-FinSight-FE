"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import QuizQuestionCard from "@/components/quiz/QuizQuestionCard";
import QuizExplainChoice from "@/components/quiz/QuizExplainChoice";
import { useQuizResultStore } from "@/store/quiz-result-store";
import {
  MOCK_QUESTIONS,
  MOCK_SUBMIT_RESULT,
  MOCK_CHOICE_EXPLAINS,
} from "@/lib/mock/quiz";
import { isQuizSubmitSuccess } from "@/types/quiz";

export default function QuizExplainPage() {
  const router = useRouter();
  const params = useParams<{ quizSetId: string }>();
  const searchParams = useSearchParams();

  const quizSetId = Number(params.quizSetId);
  const questionId = Number(searchParams.get("questionId"));

  const { lastSubmit } = useQuizResultStore();

  const submit = lastSubmit ?? MOCK_SUBMIT_RESULT;
  const data = isQuizSubmitSuccess(submit) ? submit.data : null;

  const { question, result, qNo } = useMemo(() => {
    const qIndex = MOCK_QUESTIONS.findIndex(
      (x) => x.question_id === questionId,
    );
    const q = qIndex >= 0 ? MOCK_QUESTIONS[qIndex] : null;
    const r = data?.results.find((x) => x.question_id === questionId) ?? null;
    return { question: q, result: r, qNo: qIndex >= 0 ? qIndex + 1 : 1 };
  }, [questionId, data]);

  // 에러 처리
  if (!question || !result) {
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

  const chosenNo = result.chosen_no;
  const correctNo = result.correct_no;
  const isUserCorrect = chosenNo === correctNo;

  const choiceExplains = MOCK_CHOICE_EXPLAINS[question.question_id] ?? [];

  return (
    <div className="min-h-screen bg-bg-100">
      <div className="min-h-screen">
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
          <QuizQuestionCard qNo={qNo} question={question.question_text} />

          {/* 보기 */}
          <div className="mt-8 space-y-4">
            {question.choices.map((c, idx) => {
              const no = idx + 1;

              let variant: "default" | "correct" | "wrongSelected" = "default";
              if (no === correctNo) variant = "correct";
              else if (!isUserCorrect && no === chosenNo)
                variant = "wrongSelected";

              return (
                <QuizExplainChoice
                  key={c.choice_id}
                  index={idx}
                  text={c.choice_text}
                  variant={variant}
                />
              );
            })}
          </div>

          {/* 정답 + 해설 */}
          <section className="mt-8 rounded-xl border border-primary-80 bg-transparent p-6">
            <p className="text-h4 font-semibold text-bg-10">
              정답: {correctNo}
            </p>

            <p className="mt-3 whitespace-pre-line text-b2 text-bg-20">
              {result.explanation}
            </p>

            {/* 해설 */}
            {choiceExplains.length > 0 && (
              <div className="mt-6 space-y-4">
                {choiceExplains.map((e, i) => (
                  <p key={i} className="text-b2 text-bg-30">
                    <span>
                      {`A${i + 1}. `}
                      <br />
                    </span>
                    {e}
                  </p>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
