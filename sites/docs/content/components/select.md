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
			<Select.ScrollUpButton />
			<Select.Viewport>
				{#each items as item}
					<Select.Item value={item.value} textValue={item.label}>
						<Select.ItemText>
							{item.label}
						</Select.ItemText>
					</Select.Item>
				{/each}
			</Select.Viewport>
			<Select.ScrollDownButton />
		</Select.Content>
	</Select.Portal>
</Select.Root>
```

## Server-side Rendering

To accomplish some of the nice features of the `Select` component, such as typeahead while the select content is closed and the trigger is focused, we leverage portals to send items into the `Select.Value` component.

Portals only work client-side, so if you are using SvelteKit with SSR, you'll need to handle the case where a default value is provided, otherwise, there will be a flicker of the placeholder value before the default value is portalled into the `Select.Value` component. We're demonstrating this in the featured demo at the top of this page, but here's an example of how you might handle this:

```svelte title="+page.svelte"
<script lang="ts">
	// default value is provided via page data
	let { data } = $props();

	let options = [
		{ value: "apple", label: "Apple" },
		{ value: "banana", label: "Banana" },
		{ value: "cherry", label: "Cherry" },
	];

	let value = $state(data.selectedValue);

	const selectedLabel = $derived(
		options.find((option) => option.value === data.selectedValue)?.label
	);
</script>

<Select.Root value={data.selectedValue} onValueChange={(v) => (data.selectedValue = v)}>
	<Select.Trigger>
		{#if selectedLabel}
			<Select.Value>
				{selectedLabel}
			</Select.Value>
		{:else}
			<Select.Value placeholder="Select a fruit" />
		{/if}
	</Select.Trigger>
</Select.Root>
```

## Multiple Select

The `Select` component does not support multiple selections. If you're looking for a multi-select component, checkout the [Listbox](/docs/components/listbox) component.

<APISection {schemas} />
