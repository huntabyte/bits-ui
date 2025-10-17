---
title: Button
description: A component that if passed a `href` prop will render an anchor element instead of a button element.
---

<script>
	import { APISection, ComponentPreview, ButtonDemo } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreview name="button-demo" componentName="Button" nonExpandableItems={["App.svelte"]} variant="preview">

{#snippet preview()}
<ButtonDemo />
{/snippet}

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
  import { Button } from "bits-ui";
</script>

<Button.Root />
```

<APISection {schemas} />
