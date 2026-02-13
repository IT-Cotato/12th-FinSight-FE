"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";

export default function ScoreGuidePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg-100">
      <div className="min-h-screen bg">
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
          rightSlot={<div className="w-10" />}
        />

        <main className="px-6 pb-14 pt-6">
          {/* 메인 타이틀 */}
          <h1 className="text-h2 text-gray-10">
            퀴즈 점수는
            <br />
            이렇게 계산돼요!
          </h1>

          {/* 섹션 1 */}
          <section className="mt-8">
            <h2 className="text-b1 text-gray-10">세트 점수 규칙</h2>

            <ul className="mt-4 list-disc pl-5 text-b1  text-gray-40">
              <li>
                한 문제당 10점, 3문제를 모두 맞히면 보너스 +20점
                <br />이 추가돼요.
              </li>
              <li>세트 하나의 최대 점수는 50점이에요.</li>
              <li>
                내용 퀴즈, 용어 퀴즈 모두 다 맞으면, 최대 100점
                <br />
                (50점 x 2)까지 얻을 수 있어요.
              </li>
            </ul>
          </section>

          {/* 섹션 2 */}
          <section className="mt-8">
            <h2 className="text-b1 text-gray-10">복습/레벨 규칙</h2>

            <ul className="mt-4 list-disc pl-5 text-b1  text-gray-40">
              <li>여러 번 반복해도 점수는 똑같이 계산돼 더해져요.</li>
              <li>모은 점수는 모두 레벨에 반영돼요.</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
