<script lang="ts">
	import { Tooltip } from "bits-ui";
	let { count, triggerId = null }: { count: number; triggerId?: string | null } = $props();
	const tether = Tooltip.createTether<{ label: string }>();
	let open = $derived(triggerId !== null);
</script>

<Tooltip.Provider delayDuration={0}>
	{#each { length: count }, i (i)}
		<Tooltip.Trigger id={`t${i}`} data-bench="trigger" {tether} payload={{ label: `tip ${i}` }}>
			trigger {i}
		</Tooltip.Trigger>
	{/each}
	<Tooltip.Root {tether} {open} {triggerId}>
		{#snippet children({ payload })}
			<Tooltip.Portal>
				<Tooltip.Content data-bench="content">{payload?.label}</Tooltip.Content>
			</Tooltip.Portal>
		{/snippet}
	</Tooltip.Root>
</Tooltip.Provider>
