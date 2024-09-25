---
title: Tabs
description: Organizes content into distinct sections, allowing users to switch between them.
---

<script>
	import { APISection, ComponentPreviewV2, TabsDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="tabs-demo" comp="Tabs">

{#snippet preview()}
<TabsDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Tabs } from "bits-ui";
</script>

<Tabs.Root>
	<Tabs.List>
		<Tabs.Trigger />
	</Tabs.List>
	<Tabs.Content />
</Tabs.Root>
```

## Value State

The `value` represents the currently selected tab within the `Tabs` component.

Bits UI provides flexible options for controlling and synchronizing the `Tabs` component's value state.

### Two-Way Binding

Use the `bind:value` directive for effortless two-way synchronization between your local state and the `Tabs` component's value.

```svelte {3,6,8}
<script lang="ts">
	import { Tabs } from "bits-ui";
	let value = $state("");
</script>

<button onclick={() => (value = "A")}> Set to A </button>
<Tabs.Root bind:value>
	<!-- ... -->
</Tabs.Root>
```

This setup enables changing the `Tabs` component's value via the custom button and ensures the local `value` state is synchronized with the `Tabs` component's value.

### Change Handler

You can also use the `onValueChange` prop to update local state when the `Tabs` component's value changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the `Tabs` component's value changes.

```svelte {3,7-11}
<script lang="ts">
	import { Tabs } from "bits-ui";
	let value = $state("");
</script>

<Tabs.Root
	bind:value
	onValueChange={(v) => {
		value = v;
	}}
>
	<!-- ... -->
</Tabs.Root>
```

### Controlled

Sometimes, you may want complete control over the component's `value` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you will rarely need this, it's possible to do so by setting the `controlledValue` prop to `true`.

You will then be responsible for updating a local value state variable that is passed as the `value` prop to the `Tabs.Root` component.

```svelte
<script lang="ts">
	import { Tabs } from "bits-ui";

	let myValue = $state();
</script>

<Tabs.Root controlledValue value={myValue} onValueChange={(v) => (myValue = v)}>
	<!-- ... -->
</Tabs.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled states.

## Orientation

The `orientation` prop is used to determine the orientation of the `Tabs` component, which influences how keyboard navigation will work.

When the `orientation` is set to `'horizontal'`, the `ArrowLeft` and `ArrowRight` keys will move the focus to the previous and next tab, respectively. When the `orientation` is set to `'vertical'`, the `ArrowUp` and `ArrowDown` keys will move the focus to the previous and next tab, respectively.

```svelte
<Tabs.Root orientation="horizontal">
	<!-- ... -->
</Tabs.Root>

<Tabs.Root orientation="vertical">
	<!-- ... -->
</Tabs.Root>
```

<APISection {schemas} />
