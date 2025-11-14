// Supabase compatibility exports (keeps old import paths working)
export { app, db as clientDb, storage as clientStorage } from "./client";
export { supabase as firebaseAdmin, db, storage } from "./admin";
export { withFirebaseAdmin, safeFirestoreOperation } from "./middleware";
