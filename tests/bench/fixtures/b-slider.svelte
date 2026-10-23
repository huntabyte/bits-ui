<script lang="ts">
	import { Slider } from "bits-ui";
	let { count }: { count: number } = $props();
</script>

{#each { length: count }, i (i)}
	<Slider.Root
		type="single"
		value={10}
		max={100}
		thumbPositioning="exact"
		style="display: block; position: relative; width: 200px; height: 20px"
		data-bench="slider"
	>
		<Slider.Range />
		<Slider.Thumb index={0} style="width: 10px; height: 10px" data-bench="thumb" />
		{#each { length: 5 }, t (t)}
			<Slider.Tick index={t} />
		{/each}
	</Slider.Root>
{/each}
