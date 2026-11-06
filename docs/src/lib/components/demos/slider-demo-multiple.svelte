<script lang="ts">
	import { Slider } from "bits-ui";
	import { cn } from "#lib/utils/styles.js";

	let value = $state([25, 75]);
</script>

<div class="w-full md:max-w-[280px]">
	<Slider.Root
		type="multiple"
		bind:value
		class="relative flex w-full touch-none items-center select-none"
	>
		{#snippet children({ thumbItems })}
			<span
				class="relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full bg-dark-10"
			>
				<Slider.Range class="absolute h-full bg-foreground" />
			</span>
			{#each thumbItems as { index } (index)}
				<Slider.Thumb
					{index}
					class={cn(
						"block size-[25px] cursor-pointer rounded-full border border-border-input bg-background shadow-sm transition-colors hover:border-dark-40 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-active:scale-[0.98] data-active:border-dark-40 dark:bg-foreground dark:shadow-card"
					)}
				/>
			{/each}
		{/snippet}
	</Slider.Root>
</div>
