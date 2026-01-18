"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { Header } from "@/components/common/Header";
import QuizOptionCard from "@/components/quiz/QuizOptionCard";
import { getQuizOptions } from "@/lib/api/quiz";
import type { QuizOption, QuizOptionsResponse, QuizType } from "@/types/quiz";

type LoadState =
  | { kind: "idle" | "loading" }
  | { kind: "success"; quizzes: QuizOption[] }
  | { kind: "error"; message: string; status?: QuizOptionsResponse["status"] };

// Mock 데이터
const MOCK_QUIZ_OPTIONS: QuizOption[] = [
  { quiz_set_id: 501, quiz_type: "CONTENT", question_count: 3 },
  { quiz_set_id: 502, quiz_type: "TERM", question_count: 3 },
];

function toLabel(type: QuizType) {
  return type === "CONTENT" ? "내용 퀴즈" : "용어 퀴즈";
}

function toDescription(type: QuizType) {
  return type === "CONTENT"
    ? "퀴즈를 통해 내용을\n이해해보세요."
    : "퀴즈를 통해 용어를\n이해해보세요.";
}

export default function QuizOptionsPage() {
  const router = useRouter();
  const params = useParams<{ articleId: string }>();
  const articleId = params.articleId;

  const [state, setState] = useState<LoadState>({ kind: "idle" });

  useEffect(() => {
    let alive = true;

    async function load() {
      setState({ kind: "loading" });

      try {
        const res = await getQuizOptions(articleId);
        if (!alive) return;
        if (res.status === "QUIZ-001") {
          setState({ kind: "success", quizzes: res.data.quizzes });
          return;
        }
        // 퀴즈 생성 중
        setState({ kind: "error", message: res.message, status: res.status });
      } catch {
        // API 실패 시 mock 폴백
        if (!alive) return;
        setState({ kind: "success", quizzes: MOCK_QUIZ_OPTIONS });
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [articleId]);

  const quizzes = useMemo(() => {
    if (state.kind !== "success") return [];
    return state.quizzes;
  }, [state]);

  const bonusText = useMemo(() => {
    return "3문제 다 맞으면 보너스 +20점이 있어요!";
  }, []);

  return (
    <div className="min-h-screen">
      <div className="min-h-screen">
        <Header
          title=""
          leftSlot={
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2"
              aria-label="뒤로가기"
            >
              <Image
                src="/quiz/icon-back.svg"
                alt=""
                width={9}
                height={9}
                priority
              />
            </button>
          }
          rightSlot={
            <button
              type="button"
              onClick={() =>
                router.push(`/articles/${articleId}/quiz/score-guide`)
              }
              className="flex items-center gap-2 px-2 py-1"
            >
              <span className="text-b4 text-gray-20">점수안내</span>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-20 text-b5 text-gray-20">
                i
              </span>
            </button>
          }
        />

        <div className="px-6 pb-10 pt-6">
          {/* 캐릭터 */}
          <div className="mx-auto mt-4 flex w-full max-w-[320px] justify-center">
            <div className="relative h-[240px] w-[240px]">
              <Image
                src="/quiz/character.png"
                alt=""
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* 타이틀/서브 */}
          <h1 className="mt-4 text-center text-h3 text-primary-30">
            어떤 퀴즈를 풀어볼까요?
          </h1>
          <p className="mt-2 text-center text-b3 text-gray-40">{bonusText}</p>

          {/* 상태 메시지 */}
          {state.kind === "loading" && (
            <p className="mt-6 text-center text-b4 text-gray-50">
              불러오는 중...
            </p>
          )}

          {state.kind === "error" && (
            <div className="mt-6 rounded-xl border border-bg-70/60 bg-bg-90/40 p-4">
              <p className="text-b4 text-gray-20">{state.message}</p>
              {state.status === "QUIZ-002" && (
                <p className="mt-1 text-b5 text-gray-50">
                  잠시 후 다시 시도해주세요.
                </p>
              )}
            </div>
          )}

          {/* 옵션 카드 */}
          <div className="grid grid-cols-2 gap-4">
            <QuizOptionCard
              title="내용 퀴즈"
              description={toDescription("CONTENT")}
              countText={`총 ${quizzes.find((q) => q.quiz_type === "CONTENT")?.question_count ?? 3}문제`}
              iconSrc="/quiz/icon-content.svg"
              iconScale={1}
              onClick={() => router.push(`/articles/${articleId}/quiz/content`)}
            />

            <QuizOptionCard
              title="용어 퀴즈"
              description={toDescription("TERM")}
              countText={`총 ${quizzes.find((q) => q.quiz_type === "TERM")?.question_count ?? 3}문제`}
              iconSrc="/quiz/icon-word.svg"
              iconScale={2}
              onClick={() => router.push(`/articles/${articleId}/quiz/term`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
