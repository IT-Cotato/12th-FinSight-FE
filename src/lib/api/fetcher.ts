type FetcherOptions = RequestInit & {
  token?: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export function getClientToken() {
  // 프로젝트 로그인 저장 방식에 맞게 교체 예정
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("accessToken") ?? undefined;
}

export async function apiFetch<T>(
  path: string,
  options: FetcherOptions = {},
): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const headers = new Headers(options.headers);
  headers.set("accept", "*/*");
  if (!headers.get("content-type") && options.body)
    headers.set("content-type", "application/json");

  if (options.token) headers.set("authorization", `Bearer ${options.token}`);

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.message ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return (await res.json()) as T;
}
