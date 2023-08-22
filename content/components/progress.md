---
title: Progress
description: A visual indicator that displays the progress of a task, usually in the form of a progress bar.
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
