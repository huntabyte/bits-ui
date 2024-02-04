---
title: Slider
description: Allows users to select a value from a continuous range by sliding a handle.
---

<script>
	import { APISection, ComponentPreview, SliderDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="slider-demo" comp="Slider">

<SliderDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { Slider } from "bits-ui";
</script>

<Slider.Root>
	<Slider.Range />
	<Slider.Thumb />
	<Slider.Input />
</Slider.Root>
```

## Examples

### Multiple Thumbs and Ticks

If the `value` prop has more than one value, the slider will render multiple thumbs. You can also use the `ticks` slot prop to render ticks at specific intervals.

```svelte
<script lang="ts">
	import { Slider } from "bits-ui";

	let value = [5, 7];
</script>

<Slider.Root min={0} max={10} step={1} bind:value let:ticks let:thumbs>
	<Slider.Range />

	{#each thumbs as thumb}
		<Slider.Thumb {thumb} />
	{/each}

	{#each ticks as tick}
		<Slider.Tick {tick} />
	{/each}
</Slider.Root>
```

### Vertical Orientation

You can use the `orientation` prop to change the orientation of the slider, which defaults to `"horizontal"`.

```svelte
<Slider.Root let:thumbs orientation="vertical">
	<Slider.Range />

	{#each thumbs as thumb}
		<Slider.Thumb {thumb} />
	{/each}
</Slider.Root>
```

### RTL Support

You can use the `dir` prop to change the reading direction of the slider, which defaults to `"ltr"`.

```svelte
<Slider.Root let:thumbs dir="rtl">
	<Slider.Range />

	{#each thumbs as thumb}
		<Slider.Thumb {thumb} />
	{/each}
</Slider.Root>
```

<APISection {schemas} />
