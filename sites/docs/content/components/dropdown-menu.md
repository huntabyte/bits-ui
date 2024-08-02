---
title: Dropdown Menu
description: Displays a menu of items that users can select from when triggered.
---

<script>
	import { APISection, ComponentPreviewV2, DropdownMenuDemo } from '$lib/components'
	export let schemas;
</script>

<ComponentPreviewV2 name="dropdown-menu-demo" comp="DropdownMenu">

{#snippet preview()}
<DropdownMenuDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger />
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label />
			<DropdownMenu.Separator />
			<DropdownMenu.Item />
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
```

## Reusable Components

If you're planning to use Dropdown Menu in multiple places, you can create a reusable component that wraps the Dropdown Menu component.

This example shows you how to create a Dropdown Menu component that accepts a few custom props that make it more capable.

```svelte title="CustomDropdownMenu.svelte"
<script lang="ts">
	import type { Snippet } from "svelte";
	import { DropdownMenu, type WithoutChild } from "bits-ui";

	type Props = DropdownMenu.Props & {
		buttonText: string;
		items: { label: string; value: string }[];
		contentProps?: WithoutChild<DropdownMenu.Content.Props>;
		// other component props if needed
	};

	let {
		open = $bindable(false),
		children,
		buttonText,
		items,
		contentProps,
		...restProps
	}: Props = $props();
</script>

<DropdownMenu.Root bind:open {...restProps}>
	<DropdownMenu.Trigger>
		{buttonText}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content {...contentProps}>
		{#each items as item}
			<DropdownMenu.Item value={item.value}>
				{item.label}
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
```

You can then use the `CustomDropdownMenu` component like this:

```svelte
<script lang="ts">
	import CustomDropdownMenu from "./CustomDropdownMenu.svelte";
</script>

<CustomDropdownMenu
	buttonText="Select a manager"
	items={[
		{ label: "Michael Scott", value: "michael" },
		{ label: "Dwight Schrute", value: "dwight" },
		{ label: "Jim Halpert", value: "jim" },
	]}
/>
```

## Managing Open State

Bits UI provides flexible options for controlling and synchronizing the menu's open state.

### Two-Way Binding

Use the `bind:open` directive for effortless two-way synchronization between your local state and the menu's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	let isOpen = $state(false);
</script>

<button on:click={() => (isOpen = true)}>Open Dropdown Menu</button>

<DropdownMenu.Root bind:open={isOpen}>
	<!-- Dropdown Menu content -->
</DropdownMenu.Root>
```

<APISection {schemas} />
