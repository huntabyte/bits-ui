---
title: Collapsible
description: Conceals or reveals content sections, enhancing space utilization and organization.
---

<script>
	import { APISection, ComponentPreview, CollapsibleDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="collapsible-demo" comp="Collapsible">

<CollapsibleDemo slot="preview" />

</ComponentPreview>

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

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
