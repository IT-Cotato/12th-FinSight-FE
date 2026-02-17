"use client";

import Image from "next/image";

type Category = { section: string; displayName: string };

type Props = {
  allCategories: Category[];
  selected: string[];
  onChange: (next: string[]) => void;

  editMode: boolean;
  onToggleEdit: () => void;
};

export default function CategoryPicker({
  allCategories,
  selected,
  onChange,
  editMode,
  onToggleEdit,
}: Props) {
  const selectedItems = allCategories.filter((c) =>
    selected.includes(c.section),
  );

  const unselectedItems = allCategories.filter(
    (c) => !selected.includes(c.section),
  );

  const showMinError = selected.length < 3;

  return (
    <section className="pt-10">
      <h2 className="text-h3 font-semibold text-bg-10">관심분야 설정</h2>

      {/* 상단 영역 */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {/* edit 버튼 */}
        <button
          type="button"
          onClick={onToggleEdit}
          className={`flex h-[40px] w-[40px] items-center justify-center rounded-2xl border ${
            editMode
              ? "bg-primary-70 border-primary-60"
              : "bg-bg-70 border-bg-60"
          }`}
          aria-label="edit categories"
        >
          {/* 아이콘 */}
          <Image
            src="/mypage/icon-edit.svg"
            alt="edit"
            width={20}
            height={20}
          />
        </button>

        {/* 선택된 항목 */}
        {selectedItems.map((c) => (
          <button
            key={c.section}
            type="button"
            onClick={() => {
              if (!editMode) return;
              onChange(selected.filter((s) => s !== c.section));
            }}
            className="flex h-[40px] items-center justify-center rounded-3xl px-4 text-b3 text-gray-10 border bg-primary-70 border-bg-60"
          >
            {editMode ? `× ${c.displayName}` : c.displayName}
          </button>
        ))}
      </div>

      {/* 미선택 항목 (edit 모드일 때만) */}
      {editMode && (
        <div className="mt-4 flex flex-wrap gap-3">
          {unselectedItems.map((c) => (
            <button
              key={c.section}
              type="button"
              onClick={() => onChange([...selected, c.section])}
              className="flex h-[40px] items-center justify-center rounded-3xl px-4 bg-bg-70 border border-bg-60 text-b3 text-gray-10"
            >
              + {c.displayName}
            </button>
          ))}
        </div>
      )}

      {/* 최소 선택 경고 문구 */}
      {showMinError && (
        <p className="mt-3 text-b2 text-primary-30">3개 이상 선택해주세요.</p>
      )}
    </section>
  );
}
