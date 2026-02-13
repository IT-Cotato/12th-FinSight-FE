"use client";

import { useMemo, useState } from "react";
import { checkNickname } from "@/lib/api/mypage";
import { MOCK_TAKEN_NICKNAMES } from "@/lib/mock/mypage";

type Props = {
  initialNickname: string;
  nickname: string;
  onChange: (v: string) => void;
  onCheckedChange: (ok: boolean) => void;
};

type CheckState = "idle" | "checking" | "available" | "taken";

export default function NicknameField({
  initialNickname,
  nickname,
  onChange,
  onCheckedChange,
}: Props) {
  const [state, setState] = useState<CheckState>("idle");

  const changed = useMemo(
    () => nickname.trim() !== initialNickname.trim(),
    [nickname, initialNickname],
  );

  const message = useMemo(() => {
    if (!changed) return "";
    if (state === "available") return "사용 가능한 닉네임입니다.";
    if (state === "taken") return "이미 존재하는 닉네임입니다.";
    return "";
  }, [changed, state]);

  async function handleCheck() {
    if (!changed) return;

    const value = nickname.trim();
    if (!value) return;

    setState("checking");
    onCheckedChange(false);

    try {
      await checkNickname(value);

      setState("available");
      onCheckedChange(true);
    } catch {
      // fallback 시 mock
      const isTaken = MOCK_TAKEN_NICKNAMES.has(value);

      if (isTaken) {
        setState("taken");
        onCheckedChange(false);
      } else {
        setState("available");
        onCheckedChange(true);
      }
    }
  }

  return (
    <section className="mt-12">
      <h2 className="text-h3 font-semibold text-bg-10">닉네임 변경</h2>

      <div className="mt-4 flex h-[60px] w-full rounded-md bg-bg-70 px-5 text-b1 text-gray-20">
        <input
          value={nickname}
          onChange={(e) => {
            onChange(e.target.value);
            setState("idle");
            onCheckedChange(false);
          }}
          placeholder="닉네임 입력"
          className="w-full bg-transparent text-[16px] text-gray-20 outline-none placeholder:text-gray-50"
        />

        <button
          type="button"
          onClick={handleCheck}
          disabled={!changed || state === "checking"}
          className="shrink-0 text-b4 text-primary-30 disabled:opacity-0"
        >
          중복확인
        </button>
      </div>

      {message && <p className="mt-1 text-b2 text-primary-30">{message}</p>}
    </section>
  );
}
