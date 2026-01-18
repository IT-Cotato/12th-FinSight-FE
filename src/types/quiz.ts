export type QuizType = "CONTENT" | "TERM";

export type QuizOption = {
  ai_quiz_set_id?: number;
  quiz_set_id?: number;
  quiz_type: QuizType;
  question_count: number;
};

// 퀴즈 옵션 선택
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

// 퀴즈 문항 조회
export type QuizChoice = { choice_id: number; choice_text: string };

export type QuizQuestion = {
  question_id: number;
  question_text: string;
  choices: QuizChoice[];
};

export type QuizQuestionsResponse =
  | {
      status: "QUIZ-004";
      message: string;
      data: {
        quiz_set_id: number;
        quiz_type: QuizType;
        total_questions: number;
        questions: QuizQuestion[];
      };
    }
  | {
      status: "QUIZ_404_2" | "QUIZ_202_2" | "COMMON_001";
      message: string;
    };

// 퀴즈 제출
export type QuizSubmitBody = {
  quiz_set_id: number;
  answers: { question_id: number; chosen_choice_no: number }[];
};

export type QuizSubmitResponse =
  | {
      status: "QUIZ_200_4";
      message: string;
      data: {
        score: number;
        correct_count: number;
        total_count: number;
        level_info: {
          current_lv: number;
          next_lv: number;
          current_exp: number;
          total_exp: number;
        };
        results: {
          question_id: number;
          is_correct: "Y" | "N";
          chosen_no: number;
          correct_no: number;
          explanation: string;
        }[];
      };
    }
  | { status: string; message: string };
