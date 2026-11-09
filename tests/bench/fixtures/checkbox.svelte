<script lang="ts">
	import { Checkbox } from "bits-ui";
	let { count, checked = false }: { count: number; checked?: boolean } = $props();
</script>

{#each { length: count }, i (i)}
	<Checkbox.Root {checked} name="c{i}" data-bench="item">
		{#snippet children({ checked })}{checked ? "x" : ""}{/snippet}
	</Checkbox.Root>
{/each}
