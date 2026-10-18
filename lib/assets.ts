import { statSync } from "node:fs";
import path from "node:path";

export function publicAssetExists(
  assetPath: string | undefined,
  publicDir: string = path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    "public",
  ),
): assetPath is string {
  if (!assetPath) return false;
  try {
    return statSync(
      path.join(/*turbopackIgnore: true*/ publicDir, assetPath),
    ).isFile();
  } catch {
    return false;
  }
}
