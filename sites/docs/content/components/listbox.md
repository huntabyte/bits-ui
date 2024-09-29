---
title: Listbox
description: A list of options that can be selected by the user.
---

<script>
	import { APISection, ComponentPreviewV2, ListboxDemo, ListboxDemoCustomAnchor, Callout } from '$lib/components'
	export let schemas;
</script>

<ComponentPreviewV2 name="listbox-demo" comp="Listbox">

{#snippet preview()}
<ListboxDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The Listbox component provides users with a selectable list of options. It's designed to offer an enhanced selection experience with features like typeahead search, keyboard navigation, and customizable grouping. This component is particularly useful for scenarios where users need to choose from a predefined set of options, offering more functionality than a standard select element.

## Key Features

-   **Typeahead Search**: Users can quickly find options by typing
-   **Keyboard Navigation**: Full support for keyboard interactions, allowing users to navigate through options using arrow keys, enter to select, and more.
-   **Grouped Options**: Ability to organize options into logical groups, enhancing readability and organization of large option sets.
-   **Scroll Management**: Includes scroll up/down buttons for easy navigation in long lists.
-   **Accessibility**: Built-in ARIA attributes and keyboard support ensure compatibility with screen readers and adherence to accessibility standards.
-   **Portal Support**: Option to render the listbox content in a portal, preventing layout issues in complex UI structures.

## Architecture

The Listbox component is composed of several sub-components, each with a specific role:

-   **Root**: The main container component that manages the state and context for the combobox.
-   **Trigger**: The button or element that opens the dropdown list.
-   **Portal**: Responsible for portalling the dropdown content to the body or a custom target.
-   **Group**: A container for grouped items, used to group related items.
-   **GroupHeading**: A heading for a group of items, providing a descriptive label for the group.
-   **Item**: An individual item within the list.
-   **Separator**: A visual separator between items.
-   **Content**: The dropdown container that displays the items. It uses [Floating UI](https://floating-ui.com/) to position the content relative to the trigger.
-   **ContentStatic** (Optional): An alternative to the Content component, that enables you to opt-out of Floating UI and position the content yourself.
-   **Arrow**: An arrow element that points to the trigger when using the `Combobox.Content` component.

## Structure

Here's an overview of how the Listbox component is structured in code:

```svelte
<script lang="ts">
	import { Listbox } from "bits-ui";
</script>

<Listbox.Root>
	<Listbox.Trigger />
	<Listbox.Portal>
		<Listbox.Content>
			<Listbox.ScrollUpButton />
			<Listbox.Viewport>
				<Listbox.Item />
				<Listbox.Group>
					<Listbox.GroupHeading />
					<Listbox.Item />
				</Listbox.Group>
				<Listbox.ScrollDownButton />
			</Listbox.Viewport>
		</Listbox.Content>
	</Listbox.Portal>
</Listbox.Root>
```

## Reusable Components

As you can see from the structure above, there are a number of pieces that make up the `Listbox` component. These pieces are provided to give you maximum flexibility and customization options, but can be a burden to write out everywhere you need to use a listbox in your application.

To ease this burden, it's recommended to create your own reusable listbox component that wraps the primitives and provides a more convenient API for your use cases.

Here's an example of how you might create a reusable `MyListbox` component that receives a list of options and renders each of them as an item.

```svelte title="MyListbox.svelte"
<script lang="ts">
	import { Listbox, type WithoutChildren } from "bits-ui";

	type Props = WithoutChildren<Listbox.RootProps> & {
		placeholder?: string;
		items: { value: string; label: string; disabled?: boolean }[];
		contentProps?: WithoutChildren<Listbox.ContentProps>;
		// any other specific component props if needed
	};

	let { value = $bindable(""), items, contentProps, placeholder, ...restProps }: Props = $props();

	const selectedLabel = $derived(items.find((item) => item.value === value)?.label);
</script>

<Listbox.Root bind:value {...restProps}>
	<Listbox.Trigger>
		{#if selectedLabel}
			<Listbox.Value>
				{selectedLabel}
			</Listbox.Value>
		{:else}
			<Listbox.Value {placeholder} />
		{/if}
	</Listbox.Trigger>
	<Listbox.Portal>
		<Listbox.Content {...contentProps}>
			<Listbox.ScrollUpButton>up</Listbox.ScrollUpButton>
			<Listbox.Viewport>
				{#each items as { value, label, disabled } (value)}
					<Listbox.Item {value} textValue={label} {disabled}>
						{#snippet children({ selected })}
							{selected ? "✅" : ""}
							<Listbox.ItemText>
								{item.label}
							</Listbox.ItemText>
						{/snippet}
					</Listbox.Item>
				{/each}
			</Listbox.Viewport>
			<Listbox.ScrollDownButton>down</Listbox.ScrollDownButton>
		</Listbox.Content>
	</Listbox.Portal>
</Listbox.Root>
```

You can then use the `MyListbox` component throughout your application like so:

```svelte
<script lang="ts">
	import MyListbox from "$lib/components/MyListbox.svelte";

	const items = [
		{ value: "apple", label: "Apple" },
		{ value: "banana", label: "Banana" },
		{ value: "cherry", label: "Cherry" },
	];

	let fruit = $state("apple");
</script>

<MyListbox {items} bind:value={fruit} />
```

## Managing Value State

Bits UI offers several approaches to manage and synchronize the Listbox's value state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:value` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { Listbox } from "bits-ui";
	let myValue = $state("");
</script>

<button onclick={() => (myValue = "A")}> Select A </button>

<Listbox.Root bind:value={myValue}>
	<!-- ... -->
</Listbox.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the internal state changes (e.g., via clicking on an item)
-   Allows external control (e.g., selecting an item via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { Listbox } from "bits-ui";
	let myValue = $state("");
</script>

<Listbox.Root
	value={myValue}
	onValueChange={(value) => {
		myValue = value;
		// additional logic here.
	}}
>
	<!-- ... -->
</Listbox.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's value state, use the `controlledValue` prop. This approach requires you to manually manage the value state, giving you full control over when and how the component responds to value change events.

To implement controlled state:

1. Set the `controlledValue` prop to `true` on the `Listbox.Root` component.
2. Provide a `value` prop to `Listbox.Root`, which should be a variable holding the current state.
3. Implement an `onValueChange` handler to update the state when the internal state changes.

```svelte
<script lang="ts">
	import { Listbox } from "bits-ui";
	let myValue = $state("");
</script>

<Listbox.Root controlledValue value={myValue} onValueChange={(v) => (myValue = v)}>
	<!-- ... -->
</Listbox.Root>
```

#### When to Use

-   Implementing complex open/close logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Managing Open State

Bits UI offers several approaches to manage and synchronize the Listbox's open state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:open` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { Listbox } from "bits-ui";
	let myOpen = $state(false);
</script>

<button onclick={() => (myOpen = true)}> Open </button>

<Listbox.Root bind:open={myOpen}>
	<!-- ... -->
</Listbox.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myOpen` when the internal state changes (e.g., via clicking on the trigger/input)
-   Allows external control (e.g., opening via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onOpenChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { Listbox } from "bits-ui";
	let myOpen = $state(false);
</script>

<Listbox.Root
	open={myOpen}
	onOpenChange={(o) => {
		myOpen = o;
		// additional logic here.
	}}
>
	<!-- ... -->
</Listbox.Root>
```

#### Use Cases

-   Implementing custom behaviors on open change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's value state, use the `controlledOpen` prop. This approach requires you to manually manage the value state, giving you full control over when and how the component responds to value change events.

To implement controlled state:

1. Set the `controlledOpen` prop to `true` on the `Listbox.Root` component.
2. Provide an `open` prop to `Listbox.Root`, which should be a variable holding the current state.
3. Implement an `onOpenChange` handler to update the state when the internal state changes.

```svelte
<script lang="ts">
	import { Listbox } from "bits-ui";
	let myOpen = $state(false);
</script>

<Listbox.Root controlledOpen open={myOpen} onOpenChange={(v) => (myOpen = v)}>
	<!-- ... -->
</Listbox.Root>
```

#### When to Use

-   Implementing complex open/close logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Opt-out of Floating UI

When you use the `Listbox.Content` component, Bits UI uses [Floating UI](https://floating-ui.com/) to position the content relative to the trigger, similar to other popover-like components.

You can opt-out of this behavior by instead using the `Listbox.ContentStatic` component.

```svelte {4,14}
<Listbox.Root>
	<Listbox.Trigger />
	<Listbox.Portal>
		<Listbox.ContentStatic>
			<Listbox.ScrollUpButton />
			<Listbox.Viewport>
				<Listbox.Item />
				<Listbox.Group>
					<Listbox.GroupHeading />
					<Listbox.Item />
				</Listbox.Group>
				<Listbox.ScrollDownButton />
			</Listbox.Viewport>
		</Listbox.ContentStatic>
	</Listbox.Portal>
</Listbox.Root>
```

When using this component, you'll need to handle the positioning of the content yourself. Keep in mind that using `Listbox.Portal` alongside `Listbox.ContentStatic` may result in some unexpected positioning behavior, feel free to not use the portal or work around it.

## Custom Anchor

By default, the `Listbox.Content` is anchored to the `Listbox.Trigger` component, which determines where the content is positioned.

If you wish to instead anchor the content to a different element, you can pass either a selector string or an `HTMLElement` to the `customAnchor` prop of the `Listbox.Content` component.

```svelte
<script lang="ts">
	import { Listbox } from "bits-ui";

	let customAnchor = $state<HTMLElement>(null!);
</script>

<div bind:this={customAnchor}></div>

<Listbox.Root>
	<Listbox.Trigger />
	<Listbox.Content {customAnchor}>
		<!-- ... -->
	</Listbox.Content>
</Listbox.Root>
```

<ListboxDemoCustomAnchor />

## What is the Viewport?

The `Listbox.Viewport` component is used to determine the size of the content in order to determine whether or not the scroll up and down buttons should be rendered.

If you wish to set a minimum/maximum height for the select content, you should apply it to the `Listbox.Viewport` component.

## Scroll Up/Down Buttons

The `Listbox.ScrollUpButton` and `Listbox.ScrollDownButton` components are used to render the scroll up and down buttons when the select content is larger than the viewport.

You must use the `Listbox.Viewport` component when using the scroll buttons.

## Native Scrolling/Overflow

If you don't want to use the scroll buttons and prefer to use the standard scrollbar/overflow behavior, you can omit the `Listbox.Scroll[Up|Down]Button` components and the `Listbox.Viewport` component.

You'll need to set a height on the `Listbox.Content` component and appropriate `overflow` styles to enable scrolling.

## Scroll Lock

By default, when a user opens the listbox, scrolling outside the content will be disabled. You can override this behavior by setting the `preventScroll` prop to `false`.

```svelte /preventScroll={false}/
<Listbox.Content preventScroll={false}>
	<!-- ... -->
</Listbox.Content>
```

## Highlighted Items

The Listbox component follows the [WAI-ARIA descendant pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox) for highlighting items. This means that the `Listbox.Trigger` retains focus the entire time, even when navigating with the keyboard, and items are highlighted as the user navigates them.

### Styling Highlighted Items

You can use the `data-highlighted` attribute on the `Listbox.Item` component to style the item differently when it is highlighted.

### onHighlight / onUnhighlight

To trigger side effects when an item is highlighted or unhighlighted, you can use the `onHighlight` and `onUnhighlight` props.

```svelte
<Listbox.Item onHighlight={() => console.log('I am highlighted!')} onUnhighlight={() => console.log('I am unhighlighted!')} />
<!-- ... -->
</Listbox.Item>
```

## Select vs. Listbox

Use `Select` as a drop-in replacement for `<select>`, supporting form auto-fill. Use `Listbox` for multi-select or custom single-select needs outside forms. For single-select within forms, prefer `Select`.

<APISection {schemas} />
