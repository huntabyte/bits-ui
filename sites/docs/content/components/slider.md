---
title: Slider
description: Allows users to select a value from a continuous range by sliding a handle.
---

<script>
	import { APISection, ComponentPreviewV2, SliderDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="slider-demo" comp="Slider">

{#snippet preview()}
<SliderDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Slider } from "bits-ui";
</script>

<Slider.Root>
	<Slider.Range />
	<Slider.Thumb />
	<Slider.Tick />
</Slider.Root>
```

## Resuable Components

Bits UI provides primitives that enable you to build your own custom slider component that can be reused throughout your application.

Here's an example of how you might create a reusable `MySlider` component.

```svelte title="MySlider.svelte"
<script lang="ts">
	import { Slider } from "bits-ui";

	type Props = WithoutChildren<Slider.RootProps>;

	let { value = $bindable(), ref = $bindable(null), ...restProps }: Props = $props();
</script>

<Slider.Root bind:value bind:ref {...restProps}>
	{#snippet children({ thumbs, ticks })}
		<Slider.Range />
		{#each thumbs as index}
			<Slider.Thumb {index} />
		{/each}

		{#each ticks as index}
			<Slider.Tick {index} />
		{/each}
	{/snippet}
</Slider.Root>
```

You can then use the `MySlider` component in your application like so:

```svelte
<script lang="ts">
	import MySlider from "$lib/components/MySlider.svelte";

	let someValue = $state([5, 10]);
</script>

<MySlider bind:value={someValue} />
```

## Managing Value State

The `value` represents the currently selected value(s) of the slider.

### Two-Way Binding

Use the `bind:value` directive for effortless two-way synchronization between your local state and the slider's internal state.

```svelte
<script lang="ts">
	import { Slider } from "bits-ui";
	let value = $state([5, 7]);
</script>

<Slider.Root bind:value>
	<!-- ... -->
</Slider.Root>
```

### Change Handler

You can also use the `onValueChange` prop to update local state when the slider's value changes.

```svelte
<Slider.Root onValueChange={(value) => console.log(value)}>
	<!-- ... -->
</Slider.Root>
```

### Change End Handler

Sometimes, you may only want to perform an action or update a state when the user has finished dragging the thumb, but not as they are dragging it. You can use the `onValueChangeEnd` prop to listen for the end of the value change.

```svelte
<Slider.Root onValueChangeEnd={() => console.log("value changed!")}>
	<!-- ... -->
</Slider.Root>
```

## Multiple Thumbs and Ticks

If the `value` prop has more than one value, the slider will render multiple thumbs. You can also use the `ticks` snippet prop to render ticks at specific intervals

```svelte
<script lang="ts">
	import { Slider } from "bits-ui";

	let value = $state([5, 7]);
</script>

<Slider.Root min={0} max={10} step={1} bind:value>
	{#snippet children({ ticks, thumbs })}
		<Slider.Range />

		{#each thumbs as index}
			<Slider.Thumb {index} />
		{/each}

		{#each ticks as index}
			<Slider.Tick {index} />
		{/each}
	{/snippet}
</Slider.Root>
```

To determine the number of ticks that will be rendered, you can simply divide the `max` value by the `step` value.

## Vertical Orientation

You can use the `orientation` prop to change the orientation of the slider, which defaults to `"horizontal"`.

```svelte
<Slider.Root orientation="vertical">
	<!-- ... -->
</Slider.Root>
```

## RTL Support

You can use the `dir` prop to change the reading direction of the slider, which defaults to `"ltr"`.

```svelte
<Slider.Root dir="rtl">
	<!-- ... -->
</Slider.Root>
```

## Auto Sort

By default, the slider will sort the values from smallest to largest, so if you drag a smaller thumb to a larger value, the value of that thumb will be updated to the larger value.

You can disable this behavior by setting the `autoSort` prop to `false`.

```svelte
<Slider.Root autoSort={false}>
	<!-- ... -->
</Slider.Root>
```

## HTML Forms

Since there is a near endless number of possible values that a user can select, the slider does not render a hidden input element by default.

You'll need to determine how you want to submit the value(s) of the slider with a form.

Here's an example of how you might do that:

```svelte
<script lang="ts">
	import MySlider from "$lib/components/MySlider.svelte";

	let expectedIncome = $state([50, 100]);
</script>

<form method="POST">
	<MySlider bind:value={expectedIncome} />
	<input type="hidden" name="expectedIncomeStart" value={expectedIncome[0]} />
	<input type="hidden" name="expectedIncomeEnd" value={expectedIncome[1]} />
	<button type="submit">Submit</button>
</form>
```

<APISection {schemas} />
