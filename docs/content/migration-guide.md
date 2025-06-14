---
title: Migration Guide
description: Learn how to migrate from 0.x to 1.x+
---

<script>
	import { Callout } from '$lib/components';
</script>

## Bits UI v1

Bits UI v1 is a major update that introduces significant improvements, but it also comes with breaking changes. Since anything before v1.0 was a pre-release, backward compatibility was not guaranteed. This guide will help you transition smoothly, though it may not cover every edge case.

We highly recommend reviewing the documentation for each component you use, as their APIs may have changed.

<Callout>

Looking for the old documentation? You can still access Bits UI v0.x at [v0.bits-ui.com](https://v0.bits-ui.com). However, we encourage you to migrate as soon as possible to take advantage of the latest features and improvements.

</Callout>

### Why Upgrade?

Bits UI has been completely rewritten for Svelte 5, bringing several key benefits:

- **Performance improvements** – Faster rendering and reduced overhead.
- **More flexible APIs** – Easier customization and integration.
- **Bug fixes and stability** – Addressing every bug and issue from v0.x.
- **Better developer experience** – Improved consistency and documentation.

Once you get familiar with Bits UI v1, we're confident you'll find it to be a more powerful and streamlined headless component library.

### Shared Changes

- **`el` prop replaced with `ref`**: The `el` prop has been removed across all components that render and HTML element. Use the `ref` prop instead. See the [ref](/docs/ref) documentation for more information.
- **`asChild` prop replaced with `child` snippet**: Components that previously used `asChild` now use the `child` snippet prop. See the [Child Snippet](/docs/child-snippet) documentation.
- **Transition props removed**: Components no longer accept `transition` props. Instead, use the `child` snippet along with `forceMount` to leverage Svelte transitions. More details in the [Transitions](/docs/transitions) documentation.
- **`let:` directives replaced with snippet props**: Components that used to expose data via `let:` directives now provide it through `children`/`child` snippet props.

### Accordion

- The `multiple` prop has been removed from the `Accordion.Root` component and replaced with a _required_ `type` prop which can be set to either `'single'` or `'multiple'`. This is used as a discriminant to properly type the `value` prop as either a `string` or `string[]`.
- The various `transition` props have been removed from the `Accordion.Content` component. See the [Transitions](/docs/transitions) documentation for more information.

See the [Accordion](/docs/components/accordion) documentation for more information.

### Alert Dialog

- The various `transition` props have been removed from the `AlertDialog.Content` and `AlertDialog.Overlay` components. See the [Transitions](/docs/transitions) documentation for more information.
- To render the dialog content in a portal, you now must wrap the `AlertDialog.Content` in the `AlertDialog.Portal` component.
- The `AlertDialog.Action` component no longer closes the dialog by default, as we learned it was causing more harm than good when attempting to submit a form with the `Action` button. See the [Form Submission](/docs/components/alert-dialog#form-submission) section for more information on how to handle submitting forms before closing the dialog.

### Button

- The `Button` component no longer accepts a `builders` prop, instead you should use the `child` snippet on the various components to receive/pass the attributes to the underlying button. See [Child Snippet](/docs/child-snippet) for more information.

### Checkbox

- The `Checkbox.Indicator` component has been removed in favor of using the `children` snippet prop to get a reference to the `checked` state and render a custom indicator. See the [Checkbox](/docs/components/checkbox) documentation for more information.
- The `Checkbox.Input` component has been removed in favor of automatically rendering a hidden input when the `name` prop is provided to the `Checkbox.Root` component.
- The `checked` state of the `Checkbox` component is now of type `boolean` instead of `boolean | 'indeterminate'`, `indeterminate` is its own state now and can be managed via the `indeterminate` prop.
- A new component, `Checkbox.Group` has been introduced to support checkbox groups.

See the [Checkbox](/docs/components/checkbox) documentation for more information.

### Combobox

- The `multiple` prop has been removed from the `Combobox.Root` component and replaced with a _required_ `type` prop which can be set to either `'single'` or `'multiple'`. This is used as a discriminant to properly type the `value` prop as either a `string` or `string[]`.
- The `selected` prop has been replaced with a `value` prop, which is limited to a `string` (or `string[]` if `type="multiple"`).
- The combobox now automatically renders a hidden input when the `name` prop is provided to the `Combobox.Root` component.
- The `Combobox.ItemIndicator` component has been removed in favor of using the `children` snippet prop to get a reference to the `selected` state and render a custom indicator. See the [Combobox](/docs/components/combobox) documentation for more information.
- `Combobox.Group` and `Combobox.GroupHeading` have been added to support groups within the combobox.
- In Bits UI v0, the `Combobox.Content` was automatically portalled unless you explicitly set the `portal` prop to `false`. In v1, we provide a `Combobox.Portal` component that you can wrap around the `Combobox.Content` to portal the content. `Combobox.Portal` accepts a `to` prop that can be used to specify the target portal container (defaults to `document.body`), and a `disabled` prop that can be used to disable portalling.

### Context Menu/Dropdown Menu/Menubar Menu

- The `*Menu.RadioIndicator` and `*Menu.CheckboxIndicator` components have been removed in favor of using the `children` snippet prop to get a reference to the `checked` or `selected` state and render a custom indicator. See the [Context Menu](/docs/components/context-menu), [Dropdown Menu](/docs/components/dropdown-menu), and [Menubar](/docs/components/menubar) documentation for more information.
- The `*Menu.Label` component, which was used as the heading for a group of items has been replaced with the `*Menu.GroupHeading` component.
- The `href` prop on the `.Item` components has been removed in favor of the `child` snippet and rendering your own anchor element.
- In Bits UI v0, the `*Menu.Content` was automatically portalled unless you explicitly set the `portal` prop to `false`. In v1, we provide a `*Menu.Portal` component that you can wrap around the `*Menu.Content` to portal the content. `*Menu.Portal` accepts a `to` prop that can be used to specify the target portal container (defaults to `document.body`), and a `disabled` prop that can be used to disable portalling.

### Pin Input

- The `PinInput` component has been completely overhauled to better act as an OTP input component, with code and inspiration taken from [Input OTP](https://github.com/guilhermerodz/input-otp) by [Guilherme Rodz](https://x.com/guilhermerodz). The best way to migrate is to reference the [Pin Input](/docs/components/pin-input) documentation to see how to use the new component.

### Popover

- In Bits UI v0, the `Popover.Content` was automatically portalled unless you explicitly set the `portal` prop to `false`. In v1, we provide a `Popover.Portal` component that you can wrap around the `Popover.Content` to portal the content. `Popover.Portal` accepts a `to` prop that can be used to specify the target portal container (defaults to `document.body`), and a `disabled` prop that can be used to disable portalling.

### Radio Group

- `RadioGroup.ItemIndicator` has been removed in favor of using the `children` snippet prop to get a reference to the `checked` state which provides more flexibility to render a custom indicator as needed. See the [Radio Group](/docs/components/radio-group) documentation for more information.

### Scroll Area

- `ScrollArea.Content` has been removed as it is not necessary for functionality in Bits UI v1.

### Select

- The `multiple` prop has been removed from the `Select.Root` component and replaced with a _required_ `type` prop which can be set to either `'single'` or `'multiple'`. This is used as a discriminant to properly type the `value` prop as either a `string` or `string[]`.
- The `selected` prop has been replaced with a `value` prop, which is limited to a `string` (or `string[]` if `type="multiple"`).
- The select now automatically renders a hidden input when the `name` prop is provided to the `Select.Root` component.
- The `Select.ItemIndicator` component has been removed in favor of using the `children` snippet prop to get a reference to the `selected` state and render a custom indicator. See the [Select](/docs/components/select) documentation for more information.
- `Select.Group` and `Select.GroupHeading` have been added to support groups within the Select.
- `Select.Value` has been removed in favor of enabling developers to use the `value` prop to render your own custom label in the trigger to represent the value.
- In Bits UI v0, the `Select.Content` was automatically portalled unless you explicitly set the `portal` prop to `false`. In v1, we provide a `Select.Portal` component that you can wrap around the `Select.Content` to portal the content. `Select.Portal` accepts a `to` prop that can be used to specify the target portal container (defaults to `document.body`), and a `disabled` prop that can be used to disable portalling.

### Slider

- `Slider.Root` now requires a `type` prop to be set to either `'single'` or `'multiple'` to properly type the `value` as either a `number` or `number[]`.
- A new prop, `onValueCommit` has been introduced which is called when the user commits a value change (e.g. by releasing the mouse button or pressing Enter). This is useful for scenarios where you want to update the value only when the user has finished interacting with the slider, not for each movement of the thumb.

### Tooltip

- A required component necessary to provide context for shared tooltips, `Tooltip.Provider` has been added. This replaces the `group` prop on the previous version's `Tooltip` component. You can wrap your entire app with `Tooltip.Provider`, or wrap a specific section of your app with it to provide shared context for tooltips.
