---
title: Scroll Area
description: Consistent scroll area across platforms.
---

<script>
	import { APISection, ComponentPreviewV2, ScrollAreaDemo, ScrollAreaDemoScroll, ScrollAreaDemoAlways, ScrollAreaDemoAuto, ComponentPreviewMin } from '$lib/components'
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
		<!-- Scrollable content here -->
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

## Scroll Area Types

### Hover

The `hover` type is the default type of the scroll area, demonstrated in the featured example above. It only shows scrollbars when the user hovers over the scroll area and the content is larger than the viewport.

### Scroll

The `scroll` type displays the scrollbars when the user scrolls the content. This is similar to the behavior of MacOS.

```svelte
<ScrollArea.Root type="scroll">
	<!-- ... -->
</ScrollArea.Root>
```

<ComponentPreviewV2 name="scroll-area-demo-scroll" comp="Scroll Area">

{#snippet preview()}
<ScrollAreaDemoScroll />
{/snippet}

</ComponentPreviewV2>

### Auto

The `auto` type behaves similarly to your typical browser scrollbars. When the content is larger than the viewport, the scrollbars will appear and remain visible at all times.

```svelte
<ScrollArea.Root type="auto">
	<!-- ... -->
</ScrollArea.Root>
```

<ComponentPreviewV2 name="scroll-area-demo-auto" comp="Scroll Area">

{#snippet preview()}
<ScrollAreaDemoAuto />
{/snippet}

</ComponentPreviewV2>

### Always

The `always` type behaves as if you set `overflow: scroll` on the scroll area. Scrollbars will always be visible, even when the content is smaller than the viewport.

```svelte
<ScrollArea.Root type="always">
	<!-- ... -->
</ScrollArea.Root>
```

<ComponentPreviewV2 name="scroll-area-demo-always" comp="Scroll Area">

{#snippet preview()}
<ScrollAreaDemoAlways />
{/snippet}

</ComponentPreviewV2>

<APISection {schemas} />
