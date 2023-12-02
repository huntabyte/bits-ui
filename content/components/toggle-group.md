---
title: Toggle Group
description: A control element that switches between two states, providing a binary choice.
---

<script>
	import { APISection, ComponentPreview, ToggleGroupDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="toggle-group-demo" comp="ToggleGroup">

<ToggleGroupDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { ToggleGroup } from "bits-ui";
</script>

<ToggleGroup.Root>
	<ToggleGroup.Item value="bold">bold</ToggleGroup.Item>
	<ToggleGroup.Item value="italic">italic</ToggleGroup.Item>
</ToggleGroup.Root>
```

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
