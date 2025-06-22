---
title: Progress
description: Visualizes the progress or completion status of a task or process.
---

<script>
	import { APISection, ComponentPreviewV2, ProgressDemo, ProgressDemoCustom } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="progress-demo" componentName="Progress">

{#snippet preview()}
<ProgressDemo />
{/snippet}

</ComponentPreviewV2>

While often visually similar, progress bars and [Meters](/docs/components/meter) serve distinct purposes:

**Progress**:

- Shows **completion status** of a task
- Value only increases as task progresses
- Examples: File upload, installation status, form completion
- Use when tracking advancement toward completion

**Meter**:

- Displays a **static measurement** within a known range (0-100)
- Value can fluctuate up/down based on real-time measurements
- Examples: CPU usage, battery level, sound volume
- Use when showing current state relative to capacity

If a meter better fits your requirements, check out the [Meter](/docs/components/meter) component.

## Structure

```svelte
<script lang="ts">
  import { Progress } from "bits-ui";
</script>

<Progress.Root />
```

## Reusable Components

It's recommended to use the `Progress` primitive to create your own custom meter component that can be used throughout your application. In the example below, we're using the `Progress` primitive to create a more comprehensive meter component.

```svelte
<script lang="ts">
  import { Progress, useId } from "bits-ui";
  import type { ComponentProps } from "svelte";

  let {
    max = 100,
    value = 0,
    min = 0,
    label,
    valueLabel,
  }: ComponentProps<typeof Progress.Root> & {
    label: string;
    valueLabel: string;
  } = $props();

  const labelId = useId();
</script>

<div>
  <span id={labelId}> {label} </span>
  <span>{valueLabel}</span>
</div>
<Progress.Root
  aria-labelledby={labelId}
  aria-valuetext={valueLabel}
  {value}
  {min}
  {max}
/>
```

You can then use the `MyProgress` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
  import MyProgress from "$lib/components/MyProgress.svelte";

  let value = $state(50);
</script>

<MyProgress label="Loading images..." valueLabel="{value}%" {value} />
```

Of course, you'd want to apply your own styles and other customizations to the `MyProgress` component to fit your application's design.

<br>

<ProgressDemoCustom value={50} label="Loading images..." valueLabel="50%" />

## Accessibility

If a visual label is used, the ID of the label element should be pass via the `aria-labelledby` prop to `Progress.Root`. If no visual label is used, the `aria-label` prop should be used to provide a text description of the progress bar.

<APISection {schemas} />
