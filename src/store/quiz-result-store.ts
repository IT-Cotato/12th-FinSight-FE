import { create } from "zustand";
import type { QuizSubmitResponse } from "@/types/quiz";

type QuizResultState = {
  lastSubmit: QuizSubmitResponse | null;
  setLastSubmit: (res: QuizSubmitResponse) => void;
  clearLastSubmit: () => void;
};

export const useQuizResultStore = create<QuizResultState>((set) => ({
  lastSubmit: null,
  setLastSubmit: (res) => set({ lastSubmit: res }),
  clearLastSubmit: () => set({ lastSubmit: null }),
}));
