---
title: Aspect Ratio
description: Displays content while maintaining a specified aspect ratio, ensuring consistent visual proportions.
---

<script>
	import { APISection, ComponentPreviewV2, AspectRatioDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="aspect-ratio-demo" comp="Aspect Ratio">

{#snippet preview()}
<AspectRatioDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { AspectRatio } from "bits-ui";
</script>

<AspectRatio.Root />
```

<APISection {schemas} />
