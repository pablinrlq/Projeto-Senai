import * as fs from "fs-extra";
import * as path from "path";

export async function ensureUploadsDirectory(): Promise<void> {
  try {
    const uploadsPath = path.join(process.cwd(), "public", "uploads");
    const atestadosPath = path.join(uploadsPath, "atestados");

    await fs.ensureDir(uploadsPath);
    await fs.ensureDir(atestadosPath);

    const gitkeepPath = path.join(atestadosPath, ".gitkeep");
    if (!(await fs.pathExists(gitkeepPath))) {
      await fs.writeFile(
        gitkeepPath,
        "# This file ensures the directory is tracked in git\n"
      );
    }

    console.log("✅ Uploads directory structure verified");
  } catch (error) {
    console.error("❌ Error setting up uploads directory:", error);
  }
}
