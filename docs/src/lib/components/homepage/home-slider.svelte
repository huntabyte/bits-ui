<script lang="ts">
	import { Slider } from "bits-ui";
	import { cn } from "$lib/utils/styles.js";

	let { value = $bindable(5) }: { value: number } = $props();
</script>

<div class="w-full">
	<Slider.Root
		type="single"
		{value}
		onValueCommit={(v) => (value = v)}
		class="shadow-mini-inset relative flex w-full touch-none select-none items-center rounded-full dark:bg-[rgba(244,244,245,0.1)] dark:shadow-[0px_0.7px_0px_0px_rgba(0,_0,_0,_0.04)_inset]"
	>
		{#snippet children({ thumbItems })}
			<span
				class="bg-dark/10 relative h-[6px] w-full grow overflow-hidden rounded-full lg:h-2"
			>
				<Slider.Range class="bg-dark absolute h-full dark:bg-[#18181B]" />
			</span>
			{#each thumbItems as { index } (index)}
				<Slider.Thumb
					{index}
					class={cn(
						"bg-background shadow-mini hover:border-dark-40 dark:bg-foreground focus-visible:outline-hidden block size-[18px] cursor-pointer rounded-full transition-colors  active:scale-[0.98] lg:size-[25px] dark:shadow-[0px_0.7px_0px_0.7px_rgba(0,_0,_0,_0.04);]"
					)}
					aria-label="Speed"
				/>
			{/each}
		{/snippet}
	</Slider.Root>
</div>
