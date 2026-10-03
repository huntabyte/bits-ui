<script lang="ts">
	import { Command } from "bits-ui";
	import type { ComponentProps } from "svelte";

	let { ...rest }: ComponentProps<typeof Command.Root> = $props();

	const statuses = ["Backlog", "Todo", "Done", "Canceled"];
	let selectedStatuses = $state<string[]>([]);
	let itemRenderKey = $state(0);

	function toggleStatus(status: string) {
		selectedStatuses = selectedStatuses.includes(status)
			? selectedStatuses.filter((value) => value !== status)
			: [...selectedStatuses, status];
		itemRenderKey++;
	}
</script>

<Command.Root {...rest} data-testid="root">
	<Command.Input data-testid="input" aria-label="Search" />
	<Command.List data-testid="list">
		<Command.Viewport data-testid="viewport">
			{#key itemRenderKey}
				{#each statuses as status (status)}
					<Command.Item
						value={status}
						data-testid={`item-${status.toLowerCase()}`}
						onSelect={() => toggleStatus(status)}
					>
						<span data-testid={`selected-${status.toLowerCase()}`}>
							{selectedStatuses.includes(status) ? "selected" : ""}
						</span>
						{status}
					</Command.Item>
				{/each}
			{/key}
		</Command.Viewport>
	</Command.List>
</Command.Root>
