---
title: Toggle Group
description: Groups multiple toggle controls, allowing users to enable one or multiple options.
---

<script>
	import { APISection, ComponentPreview, ToggleGroupDemo } from '$lib/components/index.js'
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
