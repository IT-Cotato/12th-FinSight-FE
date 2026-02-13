"use client";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  cancelText?: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  cancelText = "취소",
  confirmText,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      {/* 배경 */}
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />

      {/* 모달 */}
      <div className="relative w-full max-w-[310px] rounded-xl bg-bg-80 px-6 py-7">
        <h3 className="text-center text-h3 font-semibold text-gray-10">
          {title}
        </h3>
        {description ? (
          <p className="mt-3 whitespace-pre-line text-center text-b3 text-gray-40">
            {description}
          </p>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-[44px] rounded-lg bg-bg-50 text-b2 text-gray-10"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-[44px] rounded-lg bg-primary-50 text-b2 text-gray-10"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
