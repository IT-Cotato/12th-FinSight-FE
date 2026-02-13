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
