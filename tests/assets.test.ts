import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { publicAssetExists } from "@/lib/assets";

describe("publicAssetExists", () => {
  it("is true only for files that exist in the public dir", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "public-"));
    await mkdir(path.join(dir, "projects"));
    await writeFile(path.join(dir, "projects", "a.png"), "x");

    expect(publicAssetExists("/projects/a.png", dir)).toBe(true);
    expect(publicAssetExists("/projects/missing.png", dir)).toBe(false);
    expect(publicAssetExists(undefined, dir)).toBe(false);
  });
});
