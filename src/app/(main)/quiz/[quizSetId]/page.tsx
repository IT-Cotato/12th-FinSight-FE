"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import QuizQuestionCard from "@/components/quiz/QuizQuestionCard";
import QuizChoiceButton from "@/components/quiz/QuizChoiceButton";
import QuizBottomNav from "@/components/quiz/QuizBottomNav";
import QuizExitDialog from "@/components/quiz/QuizExitDialog";
import { getQuizQuestions, submitQuiz } from "@/lib/api/quiz";
import type {
  QuizQuestion,
  QuizQuestionsResponse,
  QuizSubmitBody,
} from "@/types/quiz";

type LoadState =
  | { kind: "loading" }
  | { kind: "success"; quizSetId: number; questions: QuizQuestion[] }
  | {
      kind: "error";
      message: string;
      status?: QuizQuestionsResponse["status"];
    };

const MOCK_QUESTIONS: QuizQuestion[] = [
  {
    question_id: 1001,
    question_text:
      "기사에서 일부 경제학자가 비트코인 보유자에게 한 조언에 가장 가까운 것은 무엇인가요?",
    choices: [
      {
        choice_id: 4001,
        choice_text: "비트코인보다 수익률이 항상 낮기 때문에",
      },
      {
        choice_id: 4002,
        choice_text:
          "최근 사상 최고가를 기록하며 헤지 자산 역할을 다시 부각했기 때문에",
      },
      {
        choice_id: 4003,
        choice_text: "법정화폐를 대체할 새로운 결제 수단이므로",
      },
      {
        choice_id: 4004,
        choice_text: "비트코인 기술을 기반으로 만들어졌기 때문에",
      },
    ],
  },
  {
    question_id: 1002,
    question_text: "다음 중 본문 내용과 가장 관련이 깊은 설명은?",
    choices: [
      {
        choice_id: 4101,
        choice_text: "시장 변동성에 따라 투자 전략을 조정해야 한다",
      },
      { choice_id: 4102, choice_text: "단기 시세 예측은 항상 가능하다" },
      { choice_id: 4103, choice_text: "가격은 오로지 공급만으로 결정된다" },
      { choice_id: 4104, choice_text: "거시지표는 전혀 영향을 주지 않는다" },
    ],
  },
  {
    question_id: 1003,
    question_text:
      "법정화폐(Fiat Currency)에 대한 설명으로 가장 적절한 것은 무엇인가요?",
    choices: [
      {
        choice_id: 4201,
        choice_text: "특정 플랫폼에서만 사용되는 가상의 화폐",
      },
      {
        choice_id: 4202,
        choice_text:
          "국가(정부)의 법률에 의해 강제 통용력이 부여된, 실물 가치와 무관한 화폐",
      },
      {
        choice_id: 4203,
        choice_text:
          "컴퓨터 알고리즘에 의해 발행되며 중앙 관리 기관이 없는 디지털 자산",
      },
      {
        choice_id: 4204,
        choice_text: "금이나 은과 같은 실물 자산으로 교환이 보장되는 화폐",
      },
    ],
  },
];

export default function QuizPlayPage() {
  const router = useRouter();
  const params = useParams<{ quizSetId: string }>();
  const quizSetId = Number(params.quizSetId);

  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [exitOpen, setExitOpen] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      setState({ kind: "loading" });

      try {
        const res = await getQuizQuestions(quizSetId);
        if (!alive) return;

        if (res.status === "QUIZ-004") {
          setState({
            kind: "success",
            quizSetId: res.data.quiz_set_id,
            questions: res.data.questions,
          });
          return;
        }
        setState({ kind: "error", message: res.message, status: res.status });
      } catch {
        if (!alive) return;
        setState({ kind: "success", quizSetId, questions: MOCK_QUESTIONS });
      }
    }

    if (Number.isFinite(quizSetId)) load();
    return () => {
      alive = false;
    };
  }, [quizSetId]);

  const questions = useMemo(
    () => (state.kind === "success" ? state.questions : []),
    [state],
  );
  const total = questions.length || 3;
  const current = questions[currentIndex];

  const progressText = `${Math.min(currentIndex + 1, total)}/${total}`;
  const isLast = currentIndex === total - 1;

  const chosen = current ? answers[current.question_id] : undefined;
  const canNext = Boolean(chosen);
  const canPrev = currentIndex > 0;

  function selectChoice(choiceNo: number) {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.question_id]: choiceNo }));
  }

  function goPrev() {
    if (!canPrev) return;
    setCurrentIndex((v) => v - 1);
  }

  async function goNext() {
    if (!current || !canNext) return;

    if (!isLast) {
      setCurrentIndex((v) => v + 1);
      return;
    }

    const body: QuizSubmitBody = {
      quiz_set_id: quizSetId,
      answers: questions.map((q) => ({
        question_id: q.question_id,
        chosen_choice_no: answers[q.question_id] ?? 0,
      })),
    };

    try {
      await submitQuiz(body);
      // router.push(`/quiz/${quizSetId}/result`);
      router.push("/quiz");
    } catch {
      router.push("/quiz");
    }
  }

  function exitQuiz() {
    router.push("/quiz");
  }

  return (
    <div className="min-h-screen bg-bg-100">
      <div className="min-h-screen">
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
                question={current.question_text}
              />

              <div className="mt-10 space-y-4">
                {current.choices.map((c, idx) => (
                  <QuizChoiceButton
                    key={c.choice_id}
                    index={idx}
                    text={c.choice_text}
                    selected={chosen === idx + 1}
                    onSelect={() => selectChoice(idx + 1)}
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
    </div>
  );
}
