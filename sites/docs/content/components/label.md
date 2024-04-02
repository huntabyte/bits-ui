---
title: Label
description: Identifies or describes associated UI elements.
---

<script>
	import { APISection, ComponentPreview, LabelDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreview name="label-demo" comp="Label">

<LabelDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { Label } from "bits-ui";
</script>

<Label.Root />
```

<APISection {schemas} />
