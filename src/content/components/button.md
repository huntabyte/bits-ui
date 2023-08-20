---
title: Button
description: A special button component that can receive Melt UI builders for use with the `asChild` prop.
---

<script>
	import { APISection, ComponentPreview, ButtonDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="button-demo" comp="Button">

<ButtonDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { Button } from "bits-ui";
</script>

<Button.Root />
```

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
