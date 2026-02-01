export type ApiEnvelope<T> = {
  status: string | number;
  message?: string;
  data: T;
};

export type MyProfile = {
  nickname: string;
  currentLv: number;
  nextLv: number;
  percentLv: number;
  categories?: string[];
};

export type CategoryItem = {
  section: string;
  displayName: string;
};

export type WeeklyMode =
  | "STOCK"
  | "INDUSTRY"
  | "PROPERTY"
  | "VENTURE"
  | "GLOBAL"
  | "ECONOMY"
  | "LIFE"
  | "FINANCE";

export type WeeklyReport = {
  weekStart: string;
  weekEnd: string;
  weeksAgo: number;

  mode: WeeklyMode;

  attendanceDays: number;
  totalNewsSaved: number;
  totalQuizSolved: number;
  totalQuizReviewed: number;

  weeklySummary: {
    newsSaved: number;
    quizSolved: number;
    quizReviewed: number;
  };

  weeklyComparison: {
    currentWeek: {
      newsSaved: number;
      quizSolved: number;
      quizReviewed: number;
    };
    previousWeek: {
      newsSaved: number;
      quizSolved: number;
      quizReviewed: number;
    };
    change: {
      newsSavedChange: number;
      quizSolvedChange: number;
      quizReviewedChange: number;
    };
  };

  categoryBalance: Array<{
    categoryName: string;
    section: string;
    count: number;
    percentage: number;
  }>;

  checklistStatus: Array<{
    dayOfWeek: string;
    completionCount: number;
  }>;
};

export type MyPageViewData = {
  profile: MyProfile;
  categories: CategoryItem[];
  report: WeeklyReport;
  hasAnyRecord: boolean;
};
