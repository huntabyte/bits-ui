<script lang="ts">
	import { Toggle } from "bits-ui";
	let { count, pressed = false }: { count: number; pressed?: boolean } = $props();
</script>

{#each { length: count }, i (i)}
	<Toggle.Root {pressed} data-bench="item">t</Toggle.Root>
{/each}
