<script lang="ts">
	import { Tooltip } from "bits-ui";

	const tether = Tooltip.createTether<{ label: string }>();
	// non-reactive source, cleared before the trigger unmounts (e.g. an external store)
	const labels = new Map([["trigger", "Item"]]);
	let show = $state(true);

	function readPayload(_show: boolean) {
		const label = labels.get("trigger");
		if (label === undefined) throw new Error("payload read after its source was torn down");
		return { label };
	}
</script>

<Tooltip.Provider>
	{#if show}
		<Tooltip.Trigger id="trigger" data-testid="trigger" {tether} payload={readPayload(show)}>
			Trigger
		</Tooltip.Trigger>
	{/if}
	<Tooltip.Root {tether}>
		<Tooltip.Portal>
			<Tooltip.Content data-testid="content">content</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>
<button
	data-testid="remove"
	onclick={() => {
		labels.clear();
		show = false;
	}}
>
	remove
</button>
