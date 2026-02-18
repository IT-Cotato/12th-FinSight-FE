import { Suspense } from "react";
import QuizOptionsClient from "@/components/quiz/QuizOptionsClient";

export default function QuizOptionsPage() {
  return (
    <Suspense fallback={<div className="p-6">로딩중...</div>}>
      <QuizOptionsClient />
    </Suspense>
  );
}
