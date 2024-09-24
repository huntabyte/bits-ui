---
title: Listbox
description: A list of options that can be selected by the user.
---

<script>
	import { APISection, ComponentPreviewV2, ListboxDemo } from '$lib/components'
	export let schemas;
</script>

<ComponentPreviewV2 name="listbox-demo" comp="Listbox">

{#snippet preview()}
<ListboxDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The `Listbox` component gives you the ability to create a list of options that can be selected by the user. This component offers a variety of features, such as typeahead, keyboard navigation, scroll up/down buttons, and more.

## Structure

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

The `value` represents the currently selected item/option within the listbox. Bits UI provides flexible options for controlling and synchronizing the Listbox's value state.

### Two-Way Binding

Use the `bind:value` directive for effortless two-way synchronization between your local state and the Listbox's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { Listbox } from "bits-ui";
	let myValue = $state<string>("");
</script>

<button onclick={() => (myValue = "apple")}> Apple </button>

<Listbox.Root bind:value={myValue}>
	<!-- ... -->
</Listbox.Root>
```

This setup enables toggling the value via the custom button and ensures the local `myValue` state updates when the Listbox's value changes through any internal means (e.g., clicking on an item's button).

### Change Handler

You can also use the `onValueChange` prop to update local state when the Listbox's `value` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the Select changes.

```svelte {3,7-11}
<script lang="ts">
	import { Listbox } from "bits-ui";
	let myValue = $state<string>("");
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

## Managing Open State

The `open` state represents whether or not the listbox content is open. Bits UI provides flexible options for controlling and synchronizing the Listbox's open state.

### Two-Way Binding

Use the `bind:open` directive for effortless two-way synchronization between your local state and the Listbox's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { Listbox } from "bits-ui";
	let isOpen = $state(false);
</script>

<button onclick={() => (open = true)}> Open listbox </button>

<Listbox.Root bind:open={isOpen}>
	<!-- ... -->
</Listbox.Root>
```

This setup enables toggling the Listbox via the custom button and ensures the local `isOpen` state updates when the Listbox's open state changes through any internal means e.g. clicking on the trigger or outside the content.

### Change Handler

You can also use the `onOpenChange` prop to update local state when the Listbox's `open` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the Listbox's open state changes.

```svelte {3,7-11}
<script lang="ts">
	import { Listbox } from "bits-ui";
	let isOpen = $state(false);
</script>

<Listbox.Root
	open={isOpen}
	onOpenChange={(open) => {
		isOpen = open;
		// additional logic here.
	}}
>
	<!-- ... -->
</Listbox.Root>
```

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

<APISection {schemas} />
