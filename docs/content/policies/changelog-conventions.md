---
title: Changelog Conventions
description: How we write changelog entries for Bits UI
---

This document outlines the conventions for writing changelog entries in this project. We use [changesets](https://github.com/changesets/changesets) to manage changelogs, release notes, and publishing to NPM, breaking changes into Major, Minor, and Patch categories. To maintain clarity and consistency, all changelog entries should follow the format and guidelines below.

The purpose of this document is to ensure changelog entries are concise, descriptive, and uniform, helping users quickly understand what changed, where, and why. It also streamlines the process of writing and reviewing changes.

## Format

Each entry should follow this structure:

```txt
- <type>(<scope>): <description>
```

### Format Breakdown

- **Type**: A single-word prefix that categories the change.
  - `fix`: Resolves a bug or issue.
  - `feat`: Adds a new feature or enhancement (typically for a Minor or Major release).
  - `improve`: Enhances existing functionality without fixing a bug.
  - `chore`: Internal refactors, cleanups, or tooling changes with no user-facing impact
  - `docs`: Changes to documentation in the codebase, such as JSdoc comments. Documentation site only changes do not require a changelog entry.
- **Scope**: In parentheses, specifies the affected component(s) or area
  - Use the component name (e.g., `Select`, `Tooltip`, `Calendar`) when the change is specific to a component
  - Use a general term (e.g., `all` for accessibility, `SSR` for server-side rendering) if the change spans multiple components or isn't tied to one
  - Omit scope (e.g., `fix: ...`) only if the change is truly global and not component-specific (rare).
- **Description**: A concise, lowercase phrase or sentence (no period at the end) describing the change.
  - Start with a verb (e.g., "fix", "add", "ensure", "expose") where possible.
  - Use backticks for inline code like prop names, types, or values (e.g., `disableOutsideDays`)
  - Keep it specific - avoid vague terms like "issues" unless clarified (e.g., "accessibility issues" is okay).
  - Aim for 10-15 words max.

## Examples

Here's hwo changelog entries should look:

```md
## 1.3.10

### Patch Changes

- fix(Select.Trigger): improve accessibility for screen readers and keyboard navigation
```

```md
## 1.3.7

### Patch Changes

- chore(Menubar.Content): simplify internal implementation for maintainability
- fix(Menubar): prevent multiple submenus from opening simultaneously when too close
```

```md
## 1.3.6

### Patch Changes

- fix(Calendar): prevent outside days from being focusable when `disableOutsideDays` is `true`
- fix(Range Calendar): prevent outside days from being focusable when `disableOutsideDays` is `true`
- fix(Calendar): ensure default placeholder isn't a disabled date for keyboard navigation
```
