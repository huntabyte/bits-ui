# Contributing to Bits UI

First off, thank you for considering contributing to Bits UI! We appreciate all contributions, whether it's reporting a bug, suggesting a feature, or contributing code. This document outlines how to get involved and help make Bits UI even better.

## Table of Contents

- [Contributing to Bits UI](#contributing-to-bits-ui)
  - [Table of Contents](#table-of-contents)
  - [1. Code of Conduct](#1-code-of-conduct)
  - [2. Ways to Contribute](#2-ways-to-contribute)
  - [3. Reporting Bugs](#3-reporting-bugs)
  - [4. Suggesting Features](#4-suggesting-features)
  - [5. Submitting Code (Pull Requests)](#5-submitting-code-pull-requests)
  - [6. Development Setup](#6-development-setup)
  - [7. Coding Style](#7-coding-style)
  - [8. Pull Request Title Guidelines](#8-pull-request-title-guidelines)
  - [9. Issue and Feature Request Policy](#9-issue-and-feature-request-policy)

## 1. Code of Conduct

Please review our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing. We expect all contributors to adhere to these guidelines to foster a welcoming and inclusive community.

## 2. Ways to Contribute

There are many ways to contribute to Bits UI:

- **Reporting Bugs:** If you find a bug, please report it! See [Reporting Bugs](#reporting-bugs) below.
- **Suggesting Features:** Have an idea for a new feature or improvement? Share it with us! See [Suggesting Features](#suggesting-features) below.
- **Submitting Code:** Contribute code by fixing bugs, implementing features, or improving documentation. See [Submitting Code (Pull Requests)](#submitting-code-pull-requests) below.
- **Improving Documentation:** Help us make the documentation clearer, more comprehensive, and easier to understand.
- **Answering Questions:** Help other users in the community by answering questions in GitHub Discussions.
- **Testing:** Help test new features and releases to ensure quality.

## 3. Reporting Bugs

Before reporting a bug, please:

1.  **Search Existing Issues:** Check if the bug has already been reported. If it has, add a comment to the existing issue rather than creating a new one.
2.  **Check for Updates:** Make sure you're using the latest version of Bits UI. The bug may have already been fixed.

If the bug hasn't been reported and you're using the latest version, please open a new issue. Follow these guidelines:

- **Use a Clear and Descriptive Title:** Summarize the problem concisely.
- **Provide Detailed Steps to Reproduce:** Explain exactly how to reproduce the bug. Include code snippets, screenshots, or animated GIFs if possible.
- **Include Environment Information:** Specify your operating system, browser (if applicable), and the version of Bits UI you're using.
- **Describe Expected vs. Actual Behavior:** Clearly state what you expected to happen and what actually happened.
- **Include Error Messages:** If there are any error messages, include the full text.

**Important:** Follow our [Issue and Feature Request Policy](#issue-and-feature-request-policy) - Issues are for _bugs only_.

## 4. Suggesting Features

We welcome feature suggestions! To suggest a new feature:

1.  **Start a Discussion:** Open a new discussion on GitHub Discussions. _Do not open an issue_.
2.  **Clearly Describe the Feature:** Explain the proposed feature in detail, including its benefits and use cases.
3.  **Engage with the Community:** Respond to feedback and questions from the community.
4.  **Refine the Proposal:** Based on the discussion, refine your proposal and address any concerns.

**Important:** Read our [Issue and Feature Request Policy](#issue-and-feature-request-policy) to understand how we handle feature requests.

## 5. Submitting Code (Pull Requests)

We encourage contributions via pull requests (PRs)! Here's the process:

1.  **Fork the Repository:** Create a fork of the Bits UI repository on your own GitHub account.
2.  **Clone Your Fork:** Clone your forked repository to your local machine.
3.  **Create a Branch:** Create a new branch for your feature or bug fix. Use a descriptive name (e.g., `fix/button-hover-bug`, `feat/add-accordion-component`). **Do not submit pull requests from your `main` branch.**
4.  **Make Your Changes:** Implement your changes, following the [Coding Style](#coding-style) guidelines.
5.  **Write Tests:** If you're adding a new feature or fixing a bug, write tests to ensure the code works as expected and doesn't introduce regressions.
6.  **Run Tests:** Make sure all tests pass before submitting your PR.
7.  **Commit Your Changes:** Commit your changes with clear and descriptive messages. While we don't strictly enforce Conventional Commits, strive for concise and informative commit messages.
8.  **Push to Your Fork:** Push your branch to your forked repository on GitHub.
9.  **Create a Pull Request:** Open a pull request from your branch to the `main` branch of the Bits UI repository.
10. **Link to Discussion:** If your PR is the result of a feature that was hashed out in a discussion, link to it in the PR body.
11. **Address Feedback:** Be prepared to address feedback from reviewers and make changes as needed.

**Important Considerations:**

- **Small, Focused PRs:** Keep your PRs small and focused on a single feature or bug fix. Large, sprawling PRs are difficult to review.
- **Discuss Before Coding (for large changes):** For significant changes, it's best to discuss the design and implementation details in a GitHub Discussion (or issue if a significant change is required to fix a bug) _before_ starting to code.
- **One Branch Per Feature:** Do not submit multiple features or bug fixes within a single branch/PR.
- **Do Not Use `main` Branch:** Never submit a PR from your `main` branch. This allows maintainers to make adjustments to your PR if needed.

## 6. Development Setup

To get started with development:

1.  **Clone the Repository:** `git clone https://github.com/huntabyte/bits-ui.git`
2.  **Install Dependencies:** `pnpm install`
3.  **Run the Development Server:** `pnpm dev` (this will start the docs development server, as well as watch/build the library when changes are made)

## 7. Coding Style

We use [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to enforce a consistent coding style. Please ensure your code adheres to these guidelines. You can run `pnpm lint` to check for linting errors and `pnpm format` to automatically format your code.

- Follow existing naming conventions (e.g., camelCase for variables and functions, PascalCase for components).
- Write clear and concise code.
- Add comments where necessary to explain non-obvious logic.

## 8. Pull Request Title Guidelines

The title of your pull request should be prefixed with one of the following, indicating the type of change:

- `feat:`: For a new feature.
- `fix:`: For a bug fix.
- `docs:`: For changes to documentation.
- `chore:`: For changes that don't modify source code or tests (e.g., build process, tooling).

**Examples:**

- `feat: Add support for dark mode`
- `fix: Resolve issue with button alignment`
- `docs: Update contributing guidelines`
- `chore: Upgrade dependencies`

## 9. Issue and Feature Request Policy

Please refer to our [Issue and Feature Request Policy](https://bits-ui.com/docs/policies/issues-and-feature-requests) for detailed information on how we handle issues and feature requests. This is crucial for keeping our development process organized.

---

We're excited to have you contribute to Bits UI! If you have any questions, please don't hesitate to ask in a GitHub Discussion.
