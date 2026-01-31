"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { MyPageViewData } from "@/types/mypage";
import MyPageScreen from "@/components/mypage/MyPageScreen";

import { MOCK_HAS_RECORD, MOCK_NO_RECORD } from "@/lib/mock/mypage";
import {
  deleteMe,
  getMyProfile,
  getUserCategories,
  getWeeklyReport,
  logout,
} from "@/lib/api/mypage";

function computeHasAnyRecord(report: MyPageViewData["report"]) {
  const s = report.weeklySummary;
  return (s.newsSaved ?? 0) + (s.quizSolved ?? 0) + (s.quizReviewed ?? 0) > 0;
}

export default function MyPagePage() {
  const router = useRouter();
  const [data, setData] = useState<MyPageViewData | null>(null);

  // 화면 확인용 토글
  const [devShowRecord, setDevShowRecord] = useState<boolean>(true);
  const fallback = useMemo(
    () => (devShowRecord ? MOCK_HAS_RECORD : MOCK_NO_RECORD),
    [devShowRecord],
  );

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        // mock : 서버 연결 실패 시
        const [profile, categories, report] = await Promise.all([
          getMyProfile(),
          getUserCategories(),
          getWeeklyReport(0),
        ]);

        const view: MyPageViewData = {
          profile,
          categories,
          report,
          hasAnyRecord: computeHasAnyRecord(report),
        };

        if (mounted) setData(view);
      } catch {
        if (mounted) setData(fallback);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [fallback]);

  if (!data) {
    return <main className="bg-bg-100" />;
  }

  return (
    <>
      <MyPageScreen
        data={data}
        onGoStudy={() => router.push("/study")}
        onEditProfile={() => {
          // 프로필 수정 페이지 라우트로 교체 예정
          router.push("/mypage/edit");
        }}
        onChangePassword={() => {
          // 비밀번호 변경 페이지 라우트로 교체 예정
          router.push("/mypage/password");
        }}
        onLogoutConfirm={async () => {
          try {
            await logout();
          } catch {}
          // 토큰 삭제/스토어 초기화 구현 예정
          if (typeof window !== "undefined")
            localStorage.removeItem("accessToken");
          router.replace("/");
        }}
        onWithdrawConfirm={async () => {
          try {
            await deleteMe();
          } catch {}
          if (typeof window !== "undefined")
            localStorage.removeItem("accessToken");
          router.replace("/");
        }}
      />
    </>
  );
}
