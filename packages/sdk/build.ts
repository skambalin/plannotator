import { $ } from "bun";
import { resolve, join } from "node:path";
import { existsSync, mkdirSync, copyFileSync } from "node:fs";

const ROOT = resolve(import.meta.dir, "../..");
const SDK_DIR = import.meta.dir;
const DIST_DIR = join(SDK_DIR, "dist");

// HTML prerequisite paths (both produced by build:hook)
const PLAN_HTML = join(ROOT, "apps/hook/dist/index.html");
const REVIEW_HTML = join(ROOT, "apps/hook/dist/review.html");

// Phase 1: Validate HTML prerequisites
console.log("Phase 1: Validating HTML prerequisites...");
const missing: string[] = [];
if (!existsSync(PLAN_HTML)) missing.push(PLAN_HTML);
if (!existsSync(REVIEW_HTML)) missing.push(REVIEW_HTML);

if (missing.length > 0) {
  console.error("Missing HTML prerequisites:");
  for (const path of missing) {
    console.error(`  - ${path}`);
  }
  console.error(
    "\nRun 'bun run build:hook' first.",
  );
  process.exit(1);
}

// Ensure dist directory exists
if (!existsSync(DIST_DIR)) {
  mkdirSync(DIST_DIR, { recursive: true });
}

// Phase 2: Bundle with Bun
console.log("Phase 2: Bundling with Bun...");
const buildResult = await Bun.build({
  entrypoints: [join(SDK_DIR, "src/index.ts")],
  outdir: DIST_DIR,
  target: "bun",
});

if (!buildResult.success) {
  console.error("Build failed:");
  for (const log of buildResult.logs) {
    console.error(log);
  }
  process.exit(1);
}

// Phase 3: Generate bundled type declarations
// Uses dts-bundle-generator to produce a single dist/index.d.ts with all types
// inlined — no @plannotator/* package specifiers that external consumers can't resolve.
// stderr warnings (bun-types conflicts) are expected and safe to ignore; the tool
// still produces correct output.
console.log("Phase 3: Generating bundled type declarations...");
const entryPoint = join(SDK_DIR, "src/index.ts");
const tsconfigPath = join(SDK_DIR, "tsconfig.build.json");
const dtsOutput = join(DIST_DIR, "index.d.ts");
const dtsResult =
  await $`bunx dts-bundle-generator --project ${tsconfigPath} -o ${dtsOutput} ${entryPoint}`.quiet().nothrow();

if (!existsSync(dtsOutput)) {
  console.error("dts-bundle-generator failed to produce output");
  console.error(dtsResult.stderr.toString());
  process.exit(1);
}

if (dtsResult.exitCode !== 0) {
  console.warn("dts-bundle-generator exited with warnings (output produced successfully)");
}

// Phase 4: Copy HTML files to dist
console.log("Phase 4: Copying HTML files...");
copyFileSync(PLAN_HTML, join(DIST_DIR, "plannotator.html"));
copyFileSync(REVIEW_HTML, join(DIST_DIR, "review-editor.html"));

console.log("SDK build complete.");
