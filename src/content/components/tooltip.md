---
title: Tooltip
description: Displays floating content containing additional information about an action on hover or focus.
---

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
