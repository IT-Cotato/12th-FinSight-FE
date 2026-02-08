// 뉴스 API 관련 함수들

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || null;

/**
 * 액세스 토큰을 가져옵니다.
 * TODO: 로그인 기능 완성 후 실제 토큰 관리 로직으로 교체 필요
 */
function getAccessToken(): string | null {
  // 환경변수에서 토큰 가져오기 (개발용)
  if (typeof window !== "undefined") {
    // 클라이언트 사이드: localStorage나 다른 저장소에서 가져올 수 있음
    // 일단 환경변수나 상수로 관리
    return (
      process.env.NEXT_PUBLIC_ACCESS_TOKEN ||
      // TODO: 임시 토큰 - 로그인 기능 완성 후 제거 필요
      null
    );
  }
  return process.env.ACCESS_TOKEN || null;
}

/**
 * API 요청을 위한 공통 헤더를 생성합니다.
 */
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export type NewsCategory =
  | "ALL"
  | "FINANCE"
  | "STOCK"
  | "INDUSTRY"
  | "VENTURE"
  | "REAL_ESTATE"
  | "GLOBAL"
  | "LIVING"
  | "GENERAL";

export type NewsSort = "LATEST" | "POPULARITY";

export type CoreTerm = {
  termId: number;
  term: string;
  description?: string;
};

export type NewsItem = {
  newsId: number;
  category: string;
  title: string;
  thumbnailUrl: string;
  coreTerms: CoreTerm[];
};

export type NewsListResponse = {
  status: string;
  message?: string;
  data: {
    category: string;
    sort: string;
    size: number;
    hasNext: boolean;
    nextCursor: string | null;
    news: NewsItem[];
  };
};

export type NewsListParams = {
  category?: NewsCategory;
  sort?: NewsSort;
  size?: number;
  cursor?: string;
};

export type Summary3Lines = {
  event: string;
  reason: string;
  impact: string;
};

export type Insight = {
  title: string;
  detail: string;
  whyItMatters: string;
};

export type NewsDetail = {
  category: string;
  coreTerms: CoreTerm[];
  title: string;
  date: string;
  thumbnailUrl: string;
  originalUrl: string;
  summary3Lines: Summary3Lines;
  bodySummary: string;
  insights: Insight[];
};

export type NewsDetailResponse = {
  status: string;
  data: NewsDetail;
};

/**
 * 뉴스 리스트 조회
 * @param params 쿼리 파라미터
 * @returns 뉴스 리스트 응답
 */
export async function getNewsList(params: NewsListParams = {}): Promise<NewsListResponse> {
  const { category = "ALL", sort = "LATEST", size = 40, cursor } = params;

  const queryParams = new URLSearchParams({
    category,
    sort,
    size: size.toString(),
  });

  if (cursor) {
    queryParams.append("cursor", cursor);
  }

  const response = await fetch(`${API_BASE_URL}/api/news?${queryParams.toString()}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch news list: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 뉴스 상세 정보 조회
 * @param newsId 뉴스 ID
 * @returns 뉴스 상세 정보 응답
 */
export async function getNewsDetail(newsId: string): Promise<NewsDetailResponse> {
  const response = await fetch(`${API_BASE_URL}/api/news/${newsId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch news: ${response.statusText}`);
  }

  return response.json();
}

export type NewsSearchParams = {
  q: string;
  category?: NewsCategory;
  sort?: NewsSort;
  page?: number;
};

export type NewsSearchResponse = {
  status: string;
  message?: string;
  data: {
    q: string;
    category: string;
    sort: string;
    page: number;
    totalPages: number;
    totalElements: number;
    news: NewsItem[];
  };
};

/**
 * 뉴스 검색
 * @param params 검색 파라미터
 * @returns 검색 결과 응답
 */
export async function searchNews(params: NewsSearchParams): Promise<NewsSearchResponse> {
  const { q, category = "ALL", sort = "LATEST", page = 1 } = params;

  const queryParams = new URLSearchParams({
    q,
    category,
    sort,
    page: page.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/api/news/search?${queryParams.toString()}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to search news: ${response.statusText}`);
  }

  return response.json();
}
