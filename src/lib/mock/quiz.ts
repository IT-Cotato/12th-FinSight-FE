import type { QuizSubmitResponse, QuizView } from "@/types/quiz";

export const QUIZ_VIEW_MOCK: QuizView = {
  naverArticleId: 247,
  quizType: "CONTENT",
  questions: [
    {
      questionIndex: 0,
      question: "한국의 고령화 속도는 어떤 수준인가요?",
      options: [
        "세계 최고 수준이다.",
        "상대적으로 낮은 편이다.",
        "중간 정도이다.",
        "아주 느린 편이다.",
      ],
      previousCorrect: null,
    },
    {
      questionIndex: 1,
      question: "정부가 추진하는 '제조 AI 전환' 전략의 목적은 무엇인가요?",
      options: [
        "제조업의 경쟁력 강화를 위해서다.",
        "소비자 수요를 줄이기 위해서다.",
        "수출을 감소시키기 위해서다.",
        "인구 감소를 해결하기 위해서다.",
      ],
      previousCorrect: null,
    },
    {
      questionIndex: 2,
      question: "한국의 올해 실질 GDP 성장률은 어떻게 예상되나요?",
      options: [
        "약 2%로 예상된다.",
        "약 5%로 예상된다.",
        "약 3%로 예상된다.",
        "약 1%로 예상된다.",
      ],
      previousCorrect: null,
    },
  ],
};

export const QUIZ_SUBMIT_MOCK: QuizSubmitResponse = {
  status: "OK",
  data: {
    correctCount: 2,
    setScore: 80,
    totalExp: 120,
    level: 3,
    results: [
      {
        questionIndex: 0,
        correct: true,
        selectedIndex: 0,
        answerIndex: 0,
        question: QUIZ_VIEW_MOCK.questions[0].question,
        options: QUIZ_VIEW_MOCK.questions[0].options,
        explanations: [
          "정답 선택지입니다.",
          "기사의 맥락과 거리가 있어요.",
          "기사 근거가 부족해요.",
          "기사 흐름과 어긋나요.",
        ],
      },
      {
        questionIndex: 1,
        correct: true,
        selectedIndex: 0,
        answerIndex: 0,
        question: QUIZ_VIEW_MOCK.questions[1].question,
        options: QUIZ_VIEW_MOCK.questions[1].options,
        explanations: [
          "정책 목적과 일치합니다.",
          "정책 방향과 반대예요.",
          "근거가 부족해요.",
          "정책 목적이 아닙니다.",
        ],
      },
      {
        questionIndex: 2,
        correct: false,
        selectedIndex: 3,
        answerIndex: 0,
        question: QUIZ_VIEW_MOCK.questions[2].question,
        options: QUIZ_VIEW_MOCK.questions[2].options,
        explanations: [
          "기사에서 제시한 수치 흐름과 맞습니다.",
          "기사 근거와 거리가 있어요.",
          "가능성이 낮습니다.",
          "기사의 방향성과 달라요.",
        ],
      },
    ],
  },
};
