---
title: Tooltip
description: Provides additional information or context when users hover over or interact with an element.
---

<script>
	import { ComponentPreviewV2, TooltipDemo, APISection } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="tooltip-demo" comp="Tooltip">

{#snippet preview()}
<TooltipDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Tooltip } from "bits-ui";
</script>

<Tooltip.Root>
	<Tooltip.Trigger />
	<Tooltip.Content>
		<Tooltip.Arrow />
	</Tooltip.Content>
</Tooltip.Root>
```

<APISection {schemas} />
