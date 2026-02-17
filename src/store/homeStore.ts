import { create } from 'zustand';
import { apiClient } from '@/api/client';

export interface NewsTerm {
  termId: number;
  displayName: string;
}

export interface NewsItem {
  newsId: number;
  title: string;
  category: string;
  thumbnailUrl: string;
  terms?: NewsTerm[];
}

export const CATEGORY_MAP: Record<string, string> = {
  ALL: '종합',
  FINANCE: '금융',
  STOCK: '증권',
  INDUSTRY: '산업/재계',
  SME: '중기/벤처',
  REAL_ESTATE: '부동산',
  GLOBAL: '글로벌 경제',
  LIVING: '생활경제',
  GENERAL: '경제 일반'
};

interface Category {
  section: string;
  displayName: string;
}

interface HomeState {
  nickname: string;
  isGuideChecked: boolean;
  isGuideRead: boolean;
  guideMessage: string;
  isNewsSaved: boolean;
  isQuizSolved: boolean;
  isQuizReviewChecked: boolean;
  popularNews: NewsItem[];
  isLoadingNews: boolean;
  newsError: string | null;
  hasMoreNews: boolean;
  selectedCategory: string;
  curatedNews: NewsItem[];
  isCuratedLoading: boolean;
  curatedHasMore: boolean;
  nextCursor: string | null;
  userCategories: Category[];
  setNickname: (name: string) => void;
  fetchNickname: () => Promise<void>;
  fetchGuideData: () => Promise<void>;
  checkGuide: () => void;
  toggleNewsSaved: () => void;
  toggleQuizSolved: () => void;
  toggleQuizReview: () => void;
  setPopularNews: (news: NewsItem[]) => void;
  fetchPopularNews: () => Promise<void>;
  loadMoreNews: () => Promise<void>;
  setSelectedCategory: (category: string) => void;
  fetchCuratedNews: (isInitial?: boolean) => Promise<void>;
  fetchUserCategories: () => Promise<void>;
  fetchMissionStatus: () => Promise<void>;
}

