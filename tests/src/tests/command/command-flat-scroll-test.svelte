<script lang="ts">
	import { Command } from "bits-ui";
	const items = Array.from({ length: 10 }, (_, i) => `Item ${i}`);
</script>

<Command.Root data-testid="root">
	<Command.Input data-testid="input" aria-label="Search" />
	<Command.List>
		<Command.Viewport data-testid="viewport" style="max-height: 120px; overflow-y: auto;">
			{#each items as item (item)}
				<Command.Item style="height: 40px;">{item}</Command.Item>
			{/each}
		</Command.Viewport>
	</Command.List>
</Command.Root>
