---
title: Toggle
description: A control element that switches between two states, providing a binary choice.
---

<script>
	import { APISection, ComponentPreviewV2, ToggleDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="toggle-demo" comp="Toggle">

{#snippet preview()}
<ToggleDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Toggle } from "bits-ui";
</script>

<Toggle.Root />
```

<APISection {schemas} />
