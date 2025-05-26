<script lang="ts" module>
	import { Slider, type SliderMultipleRootProps } from "bits-ui";

	export type SliderWithLabelsTestProps = Omit<SliderMultipleRootProps, "type"> & {
		tickLabelPosition?: "top" | "bottom" | "left" | "right";
		thumbLabelPosition?: "top" | "bottom" | "left" | "right";
		showTickLabels?: boolean;
		showThumbLabels?: boolean;
		orientation?: "horizontal" | "vertical";
	};
</script>

<script lang="ts">
	let {
		value = [30],
		min = 0,
		max = 100,
		step = 1,
		tickLabelPosition,
		thumbLabelPosition,
		showTickLabels = true,
		showThumbLabels = true,
		orientation = "horizontal",
		...restProps
	}: SliderWithLabelsTestProps = $props();
</script>

<main>
	<Slider.Root
		type="multiple"
		data-testid="root"
		bind:value
		{orientation}
		{...restProps}
		{min}
		{max}
		{step}
	>
		{#snippet children({ thumbItems, tickItems })}
			<span>
				<Slider.Range data-testid="range" />
			</span>

			{#each thumbItems as { index, value: thumbValue } (index)}
				<Slider.Thumb {index} aria-label="slider thumb" data-testid="thumb-{index}" />
				{#if showThumbLabels}
					<Slider.ThumbLabel
						{index}
						data-testid="thumb-label-{index}"
						position={thumbLabelPosition}
					>
						{thumbValue}
					</Slider.ThumbLabel>
				{/if}
			{/each}

			{#each tickItems as { index, value: tickValue } (index)}
				<Slider.Tick data-testid="tick-{index}" {index} />
				{#if showTickLabels}
					<Slider.TickLabel
						{index}
						data-testid="tick-label-{index}"
						position={tickLabelPosition}
					>
						{tickValue}
					</Slider.TickLabel>
				{/if}
			{/each}
		{/snippet}
	</Slider.Root>
</main>
