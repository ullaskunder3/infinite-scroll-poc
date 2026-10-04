import { API_BASE_URL } from './config';

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
    throw new Error(errorData?.error?.message || `HTTP ${response.status}`);
  }

  return response.json();
}
