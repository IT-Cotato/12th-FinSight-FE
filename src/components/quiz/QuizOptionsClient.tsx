"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import QuizOptionCard from "@/components/quiz/QuizOptionCard";

function toDescription(kind: "content" | "term") {
  return kind === "content"
    ? "퀴즈를 통해 내용을\n이해해보세요."
    : "퀴즈를 통해 용어를\n이해해보세요.";
}

export default function QuizOptionsPage() {
  const router = useRouter();
  const params = useParams<{ quizSetId: string }>();
  const quizSetId = params.quizSetId;

  const bonusText = "3문제 다 맞으면 보너스 +20점이 있어요!";

  if (!quizSetId) {
    return <div className="p-6">잘못된 접근입니다.</div>;
  }

  return (
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
            <Image src="/quiz/icon-back.svg" alt="" width={9} height={9} />
          </button>
        }
        rightSlot={
          <button
            type="button"
            onClick={() => router.push("/quiz/score-guide")}
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

        {/* 타이틀 */}
        <h1 className="mt-4 text-center text-h3 text-primary-30">
          어떤 퀴즈를 풀어볼까요?
        </h1>

        <p className="mt-2 text-center text-b3 text-gray-40">{bonusText}</p>

        {/* 옵션 카드 */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <QuizOptionCard
            title="내용 퀴즈"
            description={toDescription("content")}
            countText="총 3문제"
            iconSrc="/quiz/icon-content.svg"
            iconScale={1}
            onClick={() => router.push(`/quiz/${quizSetId}/play?type=content`)}
          />

          <QuizOptionCard
            title="용어 퀴즈"
            description={toDescription("term")}
            countText="총 3문제"
            iconSrc="/quiz/icon-word.svg"
            iconScale={2}
            onClick={() => router.push(`/quiz/${quizSetId}/play?type=term`)}
          />
        </div>
      </div>
    </div>
  );
}
