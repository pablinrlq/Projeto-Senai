# CreateAtestadoForm - React Hook Form + TanStack Query Implementation

## Overview

The `CreateAtestadoForm` component has been updated to use React Hook Form with Zod validation and TanStack Query for better form handling, validation, caching, and user experience.

## Features

✅ **React Hook Form Integration**: Better form state management and performance  
✅ **Zod Validation**: Type-safe validation with automatic error messages  
✅ **TanStack Query**: Advanced caching, background updates, and optimistic updates  
✅ **File Upload Support**: Handles image file uploads with proper FormData  
✅ **Custom Hook**: Reusable logic with `useCreateAtestado`  
✅ **shadcn/ui Components**: Consistent UI with form components  
✅ **Error Handling**: Comprehensive error states and messages  
✅ **Loading States**: Visual feedback during form submission  
✅ **Automatic Cache Invalidation**: Lists update automatically after mutations  
✅ **Background Refetching**: Data stays fresh with automatic updates  

## Components Structure

### CreateAtestadoForm
Main form component with React Hook Form integration.

```tsx
interface CreateAtestadoFormProps {
  onSuccess?: () => void;
}
```

### useCreateAtestado Hook
Custom hook for atestado creation logic.

```tsx
interface UseCreateAtestadoResult {
  createAtestado: (data: CreateAtestadoData) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: string | null;
  resetStatus: () => void;
}
```

## Usage Examples

### Basic Usage
```tsx
import { CreateAtestadoForm } from '@/components/CreateAtestadoForm';

export default function MyPage() {
  const handleSuccess = () => {
    console.log('Atestado created successfully!');
  };

  return <CreateAtestadoForm onSuccess={handleSuccess} />;
}
```

### With Router Navigation
```tsx
import { CreateAtestadoForm } from '@/components/CreateAtestadoForm';
import { useRouter } from 'next/navigation';

export default function CreateAtestadoPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/dashboard/atestados');
  };

  return (
    <div className="container mx-auto py-8">
      <CreateAtestadoForm onSuccess={handleSuccess} />
    </div>
  );
}
```

### Using the Custom Hook Separately
```tsx
import { useCreateAtestado } from '@/hooks/use-create-atestado';

export default function CustomForm() {
  const { createAtestado, loading, error, success } = useCreateAtestado();

  const handleSubmit = async () => {
    try {
      await createAtestado({
        data_inicio: '2025-11-04',
        data_fim: '2025-11-06',
        motivo: 'Consulta médica',
        status: 'pendente',
        imagem_atestado: fileFromInput,
      });
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div>
      {/* Your custom form implementation */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Creating...' : 'Create Atestado'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
}
```

### With TanStack Query Data Fetching
```tsx
import { CreateAtestadoForm } from '@/components/CreateAtestadoForm';
import { useAtestadosWithFormData } from '@/hooks/use-api';

export default function AtestadosPage() {
  const { 
    atestados, 
    loading, 
    error, 
    isAddingAtestado,
    isSuccess 
  } = useAtestadosWithFormData();

  const handleSuccess = () => {
    // List automatically updates thanks to cache invalidation
    console.log('Atestado created and list updated!');
  };

  return (
    <div className="space-y-8">
      <CreateAtestadoForm onSuccess={handleSuccess} />
      
      {/* Status indicators */}
      {isAddingAtestado && <div>Creating atestado...</div>}
      {isSuccess && <div>Atestado created successfully!</div>}
      
      {/* Atestados list - automatically updated */}
      {loading ? (
        <div>Loading atestados...</div>
      ) : (
        <div>
          {atestados.map(atestado => (
            <div key={atestado.id}>{atestado.motivo}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Form Fields

| Field             | Type   | Required | Validation                          |
| ----------------- | ------ | -------- | ----------------------------------- |
| `data_inicio`     | Date   | Yes      | Valid date string                   |
| `data_fim`        | Date   | Yes      | Valid date string                   |
| `motivo`          | Text   | Yes      | Minimum 5 characters                |
| `status`          | Select | No       | 'pendente', 'aprovado', 'rejeitado' |
| `imagem_atestado` | File   | No       | Image files only                    |

## Validation Schema

The form uses the `CreateAtestadoSchema` from Zod:

```typescript
export const CreateAtestadoSchema = z.object({
  data_inicio: z.string().min(1, 'Data de início é obrigatória'),
  data_fim: z.string().min(1, 'Data de fim é obrigatória'),
  motivo: z.string().min(5, 'Motivo deve ter pelo menos 5 caracteres'),
  status: z.enum(['pendente', 'aprovado', 'rejeitado']).default('pendente'),
  imagem_atestado: z.union([z.instanceof(File), z.string()]).optional(),
});
```

## Error Handling

The form provides comprehensive error handling at multiple levels:

1. **Field Validation**: Real-time validation with Zod schema
2. **API Errors**: Server-side validation and error responses
3. **Network Errors**: Connection and request failures
4. **File Upload Errors**: Image upload specific errors

## File Upload Handling

The form properly handles file uploads by:

1. Converting form data to FormData for multipart uploads
2. Only appending files when they exist
3. Validating file types on the client side
4. Providing user feedback for upload progress

## API Integration

The form integrates with the `/api/atestados` endpoint:

- **Method**: POST
- **Content-Type**: multipart/form-data
- **Authentication**: Uses existing auth middleware
- **Response**: JSON with success/error status

## Accessibility

The form includes proper accessibility features:

- **Labels**: All fields have associated labels
- **ARIA**: Proper ARIA attributes for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Error Announcements**: Screen reader friendly error messages
- **Focus Management**: Proper focus handling

## Styling

Uses shadcn/ui components with Tailwind CSS:

- **Responsive**: Mobile-friendly layout
- **Consistent**: Matches design system
- **Customizable**: Easy to theme and modify
- **Dark Mode**: Supports dark/light mode switching

## Best Practices

1. **Separation of Concerns**: Business logic in custom hook
2. **Type Safety**: Full TypeScript support
3. **Reusability**: Modular components and hooks
4. **Performance**: Optimized re-renders with React Hook Form
5. **User Experience**: Loading states and success feedback

## Testing

To test the form:

1. **Unit Tests**: Test individual components and hooks
2. **Integration Tests**: Test form submission flow
3. **E2E Tests**: Test complete user journey
4. **Accessibility Tests**: Ensure WCAG compliance

```typescript
// Example test
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateAtestadoForm } from '@/components/CreateAtestadoForm';

test('submits form with valid data', async () => {
  render(<CreateAtestadoForm />);
  
  fireEvent.change(screen.getByLabelText('Motivo'), {
    target: { value: 'Consulta médica' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /criar atestado/i }));
  
  // Assert expected behavior
});
```

## TanStack Query Integration

The hook now uses TanStack Query (React Query) for better data management:

### Benefits:
- **Automatic Caching**: Responses are cached and reused
- **Background Updates**: Data refreshes automatically
- **Optimistic Updates**: UI updates immediately, then syncs with server
- **Error Handling**: Built-in retry logic and error states
- **Loading States**: Granular loading indicators
- **Cache Invalidation**: Related queries update after mutations

### Hook Implementation:
```typescript
export function useCreateAtestado(): UseCreateAtestadoResult {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createAtestadoWithFormData,
    onSuccess: () => {
      // Invalidate related queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['atestados'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    createAtestado: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
    success: mutation.isSuccess,
    reset: mutation.reset,
  };
}
```

### Query Keys Strategy:
- `['atestados']` - All atestados
- `['atestados', userId]` - User-specific atestados
- `['users']` - User list (invalidated when stats might change)
