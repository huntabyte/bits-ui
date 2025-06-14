---
title: Meter
description: Display real-time measurements within a defined range.
---

<script>
	import { APISection, ComponentPreviewV2, MeterDemo, DemoCodeContainer, MeterDemoCustom } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="meter-demo" componentName="Meter">

{#snippet preview()}
<MeterDemo />
{/snippet}

</ComponentPreviewV2>

While often visually similar, meters and [Progress](/docs/components/progress) bars serve distinct purposes:

**Meter**:

- Displays a **static measurement** within a known range (0-100)
- Value can fluctuate up/down based on real-time measurements
- Examples: CPU usage, battery level, sound volume
- Use when showing current state relative to capacity

**Progress bar**:

- Shows **completion status** of a task
- Value only increases as task progresses
- Examples: File upload, installation status, form completion
- Use when tracking advancement toward completion

If a progress bar better fits your requirements, check out the [Progress](/docs/components/progress) component.

## Structure

```svelte
<script lang="ts">
  import { Meter } from "bits-ui";
</script>

<Meter.Root />
```

## Reusable Components

It's recommended to use the `Meter` primitive to create your own custom meter component that can be used throughout your application. In the example below, we're using the `Meter` primitive to create a more comprehensive meter component.

```svelte
<script lang="ts">
  import { Meter, useId } from "bits-ui";
  import type { ComponentProps } from "svelte";

  let {
    max = 100,
    value = 0,
    min = 0,
    label,
    valueLabel,
  }: ComponentProps<typeof Meter.Root> & {
    label: string;
    valueLabel: string;
  } = $props();

  const labelId = useId();
</script>

<div>
  <span id={labelId}> {label} </span>
  <span>{valueLabel}</span>
</div>
<Meter.Root
  aria-labelledby={labelId}
  aria-valuetext={valueLabel}
  {value}
  {min}
  {max}
/>
```

You can then use the `MyMeter` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
  import MyMeter from "$lib/components/MyMeter.svelte";

  let value = $state(3000);
  const max = 4000;
</script>

<MyMeter label="Tokens remaining" valueLabel="{value} / {max}" {value} {max} />
```

Of course, you'd want to apply your own styles and other customizations to the `MyMeter` component to fit your application's design.

<br>

<MeterDemoCustom value={3000} label="Tokens remaining" valueLabel="3000 / 4000" max={4000} />

## Accessibility

If a visual label is used, the ID of the label element should be pass via the `aria-labelledby` prop to `Meter.Root`. If no visual label is used, the `aria-label` prop should be used to provide a text description of the progress bar.

Assistive technologies often present `aria-valuenow` as a percentage. If conveying the value of the meter only in terms of a percentage would not be user friendly, the `aria-valuetext` property should be set to a string that makes the meter value understandable. For example, a battery meter value might be conveyed as `aria-valuetext="50% (6 hours) remaining"`. [[source](https://www.w3.org/WAI/ARIA/apg/patterns/meter/)]

<APISection {schemas} />
