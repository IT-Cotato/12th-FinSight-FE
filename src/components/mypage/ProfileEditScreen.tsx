"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/mypage/PageHeader";
import ConfirmModal from "@/components/mypage/ConfirmModal";
import NicknameField from "@/components/mypage/NicknameField";
import CategoryPicker from "@/components/mypage/CategoryPicker";
import {
  getMyProfile,
  getUserCategories,
  updateMyProfile,
} from "@/lib/api/mypage";
import { ALL_CATEGORIES_8, MOCK_PROFILE } from "@/lib/mock/mypage";

type Category = { section: string; displayName: string };

export default function ProfileEditScreen() {
  const [loading, setLoading] = useState(true);

  const [initialNickname, setInitialNickname] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameCheckedOk, setNicknameCheckedOk] = useState(false);

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [initialSelected, setInitialSelected] = useState<string[]>([]);

  const [editMode, setEditMode] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [profileRes, categoriesRes] = await Promise.allSettled([
          getMyProfile(),
          getUserCategories(), // 관심분야 가져오기
        ]);

        const profile =
          profileRes.status === "fulfilled" ? profileRes.value : MOCK_PROFILE;

        const userCategories =
          categoriesRes.status === "fulfilled"
            ? (categoriesRes.value ?? [])
            : [];

        // 전체 카테고리 8개
        setAllCategories(ALL_CATEGORIES_8);

        // 닉네임
        setInitialNickname(profile.nickname);
        setNickname(profile.nickname);

        // 선택된 카테고리는 section 값 배열로 저장
        const mappedSections = userCategories.map((c: Category) => c.section);

        setInitialSelected(mappedSections);
        setSelected(mappedSections);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const nicknameChanged = useMemo(
    () => nickname.trim() !== initialNickname.trim(),
    [nickname, initialNickname],
  );

  const categoriesChanged = useMemo(() => {
    const a = [...initialSelected].sort().join("|");
    const b = [...selected].sort().join("|");
    return a !== b;
  }, [initialSelected, selected]);

  const canSave = useMemo(() => {
    if (selected.length < 3) return false;
    if (!nicknameChanged && !categoriesChanged) return false;
    if (nicknameChanged && !nicknameCheckedOk) return false;
    return true;
  }, [selected.length, nicknameChanged, categoriesChanged, nicknameCheckedOk]);

  async function handleConfirmSave() {
    if (!canSave || saving) return;

    setSaving(true);
    try {
      await updateMyProfile({
        nickname: nickname.trim(),
        categories: selected, // section 배열 그대로 전송
      });

      alert("저장되었습니다.");
      setInitialNickname(nickname);
      setInitialSelected(selected);
      setEditMode(false);
      setOpenConfirm(false);
    } catch {
      alert("서버 연결에 실패했어요.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="min-h-dvh bg-bg-100" />;
  }

  return (
    <main className="min-h-dvh bg-bg-100 px-5">
      <PageHeader title="프로필 수정" />

      <NicknameField
        initialNickname={initialNickname}
        nickname={nickname}
        onChange={setNickname}
        onCheckedChange={setNicknameCheckedOk}
      />

      <CategoryPicker
        allCategories={allCategories}
        selected={selected}
        onChange={setSelected}
        editMode={editMode}
        onToggleEdit={() => setEditMode((v) => !v)}
      />

      {/* 저장 버튼 */}
      <div className="fixed bottom-6 left-0 right-0 px-5">
        <button
          type="button"
          onClick={() => setOpenConfirm(true)}
          disabled={!canSave || saving}
          className={`h-[60px] w-full rounded-xl text-b1 text-gray-10 ${
            canSave ? "bg-primary-50" : "bg-primary-20"
          }`}
        >
          저장하기
        </button>
      </div>

      <ConfirmModal
        open={openConfirm}
        title="수정 내용을 저장할까요?"
        description={"저장하지 않으면,\n변경 내용은 저장되지 않습니다."}
        cancelText="아니오"
        confirmText="저장"
        onCancel={() => setOpenConfirm(false)}
        onConfirm={handleConfirmSave}
      />
    </main>
  );
}
