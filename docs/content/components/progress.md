---
title: Progress
description: Visualizes the progress or completion status of a task or process.
---

<script>
	import { APISection, ComponentPreviewV2, ProgressDemo } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="progress-demo" comp="Progress">

{#snippet preview()}
<ProgressDemo />
{/snippet}

</ComponentPreviewV2>

While often visually similar, progress bars and [Meters](/docs/components/meter) serve distinct purposes:

**Progress**:

-   Shows **completion status** of a task
-   Value only increases as task progresses
-   Examples: File upload, installation status, form completion
-   Use when tracking advancement toward completion

**Meter**:

-   Displays a **static measurement** within a known range (0-100)
-   Value can fluctuate up/down based on real-time measurements
-   Examples: CPU usage, battery level, sound volume
-   Use when showing current state relative to capacity

If a meter better fits your requirements, check out the [Meter](/docs/components/meter) component.

## Structure

```svelte
<script lang="ts">
	import { Progress } from "bits-ui";
</script>

<Progress.Root />
```

<APISection {schemas} />
