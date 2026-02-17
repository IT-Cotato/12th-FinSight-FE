import { create } from 'zustand';
import { apiClient } from '@/api/client';

interface OnboardingState {
  step: number;
  showText: boolean;
  nickname: string;
  selectedInterests: string[];
  
  // 액션
  setStep: (step: number) => void;
  setShowText: (show: boolean) => void;
  setNickname: (name: string) => void;
  toggleInterest: (interestId: string) => void;
  resetOnboarding: () => void;
  // 추가: 관심분야 저장 API 액션
  saveInterests: () => Promise<{ success: boolean; message?: string }>;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  // 초기 상태
  step: 1,
  showText: false,
  nickname: '',
  selectedInterests: [],
  
  // 액션
  setStep: (step) => set({ step }),
  setShowText: (show) => set({ showText: show }),
  setNickname: (name) => set({ nickname: name }),
  toggleInterest: (interestId) =>
    set((state) => ({
      selectedInterests: state.selectedInterests.includes(interestId)
        ? state.selectedInterests.filter((id) => id !== interestId)
        : [...state.selectedInterests, interestId],
    })),
  resetOnboarding: () => set({ 
    step: 1, 
    showText: false, 
    nickname: '', 
    selectedInterests: [] 
  }),

  saveInterests: async () => {
    const { selectedInterests } = get();
    
    // 최소 3개 선택
    if (selectedInterests.length < 3) {
      return { success: false, message: '최소 3개 이상의 관심분야를 선택해주세요.' };
    }

    try {
      await apiClient.post('/users/categories', {
        sections: selectedInterests,
      });
      return { success: true };
    } catch (error: any) {
      console.error("관심분야 저장 실패:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || '저장 중 오류가 발생했습니다.' 
      };
    }
  },
}));