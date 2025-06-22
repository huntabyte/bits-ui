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
		class="relative flex w-full touch-none select-none items-center"
		trackPadding={3}
	>
		{#snippet children({ tickItems })}
			<span
				class="bg-dark-10 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
			>
				<Slider.Range class="bg-foreground absolute h-full" />
			</span>
			<Slider.Thumb
				index={0}
				class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card data-active:border-dark-40 z-5 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
			/>
			{#each tickItems as { index, value } (index)}
				<Slider.Tick {index} class="dark:bg-background bg-background z-1 h-2 w-[1px]" />
				<Slider.TickLabel
					{index}
					class="text-muted-foreground data-selected:text-foreground mb-5 text-sm font-medium leading-none"
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
		class="relative flex h-full touch-none select-none flex-col items-center"
		trackPadding={3}
	>
		{#snippet children({ tickItems })}
			<span
				class="bg-dark-10 relative h-full w-2 cursor-pointer overflow-hidden rounded-full"
			>
				<Slider.Range class="bg-foreground absolute w-full" />
			</span>
			<Slider.Thumb
				index={0}
				class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card data-active:border-dark-40 z-5 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
			/>
			{#each tickItems as { index, value } (index)}
				<Slider.Tick {index} class="dark:bg-background z-1 h-[1px] w-4" />
				<Slider.TickLabel
					{index}
					class="text-muted-foreground data-selected:text-foreground mr-5 text-sm font-medium leading-none"
				>
					{value}px
				</Slider.TickLabel>
			{/each}
		{/snippet}
	</Slider.Root>
</div>
