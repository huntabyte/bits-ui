<script lang="ts">
	import { Slider } from "bits-ui";

	let value = $state([5, 7]);
</script>

<div class="w-full md:max-w-[280px]">
	<Slider.Root
		step={1}
		min={0}
		max={10}
		type="multiple"
		bind:value
		class="relative flex w-full touch-none select-none items-center"
	>
		{#snippet children({ ticks, thumbs })}
			<span
				class="bg-dark-10 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
			>
				<Slider.Range class="bg-foreground absolute h-full" />
			</span>
			{#each thumbs as thumb}
				<Slider.Thumb
					index={thumb}
					class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card focus-visible:outline-hidden z-5 data-active:scale-[0.98] data-active:border-dark-40 block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				/>
			{/each}
			{#each ticks as tick}
				<Slider.Tick
					index={tick}
					class="dark:bg-background/20 bg-background z-1 h-2 w-[1px]"
				/>
			{/each}
		{/snippet}
	</Slider.Root>
</div>
