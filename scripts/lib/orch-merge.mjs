/**
 * Hardened orchestrator merge helper.
 *
 * - Path-selective ship by default (checkout post allowlist from branch + commit)
 *   so polluted worker `git add -A` branches do not merge 100+ unrelated files
 * - Selective stash of only allowlist blockers (never escalate to full stash for that)
 * - Park public/ assets aside instead of stashing large binaries when possible
 * - Tracks stash SHA for exact restore; cleans leftover MERGE_HEAD
 * - Safe against concurrent merge attempts via artifacts/orch-merge.lock (O_EXCL)
 * - Stash apply conflicts: keep merge result (ours) after success, keep WIP (theirs) after fail
 * - Pathspecs via --pathspec-from-file to avoid Windows CreateProcess limits
 * - Set BLOG_ORCH_FULL_MERGE=1 to force classic `git merge --no-ff`
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { REPO_ROOT } from "./agent-jobs.mjs";

const LOCK_FILE = path.join(REPO_ROOT, "artifacts", "orch-merge.lock");
const STASH_STATE_FILE = path.join(REPO_ROOT, "artifacts", "orch-merge-stash.json");
const STASH_PREFIX = "orch-pre-merge:";

function git(cwd, args, opts = {}) {
  const res = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    windowsHide: true,
    ...opts,
  });
  const stdout = (res.stdout || "").trim();
  const stderr = (res.stderr || "").trim();
  const output = [stdout, stderr].filter(Boolean).join("\n");
  return {
    code: res.status == null ? 1 : res.status,
    stdout,
    stderr,
    output,
  };
}

function unique(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function readJsonSafe(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
  } catch {
    return null;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  fs.renameSync(tmp, file);
}

/** Decode git porcelain / pathspec quoted paths (`"foo\\nbar"`). */
export function unquoteGitPath(p) {
  const s = String(p || "");
  if (!s.startsWith('"') || !s.endsWith('"')) return s;
  let out = "";
  for (let i = 1; i < s.length - 1; i++) {
    const c = s[i];
    if (c !== "\\") {
      out += c;
      continue;
    }
    const n = s[++i];
    if (n === "n") out += "\n";
    else if (n === "t") out += "\t";
    else if (n === "r") out += "\r";
    else if (n === '"' || n === "\\") out += n;
    else if (n >= "0" && n <= "7") {
      let oct = n;
      while (oct.length < 3 && i + 1 < s.length - 1 && s[i + 1] >= "0" && s[i + 1] <= "7") {
        oct += s[++i];
      }
      out += String.fromCharCode(parseInt(oct, 8));
    } else out += n || "";
  }
  return out;
}

/**
 * Parse `git status --porcelain` lines into relative paths.
 * CRITICAL: do not trimStart — leading space is part of XY (` M path`).
 */
export function parsePorcelainPaths(text) {
  const paths = [];
  for (const raw of String(text || "").split(/\r?\n/)) {
    const line = raw.replace(/\s+$/u, "");
    if (!line || line.startsWith("##")) continue;
    if (line.length < 4) continue;
    const rest = line.slice(3);
    let p;
    if (rest.includes(" -> ")) p = rest.split(" -> ").pop();
    else p = rest;
    p = unquoteGitPath(p);
    if (p) paths.push(p);
  }
  return unique(paths);
}

export function acquireMergeLock(owner = `pid-${process.pid}`) {
  fs.mkdirSync(path.dirname(LOCK_FILE), { recursive: true });

  const tryCreate = () => {
    try {
      fs.writeFileSync(
        LOCK_FILE,
        `${JSON.stringify({ owner, at: new Date().toISOString() }, null, 2)}\n`,
        { flag: "wx", encoding: "utf8" },
      );
      return { ok: true };
    } catch (err) {
      if (err?.code !== "EEXIST") throw err;
      return null;
    }
  };

  let created = tryCreate();
  if (created) return created;

  try {
    const cur = readJsonSafe(LOCK_FILE);
    const ageMs = cur?.at ? Date.now() - Date.parse(cur.at) : Infinity;
    if (Number.isFinite(ageMs) && ageMs < 20 * 60 * 1000) {
      return {
        ok: false,
        reason: `merge lock held by ${cur?.owner || "unknown"} (age ${Math.round(ageMs / 1000)}s)`,
      };
    }
  } catch {
    /* overwrite stale/corrupt */
  }

  try {
    fs.unlinkSync(LOCK_FILE);
  } catch {
    /* ignore */
  }
  created = tryCreate();
  if (created) return created;
  return {
    ok: false,
    reason: "merge lock race — could not acquire",
  };
}

export function releaseMergeLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) fs.unlinkSync(LOCK_FILE);
  } catch {
    /* ignore */
  }
}

export function abortLeftoverMerge(repoRoot = REPO_ROOT) {
  if (fs.existsSync(path.join(repoRoot, ".git", "MERGE_HEAD"))) {
    const r = git(repoRoot, ["merge", "--abort"]);
    return { aborted: true, ...r };
  }
  return { aborted: false, code: 0 };
}

function listLines(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((s) => s.replace(/\s+$/u, ""))
    .filter(Boolean);
}

