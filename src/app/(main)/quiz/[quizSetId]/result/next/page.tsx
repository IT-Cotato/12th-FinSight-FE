"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

import NextActionCard from "@/components/quiz/NextActionCard";

export default function QuizNextActionPage() {
  const router = useRouter();
  const params = useParams<{ quizSetId: string }>();
  const quizSetId = Number(params.quizSetId);

  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-100">
      <div className="min-h-screen">
        <main className="px-6 pb-10 pt-14">
          {/* 캐릭터 */}
          <div className="mx-auto flex w-full max-w-[260px] justify-center">
            <Image
              src="/quiz/character-shopping.svg"
              alt=""
              width={170}
              height={170}
              className="h-[170px] w-[170px] object-contain"
              priority
            />
          </div>

          {/* 타이틀 */}
          <h1 className="mt-0 text-center text-h3 font-semibold text-primary-30">
            다음 할 일을 골라보세요!
          </h1>

          {/* 옵션 4개 */}
          <div className="flex flex-col items-center mt-8 space-y-4">
            <NextActionCard
              iconSrc="/quiz/icon-bookmark.svg"
              title="뉴스 저장하기"
              desc="방금 본 뉴스와 퀴즈를 보관해요."
              onClick={() => setSheetOpen(true)}
            />

            <NextActionCard
              iconSrc="/quiz/icon-word.svg"
              title="용어퀴즈로 계속하기"
              desc="퀴즈를 통해 용어를 이해해보세요."
              badgeText="최대 +50점"
              iconScale={1.4}
              onClick={() => {
                router.push("/quiz");
              }}
            />

            <NextActionCard
              iconSrc="/quiz/icon-book.svg"
              title="학습으로 이동하기"
              desc="다른 기사도 읽어보세요."
              iconScale={1.4}
              onClick={() => router.push("/study")}
            />

            <NextActionCard
              iconSrc="/quiz/icon-box.svg"
              title="보관함으로 이동하기"
              desc="저장한 항목들을 확인해보세요."
              onClick={() => router.push("/archive")}
            />
          </div>
        </main>

        {/* 바텀시트 추가 예정*/}
      </div>
    </div>
  );
}
