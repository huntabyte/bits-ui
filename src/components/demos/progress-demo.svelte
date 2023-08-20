<script lang="ts">
	import { onMount } from "svelte";
	import * as Progress from "@/components/ui/progress";

	let value = 13;
	onMount(() => {
		const timer = setTimeout(() => (value = 66), 500);
		return () => clearTimeout(timer);
	});
</script>

<Progress.Root {value} max={100} class="w-[60%]" />
