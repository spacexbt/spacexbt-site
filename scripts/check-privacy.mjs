import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { findLeaks, parseDenylist } from "./privacy-scan.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const AUTHOR_EMAIL = "176180399+spacexbt@users.noreply.github.com";
const TEXT_EXT = new Set([
  ".html",
  ".js",
  ".json",
  ".txt",
  ".xml",
  ".rsc",
  ".body",
  ".meta",
  ".ts",
  ".tsx",
  ".mjs",
  ".md",
  ".css",
  ".svg",
  ".mdx",
  ".yaml",
  ".yml",
  ".lock",
  ".jsonc",
  ".cjs",
  ".mts",
  ".cts",
]);
const NEXT_DIR = join(ROOT, ".next");
const SKIP = new Set([join(NEXT_DIR, "cache")]);

/**
 * @param {string[]} args
 * @returns {string}
 */
function git(args) {
  return execFileSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
}

/** @param {string} message */
function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

/**
 * @param {string} path
 * @returns {string[]}
 */
function collect(path) {
  if (SKIP.has(path) || !existsSync(path)) return [];
  const stat = statSync(path);
  if (stat.isDirectory()) {
    return readdirSync(path).flatMap((name) => collect(join(path, name)));
  }
  return isTextFile(path) ? [path] : [];
}

/** @param {string} path */
function isTextFile(path) {
  if (TEXT_EXT.has(extname(path))) return true;
  const name = basename(path);
  return (
    name === ".gitignore" || name === ".prettierignore" || name === "LICENSE"
  );
}

const denylistPath = join(ROOT, ".privacy-denylist");
if (!existsSync(denylistPath)) {
  fail(
    "Missing .privacy-denylist — create it with one private term per line (it is gitignored).",
  );
}
if (!existsSync(join(ROOT, ".next"))) {
  fail("Missing .next/ — run `pnpm build` first.");
}

const terms = parseDenylist(readFileSync(denylistPath, "utf8"));
if (terms.length === 0) {
  fail(
    ".privacy-denylist has no terms (only blanks/comments) — add at least one private term per line.",
  );
}

const tracked = git(["ls-files", "-z"])
  .split("\0")
  .filter(Boolean)
  .map((rel) => join(ROOT, rel))
  .filter((path) => existsSync(path) && isTextFile(path));
const files = [...tracked, ...collect(NEXT_DIR)];
const problems = [];

for (const file of files) {
  for (const hit of findLeaks(readFileSync(file, "utf8"), terms)) {
    problems.push(`${relative(ROOT, file)}: ${hit}`);
  }
}

for (const message of git(["log", "--all", "--format=%B%x00"]).split("\0")) {
  for (const hit of findLeaks(message, terms)) {
    problems.push(`git history: commit message: ${hit}`);
  }
}

const emails = git(["log", "--all", "--format=%ae%n%ce"])
  .split("\n")
  .filter(Boolean);
for (const email of new Set(emails)) {
  if (email !== AUTHOR_EMAIL)
    problems.push(`git history: unexpected author/committer email ${email}`);
}

if (problems.length > 0) {
  fail(problems.join("\n"));
}
process.stdout.write(
  `Privacy check passed (${terms.length} terms, ${files.length} files scanned)\n`,
);
