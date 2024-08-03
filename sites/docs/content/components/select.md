---
title: Select
description: Enables users to choose from a list of options presented in a dropdown.
---

<script>
	import { APISection, ComponentPreviewV2, SelectDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="select-demo" comp="Select">

{#snippet preview()}
<SelectDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The `Select` component can be used as a replacement for the native `<select>` element in your application. It provides a more flexible and customizable way to select an option from a list of options. The component offers a variety of features, such as typeahead, keyboard navigation, scroll up/down buttons, and more.

## Structure

```svelte
<script lang="ts">
	import { Select } from "bits-ui";
</script>

<Select.Root>
	<Select.Trigger>
		<Select.Value />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content>
			<Select.ScrollUpButton />
			<Select.Viewport>
				<Select.Item>
					<Select.ItemText />
				</Select.Item>
			</Select.Viewport>
			<Select.ScrollDownButton />
		</Select.Content>
	</Select.Portal>
</Select.Root>
```

## Reusable Components

As you can see from the structure above, there are a number of pieces that make up the `Select` component. These pieces are provided to give you maximum flexibility and customization options, but can be a burden to write out everywhere you need to use a `Select` in your application.

To ease this burden, it's recommended to create your own reusable `Select` component that wraps the primitives and provides a more convenient API for your use cases.

Here's an example of how you might create a reusable `MySelect` component that receives a list of options and renders each of them as an item.

```svelte title="MySelect.svelte"
<script lang="ts">
	import { Select, type WithoutChildren } from "bits-ui";

	type Props = WithoutChildren<Select.RootProps> & {
		placeholder?: string;
		items: { value: string; label: string; disabled?: boolean }[];
		contentProps?: WithoutChildren<Select.ContentProps>;
		// any other specific component props if needed
	};

	let { value = $bindable(""), items, contentProps, placeholder, ...restProps }: Props = $props();

	const selectedLabel = $derived(items.find((item) => item.value === value)?.label);
</script>

<Select.Root bind:value {...restProps}>
	<Select.Trigger>
		{#if selectedLabel}
			<Select.Value>
				{selectedLabel}
			</Select.Value>
		{:else}
			<Select.Value {placeholder} />
		{/if}
	</Select.Trigger>
	<Select.Portal>
		<Select.Content {...contentProps}>
			<Select.ScrollUpButton>up</Select.ScrollUpButton>
			<Select.Viewport>
				{#each items as { value, label, disabled } (value)}
					<Select.Item {value} textValue={label} {disabled}>
						{#snippet children({ selected })}
							{selected ? "✅" : ""}
							<Select.ItemText>
								{item.label}
							</Select.ItemText>
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Viewport>
			<Select.ScrollDownButton>down</Select.ScrollDownButton>
		</Select.Content>
	</Select.Portal>
</Select.Root>
```

You can then use the `MySelect` component throughout your application like so:

```svelte
<script lang="ts">
	import MySelect from "$lib/components/MySelect.svelte";

	const items = [
		{ value: "apple", label: "Apple" },
		{ value: "banana", label: "Banana" },
		{ value: "cherry", label: "Cherry" },
	];

	let fruit = $state("apple");
</script>

<MySelect {items} bind:value={fruit} />
```

## Managing Value State

The `value` represents the currently selected item/option within the select menu. Bits UI provides flexible options for controlling and synchronizing the Select's value state.

### Two-Way Binding

Use the `bind:value` directive for effortless two-way synchronization between your local state and the Select's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { Select } from "bits-ui";
	let myValue = $state<string>("");
</script>

<button onclick={() => (myValue = "apple")}> Apple </button>

<Select.Root bind:value={myValue}>
	<!-- ... -->
</Select.Root>
```

This setup enables toggling the Select via the custom button and ensures the local `myValue` state updates when the Select changes through any internal means (e.g., clicking on an item's button).

### Change Handler

You can also use the `onValueChange` prop to update local state when the Select's `value` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the Select changes.

```svelte {3,7-11}
<script lang="ts">
	import { Select } from "bits-ui";
	let myValue = $state<string>("");
</script>

<Select.Root
	value={myValue}
	onValueChange={(value) => {
		myValue = value;
		// additional logic here.
	}}
>
	<!-- ... -->
</Select.Root>
```

## Server-side Rendering

To accomplish some of the nice features of the `Select` component, such as typeahead while the select content is closed and the trigger is focused, we leverage portals to send items into the `Select.Value` component.

Portals only work client-side, so if you are using SvelteKit with SSR, you'll need to handle the case where a default value is provided, otherwise, there will be a flicker of the placeholder value before the default value is portalled into the `Select.Value` component. We're demonstrating this in the featured demo at the top of this page, but here's an example of how you might handle this:

```svelte title="+page.svelte"
<script lang="ts">
	// default value is provided via page data from a load function
	let { data } = $props();

	let options = [
		{ value: "apple", label: "Apple" },
		{ value: "banana", label: "Banana" },
		{ value: "cherry", label: "Cherry" },
	];

	let value = $state(data.fruit);

	const selectedLabel = $derived(options.find((option) => option.value === data.fruit)?.label);
</script>

<Select.Root value={data.fruit} onValueChange={(v) => (data.fruit = v)}>
	<Select.Trigger>
		{#if selectedLabel}
			<Select.Value>
				{selectedLabel}
			</Select.Value>
		{:else}
			<Select.Value placeholder="Select a fruit" />
		{/if}
	</Select.Trigger>
	<!-- ... other select components -->
</Select.Root>
```

## Multiple Select

The `Select` component does not support multiple selections. If you're looking for a multi-select component, check out the [Listbox](/docs/components/listbox) component.

<APISection {schemas} />
