---
title: Command
description: A command menu component that can be used to search, filter, and select items.
---

<script>
	import { APISection, ComponentPreviewV2, CommandDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="command-demo" comp="Command">

{#snippet preview()}
<CommandDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Combobox } from "bits-ui";
</script>

<Command.Root>
	<Combobox.Input />
	<Command.Empty />
	<Command.List>
		<Command.Viewport>
			<Command.Loading />
			<Command.Group>
				<Command.GroupHeading />
				<Command.GroupItems>
					<Command.Item />
					<Command.Item />
					<Command.Item />
				</Command.GroupItems>
			</Command.Group>
			<Command.Separator />
			<Command.Item />
		</Command.Viewport>
	</Command.List>
</Command.Root>
```

## Reusable Components

It's recommended to use the `Combobox` primitives to build your own custom combobox component that can be reused throughout your application.

```svelte title="CustomCombobox.svelte"
<script lang="ts">
	import { Combobox, type WithoutChildrenOrChild, mergeProps } from "bits-ui";

	type Item = { value: string; label: string; };

	type Props = Combobox.RootProps & {
		items: Item[];
		inputProps?: WithoutChildrenOrChild<Combobox.InputProps>;
		contentProps?: WithoutChildrenOrChild<Combobox.ContentProps>;
	}

	let {
		items,
		value = $bindable(),
		open = $bindable(false),
		inputProps,
		contentProps,
		...restProps
	}: Props = $props();

	let searchValue = $state("");

	const filteredItems = $derived.by(() => {
		if (searchValue === "") return items;
		return items.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase()));
	})

	function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		searchValue = e.currentTarget.value;
	}

	function handleOpenChange(newOpen: boolean) {
		if (!newOpen) searchValue = "";
	}

	const mergedRootProps = $derived(mergeProps(restProps, { onOpenChange: handleOpenChange }))
	const mergedInputProps = $derived(mergeProps(inputProps, { oninput: handleInput } ))
</script>

<Combobox.Root bind:value bind:open {...mergedRootProps}>
	<Combobox.Input {....mergedInputProps} />
	<Combobox.Trigger>Open</Combobox.Trigger>
	<Combobox.Portal>
		<Combobox.Content {...contentProps}>
			{#each filteredItems as item, i (i + item.value)}
				<Combobox.Item value={item.value} label={item.label}>
					{#snippet children({ selected })}
						{item.label}
						{selected ? "✅" : ""}
					{/snippet}
				</Combobox.Item>
			{:else}
				<span>
					No results found
				</span>
			{/each}
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
```

```svelte title="+page.svelte"
<script lang="ts">
	import { CustomCombobox } from "$lib/components";

	const items = [
		{ value: "mango", label: "Mango" },
		{ value: "watermelon", label: "Watermelon" },
		{ value: "apple", label: "Apple" },
		// ...
	];
</script>

<CustomCombobox {items} />
```

<APISection {schemas} />
