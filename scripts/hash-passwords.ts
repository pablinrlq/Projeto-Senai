import { db, hashPassword } from "../lib/firebase/admin";

async function hashExistingPasswords() {
  try {
    console.log("Starting password hashing process...");

    const usersSnapshot = await db.collection("users").get();

    if (usersSnapshot.empty) {
      console.log("No users found in the database.");
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

        if (
          plainPassword &&
          typeof plainPassword === "string" &&
          !plainPassword.startsWith("$argon2")
        ) {
          console.log(`Processing user: ${userData.email}`);

          const hashedPassword = await hashPassword(plainPassword);

          await db
            .collection("users")
            .doc(userDoc.id)
            .update({
              senha: hashedPassword,
              updatedAt: new Date().toISOString(),
            } as any);

          console.log(`✅ Updated password for: ${userData.email}`);
          processedCount++;
        } else {
          console.log(
            `⏭️  Skipping user ${userData.email} (password already hashed or missing)`
          );
        }
      } catch (error) {
        console.error(`❌ Error processing user ${userDoc.id}:`, error);
        errorCount++;
      }
    }

    console.log("\n=== Password Hashing Complete ===");
    console.log(`✅ Successfully processed: ${processedCount} users`);
    console.log(`❌ Errors encountered: ${errorCount} users`);
  } catch (error) {
    console.error("Fatal error during password hashing:", error);
    process.exit(1);
  }
}

hashExistingPasswords()
  .then(() => {
    console.log("Script completed successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
