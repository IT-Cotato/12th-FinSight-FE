export type QuizType = "CONTENT" | "TERM";

export type QuizOption = {
  ai_quiz_set_id?: number;
  quiz_set_id?: number;
  quiz_type: QuizType;
  question_count: number;
};

export type QuizOptionsResponse =
  | {
      status: "QUIZ-001";
      message: string;
      data: { quizzes: QuizOption[] };
    }
  | {
      status: "QUIZ-002" | "QUIZ-003" | "COMMON-001";
      message: string;
      data?: undefined;
    };
