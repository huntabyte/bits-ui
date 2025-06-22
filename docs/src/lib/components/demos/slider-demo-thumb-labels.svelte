<script lang="ts">
	import { Slider } from "bits-ui";

	let value = $state([5, 7, 10]);
</script>

<div class="w-full md:max-w-[400px]">
	<Slider.Root
		step={1}
		min={4}
		max={11}
		type="multiple"
		bind:value
		class="relative flex w-full touch-none select-none items-center"
		trackPadding={2}
		autoSort={false}
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
			<Slider.ThumbLabel
				index={0}
				class="bg-muted text-foreground mb-5 text-nowrap rounded-md px-2 py-1 text-sm"
			>
				Check in
			</Slider.ThumbLabel>
			<Slider.Thumb
				index={1}
				class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card data-active:border-dark-40 z-5 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
			/>
			<Slider.ThumbLabel
				index={1}
				class="bg-muted text-foreground mb-5 text-nowrap rounded-md px-2 py-1 text-sm"
			>
				Dinner
			</Slider.ThumbLabel>
			<Slider.Thumb
				index={2}
				class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card data-active:border-dark-40 z-5 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
			/>
			<Slider.ThumbLabel
				index={2}
				class="bg-muted text-foreground mb-5 text-nowrap rounded-md px-2 py-1 text-sm"
			>
				Sleep
			</Slider.ThumbLabel>
			{#each tickItems as { index, value } (index)}
				<Slider.Tick {index} class="dark:bg-background/20 bg-background z-1 h-2 w-[1px]" />
				<Slider.TickLabel
					{index}
					class="text-muted-foreground data-selected:text-foreground mt-5 text-xs font-medium leading-none"
					position="bottom"
				>
					{value}pm
				</Slider.TickLabel>
			{/each}
		{/snippet}
	</Slider.Root>
</div>
