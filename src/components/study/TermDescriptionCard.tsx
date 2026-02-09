"use client";

import { useState, useEffect } from "react";
import { CoreTerm } from "@/lib/api/news";
import {
  getStorageFolders,
  createStorageFolder,
  saveTermToStorage,
  type StorageFolder,
} from "@/lib/api/storage";

type TermDescriptionCardProps = {
  term: CoreTerm | null;
  onClose: () => void;
  onSelectCategory: (categoryId: number | null) => void;
  onAddNewCategory: () => void;
};

/**
 * 단어 설명 카드 컴포넌트
 * @param term 단어 설명 데이터
 * @param onClose 닫기 함수
 * @param onSelectCategory 카테고리 선택 핸들러
 * @param onAddNewCategory 새 카테고리 추가 핸들러
 * @returns 단어 설명 카드 컴포넌트
 */
export function TermDescriptionCard({
  term,
  onClose,
  onSelectCategory,
  onAddNewCategory,
}: TermDescriptionCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [userFolders, setUserFolders] = useState<StorageFolder[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(false);

  // 카드가 뒤집힐 때 사용자 폴더 목록 조회
  useEffect(() => {
    if (isFlipped && !isCreatingNewCategory) {
      fetchUserFolders();
    }
  }, [isFlipped, isCreatingNewCategory]);

  const fetchUserFolders = async () => {
    try {
      setLoadingFolders(true);
      const response = await getStorageFolders("TERM");
      setUserFolders(response.data || []);
    } catch (err) {
      console.error("보관함 폴더 조회 실패:", err);
      setUserFolders([]);
    } finally {
      setLoadingFolders(false);
    }
  };

  if (!term) return null; // 단어 설명 데이터가 없으면 카드 렌더링하지 않음

  const handleSaveClick = () => {
    setIsFlipped(true);
  };

  const handleBackClick = () => {
    if (isCreatingNewCategory) {
      setIsCreatingNewCategory(false);
      setNewCategoryName("");
    } else {
      setIsFlipped(false);
    }
  };

  const handleCategorySelect = async (folderId: number | null) => {
    if (!term?.termId || folderId === null) return;

    try {
      // 보관함에 단어 저장 API 호출
      await saveTermToStorage(term.termId, [folderId]);
      
      // 부모 컴포넌트에 알림 (북마크 상태 업데이트용)
      onSelectCategory(folderId);
      onClose();
    } catch (err) {
      console.error("보관함에 단어 저장 실패:", err);
      // TODO: 에러 메시지 표시 (토스트 등)
    }
  };

  const handleAddNewCategoryClick = () => {
    setIsCreatingNewCategory(true);
  };

  const handleSaveNewCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      // 새 폴더 생성 API 호출
      await createStorageFolder("TERM", newCategoryName.trim());
      
      // 폴더 목록 새로고침
      await fetchUserFolders();
      
      // 상태 초기화 및 카드 앞면으로 돌아가기
      setIsCreatingNewCategory(false);
      setNewCategoryName("");
      setIsFlipped(false);
      
      // 부모 컴포넌트에 알림
      onAddNewCategory();
    } catch (err) {
      console.error("새 폴더 생성 실패:", err);
      // TODO: 에러 메시지 표시 (토스트 등)
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-72 h-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: isCreatingNewCategory
            ? "rotateY(180deg)" // 새 카테고리 입력 폼도 뒷면에 있으므로 180deg
            : isFlipped
            ? "rotateY(180deg)"
            : "rotateY(0deg)" }}
        >
          {/* 카드 앞면 */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl border-2 border-bg-90 overflow-hidden opacity-95 bg-bg-100 backface-hidden [backface-visibility:hidden]"
          >
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex items-center justify-center w-6 h-6 z-10"
              aria-label="닫기"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-stone-50"
              >
                <path
                  d="M5 5L15 15M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* 단어 제목 */}
            <div className="mt-[50px] w-full flex justify-center">
              <div className="text-center text-gray-10 text-h1">
                {term.term}
              </div>
            </div>

            {/* 단어 설명 */}
            {term.description && (
              <div className="mt-[35px] px-[30px] text-gray-20 text-b3">
                {term.description}
              </div>
            )}

            {/* 이미지 */}
            <img
              className="absolute bottom-[28px] right-[30px]"
              src="/study/img-insight.svg"
              alt={term.term}
            />
          </div>

          {/* 카드 뒷면 */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl border-2 border-bg-90 overflow-hidden opacity-95 bg-bg-100 backface-hidden [backface-visibility:hidden]"
            style={{ transform: "rotateY(180deg)" }}
          >
            {/* 뒤로가기 버튼 */}
            <button
              onClick={handleBackClick}
              className="absolute top-4 left-4 flex items-center justify-center w-6 h-6 z-10"
              aria-label="뒤로가기"
            >
              <svg
                width={isCreatingNewCategory ? "10" : "20"}
                height={isCreatingNewCategory ? "17" : "20"}
                viewBox={isCreatingNewCategory ? "0 0 10 17" : "0 0 20 20"}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-stone-50"
              >
                {isCreatingNewCategory ? (
                  <path
                    d="M7.83582 1.25L1.54292 7.54289C1.1524 7.93342 1.1524 8.56658 1.54292 8.95711L7.83582 15.25"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M12.5 15L7.5 10L12.5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </button>

            {/* 새 카테고리 입력 폼 */}
            {isCreatingNewCategory ? (
              <>
                {/* 제목 */}
                <div className="mt-[50px] px-5">
                  <h3 className="text-sh2 text-gray-10">새 카테고리</h3>
                </div>

                {/* 입력 필드 */}
                <div className="mt-6 px-5">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="이름을 입력해주세요."
                    className="w-full h-[60px] pl-[25px] pr-4 py-[18px] bg-bg-70 rounded-[8px] text-b1 text-gray-20 placeholder:text-gray-50 placeholder:text-b2 focus:outline-none focus:ring-0"
                    autoFocus
                    maxLength={20}
                  />
                </div>

                {/* 저장 버튼 */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 flex justify-end">
                  <button
                    onClick={handleSaveNewCategory}
                    disabled={!newCategoryName.trim()}
                    className="w-[150px] px-2.5 py-2 bg-primary-50 rounded-[8px] text-b2 text-gray-10 disabled:bg-primary-20 disabled:cursor-not-allowed transition-colors"
                  >
                    저장하기
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* 제목 */}
                <div className="mt-[50px] px-5">
                  <p className="text-sh5 text-gray-40 mb-1">보관함에 저장할</p>
                  <h3 className="text-sh2 text-gray-10">카테고리 선택</h3>
                </div>

                {/* 카테고리 리스트 */}
                <div className="mt-6 px-5 flex flex-col items-start gap-[5px] overflow-y-auto max-h-[200px]">

              {/* 사용자 폴더들 */}
              {loadingFolders ? (
                <div className="w-full py-[14px] text-center text-b2 text-gray-40">
                  로딩 중...
                </div>
              ) : (
                userFolders.map((folder) => (
                  <button
                    key={folder.folderId}
                    onClick={() => handleCategorySelect(folder.folderId)}
                    className="w-full flex items-center gap-3 px-0 py-[14px] text-left border-bg-50 border-b-[0.8px]"
                  >
                    <svg
                      width="14"
                      height="19"
                      viewBox="0 0 14 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-bg-20"
                    >
                      <path
                        d="M13 16.5V2C13 1.44772 12.5523 1 12 1H2C1.44772 1 1 1.44772 1 2V16.5C1 17.4027 2.10158 17.8433 2.72414 17.1897L6.27586 13.4603C6.66995 13.0466 7.33005 13.0466 7.72414 13.4603L11.2759 17.1897C11.8984 17.8433 13 17.4027 13 16.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                    <span className="text-b2 text-bg-20">
                      {folder.folderName} ({folder.itemCount})
                    </span>
                  </button>
                ))
              )}

              {/* 새 카테고리 추가 */}
              <button
                onClick={handleAddNewCategoryClick}
                className="w-full flex items-center gap-3 px-0 py-[14px] text-left"
              >
                <div className="w-[14px] h-[19px] flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-bg-20"
                  >
                    <path
                      d="M7 1V13M1 7H13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="text-b2 text-primary-30">새 카테고리 추가</span>
              </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 보관함에 저장하기 버튼 - 카드 밖 (앞면일 때만 표시) */}
      {!isFlipped && (
        <div className="mt-[25px] w-72" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSaveClick();
            }}
            className="w-full py-[18px] rounded-[16px] bg-primary-50 text-b1 text-gray-10 text-center shadow-[0_0_8px_0_#5C54F5]"
          >
            보관함에 저장하기
          </button>
        </div>
      )}
    </div>
  );
}
