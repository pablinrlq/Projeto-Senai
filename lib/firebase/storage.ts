import { storage } from './admin';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs-extra';
import * as path from 'path';

export async function uploadImageToStorage(
  file: File,
  userId: string,
  folder: string = 'atestados'
): Promise<{ url: string; path: string }> {
  try {
    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${folder}/${userId}/${uuidv4()}.${fileExtension}`;

    // Get Firebase Storage bucket
    const bucket = storage.bucket();
    const fileRef = bucket.file(fileName);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload file
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // Make file publicly accessible
    await fileRef.makePublic();

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return {
      url: publicUrl,
      path: fileName,
    };
  } catch (error) {
    console.error('Error uploading file to Firebase Storage:', error);
    throw new Error('Failed to upload image');
  }
}

export async function uploadImageToPublicFolder(
  file: File,
  userId: string,
  folder: string = 'atestados'
): Promise<{ url: string; path: string }> {
  try {
    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const relativePath = `uploads/${folder}/${userId}`;
    const fullPath = path.join(process.cwd(), 'public', relativePath);
    const filePath = path.join(fullPath, fileName);

    // Ensure directory exists
    await fs.ensureDir(fullPath);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write file to public folder
    await fs.writeFile(filePath, buffer);

    // Return public URL (accessible via /uploads/...)
    const publicUrl = `/${relativePath}/${fileName}`;
    const storagePath = `${relativePath}/${fileName}`;

    return {
      url: publicUrl,
      path: storagePath,
    };
  } catch (error) {
    console.error('Error uploading file to public folder:', error);
    throw new Error('Failed to upload image to public folder');
  }
}

export async function deleteImageFromPublicFolder(filePath: string): Promise<void> {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    await fs.remove(fullPath);
  } catch (error) {
    console.error('Error deleting file from public folder:', error);
    throw new Error('Failed to delete image from public folder');
  }
}

export async function deleteImageFromStorage(filePath: string): Promise<void> {
  try {
    const bucket = storage.bucket();
    const fileRef = bucket.file(filePath);
    await fileRef.delete();
  } catch (error) {
    console.error('Error deleting file from Firebase Storage:', error);
    throw new Error('Failed to delete image');
  }
}
