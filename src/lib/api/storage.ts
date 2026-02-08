// 보관함(Storage) API 관련 함수들

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || null;

/**
 * 액세스 토큰을 가져옵니다.
 * TODO: 로그인 기능 완성 후 실제 토큰 관리 로직으로 교체 필요
 */
function getAccessToken(): string | null {
  // 환경변수에서 토큰 가져오기 (개발용)
  if (typeof window !== "undefined") {
    // 클라이언트 사이드: localStorage나 다른 저장소에서 가져올 수 있음
    // 일단 환경변수나 상수로 관리
    return (
      process.env.NEXT_PUBLIC_ACCESS_TOKEN ||
      // TODO: 임시 토큰 - 로그인 기능 완성 후 제거 필요
      null
    );
  }
  return process.env.ACCESS_TOKEN || null;
}

/**
 * API 요청을 위한 공통 헤더를 생성합니다.
 */
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export type StorageFolder = {
  folderId: number;
  folderType: string;
  folderName: string;
  sortOrder: number;
};

export type StorageFoldersResponse = {
  status: string;
  data: StorageFolder[];
};

/**
 * 보관함 폴더 목록 조회
 * @param type 폴더 타입 (TERM, NEWS)
 * @returns 보관함 폴더 목록 응답
 */
export async function getStorageFolders(type: string = "TERM"): Promise<StorageFoldersResponse> {
  const queryParams = new URLSearchParams({ type });
  
  const response = await fetch(`${API_BASE_URL}/api/storage/folders?${queryParams.toString()}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch storage folders: ${response.statusText}`);
  }

  return response.json();
}
