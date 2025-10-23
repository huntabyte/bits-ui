<script lang="ts">
	import { Progress } from "bits-ui";
	import { onMount } from "svelte";
	import { cubicInOut } from "svelte/easing";
	import { Tween } from "svelte/motion";

	const tween = new Tween(13, { duration: 1000, easing: cubicInOut });
	const labelId = $props.id();

	onMount(() => {
		const timer = setTimeout(() => tween.set(66), 500);
		return () => {
			clearTimeout(timer);
		};
	});
</script>

<div class="flex w-[60%] flex-col gap-2">
	<div class="flex items-center justify-between text-sm font-medium">
		<span id={labelId}> Uploading file... </span>
		<span>{Math.round(tween.current)}%</span>
	</div>
	<Progress.Root
		aria-labelledby={labelId}
		value={Math.round(tween.current)}
		max={100}
		class="bg-dark-10 shadow-mini-inset relative h-[15px] w-full overflow-hidden rounded-full"
	>
		<div
			class="bg-foreground shadow-mini-inset h-full w-full flex-1 rounded-full"
			style={`transform: translateX(-${100 - (100 * (tween.current ?? 0)) / 100}%)`}
		></div>
	</Progress.Root>
</div>
