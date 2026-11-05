<script lang="ts">
	import { Tooltip } from "bits-ui";

	let {
		count = 50,
		delayDuration = 0,
		skipDelayDuration = 300,
		disableHoverableContent = false,
	}: {
		count?: number;
		delayDuration?: number;
		skipDelayDuration?: number;
		disableHoverableContent?: boolean;
	} = $props();
	const items = Array.from({ length: count }, (_, i) => i);
</script>

<Tooltip.Provider {delayDuration} {skipDelayDuration} {disableHoverableContent}>
	{#each items as item, index (index)}
		<Tooltip.Root>
			<Tooltip.Trigger data-testid={`trigger-${item}`}>trigger-{item}</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Content data-testid={`content-${item}`}>content-{item}</Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip.Root>
	{/each}
</Tooltip.Provider>
