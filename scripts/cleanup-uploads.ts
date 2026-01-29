import * as fs from "fs-extra";
import * as path from "path";

interface CleanupOptions {
  daysOld: number;
  dryRun: boolean;
}

async function cleanupOldUploads(
  options: CleanupOptions = { daysOld: 30, dryRun: true }
) {
  console.log("🧹 Starting cleanup of old uploaded files...\n");
  console.log(`📊 Configuration:`);
  console.log(`   - Files older than: ${options.daysOld} days`);
  console.log(
    `   - Dry run mode: ${
      options.dryRun
        ? "ON (no files will be deleted)"
        : "OFF (files will be deleted)"
    }\n`
  );

  try {
    const uploadsPath = path.join(process.cwd(), "public", "uploads");

    if (!(await fs.pathExists(uploadsPath))) {
      console.log("📁 No uploads directory found. Nothing to clean up.");
      return;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - options.daysOld);

    let totalFiles = 0;
    let oldFiles = 0;
    let deletedFiles = 0;
    let totalSize = 0;
    let deletedSize = 0;

    async function processDirectory(dir: string): Promise<void> {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await processDirectory(fullPath);
        } else if (entry.isFile() && entry.name !== ".gitkeep") {
          totalFiles++;
          const stats = await fs.stat(fullPath);
          totalSize += stats.size;

          if (stats.mtime < cutoffDate) {
            oldFiles++;
            deletedSize += stats.size;

            console.log(
              `🗑️  ${
                options.dryRun ? "[DRY RUN] Would delete:" : "Deleting:"
              } ${path.relative(uploadsPath, fullPath)} (${formatFileSize(
                stats.size
              )}, modified: ${stats.mtime.toLocaleDateString()})`
            );

            if (!options.dryRun) {
              await fs.remove(fullPath);
              deletedFiles++;
            }
          }
        }
      }
    }

    await processDirectory(uploadsPath);

    console.log("\n📈 Cleanup Summary:");
    console.log(
      `   - Total files found: ${totalFiles} (${formatFileSize(totalSize)})`
    );
    console.log(
      `   - Old files identified: ${oldFiles} (${formatFileSize(deletedSize)})`
    );

    if (options.dryRun) {
      console.log(`   - Files that would be deleted: ${oldFiles}`);
      console.log(`\n💡 To actually delete files, run with --no-dry-run flag`);
    } else {
      console.log(`   - Files actually deleted: ${deletedFiles}`);
      console.log(`   - Space freed: ${formatFileSize(deletedSize)}`);
    }
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

const args = process.argv.slice(2);
const daysOld = parseInt(
  args.find((arg) => arg.startsWith("--days="))?.split("=")[1] || "30"
);
const dryRun = !args.includes("--no-dry-run");

cleanupOldUploads({ daysOld, dryRun })
  .then(() => {
    console.log("\n✅ Cleanup script completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Cleanup script failed:", error);
    process.exit(1);
  });
