---
title: Collapsible
description: Conceals or reveals content sections, enhancing space utilization and organization.
---

<script>
	import { APISection, ComponentPreviewV2, CollapsibleDemo, CollapsibleDemoTransitions } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="collapsible-demo" comp="Collapsible">

{#snippet preview()}
<CollapsibleDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Collapsible } from "bits-ui";
</script>

<Collapsible.Root>
	<Collapsible.Trigger />
	<Collapsible.Content />
</Collapsible.Root>
```

## Reusable Components

It's recommended to use the `Collapsible` primitives to create your own custom collapsible component that can be used throughout your application.

```svelte title="MyCollapsible.svelte"
<script lang="ts">
	import { Collapsible, type WithoutChild } from "bits-ui";

	type Props = WithoutChild<Collapsible.RootProps> & {
		buttonText: string;
	};

	let {
		open = $bindable(false),
		ref = $bindable(null),
		buttonText,
		children,
		...restProps
	}: Props = $props();
</script>

<Collapsible.Root bind:open bind:ref {...restProps}>
	<Collapsible.Trigger>{buttonText}</Collapsible.Trigger>
	<Collapsible.Content>
		{@render children?.()}
	</Collapsible.Content>
</Collapsible.Root>
```

You can then use the `MyCollapsible` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
	import MyCollapsible from "$lib/components/MyCollapsible.svelte";
</script>

<MyCollapsible buttonText="Open Collapsible">Here is my collapsible content.</MyCollapsible>
```

## Managing Open State

The `open` prop is used to determine whether the collapsible is open or closed. Bits UI provides flexible options for controlling and synchronizing the Collapsible's open state.

### Two-Way Binding

Use the `bind:open` directive for effortless two-way synchronization between your local state and the Collapsible's internal state.

```svelte
<script lang="ts">
	import { Collapsible } from "bits-ui";
	let myOpen = $state(false);
</script>

<button onclick={() => (myOpen = true)}> Open </button>

<Collapsible.Root bind:open={myOpen}>
	<!-- ... -->
</Collapsible.Root>
```

This setup enables toggling the Collapsible via the custom button and ensures the local `myOpen` state updates when the Collapsible changes through any internal means (e.g., clicking on the trigger).

### Change Handler

You can also use the `onOpenChange` prop to update local state when the Collapsible's `open` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the Collapsible changes.

```svelte
<script lang="ts">
	import { Collapsible } from "bits-ui";
	let myOpen = $state(false);
</script>

<Collapsible.Root
	open={myOpen}
	onOpenChange={(open) => {
		myOpen = open;
		// additional logic here.
	}}
>
	<!-- ... -->
</Collapsible.Root>
```

## Svelte Transitions

You can use the `forceMount` prop on the `Collapsible.Content` component to forcefully mount the content regardless of whether the collapsible is opened or not. This is useful when you want more control over the transitions when the collapsible opens and closes using something like [Svelte Transitions](https://svelte.dev/docs#transition).

The `open` snippet prop can be used for conditional rendering of the content based on whether the collapsible is open.

```svelte
<Collapsible.Content forceMount>
	{#snippet child({ props, open })}
		{#if open}
			<div {...props} transition:slide={{ duration: 1000 }}>
				This is the collapsible content that will transition in and out.
			</div>
		{/if}
	{/snippet}
</Collapsible.Content>
```

With the amount of boilerplate needed to handle the transitions, it's recommended to componentize your custom implementation of the collapsible content and use that throughout your application. See the [Transitions](/docs/transitions) documentation for more information on using transitions with Bits UI components.

<APISection {schemas} />