function withPathspecFile(repoRoot, paths, fn) {
  const cleaned = unique(paths.map((p) => String(p || "").trim()).filter(Boolean));
  if (cleaned.length === 0) {
    return fn(null);
  }
  const pathFile = path.join(
    repoRoot,
    "artifacts",
    `orch-merge-pathspec-${process.pid}-${Date.now()}.txt`,
  );
  try {
    fs.mkdirSync(path.dirname(pathFile), { recursive: true });
    // No trailing blank line — git treats empty pathspecs as fatal errors.
    fs.writeFileSync(pathFile, cleaned.join("\n"), "utf8");
    return fn(pathFile);
  } finally {
    try {
      if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
    } catch {
      /* ignore */
    }
  }
}

/** Paths the merge would touch (relative to repo root). */
export function pathsTouchedByMerge(repoRoot, branch) {
  const a = git(repoRoot, ["diff", "--name-only", `HEAD...${branch}`]);
  const b = git(repoRoot, ["diff", "--name-only", "HEAD", branch]);
  return unique([...listLines(a.stdout), ...listLines(b.stdout)].map(unquoteGitPath));
}

/** Dirty tracked + untracked paths on main. */
export function dirtyPaths(repoRoot) {
  const tracked = git(repoRoot, ["status", "--porcelain", "-uall"]);
  return parsePorcelainPaths(tracked.stdout);
}

export function blockingPaths(repoRoot, branch) {
  const touched = new Set(pathsTouchedByMerge(repoRoot, branch));
  return dirtyPaths(repoRoot).filter((p) => touched.has(p));
}

function stashRefFromMessage(repoRoot, message) {
  const list = git(repoRoot, ["stash", "list", "--format=%gd\t%H\t%s"]);
  for (const line of listLines(list.stdout)) {
    const [ref, hash, ...subjParts] = line.split("\t");
    const subj = subjParts.join("\t");
    if (subj.includes(message)) return { ref, hash, subject: subj };
  }
  // Prefer newest orch stash as fallback
  for (const line of listLines(list.stdout)) {
    const [ref, hash, ...subjParts] = line.split("\t");
    const subj = subjParts.join("\t");
    if (subj.includes(STASH_PREFIX)) return { ref, hash, subject: subj };
  }
  return null;
}

function dropStashRef(repoRoot, target) {
  if (!target) return;
  git(repoRoot, ["stash", "drop", target]);
  try {
    if (fs.existsSync(STASH_STATE_FILE)) fs.unlinkSync(STASH_STATE_FILE);
  } catch {
    /* ignore */
  }
}

function unmergedPaths(repoRoot) {
  return listLines(git(repoRoot, ["diff", "--name-only", "--diff-filter=U"]).stdout).map(
    unquoteGitPath,
  );
}

function resolveUnmerged(repoRoot, side /* 'ours' | 'theirs' */) {
  const files = unmergedPaths(repoRoot);
  if (!files.length) return files;
  return withPathspecFile(repoRoot, files, (pathFile) => {
    if (!pathFile) return files;
    git(repoRoot, ["checkout", `--${side}`, "--pathspec-from-file", pathFile]);
    git(repoRoot, ["add", "--pathspec-from-file", pathFile]);
    // Leave WIP unstaged (matches pre-merge dirty tree habit)
    git(repoRoot, ["reset", "HEAD", "--pathspec-from-file", pathFile]);
    return files;
  });
}

function clearUnmergedToHead(repoRoot) {
  const files = unmergedPaths(repoRoot);
  if (!files.length) return files;
  return withPathspecFile(repoRoot, files, (pathFile) => {
    if (!pathFile) return files;
    git(repoRoot, ["checkout", "--ours", "--pathspec-from-file", pathFile]);
    git(repoRoot, ["add", "--pathspec-from-file", pathFile]);
    git(repoRoot, ["reset", "HEAD", "--pathspec-from-file", pathFile]);
    return files;
  });
}

/**
 * Stash only paths that would block merge. Falls back to full `stash -u` if needed.
 * Uses --pathspec-from-file to avoid Windows CreateProcess command-line limits.
 */
