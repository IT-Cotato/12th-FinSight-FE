"use client";

type Props = {
  notifyOn: boolean;
  onToggleNotify: (v: boolean) => void;
  onGoChangePassword: () => void;
  onLogout: () => void;
  onWithdraw: () => void;
};

export default function SettingsSection({
  notifyOn,
  onToggleNotify,
  onGoChangePassword,
  onLogout,
  onWithdraw,
}: Props) {
  return (
    <section className="px-5">
      {/* 알림 설정 + 토글 */}
      <div className="flex items-center gap-3 py-5">
        <span className="text-b2 text-gray-40">알림 설정</span>

        {/* toggle */}
        <button
          type="button"
          onClick={() => onToggleNotify(!notifyOn)}
          className={[
            "relative inline-flex h-6 w-12 items-center rounded-full transition-colors",
            notifyOn ? "bg-primary-50" : "bg-primary-90",
          ].join(" ")}
          aria-label="toggle notify"
        >
          {/* 이탈 방지 */}
          <span
            className={[
              "absolute left-1 h-5 w-5 rounded-full bg-gray-10 transition-transform",
              notifyOn ? "translate-x-6" : "translate-x-0",
            ].join(" ")}
          />
        </button>
      </div>

      <div className="grid grid-cols-3 py-4 text-center text-b4 text-gray-40">
        <button type="button" onClick={onGoChangePassword}>
          비밀번호 변경
        </button>
        <button type="button" onClick={onLogout}>
          로그아웃
        </button>
        <button type="button" onClick={onWithdraw}>
          회원탈퇴
        </button>
      </div>
    </section>
  );
}
