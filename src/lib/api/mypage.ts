import type {
  ApiEnvelope,
  CategoryItem,
  MyProfile,
  WeeklyReport,
} from "@/types/mypage";

import { apiFetch, getClientToken } from "./fetcher";

// const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export async function getMyProfile() {
  const token = getClientToken();
  const res = await apiFetch<ApiEnvelope<MyProfile>>("/api/mypage/me/profile", {
    token,
  });
  return res.data;
}

export async function updateMyProfile(body: {
  nickname: string;
  categories: string[];
}) {
  const token = getClientToken();
  const res = await apiFetch<ApiEnvelope<Record<string, never>>>(
    "/api/mypage/me/profile",
    {
      method: "PUT",
      token,
      body: JSON.stringify(body),
    },
  );
  return res.data;
}

export async function checkNickname(nickname: string) {
  const token = getClientToken();
  return apiFetch<ApiEnvelope<Record<string, never>>>(
    "/api/mypage/check-nickname",
    {
      method: "POST",
      token,
      body: JSON.stringify({ nickname }),
    },
  );
}

export async function getUserCategories() {
  const token = getClientToken();
  const res = await apiFetch<ApiEnvelope<{ categories: CategoryItem[] }>>(
    "/api/users/categories",
    { token },
  );
  return res.data.categories;
}

export async function getWeeklyReport(weeksAgo: number) {
  const token = getClientToken();
  const res = await apiFetch<ApiEnvelope<WeeklyReport>>(
    `/api/mypage/report?weeksAgo=${weeksAgo}`,
    { token },
  );
  return res.data;
}

export async function changeMyPassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  const token = getClientToken();

  await apiFetch<ApiEnvelope<{}>>("/api/mypage/me/change-password", {
    method: "PUT",
    token,
    body: JSON.stringify(input),
  });

  return true;
}

export async function logout() {
  const token = getClientToken();
  return apiFetch<ApiEnvelope<Record<string, never>>>("/api/auth/logout", {
    method: "POST",
    token,
  });
}

export async function deleteMe() {
  const token = getClientToken();
  return apiFetch<ApiEnvelope<Record<string, never>>>("/api/mypage/me", {
    method: "DELETE",
    token,
  });
}

// 알림 설정 조회
export async function getMyNotification(): Promise<boolean> {
  const res = await apiFetch<{
    status: string;
    data: { enabled: boolean };
  }>("/api/mypage/me/notification");

  return res.data.enabled;
}

// 알림 설정 변경
export async function updateMyNotification(enabled: boolean) {
  await apiFetch("/api/mypage/me/notification", {
    method: "PUT",
    body: JSON.stringify({ enabled }),
  });
}
