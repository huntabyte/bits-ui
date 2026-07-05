<script lang="ts">
	import { Select } from "bits-ui";

	let { count = 1000 }: { count?: number } = $props();

	const selects = Array.from({ length: count }, (_, i) => i);
	const items = Array.from({ length: 10 }, (_, i) => ({
		value: `item-${i}`,
		label: `Item ${i}`,
	}));
</script>

<div class="trigger-grid">
	{#each selects as i (i)}
		<Select.Root type="single">
			<Select.Trigger class="trigger">select {i}</Select.Trigger>
			<Select.Portal>
				<Select.Content class="popup listbox">
					{#each items as item (item.value)}
						<Select.Item class="item" value={item.value} label={item.label}>
							{item.label}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	{/each}
</div>
