---
title: Link Preview
description: Enable sighted users to preview content behind a link.
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
