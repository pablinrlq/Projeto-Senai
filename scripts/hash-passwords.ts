#!/usr/bin/env bun
/**
 * Utility script to hash existing plain text passwords in the database
 * Run with: bun run scripts/hash-passwords.ts
 */

import { db, hashPassword } from '../lib/firebase/admin';

async function hashExistingPasswords() {
  try {
    console.log('Starting password hashing process...');

    // Get all users from the database
    const usersSnapshot = await db.collection('users').get();

    if (usersSnapshot.empty) {
      console.log('No users found in the database.');
      return;
    }

    console.log(`Found ${usersSnapshot.size} users to process.`);

    let processedCount = 0;
    let errorCount = 0;

    // Process each user
    for (const userDoc of usersSnapshot.docs) {
      try {
        const userData = userDoc.data();
        const plainPassword = userData.senha;

        // Skip if password is already hashed (check if it starts with $argon2)
        if (plainPassword && typeof plainPassword === 'string' && !plainPassword.startsWith('$argon2')) {
          console.log(`Processing user: ${userData.email}`);

          // Hash the plain text password
          const hashedPassword = await hashPassword(plainPassword);

          // Update the user document with the hashed password
          await userDoc.ref.update({
            senha: hashedPassword,
            updatedAt: new Date().toISOString()
          });

          console.log(`✅ Updated password for: ${userData.email}`);
          processedCount++;
        } else {
          console.log(`⏭️  Skipping user ${userData.email} (password already hashed or missing)`);
        }
      } catch (error) {
        console.error(`❌ Error processing user ${userDoc.id}:`, error);
        errorCount++;
      }
    }

    console.log('\n=== Password Hashing Complete ===');
    console.log(`✅ Successfully processed: ${processedCount} users`);
    console.log(`❌ Errors encountered: ${errorCount} users`);

  } catch (error) {
    console.error('Fatal error during password hashing:', error);
    process.exit(1);
  }
}

// Run the script
hashExistingPasswords()
  .then(() => {
    console.log('Script completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