export function stashBlockingPaths(repoRoot, branch, label, { onlyPaths = null } = {}) {
  const message = `${STASH_PREFIX}${label}`;
  const allow =
    onlyPaths instanceof Set
      ? onlyPaths
      : Array.isArray(onlyPaths)
        ? new Set(onlyPaths)
        : null;
  let blocking = allow
    ? dirtyPaths(repoRoot).filter((p) => allow.has(p))
    : blockingPaths(repoRoot, branch);

  // Prefer stashing tracked conflicts first (images last — often huge/untracked)
  blocking = [
    ...blocking.filter((p) => !p.startsWith("public/")),
    ...blocking.filter((p) => p.startsWith("public/")),
  ];

  if (blocking.length === 0) {
    const porcelain = git(repoRoot, ["status", "--porcelain"]);
    if (!porcelain.stdout.trim()) {
      return { didStash: false, message, blocking: [], mode: "clean" };
    }
    const dry = canMergeWithoutStash(repoRoot, branch);
    if (dry.ok) {
      return { didStash: false, message, blocking: [], mode: "dirty-nonblocking" };
    }
    return stashFull(repoRoot, message, branch, "full-fallback");
  }

  return withPathspecFile(repoRoot, blocking, (pathFile) => {
    if (!pathFile) {
      return stashFull(repoRoot, message, branch, "full-fallback", { blocking });
    }
    const partial = git(repoRoot, [
      "stash",
      "push",
      "-u",
      "-m",
      message,
      "--pathspec-from-file",
      pathFile,
    ]);
    const did =
      partial.code === 0 && !/No local changes to save/i.test(partial.output);
    const mode = "partial";
    const output = partial.output;

    // Verify no blockers remain; if any, escalate to full stash
    const still = allow
      ? dirtyPaths(repoRoot).filter((p) => allow.has(p))
      : blockingPaths(repoRoot, branch);
    if (did && still.length > 0) {
      return {
        ...stashFull(repoRoot, `${message}:full`, branch, "full-after-partial"),
        blocking,
        mode: "full-after-partial",
        partialLeft: still.length,
      };
    }

    if (!did) {
      return stashFull(repoRoot, message, branch, "full-fallback", {
        blocking,
        prior: output,
      });
    }

    const ref = stashRefFromMessage(repoRoot, message);
    if (ref) {
      writeJson(STASH_STATE_FILE, {
        message,
        ref: ref.ref,
        hash: ref.hash,
        at: new Date().toISOString(),
        mode,
        branch,
        blockingCount: blocking.length,
      });
    }
    return { didStash: true, message, blocking, mode, code: partial.code, output, ref };
  });
}

function stashFull(repoRoot, message, branch, mode, extra = {}) {
  const full = git(repoRoot, ["stash", "push", "-u", "-m", message]);
  const did =
    full.code === 0 && !/No local changes to save/i.test(full.output);
  const ref = did ? stashRefFromMessage(repoRoot, message) : null;
  if (did && ref) {
    writeJson(STASH_STATE_FILE, {
      message,
      ref: ref.ref,
      hash: ref.hash,
      at: new Date().toISOString(),
      mode,
      branch,
    });
  }
  return {
    didStash: did,
    message,
    blocking: extra.blocking || [],
    mode,
    code: full.code,
    output: [extra.prior, full.output].filter(Boolean).join("\n"),
    ref,
  };
}

function canMergeWithoutStash(repoRoot, branch) {
  return { ok: blockingPaths(repoRoot, branch).length === 0 };
}

/**
 * @param {{ preferMerged?: boolean }} opts
 *   preferMerged true  → after successful merge, keep HEAD/merge on conflicts (ours)
 *   preferMerged false → after failed merge, prefer stash WIP on conflicts (theirs)
 */
export function restoreStash(repoRoot, stashInfo, { preferMerged = true } = {}) {
  if (!stashInfo?.didStash) return { restored: false, code: 0, output: "" };

  const state = readJsonSafe(STASH_STATE_FILE);
  const target =
    stashInfo.ref?.ref ||
    state?.ref ||
    stashRefFromMessage(repoRoot, stashInfo.message)?.ref;

  if (!target) {
    return { restored: false, code: 1, output: "stash ref not found" };
  }

  const apply = git(repoRoot, ["stash", "apply", target]);
  if (apply.code === 0) {
    dropStashRef(repoRoot, target);
    return { restored: true, code: 0, output: apply.output };
  }

  const untrackedClash = /untracked working tree files would be overwritten/i.test(
    apply.output,
  );
  const hasConflicts =
    /conflict/i.test(apply.output) || unmergedPaths(repoRoot).length > 0;

  if (preferMerged) {
    // Merge already landed — never leave the tree conflicted for WIP restore.
    let resolved = [];
    if (hasConflicts) {
      resolved = resolveUnmerged(repoRoot, "ours");
    }
    // If still conflicted, force clear to HEAD
    if (unmergedPaths(repoRoot).length) {
      resolved = [...resolved, ...clearUnmergedToHead(repoRoot)];
    }
    dropStashRef(repoRoot, target);
    return {
      restored: true,
      code: 0,
      output: apply.output,
      resolvedConflicts: unique(resolved),
      warning: untrackedClash
        ? "stash apply skipped colliding untracked files; kept merge result"
        : "stash apply had conflicts; kept merged versions",
    };
  }

  // Failed merge path: try to resurrect WIP from stash
  if (hasConflicts) {
    const resolved = resolveUnmerged(repoRoot, "theirs");
    if (unmergedPaths(repoRoot).length === 0) {
      dropStashRef(repoRoot, target);
      return {
        restored: true,
        code: 0,
        output: apply.output,
        resolvedConflicts: resolved,
        warning: "stash apply had conflicts; kept WIP (stash) versions",
      };
    }
    // Could not cleanly take stash — reset conflicted paths to HEAD, keep stash
    clearUnmergedToHead(repoRoot);
    return {
      restored: false,
      code: apply.code,
      output: apply.output,
      keptStash: target,
      warning: "stash apply conflicted; left stash intact",
    };
  }

  return {
    restored: false,
    code: apply.code,
    output: apply.output,
    keptStash: target,
  };
}

