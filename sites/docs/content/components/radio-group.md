---
title: Radio Group
description: Allows users to select a single option from a list of mutually exclusive choices.
---

<script>
	import { APISection, ComponentPreviewV2, RadioGroupDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="radio-group-demo" comp="RadioGroup">

{#snippet preview()}
<RadioGroupDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { RadioGroup } from "bits-ui";
</script>

<RadioGroup.Root>
	<RadioGroup.Item>
		{#snippet children({ checked })}
			{#if checked}
				✅
			{/if}
		{/snippet}
	</RadioGroup.Item>
</RadioGroup.Root>
```

## Reusable Components

It's recommended to use the `RadioGroup` primitives to create your own custom components that can be used throughout your application.

In the example below, we're creating a custom `MyRadioGroup` component that takes in an array of items and renders a radio group with those items along with a [`Label`](/docs/components/label) component for each item.

```svelte title="MyRadioGroup.svelte"
<script lang="ts">
	import { RadioGroup, Label, type WithoutChildrenOrChild, useId } from "bits-ui";

	type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	type Props = WithoutChildrenOrChild<RadioGroup.RootProps> & {
		items: Item[];
	};

	let { value = $bindable(""), ref = $bindable(null), items, ...restProps }: Props = $props();
</script>

<RadioGroup.Root bind:value bind:ref {...restProps}>
	{#each items as item}
		{@const id = useId()}
		<div>
			<RadioGroup.Item {id} value={item.value} disabled={item.disabled}>
				{#snippet children({ checked })}
					{#if checked}
						✅
					{/if}
				{/snippet}
			</RadioGroup.Item>
			<Label.Root for={id}>{item.label}</Label.Root>
		</div>
	{/each}
</RadioGroup.Root>
```

You can then use the `MyRadioGroup` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
	import MyRadioGroup from "$lib/components/MyRadioGroup.svelte";

	const myItems = [
		{ value: "apple", label: "Apple" },
		{ value: "banana", label: "Banana" },
		{ value: "coconut", label: "Coconut", disabled: true },
	];
</script>

<MyRadioGroup items={myItems} name="favoriteFruit" />
```

## Managing Value State

The `value` prop is used to determine which radio group item(s) are currently checked. Bits UI provides flexible options for controlling and synchronizing the Radio Group's value.

### Two-Way Binding

Use the `bind:value` directive for effortless two-way synchronization between your local state and the Radio Group's internal state.

```svelte /bind:value={myValue}/
<script lang="ts">
	import { RadioGroup } from "bits-ui";
	let myValue = $state<string>("");
</script>

<button onclick={() => (myValue = "apple")}> Apple </button>

<RadioGroup.Root bind:value={myValue}>
	<!-- ... -->
</RadioGroup.Root>
```

This setup enables toggling the Radio Group's value to "apple" via the custom button and ensures the local `myValue` state updates when the Radio Group changes through any internal means (e.g., clicking on an item's button).

### Change Handler

You can also use the `onValueChange` prop to update local state when the Radio Group's `value` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the Radio Group changes.

```svelte /onValueChange/
<script lang="ts">
	import { RadioGroup } from "bits-ui";
	let myValue = $state<string>("");
</script>

<RadioGroup.Root
	value={myValue}
	onValueChange={(value) => {
		myValue = value;
		// additional logic here.
	}}
>
	<!-- ... -->
</RadioGroup.Root>
```

## With HTML Forms

If you set the `name` prop on the `RadioGroup.Root` component, a hidden input element will be rendered to submit the value of the radio group to a form.

```svelte /name="favoriteFruit"/
<RadioGroup.Root name="favoriteFruit">
	<!-- ... -->
</RadioGroup.Root>
```

## Disabling Items

You can disable a radio group item by setting the `disabled` prop to `true`.

```svelte /disabled/
<RadioGroup.Item value="apple" disabled>Apple</RadioGroup.Item>
```

<APISection {schemas} />
