---
title: Tabs
description: Allows users to navigate between different views
---

<script>
	import { APISection, ComponentPreview, TabsDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="tabs-demo" comp="Tabs">

<TabsDemo slot="preview" />

</ComponentPreview>

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

🚧 **UNDER CONSTRUCTION** 🚧
