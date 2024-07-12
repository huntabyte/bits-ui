---
title: Toggle
description: Groups multiple toggle controls, allowing users to enable one or multiple options.
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

<Toggle.Root>
	<Toggle.Thumb />
	<Toggle.Input />
</Toggle.Root>
```

<APISection {schemas} />
