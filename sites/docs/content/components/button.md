---
title: Button
description: A special button component that can receive Melt UI builders for use with the `asChild` prop.
---

<script>
	import { APISection, ComponentPreviewV2, ButtonDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="button-demo" comp="Avatar">

{#snippet preview()}
<ButtonDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Button } from "bits-ui";
</script>

<Button.Root />
```

<APISection {schemas} />
