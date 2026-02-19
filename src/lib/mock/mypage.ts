import type { MyPageViewData } from "@/types/mypage";
import type { CategoryItem, MyProfile } from "@/types/mypage";

export const MOCK_NO_RECORD: MyPageViewData = {
  profile: { nickname: "민성", currentLv: 1, nextLv: 2, percentLv: 50 },
  categories: [
    { section: "FINANCE", displayName: "금융" },
    { section: "STOCK", displayName: "증권" },
    { section: "GLOBAL", displayName: "글로벌 경제" },
  ],
  report: {
    weekStart: "2026-01-26",
    weekEnd: "2026-02-01",
    weeksAgo: 0,
    mode: "FINANCE",
    attendanceDays: 90,
    totalNewsSaved: 20,
    totalQuizSolved: 49,
    totalQuizReviewed: 0,
    weeklySummary: { newsSaved: 0, quizSolved: 0, quizReviewed: 0 },
    weeklyComparison: {
      currentWeek: { newsSaved: 0, quizSolved: 0, quizReviewed: 0 },
      previousWeek: { newsSaved: 0, quizSolved: 0, quizReviewed: 0 },
      change: {
        newsSavedChange: 0,
        quizSolvedChange: 0,
        quizReviewedChange: 0,
      },
    },
    categoryBalance: [
      {
        categoryName: "FINANCE",
        section: "FINANCE",
        count: 1,
        percentage: 100,
      },
    ],
    checklistStatus: [
      { dayOfWeek: "월", completionCount: 0 },
      { dayOfWeek: "화", completionCount: 1 },
      { dayOfWeek: "수", completionCount: 0 },
      { dayOfWeek: "목", completionCount: 0 },
      { dayOfWeek: "금", completionCount: 0 },
      { dayOfWeek: "토", completionCount: 0 },
      { dayOfWeek: "일", completionCount: 0 },
    ],
  },
  hasAnyRecord: false,
};

export const MOCK_HAS_RECORD: MyPageViewData = {
  ...MOCK_NO_RECORD,
  report: {
    ...MOCK_NO_RECORD.report,
    weeklySummary: { newsSaved: 12, quizSolved: 7, quizReviewed: 5 },
    weeklyComparison: {
      currentWeek: { newsSaved: 12, quizSolved: 5, quizReviewed: 85 },
      previousWeek: { newsSaved: 9, quizSolved: 6, quizReviewed: 85 },
      change: {
        newsSavedChange: 3,
        quizSolvedChange: -1,
        quizReviewedChange: 0,
      },
    },
    categoryBalance: [
      { categoryName: "FINANCE", section: "FINANCE", count: 4, percentage: 40 },
      { categoryName: "STOCK", section: "STOCK", count: 3, percentage: 30 },
      { categoryName: "ETC", section: "ETC", count: 3, percentage: 30 },
    ],
    checklistStatus: [
      { dayOfWeek: "월", completionCount: 0 },
      { dayOfWeek: "화", completionCount: 1 },
      { dayOfWeek: "수", completionCount: 2 },
      { dayOfWeek: "목", completionCount: 3 },
      { dayOfWeek: "금", completionCount: 4 },
      { dayOfWeek: "토", completionCount: 1 },
      { dayOfWeek: "일", completionCount: 1 },
    ],
  },
  hasAnyRecord: true,
};

export const MOCK_AUTH = {
  email: "jeongbam@example.com",
  currentPassword: "abc12345",
};

export const ALL_CATEGORIES_8: CategoryItem[] = [
  { section: "FINANCE", displayName: "금융" },
  { section: "STOCK", displayName: "증권" },
  { section: "GLOBAL", displayName: "글로벌 경제" },
  { section: "INDUSTRY", displayName: "산업/재계" },
  { section: "REAL_ESTATE", displayName: "부동산" },
  { section: "SME", displayName: "중기/벤처" },
  { section: "GENERAL", displayName: "경제 일반" },
  { section: "LIFE", displayName: "생활경제" },
];

export const MOCK_PROFILE: MyProfile = {
  nickname: "민성",
  currentLv: 1,
  nextLv: 2,
  percentLv: 50,
  categories: ["FINANCE", "STOCK", "GLOBAL"],
};

export const MOCK_TAKEN_NICKNAMES = new Set(["고민성", "민성", "admin"]);
