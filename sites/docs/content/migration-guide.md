---
title: Migration Guide
description: Learn how to migrate from 0.x to 1.x
---

Anything before 1.0 is considered a pre-release version and is not guaranteed to be stable. While this guide may not be all encompassing, there were a lot of changes made not only to the library, but to Svelte itself.

The hope is that this information will get you most of the way there, but it's _highly_ encouraged to check the documentation for the components you're using to determine what else may have changed.

## Why Migrate?

Bits UI has been completely rewritten from the ground up to support Svelte 5. The rewrite has provided us with a number of benefits in the form of performance improvements, bug fixes, more flexible APIs, and an overall improved developer experience.

Once you learn how to use the new version of Bits UI, we're confident you'll find it to be a much more capable headless component library than before.

## Shared Changes

-   The `el` prop has been replaced with a `ref` prop across all components that render an HTML element. See the [Ref](/docs/ref) documentation for more information.
-   The `asChild` prop has been replaced with a `child` snippet prop across all components that render an HTML element. See the [Child Snippet](/docs/child-snippet) documentation for more information.
-   Components that used to accept `transition` props no longer do in favor of using the `child` snippet along with `forceMount` to use Svelte transitions. See the [Transitions](/docs/transitions) documentation for more information.
-   Components that used to provide data via `let:` directives now provide that data via `children`/`child` snippet props.

## Accordion

-   The `multiple` prop has been removed from the `Accordion.Root` component and replaced with a _required_ `type` prop which can be set to either `'single'` or `'multiple'`. This is used as a discriminant to properly type the `value` prop as either a `string` or `string[]`.
-   The various `transition` props have been removed from the `Accordion.Content` component. See the [Transitions](/docs/transitions) documentation for more information.

## Alert Dialog

-   The various `transition` props have been removed from the `AlertDialog.Content` and `AlertDialog.Overlay` components. See the [Transitions](/docs/transitions) documentation for more information.
-   To render the dialog content in a portal, you now must wrap the `AlertDialog.Content` in the `AlertDialog.Portal` component.
-   The `AlertDialog.Action` component no longer closes the dialog by default, as we learned it was causing more harm than good when attempting to submit a form with the `Action` button. See the [Form Submission](/docs/components/alert-dialog#form-submission) section for more information on how to handle submitting forms before closing the dialog.

## Button

-   The `Button` component no longer accepts a `builders` prop, instead you should use the `child` snippet on the various components to receive/pass the attributes to the underlying button. See [Child Snippet](/docs/child-snippet) for more information.

## Checkbox

-   The `Checkbox.Indicator` component has been removed in favor of using the `children` snippet prop to get a reference to the `checked` state and render a custom indicator. See the [Checkbox](/docs/components/checkbox) documentation for more information.
-   The `Checkbox.Input` component has been removed in favor of automatically rendering a hidden input when the `name` prop is provided to the `Checkbox.Root` component.

## Combobox

-   The `multiple` prop has been removed from the `Combobox.Root` component and replaced with a _required_ `type` prop which can be set to either `'single'` or `'multiple'`. This is used as a discriminant to properly type the `value` prop as either a `string` or `string[]`.
-   The `selected` prop has been replaced with a `value` prop, which is limited to a `string` (or `string[]` if `type="multiple"`).
-   The combobox now automatically renders a hidden input when the `name` prop is provided to the `Combobox.Root` component.
-   The `Combobox.ItemIndicator` component has been removed in favor of using the `children` snippet prop to get a reference to the `selected` state and render a custom indicator. See the [Combobox](/docs/components/combobox) documentation for more information.
-   `Combobox.Group` and `Combobox.GroupHeading` have been added to support groups within the combobox.

## Context Menu/Dropdown Menu/Menubar Menu

-   The `.RadioIndicator` and `.CheckboxIndicator` components have been removed in favor of using the `children` snippet prop to get a reference to the `checked` or `selected` state and render a custom indicator. See the [Context Menu](/docs/components/context-menu), [Dropdown Menu](/docs/components/dropdown-menu), and [Menubar](/docs/components/menubar) documentation for more information.
-   The `.Label` component, which was used as the heading for a group of items has been replaced with the `.GroupHeading` component.
-   The `href` prop on the `.Item` components has been removed in favor of the `child` snippet and rendering your own anchor element.

## Pin Input

-   The `PinInput` component has been overhauled to better act as an OTP input component. See the [Pin Input](/docs/components/pin-input) documentation for more information.

## Select

-   The `multiple` prop has been removed from the `Select.Root` component and replaced with a _required_ `type` prop which can be set to either `'single'` or `'multiple'`. This is used as a discriminant to properly type the `value` prop as either a `string` or `string[]`.
-   The `selected` prop has been replaced with a `value` prop, which is limited to a `string` (or `string[]` if `type="multiple"`).
-   The select now automatically renders a hidden input when the `name` prop is provided to the `Select.Root` component.
-   The `Select.ItemIndicator` component has been removed in favor of using the `children` snippet prop to get a reference to the `selected` state and render a custom indicator. See the [Select](/docs/components/select) documentation for more information.
-   `Select.Group` and `Select.GroupHeading` have been added to support groups within the Select.

## Tooltip

-   A required component necessary to provide context for shared tooltips, `Tooltip.Provider` has been added. This replaces the `group` prop on the previous version's `Tooltip` component. You can wrap your entire app with `Tooltip.Provider`, or wrap a specific section of your app with it to provide shared context for tooltips.
