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
			<DropdownMenu.GroupHeading />
			<DropdownMenu.Item />
		</DropdownMenu.Group>

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

```svelte title="MyDropdownMenu.svelte"
<script lang="ts">
	import type { Snippet } from "svelte";
	import { DropdownMenu, type WithoutChild } from "bits-ui";

	type Props = DropdownMenu.Props & {
		buttonText: string;
		items: string[];
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
	<DropdownMenu.Portal>
		<DropdownMenu.Content {...contentProps}>
			<DropdownMenu.Group aria-label={buttonText}>
				{#each items as item}
					<DropdownMenu.Item textValue={item}>
						{item}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
```

You can then use the `MyDropdownMenu` component like this:

```svelte
<script lang="ts">
	import MyDropdownMenu from "./MyDropdownMenu.svelte";
</script>

<MyDropdownMenu
	buttonText="Select a manager"
	items={["Michael Scott", "Dwight Schrute", "Jim Halpert"]}
/>
```

## Open State

Bits UI provides flexible options for controlling and synchronizing the menu's open state.

### Two-Way Binding

Use the `bind:open` directive for effortless two-way synchronization between your local state and the menu's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open Dropdown Menu</button>

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

### Controlled

Sometimes, you may want complete control over the component's `open` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you'll rarely need this, it's possible to do so by setting the `controlledOpen` prop to `true`.

You will then be responsible for updating a local state variable that is passed as the `open` prop to the `DropdownMenu.Root` or `DropdownMenu.Sub` component(s).

```svelte
<script lang="ts">
	import { DropdownMenu } from "bits-ui";

	let myOpen = $state<string>(false);
</script>

<DropdownMenu.Root controlledOpen open={myOpen} onOpenChange={(o) => (myOpen = o)}>
	<!-- ... -->
</DropdownMenu.Root>
```

## Groups

To group related menu items, you can use the `DropdownMenu.Group` component along with either a `DropdownMenu.GroupHeading` or an `aria-label` attribute on the `DropdownMenu.Group` component.

```svelte
<DropdownMenu.Group>
	<DropdownMenu.GroupHeading>File</DropdownMenu.GroupHeading>
	<DropdownMenu.Item>New</DropdownMenu.Item>
	<DropdownMenu.Item>Open</DropdownMenu.Item>
	<DropdownMenu.Item>Save</DropdownMenu.Item>
	<DropdownMenu.Item>Save As</DropdownMenu.Item>
</DropdownMenu.Group>
<!-- or -->
<DropdownMenu.Group aria-label="file">
	<DropdownMenu.Item>New</DropdownMenu.Item>
	<DropdownMenu.Item>Open</DropdownMenu.Item>
	<DropdownMenu.Item>Save</DropdownMenu.Item>
	<DropdownMenu.Item>Save As</DropdownMenu.Item>
</DropdownMenu.Group>
```

### Group Heading

The `DropdownMenu.GroupHeading` component must be a child of either a `DropdownMenu.Group` or `DropdownMenu.RadioGroup` component. If used on its own, an error will be thrown during development.

```svelte
<DropdownMenu.Group>
	<DropdownMenu.GroupHeading>File</DropdownMenu.GroupHeading>
	<!-- ... items here -->
</DropdownMenu.Group>

<!-- or -->

<DropdownMenu.RadioGroup>
	<DropdownMenu.GroupHeading>Favorite color</DropdownMenu.GroupHeading>
	<!-- ... radio items here -->
</DropdownMenu.RadioGroup>
```

## Checkbox Items

You can use the `DropdownMenu.CheckboxItem` component to create a `menuitemcheckbox` element to add checkbox functionality to menu items.

```svelte
<script lang="ts">
	import { DropdownMenu } from "bits-ui";

	let notifications = $state(true);
</script>

<DropdownMenu.CheckboxItem bind:checked={notifications}>
	{#snippet children({ checked })}
		{#if checked}
			✅
		{/if}
		Notifications
	{/snippet}
</DropdownMenu.CheckboxItem>
```

The `checked` state does not persist between menu open/close cycles. To persist the state, you must store it in a `$state` variable and pass it to the `checked` prop.

## Radio Groups

You can combine the `DropdownMenu.RadioGroup` and `DropdownMenu.RadioItem` components to create a radio group within a menu.

```svelte
<script lang="ts">
	import { DropdownMenu } from "bits-ui";

	const values = ["one", "two", "three"];
	let value = $state("one");
</script>

<DropdownMenu.RadioGroup bind:value>
	<DropdownMenu.GroupHeading>Favorite number</DropdownMenu.GroupHeading>
	{#each values as value}
		<DropdownMenu.RadioItem {value}>
			{#snippet children({ checked })}
				{#if checked}
					✅
				{/if}
				{value}
			{/snippet}
		</DropdownMenu.RadioItem>
	{/each}
</DropdownMenu.RadioGroup>
```

The `value` state does not persist between menu open/close cycles. To persist the state, you must store it in a `$state` variable and pass it to the `value` prop.

## Nested Menus

You can create nested menus using the `DropdownMenu.Sub` component to create complex menu structures.

```svelte /DropdownMenu.Sub/
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
</script>

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
```

<!-- <DropdownMenuDemoNested /> -->

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `DropdownMenu.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fly/
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	import { fly } from "svelte/transition";
</script>

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
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<APISection {schemas} />
