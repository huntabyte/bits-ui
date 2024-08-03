---
title: Menubar
description: Organizes and presents a collection of menu options or actions within a horizontal bar.
---

<script>
	import { APISection, ComponentPreviewV2, MenubarDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="menubar-demo" comp="Menubar">

{#snippet preview()}
<MenubarDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Menubar } from "bits-ui";
</script>

<Menubar.Root>
	<Menubar.Menu>
		<Menubar.Trigger />
		<Menubar.Content>
			<Menubar.Group>
				<Menubar.GroupLabel />
				<Menubar.Item />
			</Menubar.Group>

			<Menubar.Group>
				<Menubar.Item />
			</Menubar.Group>

			<Menubar.CheckboxItem>
				<Menubar.CheckboxIndicator />
			</Menubar.CheckboxItem>

			<Menubar.RadioGroup>
				<Menubar.RadioItem>
					<Menubar.RadioIndicator />
				<Menubar.RadioItem>
			</Menubar.RadioGroup>

			<Menubar.Sub>
				<Menubar.SubTrigger />
				<Menubar.SubContent />
			</Menubar.Sub>

			<Menubar.Separator />
			<Menubar.Arrow />
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>
```

## Reusable Components

If you're planning to use Menubar in multiple places, you can create a reusable component that wraps the Menubar component.

This example shows you how to create a Menubar component that accepts a few custom props that make it more capable.

```svelte title="CustomMenubar.svelte"
<script lang="ts">
	import { Menubar, type WithoutChild } from "bits-ui";
	type Props = Menubar.Props & {
		triggerText: string;
		items: { label: string; value: string }[];
		contentProps?: WithoutChild<Menubar.Content.Props>;
		// other component props if needed
	};
	let {
		open = $bindable(false),
		children,
		triggerText,
		items,
		contentProps,
		...restProps
	}: Props = $props();
</script>

<Menubar.Root bind:open {...restProps}>
	<Menubar.Trigger>
		{triggerText}
	</Menubar.Trigger>
	<Menubar.Content {...contentProps}>
		<Menubar.Group aria-label={triggerText}>
			{#each items as item}
				<Menubar.Item textValue={item.label}>
					{item.label}
				</Menubar.Item>
			{/each}
		</Menubar.Group>
	</Menubar.Content>
</Menubar.Root>
```

You can then use the `CustomMenubar` component like this:

```svelte
<script lang="ts">
	import CustomMenubar from "./CustomMenubar.svelte";

	const sales = [
		{ label: "Michael Scott", value: "michael" },
		{ label: "Dwight Schrute", value: "dwight" },
		{ label: "Jim Halpert", value: "jim" },
		{ label: "Stanley Hudson", value: "stanley" },
		{ label: "Phyllis Vance", value: "phyllis" },
		{ label: "Pam Beesly", value: "pam" },
		{ label: "Andy Bernard", value: "andy" },
	];

	const hr = [
		{ label: "Toby Flenderson", value: "toby" },
		{ label: "Holly Flax", value: "holly" },
		{ label: "Jan Levinson", value: "jan" },
	];

	const accounting = [
		{ label: "Angela Martin", value: "angela" },
		{ label: "Kevin Malone", value: "kevin" },
		{ label: "Oscar Martinez", value: "oscar" },
	];

	const menuItems = [
		{ title: "Sales", items: sales },
		{ title: "HR", items: hr },
		{ title: "Accounting", items: accounting },
	];
</script>

{#each menuItems as { title, items }}
	<CustomMenubar triggerText={title} {items} />
{/each}
```

## Managing Open State

Bits UI provides flexible options for controlling and synchronizing the menu's open state.

### Two-Way Binding

Use the `bind:open` directive for effortless two-way synchronization between your local state and the menu's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { Menubar } from "bits-ui";
	let isOpen = $state(false);
</script>

<button on:click={() => (isOpen = true)}>Open Menubar Menu</button>
<Menubar.Root bind:open={isOpen}>
	<!-- Menubar Menu content -->
</Menubar.Root>
```

This setup enables opening the menu via the custom button and ensures the local `isOpen` state updates when the menu closes through any means (e.g., escape key).

### Change Handler

You can also use the `onOpenChange` prop to update local state when the menu's `open` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the menu opens or closes.

```svelte {3,7-11}
<script lang="ts">
	import { Menubar } from "bits-ui";
	let isOpen = $state(false);
</script>

<Menubar.Root
	open={isOpen}
	onOpenChange={(open) => {
		isOpen = open;
		// additional logic here.
	}}
>
	<!-- ... -->
</Menubar.Root>
```

## Nested Menus

You can create nested menus using the `Menubar.Sub` component to create complex menu structures.

```svelte /Menubar.Sub/
<script lang="ts">
	import { Menubar } from "bits-ui";
</script>

<Menubar.Root>
	<Menubar.Trigger>Open Menu</Menubar.Trigger>
	<Menubar.Content>
		<Menubar.Item>Item 1</Menubar.Item>
		<Menubar.Item>Item 2</Menubar.Item>
		<Menubar.Sub>
			<Menubar.SubTrigger>Open Sub Menu</Menubar.SubTrigger>
			<Menubar.SubContent>
				<Menubar.Item>Sub Item 1</Menubar.Item>
				<Menubar.Item>Sub Item 2</Menubar.Item>
			</Menubar.SubContent>
		</Menubar.Sub>
	</Menubar.Content>
</Menubar.Root>
```

<!-- <MenubarDemoNested /> -->

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `Menubar.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fade/ /transition:fly/
<script lang="ts">
	import { Menubar } from "bits-ui";
	import { fly } from "svelte/transition";
</script>

<Menubar.Root>
	<Menubar.Trigger>Open Menu</Menubar.Trigger>
	<Menubar.Content forceMount>
		{#snippet child({ props, open })}
			{#if open}
				<div {...props} transition:fly>
					<Menubar.Item>Item 1</Menubar.Item>
					<Menubar.Item>Item 2</Menubar.Item>
				</div>
			{/if}
		{/snippet}
	</Menubar.Content>
</Menubar.Root>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<APISection {schemas} />
