import { readFileSync } from "node:fs";
import { join } from "node:path";

let _planHtml: string | null = null;
let _reviewHtml: string | null = null;

/**
 * Lazily load the plan review HTML from the SDK dist directory.
 * Caches the result after first read.
 */
export function getPlanHtml(): string {
  if (!_planHtml) {
    _planHtml = readFileSync(join(import.meta.dir, "plannotator.html"), "utf-8");
  }
  return _planHtml;
}

/**
 * Lazily load the code review HTML from the SDK dist directory.
 * Caches the result after first read.
 */
export function getReviewHtml(): string {
  if (!_reviewHtml) {
    _reviewHtml = readFileSync(join(import.meta.dir, "review-editor.html"), "utf-8");
  }
  return _reviewHtml;
}
