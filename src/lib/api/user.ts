// 사용자 API 관련 함수들

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

export type CategoryOrderItem = {
  categoryId: number;
  code: string;
  nameKo: string;
  sortOrder: number;
};

export type CategoryOrderResponse = {
  status: string;
  data: {
    categories: CategoryOrderItem[];
  };
};

/**
 * 사용자 카테고리 순서 조회
 * @returns 카테고리 순서 응답
 */
export async function getCategoryOrder(): Promise<CategoryOrderResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users/categories/order`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch category order: ${response.statusText}`);
  }

  return response.json();
}

export type CategoryOrderUpdateItem = {
  categoryId: number;
  sortOrder: number;
};

export type CategoryOrderUpdateRequest = {
  orders: CategoryOrderUpdateItem[];
};

export type CategoryOrderUpdateResponse = {
  status: string;
  message?: string;
};

/**
 * 사용자 카테고리 순서 업데이트
 * @param orders 카테고리 순서 배열
 * @returns 업데이트 응답
 */
export async function updateCategoryOrder(
  orders: CategoryOrderUpdateItem[]
): Promise<CategoryOrderUpdateResponse> {
  const requestBody = { orders };
  console.log("카테고리 순서 업데이트 요청:", requestBody);

  const response = await fetch(`${API_BASE_URL}/api/users/categories/order`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("카테고리 순서 업데이트 실패:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });
    throw new Error(`Failed to update category order: ${response.statusText}`);
  }

  return response.json();
}
