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
			<span class="bg-primary/20 relative h-1.5 w-full grow overflow-hidden rounded-full">
				<Slider.Range data-testid="range" class="bg-primary absolute h-full" />
			</span>

			{#each thumbItems as { index, value: thumbValue } (index)}
				<Slider.Thumb
					{index}
					aria-label="slider thumb"
					data-testid="thumb-{index}"
					class="border-primary/50 focus-visible:ring-ring bg-background block h-4 w-4 rounded-full border shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
				/>
				{#if showThumbLabels}
					<Slider.ThumbLabel
						{index}
						data-testid="thumb-label-{index}"
						position={thumbLabelPosition}
						class="text-sm font-medium"
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
						class="text-xs"
					>
						{tickValue}
					</Slider.TickLabel>
				{/if}
			{/each}
		{/snippet}
	</Slider.Root>
</main>
