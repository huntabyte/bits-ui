---
title: Tooltip
description: Displays floating content containing additional information about an action on hover or focus.
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
	import { Tooltip } from 'bits-ui';
</script>

<ToolTip.Root>
	<Tooltip.Trigger />
	<Tooltip.Content>
		<Tooltip.Arrow />
	</Tooltip.Content>
</Tooltip.Root>
```

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
