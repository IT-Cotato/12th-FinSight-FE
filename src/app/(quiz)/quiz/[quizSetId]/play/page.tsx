"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import QuizQuestionCard from "@/components/quiz/QuizQuestionCard";
import QuizChoiceButton from "@/components/quiz/QuizChoiceButton";
import QuizBottomNav from "@/components/quiz/QuizBottomNav";
import QuizExitDialog from "@/components/quiz/QuizExitDialog";

import { getQuizByArticleId, submitQuiz } from "@/lib/api/quiz";
import { QUIZ_SUBMIT_MOCK, QUIZ_VIEW_MOCK } from "@/lib/mock/quiz";
import { useQuizResultStore } from "@/store/quiz-result-store";
import type { QuizTypeParam, QuizView } from "@/types/quiz";

type LoadState =
  | { kind: "loading" }
  | { kind: "success"; quiz: QuizView }
  | { kind: "error"; message: string };

export default function QuizPlayPage() {
  const router = useRouter();
  const params = useParams<{ quizSetId: string }>();
  const sp = useSearchParams();

  const naverArticleId = Number(params.quizSetId);
  const type = (sp.get("type") ?? "content") as QuizTypeParam;

  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitOpen, setExitOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const { setLastSubmit } = useQuizResultStore();

  useEffect(() => {
    if (!Number.isFinite(naverArticleId) || naverArticleId <= 0) {
      setState({
        kind: "error",
        message: "올바르지 않은 기사 정보입니다.",
      });
      return;
    }

    let alive = true;

    (async () => {
      setState({ kind: "loading" });
      try {
        const quiz = await getQuizByArticleId(naverArticleId, type);
        if (!alive) return;
        setState({ kind: "success", quiz });
      } catch {
        if (!alive) return;
        setState({ kind: "success", quiz: QUIZ_VIEW_MOCK });
      }
    })();

    return () => {
      alive = false;
    };
  }, [naverArticleId, type]);

  const quiz = state.kind === "success" ? state.quiz : null;
  const total = quiz?.questions.length ?? 0;
  const current = quiz?.questions[currentIndex];

  const progressText = total > 0 ? `${currentIndex + 1}/${total}` : "0/0";
  const isLast = total > 0 && currentIndex === total - 1;

  const chosenIndex =
    current && answers[current.questionIndex] !== undefined
      ? answers[current.questionIndex]
      : undefined;

  const canNext = chosenIndex !== undefined;
  const canPrev = currentIndex > 0;

  function selectChoice(selectedIndex: number) {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: selectedIndex,
    }));
  }

  function goPrev() {
    if (!canPrev) return;
    setCurrentIndex((v) => v - 1);
  }

  async function goNext() {
    if (!current || !canNext || !quiz) return;

    if (!isLast) {
      setCurrentIndex((v) => v + 1);
      return;
    }

    try {
      const submitRes = await submitQuiz({
        naverArticleId,
        quizType: type,
        answers: quiz.questions.map((_, idx) => ({
          questionIndex: idx,
          selectedIndex: answers[idx] ?? 0,
        })),
      });

      // setLastSubmit(submitRes as any);
      setLastSubmit(submitRes);
      router.push(`/quiz/${naverArticleId}/result`);
    } catch {
      setLastSubmit(QUIZ_SUBMIT_MOCK);
      router.push(`/quiz/${naverArticleId}/result`);
    }
  }

  function exitQuiz() {
    router.push(`/quiz/${naverArticleId}`);
  }

  return (
    <div className="min-h-screen bg-bg-100">
      <header className="relative px-6 pt-16">
        <p className="text-center text-h4 font-semibold text-primary-30">
          {progressText}
        </p>

        <button
          type="button"
          onClick={() => setExitOpen(true)}
          className="absolute right-6 top-14 p-2"
          aria-label="퀴즈 종료"
        >
          <Image src="/quiz/icon-close.svg" alt="" width={24} height={24} />
        </button>
      </header>

      <main className="px-6 pb-28 pt-10">
        {state.kind === "loading" && (
          <p className="text-center text-b4 text-gray-50">불러오는 중...</p>
        )}

        {state.kind === "error" && (
          <div className="rounded-2xl border border-bg-70/60 bg-bg-90/40 p-5">
            <p className="text-b4 text-gray-20">{state.message}</p>
            <button
              type="button"
              onClick={() => router.push(`/quiz/${naverArticleId}`)}
              className="mt-4 w-full rounded-xl bg-primary-60 py-3 text-b3 font-semibold text-gray-20"
            >
              퀴즈 선택으로
            </button>
          </div>
        )}

        {state.kind === "success" && current && (
          <>
            <QuizQuestionCard
              qNo={currentIndex + 1}
              question={current.question}
            />

            <div className="mt-10 space-y-4">
              {current.options.map((opt, idx) => (
                <QuizChoiceButton
                  key={`${current.questionIndex}-${idx}`}
                  index={idx}
                  text={opt}
                  selected={chosenIndex === idx}
                  onSelect={() => selectChoice(idx)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <QuizBottomNav
        canPrev={canPrev}
        canNext={canNext}
        isLast={isLast}
        onPrev={goPrev}
        onNext={goNext}
      />

      <QuizExitDialog
        open={exitOpen}
        onOpenChange={setExitOpen}
        onExit={exitQuiz}
        onContinue={() => setExitOpen(false)}
      />
    </div>
  );
}
