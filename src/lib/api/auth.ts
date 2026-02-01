import type { ApiEnvelope } from "@/types/mypage";
import { apiFetch, getClientToken } from "./fetcher";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export async function resetPassword(body: {
  email: string;
  newPassword: string;
}) {
  if (USE_MOCK) throw new Error("mock");

  const token = getClientToken();
  const res = await apiFetch<ApiEnvelope<Record<string, never>>>(
    "/api/auth/password/reset",
    {
      method: "POST",
      token,
      body: JSON.stringify(body),
    },
  );
  return res.data;
}
