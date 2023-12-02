---
title: Switch
description: A toggle control enabling users to switch between "on" and "off" states.
---

<script>
	import { APISection, ComponentPreview, SwitchDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="switch-demo" comp="Switch">

<SwitchDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { Switch } from "bits-ui";
</script>

<Switch.Root>
	<Switch.Thumb />
	<Switch.Input />
</Switch.Root>
```

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
