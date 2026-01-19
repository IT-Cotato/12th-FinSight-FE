import type { QuizQuestion, QuizSubmitResponse } from "@/types/quiz";

export const MOCK_QUESTIONS: QuizQuestion[] = [
  {
    question_id: 1001,
    question_text:
      "기사에서 일부 경제학자가 비트코인 보유자에게 한 조언에 가장 가까운 것은 무엇인가요?",
    choices: [
      {
        choice_id: 4001,
        choice_text: "비트코인보다 수익률이 항상 낮기 때문에",
      },
      {
        choice_id: 4002,
        choice_text:
          "최근 사상 최고가를 기록하며 헤지 자산 역할을 다시 부각했기 때문에",
      },
      {
        choice_id: 4003,
        choice_text: "법정화폐를 대체할 새로운 결제 수단이므로",
      },
      {
        choice_id: 4004,
        choice_text: "비트코인 기술을 기반으로 만들어졌기 때문에",
      },
    ],
  },
  {
    question_id: 1002,
    question_text: "다음 중 본문 내용과 가장 관련이 깊은 설명은?",
    choices: [
      {
        choice_id: 4101,
        choice_text: "시장 변동성에 따라 투자 전략을 조정해야 한다",
      },
      { choice_id: 4102, choice_text: "단기 시세 예측은 항상 가능하다" },
      { choice_id: 4103, choice_text: "가격은 오로지 공급만으로 결정된다" },
      { choice_id: 4104, choice_text: "거시지표는 전혀 영향을 주지 않는다" },
    ],
  },
  {
    question_id: 1003,
    question_text:
      "법정화폐(Fiat Currency)에 대한 설명으로 가장 적절한 것은 무엇인가요?",
    choices: [
      {
        choice_id: 4201,
        choice_text: "특정 플랫폼에서만 사용되는 가상의 화폐",
      },
      {
        choice_id: 4202,
        choice_text:
          "국가(정부)의 법률에 의해 강제 통용력이 부여된, 실물 가치와 무관한 화폐",
      },
      {
        choice_id: 4203,
        choice_text:
          "컴퓨터 알고리즘에 의해 발행되며 중앙 관리 기관이 없는 디지털 자산",
      },
      {
        choice_id: 4204,
        choice_text: "금이나 은과 같은 실물 자산으로 교환이 보장되는 화폐",
      },
    ],
  },
];

export const MOCK_SUBMIT_RESULT: QuizSubmitResponse = {
  status: "QUIZ_200_4",
  message: "퀴즈 제출 및 채점 완료",
  data: {
    score: 40,
    correct_count: 2,
    total_count: 3,
    level_info: {
      current_lv: 3,
      next_lv: 4,
      current_exp: 380,
      total_exp: 420,
    },
    results: [
      {
        question_id: 1001,
        is_correct: "Y",
        chosen_no: 2,
        correct_no: 2,
        explanation:
          "기사에서 강조한 핵심은 ‘최근 흐름(사상 최고가/헤지 자산 역할)’을 근거로 판단하는 것입니다.",
      },
      {
        question_id: 1002,
        is_correct: "Y",
        chosen_no: 1,
        correct_no: 1,
        explanation:
          "본문의 맥락은 ‘변동성에 따라 전략을 조정’하는 쪽에 가깝습니다. 단정적 예측은 위험하다는 흐름이에요.",
      },
      {
        question_id: 1003,
        is_correct: "N",
        chosen_no: 4,
        correct_no: 2,
        explanation:
          "법정화폐는 정부의 법률로 강제 통용력이 부여된 화폐를 의미합니다(=법정 지급수단).",
      },
    ],
  },
};
