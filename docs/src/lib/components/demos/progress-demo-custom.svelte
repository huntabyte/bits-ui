<script lang="ts">
	import { Progress, useId } from "bits-ui";
	import type { ComponentProps } from "svelte";
	import DemoContainer from "../demo-container.svelte";

	let {
		max = 100,
		value = 0,
		min = 0,
		label,
		valueLabel,
	}: ComponentProps<typeof Progress.Root> & {
		label: string;
		valueLabel: string;
	} = $props();

	const labelId = useId();
</script>

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<div class="flex w-[60%] flex-col gap-2">
		<div class="flex items-center justify-between text-sm font-medium">
			<span id={labelId}> {label} </span>
			<span>{valueLabel}</span>
		</div>
		<Progress.Root
			aria-labelledby={labelId}
			aria-valuetext={valueLabel}
			{value}
			{min}
			{max}
			class="bg-dark-10 shadow-mini-inset relative h-[15px] overflow-hidden rounded-full"
		>
			<div
				class="bg-foreground shadow-mini-inset h-full w-full flex-1 rounded-full transition-all duration-1000 ease-in-out"
				style={`transform: translateX(-${100 - (100 * (value ?? 0)) / max}%)`}
			></div>
		</Progress.Root>
	</div>
</DemoContainer>
