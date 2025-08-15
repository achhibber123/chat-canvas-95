import { ApiRequest, ApiResponse, HealthResponse } from './types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchJSON<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function postAnswer(request: ApiRequest): Promise<ApiResponse> {
  return fetchJSON<ApiResponse>('/answer', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getHealth(): Promise<HealthResponse> {
  return fetchJSON<HealthResponse>('/health');
}

export { ApiError };