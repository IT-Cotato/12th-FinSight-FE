"use client";

import { useState, useEffect, useCallback } from "react";
import { CoreTerm } from "@/lib/api/news";
import {
  getStorageFolders,
  createStorageFolder,
  saveTermToStorage,
  type StorageFolder,
} from "@/lib/api/storage";

type CardMode = "front" | "select" | "create"; // 카드 모드 (앞면, 선택, 생성)

type TermDescriptionCardProps = {
  term: CoreTerm | null;
  onClose: () => void;
  onSelectCategory?: (categoryId: number) => void;
  onCategoryCreated?: () => void;
};

/**
 * 단어 설명 카드 컴포넌트
 * @param term 단어 설명 데이터
 * @param onClose 닫기 함수
 * @param onSelectCategory 카테고리 선택 핸들러
 * @param onCategoryCreated 새 카테고리 추가 핸들러
 * @returns 단어 설명 카드 컴포넌트
 */
export function TermDescriptionCard({
  term,
  onClose,
  onSelectCategory,
  onCategoryCreated,
}: TermDescriptionCardProps) {
  const [cardMode, setCardMode] = useState<CardMode>("front"); // 카드 모드 (앞면, 선택, 생성)
  const [newCategoryName, setNewCategoryName] = useState(""); // 새 카테고리 이름
  const [userFolders, setUserFolders] = useState<StorageFolder[]>([]); // 사용자 폴더 목록
  const [loadingFolders, setLoadingFolders] = useState(false); // 폴더 목록 로딩 상태
  const [savedFolderId, setSavedFolderId] = useState<number | null>(null); // 저장된 폴더 ID (UI 상에서 저장된 폴더 표시용)
  const [isSaving, setIsSaving] = useState(false); // 단어 저장 중 상태 (중복 클릭 방지용)
  // TODO: 단어가 저장된 폴더 ID API로 받아오기 

  // 사용자 폴더 목록 조회 함수
  const fetchUserFolders = useCallback(async () => {
    try {
      setLoadingFolders(true);
      const response = await getStorageFolders("TERM");
      setUserFolders(response.data);
    } catch (err) {
      console.error("보관함 폴더 조회 실패:", err);
    } finally {
      setLoadingFolders(false);
    }
  }, []);

  // 카테고리 선택 화면 최초 진입 시 사용자 폴더 목록 조회
  useEffect(() => {
    if (cardMode === "select" && userFolders.length === 0) {
      fetchUserFolders();
    }
  }, [cardMode, userFolders.length, fetchUserFolders]);
  
  // 단어가 변경되면 저장된 폴더 ID 초기화 및 카드 모드 초기화
  useEffect(() => {
    setSavedFolderId(null);
    setCardMode("front");
    setUserFolders([]);
    setIsSaving(false);
  }, [term?.termId]);

  if (!term) return null; // 단어 설명 데이터가 없으면 카드 렌더링하지 않음

  // 보관함에 저장하기 버튼 클릭 시 카드 모드 변경
  const handleSaveClick = () => {
    setCardMode("select");
  };

  // 뒤로가기 버튼 클릭 시 카드 모드 변경
  const handleBackClick = () => {
    if (cardMode === "create") {
      setCardMode("select");
      setNewCategoryName("");
    } else if (cardMode === "select") {
      setCardMode("front");
    }
  };

  // 카테고리 선택 시 보관함에 단어 저장
  const handleCategorySelect = async (folderId: number | null) => {
    if (!term?.termId || folderId === null || isSaving) return;
    if (savedFolderId === folderId) return;

    try {
      setIsSaving(true);
      
      // 보관함에 단어 저장 API 호출
      await saveTermToStorage(term.termId, [folderId]);
      
      // 저장된 폴더 ID만 업데이트 (즉각적인 UI 업데이트를 위해 API 호출 없이 로컬 상태만 변경)
      setSavedFolderId(folderId);
      
      // 선택한 폴더의 itemCount를 로컬에서 증가시킴
      setUserFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.folderId === folderId
            ? { ...folder, itemCount: folder.itemCount + 1 }
            : folder
        )
      );
      
      // 부모 컴포넌트에 알림 (필요한 경우에만)
      onSelectCategory?.(folderId);
    } catch (err) {
      console.error("보관함에 단어 저장 실패:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // 새 카테고리 추가 버튼 클릭 시 카드 모드 변경
  const handleAddNewCategoryClick = () => {
    setCardMode("create");
  };

  // 새 카테고리 생성 버튼 클릭 시 새 카테고리 생성
  const handleCreateNewCategory = async () => {
    if (!newCategoryName.trim() || isSaving) return;

    try {
      setIsSaving(true);
      
      // 새 폴더 생성 API 호출
      await createStorageFolder("TERM", newCategoryName.trim());
      
      // 폴더 목록 새로고침
      await fetchUserFolders();
      
      // 상태 초기화 및 카테고리 선택 화면으로 돌아가기
      setCardMode("select");
      setNewCategoryName("");
      
      // 부모 컴포넌트에 알림
      onCategoryCreated?.();
    } catch (err) {
      console.error("새 폴더 생성 실패:", err);
    } finally {
      setIsSaving(false);
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
          style={{ transform: cardMode === "front" ? "rotateY(0deg)" : "rotateY(180deg)" }}
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
                width={cardMode === "create" ? "10" : "20"}
                height={cardMode === "create" ? "17" : "20"}
                viewBox={cardMode === "create" ? "0 0 10 17" : "0 0 20 20"}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-stone-50"
              >
                {cardMode === "create" ? (
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
            {cardMode === "create" ? (
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

                {/* 새 카테고리 생성 버튼 */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 flex justify-end">
                  <button
                    onClick={handleCreateNewCategory}
                    disabled={!newCategoryName.trim()}
                    className="w-[150px] px-2.5 py-2 bg-primary-50 rounded-[8px] text-b2 text-gray-10 disabled:bg-primary-20 disabled:cursor-not-allowed transition-colors"
                  >
                    만들기
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
                userFolders.map((folder) => {
                  const isSaved = savedFolderId === folder.folderId;
                  return (
                    <button
                      key={folder.folderId}
                      onClick={() => handleCategorySelect(folder.folderId)}
                      disabled={isSaving}
                      className="w-full flex items-center gap-3 px-0 py-[14px] text-left border-bg-50 border-b-[0.8px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        width="14"
                        height="19"
                        viewBox="0 0 14 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={isSaved ? "text-primary-50" : "text-bg-20"}
                      >
                        <path
                          d="M13 16.5V2C13 1.44772 12.5523 1 12 1H2C1.44772 1 1 1.44772 1 2V16.5C1 17.4027 2.10158 17.8433 2.72414 17.1897L6.27586 13.4603C6.66995 13.0466 7.33005 13.0466 7.72414 13.4603L11.2759 17.1897C11.8984 17.8433 13 17.4027 13 16.5Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          fill={isSaved ? "currentColor" : "none"}
                        />
                      </svg>
                      <span className="text-b2 text-bg-20">
                        {folder.folderName} ({folder.itemCount})
                      </span>
                    </button>
                  );
                })
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
                    className="text-primary-30"
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

      {/* 보관함에 저장하기 버튼 */}
      {cardMode === "front" && (
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
