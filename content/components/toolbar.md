---
title: Toolbar
description: A container for grouping a set of controls, such as buttons, links or toggle groups.
---

<script>
	import { APISection, ComponentPreview, ToolbarDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="toolbar-demo" comp="Toolbar">

<ToolbarDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { Toolbar } from "bits-ui";
</script>

<Toolbar.Root>
  <Toolbar.Group>
    <Toolbar.GroupItem />
  </Toolbar.Group>
  <Toolbar.Separator />
  <Toolbar.Link />
  <Toolbar.Button />
<Toolbar.Root />
```

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
