import {
  startPlannotatorServer as _startPlannotatorServer,
  handleServerReady,
  type ServerOptions as InternalServerOptions,
  type ServerResult,
} from "@plannotator/server";
import type { Origin } from "@plannotator/shared/agents";

/**
 * SDK plan server options.
 *
 * Mirrors the internal `ServerOptions` without the `opencodeClient` field,
 * which is an internal concern not exposed through the SDK public API.
 */
export interface ServerOptions {
  /** The plan markdown content */
  plan: string;
  /** Origin identifier (e.g., "claude-code", "opencode") */
  origin: Origin;
  /** HTML content to serve for the UI */
  htmlContent: string;
  /** Current permission mode to preserve (Claude Code only) */
  permissionMode?: string;
  /** Whether URL sharing is enabled (default: true) */
  sharingEnabled?: boolean;
  /** Custom base URL for share links (default: https://share.plannotator.ai) */
  shareBaseUrl?: string;
  /** Base URL of the paste service API for short URL sharing */
  pasteApiUrl?: string;
  /** Called when server starts with the URL, remote status, and port */
  onReady?: (url: string, isRemote: boolean, port: number) => void;
  /** When set to "archive", server runs in read-only archive browser mode */
  mode?: "archive";
  /** Custom plan save path — used by archive mode to find saved plans */
  customPlanPath?: string | null;
}

/** Start the plan review server with SDK-scoped options. */
export async function startPlannotatorServer(
  options: ServerOptions,
): Promise<ServerResult> {
  return _startPlannotatorServer(options as InternalServerOptions);
}

export { handleServerReady, type ServerResult };
