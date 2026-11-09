<script lang="ts">
	import { PinInput } from "bits-ui";
	let { count }: { count: number } = $props();
	const pasteTransformer = (value: string) => value.replaceAll("-", "");
</script>

{#each { length: count }, i (i)}
	<PinInput.Root maxlength={6} {pasteTransformer} data-bench="pin">
		{#snippet children({ cells })}
			{#each cells as cell, index (index)}
				<PinInput.Cell {cell} data-bench="cell">{cell.char}</PinInput.Cell>
			{/each}
		{/snippet}
	</PinInput.Root>
{/each}
