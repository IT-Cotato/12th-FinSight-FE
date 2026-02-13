"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

type ArchiveNewsMenuBottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  onEdit: () => void;
};

export function ArchiveNewsMenuBottomSheet({
  open,
  onOpenChange,
  onDelete,
  onEdit,
}: ArchiveNewsMenuBottomSheetProps) {
  const handleDelete = () => {
    onDelete();
    onOpenChange(false);
  };

  const handleEdit = () => {
    onEdit();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="w-full max-w-[420px] left-auto right-auto rounded-t-[20px] border-bg-80 p-0"
      >
        <SheetTitle className="sr-only">뉴스 메뉴</SheetTitle>
        {/* 드래그 핸들 */}
        <div className="flex justify-center pt-5">
          <div 
            className="w-20 h-[4.5px] bg-bg-40 rounded-full"
          />
        </div>
        <div className="flex flex-col gap-[10px]">
          <button
            onClick={handleDelete}
            className="px-5 mt-[40px] text-left text-b1 text-gray-10"
          >
            카테고리에서 삭제
          </button>
          <button
            onClick={handleEdit}
            className="px-5 mb-[60px] text-left text-b1 text-gray-10"
          >
            카테고리 수정
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
