<script lang="ts">
	import { Meter, useId } from "bits-ui";
	import type { ComponentProps } from "svelte";
	import DemoContainer from "../demo-container.svelte";

	let {
		max = 100,
		value = 0,
		min = 0,
		label,
		valueLabel,
	}: ComponentProps<typeof Meter.Root> & {
		label: string;
		valueLabel: string;
	} = $props();

	const labelId = useId();

	const usedPercentage = $derived((value / max) * 100);
	const percentageRemaining = $derived(100 - usedPercentage);
	const color = $derived.by(() => {
		if (percentageRemaining < 15) return "bg-red-500 dark:bg-red-400";
		if (percentageRemaining < 35) return "bg-orange-500 dark:bg-orange-400";
		if (percentageRemaining < 50) return "bg-yellow-500 dark:bg-yellow-400";
		return "bg-green-500 dark:bg-green-400";
	});
</script>

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<div class="flex w-[60%] flex-col gap-2">
		<div class="flex items-center justify-between text-sm font-medium">
			<span id={labelId}> {label} </span>
			<span>{valueLabel}</span>
		</div>
		<Meter.Root
			aria-labelledby={labelId}
			aria-valuetext={valueLabel}
			{value}
			{min}
			{max}
			class="bg-dark-10 shadow-mini-inset relative h-[15px] overflow-hidden rounded-full"
		>
			<div
				class="shadow-mini-inset h-full w-full flex-1 rounded-full transition-all duration-1000 ease-in-out {color}"
				style="transform: translateX(-{100 - (100 * (value ?? 0)) / max}%)"
			></div>
		</Meter.Root>
	</div>
</DemoContainer>
