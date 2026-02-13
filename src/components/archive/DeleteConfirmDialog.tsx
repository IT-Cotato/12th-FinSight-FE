"use client";

import * as Dialog from "@radix-ui/react-dialog";

type DeleteConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
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
            카테고리에서 삭제할까요?
          </Dialog.Title>

          <Dialog.Description className="mt-3 text-center text-b4 text-gray-40">
            카테고리에서 뉴스를 삭제하면
            <br />
            삭제한 뉴스는 복구할 수 없어요.
          </Dialog.Description>

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
              onClick={handleConfirm}
              className="h-[40px] w-[130px] rounded-[8px] bg-primary-50 text-b2 text-gray-10"
            >
              삭제
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