export const useHomeStore = create<HomeState>((set, get) => ({
  nickname: '',
  isGuideChecked: false,
  isGuideRead: false,
  guideMessage: '',
  isNewsSaved: false,
  isQuizSolved: false,
  isQuizReviewChecked: false,
  popularNews: [],
  isLoadingNews: false,
  newsError: null,
  hasMoreNews: true,
  selectedCategory: 'ALL',
  curatedNews: [],
  isCuratedLoading: false,
  curatedHasMore: true,
  nextCursor: null,
  userCategories: [],

  setNickname: (name) => set({ nickname: name }),

  fetchNickname: async () => {
    try {
      const response = await apiClient.get('/mypage/me/profile');
      const serverNickname = response.data?.data?.nickname;
      if (serverNickname) {
        set({ nickname: serverNickname });
      }
    } catch (error) {
      console.error("닉네임 로드 실패:", error);
      set({ nickname: '사용자' });
    }
  },

  fetchUserCategories: async () => {
    try {
      const response = await apiClient.get('/users/categories');
      const categories = response.data?.data?.categories || [];
      set({ userCategories: categories });
    } catch (error) {
      console.error("관심분야 로드 실패:", error);
    }
  },

  fetchGuideData: async () => {
    try {
      // ✅ /api 중복 제거
      const response = await apiClient.get('/home/status');
      const message = response.data?.data?.message;
      if (message) {
        set({ guideMessage: message });
      }
    } catch (error) {
      console.error("가이드 문구 로드 실패:", error);
      set({ guideMessage: "오늘의 금융 지식을 확인해보세요!" });
    }
  },

  checkGuide: () => {
    const { isGuideChecked } = get();
    set({
      isGuideChecked: !isGuideChecked,
      isGuideRead: true
    });
  },

  fetchMissionStatus: async () => {
    try {
      const response = await apiClient.get('/home/checklist');
      const serverData = response.data?.data;
      if (serverData) {
        set({
          isNewsSaved: serverData.isNewsSaved,
          isQuizSolved: serverData.isQuizSolved,
          isQuizReviewChecked: serverData.isQuizReviewed
        });
      }
    } catch (error) {
      console.error("일일 미션 상태 조회 실패:", error);
    }
  },

  toggleNewsSaved: () => set((state) => ({ isNewsSaved: !state.isNewsSaved })),
  toggleQuizSolved: () => set((state) => ({ isQuizSolved: !state.isQuizSolved })),
  toggleQuizReview: () => set((state) => ({ isQuizReviewChecked: !state.isQuizReviewChecked })),

  setPopularNews: (news) => set({ popularNews: news }),

  fetchPopularNews: async () => {
    set({ isLoadingNews: true, newsError: null });
    try {
      const response = await apiClient.get('/home/news/popular');
      const serverData = response.data?.data;
      const newsList = serverData?.news || [];
      set({
        popularNews: newsList,
        isLoadingNews: false,
        hasMoreNews: serverData?.hasNext ?? (newsList.length > 0)
      });
    } catch (error: any) {
      console.error("인기 뉴스 호출 실패:", error);
      set({ popularNews: MOCK_NEWS, isLoadingNews: false, newsError: error.message });
    }
  },

  loadMoreNews: async () => {
    const { popularNews, isLoadingNews, hasMoreNews } = get();
    if (isLoadingNews || !hasMoreNews) return;
    set({ isLoadingNews: true });
    try {
      const response = await apiClient.get('/home/news/popular', {
        params: {
          offset: popularNews.length,
          limit: 10
        }
      });
      const serverData = response.data?.data;
      const newData = serverData?.news || [];
      set({
        popularNews: [...popularNews, ...newData],
        isLoadingNews: false,
        hasMoreNews: serverData?.hasNext ?? (newData.length >= 10)
      });
    } catch (error) {
      set({ isLoadingNews: false });
    }
  },

  setSelectedCategory: (category) => {
    set({
      selectedCategory: category,
      curatedNews: [],
      nextCursor: null,
      curatedHasMore: true
    });
    get().fetchCuratedNews(true);
  },

  fetchCuratedNews: async (isInitial = false) => {
    const { selectedCategory, nextCursor, curatedNews, isCuratedLoading, curatedHasMore } = get();
    if (isCuratedLoading || (!isInitial && !curatedHasMore)) return;
    set({ isCuratedLoading: true });
    try {
      const response = await apiClient.get('/home/news/personalized', {
        params: {
          category: selectedCategory === 'ALL' ? undefined : selectedCategory,
          cursor: isInitial ? null : nextCursor,
          limit: 40
        }
      });
      const serverData = response.data?.data;
      const newsList = serverData?.news || [];
      set({
        curatedNews: isInitial ? newsList : [...curatedNews, ...newsList],
        nextCursor: serverData?.nextCursor || null,
        curatedHasMore: serverData?.hasNext ?? false,
        isCuratedLoading: false
      });
    } catch (error) {
      console.error("맞춤 뉴스 호출 실패:", error);
      set({ isCuratedLoading: false });
    }
  }
}));

const MOCK_NEWS: NewsItem[] = [
  { newsId: 1, title: "삼성전자, AI 반도체 HBM3E 양산 가속화… 점유율 확대 노린다", category: "반도체", thumbnailUrl: "/home/mockData.svg" },
  { newsId: 2, title: "삼성전자 영업익 20조 달성, 반도체 부문 흑자 전환 성공", category: "증권", thumbnailUrl: "/home/mockData.svg" },
  { newsId: 3, title: "삼성 갤S26 조기 출시설… AI 기능 대폭 강화될 듯", category: "IT", thumbnailUrl: "/home/mockData.svg" },
  { newsId: 4, title: "삼성전자, 용인 반도체 클러스터에 300조 추가 투자 결정", category: "산업", thumbnailUrl: "/home/mockData.svg" },
  { newsId: 5, title: "삼성전자 주가 8만전자 안착하나… 외인 매수세 지속", category: "증권", thumbnailUrl: "/home/mockData.svg" },
  { newsId: 6, title: "삼성전자, 글로벌 TV 시장 18년 연속 1위 수성", category: "가전", thumbnailUrl: "/home/mockData.svg" },
];