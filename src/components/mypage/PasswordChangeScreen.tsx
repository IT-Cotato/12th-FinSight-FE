"use client";

import { useMemo, useState } from "react";
import PageHeader from "./PageHeader";
import PasswordInput from "./PasswordInput";
import Button from "@/components/Button";
import { changeMyPassword } from "@/lib/api/mypage";
import { MOCK_AUTH } from "@/lib/mock/mypage";

// 영문, 숫자 조합 6~18자리
const PW_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;

type Props = {
  email?: string;
};

function getErrorStatus(err: unknown): number | undefined {
  if (!err || typeof err !== "object") return undefined;
  if ("status" in err && typeof (err as any).status === "number")
    return (err as any).status;
  return undefined;
}

function getErrorMessage(err: unknown): string | undefined {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return undefined;
}

export default function PasswordChangeScreen({ email }: Props) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 현재 비번 일치/불일치 판단
  const currentMatch = useMemo(() => {
    if (!currentPw) return null;
    return null;
  }, [currentPw]);

  const newPwValid = useMemo(() => {
    if (!newPw) return null;
    return PW_REGEX.test(newPw);
  }, [newPw]);

  const confirmMatch = useMemo(() => {
    if (!confirmPw) return null;
    return confirmPw === newPw;
  }, [confirmPw, newPw]);

  const canSubmit = useMemo(() => {
    // 필드 전체 입력 시, 버튼 활성화
    return Boolean(
      currentPw && newPw && confirmPw && newPwValid && confirmMatch,
    );
  }, [currentPw, newPw, confirmPw, newPwValid, confirmMatch]);

  const resolvedEmail = useMemo(() => {
    if (email) return email;
    if (typeof window === "undefined") return MOCK_AUTH.email;
    return localStorage.getItem("userEmail") ?? MOCK_AUTH.email;
  }, [email]);

  async function handleSubmit() {
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      await changeMyPassword({
        currentPassword: currentPw.trim(),
        newPassword: newPw.trim(),
      });
      alert("비밀번호가 변경되었습니다.");
    } catch (e) {
      const status = getErrorStatus(e);
      const message = getErrorMessage(e);

      if (status === 400) {
        setSubmitError("비밀번호가 일치하지 않습니다.");
      } else {
        setSubmitError(
          message ?? "비밀번호 변경에 실패했어요. 잠시 후 다시 시도해주세요.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh bg-bg-100 px-5 pb-24">
      <PageHeader title="비밀번호 변경" />

      <section className="mt-12">
        <h2 className="text-h4 font-semibold text-bg-10">현재 비밀번호</h2>
        <div className="mt-2">
          <PasswordInput
            placeholder="비밀번호 입력"
            value={currentPw}
            onChange={(v) => {
              setCurrentPw(v);
              if (submitError) setSubmitError(null);
            }}
          />
        </div>

        {submitError ? (
          <p className="mt-1 text-b2 text-primary-30">{submitError}</p>
        ) : null}
      </section>

      <section className="mt-6">
        <h2 className="text-h4 font-semibold text-bg-10">새 비밀번호</h2>
        <div className="mt-2">
          <PasswordInput
            placeholder="영문, 숫자 조합 6~18자리"
            value={newPw}
            onChange={setNewPw}
          />
        </div>

        <p className="mt-1 text-b2 text-primary-30">
          {newPwValid === null
            ? ""
            : newPwValid
              ? "사용가능 비밀번호입니다."
              : "사용불가 비밀번호입니다. (영문, 숫자 6~18자리)"}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-h4 font-semibold text-bg-10">새 비밀번호 확인</h2>
        <div className="mt-2">
          <PasswordInput
            placeholder="영문, 숫자 조합 6~18자리"
            value={confirmPw}
            onChange={setConfirmPw}
          />
        </div>

        <p className="mt-1 text-b2 text-primary-30">
          {confirmMatch === null
            ? ""
            : confirmMatch
              ? "비밀번호가 일치합니다."
              : "비밀번호가 일치하지 않습니다."}
        </p>
      </section>

      {/* 저장 버튼 */}
      <Button
        text="저장하기"
        onClick={handleSubmit}
        disabled={!canSubmit || submitting}
      />
    </main>
  );
}
