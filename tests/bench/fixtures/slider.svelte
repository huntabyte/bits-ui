<script lang="ts">
	import { Slider } from "bits-ui";
	let { count, value = 10 }: { count: number; value?: number } = $props();
</script>

{#each { length: count }, i (i)}
	<Slider.Root type="single" {value} max={100} style="width: 200px; position: relative">
		<Slider.Range />
		<Slider.Thumb index={0} data-bench="thumb" />
		{#each { length: 5 }, t (t)}
			<Slider.Tick index={t} />
		{/each}
	</Slider.Root>
{/each}
