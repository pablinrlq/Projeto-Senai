// Firebase configuration exports
export { app, db, storage } from './client';
export { getFirebaseAdmin, firebaseAdmin, db as adminDb } from './admin';
export { withFirebaseAdmin, safeFirestoreOperation } from './middleware';
