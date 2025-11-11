#!/usr/bin/env bun
/**
 * Setup script to prepare the application for file uploads
 * Run with: bun run scripts/setup-uploads.ts
 */

import { ensureUploadsDirectory } from '../lib/utils/fileUtils';

async function setupUploads() {
  console.log('🚀 Setting up uploads directory structure...\n');

  try {
    await ensureUploadsDirectory();
    console.log('\n✅ Upload setup completed successfully!');
    console.log('📁 Public uploads directory structure is ready');
    console.log('🔗 Files will be accessible at: /uploads/atestados/{userId}/{filename}');
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupUploads()
  .then(() => {
    console.log('\n🎉 Setup script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup script failed:', error);
    process.exit(1);
  });
