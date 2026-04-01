import { $ } from "bun";
import { resolve, join } from "node:path";
import { existsSync, mkdirSync, copyFileSync } from "node:fs";
import { Listr, type ListrTask } from "listr2";

const ROOT = resolve(import.meta.dir, "../..");
const SDK_DIR = import.meta.dir;
const DIST_DIR = join(SDK_DIR, "dist");

// HTML prerequisite paths (both produced by build:hook)
const PLAN_HTML = join(ROOT, "apps/hook/dist/index.html");
const REVIEW_HTML = join(ROOT, "apps/hook/dist/review.html");

async function runBuild(label: string, appDir: string): Promise<void> {
  const proc = Bun.spawn(["bun", "run", "--cwd", appDir, "build"], {
    cwd: ROOT,
    stdout: "pipe",
    stderr: "pipe",
  });

  const [, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  if (exitCode !== 0) {
    throw new Error(`${label} build failed (exit ${exitCode}):\n${stderr}`);
  }
}

const buildReviewApp: ListrTask = {
  title: "Build Review App",
  task: () => runBuild("Review app", "apps/review"),
};

const buildHookApp: ListrTask = {
  title: "Build Hook App",
  task: () => runBuild("Hook app", "apps/hook"),
};

const validatePrerequisites: ListrTask = {
  title: "Validate HTML prerequisites",
  task: () => {
    const missing: string[] = [];
    if (!existsSync(PLAN_HTML)) missing.push(PLAN_HTML);
    if (!existsSync(REVIEW_HTML)) missing.push(REVIEW_HTML);

    if (missing.length > 0) {
      throw new Error(
        `Missing HTML prerequisites (preceding build steps may have failed):\n${missing.map((p) => `  - ${p}`).join("\n")}`,
      );
    }
  },
};

const ensureDistDir: ListrTask = {
  title: "Ensure dist directory",
  task: () => {
    if (!existsSync(DIST_DIR)) {
      mkdirSync(DIST_DIR, { recursive: true });
    }
  },
};

const bundleWithBun: ListrTask = {
  title: "Bundle with Bun",
  task: async () => {
    const buildResult = await Bun.build({
      entrypoints: [join(SDK_DIR, "src/index.ts")],
      outdir: DIST_DIR,
      target: "bun",
    });

    if (!buildResult.success) {
      throw new Error(
        `Build failed:\n${buildResult.logs.map((log) => String(log)).join("\n")}`,
      );
    }
  },
};

const generateTypes: ListrTask = {
  title: "Generate type declarations",
  task: async (ctx, task) => {
    // Uses dts-bundle-generator to produce a single dist/index.d.ts with all types
    // inlined — no @plannotator/* package specifiers that external consumers can't resolve.
    // stderr warnings (bun-types conflicts) are expected and safe to ignore; the tool
    // still produces correct output.
    const entryPoint = join(SDK_DIR, "src/index.ts");
    const tsconfigPath = join(SDK_DIR, "tsconfig.build.json");
    const dtsOutput = join(DIST_DIR, "index.d.ts");
    const dtsResult =
      await $`bunx dts-bundle-generator --project ${tsconfigPath} -o ${dtsOutput} ${entryPoint}`
        .quiet()
        .nothrow();

    if (!existsSync(dtsOutput)) {
      throw new Error(
        `dts-bundle-generator failed to produce output\n${dtsResult.stderr.toString()}`,
      );
    }

    if (dtsResult.exitCode !== 0) {
      task.output =
        "dts-bundle-generator exited with warnings (output produced successfully)";
    }
  },
};

const copyHtmlFiles: ListrTask = {
  title: "Copy HTML files",
  task: () => {
    copyFileSync(PLAN_HTML, join(DIST_DIR, "plannotator.html"));
    copyFileSync(REVIEW_HTML, join(DIST_DIR, "review-editor.html"));
  },
};

const listr = new Listr([
  buildReviewApp,
  buildHookApp,
  validatePrerequisites,
  ensureDistDir,
  bundleWithBun,
  generateTypes,
  copyHtmlFiles,
]);

await listr.run().catch(() => {
  process.exit(1);
});
