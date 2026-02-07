"use client";

import { useEffect, useMemo, useState } from "react";
import { getWeeklyReport } from "@/lib/api/mypage";
import type { MyPageViewData, WeeklyReport } from "@/types/mypage";
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

const MAX_WEEKS_AGO = 7;

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

  const [weeksAgo, setWeeksAgo] = useState(0);
  const [report, setReport] = useState<WeeklyReport | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data = await getWeeklyReport(weeksAgo);
        if (!alive) return;
        setReport(data);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      alive = false;
    };
  }, [weeksAgo]);

  // 전 주
  const canGoPrev = report
    ? report.weeksAgo < MAX_WEEKS_AGO
    : data.report.weeksAgo < MAX_WEEKS_AGO;
  // 다음 주
  const canGoNext = weeksAgo > 0;

  const handlePrev = () => {
    if (!canGoPrev) return;
    setWeeksAgo((v) => Math.min(MAX_WEEKS_AGO, v + 1));
  };

  const handleNext = () => {
    if (!canGoNext) return;
    setWeeksAgo((v) => Math.max(0, v - 1));
  };

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
        report={report ?? data.report}
        hasAnyRecord={data.hasAnyRecord}
        canPrev={canGoPrev}
        canNext={canGoNext}
        onPrev={handlePrev}
        onNext={handleNext}
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
