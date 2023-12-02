---
title: Progress
description: Visualizes the progress or completion status of a task or process.
---

<script>
	import { APISection, ComponentPreview, ProgressDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="progress-demo" comp="Progress">

<ProgressDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { Progress } from "bits-ui";
</script>

<Progress.Root />
```

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
