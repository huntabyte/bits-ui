<script lang="ts">
	import { PinInput } from "bits-ui";
	let { count, value = "" }: { count: number; value?: string } = $props();
</script>

{#each { length: count }, i (i)}
	<PinInput.Root {value} maxlength={6}>
		{#snippet children({ cells })}
			{#each cells as cell, c (c)}
				<PinInput.Cell {cell}>{cell.char}</PinInput.Cell>
			{/each}
		{/snippet}
	</PinInput.Root>
{/each}
