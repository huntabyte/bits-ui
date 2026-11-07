<script lang="ts">
	import { Switch } from "bits-ui";
	let { count, checked = false }: { count: number; checked?: boolean } = $props();
</script>

{#each { length: count }, i (i)}
	<Switch.Root {checked} name="s{i}" data-bench="item"><Switch.Thumb /></Switch.Root>
{/each}
