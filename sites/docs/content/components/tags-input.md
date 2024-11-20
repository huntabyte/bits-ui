---
title: Tags Input
description: Create and manage a list of tags/chips.
navLabel: Preview
---

<script>
	import { APISection, ComponentPreviewV2, TagsInputDemo, TagsInputDemoContentEditable, Callout } from '$lib/components'
	export let schemas;
</script>

<ComponentPreviewV2 name="tags-input-demo" comp="Tags Input">

{#snippet preview()}
<TagsInputDemo />
{/snippet}

</ComponentPreviewV2>

<Callout type="warning" title="Preview Component">

This component is currently in an early preview state and may change in the future. This process allows us to gather feedback and make improvements before the component is considered stable. If you have any feedback or suggestions, please [open an issue](https://github.com/huntabyte/bits-ui/issues/new/choose).

</Callout>

## Overview

The Tag Input component provides a flexible and customizable way to create and manage a list of tags/chips.

## Key Features

-   **Compound Component Structure**: Offers a set of sub-components that work together to create a fully-featured tag input.
-   **Accessibility**: Built-in ARIA attributes and keyboard navigation support.
-   **Customizable**: Each sub-component can be styled and configured independently.
-   **Custom Validation**: Validate the tags input's value before adding them to the list.

## Architecture

The Tags Input component is composed of several sub-components, each with a specific role:

-   **Root**: The main container component that manages the state and context for the tags input.
-   **List**: The container for the tag input's tags.
-   **Tag**: The container for a single tag within the tags input. Responsible for managing the tag's state and interactions
-   **TagContent**: The content of the tag, which typically includes the tag text and edit/remove buttons and does not include the edit input.
-   **TagText**: The text content of the tag.
-   **TagRemove**: The button responsible for removing the tag.
-   **TagEdit**: The input element which should be displayed in place of the tag when it is being edited.
-   **Input**: The main input field for the tags input, which can be used to add new tags.
-   **Clear**: A button used to clear all tags from the tags input.

## Structure

Here's an overview of how the Tags Input component is structured in code:

```svelte
<script lang="ts">
	import { TagsInput } from "bits-ui";
</script>

<TagsInput.Root>
	<TagsInput.List>
		<TagsInput.Tag>
			<TagsInput.TagContent>
				<TagsInput.TagText />
				<TagsInput.TagRemove />
			</TagsInput.TagContent>
			<TagsInput.TagEdit />
		</TagsInput.Tag>
	</TagsInput.List>
	<TagsInput.Input />
	<TagsInput.Clear />
</TagsInput.Root>
```

## Managing Value State

Bits UI offers several approaches to manage and synchronize the Tag Input's value state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:value` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { TagsInput } from "bits-ui";
	let myValue = $state([]);
</script>

<button onclick={() => (myValue = ["a", "b"])}> Change value </button>

<TagsInput.Root bind:value={myValue}>
	<!-- ... -->
</TagsInput.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the internal state changes
-   Allows external control (e.g., updating the value via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { TagsInput } from "bits-ui";
	let myValue = $state([]);
</script>

<TagsInput.Root
	value={myValue}
	onValueChange={(v) => {
		myValue = v;
		// additional logic here.
	}}
>
	<!-- ... -->
</TagsInput.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's value state, use the `controlledValue` prop. This approach requires you to manually manage the value state, giving you full control over when and how the component responds to value change events.

To implement controlled state:

1. Set the `controlledValue` prop to `true` on the `TagsInput.Root` component.
2. Provide a `value` prop to `TagsInput.Root`, which should be a variable holding the current state.
3. Implement an `onValueChange` handler to update the state when the internal state changes.

```svelte
<script lang="ts">
	import { TagsInput } from "bits-ui";
	let myValue = $state([]);
</script>

<TagsInput.Root controlledValue value={myValue} onValueChange={(v) => (myValue = v)}>
	<!-- ... -->
</TagsInput.Root>
```

#### When to Use

-   Implementing complex logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Delimiters

Delimiters are used to split the input value into multiple tags when a user types them or pastes them into the input.

By default, a single delimiter is used `','`, so when a user types or pastes `a,b,c`, the input value will be split into three tags: `a`, `b`, and `c`.

You can customize the delimiters used by setting the `delimiters` prop on the `TagsInput.Root` component.

```svelte
<TagsInput.Root delimiters={[",", ";", ":"]}>
	<!-- ... -->
</TagsInput.Root>
```

## Validation

You can use the `validate` prop to validate the tag input's value before adding it to the list. The `validate` prop should return `true` if the value is valid, and `false` if it is invalid.

This single function enables you to validate a number of different scenarios, such as ensuring the value is not empty, ensuring it doesn't contain any invalid characters, or ensuring it doesn't exceed a certain length.

The following examples show how you might use the `validate` prop to implement these scenarios.

### Maximum Tags

The `validate` prop can also be used to limit the maximum number of tags that can be added to the list.

```svelte
<script lang="ts">
	import { TagsInput } from "bits-ui";
	let value = $state<string[]>([]);
	const maxTags = 3;
</script>

<TagsInput.Root bind:value validate={(value) => value.length <= maxTags}>
	<!-- ... -->
</TagsInput.Root>
```

### Prevent Duplicate Tags

You can also use the `validate` prop to prevent duplicate tags from being added to the list.

```svelte
<script lang="ts">
	import { TagsInput } from "bits-ui";
	let myValue = $state<string[]>([]);
</script>

<TagsInput.Root bind:myValue validate={(value) => !myValue.includes(value)}>
	<!-- ... -->
</TagsInput.Root>
```

## Edit Modes

The `editMode` prop on the `TagsInput.Tag` component determines how the tag is editable. It can be set to one of the following values: `'input'`, `'contenteditable'`, or `'none'`. The default value is `'input'`.

-   `'input'`: the tag will be editable using the `TagsInput.TagEdit` component, which is an input element.
-   `'contenteditable'`: the tag will be editable using the `contenteditable` attribute on the `TagsInput.TagText` component.
-   `'none'`: the tag will not be editable.

### Examples

#### Input

The main demo at the top of this page shows an example of the default `editMode` of `'input'`.

### Content Editable

The demo below shows an example of the `editMode` of `'contenteditable'`. Try double-clicking on a tag to edit it.

<ComponentPreviewV2 name="tags-input-demo-contenteditable" comp="Tags Input" containerClass="mt-2">

{#snippet preview()}
<TagsInputDemoContentEditable />
{/snippet}

</ComponentPreviewV2>

## Blur Behavior

The `blurBehavior` prop determines how the input field is handled when it is blurred. It can be set to one of the following values: `'clear'`, `'add'`, or `'none'`. The default value is `'none'`.

-   `'none'`: the input field will not be cleared or modified when it is blurred, it will behave as an input normally would.
-   `'clear'`: the input field will be cleared when it is blurred.
-   `'add'`: the input field will be cleared and the value will be added as a new tag when it is blurred.

## Paste Behavior

The `pasteBehavior` prop determines how the input field is handled when text is pasted into it.

It can be set to one of the following values: `'add'` or `'none'`.

-   `'add'`: the pasted text will be added as a new tag when it is pasted into the input field.
-   `'none'`: the pasted text will not be automatically added as a new tag when it is pasted into the input field.

<APISection {schemas} />
