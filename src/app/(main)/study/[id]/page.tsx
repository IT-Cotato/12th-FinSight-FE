"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { NewCategoryBottomSheet } from "@/components/study/NewCategoryBottomSheet";
import { getNewsDetail, type NewsDetail } from "@/lib/api/news";

// Mock 데이터
const MOCK_NEWS_DETAIL: NewsDetail = {
  newsId: 12345,
  category: "FINANCE",
  title: '"비트코인, 지금이 마지막 탈출 기회일 수도"...섬뜩한 \'폭락\' 전망 나온 이유는',
  publishedAt: "2026.01.01. 오후 4:51",
  thumbnailUrl: "/study/thumbnail.png",
  url: "https://www.example.com/news/12345",
  isSaved: false,
  coreTerms: [
    { termId: 9001, term: "경제" },
    { termId: 9002, term: "핵심용어1" },
    { termId: 9003, term: "핵심용어2" },
  ],
  summary3Lines: "비트코인 가격이 9만 달러를 넘지 못하고 8만 달러 후반에서 횡보하고 있습니다.\n비트코인 회의론자는 금은 같은 실물자산이 더 나은 헤지 수단이라고 주장합니다.\n반면 일부 분석가는 과거 연말 조정 이후 반등 패턴과 거시환경을 근거로 연초 반등 가능성을 제기하고 있습니다.",
  summaryFull: "최근 비트코인 가격은 9만 달러를 돌파하지 못한 채 8만 달러 후반에서 뚜렷한 방향 없이 움직이고 있습니다.\n이 과정에서 대표적인 비트코인 회의론자인 일부 경제학자는 \"지금이 마지막 탈출 기회\"라며 보유 자산을 정리하라고 경고했습니다.\n그는 시장이 인플레이션과 경제 불안정에 대응하는 진정한 헤지 수단으로 금과 같은 귀금속을 다시 평가하고 있으며, 비트코인이 그 역할을 제대로 수행하지 못했다고 지적합니다. (중략)\n반면 다른 분석가들은 과거 연말에 조정을 겪은 뒤 연초에 반등한 사례와, 정부 부채·재정 적자 확대 같은 거시경제 요인을 근거로 비트코인이 다시 상승 흐름을 탈 가능성도 있다고 봅니다. (중략)",
  insight: "같은 비트코인 가격을 두고도 \"마지막 탈출 기회\"와 \"연초 반등 가능성\"이라는 정반대 해석이 동시에 나오는 이유는, 사람들이 보는 시간 축과 자산의 성격(헤지 vs 위험자산)에 대한 관점이 다르기 때문입니다.",
  highlights: [
    { termId: 9001, term: "헤지", startIndex: 120, endIndex: 122 },
    { termId: 9002, term: "변동성", startIndex: 210, endIndex: 213 },
  ],
};

type Category = {
  category_id: number;
  name: string;
  count?: number;
};

