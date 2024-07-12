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

<APISection {schemas} />
