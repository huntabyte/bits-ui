---
title: Link Preview
description: Displays a summarized preview of a linked content's details or information.
---

<script>
	import { APISection, ComponentPreviewV2, LinkPreviewDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="link-preview-demo" comp="LinkPreview">

{#snippet preview()}
<LinkPreviewDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { LinkPreview } from "bits-ui";
</script>

<LinkPreview.Root>
	<LinkPreview.Trigger />
	<LinkPreview.Content />
</LinkPreview.Root>
```

<APISection {schemas} />
