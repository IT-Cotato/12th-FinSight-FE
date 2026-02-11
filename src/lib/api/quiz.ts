import type {
  QuizQuestionsResponse,
  QuizSubmitBody,
  QuizSubmitResponse,
  QuizOptionsResponse,
} from "@/types/quiz";

export async function getQuizOptions(
  articleId: string,
): Promise<QuizOptionsResponse> {
  const res = await fetch(`/api/v1/articles/${articleId}/quiz-options`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return (await res.json()) as QuizOptionsResponse;
}

export async function getQuizQuestions(
  quizSetId: number,
): Promise<QuizQuestionsResponse> {
  const res = await fetch(`/api/v1/quiz-sets/${quizSetId}/questions`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return (await res.json()) as QuizQuestionsResponse;
}

export async function submitQuiz(
  body: QuizSubmitBody,
): Promise<QuizSubmitResponse> {
  const res = await fetch(`/api/v1/quiz-results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await res.json()) as QuizSubmitResponse;
}
