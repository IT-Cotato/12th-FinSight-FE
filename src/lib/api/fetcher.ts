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

  // 토큰 자동 주입
  const token = options.token ?? getClientToken();
  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, { ...options, headers, credentials: "include" });

  // 에러 처리
  const contentType = res.headers.get("content-type") ?? "";
  let payload: any = null;

  if (contentType.includes("application/json")) {
    payload = await res.json().catch(() => null);
  } else {
    const text = await res.text().catch(() => "");
    payload = text ? { message: text } : null;
  }

  if (!res.ok) {
    // 서버가 주는 message(USER-004)는 payload로만 보관
    // UI 메시지는 화면에서 status로 매핑
    const err: any = new Error(payload?.message ?? `HTTP ${res.status}`);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  if (!contentType.includes("application/json")) {
    return payload as T;
  }

  return payload as T;
}
