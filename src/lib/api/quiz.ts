import { apiFetch, getClientToken } from "@/lib/api/fetcher";
import type {
  QuizSubmitRequest,
  QuizSubmitResponse,
  QuizSubmitResult,
  QuizType,
  QuizTypeParam,
  QuizView,
} from "@/types/quiz";

// GET /api/quiz/{naverArticleId}
export async function getQuizByArticleId(
  naverArticleId: number,
  type: QuizTypeParam = "content",
): Promise<QuizView> {
  const token = getClientToken();

  const res = await apiFetch<{
    status: string;
    data: {
      naverArticleId: number;
      quizType: string;
      questions: QuizView["questions"];
    };
  }>(`/api/quiz/${naverArticleId}?type=${type}`, {
    method: "GET",
    token,
    cache: "no-store",
  });

  // quizType 정규화
  const qt = String(res.data.quizType).toUpperCase();
  const quizType: QuizType = qt === "TERM" ? "TERM" : "CONTENT";

  return {
    naverArticleId: res.data.naverArticleId,
    quizType,
    questions: res.data.questions,
  };
}

// POST /api/quiz/submit
export async function submitQuiz(
  body: QuizSubmitRequest,
): Promise<QuizSubmitResponse> {
  const token = getClientToken();

  const res = await apiFetch<{
    status: string;
    data: any;
  }>(`/api/quiz/submit`, {
    method: "POST",
    token,
    body: JSON.stringify({
      naverArticleId: body.naverArticleId,
      quizType: body.quizType,
      answers: body.answers,
    }),
  });

  // 백엔드 응답 필드를 QuizSubmitResult 형태로 정규화해서 반환
  const d = res.data ?? {};
  const normalized: QuizSubmitResult = {
    correctCount: Number(d.correctCount ?? d.correct_count ?? 0),
    setScore: Number(d.setScore ?? d.score ?? 0),
    totalExp: Number(d.totalExp ?? d.totalExp ?? d.total_exp ?? 0),
    level: Number(d.level ?? d.level ?? 0),
    results: Array.isArray(d.results)
      ? d.results.map((r: any) => ({
          questionIndex: Number(r.questionIndex ?? r.question_index ?? 0),
          correct: Boolean(r.correct ?? r.isCorrect ?? r.is_correct === "Y"),
          selectedIndex: Number(
            r.selectedIndex ?? r.selected_index ?? r.selectedNo ?? 0,
          ),
          answerIndex: Number(
            r.answerIndex ?? r.answer_index ?? r.answerNo ?? 0,
          ),
          question: String(r.question ?? ""),
          options: Array.isArray(r.options) ? r.options.map(String) : [],
          explanations: Array.isArray(r.explanations)
            ? r.explanations.map(String)
            : [],
        }))
      : [],
  };

  return { status: res.status, data: normalized };
}
