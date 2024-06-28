---
title: Toggle
description: A control element that switches between two states, providing a binary choice.
---

<script>
	import { APISection, ComponentPreview, ToggleDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreview name="toggle-demo" comp="Toggle">

<ToggleDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { Toggle } from "bits-ui";
</script>

<Toggle.Root/>
```

<APISection {schemas} />
