import type { QuizOptionsResponse } from "@/types/quiz";

export async function getQuizOptions(
  articleId: string,
): Promise<QuizOptionsResponse> {
  // 실제 호출은 추후 연결 예정
  const res = await fetch(`/api/v1/articles/${articleId}/quiz-options`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const json = (await res.json()) as QuizOptionsResponse;
  return json;
}
