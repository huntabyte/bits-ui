<script lang="ts">
	import { Slider } from "bits-ui";
	import { cn } from "#lib/utils/styles.js";

	let { value = $bindable(5) }: { value: number } = $props();
</script>

<div class="w-full">
	<Slider.Root
		type="single"
		{value}
		onValueCommit={(v) => (value = v)}
		class="relative flex w-full touch-none items-center rounded-full shadow-mini-inset select-none dark:bg-[rgba(244,244,245,0.1)] dark:shadow-[0px_0.7px_0px_0px_rgba(0,_0,_0,_0.04)_inset]"
	>
		{#snippet children({ thumbItems })}
			<span
				class="relative h-[6px] w-full grow overflow-hidden rounded-full bg-dark/10 lg:h-2"
			>
				<Slider.Range class="absolute h-full bg-dark dark:bg-[#18181B]" />
			</span>
			{#each thumbItems as { index } (index)}
				<Slider.Thumb
					{index}
					class={cn(
						"dark:shadow-[0px_0.7px_0px_0.7px_rgba(0,_0,_0,_0.04);] block size-[18px] cursor-pointer rounded-full bg-background shadow-mini transition-colors hover:border-dark-40 focus-visible:outline-hidden  active:scale-[0.98] lg:size-[25px] dark:bg-foreground"
					)}
					aria-label="Speed"
				/>
			{/each}
		{/snippet}
	</Slider.Root>
</div>
