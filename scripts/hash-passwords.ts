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
        type UserRecord = { senha?: unknown; email?: unknown } & Record<
          string,
          unknown
        >;
        const userData = userDoc.data() as UserRecord;
        const plainPassword =
          typeof userData.senha === "string" ? userData.senha : undefined;
        const userEmail =
          typeof userData.email === "string" ? userData.email : userDoc.id;

        if (
          plainPassword &&
          typeof plainPassword === "string" &&
          !plainPassword.startsWith("$argon2")
        ) {
          console.log(`Processing user: ${userEmail}`);

          const hashedPassword = await hashPassword(plainPassword);

          await db.collection("users").doc(userDoc.id).update({
            senha: hashedPassword,
            updatedAt: new Date().toISOString(),
          });

          console.log(`✅ Updated password for: ${userEmail}`);
          processedCount++;
        } else {
          console.log(
            `⏭️  Skipping user ${userEmail} (password already hashed or missing)`
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
