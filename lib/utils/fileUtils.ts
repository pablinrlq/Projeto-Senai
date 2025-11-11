import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Ensures that the uploads directory structure exists in the public folder
 */
export async function ensureUploadsDirectory(): Promise<void> {
  try {
    const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
    const atestadosPath = path.join(uploadsPath, 'atestados');

    // Ensure the base uploads directory exists
    await fs.ensureDir(uploadsPath);
    await fs.ensureDir(atestadosPath);

    // Create a gitkeep file to ensure the directory is tracked in git
    const gitkeepPath = path.join(atestadosPath, '.gitkeep');
    if (!(await fs.pathExists(gitkeepPath))) {
      await fs.writeFile(gitkeepPath, '# This file ensures the directory is tracked in git\n');
    }

    console.log('✅ Uploads directory structure verified');
  } catch (error) {
    console.error('❌ Error setting up uploads directory:', error);
  }
}
