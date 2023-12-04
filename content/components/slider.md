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

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
