export type QuizType = "CONTENT" | "TERM";
export type QuizTypeParam = "content" | "term";

// 퀴즈 옵션 선택
// GET /api/quiz/{naverArticleId}
export type QuizView = {
  naverArticleId: number;
  quizType: QuizType;
  questions: Array<{
    questionIndex: number;
    question: string;
    options: string[];
    previousCorrect: boolean | null;
  }>;
};

// 퀴즈 제출
// POST /api/quiz/submit
export type QuizSubmitRequest = {
  naverArticleId: number;
  quizType: QuizTypeParam; // "content" | "term"
  answers: Array<{
    questionIndex: number; // 0-base
    selectedIndex: number; // 0-base
  }>;
};

// POST /api/quiz/submit의 response data
export type QuizSubmitResult = {
  correctCount: number;
  setScore: number;
  totalExp: number;
  level: number;
  results: Array<{
    questionIndex: number;
    correct: boolean;
    selectedIndex: number;
    answerIndex: number;
    question: string;
    options: string[];
    explanations: string[];
  }>;
};

// 퀴즈 제출
export type QuizSubmitResponse = {
  status: string;
  data: QuizSubmitResult;
};

export function isQuizSubmitResponse(x: unknown): x is QuizSubmitResponse {
  if (!x || typeof x !== "object") return false;
  return "status" in x && "data" in x;
}
