---
title: Tooltip
description: Provides additional information or context when users hover over or interact with an element.
---

<script>
	import { ComponentPreview, TooltipDemo, APISection } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="tooltip-demo" comp="Tooltip">

<TooltipDemo slot="preview" />

</ComponentPreview>

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

🚧 **UNDER CONSTRUCTION** 🚧
