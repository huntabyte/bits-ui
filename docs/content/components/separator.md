---
title: Separator
description: Visually separates content or UI elements.
---

<script>
	import { APISection, ComponentPreview, SeparatorDemo } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreview name="separator-demo" componentName="Separator" variant="preview">

{#snippet preview()}
<SeparatorDemo />
{/snippet}

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
  import { Separator } from "bits-ui";
</script>

<Separator.Root />
```

<APISection {schemas} />
