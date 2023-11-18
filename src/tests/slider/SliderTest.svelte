<script lang="ts">
	import { Slider } from "$lib";

	type $$Props = Slider.Props;
	export let value: $$Props["value"] = [30];
	export let min = 0;
	export let max = 100;
	export let step = 1;
	export let resetMin: number | undefined = undefined;
	export let resetMax: number | undefined = undefined;
	export let resetStep: number | undefined = undefined;

	$: if (resetMin) {
		min = resetMin;
	}

	$: if (resetMax) {
		max = resetMax;
	}

	$: if (resetStep) {
		step = resetStep;
	}
</script>

<main>
	<Slider.Root
		data-testid="root"
		bind:value
		{...$$restProps}
		let:ticks
		{min}
		{max}
		{step}
	>
		<span
			class="bg-primary/20 relative h-1.5 w-full grow overflow-hidden rounded-full"
		>
			<Slider.Range data-testid="range" class="bg-primary absolute h-full" />
		</span>
		<Slider.Thumb
			aria-label="age"
			data-testid="thumb"
			class="border-primary/50 focus-visible:ring-ring block h-4 w-4 rounded-full border bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
		/>

		{#each { length: ticks } as _}
			<Slider.Tick data-testid="tick" />
		{/each}
	</Slider.Root>
</main>
