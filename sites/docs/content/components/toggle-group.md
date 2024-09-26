---
title: Toggle Group
description: Groups multiple toggle controls, allowing users to enable one or multiple options.
---

<script>
	import { APISection, ComponentPreviewV2, ToggleGroupDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="toggle-group-demo" comp="ToggleGroup">

{#snippet preview()}
<ToggleGroupDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { ToggleGroup } from "bits-ui";
</script>

<ToggleGroup.Root>
	<ToggleGroup.Item value="bold">bold</ToggleGroup.Item>
	<ToggleGroup.Item value="italic">italic</ToggleGroup.Item>
</ToggleGroup.Root>
```

## Single & Multiple

The `ToggleGroup` component supports two `type` props, `'single'` and `'multiple'`. When the `type` is set to `'single'`, the `ToggleGroup` will only allow a single item to be selected at a time, and the type of the `value` prop will be a string.

When the `type` is set to `'multiple'`, the `ToggleGroup` will allow multiple items to be selected at a time, and the type of the `value` prop will be an array of strings.

## Value State

The `value` prop is used to determine which item(s) are currently "on". Bits UI provides flexible options for controlling and synchronizing the value.

### Two-Way Binding

Use the `bind:value` directive for effortless two-way synchronization between your local state and the Toggle Group's internal state.

```svelte /bind:value={myValue}/
<script lang="ts">
	import { ToggleGroup } from "bits-ui";
	let myValue = $state("");
</script>

<button onclick={() => (myValue = "apple")}> Apple </button>

<ToggleGroup.Root bind:value={myValue}>
	<!-- ... -->
</ToggleGroup.Root>
```

This setup enables toggling the Toggle Group's value to "apple" via the custom button and ensures the local `myValue` state updates when the state changes through any internal means (e.g., clicking on an item).

### Change Handler

You can also use the `onValueChange` prop to update local state when the Toggle Group's `value` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the Toggle Group changes.

```svelte /onValueChange/
<script lang="ts">
	import { ToggleGroup } from "bits-ui";
	let myValue = $state("");
</script>

<ToggleGroup.Root
	value={myValue}
	onValueChange={(value) => {
		myValue = value;
		// additional logic here.
	}}
>
	<!-- ... -->
</ToggleGroup.Root>
```

### Controlled

Sometimes, you may want complete control over the component's `value` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you will rarely need this, it's possible to do so by setting the `controlledValue` prop to `true`.

You will then be responsible for updating a local value state variable that is passed as the `value` prop to the `ToggleGroup.Root` component.

```svelte
<script lang="ts">
	import { ToggleGroup } from "bits-ui";

	let myValue = $state("");
</script>

<ToggleGroup.Root controlledValue value={myValue} onValueChange={(v) => (myValue = v)}>
	<!-- ... -->
</ToggleGroup.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled states.

<APISection {schemas} />
