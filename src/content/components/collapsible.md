---
title: Collapsible
description: An interactive component which expands and collapses content.
---

<script>
	import { APISection } from '@/components'
	export let schemas;
</script>

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

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
