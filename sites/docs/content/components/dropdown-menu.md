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
		<DropdownMenu.Label />
		<DropdownMenu.Item />

		<DropdownMenu.Group>
			<DropdownMenu.Item />
		</DropdownMenu.Group>

		<DropdownMenu.CheckboxItem>
			<DropdownMenu.CheckboxIndicator />
		</DropdownMenu.CheckboxItem>

		<DropdownMenu.RadioGroup>
			<DropdownMenu.RadioItem>
				<DropdownMenu.RadioIndicator />
			</DropdownMenu.RadioItem>
		</DropdownMenu.RadioGroup>

		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger />
			<DropdownMenu.SubContent />
		</DropdownMenu.Sub>

		<DropdownMenu.Separator />
		<DropdownMenu.Arrow />
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
		<DropdownMenu.Group>
			{#each items as item}
				<DropdownMenu.Item textValue={item.value}>
					{item.label}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
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

This setup enables opening the menu via the custom button and ensures the local `isOpen` state updates when the menu closes through any means (e.g., escape key).

### Change Handler

You can also use the `onOpenChange` prop to update local state when the menu's `open` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the menu opens or closes.

```svelte {3,7-11}
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	let isOpen = $state(false);
</script>

<DropdownMenu.Root
	open={isOpen}
	onOpenChange={(open) => {
		isOpen = open;
		// additional logic here.
	}}
>
	<!-- ... -->
</DropdownMenu.Root>
```

## Nested Menus

You can nest menus within menus to create complex menu structures.

```svelte
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Item>Item 1</DropdownMenu.Item>
		<DropdownMenu.Item>Item 2</DropdownMenu.Item>
		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger>Open Sub Menu</DropdownMenu.SubTrigger>
			<DropdownMenu.SubContent>
				<DropdownMenu.Item>Sub Item 1</DropdownMenu.Item>
				<DropdownMenu.Item>Sub Item 2</DropdownMenu.Item>
			</DropdownMenu.SubContent>
		</DropdownMenu.Sub>
	</DropdownMenu.Content>
</DropdownMenu.Root>
```

<!-- <DropdownMenuDemoNested /> -->

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `DropdownMenu.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fade/ /transition:fly/
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	import { fly } from "svelte/transition";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
	<DropdownMenu.Content forceMount>
		{#snippet child({ props, open })}
			{#if open}
				<div {...props} transition:fly>
					<DropdownMenu.Item>Item 1</DropdownMenu.Item>
					<DropdownMenu.Item>Item 2</DropdownMenu.Item>
				</div>
			{/if}
		{/snippet}
	</DropdownMenu.Content>
</DropdownMenu.Root>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<APISection {schemas} />
