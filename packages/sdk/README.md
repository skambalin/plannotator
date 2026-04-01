# @plannotator/sdk

Server-side SDK for [Plannotator](https://github.com/backnotprop/plannotator) — exposes internal APIs for building external plugins and integrations.

This package bundles and re-exports functionality from Plannotator's internal packages so that third-party projects can launch plan review, code review, and annotation servers, run git operations, and access bundled UI assets without depending on monorepo internals directly.

> [!NOTE]
> This package requires **Bun >= 1.0.0** as a peer dependency.

## Installation

```bash
npm install @plannotator/sdk
```

## Internal Packages

The SDK surfaces APIs from these internal Plannotator packages:

| Package | Description |
| --- | --- |
| [`@plannotator/server`](https://github.com/backnotprop/plannotator/tree/main/packages/server) | Server implementations for plan review, code review, and annotation |
| [`@plannotator/shared`](https://github.com/backnotprop/plannotator/tree/main/packages/shared) | Shared types, utilities, and cross-runtime logic |
| [`@plannotator/ai`](https://github.com/backnotprop/plannotator/tree/main/packages/ai) | Provider-agnostic AI backbone for sessions and endpoints |

## API Overview

### Plan Review Server

Start a plan review server and open the UI in a browser.

```ts
import {
  startPlannotatorServer,
  handleServerReady,
  type ServerOptions,
  type ServerResult,
} from "@plannotator/sdk";
```

### Code Review Server

Start a code review server backed by a git diff.

```ts
import {
  startReviewServer,
  handleReviewServerReady,
  getReviewHtml,
  type ReviewServerOptions,
  type ReviewServerResult,
} from "@plannotator/sdk";
```

### Annotate Server

Start an annotation server for arbitrary markdown files.

```ts
import {
  startAnnotateServer,
  handleAnnotateServerReady,
  type AnnotateServerOptions,
  type AnnotateServerResult,
} from "@plannotator/sdk";
```

### Git Operations

Diff generation, branch detection, file staging, and worktree support.

```ts
import {
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
} from "@plannotator/sdk";
```

### PR Operations

Parse PR URLs, fetch PR data, submit reviews, and track viewed files across GitHub and GitLab.

```ts
import {
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
} from "@plannotator/sdk";
```

### Remote Session Detection

Detect devcontainer/SSH environments and resolve the appropriate server port.

```ts
import { isRemoteSession, getServerPort } from "@plannotator/sdk";
```

### Browser Launch

Cross-platform browser opening with WSL support.

```ts
import { openBrowser, isWSL } from "@plannotator/sdk";
```

### File Resolution

Resolve and validate markdown file paths for the annotate flow.

```ts
import {
  resolveMarkdownFile,
  normalizeMarkdownPathInput,
  isAbsoluteMarkdownPath,
  hasMarkdownFiles,
  type ResolveResult,
} from "@plannotator/sdk";
```

### Feedback Templates

Pre-built feedback formatters for plan deny responses.

```ts
import { planDenyFeedback, type PlanDenyFeedbackOptions } from "@plannotator/sdk";
```

### HTML Accessors

Retrieve the bundled single-file HTML apps for plan review and code review UIs.

```ts
import { getPlanHtml, getReviewHtml } from "@plannotator/sdk";

const planHtml = getPlanHtml(); // Full plan review HTML string
const reviewHtml = getReviewHtml(); // Full code review HTML string
```

### SDK Types

The `SDKClient` interface defines the contract for external plugins to communicate with the host agent.

```ts
import type { SDKClient } from "@plannotator/sdk";

// All members are optional — provide what your plugin needs
const client: SDKClient = {
  send: async (message) => {
    // Forward message back to the coding session
  },
};
```

## License

[MIT OR Apache-2.0](https://github.com/backnotprop/plannotator/blob/main/LICENSE)

## Contributing

See the [root README](https://github.com/backnotprop/plannotator#readme) for development setup, build instructions, and contribution guidelines.
