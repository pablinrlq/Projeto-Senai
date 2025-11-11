#!/usr/bin/env bun
/**
 * Test script to verify token creation and verification
 * Run with: bun run scripts/test-tokens.ts
 */

import { createSessionToken, verifySessionToken } from '../lib/firebase/admin';

async function testTokens() {
  try {
    console.log('🧪 Testing token creation and verification...\n');

    // Test user ID
    const testUserId = 'test-user-123';

    // Create a token
    console.log('1. Creating session token...');
    const token = await createSessionToken(testUserId);
    console.log('✅ Token created successfully');
    console.log('Token:', token.substring(0, 50) + '...\n');

    // Verify the token
    console.log('2. Verifying session token...');
    const decodedToken = await verifySessionToken(token);

    if (decodedToken) {
      console.log('✅ Token verified successfully');
      console.log('Decoded payload:', {
        uid: decodedToken.uid,
        sessionId: decodedToken.sessionId,
        timestamp: new Date(decodedToken.timestamp as number).toISOString(),
        expiresAt: new Date((decodedToken.exp as number) * 1000).toISOString()
      });
    } else {
      console.log('❌ Token verification failed');
    }

    // Test with invalid token
    console.log('\n3. Testing with invalid token...');
    const invalidToken = await verifySessionToken('invalid-token');
    if (invalidToken === null) {
      console.log('✅ Invalid token correctly rejected');
    } else {
      console.log('❌ Invalid token was accepted (this should not happen)');
    }

    console.log('\n🎉 Token testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testTokens()
  .then(() => {
    console.log('Script completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
