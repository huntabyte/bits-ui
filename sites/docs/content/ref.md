---
title: Ref
description: Learn about the ref prop.
---

Bits UI components that render an underlying HTML element expose a `ref` prop, which gives you a reference to the underlying element.

For example, the `Accordion.Trigger` component exposes a `ref` prop, which gives you a reference to the `HTMLButtonElement` that is rendered by the component.

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";

	let triggerRef = $state<HTMLButtonElement>();

	function focusTrigger() {
		triggerRef?.focus();
	}
</script>

<button onclick={focusTrigger}>Focus trigger</button>

<Accordion.Trigger bind:ref={triggerRef}>
	<!-- ... -->
</Accordion.Trigger>
```

## With delegation

Bits UI tracks the reference to the underlying element using its `id` attribute. This means that even if you use a custom element/component with [delegation](/docs/delegation), the `ref` prop will still work.

```svelte
<script lang="ts">
	import CustomButton from "./CustomButton.svelte";
	import { Accordion } from "bits-ui";

	let triggerRef = $state<HTMLButtonElement>();

	function focusTrigger() {
		triggerRef?.focus();
	}
</script>

<Accordion.Trigger bind:ref={triggerRef}>
	{#snippet child({ props })}
		<CustomButton {...props} />
	{/snippet}
</Accordion.Trigger>
```

One caveat is that if you wish to use a custom `id` on the element, you must pass it to the component first, so it can be registered and associated with the `ref` prop. The `id` you pass will be passed down via the `props` snippet prop on the `child` snippet.

```svelte
<script lang="ts">
	import CustomButton from "./CustomButton.svelte";
	import { Accordion } from "bits-ui";

	let triggerRef = $state<HTMLButtonElement>();

	function focusTrigger() {
		triggerRef?.focus();
	}

	const myCustomId = "my-custom-id";
</script>

<Accordion.Trigger bind:ref={triggerRef} id={myCustomId}>
	{#snippet child({ props })}
		<CustomButton {...props} /> <!-- custom id will be passed down to the child -->
	{/snippet}
</Accordion.Trigger>
```

The following example would not work, as the `Accordion.Trigger` component has no idea what the `id` of the `CustomButton` is.

```svelte
<script lang="ts">
	import CustomButton from "./CustomButton.svelte";
	import { Accordion } from "bits-ui";

	let triggerRef = $state<HTMLButtonElement>();

	function focusTrigger() {
		triggerRef?.focus(); // will always be undefined
	}
</script>

<Accordion.Trigger bind:ref={triggerRef}>
	{#snippet child({ props })}
		<CustomButton {...props} id="my-custom-id" /> <!-- this won't work -->
	{/snippet}
</Accordion.Trigger>
```

## WithElementRef

Bits UI exposes a [`WithElementRef`](/docs/utilities/with-element-ref) type which enables you to create your own components following the same `ref` prop pattern.
