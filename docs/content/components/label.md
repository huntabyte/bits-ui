---
title: Label
description: Identifies or describes associated UI elements.
---

<script>
	import { APISection, ComponentPreview, LabelDemo } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreview name="label-demo" componentName="Label">

{#snippet preview()}
<LabelDemo />
{/snippet}

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
  import { Label } from "bits-ui";
</script>

<Label.Root />
```

<APISection {schemas} />
