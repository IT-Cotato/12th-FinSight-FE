// Zustand onboarding store
import { create } from 'zustand';

interface OnboardingState {
  step: number;
  showText: boolean;
  selectedInterests: string[];
  setStep: (step: number) => void;
  setShowText: (show: boolean) => void;
  toggleInterest: (interestId: string) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  // 초기 상태
  step: 1,
  showText: false,
  selectedInterests: [],
  
  // 액션
  setStep: (step) => set({ step }),
  setShowText: (show) => set({ showText: show }),
  toggleInterest: (interestId) =>
    set((state) => ({
      selectedInterests: state.selectedInterests.includes(interestId)
        ? state.selectedInterests.filter((id) => id !== interestId)
        : [...state.selectedInterests, interestId],
    })),
  resetOnboarding: () => set({ step: 1, showText: false, selectedInterests: [] }),
}));