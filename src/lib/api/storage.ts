// 보관함(Storage) API 관련 함수들

import { authenticatedFetch, getAuthHeaders } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || null;

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
  
  const response = await authenticatedFetch(
    `${API_BASE_URL}/api/storage/folders?${queryParams.toString()}`,
    {
      method: "GET",
    }
  );

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

  const response = await authenticatedFetch(`${API_BASE_URL}/api/storage/folders`, {
    method: "POST",
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

  const response = await authenticatedFetch(`${API_BASE_URL}/api/storage/terms`, {
    method: "POST",
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

  const response = await authenticatedFetch(`${API_BASE_URL}/api/storage/news`, {
    method: "POST",
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
  
  const response = await authenticatedFetch(
    `${API_BASE_URL}/api/storage/folders/items/${itemId}?${queryParams.toString()}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch storage folders by item id: ${response.statusText}`);
  }

  return response.json();
}

export type StorageNewsParams = {
  folderId: number;
  section?: string;
  page?: number;
  size?: number;
};

export type StorageNewsItem = {
  savedItemId: number;
  newsId: number;
  category: string;
  title: string;
  thumbnailUrl: string;
  savedAt: string;
};

export type StorageNewsResponse = {
  status: string;
  data: {
    news: StorageNewsItem[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
  };
};

/**
 * 보관함 폴더의 뉴스 조회
 * @param params 쿼리 파라미터 (folderId 필수)
 * @returns 폴더의 뉴스 목록 응답
 */
export async function getStorageNews(
  params: StorageNewsParams
): Promise<StorageNewsResponse> {
  const { folderId, section, page = 1, size = 4 } = params;
  
  const queryParams = new URLSearchParams({
    folderId: folderId.toString(),
    page: page.toString(),
    size: size.toString(),
  });
  
  if (section) {
    queryParams.append("section", section);
  }
  
  const response = await authenticatedFetch(`${API_BASE_URL}/api/storage/news?${queryParams.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch storage news: ${response.statusText}`);
  }

  return response.json();
}

export type DeleteNewsFromStorageResponse = {
  status: string;
  message?: string;
};

/**
 * 보관함에서 뉴스 삭제
 * @param savedItemId 저장된 아이템 ID
 * @returns 삭제 응답
 */
export async function deleteNewsFromStorage(
  savedItemId: number
): Promise<DeleteNewsFromStorageResponse> {
  const response = await authenticatedFetch(
    `${API_BASE_URL}/api/storage/news/${savedItemId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete news from storage: ${response.statusText}`);
  }

  return response.json();
}

export type DeleteTermFromStorageResponse = {
  status: string;
  message?: string;
};

/**
 * 보관함에서 용어 삭제
 * @param savedItemId 저장된 아이템 ID
 * @returns 삭제 응답
 */
export async function deleteTermFromStorage(
  savedItemId: number
): Promise<DeleteTermFromStorageResponse> {
  const response = await authenticatedFetch(
    `${API_BASE_URL}/api/storage/terms/${savedItemId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete term from storage: ${response.statusText}`);
  }

  return response.json();
}

export type DeleteStorageFolderResponse = {
  status: string;
  message?: string;
};

/**
 * 보관함 폴더 삭제
 * @param folderId 폴더 ID
 * @returns 삭제 응답
 */
export async function deleteStorageFolder(
  folderId: number
): Promise<DeleteStorageFolderResponse> {
  const response = await authenticatedFetch(
    `${API_BASE_URL}/api/storage/folders/${folderId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete storage folder: ${response.statusText}`);
  }

  return response.json();
}

export type UpdateStorageFolderRequest = {
  folderName: string;
};

export type UpdateStorageFolderResponse = {
  status: string;
  data: StorageFolder;
};

/**
 * 보관함 폴더 수정
 * @param folderId 폴더 ID
 * @param folderName 새 폴더 이름
 * @returns 수정된 폴더 응답
 */
export async function updateStorageFolder(
  folderId: number,
  folderName: string
): Promise<UpdateStorageFolderResponse> {
  const requestBody: UpdateStorageFolderRequest = {
    folderName,
  };

  const response = await authenticatedFetch(
    `${API_BASE_URL}/api/storage/folders/${folderId}`,
    {
      method: "PUT",
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update storage folder: ${response.statusText}`);
  }

  return response.json();
}

export type StorageFolderOrderItem = {
  folderId: number;
  sortOrder: number;
};

export type UpdateStorageFolderOrderRequest = {
  folderType: string;
  folders: StorageFolderOrderItem[];
};

export type UpdateStorageFolderOrderResponse = {
  status: string;
  data: StorageFolder[];
};

/**
 * 보관함 폴더 순서 업데이트
 * @param folderType 폴더 타입 (TERM, NEWS)
 * @param folders 폴더 순서 배열
 * @returns 업데이트 응답
 */
export async function updateStorageFolderOrder(
  folderType: string,
  folders: StorageFolderOrderItem[]
): Promise<UpdateStorageFolderOrderResponse> {
  const requestBody: UpdateStorageFolderOrderRequest = {
    folderType,
    folders,
  };

  const response = await authenticatedFetch(
    `${API_BASE_URL}/api/storage/folders/order`,
    {
      method: "PUT",
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update storage folder order: ${response.statusText}`);
  }

  return response.json();
}

export type StorageNewsSearchParams = {
  folderId: number;
  q: string;
  page?: number;
  size?: number;
};

export type StorageNewsSearchItem = {
  savedItemId: number;
  newsId: number;
  category: string;
  title: string;
  thumbnailUrl: string;
  savedAt: string;
};

export type StorageNewsSearchResponse = {
  status: string;
  data: {
    news: StorageNewsSearchItem[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
  };
};

/**
 * 저장된 뉴스 검색
 * @param params 검색 파라미터 (folderId 필수)
 * @returns 검색 결과 응답
 */
export async function searchStorageNews(
  params: StorageNewsSearchParams
): Promise<StorageNewsSearchResponse> {
  const { folderId, q, page = 1, size = 12 } = params;

  const queryParams = new URLSearchParams({
    folderId: folderId.toString(),
    q,
    page: page.toString(),
    size: size.toString(),
  });

  const response = await authenticatedFetch(
    `${API_BASE_URL}/api/storage/news/search?${queryParams.toString()}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to search storage news: ${response.statusText}`);
  }

  return response.json();
}

export type StorageTermItem = {
  savedItemId: number;
  termId: number;
  term: string;
  description: string;
  savedAt: string;
};

export type StorageTermsParams = {
  folderId: number;
  page?: number;
  size?: number;
};

export type StorageTermsResponse = {
  status: string;
  data: {
    terms: StorageTermItem[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
  };
};

/**
 * 보관함 폴더의 용어 조회
 * @param params 쿼리 파라미터 (folderId 필수)
 * @returns 폴더의 용어 목록 응답
 */
export async function getStorageTerms(
  params: StorageTermsParams
): Promise<StorageTermsResponse> {
  const { folderId, page = 1, size = 10 } = params;
  
  const queryParams = new URLSearchParams({
    folderId: folderId.toString(),
    page: page.toString(),
    size: size.toString(),
  });
  
  const response = await authenticatedFetch(`${API_BASE_URL}/api/storage/terms?${queryParams.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch storage terms: ${response.statusText}`);
  }

  return response.json();
}