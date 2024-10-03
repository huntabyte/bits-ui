---
title: Scroll Area
description: Consistent scroll area across platforms.
---

<script>
	import { APISection, ComponentPreview, ScrollAreaDemo } from '$lib/components'
	export let schemas;
</script>

<ComponentPreview name="scroll-area-demo" comp="Scroll Area">

<ScrollAreaDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { ScrollArea } from "bits-ui";
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
