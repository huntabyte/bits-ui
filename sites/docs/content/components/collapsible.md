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

## Controlled Usage

Sometimes, you want to either control or be aware of the `open` state of the collapsible from outside of the component. To do so, you can bind to the `open` prop.

```svelte
<script lang="ts">
	import { Collapsible } from "bits-ui";
	let collapsibleOpen = false;
</script>

<button on:click={() => (collapsibleOpen = true)}>Open</button>
<Collapsible.Root bind:open={collapsibleOpen}>
	<Collapsible.Trigger />
	<Collapsible.Content />
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

With the amount of boilerplate needed to handle the transitions, it's recommended to componentize your custom implementation of the collapsible content and use that throughout your application.

<APISection {schemas} />
