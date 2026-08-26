import { execFileSync } from "node:child_process";
const g = "C:/Program Files/Git/cmd/git.exe";

const run = (args) =>
  execFileSync(g, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

const statNormal = run(["diff", "--stat", "--", "src/data/posts.ts"]).trim();
const statIgnoreCr = run([
  "diff",
  "--ignore-cr-at-eol",
  "--stat",
  "--",
  "src/data/posts.ts",
]).trim();
console.log("== normal ==");
console.log(statNormal.split("\n").pop());
console.log("== ignore-cr-at-eol ==");
console.log(statIgnoreCr.split("\n").pop());

// Sample the first hunk headers to see what kind of changes these are
const diffHead = run([
  "diff",
  "--ignore-cr-at-eol",
  "-U2",
  "--",
  "src/data/posts.ts",
]);
const lines = diffHead.split("\n");
const hunks = lines.filter((l) => l.startsWith("@@"));
console.log("hunk count (cr-insensitive):", hunks.length);
console.log(hunks.slice(0, 12).join("\n"));

// Other src files I did not touch
for (const f of ["src/data/theme-registry.ts", "src/lib/category-themes.ts", "src/types/post.ts"]) {
  const d = run(["diff", "--stat", "--", f]).trim().split("\n").pop();
  console.log("OTHER:", d);
}
