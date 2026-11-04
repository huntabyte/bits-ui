<script lang="ts">
	import { Slider } from "bits-ui";

	let fontSize = $state(16);
	const fontSizes = [0, 4, 8, 16, 24];
</script>

<div class="w-full md:max-w-[320px]">
	<Slider.Root
		type="single"
		step={fontSizes}
		bind:value={fontSize}
		class="relative flex w-full touch-none items-center select-none"
		trackPadding={3}
	>
		{#snippet children({ tickItems })}
			<span
				class="relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full bg-dark-10"
			>
				<Slider.Range class="absolute h-full bg-foreground" />
			</span>
			<Slider.Thumb
				index={0}
				class="z-5 block size-[25px] cursor-pointer rounded-full border border-border-input bg-background shadow-sm transition-colors hover:border-dark-40 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-active:scale-[0.98] data-active:border-dark-40 dark:bg-foreground dark:shadow-card"
			/>
			{#each tickItems as { index, value } (index)}
				<Slider.Tick {index} class="z-1 h-2 w-[1px] bg-background dark:bg-background" />
				<Slider.TickLabel
					{index}
					class="mb-5 text-sm leading-none font-medium text-muted-foreground data-selected:text-foreground"
				>
					{value}px
				</Slider.TickLabel>
			{/each}
		{/snippet}
	</Slider.Root>
</div>

<div class="flex h-[320px] w-full justify-center">
	<Slider.Root
		type="single"
		step={fontSizes}
		bind:value={fontSize}
		orientation="vertical"
		class="relative flex h-full touch-none flex-col items-center select-none"
		trackPadding={3}
	>
		{#snippet children({ tickItems })}
			<span
				class="relative h-full w-2 cursor-pointer overflow-hidden rounded-full bg-dark-10"
			>
				<Slider.Range class="absolute w-full bg-foreground" />
			</span>
			<Slider.Thumb
				index={0}
				class="z-5 block size-[25px] cursor-pointer rounded-full border border-border-input bg-background shadow-sm transition-colors hover:border-dark-40 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-active:scale-[0.98] data-active:border-dark-40 dark:bg-foreground dark:shadow-card"
			/>
			{#each tickItems as { index, value } (index)}
				<Slider.Tick {index} class="z-1 h-[1px] w-4 dark:bg-background" />
				<Slider.TickLabel
					{index}
					class="mr-5 text-sm leading-none font-medium text-muted-foreground data-selected:text-foreground"
				>
					{value}px
				</Slider.TickLabel>
			{/each}
		{/snippet}
	</Slider.Root>
</div>
