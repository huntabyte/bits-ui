<script lang="ts">
	import { Progress } from "bits-ui";
	import { onMount } from "svelte";

	let value = $state(13);

	onMount(() => {
		const timer = setTimeout(() => (value = 66), 500);
		return () => clearTimeout(timer);
	});
</script>

<Progress.Root
	{value}
	max={100}
	class="bg-dark-10 shadow-mini-inset relative h-[15px] w-[60%] overflow-hidden rounded-full"
>
	<div
		class="bg-foreground shadow-mini-inset h-full w-full flex-1 rounded-full transition-all duration-1000 ease-in-out"
		style={`transform: translateX(-${100 - (100 * (value ?? 0)) / 100}%)`}
	></div>
</Progress.Root>
