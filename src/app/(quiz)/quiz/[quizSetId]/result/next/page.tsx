"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

import { NewCategoryBottomSheet } from "@/components/study/NewCategoryBottomSheet";
import {
  saveNewsToStorage,
  getStorageFoldersByItemId,
} from "@/lib/api/storage";

import NextActionCard from "@/components/quiz/NextActionCard";

type Category = {
  category_id: number;
  name: string;
};

const ARCHIVE_CATEGORIES: Category[] = [{ category_id: 0, name: "기본 폴더" }];

export default function QuizNextActionPage() {
  const router = useRouter();
  const params = useParams<{ quizSetId: string }>();

  const newsId = params.quizSetId; // 뉴스 ID로 사용
  const quizSetId = Number(params.quizSetId);

  const [isSaved, setIsSaved] = useState(false);
  const [isSaveBottomSheetOpen, setIsSaveBottomSheetOpen] = useState(false);

  // 폴더 선택 시 저장
  const handleSelectCategory = async (categoryId: number | null) => {
    if (!newsId || categoryId === null) return;

    try {
      const articleId = parseInt(newsId, 10);

      await saveNewsToStorage(articleId, [categoryId]);

      const response = await getStorageFoldersByItemId(articleId, "NEWS");
      setIsSaved(response.data.length > 0);

      setIsSaveBottomSheetOpen(false);
    } catch (err) {
      console.error("저장 실패:", err);
      setIsSaveBottomSheetOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-100">
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
        <h1 className="text-center text-h3 font-semibold text-primary-30">
          다음 할 일을 골라보세요!
        </h1>

        {/* 옵션 */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          <NextActionCard
            iconSrc="/quiz/icon-bookmark.svg"
            title="뉴스 저장하기"
            desc="방금 본 뉴스와 퀴즈를 보관해요."
            onClick={() => setIsSaveBottomSheetOpen(true)}
          />

          <NextActionCard
            iconSrc="/quiz/icon-word.svg"
            title="다른 퀴즈로 계속하기"
            desc="퀴즈를 통해 내용을 이해해보세요."
            badgeText="최대 +50점"
            iconScale={1.4}
            onClick={() => router.push(`/quiz/${quizSetId}`)}
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

      {/* 보관함 저장 바텀시트 */}
      <NewCategoryBottomSheet
        open={isSaveBottomSheetOpen}
        onOpenChange={setIsSaveBottomSheetOpen}
        categories={ARCHIVE_CATEGORIES}
        onSelectCategory={handleSelectCategory}
        onAddNewCategory={() => {}}
        itemId={newsId ? parseInt(newsId, 10) : undefined}
      />
    </div>
  );
}
