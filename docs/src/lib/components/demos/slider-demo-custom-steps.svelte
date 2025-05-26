<script lang="ts">
	import { Slider } from "bits-ui";

	// Font size example with common typography sizes
	let fontSize = $state(16);
	const fontSizes = [0, 4, 8, 16, 24];
</script>

<!-- <div class="w-full md:max-w-[320px]">
	<Slider.Root
		type="single"
		step={fontSizes}
		min={0}
		max={24}
		bind:value={fontSize}
		class="relative flex w-full touch-none select-none items-center"
		thumbPositioning="contain"
		trackPadding={8}
	>
		{#snippet children({ tickItems })}
			<span
				class="bg-dark-10 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
			>
				<Slider.Range class="bg-accent absolute h-full" />
			</span>
			<Slider.Thumb
				index={0}
				class="border-border-input bg-accent hover:border-dark-40 focus-visible:ring-foreground dark:bg-accent dark:shadow-card focus-visible:outline-hidden z-5 data-active:scale-[0.98] data-active:border-dark-40 block size-[20px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
			/>
			{#each tickItems as { index, value } (index)}
				<Slider.Tick {index} class="z-1 h-4 w-[1px] bg-green-500 dark:bg-white" />
				<Slider.TickLabel
					{index}
					class="mb-5 text-sm font-medium leading-none"
					position="top"
				>
					{value}px
				</Slider.TickLabel>
			{/each}
		{/snippet}
	</Slider.Root>
</div> -->

<div class="flex h-[320px] w-full justify-center">
	<Slider.Root
		type="single"
		step={fontSizes}
		min={0}
		max={24}
		bind:value={fontSize}
		orientation="vertical"
		class="relative flex h-full touch-none select-none flex-col items-center"
		thumbPositioning="contain"
		trackPadding={8}
	>
		{#snippet children({ tickItems })}
			<span
				class="bg-dark-10 relative h-full w-2 cursor-pointer overflow-hidden rounded-full"
			>
				<Slider.Range class="bg-accent absolute w-full" />
			</span>
			<Slider.Thumb
				index={0}
				class="border-border-input bg-accent hover:border-dark-40 focus-visible:ring-foreground dark:bg-accent dark:shadow-card focus-visible:outline-hidden z-5 data-active:scale-[0.98] data-active:border-dark-40 block size-[20px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
			/>
			{#each tickItems as { index, value } (index)}
				<Slider.Tick {index} class="z-1 h-[1px] w-4 bg-green-500 dark:bg-white" />
				<Slider.TickLabel
					{index}
					class="ml-3 text-sm font-medium leading-none"
					position="right"
				>
					{value}px
				</Slider.TickLabel>
			{/each}
		{/snippet}
	</Slider.Root>
</div>
