---
title: Toolbar
description: Displays frequently used actions or tools in a compact, easily accessible bar.
---

<script>
	import { APISection, ComponentPreviewV2, ToolbarDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="toolbar-demo" comp="Toolbar">

{#snippet preview()}
<ToolbarDemo slot="preview" />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Toolbar } from "bits-ui";
</script>

<Toolbar.Root>
	<Toolbar.Group>
		<Toolbar.GroupItem />
	</Toolbar.Group>
	<Toolbar.Link />
	<Toolbar.Button />
</Toolbar.Root>
```

<APISection {schemas} />
