"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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
  const naverArticleId = useMemo(() => {
    // querystring 우선
    const qs = Number(sp.get("naverArticleId"));
    if (Number.isFinite(qs) && qs > 0) return qs;

    // localStorage fallback
    if (typeof window !== "undefined") {
      const dev = Number(localStorage.getItem("dev_naverArticleId"));
      if (Number.isFinite(dev) && dev > 0) return dev;
    }

    // 최후 fallback
    return 247;
  }, [sp]);
  const type = (sp.get("type") ?? "content") as QuizTypeParam;

  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitOpen, setExitOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const { setLastSubmit } = useQuizResultStore();

  // 1. 퀴즈 조회
  useEffect(() => {
    let alive = true;

    (async () => {
      setState({ kind: "loading" });
      try {
        const quiz = await getQuizByArticleId(naverArticleId, type);
        if (!alive) return;
        setState({ kind: "success", quiz });
      } catch {
        if (!alive) return;
        // API 실패 시 mock fallback
        setState({ kind: "success", quiz: QUIZ_VIEW_MOCK });
      }
    })();

    return () => {
      alive = false;
    };
  }, [naverArticleId, type]);

  const quiz = state.kind === "success" ? state.quiz : null;
  const total = quiz?.questions.length ?? 3;
  const current = quiz?.questions[currentIndex];

  const progressText = `${Math.min(currentIndex + 1, total)}/${total}`;
  const isLast = currentIndex === total - 1;

  const chosenIndex = current ? answers[current.questionIndex] : undefined;
  const canNext = chosenIndex !== undefined;
  const canPrev = currentIndex > 0;

  function selectChoice(selectedIndex: number) {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.questionIndex]: selectedIndex }));
  }

  function goPrev() {
    if (!canPrev) return;
    setCurrentIndex((v) => v - 1);
  }

  // 2. 다음/제출
  async function goNext() {
    if (!current || !canNext || !quiz) return;

    if (!isLast) {
      setCurrentIndex((v) => v + 1);
      return;
    }

    try {
      const submitRes = await submitQuiz({
        naverArticleId: quiz.naverArticleId,
        quizType: type,
        answers: quiz.questions.map((q) => ({
          questionIndex: q.questionIndex,
          selectedIndex: answers[q.questionIndex] ?? 0,
        })),
      });

      setLastSubmit(submitRes as any);
      router.push(`/quiz/${naverArticleId}/result`);
    } catch {
      setLastSubmit(QUIZ_SUBMIT_MOCK as any);
      router.push(`/quiz/${naverArticleId}/result`);
    }
  }

  function exitQuiz() {
    router.push("/quiz");
  }

  return (
    <div className="min-h-screen bg-bg-100">
      {/* 상단 : 진행도 + close 버튼 */}
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
            <p className="mt-2 text-b5 text-gray-50">
              잠시 후 다시 시도해주세요.
            </p>
            <button
              type="button"
              onClick={() => router.push("/quiz")}
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
