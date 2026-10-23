<script lang="ts">
	import { Tooltip } from "bits-ui";
	let { count, openIndex = -1 }: { count: number; openIndex?: number } = $props();
</script>

<Tooltip.Provider>
	{#each { length: count }, i (i)}
		<Tooltip.Root open={openIndex === i}>
			<Tooltip.Trigger data-bench="trigger">trigger {i}</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Content data-bench="content">tip {i}<Tooltip.Arrow /></Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip.Root>
	{/each}
</Tooltip.Provider>
