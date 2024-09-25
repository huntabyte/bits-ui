---
title: Toggle
description: A control element that switches between two states, providing a binary choice.
---

<script>
	import { APISection, ComponentPreviewV2, ToggleDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="toggle-demo" comp="Toggle">

{#snippet preview()}
<ToggleDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Toggle } from "bits-ui";
</script>

<Toggle.Root />
```

## Pressed State

Bits UI provides flexible options for controlling and synchronizing the Toggle's pressed state.

### Two-Way Binding

Use the `bind:pressd` directive for effortless two-way synchronization between your local state and the Toggle's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { Toggle } from "bits-ui";
	let isPressed = $state(false);
</script>

<button onclick={() => (isPressed = true)}>Toggle Toggle</button>

<Toggle.Root bind:pressed={isPressed}>
	<!-- ... -->
</Toggle.Root>
```

This setup enables toggling the Toggle via the custom button and ensures the local `isPressed` state updates when the Toggle's internal state updates through any means (e.g., pressing the Toggle).

### Change Handler

You can also use the `onPressedChange` prop to update local state when the Toggle's `pressed` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the Toggle state changes.

```svelte {3,7-11}
<script lang="ts">
	import { Toggle } from "bits-ui";
	let isPressed = $state(false);
</script>

<Toggle.Root
	pressed={isPressed}
	onPressedChange={(pressed) => {
		isPressed = pressed;
		// additional logic here.
	}}
>
	<!-- ... -->
</Toggle.Root>
```

### Controlled

Sometimes, you may want complete control over the Toggle's `pressed` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you'll rarely need this, it's possible to do so by setting the `controlledPressed` prop to `true`.

You will then be responsible for updating a local state variable that is passed as the `pressed` prop to the `Toggle.Root` component.

```svelte
<script lang="ts">
	import { Toggle } from "bits-ui";

	let myPressed = $state<string>(false);
</script>

<Toggle.Root controlledPressed pressed={myPressed} onPressedChange={(p) => (myPressed = p)}>
	<!-- ... -->
</Toggle.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled states.

<APISection {schemas} />
