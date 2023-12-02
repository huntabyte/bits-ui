---
title: Toggle
description: Groups multiple toggle controls, allowing users to enable one or multiple options.
---

<script>
	import { APISection, ComponentPreview, ToggleDemo } from '@/components'
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

<Toggle.Root>
	<Toggle.Thumb />
	<Toggle.Input />
</Toggle.Root>
```

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