const ARCHIVE_CATEGORIES: Category[] = [
  { category_id: 0, name: "기본 폴더", count: 0 },
];

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;

  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaveBottomSheetOpen, setIsSaveBottomSheetOpen] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const data = await getNewsDetail(newsId);
        setNews(data.data);
      } catch (err) {
        // API 실패 시 mock 데이터 사용
        console.warn("API 호출 실패, mock 데이터 사용:", err);
        setNews(MOCK_NEWS_DETAIL);
        setError(null);
      } finally {
        setLoading(false);
      }
    }

    if (newsId) {
      fetchNews();
    }
  }, [newsId]);

  const handleBack = () => {
    router.back();
  };

  const handleBookmark = () => {
    setIsSaveBottomSheetOpen(true);
  };

  const handleSelectCategory = (categoryId: number | null) => {
    // TODO: 선택한 카테고리에 저장하는 API 호출
    console.log("카테고리 선택:", categoryId);
    // 저장 후 북마크 상태 업데이트
    if (news) {
      setNews({ ...news, isSaved: true });
    }
  };

  const handleAddNewCategory = () => {
    // TODO: 새 카테고리 추가 기능 구현
    console.log("새 카테고리 추가");
    setIsSaveBottomSheetOpen(false);
  };

  const handleViewOriginal = () => {
    if (news?.url) {
      window.open(news.url, "_blank");
    }
  };

  const handleSolveProblems = () => {
    // TODO: 문제 풀러가기 기능 구현
    console.log("문제 풀러가기");
  };

  // summary3Lines를 줄바꿈으로 분리
  const summaryLines = news?.summary3Lines
    ? news.summary3Lines.split("\n").filter((line) => line.trim())
    : [];

  if (loading) {
    return (
      <div className="flex flex-col min-h-full bg-bg-100">
        <Header
          title="뉴스 상세"
          leftSlot={
            <button onClick={handleBack} aria-label="뒤로가기">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          }
        />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="flex flex-col min-h-full bg-bg-100">
        <Header
          title="뉴스 상세"
          leftSlot={
            <button onClick={handleBack} aria-label="뒤로가기">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          }
        />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-400">뉴스를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-bg-100">
      <Header
        title=""
        leftSlot={
          <button onClick={handleBack} aria-label="뒤로가기">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        }
        rightSlot={
          <button onClick={handleBookmark} aria-label="북마크">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={news.isSaved ? "text-primary-30 fill-primary-30" : "text-white"}
            >
              <path
                d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17L5 21V5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={news.isSaved ? "currentColor" : "none"}
              />
            </svg>
          </button>
        }
      />

      <div className="flex-1 px-5">
          <div className="flex flex-col items-start gap-5">
            {/* 태그 */}
            {news.coreTerms && news.coreTerms.length > 0 && (
              <div className="flex items-center gap-[5px]">
                {news.coreTerms.map((coreTerm, index) => (
                  <span
                    key={coreTerm.termId || index}
                    className="flex items-center justify-center gap-[10px] px-[12px] py-[5px] rounded-[16px] border border-primary-70 bg-primary-80 text-b4 text-gray-20"
                  >
                    #{coreTerm.term}
                  </span>
                ))}
              </div>
            )}

            {/* 제목과 발행일시 */}
            <div className="flex flex-col items-start gap-[10px] self-stretch">
              <h1 className="text-h2">{news.title}</h1>
              <p className="text-b3 text-gray-40">{news.publishedAt}</p>
            </div>
          </div>

          {/* 일러스트 이미지 */}
          <div className="w-full flex justify-center mt-5 mb-5">
            <img
              src="/study/news_img.png"
              alt={news.title}
              className="max-w-full h-auto object-contain"
            />
          </div>

          {/* AI 핵심 요약 */}
          {news.summary3Lines && (
            <div className="gap-[10px]">
              <div className="inline-flex h-[25px] pt-[1px] justify-center items-center gap-[10px] mb-4">
                <img
                  src="/study/img-light.png"
                  alt="AI 핵심 요약"
                  className="h-full w-auto"
                  width={15}
                  height={24}
                />
                <h2 className="text-sh5 text-gray-20">AI 핵심 요약</h2>
              </div>
              <div className="flex flex-col items-start gap-[10px] px-5 py-6 rounded-[8px] bg-bg-80">
                {summaryLines.map((line, index) => (
                  <div key={index} className="flex items-start gap-2 text-b2 text-gray-20">
                    <span className="flex-shrink-0">•</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 본문 내용 */}
          {news.summaryFull && (
            <div className="flex flex-col items-center justify-center w-full px-5 py-6 mt-[25px] mb-[25px] gap-[10px] rounded-[8px] bg-bg-90">
              <div className="text-b2 text-gray-20">
                {news.summaryFull}
              </div>
            </div>
          )}

          {/* Q 핵심 인사이트 */}
          {news.insight && (
            <div className="gap-[10px]">
              <div className="inline-flex pt-[1px] justify-center items-center gap-[10px]">
                <img
                  src="/study/img-insight.png"
                  alt="핵심 인사이트"
                  className="h-full w-auto"
                  width={23}
                  height={26}
                />
                <h2 className="text-sh5 text-gray-20">핵심 인사이트</h2>
              </div>
              <div className="flex flex-col items-start gap-[10px] px-5 py-6 rounded-[8px] bg-bg-90">
                <p className="text-b2 text-gray-20">{news.insight}</p>
              </div>
            </div>
          )}

          {/* 하단 버튼들 */}
          <button
            onClick={handleViewOriginal}
            className="flex-1 w-full px-[10px] py-2 justify-center items-center gap-[10px] mt-5 mb-5 rounded-[8px] bg-bg-90 text-b2 text-gray-40"
          >
            원문 보러가기
          </button>
          <button
            onClick={handleSolveProblems}
            className="flex-1 w-full justify-center items-center px-4 py-[18px] rounded-[12px] bg-primary-50 text-b1 text-gray-10 text-center"
          >
            문제 풀러가기
          </button>
      </div>

      {/* 보관함 저장 바텀시트 */}
      <NewCategoryBottomSheet
        open={isSaveBottomSheetOpen}
        onOpenChange={setIsSaveBottomSheetOpen}
        categories={ARCHIVE_CATEGORIES}
        onSelectCategory={handleSelectCategory}
        onAddNewCategory={handleAddNewCategory}
      />
    </div>
  );
}

