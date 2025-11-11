'use client';

import { useState, useEffect } from 'react';
import { User, Atestado, CreateUserData, CreateAtestadoData, FirebaseResult } from '@/types/firebase';

// Hook for users using API routes
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setUsers(result.data);
          setError(null);
        } else {
          setError(result.error || 'Failed to fetch users');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // Set up polling for real-time-like updates (optional)
    const interval = setInterval(fetchUsers, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const addUser = async (userData: CreateUserData): Promise<FirebaseResult> => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh users list after successful addition
        const refreshResponse = await fetch('/api/users');
        if (refreshResponse.ok) {
          const refreshResult = await refreshResponse.json();
          if (refreshResult.success) {
            setUsers(refreshResult.data);
          }
        }
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error adding user:', error);
      return { success: false, error: 'Failed to add user' };
    }
  };

  return { users, loading, error, addUser };
}

// Hook for atestados using API routes
export function useAtestados(userId?: string) {
  const [atestados, setAtestados] = useState<Atestado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAtestados = async () => {
      try {
        setLoading(true);

        // Build query parameters
        const params = new URLSearchParams();
        if (userId) {
          params.append('userId', userId);
        }

        const url = `/api/atestados${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setAtestados(result.data);
          setError(null);
        } else {
          setError(result.error || 'Failed to fetch atestados');
        }
      } catch (err) {
        console.error('Error fetching atestados:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch atestados');
      } finally {
        setLoading(false);
      }
    };

    fetchAtestados();

    // Set up polling for real-time-like updates (optional)
    const interval = setInterval(fetchAtestados, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [userId]);

  const addAtestado = async (atestadoData: CreateAtestadoData): Promise<FirebaseResult> => {
    try {
      const response = await fetch('/api/atestados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(atestadoData),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh atestados list after successful addition
        const params = new URLSearchParams();
        if (userId) {
          params.append('userId', userId);
        }

        const refreshUrl = `/api/atestados${params.toString() ? `?${params.toString()}` : ''}`;
        const refreshResponse = await fetch(refreshUrl);
        if (refreshResponse.ok) {
          const refreshResult = await refreshResponse.json();
          if (refreshResult.success) {
            setAtestados(refreshResult.data);
          }
        }
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error adding atestado:', error);
      return { success: false, error: 'Failed to add atestado' };
    }
  };

  return { atestados, loading, error, addAtestado };
}

// These hooks now use Next.js API routes instead of direct Firebase client operations
// This provides better security, server-side validation, and cleaner separation of concerns
