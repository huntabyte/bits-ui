<script lang="ts">
	import { Slider } from "$lib";

	type $$Props = Slider.Props;
	export let value = [20, 80];
</script>

<main>
	<Slider.Root data-testid="root" bind:value {...$$restProps} let:ticks>
		<span
			class="bg-primary/20 relative h-1.5 w-full grow overflow-hidden rounded-full"
		>
			<Slider.Range data-testid="range" class="bg-primary absolute h-full" />
		</span>
		{#each value as _, i}
			<Slider.Thumb
				aria-label="Volume"
				data-testid="thumb-{i}"
				class="border-primary/50 focus-visible:ring-ring block h-4 w-4 rounded-full border bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
			/>
		{/each}

		{#each { length: ticks } as _}
			<Slider.Tick data-testid="tick" />
		{/each}
	</Slider.Root>
</main>
