import { create } from 'zustand';

interface HomeState {
  // 알림 확인 여부 (캐릭터 흔들림 및 레드닷 제어)
  isGuideChecked: boolean;
  // 체크리스트 상태
  isNewsSaved: boolean;
  isQuizSolved: boolean;
  
  // Actions
  checkGuide: () => void;
  toggleNewsSaved: () => void;
  toggleQuizSolved: () => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  isGuideChecked: false,
  isNewsSaved: false,
  isQuizSolved: false,

  checkGuide: () => set({ isGuideChecked: true }),
  toggleNewsSaved: () => set((state) => ({ isNewsSaved: !state.isNewsSaved })),
  toggleQuizSolved: () => set((state) => ({ isQuizSolved: !state.isQuizSolved })),
}));