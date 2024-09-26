---
title: Combobox
description: Enables users to pick from a list of options displayed in a dropdown.
---

<script>
	import { APISection, ComponentPreviewV2, ComboboxDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="combobox-demo" comp="Combobox">

{#snippet preview()}
<ComboboxDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Combobox } from "bits-ui";
</script>

<Combobox.Root>
	<Combobox.Input />
	<Combobox.Trigger />
	<Combobox.Portal>
		<Combobox.Content>
			<Combobox.Group>
				<Combobox.GroupHeading />
				<Combobox.Item />
			</Combobox.Group>
			<Combobox.Item />
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
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

## Value State

The `value` represents the currently selected item/option within the Combobox. Bits UI provides flexible options for controlling and synchronizing the Combobox's `value` state.

### Two-Way Binding

Use the `bind:value` directive for effortless two-way synchronization between your local state and the Combobox's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { Combobox } from "bits-ui";
	let myValue = $state<string>("");
</script>

<button onclick={() => (myValue = "apple")}> Apple </button>

<Combobox.Root bind:value={myValue}>
	<!-- ... -->
</Combobox.Root>
```

This setup enables toggling the value via the custom button and ensures the local `myValue` state updates when the Combobox's value changes through any internal means (e.g., clicking on an item).

### Change Handler

You can also use the `onValueChange` prop to update local state when the Combobox's `value` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the value changes.

```svelte {3,7-11}
<script lang="ts">
	import { Combobox } from "bits-ui";
	let myValue = $state<string>("");
</script>

<Combobox.Root
	value={myValue}
	onValueChange={(value) => {
		myValue = value;
		// additional logic here.
	}}
>
	<!-- ... -->
</Combobox.Root>
```

### Controlled

Sometimes, you may want complete control over the Combobox's `value` state, meaning you will be "kept in the loop" and be required to apply the value state change yourself. While you will rarely need this, it's possible to do so by setting the `controlledValue` prop to `true`.

You will then be responsible for updating a local value state variable that is passed as the `value` prop to the `Combobox.Root` component.

```svelte
<script lang="ts">
	import { Combobox } from "bits-ui";

	let myValue = $state("");
</script>

<Combobox.Root controlledValue value={myValue} onValueChange={(v) => (myValue = v)}>
	<!-- ... -->
</Combobox.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled values.

## Open State

The `open` state represents whether or not the Combobox content is open. Bits UI provides flexible options for controlling and synchronizing the Combobox's open state.

### Two-Way Binding

Use the `bind:open` directive for effortless two-way synchronization between your local state and the Combobox's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { Combobox } from "bits-ui";
	let isOpen = $state(false);
</script>

<button onclick={() => (open = true)}> Open Combobox </button>

<Combobox.Root bind:open={isOpen}>
	<!-- ... -->
</Combobox.Root>
```

This setup enables toggling the Combobox via the custom button and ensures the local `isOpen` state updates when the Combobox's `open` state changes through any internal means e.g. clicking on the trigger or outside the content.

### Change Handler

You can also use the `onOpenChange` prop to update local state when the Combobox's `open` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the Combobox's open state changes.

```svelte {3,7-11}
<script lang="ts">
	import { Combobox } from "bits-ui";
	let isOpen = $state(false);
</script>

<Combobox.Root
	open={isOpen}
	onOpenChange={(open) => {
		isOpen = open;
		// additional logic here.
	}}
>
	<!-- ... -->
</Combobox.Root>
```

### Controlled

Sometimes, you may want complete control over the Combobox's `open` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you will rarely need this, it's possible to do so by setting the `controlledOpen` prop to `true`.

You will then be responsible for updating a local value state variable that is passed as the `open` prop to the `Combobox.Root` component.

```svelte
<script lang="ts">
	import { Combobox } from "bits-ui";

	let myOpen = $state(false);
</script>

<Combobox.Root controlledValue open={myOpen} onOpenChange={(o) => (myOpen = o)}>
	<!-- ... -->
</Combobox.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled values.

## Opt-out of Floating UI

When you use the `Combobox.Content` component, Bits UI uses [Floating UI](https://floating-ui.com/) to position the content relative to the trigger, similar to other popover-like components.

You can opt-out of this behavior by instead using the `Combobox.ContentStatic` component.

```svelte {4,14}
<Combobox.Root>
	<Combobox.Trigger />
	<Combobox.Input />
	<Combobox.Portal>
		<Combobox.ContentStatic>
			<Combobox.ScrollUpButton />
			<Combobox.Viewport>
				<Combobox.Item />
				<Combobox.Group>
					<Combobox.GroupHeading />
					<Combobox.Item />
				</Combobox.Group>
				<Combobox.ScrollDownButton />
			</Combobox.Viewport>
		</Combobox.ContentStatic>
	</Combobox.Portal>
</Combobox.Root>
```

When using this component, you'll need to handle the positioning of the content yourself. Keep in mind that using `Combobox.Portal` alongside `Combobox.ContentStatic` may result in some unexpected positioning behavior, feel free to not use the portal or work around it.

## Custom Anchor

By default, the `Combobox.Content` is anchored to the `Combobox.Trigger` component, which determines where the content is positioned.

If you wish to instead anchor the content to a different element, you can pass either a selector string or an `HTMLElement` to the `customAnchor` prop of the `Combobox.Content` component.

```svelte
<script lang="ts">
	import { Combobox } from "bits-ui";

	let customAnchor = $state<HTMLElement>(null!);
</script>

<div bind:this={customAnchor}></div>

<Combobox.Root>
	<Combobox.Trigger />
	<Combobox.Input />
	<Combobox.Content {customAnchor}>
		<!-- ... -->
	</Combobox.Content>
</Combobox.Root>
```

## What is the Viewport?

The `Combobox.Viewport` component is used to determine the size of the content in order to determine whether or not the scroll up and down buttons should be rendered.

If you wish to set a minimum/maximum height for the select content, you should apply it to the `Combobox.Viewport` component.

## Scroll Up/Down Buttons

The `Combobox.ScrollUpButton` and `Combobox.ScrollDownButton` components are used to render the scroll up and down buttons when the select content is larger than the viewport.

You must use the `Combobox.Viewport` component when using the scroll buttons.

## Native Scrolling/Overflow

If you don't want to use the scroll buttons and prefer to use the standard scrollbar/overflow behavior, you can omit the `Combobox.Scroll[Up|Down]Button` components and the `Combobox.Viewport` component.

You'll need to set a height on the `Combobox.Content` component and appropriate `overflow` styles to enable scrolling.

## Scroll Lock

By default, when a user opens the Combobox, scrolling outside the content will be disabled. You can override this behavior by setting the `preventScroll` prop to `false`.

```svelte /preventScroll={false}/
<Combobox.Content preventScroll={false}>
	<!-- ... -->
</Combobox.Content>
```

## Highlighted Items

The Combobox component follows the [WAI-ARIA descendant pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox) for highlighting items. This means that the `Combobox.Input` retains focus the entire time, even when navigating with the keyboard, and items are highlighted as the user navigates them.

### Styling Highlighted Items

You can use the `data-highlighted` attribute on the `Combobox.Item` component to style the item differently when it is highlighted.

### onHighlight / onUnhighlight

To trigger side effects when an item is highlighted or unhighlighted, you can use the `onHighlight` and `onUnhighlight` props.

```svelte
<Combobox.Item onHighlight={() => console.log('I am highlighted!')} onUnhighlight={() => console.log('I am unhighlighted!')} />
<!-- ... -->
</Combobox.Item>
```

<APISection {schemas} />
