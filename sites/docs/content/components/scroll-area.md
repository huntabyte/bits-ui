---
title: Scroll Area
description: Consistent scroll area across platforms.
---

<script>
	import { APISection, ComponentPreviewV2, ScrollAreaDemo } from '$lib/components'
	export let schemas;
</script>

<ComponentPreviewV2 name="scroll-area-demo" comp="Scroll Area">

{#snippet preview()}
<ScrollAreaDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { ScrollArea } from "$lib/index.js";
</script>

<ScrollArea.Root>
	<ScrollArea.Viewport>
		<ScrollArea.Content>
			<!-- ... -->
		</ScrollArea.Content>
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar orientation="vertical">
		<ScrollArea.Thumb />
	</ScrollArea.Scrollbar>
	<ScrollArea.Scrollbar orientation="horizontal">
		<ScrollArea.Thumb />
	</ScrollArea.Scrollbar>
	<ScrollArea.Corner />
</ScrollArea.Root>
```

<APISection {schemas} />
