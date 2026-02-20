import { create } from 'zustand';
import { apiClient } from '@/api/client';

interface OnboardingState {
  step: number;
  showText: boolean;
  nickname: string;
  selectedInterests: string[];
  
  setStep: (step: number) => void;
  setShowText: (show: boolean) => void;
  setNickname: (name: string) => void;
  toggleInterest: (interestId: string) => void;
  resetOnboarding: () => void;
  saveInterests: () => Promise<{ success: boolean; message?: string }>;
}

const INTEREST_MAP: Record<string, string> = {
  '금융': 'FINANCE',
  '부동산': 'REAL_ESTATE',
  '생활경제': 'LIVING',
  '증권': 'STOCK',
  '산업/재계': 'INDUSTRY',
  '중기/벤쳐': 'SME',
  '글로벌 경제': 'GLOBAL',
  '경제 일반': 'GENERAL',
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  step: 1,
  showText: false,
  nickname: '',
  selectedInterests: [],
  
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

  saveInterests: async () => { // 디버깅 위해 console.log 추가
    const { selectedInterests } = get();
    
    console.log('📤 저장할 관심분야:', selectedInterests);  // 추가
    
    if (selectedInterests.length < 3) {
      return { success: false, message: '최소 3개 이상의 관심분야를 선택해주세요.' };
    }

    try {
      const mappedSections = selectedInterests.map(name => INTEREST_MAP[name] || name);

      const payload = { sections: mappedSections };
      console.log('📤 전송 데이터:', payload);  // 추가
      console.log('📤 전송 URL:', apiClient.defaults.baseURL + '/users/categories');  // 추가
      
      const response = await apiClient.post('/users/categories', payload);
      console.log('✅ 저장 성공:', response.data);  // 추가
      
      return { success: true };
    } catch (error: any) {
      console.error("❌ 관심분야 저장 실패:");
      console.error("   상태 코드:", error.response?.status);  // 추가
      console.error("   에러 데이터:", error.response?.data);  // 추가
      console.error("   전체 에러:", error);
      
      return { 
        success: false, 
        message: error.response?.data?.message || '저장 중 오류가 발생했습니다.' 
      };
    }
  },
}));