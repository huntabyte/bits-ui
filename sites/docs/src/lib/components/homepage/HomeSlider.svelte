<script lang="ts">
	import { Slider } from "bits-ui";
	import { cn } from "$lib/utils/styles.js";

	export let value = [5];
</script>

<div class="w-full">
	<Slider.Root
		bind:value
		onValueChange={(v) => {
			value = v;
		}}
		class="relative flex w-full touch-none select-none items-center shadow-mini-inset"
	>
		{#snippet children({ thumbs })}
			<span class="relative h-2 w-full grow overflow-hidden rounded-full bg-dark/10">
				<Slider.Range class="absolute h-full bg-dark " />
			</span>
			{#each thumbs as index}
				<Slider.Thumb
					{index}
					class={cn(
						"block size-[25px] cursor-pointer rounded-full bg-background shadow-mini transition-colors hover:border-dark-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 active:scale-98 disabled:pointer-events-none disabled:opacity-50 dark:bg-foreground dark:shadow-card"
					)}
				/>
			{/each}
		{/snippet}
	</Slider.Root>
</div>

<style>
</style>
