---
title: Popover
description: Displays content in a floating container that appears above the surrounding content.
---

<script>
	import { APISection, ComponentPreview, PopoverDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="popover-demo" comp="Popover">

<PopoverDemo slot="preview" />

</ComponentPreview>

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

🚧 **UNDER CONSTRUCTION** 🚧