/** Recover stash left by a crashed merge. */
export function recoverOrphanedMergeStash(repoRoot = REPO_ROOT) {
  abortLeftoverMerge(repoRoot);
  const state = readJsonSafe(STASH_STATE_FILE);
  if (!state?.ref && !state?.message) {
    // Also clear a stale lock if present and old
    if (fs.existsSync(LOCK_FILE)) {
      const cur = readJsonSafe(LOCK_FILE);
      const ageMs = cur?.at ? Date.now() - Date.parse(cur.at) : Infinity;
      if (!Number.isFinite(ageMs) || ageMs > 20 * 60 * 1000) {
        releaseMergeLock();
        return { recovered: false, reason: "no stash state; cleared stale lock" };
      }
    }
    return { recovered: false, reason: "no stash state" };
  }
  const info = {
    didStash: true,
    message: state.message,
    ref: { ref: state.ref, hash: state.hash },
  };
  const result = restoreStash(repoRoot, info, { preferMerged: true });
  return { recovered: result.restored, ...result };
}

function slugStem(slug) {
  return String(slug || "").replace(/-20\d{2}$/, "");
}

export function postPathspecs(slug) {
  const stem = slugStem(slug);
  const specs = [
    "src/data/posts.ts",
    "src/types/post.ts",
    "src/components/PostVisualization.tsx",
    "src/lib/posts.ts",
    "src/lib/category-themes.ts",
    "src/data/theme-registry.ts",
    "artifacts/backend-manifest.json",
    "scripts/smoke-test-viz-posts.mjs",
    `scripts/qa-${slug}.mjs`,
    `:(glob)src/data/*${slug}*`,
    `:(glob)src/data/*${stem}*`,
    `:(glob)public/images/*${slug}*`,
    `:(glob)public/images/*${stem}*`,
  ];
  const pascal = toPascalHint(stem);
  if (pascal) {
    specs.push(`:(glob)src/components/visualizations/*${pascal}*`);
  }
  return unique(specs);
}

