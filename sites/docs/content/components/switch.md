---
title: Switch
description: A toggle control enabling users to switch between "on" and "off" states.
---

<script>
	import { APISection, ComponentPreviewV2, SwitchDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="switch-demo" comp="Switch">

{#snippet preview()}
<SwitchDemo />
{/snippet}

</ComponentPreviewV2>

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
