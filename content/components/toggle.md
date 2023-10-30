---
title: Toggle
description: An interactive component that toggles between two states.
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

🚧 **UNDER CONSTRUCTION** 🚧
