"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/common/Header";
import { useRouter } from "next/navigation";


{/* 뒤로가기 버튼 */}
function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="뒤로가기"
      className="flex items-center justify-center"
    >
      <Image
        src="/study/icon-back.svg"
        alt="뒤로가기"
        width={9}
        height={16}
      />
    </button>
  );
}

{/* 검색 기본 화면 */}
  function SearchEmptyView() {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-[15px]">
        <Image
          src="/study/img-search.svg"
          alt="검색 기본 화면"
          width={219}
          height={155}
        />
        <p className="text-b1 text-bg-30">키워드와 내용을 검색해보세요</p>
      </div>
    );
  }

  {/* 검색 결과 없음 화면 */}
  function SearchNoResult() {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-[15px]">
        <Image
          src="/study/img-sweat.svg"
          alt="검색 결과 없음"
          width={130}
          height={166}
        />
        <p className="text-b1 text-bg-30">일치하는 검색 결과가 없어요!</p>
      </div>
    );
  }

  {/* 검색 결과 리스트 */}
  // TODO: 검색 결과 리스트 컴포넌트 추가
  function SearchResultList({ results }: { results: string[] }) {
    return (
      <ul className="space-y-2">
        {results.map((item, index) => (
          <li key={index} className="rounded border p-2">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  {/* 검색 페이지 */}
export default function SearchPage() {
  const [keyword, setKeyword] = useState(""); // 검색어
  const [searched, setSearched] = useState(false); // 검색 여부
  const [results, setResults] = useState<string[]>([]); // 검색 결과

  // 검색 함수: 검색어를 입력하면 검색 결과를 반환
  const handleSearch = () => {
    setSearched(true);
    // TODO: 검색 결과 반환 API 연결
    if (keyword === "react") setResults(["React 기초", "React Hooks"]);
    else setResults([]);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* 검색 입력 영역 헤더 */}
        <Header
        variant="center"
        leftSlot={<BackButton />}
        centerSlot={
            <div className="flex w-full items-center h-[40px] px-5 gap-[10px] rounded-[8px] bg-bg-80">
              <Image
                src="/study/search.png"
                alt="검색"
                width={13}
                height={13}
              />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="검색어를 입력해주세요."
                className="w-full bg-bg-80 text-gray-50 outline-none focus:outline-none ring-0 focus:ring-0 focus:ring-offset-0"
              />
            </div>
        }
        />
      {/* 결과 영역 */}
        <div className={`flex-1 min-h-0 flex flex-col ${searched && results.length > 0 ? 'overflow-y-auto' : 'overflow-hidden'}`}>
            {!searched && (
                <div className="flex flex-1 items-center justify-center">
                <SearchEmptyView />
                </div>
            )}

            {searched && results.length === 0 && (
                <div className="flex flex-1 items-center justify-center">
                <SearchNoResult />
                </div>
            )}

            {searched && results.length > 0 && <SearchResultList results={results} />}
        </div>
    </div>
  );
}
