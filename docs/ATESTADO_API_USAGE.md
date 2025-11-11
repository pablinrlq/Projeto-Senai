# Atestado API - FormData Usage

## POST /api/atestados

This endpoint now accepts FormData with the following fields:

### Required Fields:
- `data_inicio` (string): Start date in ISO format or parseable date string
- `data_fim` (string): End date in ISO format or parseable date string  
- `motivo` (string): Reason for the medical certificate (minimum 5 characters)

### Optional Fields:
- `status` (string): Status of the certificate - 'pendente', 'aprovado', or 'rejeitado' (defaults to 'pendente')
- `imagem_atestado` (File): Image file of the medical certificate

### Example Usage:

#### JavaScript/TypeScript (Frontend)
```typescript
const formData = new FormData();
formData.append('data_inicio', '2025-11-04');
formData.append('data_fim', '2025-11-06');
formData.append('motivo', 'Consulta médica de rotina');
formData.append('status', 'pendente');

// Add image file from input
const fileInput = document.getElementById('image') as HTMLInputElement;
if (fileInput.files && fileInput.files[0]) {
  formData.append('imagem_atestado', fileInput.files[0]);
}

const response = await fetch('/api/atestados', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`, // Your auth token
  },
  body: formData,
});

const result = await response.json();
```

#### cURL Example
```bash
curl -X POST \
  http://localhost:3000/api/atestados \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "data_inicio=2025-11-04" \
  -F "data_fim=2025-11-06" \
  -F "motivo=Consulta médica de rotina" \
  -F "status=pendente" \
  -F "imagem_atestado=@path/to/your/image.jpg"
```

### Response:
```json
{
  "success": true,
  "message": "Atestado criado com sucesso",
  "data": {
    "id": "generated-document-id"
  }
}
```

### Error Response:
```json
{
  "error": "Dados inválidos",
  "details": [
    "motivo: Motivo deve ter pelo menos 5 caracteres"
  ]
}
```

## Notes:

1. **Authentication Required**: All requests must include a valid authorization token
2. **File Upload**: Images are automatically uploaded to Firebase Storage
3. **File Types**: Common image formats (jpg, png, gif, etc.) are supported
4. **File Size**: Consider implementing file size limits in production
5. **Storage Path**: Images are stored as `atestados/{userId}/{uuid}.{extension}`
6. **Public URLs**: Uploaded images are made publicly accessible via Google Cloud Storage URLs

## Database Structure:

The atestado document will be saved with:
```typescript
{
  id_usuario: string,           // User ID from auth
  data_inicio: Timestamp,       // Start date as Firebase Timestamp
  data_fim: Timestamp,          // End date as Firebase Timestamp  
  motivo: string,              // Reason
  imagem_atestado: string,     // Public URL of uploaded image
  imagem_path: string,         // Storage path for potential deletion
  status: string,              // 'pendente', 'aprovado', or 'rejeitado'
  createdAt: Timestamp,        // Creation timestamp
}
```
