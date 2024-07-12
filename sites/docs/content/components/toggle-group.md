---
title: Toggle Group
description: A control element that switches between two states, providing a binary choice.
---

<script>
	import { APISection, ComponentPreviewV2, ToggleGroupDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="toggle-group-demo" comp="ToggleGroup">

{#snippet preview()}
<ToggleGroupDemo />
{/snippet}

</ComponentPreviewV2>

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
