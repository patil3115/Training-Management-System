import type { ApiError } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Parse an error response from the API into a standardized ApiError object.
 */
async function parseErrorResponse(response: Response): Promise<ApiError> {
  try {
    const data = await response.json();
    // Handle ASP.NET Core validation error format
    if (data.errors && !data.message) {
      return {
        message: 'Validation failed.',
        errors: data.errors,
      };
    }
    return {
      message: data.message || `Request failed with status ${response.status}.`,
      errors: data.errors,
    };
  } catch {
    return { message: `Request failed with status ${response.status}.` };
  }
}

/**
 * Perform a GET request to the API.
 */
export async function apiGet<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const filteredParams = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as Record<string, string>);

    if (Object.keys(filteredParams).length > 0) {
      const searchParams = new URLSearchParams(filteredParams);
      url += `?${searchParams.toString()}`;
    }
  }

  const response = await fetch(url);

  if (!response.ok) {
    const error = await parseErrorResponse(response);
    throw error;
  }

  return response.json();
}

/**
 * Perform a POST request to the API.
 */
export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await parseErrorResponse(response);
    throw error;
  }

  return response.json();
}
