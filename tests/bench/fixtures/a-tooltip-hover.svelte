<script lang="ts">
	import { Tooltip } from "bits-ui";
	let { count }: { count: number } = $props();
</script>

<Tooltip.Provider delayDuration={0}>
	{#each { length: count }, i (i)}
		<Tooltip.Root>
			<Tooltip.Trigger data-bench="trigger">trigger {i}</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Content data-bench="content">tip {i}</Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip.Root>
	{/each}
</Tooltip.Provider>
