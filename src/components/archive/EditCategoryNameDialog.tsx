"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";

type EditCategoryNameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onSave: (newName: string) => void;
};

export function EditCategoryNameDialog({
  open,
  onOpenChange,
  currentName,
  onSave,
}: EditCategoryNameDialogProps) {
  const [categoryName, setCategoryName] = useState(currentName);

  // 다이얼로그가 열릴 때 현재 이름으로 초기화
  useEffect(() => {
    if (open) {
      setCategoryName(currentName);
    }
  }, [open, currentName]);

  const handleSave = () => {
    if (categoryName.trim()) {
      onSave(categoryName.trim());
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setCategoryName(currentName);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* 오버레이 */}
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-[60]" />

        {/* 모달창 */}
        <Dialog.Content
          className="
            fixed left-1/2 top-1/2
            w-[310px]
            -translate-x-1/2 -translate-y-1/2
            rounded-2xl
            bg-bg-80
            px-5 py-6
            shadow-[0_12px_32px_rgba(0,0,0,0.35)]
            data-[state=open]:animate-popIn
            z-[70]
          "
        >
          <Dialog.Title className="text-center text-h3 text-gray-10">
            카테고리 이름 수정
          </Dialog.Title>

          {/* 입력 필드 */}
          <div className="mt-4">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="이름을 입력해주세요."
              className="w-full h-[50px] pl-4 pr-4 py-3 bg-bg-70 rounded-[8px] text-b1 text-gray-20 placeholder:text-gray-50 placeholder:text-b2 focus:outline-none focus:ring-0"
              autoFocus
              maxLength={20}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
            />
          </div>

          <div className="mt-6 flex gap-3 justify-center">
            <button
              type="button"
              onClick={handleCancel}
              className="h-[40px] w-[130px] rounded-[8px] bg-bg-50 text-b2 text-gray-10"
            >
              취소
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!categoryName.trim()}
              className="h-[40px] w-[130px] rounded-[8px] bg-primary-50 text-b2 text-gray-10 disabled:bg-primary-20 disabled:cursor-not-allowed transition-colors"
            >
              저장
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
