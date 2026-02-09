"use client";

import { useEffect, useState } from "react";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { NewCategoryBottomSheet } from "@/components/study/NewCategoryBottomSheet";
import { TermDescriptionCard } from "@/components/study/TermDescriptionCard";
import { getNewsDetail, type NewsDetail, type CoreTerm } from "@/lib/api/news";

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

  const [news, setNews] = useState<NewsDetail | null>(null); // API로 받아온 뉴스 상세 데이터
  const [loading, setLoading] = useState(true); // API 호출 중 로딩 상태
  const [error, setError] = useState<string | null>(null); // API 호출 중 에러 상태
  const [isSaveBottomSheetOpen, setIsSaveBottomSheetOpen] = useState(false); // 보관함 저장 바텀시트 열림 상태
  const [isSaved, setIsSaved] = useState(false); // 북마크 상태 별도 관리
  const [selectedTerm, setSelectedTerm] = useState<CoreTerm | null>(null); // 선택된 단어 설명 표시용

  // API로 뉴스 상세 데이터 조회
  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const data = await getNewsDetail(newsId);
        setNews(data.data);
      } catch (err) {
        console.warn("API 호출 실패: ", err);
        setError(null);
      } finally {
        setLoading(false);
      }
    }
    // newsId가 있을 때만 API 호출
    if (newsId) {
      fetchNews();
    }
  }, [newsId]);

  // 뒤로가기 버튼 클릭 시 이전 페이지로 이동
  const handleBack = () => {
    router.back();
  };

  // 북마크 버튼 클릭 시 보관함 저장 바텀시트 열기
  const handleBookmark = () => {
    setIsSaveBottomSheetOpen(true);
  };

  // 기사 저장용 핸들러
  const handleSelectCategory = (categoryId: number | null) => {
    // TODO: 선택한 카테고리에 저장하는 API 호출
    console.log("카테고리 선택:", categoryId);
    // 저장 후 북마크 상태 업데이트 및 바텀시트 닫기
    setIsSaved(true);
    setIsSaveBottomSheetOpen(false);
  };


  const handleAddNewCategory = () => {
    // TODO: 새 카테고리 추가 기능 구현
    console.log("새 카테고리 추가");
    setIsSaveBottomSheetOpen(false);
  };

  const handleViewOriginal = () => {
    if (news?.originalUrl) {
      window.open(news.originalUrl, "_blank");
    }
  };

  const handleSolveProblems = () => {
    // TODO: 문제 풀러가기 기능 구현
    console.log("문제 풀러가기");
  };

  // 핵심 단어를 하이라이트하는 함수 (각 단어는 첫 번째 매칭만 하이라이트)
  const highlightCoreTerms = (text: string): React.ReactNode[] => {
    // 핵심 단어가 없거나 텍스트가 없으면 텍스트 그대로 반환
    if (!news?.coreTerms || news.coreTerms.length === 0 || !text) {
      return [text];
    }

    // 각 coreTerm별로 첫 번째 매칭만 찾기
    const matches: Array<{ start: number; end: number; coreTerm: CoreTerm; term: string }> = [];
    const usedTerms = new Set<string>();

    news.coreTerms.forEach((coreTerm) => {
      const term = coreTerm.term;
      if (usedTerms.has(term.toLowerCase())) return; // 이미 하이라이트된 단어는 스킵

      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedTerm, "gi");
      const match = regex.exec(text);

      if (match) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          coreTerm,
          term: match[0],
        });
        usedTerms.add(term.toLowerCase());
      }
    });

    // 겹치는 부분 제거 (긴 단어 우선) 후 인덱스 순서대로 정렬
    const sortedMatches = matches
      .sort((a, b) => b.end - b.start - (a.end - a.start)) // 긴 단어 우선
      .filter((match, index, arr) => {
        // 겹치지 않는 것만 선택
        return !arr.slice(0, index).some(
          (m) => !(match.end <= m.start || match.start >= m.end)
        );
      })
      .sort((a, b) => a.start - b.start); // 인덱스 순서대로 정렬

    // 텍스트를 하이라이트된 부분과 일반 부분으로 분리
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedMatches.forEach((match) => {
      if (lastIndex < match.start) {
        parts.push(text.substring(lastIndex, match.start));
      }
      parts.push(
        <span
          key={`${match.start}-${match.end}`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTerm(match.coreTerm);
          }}
          className="
          text-primary-30
          underline
          decoration-primary-30
          cursor-pointer"
        >
          {match.term}
        </span>
      );
      lastIndex = match.end;
    });

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  // summary3Lines를 배열로 변환 (event, reason, impact)
  const summaryLines = news?.summary3Lines
    ? [
        news.summary3Lines.event,
        news.summary3Lines.reason,
        news.summary3Lines.impact,
      ].filter((line) => line && line.trim())
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
              className={isSaved ? "text-primary-30 fill-primary-30" : "text-white"}
            >
              <path
                d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17L5 21V5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={isSaved ? "currentColor" : "none"}
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
              <h1 className="text-h2 text-gray-10">{news.title}</h1>
              <p className="text-b3 text-gray-40">{news.date}</p>
            </div>
          </div>

          {/* 썸네일 이미지 */}
          {news.thumbnailUrl && (
            <div className="w-full flex justify-center mt-5 mb-5">
              <img
                src={news.thumbnailUrl}
                alt={news.title}
                className="max-w-full h-auto object-contain rounded-lg"
              />
            </div>
          )}

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
          {news.bodySummary && (
            <div className="flex flex-col items-center justify-center w-full px-5 py-6 mt-[25px] mb-[25px] gap-[10px] rounded-[8px] bg-bg-90">
              <div className="text-b2 text-gray-20 whitespace-pre-line">
                {highlightCoreTerms(news.bodySummary)}
              </div>
            </div>
          )}

          {/* 핵심 인사이트 */}
          {news.insights && news.insights.length > 0 && (
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
              {news.insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start gap-[10px] px-5 py-6 rounded-[8px] bg-bg-90 mb-4"
                >
                  {insight.title && (
                    <h3 className="text-b1 text-gray-10 font-semibold">
                      {insight.title}
                    </h3>
                  )}
                  {insight.detail && (
                    <p className="text-b2 text-gray-20">{insight.detail}</p>
                  )}
                  {insight.whyItMatters && (
                    <p className="text-b3 text-gray-30">
                      <span className="font-semibold">왜 중요한가:</span>{" "}
                      {insight.whyItMatters}
                    </p>
                  )}
                </div>
              ))}
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

      {/* 단어 설명 카드 */}
      <TermDescriptionCard
        term={selectedTerm}
        onClose={() => setSelectedTerm(null)}
        onCategoryCreated={handleAddNewCategory}
      />
    </div>
  );
}

