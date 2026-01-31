"use client";

import { useMemo, useState } from "react";
import type { MyPageViewData } from "@/types/mypage";
import ProfileHeader from "./ProfileHeader";
import LevelProgress from "./LevelProgress";
import StatTripletCard from "./StatTripletCard";
import WeeklyReportCard from "./WeeklyReportCard";
import SettingsSection from "./SettingsSection";
import ConfirmModal from "./ConfirmModal";

type Props = {
  data: MyPageViewData;
  onGoStudy: () => void;
  onEditProfile: () => void;
  onChangePassword: () => void;
  onLogoutConfirm: () => Promise<void>;
  onWithdrawConfirm: () => Promise<void>;
};

export default function MyPageScreen({
  data,
  onGoStudy,
  onEditProfile,
  onChangePassword,
  onLogoutConfirm,
  onWithdrawConfirm,
}: Props) {
  const [notifyOn, setNotifyOn] = useState(true);

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const safePercent = useMemo(
    () => Math.max(0, Math.min(100, data.profile.percentLv)),
    [data.profile.percentLv],
  );

  return (
    <main className="min-h-dvh bg-bg-100">
      <ProfileHeader
        profile={data.profile}
        categories={data.categories}
        onEditProfile={onEditProfile}
      />

      <LevelProgress
        currentLv={data.profile.currentLv}
        nextLv={data.profile.nextLv}
        percent={safePercent}
      />

      <StatTripletCard
        attendanceDays={data.report.attendanceDays}
        totalNewsSaved={data.report.totalNewsSaved}
        totalQuizSolved={data.report.totalQuizSolved}
      />

      <WeeklyReportCard
        report={data.report}
        hasAnyRecord={data.hasAnyRecord}
        canPrevWeek={data.report.weeksAgo < 52}
        canNextWeek={data.report.weeksAgo > 0}
        onPrevWeek={() => {}}
        onNextWeek={() => {}}
        onGoStudy={onGoStudy}
      />

      <SettingsSection
        notifyOn={notifyOn}
        onToggleNotify={setNotifyOn}
        onGoChangePassword={onChangePassword}
        onLogout={() => setLogoutOpen(true)}
        onWithdraw={() => setWithdrawOpen(true)}
      />

      {/* 로그아웃 모달 */}
      <ConfirmModal
        open={logoutOpen}
        title="정말로 로그아웃할까요?"
        confirmText="로그아웃"
        onCancel={() => setLogoutOpen(false)}
        onConfirm={async () => {
          setLogoutOpen(false);
          await onLogoutConfirm();
        }}
      />

      {/* 회원탈퇴 모달 */}
      <ConfirmModal
        open={withdrawOpen}
        title="정말로 계정을 삭제할까요?"
        description={"계정을 삭제하면, 저장된 정보는\n되돌릴 수 없습니다."}
        confirmText="삭제"
        onCancel={() => setWithdrawOpen(false)}
        onConfirm={async () => {
          setWithdrawOpen(false);
          await onWithdrawConfirm();
        }}
      />
    </main>
  );
}
