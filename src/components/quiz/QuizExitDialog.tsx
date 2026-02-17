"use client";

import * as Dialog from "@radix-ui/react-dialog";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onExit: () => void;
  onContinue: () => void;
};

export default function QuizExitDialog({
  open,
  onOpenChange,
  onExit,
  onContinue,
}: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* 오버레이 */}
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />

        {/* 모달창 */}
        <Dialog.Content
          className="
            fixed left-1/2 top-1/2
            h-[190px] w-[310px]
            -translate-x-1/2 -translate-y-1/2

            rounded-2xl
            bg-bg-80
            px-6 py-5

            shadow-[0_12px_32px_rgba(0,0,0,0.35)]
            data-[state=open]:animate-popIn
            "
        >
          <Dialog.Title className="text-center text-h3 font-semibold text-gray-10">
            퀴즈를 종료할까요?
          </Dialog.Title>

          <Dialog.Description className="mt-3 text-center text-b4 text-gray-40">
            제출하지 않고 나가면,
            <br />푼 문제는 저장되지 않습니다.
          </Dialog.Description>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onExit}
              className="h-[40px] w-[130px] rounded-xl bg-bg-50 text-b2 text-gray-10"
            >
              종료하기
            </button>

            <button
              type="button"
              onClick={onContinue}
              className="h-[40px] w-[130px] rounded-xl bg-primary-50 text-b2 text-gray-10"
            >
              계속 풀기
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
