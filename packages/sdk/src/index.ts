// Server — plan review
export {
  startPlannotatorServer,
  handleServerReady,
  type ServerOptions,
  type ServerResult,
} from "./server/plan";

// Server — code review
export {
  startReviewServer,
  handleReviewServerReady,
  type ReviewServerOptions,
  type ReviewServerResult,
} from "./server/review";

// Server — annotate
export {
  startAnnotateServer,
  handleAnnotateServerReady,
  type AnnotateServerOptions,
  type AnnotateServerResult,
} from "./server/annotate";

// Git operations
export {
  getCurrentBranch,
  getDefaultBranch,
  getWorktrees,
  getGitContext,
  runGitDiff,
  runGitDiffWithContext,
  getFileContentsForDiff,
  gitAddFile,
  gitResetFile,
  parseWorktreeDiffType,
  validateFilePath,
  type DiffOption,
  type DiffType,
  type DiffResult,
  type GitContext,
  type WorktreeInfo,
} from "./git";

// PR operations
export {
  parsePRUrl,
  checkPRAuth,
  getPRUser,
  fetchPR,
  fetchPRContext,
  fetchPRFileContent,
  submitPRReview,
  fetchPRViewedFiles,
  markPRFilesViewed,
  prRefFromMetadata,
  getPlatformLabel,
  getMRLabel,
  getMRNumberLabel,
  getDisplayRepo,
  getCliName,
  getCliInstallUrl,
  type PRRef,
  type PRMetadata,
  type PRContext,
  type PRReviewFileComment,
  type GithubPRMetadata,
} from "./pr";

// Remote session detection
export { isRemoteSession, getServerPort } from "./remote";

// Browser launch
export { openBrowser, isWSL } from "./browser";

// File resolution
export {
  resolveMarkdownFile,
  normalizeMarkdownPathInput,
  isAbsoluteMarkdownPath,
  hasMarkdownFiles,
  type ResolveResult,
} from "./files";

// Feedback templates
export { planDenyFeedback, type PlanDenyFeedbackOptions } from "./feedback";

// HTML accessors (SDK-native)
export { getPlanHtml, getReviewHtml } from "./html";

// SDK types
export type { SDKClient } from "./types";
