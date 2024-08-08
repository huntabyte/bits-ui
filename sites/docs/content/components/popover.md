---
title: Popover
description: Display supplementary content or information when users interact with specific elements.
---

<script>
	import { APISection, ComponentPreviewV2, PopoverDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="popover-demo" comp="Popover">

{#snippet preview()}
<PopoverDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Popover } from "bits-ui";
</script>

<Popover.Root>
	<Popover.Trigger />
	<Popover.Content>
		<Popover.Close />
		<Popover.Arrow />
	</Popover.Content>
</Popover.Root>
```

<APISection {schemas} />

## Examples

### Controlled

If you want to control or be aware of the `open` state of the popover from outside of the component, bind to the `open` prop.

```svelte
<script lang="ts">
	import { Popover } from "bits-ui";
	let popoverOpen = false;
</script>

<button on:click={() => (popoverOpen = true)}>Open</button>
<Popover.Root bind:open={popoverOpen}>
	<Popover.Trigger />
	<Popover.Content>
		<Popover.Close />
		<Popover.Arrow />
	</Popover.Content>
</Popover.Root>
```
