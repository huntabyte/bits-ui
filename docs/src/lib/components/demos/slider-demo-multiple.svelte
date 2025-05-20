<script lang="ts">
	import { Slider } from "bits-ui";
	import { cn } from "$lib/utils/styles.js";

	let value = $state([25, 75]);
</script>

<div class="w-full md:max-w-[280px]">
	<Slider.Root
		type="multiple"
		bind:value
		class="relative flex w-full touch-none select-none items-center"
	>
		{#snippet children({ thumbs })}
			<span
				class="bg-dark-10 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
			>
				<Slider.Range class="bg-foreground absolute h-full" />
			</span>
			{#each thumbs as index}
				<Slider.Thumb
					{index}
					class={cn(
						"border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card focus-visible:outline-hidden data-active:scale-[0.98] data-active:border-dark-40 block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					)}
				/>
			{/each}
		{/snippet}
	</Slider.Root>
</div>
