import {
  startReviewServer as _startReviewServer,
  handleReviewServerReady,
  type ReviewServerOptions as InternalReviewServerOptions,
  type ReviewServerResult,
} from "@plannotator/server/review";
import type { Origin } from "@plannotator/shared/agents";
import type { DiffType, GitContext } from "../git";
import type { PRMetadata } from "../pr";

/**
 * SDK review server options.
 *
 * Mirrors the internal `ReviewServerOptions` without the `opencodeClient` field,
 * which is an internal concern not exposed through the SDK public API.
 */
export interface ReviewServerOptions {
  /** Raw git diff patch string */
  rawPatch: string;
  /** Git ref used for the diff (e.g., "HEAD", "main..HEAD", "--staged") */
  gitRef: string;
  /** Error message if git diff failed */
  error?: string;
  /** HTML content to serve for the UI */
  htmlContent: string;
  /** Origin identifier for UI customization */
  origin?: Origin;
  /** Current diff type being displayed */
  diffType?: DiffType;
  /** Git context with branch info and available diff options */
  gitContext?: GitContext;
  /** Whether URL sharing is enabled (default: true) */
  sharingEnabled?: boolean;
  /** Custom base URL for share links (default: https://share.plannotator.ai) */
  shareBaseUrl?: string;
  /** Called when server starts with the URL, remote status, and port */
  onReady?: (url: string, isRemote: boolean, port: number) => void;
  /** PR metadata when reviewing a pull request (PR mode) */
  prMetadata?: PRMetadata;
}

/** Start the code review server with SDK-scoped options. */
export async function startReviewServer(
  options: ReviewServerOptions,
): Promise<ReviewServerResult> {
  return _startReviewServer(options as InternalReviewServerOptions);
}

export { handleReviewServerReady, type ReviewServerResult };
