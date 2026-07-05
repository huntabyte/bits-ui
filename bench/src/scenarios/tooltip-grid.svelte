<script lang="ts">
	import { Tooltip } from "bits-ui";

	let { count = 1000 }: { count?: number } = $props();

	const triggers = Array.from({ length: count }, (_, i) => i);
</script>

<Tooltip.Provider>
	<div class="trigger-grid">
		{#each triggers as i (i)}
			<Tooltip.Root>
				<Tooltip.Trigger class="trigger">t{i}</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content class="popup">Tooltip {i}</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		{/each}
	</div>
</Tooltip.Provider>
