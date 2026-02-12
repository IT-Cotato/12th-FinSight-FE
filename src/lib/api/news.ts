// 뉴스 API 관련 함수들

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

export type NewsCategory =
  | "ALL"
  | "FINANCE"
  | "STOCK"
  | "INDUSTRY"
  | "SME"
  | "REAL_ESTATE"
  | "GLOBAL"
  | "LIVING"
  | "GENERAL";

export type NewsSort = "LATEST" | "POPULARITY";

export type CoreTerm = {
  termId: number;
  term: string;
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
  message: string;
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

export type Highlight = {
  termId: number;
  term: string;
  startIndex: number;
  endIndex: number;
};

export type NewsDetail = {
  newsId: number;
  category: string;
  title: string;
  publishedAt: string;
  thumbnailUrl: string;
  url: string;
  isSaved: boolean;
  coreTerms: CoreTerm[];
  summary3Lines: string;
  summaryFull: string;
  insight: string;
  highlights: Highlight[];
};

export type NewsDetailResponse = {
  status: string;
  message: string;
  data: NewsDetail;
};

/**
 * 뉴스 리스트 조회
 * @param params 쿼리 파라미터
 * @returns 뉴스 리스트 응답
 */
export async function getNewsList(
  params: NewsListParams = {},
): Promise<NewsListResponse> {
  const { category = "ALL", sort = "LATEST", size = 40, cursor } = params;

  const queryParams = new URLSearchParams({
    category,
    sort,
    size: size.toString(),
  });

  if (cursor) {
    queryParams.append("cursor", cursor);
  }

  const response = await fetch(
    `${API_BASE_URL}/news?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

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
export async function getNewsDetail(
  newsId: string,
): Promise<NewsDetailResponse> {
  const response = await fetch(`${API_BASE_URL}/news/${newsId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch news: ${response.statusText}`);
  }

  return response.json();
}
