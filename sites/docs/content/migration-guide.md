---
title: Migration Guide
description: Learn how to migrate from the previous version of Bits UI to the latest version.
---

## Why Migrate?

Bits UI has been completely rewritten from the ground up to support Svelte 5. The rewrite has provided us with a number of benefits in the form of performance improvements, bug fixes, more flexible APIs, and an overall improved developer experience.

Once you learn how to use the new version of Bits UI, we're confident you'll find it to be a much more capable headless component library than before.

## Shared Changes

-   The `el` prop has been replaced with a `ref` prop across all components that render an HTML element. See the [Ref](/docs/ref) documentation for more information.
-   The `asChild` prop has been replaced with a `child` snippet prop across all components that render an HTML element. See the [Child Snippet](/docs/child-snippet) documentation for more information.
-   Components that used to accept `transition` props no longer do in favor of using the `child` snippet to use Svelte transitions. See the [Transitions](/docs/transitions) documentation for more information.
-   Components that used to provide data via `let:` directives now provide that data via `children`/`child` snippet props.

## Accordion

-   The `multiple` prop has been removed from the `Accordion.Root` component and replaced with a _required_ `type` prop which can be set to either `'single'` or `'multiple'`. This is used as a discriminant to properly type the `value` prop as either a `string` or `string[]`.
-   The various `transition` props have been removed from the `Accordion.Content` component. See the [Transitions](/docs/transitions) documentation for more information.

## Alert Dialog

-   The various `transition` props have been removed from the `AlertDialog.Content` and `AlertDialog.Overlay` components. See the [Transitions](/docs/transitions) documentation for more information.
-   To render the dialog content in a portal, you now must wrap the `AlertDialog.Content` in the `AlertDialog.Portal` component.
-   The `AlertDialog.Action` component no longer closes the dialog by default, as we learned it was causing more harm than good when attempting to submit a form with the `Action` button. See the [Form Submission](/docs/components/alert-dialog#form-submission) section for more information on how to handle submitting forms before closing the dialog.

## Button

-   The `Button` component no longer accepts a `builders` prop.

## Checkbox

-   The `Checkbox.Indicator` component has been removed in favor of using the `children` snippet prop to get a reference to the `checked` state and render a custom indicator. See the [Checkbox](/docs/components/checkbox) documentation for more information.
-   The `Checkbox.Input` component has been removed in favor of automatically rendering a hidden input when the `name` prop is provided to the `Checkbox.Root` component.
