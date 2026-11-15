<script lang="ts">
	import { Tooltip } from "bits-ui";

	const tether = Tooltip.createTether<string>();
	let label = $state("first");
	let others = $state(0);

	export function open() {
		tether.open("active");
	}
	export function setLabel(next: string) {
		label = next;
	}
	export function setOthers(count: number) {
		others = count;
	}
</script>

<Tooltip.Provider delayDuration={0}>
	<Tooltip.Trigger id="active" {tether} payload={label}>active</Tooltip.Trigger>
	{#each { length: others }, i (i)}
		<Tooltip.Trigger {tether} payload={`other ${i}`}>other {i}</Tooltip.Trigger>
	{/each}
	<Tooltip.Root {tether}>
		{#snippet children({ payload })}
			<Tooltip.Content forceMount={payload !== null}>
				<span data-testid="tether-content">{payload}</span>
			</Tooltip.Content>
		{/snippet}
	</Tooltip.Root>
</Tooltip.Provider>
