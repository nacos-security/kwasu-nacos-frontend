---
name: Workspace package installs
description: Package-management behavior in pnpm workspaces.
---

When a dependency belongs to one package in this pnpm workspace, avoid adding it to the workspace root. The generic package-install helper may execute `pnpm add` from the root and fail with `ERR_PNPM_ADDING_TO_ROOT`.

**Why:** A leaf app needed a framework dependency, and the generic helper did not accept a workspace-package target.

**How to apply:** If the package helper rejects a leaf dependency because it targets the root, use a package-scoped pnpm install for that workspace package and verify the dependency is declared in its own `package.json`.