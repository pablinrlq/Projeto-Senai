'use client';

/**
 * Client-side authentication utilities
 */

export const AUTH_TOKEN_KEY = 'token';

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Make an authenticated API request
 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

/**
 * Check if user is authenticated by calling the API
 */
export const checkAuthStatus = async (): Promise<{
  isAuthenticated: boolean;
  user?: {
    id: string;
    nome: string;
    email: string;
    cargo: string;
  };
}> => {
  try {
    const response = await fetchWithAuth('/api/users/me');
    if (response.ok) {
      const data = await response.json();
      return {
        isAuthenticated: true,
        user: data.data
      };
    }
    return { isAuthenticated: false };
  } catch {
    return { isAuthenticated: false };
  }
};
