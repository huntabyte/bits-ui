<script lang="ts">
	import { Progress, useId } from "bits-ui";
	import { onMount } from "svelte";

	let value = $state(13);
	const labelId = useId();

	onMount(() => {
		const timer = setTimeout(() => (value = 66), 500);
		return () => clearTimeout(timer);
	});
</script>

<div class="flex w-[60%] flex-col gap-2">
	<div class="flex items-center justify-between text-sm font-medium">
		<span id={labelId}> Uploading file... </span>
		<span>{value}%</span>
	</div>
	<Progress.Root
		aria-labelledby={labelId}
		{value}
		max={100}
		class="bg-dark-10 shadow-mini-inset relative h-[15px] w-full overflow-hidden rounded-full"
	>
		<div
			class="bg-foreground shadow-mini-inset h-full w-full flex-1 rounded-full transition-all duration-1000 ease-in-out"
			style={`transform: translateX(-${100 - (100 * (value ?? 0)) / 100}%)`}
		></div>
	</Progress.Root>
</div>
