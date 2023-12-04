---
title: Link Preview
description: Displays a summarized preview of a linked content's details or information.
---

<script>
	import { APISection, ComponentPreview, LinkPreviewDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="link-preview-demo" comp="LinkPreview">

<LinkPreviewDemo slot="preview" />

</ComponentPreview>

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

🚧 **UNDER CONSTRUCTION** 🚧
