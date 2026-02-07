import { create } from 'zustand';

interface OnboardingState {
  step: number;
  showText: boolean;
  nickname: string; // 추가: 사용자 닉네임
  selectedInterests: string[];
  
  // 액션
  setStep: (step: number) => void;
  setShowText: (show: boolean) => void;
  setNickname: (name: string) => void; // 추가: 닉네임 설정 액션
  toggleInterest: (interestId: string) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  // 초기 상태
  step: 1,
  showText: false,
  nickname: '', // 초기값 빈 문자열
  selectedInterests: [],
  
  // 액션
  setStep: (step) => set({ step }),
  setShowText: (show) => set({ showText: show }),
  setNickname: (name) => set({ nickname: name }), // 닉네임 저장
  toggleInterest: (interestId) =>
    set((state) => ({
      selectedInterests: state.selectedInterests.includes(interestId)
        ? state.selectedInterests.filter((id) => id !== interestId)
        : [...state.selectedInterests, interestId],
    })),
  resetOnboarding: () => set({ 
    step: 1, 
    showText: false, 
    nickname: '', // 리셋 시 닉네임도 초기화
    selectedInterests: [] 
  }),
}));