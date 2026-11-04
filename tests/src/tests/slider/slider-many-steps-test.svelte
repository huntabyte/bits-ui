<script lang="ts" module>
	import { Slider, type SliderSingleRootProps } from "bits-ui";

	export type SliderManyStepsTestProps = Omit<SliderSingleRootProps, "type">;
</script>

<script lang="ts">
	let { value = 0, min = 0, max = 10_000, step = 1, ...restProps }: SliderManyStepsTestProps =
		$props();
</script>

<main>
	<Slider.Root
		type="single"
		data-testid="root"
		style="position: relative; display: flex; width: 200px"
		bind:value
		{...restProps}
		{min}
		{max}
		{step}
	>
		{#snippet children({ thumbItems })}
			<span class="bg-primary/20 relative h-1.5 w-full grow overflow-hidden rounded-full">
				<Slider.Range data-testid="range" class="bg-primary absolute h-full" />
			</span>
			{#each thumbItems as { index } (index)}
				<Slider.Thumb
					{index}
					aria-label="time"
					data-testid="thumb"
					style="width: 20px; height: 20px"
				/>
			{/each}
		{/snippet}
	</Slider.Root>
</main>
