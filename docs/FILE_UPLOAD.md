# File Upload System

This application supports two file storage methods for atestado images:

## 1. External Storage (Firebase Storage)
When `HAS_STORAGE_BUCKET=true` in environment variables:
- Files are uploaded to Firebase Storage
- Images are made publicly accessible
- URLs are in format: `https://storage.googleapis.com/{bucket}/{path}`

## 2. Local Public Folder Storage
When `HAS_STORAGE_BUCKET=false` or not set:
- Files are uploaded to `/public/uploads/atestados/{userId}/`
- Images are accessible via Next.js static file serving
- URLs are in format: `/uploads/atestados/{userId}/{filename}`

## Setup

### Initial Setup
Run the setup script to create the required directory structure:
```bash
bun run setup-uploads
```

This creates:
- `/public/uploads/atestados/` directory
- `.gitkeep` files to ensure directories are tracked in git

### File Validation
The system validates:
- **File Type**: Only JPEG, PNG, and WEBP images are allowed
- **File Size**: Maximum 10MB per file
- **Unique Names**: Files are renamed with UUIDs to prevent conflicts

## Maintenance

### Cleanup Old Files
Remove files older than 30 days (dry run by default):
```bash
# Dry run (shows what would be deleted)
bun run cleanup-uploads

# Delete files older than 30 days
bun run cleanup-uploads --no-dry-run

# Delete files older than 7 days
bun run cleanup-uploads --days=7 --no-dry-run
```

## Security Considerations

### Public Folder Method
- ✅ Files are served directly by Next.js
- ✅ No additional authentication required for viewing
- ⚠️ Files are publicly accessible if URL is known
- ⚠️ Requires manual cleanup of old files

### Firebase Storage Method
- ✅ Files can be made private with proper rules
- ✅ Built-in CDN and global distribution
- ✅ Automatic cleanup capabilities
- ✅ Better scalability

## Environment Variables

```env
# Set to 'true' to use Firebase Storage, 'false' or omit to use public folder
HAS_STORAGE_BUCKET=false
```

## File Structure

```
public/
├── uploads/
│   └── atestados/
│       ├── .gitkeep
│       ├── user-id-1/
│       │   ├── uuid-1.jpg
│       │   └── uuid-2.png
│       └── user-id-2/
│           └── uuid-3.webp
```

## API Usage

The file upload is handled automatically when creating an atestado:

```typescript
// FormData with image file
const formData = new FormData();
formData.append('data_inicio', '2025-01-01');
formData.append('data_fim', '2025-01-02');
formData.append('motivo', 'Medical leave');
formData.append('imagem_atestado', imageFile);

const response = await fetch('/api/atestados', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

The response will include the image URL:
```json
{
  "success": true,
  "message": "Atestado criado com sucesso",
  "data": {
    "id": "doc-id",
    "imageUrl": "/uploads/atestados/user-id/uuid.jpg"
  }
}
```
