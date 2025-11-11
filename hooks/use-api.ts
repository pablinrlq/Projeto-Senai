'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Atestado, CreateUserData, CreateAtestadoData, FirebaseResult } from '@/types/firebase';

// API functions
const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('/api/users');

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error || 'Failed to fetch users');
  }
};

const createUser = async (userData: CreateUserData): Promise<{ id: string }> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json();

  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error || 'Failed to create user');
  }
};

// Hook for users using React Query
export function useUsers() {
  const queryClient = useQueryClient();

  // Query for fetching users
  const {
    data: users = [],
    isLoading: loading,
    error
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds for real-time feel
    refetchOnWindowFocus: true, // Refetch when user comes back to tab
  });

  // Mutation for adding users
  const addUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch users query after successful creation
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const addUser = async (userData: CreateUserData): Promise<FirebaseResult> => {
    try {
      const result = await addUserMutation.mutateAsync(userData);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error adding user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add user'
      };
    }
  };

  return {
    users,
    loading,
    error: error instanceof Error ? error.message : null,
    addUser,
    isAddingUser: addUserMutation.isPending
  };
}

const fetchAtestados = async (userId?: string): Promise<Atestado[]> => {
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
    return result.data;
  } else {
    throw new Error(result.error || 'Failed to fetch atestados');
  }
};

const createAtestado = async (atestadoData: CreateAtestadoData): Promise<{ id: string }> => {
  const response = await fetch('/api/atestados', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(atestadoData),
  });

  const result = await response.json();

  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error || 'Failed to create atestado');
  }
};

// FormData version for file uploads
const createAtestadoWithFormData = async (data: CreateAtestadoData): Promise<{ id: string }> => {
  const formData = new FormData();
  formData.append('data_inicio', data.data_inicio);
  formData.append('data_fim', data.data_fim);
  formData.append('motivo', data.motivo);
  formData.append('status', data.status);

  // Handle file upload
  if (data.imagem_atestado instanceof File) {
    formData.append('imagem_atestado', data.imagem_atestado);
  }

  const response = await fetch('/api/atestados', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error || 'Failed to create atestado');
  }
};

// Hook for atestados using React Query
export function useAtestados(userId?: string) {
  const queryClient = useQueryClient();

  // Query for fetching atestados
  const {
    data: atestados = [],
    isLoading: loading,
    error
  } = useQuery({
    queryKey: ['atestados', userId], // Include userId in query key for proper caching
    queryFn: () => fetchAtestados(userId),
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds for real-time feel
    refetchOnWindowFocus: true, // Refetch when user comes back to tab
  });

  // Mutation for adding atestados
  const addAtestadoMutation = useMutation({
    mutationFn: createAtestado,
    onSuccess: () => {
      // Invalidate and refetch relevant queries after successful creation
      queryClient.invalidateQueries({ queryKey: ['atestados'] });
      queryClient.invalidateQueries({ queryKey: ['users'] }); // In case user stats change
    },
  });

  const addAtestado = async (atestadoData: CreateAtestadoData): Promise<FirebaseResult> => {
    try {
      const result = await addAtestadoMutation.mutateAsync(atestadoData);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error adding atestado:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add atestado'
      };
    }
  };

  return {
    atestados,
    loading,
    error: error instanceof Error ? error.message : null,
    addAtestado,
    isAddingAtestado: addAtestadoMutation.isPending
  };
}

// Hook for atestados with FormData support (for file uploads)
export function useAtestadosWithFormData(userId?: string) {
  const queryClient = useQueryClient();

  // Query for fetching atestados (same as regular useAtestados)
  const {
    data: atestados = [],
    isLoading: loading,
    error
  } = useQuery({
    queryKey: ['atestados', userId],
    queryFn: () => fetchAtestados(userId),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  // Mutation for adding atestados with FormData
  const addAtestadoMutation = useMutation({
    mutationFn: createAtestadoWithFormData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atestados'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const addAtestado = async (atestadoData: CreateAtestadoData): Promise<FirebaseResult> => {
    try {
      const result = await addAtestadoMutation.mutateAsync(atestadoData);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error adding atestado:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add atestado'
      };
    }
  };

  return {
    atestados,
    loading,
    error: error instanceof Error ? error.message : null,
    addAtestado,
    isAddingAtestado: addAtestadoMutation.isPending,
    // Additional TanStack Query states
    mutationError: addAtestadoMutation.error instanceof Error ? addAtestadoMutation.error.message : null,
    isSuccess: addAtestadoMutation.isSuccess,
    reset: addAtestadoMutation.reset,
  };
}

// These hooks use React Query with Next.js API routes for optimal data management
// Benefits:
// - Automatic caching and background updates
// - Optimistic updates and error handling
// - Reduced network requests and improved performance
// - Real-time feel with automatic refetching
// - Server-side security with Firebase Admin SDK
