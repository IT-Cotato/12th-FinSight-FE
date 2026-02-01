"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/mypage/PageHeader";
import ConfirmModal from "@/components/mypage/ConfirmModal";
import NicknameField from "@/components/mypage/NicknameField";
import CategoryPicker from "@/components/mypage/CategoryPicker";
import {
  checkNickname,
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

  function extractCategories(
    profile: { nickname: string } | unknown,
  ): string[] {
    if (!profile || typeof profile !== "object") return [];

    if (!("categories" in profile)) return [];

    const v = (profile as Record<string, unknown>).categories;
    if (!Array.isArray(v)) return [];

    return v.filter((x): x is string => typeof x === "string");
  }

  useEffect(() => {
    (async () => {
      try {
        const [profileRes, catsRes] = await Promise.allSettled([
          getMyProfile(),
          getUserCategories(),
        ]);

        // fallback 시 mock
        const profile =
          profileRes.status === "fulfilled" ? profileRes.value : MOCK_PROFILE;

        // categories 실패 시 8개 fallback
        const cats =
          catsRes.status === "fulfilled" && catsRes.value?.length
            ? catsRes.value
            : ALL_CATEGORIES_8;

        setInitialNickname(profile.nickname);
        setNickname(profile.nickname);

        // 회원가입 때 저장된 관심분야 그대로 반영
        setSelected(profile.categories ?? []);

        const initialCats = extractCategories(profile);
        setInitialSelected(initialCats);
        setSelected(initialCats);

        setAllCategories(cats);
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
    const hasMin3 = selected.length >= 3;
    if (!hasMin3) return false;

    const hasChanges = nicknameChanged || categoriesChanged;
    // 변경사항 없으면 저장 불가
    if (!hasChanges) return false;

    // 닉네임 변경이 있으면 중복확인 OK가 필요
    if (nicknameChanged) return nicknameCheckedOk;

    // 카테고리만 변경된 경우는 바로 저장 가능
    return true;
  }, [
    selected.length,
    nicknameChanged,
    categoriesChanged,
    nicknameCheckedOk,
    selected,
  ]);

  async function handleConfirmSave() {
    if (!canSave || saving) return;

    setSaving(true);
    try {
      await updateMyProfile({
        nickname: nickname.trim(),
        categories: selected,
      });

      alert("저장되었습니다.");
      setOpenConfirm(false);
    } catch {
      alert("서버 연결에 실패했어요. (임시로 화면만 유지합니다)");
      setOpenConfirm(false);
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
          className={`h-[60px] w-full rounded-xl text-b1 text-gray-10 transition-colors ${
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
