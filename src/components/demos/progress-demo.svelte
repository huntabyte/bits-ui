<script lang="ts">
	import { onMount } from "svelte";
	import { Progress } from "$lib";

	let value = 13;
	onMount(() => {
		const timer = setTimeout(() => (value = 66), 500);
		return () => clearTimeout(timer);
	});
</script>

<Progress.Root
	{value}
	max={100}
	class="relative h-6 w-[60%] overflow-hidden rounded-full bg-foreground/20 "
>
	<div
		class="h-full w-full flex-1 bg-foreground transition-all"
		style={`transform: translateX(-${
			100 - (100 * (value ?? 0)) / (100 ?? 1)
		}%)`}
	/>
</Progress.Root>
