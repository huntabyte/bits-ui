---
title: Issues vs. Discussions
description: Understanding how we track bugs and feature requests
---

This document explains how we use GitHub Issues and Discussions in this repository. We use them in distinct ways to keep our development process organized and efficient. Please read this before opening a new issue or discussion!

TLDR:

-   **Issues**: For confirmed bugs and problems with the _existing_ codebase
-   **Discussions**: For proposing new features, asking questions, and discussing broader changes _before_ any code is written.

## Issues: For Bugs Only

We use GitHub Issues _exclusively_ for tracking confirmed bugs. This means:

-   **Reproducible Problems**: You should be able to clearly describe the steps to reproduce the problem. Include error messages, screenshots, and the expected vs. actual behavior. Vague reports are very difficult to act on and will likely be closed.
-   **Existing Codebase**: The issue should relate to a problem with the _current_ functionality of the project, not something you'd _like_ it to do.
-   **Not Feature Requests**: Do _not_ open an issue to suggest a new feature. Instead, use Discussions (see below).
-   **Not Support Questions**: Do not open an issue for support questions. Instead, use Discussions (see below).

### Why so strict?

Keeping the issue tracker focused solely on bugs allows us to:

-   **Prioritize Effectively**: We can quickly identify and address critical problems that are impacting users today.
-   **Maintain a Clean Backlog**: A clean issue tracker makes it easier to see the overall health of the project and track progress on fixing known problems.
-   **Avoid Duplication**: Bugs are often reported multiple times. A focused issue tracker makes it easier to find and consolidate duplicate reports.
-   **Improve Triage**: It's faster for maintainers to triage and categorize issues when they know they are dealing with concrete bugs.

### Example of a good Issue

**Title**: "Crash on mount when using prop X"

**Description**: Detailed steps to reproduce the problem, including error messages, screenshots, and ideally a minimal reproduction repository.

### Example of a bad Issue

**Title**: "It would be cool to add feature Y"

**Description**: A general idea for a new feature, without any implementation details or discussion of potential problems.

## Discussions: For Everything Else

We use GitHub discussion for just about everything _except_ confirmed bugs. This includes:

-   **Feature Requests**: This is the place to propose new features, enhancements, or changes to the project.
-   **Design Discussion**: Before submitting a large pull request, it's best to discuss the design and implementation details in a Discussion.
-   **Questions and Support**: If you're having trouble using the project, or have a general question, use the Q&A category in Discussions.
-   **Brainstorming**: Discussions are a great place to share ideas, even if they are not fully formed.
-   **RFCs (Request for Comments)**: For significant changes, we might use a Discussion as a formal RFC to gather feedback from the community.

### Why use Discussions for feature requests?

-   **Collaboration and Refinement**: Feature requests often require discussion and iteration. Discussions provide a space for the community to collaborate, refine the idea, and identify potential problems before any code is written.
-   **Prevent Premature Pull Requests**: Discussions help prevent pull requests that are based on incomplete ideas or that don't align with the project's goals. This saves time for both contributors and maintainers.
-   **Gather Community Input**: Discussions allow us to gauge the community's interest in a feature and gather feedback from potential users.
-   **Explore Alternatives**: Sometimes a feature request can be addressed in a different, better way. Discussions provide a space to explore alternative solutions.

### The Path from Discussion to Feature

1. **Start a Discussion**: Clearly describe your proposed feature, its benefits, and any potential drawbacks.
2. **Gather Feedback**: Engage with the community and respond to questions and concerns.
3. **Refine the Proposal**: Based on the feedback, refine your proposal and address any identified issues.
4. **Consensus**: Ideally, a consensus will emerge within the Discussion about the best way to proceed.
5. **Pull Request (PR)**: Once the feature has been thoroughly discussed and agreed upon, you can submit a pull request with the implementation. The PR should reference the Discussion.

### What happens if an issue is a Feature Request?

If you open an issue that is actually a feature request, a maintainer will likely:

1. **Convert it to a Discussion**: GitHub provides a handy feature to convert issues to discussions.
2. **Add a Comment**: They'll explain why the issue was converted and link to this policy.
3. **Close the original Issue**: This keeps the Issue list clean and focused.

This isn't meant to be dismissive! It's simply about keeping things organized. We value your contributions and want to make sure they're handled in the most effective way.

## Summary

By using Issues for bugs and Discussions for feature requests, we can maintain a more organized and efficient development process. This benefits both contributors and maintainers, and ultimately leads to a better project for everyone. Thanks for your cooperation!
