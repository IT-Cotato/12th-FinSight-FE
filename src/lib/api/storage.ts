// 보관함(Storage) API 관련 함수들

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || null;

/**
 * 액세스 토큰을 가져옵니다.
 */
function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
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
  itemCount: number;
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

export type CreateStorageFolderRequest = {
  folderType: string;
  folderName: string;
};

export type CreateStorageFolderResponse = {
  status: string;
  data: StorageFolder;
};

/**
 * 보관함 폴더 생성
 * @param folderType 폴더 타입 (TERM, NEWS)
 * @param folderName 폴더 이름
 * @returns 생성된 폴더 응답
 */
export async function createStorageFolder(
  folderType: string,
  folderName: string
): Promise<CreateStorageFolderResponse> {
  const requestBody: CreateStorageFolderRequest = {
    folderType,
    folderName,
  };

  const response = await fetch(`${API_BASE_URL}/api/storage/folders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Failed to create storage folder: ${response.statusText}`);
  }

  return response.json();
}

export type SaveTermToStorageRequest = {
  termId: number;
  folderIds: number[];
};

export type SaveTermToStorageResponse = {
  status: string;
  message?: string;
};

/**
 * 보관함에 단어 저장
 * @param termId 단어 ID
 * @param folderIds 폴더 ID 배열
 * @returns 저장 응답
 */
export async function saveTermToStorage(
  termId: number,
  folderIds: number[]
): Promise<SaveTermToStorageResponse> {
  const requestBody: SaveTermToStorageRequest = {
    termId,
    folderIds,
  };

  const response = await fetch(`${API_BASE_URL}/api/storage/terms`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Failed to save term to storage: ${response.statusText}`);
  }

  return response.json();
}

export type SaveNewsToStorageRequest = {
  articleId: number;
  folderIds: number[];
};

export type SaveNewsToStorageResponse = {
  status: string;
  message?: string;
};

/**
 * 보관함에 뉴스 저장
 * @param articleId 뉴스 기사 ID
 * @param folderIds 폴더 ID 배열
 * @returns 저장 응답
 */
export async function saveNewsToStorage(
  articleId: number,
  folderIds: number[]
): Promise<SaveNewsToStorageResponse> {
  const requestBody: SaveNewsToStorageRequest = {
    articleId,
    folderIds,
  };

  const response = await fetch(`${API_BASE_URL}/api/storage/news`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Failed to save news to storage: ${response.statusText}`);
  }

  return response.json();
}

export type StorageFoldersByItemResponse = {
  status: string;
  data: StorageFolder[];
};

/**
 * 아이템이 저장된 폴더 목록 조회
 * @param itemId 아이템 ID (뉴스 ID 또는 단어 ID)
 * @param type 아이템 타입 (TERM, NEWS)
 * @returns 저장된 폴더 목록 응답
 */
export async function getStorageFoldersByItemId(
  itemId: number,
  type: string = "NEWS"
): Promise<StorageFoldersByItemResponse> {
  const queryParams = new URLSearchParams({ type });
  
  const response = await fetch(
    `${API_BASE_URL}/api/storage/folders/items/${itemId}?${queryParams.toString()}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch storage folders by item id: ${response.statusText}`);
  }

  return response.json();
}