function toPascalHint(stem) {
  return stem
    .split("-")
    .filter((p) => p && !["us", "the", "and", "of", "a"].includes(p))
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

/**
 * Post-related files present on the worker branch (path-selective merge allowlist).
 * Avoids merging polluted worktree commits that ran `git add -A`.
 */
export function filesOnBranchForPost(repoRoot, branch, slug) {
  const listing = git(repoRoot, ["ls-tree", "-r", "--name-only", branch]);
  if (listing.code !== 0) return [];
  const all = listLines(listing.stdout).map(unquoteGitPath);
  const stem = slugStem(slug);
  const parts = stem.split("-").filter(Boolean);
  const exact = new Set([
    "src/data/posts.ts",
    "src/types/post.ts",
    "src/components/PostVisualization.tsx",
    "src/components/CategoryIcons.tsx",
    "src/components/ExploreCategoriesSection.tsx",
    "src/lib/posts.ts",
    "src/lib/category-themes.ts",
    "src/data/theme-registry.ts",
    "artifacts/backend-manifest.json",
    "scripts/smoke-test-viz-posts.mjs",
    `scripts/qa-${slug}.mjs`,
  ]);

  // Shorter stems: phosphate-fertilizer-export-dependence → also phosphate-fertilizer-export
  const stemVariants = [];
  for (let len = parts.length; len >= 2; len--) {
    stemVariants.push(parts.slice(0, len).join("-"));
  }
  const pascalVariants = stemVariants.map((s) =>
    s
      .split("-")
      .filter((p) => p && !["us", "the", "and", "of", "a"].includes(p))
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(""),
  );

  return all.filter((p) => {
    if (exact.has(p)) return true;
    if (p.includes(slug)) return true;
    const inData = p.startsWith("src/data/");
    const inImg = p.startsWith("public/images/");
    const inQa = p.startsWith("scripts/qa-");
    const inViz = p.startsWith("src/components/visualizations/");
    if (!inData && !inImg && !inQa && !inViz) return false;
    if (stemVariants.some((s) => p.includes(s))) return true;
    if (inViz && pascalVariants.some((pas) => pas && p.includes(pas))) return true;
    return false;
  });
}

/** Dirty paths that would block a path-selective post merge. */
export function blockingPathsForPost(repoRoot, branch, slug) {
  const allow = new Set(filesOnBranchForPost(repoRoot, branch, slug));
  return dirtyPaths(repoRoot).filter((p) => allow.has(p));
}

const ASIDE_ROOT = path.join(REPO_ROOT, "artifacts", "orch-merge-aside");

/**
 * Move untracked/large public assets aside instead of stashing binaries (slow on Windows).
 */
export function parkBlockingPublicAssets(repoRoot, paths) {
  const parkable = paths.filter(
    (p) => p.startsWith("public/") || p.startsWith("artifacts/"),
  );
  if (!parkable.length) return { parked: [], dir: null };

  const dir = path.join(ASIDE_ROOT, `${process.pid}-${Date.now()}`);
  const parked = [];
  for (const rel of parkable) {
    const src = path.join(repoRoot, rel);
    if (!fs.existsSync(src)) continue;
    const dest = path.join(dir, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    try {
      fs.renameSync(src, dest);
      parked.push(rel);
    } catch {
      try {
        fs.copyFileSync(src, dest);
        fs.unlinkSync(src);
        parked.push(rel);
      } catch {
        /* leave in place — stash will handle */
      }
    }
  }
  if (parked.length) {
    writeJson(path.join(dir, "_manifest.json"), {
      at: new Date().toISOString(),
      parked,
    });
  }
  return { parked, dir: parked.length ? dir : null };
}

export function restoreParkedAssets(repoRoot, parkInfo) {
  if (!parkInfo?.dir || !parkInfo?.parked?.length) {
    return { restored: 0 };
  }
  let n = 0;
  for (const rel of parkInfo.parked) {
    const src = path.join(parkInfo.dir, rel);
    const dest = path.join(repoRoot, rel);
    if (!fs.existsSync(src)) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (fs.existsSync(dest)) {
      // Prefer keeping whatever merge wrote (new hero from branch)
      try {
        fs.unlinkSync(src);
      } catch {
        /* ignore */
      }
      continue;
    }
    try {
      fs.renameSync(src, dest);
      n++;
    } catch {
      try {
        fs.copyFileSync(src, dest);
        fs.unlinkSync(src);
        n++;
      } catch {
        /* ignore */
      }
    }
  }
  try {
    fs.rmSync(parkInfo.dir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
  return { restored: n };
}

/**
 * Path-selective ship: bring only post allowlist files from branch onto main + commit.
 * Skips `git merge` of polluted worker branches (add -A noise).
 * Shared registries (posts.ts, PostVisualization, types) are unioned — never clobbered.
 */
const SHARED_REGISTRY_FILES = new Set([
  "src/data/posts.ts",
  "src/components/PostVisualization.tsx",
  "src/types/post.ts",
  "src/data/theme-registry.ts",
  "src/lib/category-themes.ts",
  "src/lib/posts.ts",
  "src/components/CategoryIcons.tsx",
  "src/components/ExploreCategoriesSection.tsx",
  "artifacts/backend-manifest.json",
  "scripts/smoke-test-viz-posts.mjs",
]);

function extractPostObjectFromText(source, slug) {
  const patterns = [`slug: '${slug}'`, `slug: "${slug}"`];
  let idx = -1;
  for (const p of patterns) {
    idx = source.indexOf(p);
    if (idx >= 0) break;
  }
  if (idx < 0) return null;
  let start = idx;
  while (start > 0 && source[start] !== "{") start--;
  if (source[start] !== "{") return null;
  let depth = 0;
  let inStr = null;
  let escape = false;
  for (let i = start; i < source.length; i++) {
    const c = source[i];
    if (inStr) {
      if (escape) {
        escape = false;
        continue;
      }
      if (c === "\\") {
        escape = true;
        continue;
      }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === "'" || c === '"' || c === "`") {
      inStr = c;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        let end = i + 1;
        if (source[end] === ",") end++;
        return source.slice(start, end);
      }
    }
  }
  return null;
}

function gitShowRaw(repoRoot, branch, file) {
  const res = spawnSync("git", ["show", `${branch}:${file}`], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    windowsHide: true,
  });
  return {
    code: res.status == null ? 1 : res.status,
    text: res.stdout || "",
    error: (res.stderr || "").trim(),
  };
}

export function unionSlugIntoPostsTs(repoRoot, branch, slug) {
  const postsPath = path.join(repoRoot, "src/data/posts.ts");
  let posts = fs.readFileSync(postsPath, "utf8");
  if (posts.includes(`slug: '${slug}'`) || posts.includes(`slug: "${slug}"`)) {
    return { ok: true, skipped: true };
  }
  const shown = gitShowRaw(repoRoot, branch, "src/data/posts.ts");
  if (shown.code !== 0) return { ok: false, error: shown.error };
  const obj = extractPostObjectFromText(shown.text, slug);
  if (!obj) return { ok: false, error: `post object not found for ${slug}` };
  const markers = [
    "export const samplePosts: Post[] = [",
    "export const posts: Post[] = [",
    "export const samplePosts = [",
    "export const posts = [",
  ];
  let at = -1;
  let marker = null;
  for (const m of markers) {
    at = posts.indexOf(m);
    if (at >= 0) {
      marker = m;
      break;
    }
  }
  if (at < 0) return { ok: false, error: "posts marker missing" };
  const insertAt = at + marker.length;
  const block = `\n  ${obj.trim().replace(/,\s*$/, "")},`;
  posts = posts.slice(0, insertAt) + block + posts.slice(insertAt);
  fs.writeFileSync(postsPath, posts, "utf8");
  git(repoRoot, ["add", "--", "src/data/posts.ts"]);
  return { ok: true, inserted: true };
}

export function selectiveCheckoutPostCommit(repoRoot, branch, slug, workerId) {
  const files = filesOnBranchForPost(repoRoot, branch, slug);
  if (!files.length) {
    return { ok: false, error: "no_post_files", files: [] };
  }

  const unique = files.filter((f) => !SHARED_REGISTRY_FILES.has(f));
  const shared = files.filter((f) => SHARED_REGISTRY_FILES.has(f));

  // 1) Checkout unique payload files (data modules, dashboards, heroes, qa)
  if (unique.length) {
    const checkout = withPathspecFile(repoRoot, unique, (pathFile) => {
      if (!pathFile) return { code: 1, output: "empty pathspec" };
      return git(repoRoot, [
        "checkout",
        branch,
        "--pathspec-from-file",
        pathFile,
      ]);
    });
    if (checkout.code !== 0) {
      return {
        ok: false,
        error: "checkout_failed",
        detail: checkout.output,
        files: unique,
      };
    }
  }

  // 2) Union posts.ts (never clobber the full registry)
  if (shared.includes("src/data/posts.ts")) {
    const u = unionSlugIntoPostsTs(repoRoot, branch, slug);
    if (!u.ok) {
      return { ok: false, error: "posts_union_failed", detail: u.error, files };
    }
  }

  // 3) For remaining shared registries, checkout from branch only if HEAD lacks the slug/viz
  //    tokens — still imperfect for PostVisualization, but posts.ts is the critical one.
  const otherShared = shared.filter((f) => f !== "src/data/posts.ts");
  if (otherShared.length) {
    const checkoutShared = withPathspecFile(repoRoot, otherShared, (pathFile) => {
      if (!pathFile) return { code: 0, output: "" };
      return git(repoRoot, [
        "checkout",
        branch,
        "--pathspec-from-file",
        pathFile,
      ]);
    });
    if (checkoutShared.code !== 0) {
      return {
        ok: false,
        error: "shared_checkout_failed",
        detail: checkoutShared.output,
        files: otherShared,
      };
    }
  }

  const staged = listLines(
    git(repoRoot, ["diff", "--cached", "--name-only"]).stdout,
  ).map(unquoteGitPath);
  // Also stage posts.ts if rewritten outside index
  git(repoRoot, ["add", "--", "src/data/posts.ts"]);

  const staged2 = listLines(
    git(repoRoot, ["diff", "--cached", "--name-only"]).stdout,
  ).map(unquoteGitPath);

  if (!staged2.length) {
    return {
      ok: true,
      committed: false,
      alreadyPresent: true,
      files,
    };
  }

  const commit = git(repoRoot, [
    "commit",
    "-m",
    `merge(post): ${slug} from worker ${workerId ?? "?"} (path-selective)`,
  ]);
  if (commit.code !== 0) {
    return {
      ok: false,
      error: "commit_failed",
      detail: commit.output,
      files: staged2,
    };
  }
  return {
    ok: true,
    committed: true,
    files: staged2,
    uniqueCount: unique.length,
    sharedCount: shared.length,
  };
}

/**
 * Commit only post-related dirty files in the worker worktree.
 */
export function commitWorktreePostFiles(worktree, slug, branch) {
  if (!worktree || !fs.existsSync(worktree)) {
    return { ok: true, skipped: true, reason: "no worktree" };
  }

  const co = git(worktree, ["checkout", "-B", branch]);
  if (co.code !== 0) {
    return { ok: false, error: `checkout failed: ${co.output}` };
  }

  const specs = postPathspecs(slug);
  const add = withPathspecFile(worktree, specs, (pathFile) => {
    if (!pathFile) return { code: 0, output: "", stdout: "", stderr: "" };
    return git(worktree, ["add", "--pathspec-from-file", pathFile]);
  });
  const staged = git(worktree, ["diff", "--cached", "--name-only"]);
  const files = listLines(staged.stdout).map(unquoteGitPath);
  if (files.length === 0) {
    return { ok: true, committed: false, files: [], addOutput: add.output };
  }

  const commit = git(worktree, ["commit", "-m", `feat(post): ${slug}`]);
  if (commit.code !== 0 && !/nothing to commit/i.test(commit.output)) {
    return {
      ok: true,
      committed: false,
      warning: commit.output,
      files,
    };
  }
  return { ok: true, committed: commit.code === 0, files };
}

/**
 * Full merge pipeline for one ready job.
 * @returns {{ ok: boolean, shipped?: boolean, error?: string, detail?: string, log: string[] }}
 */
export function mergeReadyJob({
  slug,
  branch,
  worktreePath,
  workerId = null,
  repoRoot = REPO_ROOT,
}) {
  const log = [];
  const note = (m) => {
    log.push(m);
  };

  if (!branch) branch = `post/${slug}`;
  note(`merge start slug=${slug} branch=${branch}`);

  const lock = acquireMergeLock(`merge:${slug}`);
  if (!lock.ok) {
    return { ok: false, error: "merge_lock", detail: lock.reason, log };
  }

  let stashInfo = { didStash: false };
  let parkInfo = { parked: [], dir: null };
  try {
    abortLeftoverMerge(repoRoot);

    const verify = git(repoRoot, ["rev-parse", "--verify", branch]);
    if (verify.code !== 0) {
      return {
        ok: false,
        error: "branch_missing",
        detail: verify.output,
        log,
      };
    }

    const ahead = git(repoRoot, ["rev-list", "--count", `HEAD..${branch}`]);
    const aheadN = Number(ahead.stdout.trim() || "0");
    note(`branch commits ahead of HEAD: ${aheadN}`);

    const wt = commitWorktreePostFiles(worktreePath, slug, branch);
    if (!wt.ok) {
      return { ok: false, error: "worktree_commit", detail: wt.error, log };
    }
    if (wt.committed) {
      note(`worktree committed ${wt.files.length} paths`);
    } else if (wt.files?.length) {
      note(`worktree staged but commit skipped: ${wt.warning || ""}`);
    } else {
      note("worktree: using existing branch tip");
    }

    const postFiles = filesOnBranchForPost(repoRoot, branch, slug);
    note(`post allowlist on branch: ${postFiles.length} files`);
    if (!postFiles.length) {
      return {
        ok: false,
        error: "no_post_files",
        detail: `Branch ${branch} has no post allowlist files for ${slug}`,
        log,
      };
    }

    const ahead2 = git(repoRoot, ["rev-list", "--count", `HEAD..${branch}`]);
    const aheadAfter = Number(ahead2.stdout.trim() || "0");
    const postDiff = withPathspecFile(repoRoot, postFiles, (pathFile) => {
      if (!pathFile) return { code: 0, stdout: "", output: "" };
      return git(repoRoot, [
        "diff",
        "--name-only",
        "HEAD",
        branch,
        "--pathspec-from-file",
        pathFile,
      ]);
    });
    const changed = listLines(postDiff.stdout).map(unquoteGitPath);
    note(`post files differing from HEAD: ${changed.length}`);
    if (changed.length === 0 && aheadAfter === 0) {
      return {
        ok: false,
        error: "branch_empty",
        detail: `Branch ${branch} has no post-file changes vs main`,
        log,
      };
    }

    // Park public/binary blockers first (fast), then stash remaining text blockers
    parkInfo = { parked: [], dir: null };
    const selectiveBlockers = dirtyPaths(repoRoot).filter((p) =>
      postFiles.includes(p),
    );
    const publicBlockers = selectiveBlockers.filter((p) =>
      p.startsWith("public/"),
    );
    if (publicBlockers.length) {
      parkInfo = parkBlockingPublicAssets(repoRoot, publicBlockers);
      if (parkInfo.parked.length) {
        note(`parked ${parkInfo.parked.length} public assets aside`);
      }
    }

    stashInfo = stashBlockingPaths(repoRoot, branch, `${slug}-${Date.now()}`, {
      onlyPaths: postFiles,
    });
    if (stashInfo.didStash) {
      note(
        `stashed ${stashInfo.mode} blocking=${stashInfo.blocking?.length || 0}`,
      );
      if (stashInfo.blocking?.includes("src/data/posts.ts")) {
        note(
          "WARN posts.ts was dirty — path-selective ship keeps branch version on conflict",
        );
      }
    } else {
      note(`no stash (${stashInfo.mode || "clean"})`);
    }

    if (
      stashInfo.didStash === false &&
      stashInfo.mode === "full-fallback" &&
      stashInfo.code !== 0
    ) {
      restoreParkedAssets(repoRoot, parkInfo);
      return {
        ok: false,
        error: "stash_failed",
        detail: stashInfo.output,
        log,
      };
    }

    const remaining = dirtyPaths(repoRoot).filter((p) => postFiles.includes(p));
    if (remaining.length > 0) {
      note(`blockers remain after stash: ${remaining.slice(0, 12).join(", ")}`);
      restoreStash(repoRoot, stashInfo, { preferMerged: false });
      restoreParkedAssets(repoRoot, parkInfo);
      return {
        ok: false,
        error: "stash_incomplete",
        detail: `Still blocking: ${remaining.slice(0, 20).join(", ")}`,
        log,
      };
    }

    // Default: path-selective checkout+commit (avoids polluted add -A branches)
    const useFullMerge = process.env.BLOG_ORCH_FULL_MERGE === "1";
    let mergeOk = false;
    if (useFullMerge) {
      note("using full git merge (BLOG_ORCH_FULL_MERGE=1)");
      const merge = git(repoRoot, [
        "merge",
        "--no-ff",
        branch,
        "-m",
        `merge(post): ${slug} from worker ${workerId ?? "?"}`,
      ]);
      if (merge.code !== 0) {
        note(`merge failed: ${merge.output}`);
        abortLeftoverMerge(repoRoot);
        const restored = restoreStash(repoRoot, stashInfo, {
          preferMerged: false,
        });
        if (!restored.restored && stashInfo.didStash) {
          note(`stash restore after fail: ${restored.output}`);
        }
        if (restored.warning) note(`WARN ${restored.warning}`);
        restoreParkedAssets(repoRoot, parkInfo);
        const err = /conflict|CONFLICT/i.test(merge.output)
          ? "merge_conflict"
          : "merge_failed";
        return { ok: false, error: err, detail: merge.output, log };
      }
      mergeOk = true;
      note("full merge ok");
    } else {
      const sel = selectiveCheckoutPostCommit(
        repoRoot,
        branch,
        slug,
        workerId,
      );
      if (!sel.ok) {
        note(`selective merge failed: ${sel.error} ${sel.detail || ""}`);
        restoreStash(repoRoot, stashInfo, { preferMerged: false });
        restoreParkedAssets(repoRoot, parkInfo);
        return {
          ok: false,
          error: sel.error || "selective_merge_failed",
          detail: sel.detail || "",
          log,
        };
      }
      if (sel.alreadyPresent) {
        note("selective: post files already match HEAD — treating as shipped");
      } else {
        note(
          `selective commit ok (${sel.files.length} files): ${sel.files.slice(0, 8).join(", ")}`,
        );
      }
      mergeOk = true;
    }

    if (!mergeOk) {
      restoreParkedAssets(repoRoot, parkInfo);
      return { ok: false, error: "merge_failed", log };
    }

    const restored = restoreStash(repoRoot, stashInfo, { preferMerged: true });
    if (stashInfo.didStash && restored.warning) {
      note(`WARN ${restored.warning}`);
      if (restored.resolvedConflicts?.length) {
        note(
          `resolved stash conflicts keeping merge: ${restored.resolvedConflicts.join(", ")}`,
        );
      }
    } else if (stashInfo.didStash && !restored.restored) {
      note(`WARN stash apply after success: ${restored.output}`);
    } else if (restored.restored) {
      note("restored WIP stash");
    }

    const parkedBack = restoreParkedAssets(repoRoot, parkInfo);
    if (parkedBack.restored) {
      note(`restored ${parkedBack.restored} parked assets`);
    }

    return { ok: true, shipped: true, log };
  } catch (err) {
    abortLeftoverMerge(repoRoot);
    try {
      restoreStash(repoRoot, stashInfo, { preferMerged: false });
    } catch {
      /* ignore */
    }
    try {
      restoreParkedAssets(repoRoot, parkInfo);
    } catch {
      /* ignore */
    }
    return {
      ok: false,
      error: "merge_exception",
      detail: String(err?.stack || err),
      log,
    };
  } finally {
    releaseMergeLock();
  }
}

/** Non-destructive unit checks for parse/lock helpers. */
export function runMergeSelfTest() {
  const failures = [];
  const assert = (cond, msg) => {
    if (!cond) failures.push(msg);
  };

  // Porcelain: leading space must not eat path prefix
  const paths = parsePorcelainPaths(
    [
      " M src/data/posts.ts",
      "M  scripts/lib/orch-merge.mjs",
      "?? public/images/foo-hero.png",
      'R  "old name.ts" -> "new name.ts"',
      ' M "src/data/weird path.ts"',
      "## master...origin/master",
    ].join("\n"),
  );
  assert(paths.includes("src/data/posts.ts"), "parse keeps src/ prefix for ' M'");
  assert(paths.includes("scripts/lib/orch-merge.mjs"), "parse staged path");
  assert(paths.includes("public/images/foo-hero.png"), "parse untracked");
  assert(paths.includes("new name.ts"), "parse rename target");
  assert(paths.includes("src/data/weird path.ts"), "parse quoted path");
  assert(!paths.some((p) => p.startsWith("rc/")), "no trimStart bug (rc/...)");

  assert(unquoteGitPath('"a\\nb"') === "a\nb", "unquote newline");
  assert(unquoteGitPath("plain") === "plain", "unquote passthrough");

  const specs = postPathspecs("phosphate-fertilizer-export-dependence-2026");
  assert(specs.includes("src/data/posts.ts"), "pathspecs include posts.ts");
  assert(
    specs.some((s) => s.includes("phosphate-fertilizer")),
    "pathspecs include slug glob",
  );

  // Lock acquire / release round-trip
  releaseMergeLock();
  const a = acquireMergeLock("self-test-a");
  assert(a.ok, "first lock acquire");
  const b = acquireMergeLock("self-test-b");
  assert(!b.ok, "second lock blocked");
  releaseMergeLock();
  const c = acquireMergeLock("self-test-c");
  assert(c.ok, "lock after release");
  releaseMergeLock();

  // Allowlist must catch shortened data/dashboard names (not only full slug stem)
  const branch = "post/phosphate-fertilizer-export-dependence-2026";
  const verify = git(REPO_ROOT, ["rev-parse", "--verify", branch]);
  if (verify.code === 0) {
    const files = filesOnBranchForPost(
      REPO_ROOT,
      branch,
      "phosphate-fertilizer-export-dependence-2026",
    );
    assert(
      files.some((f) => f.includes("phosphate-fertilizer-export-data")),
      "allowlist includes data module",
    );
    assert(
      files.some((f) => f.includes("PhosphateFertilizerExportDashboard")),
      "allowlist includes dashboard",
    );
    assert(
      !files.some((f) => f.includes("PhosphateRockSupply")),
      "allowlist excludes sibling phosphate-rock post",
    );
    assert(
      !files.some((f) => f.includes("AiDataCenters")),
      "allowlist excludes unrelated dashboards",
    );
  }

  return {
    ok: failures.length === 0,
    failures,
    samplePaths: paths,
  };
}
