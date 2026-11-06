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
		class="relative flex w-full touch-none items-center select-none"
		trackPadding={2}
		autoSort={false}
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
			<Slider.ThumbLabel
				index={0}
				class="mb-5 rounded-md bg-muted px-2 py-1 text-sm text-nowrap text-foreground"
			>
				Check in
			</Slider.ThumbLabel>
			<Slider.Thumb
				index={1}
				class="z-5 block size-[25px] cursor-pointer rounded-full border border-border-input bg-background shadow-sm transition-colors hover:border-dark-40 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-active:scale-[0.98] data-active:border-dark-40 dark:bg-foreground dark:shadow-card"
			/>
			<Slider.ThumbLabel
				index={1}
				class="mb-5 rounded-md bg-muted px-2 py-1 text-sm text-nowrap text-foreground"
			>
				Dinner
			</Slider.ThumbLabel>
			<Slider.Thumb
				index={2}
				class="z-5 block size-[25px] cursor-pointer rounded-full border border-border-input bg-background shadow-sm transition-colors hover:border-dark-40 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-active:scale-[0.98] data-active:border-dark-40 dark:bg-foreground dark:shadow-card"
			/>
			<Slider.ThumbLabel
				index={2}
				class="mb-5 rounded-md bg-muted px-2 py-1 text-sm text-nowrap text-foreground"
			>
				Sleep
			</Slider.ThumbLabel>
			{#each tickItems as { index, value } (index)}
				<Slider.Tick {index} class="z-1 h-2 w-[1px] bg-background dark:bg-background/20" />
				<Slider.TickLabel
					{index}
					class="mt-5 text-xs leading-none font-medium text-muted-foreground data-selected:text-foreground"
					position="bottom"
				>
					{value}pm
				</Slider.TickLabel>
			{/each}
		{/snippet}
	</Slider.Root>
</div>
