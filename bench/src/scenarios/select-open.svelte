<script lang="ts">
	import { Select } from "bits-ui";

	let {
		ctl,
		items,
	}: {
		ctl: { open: boolean; value: string };
		items: { value: string; label: string }[];
	} = $props();
</script>

<Select.Root type="single" bind:open={ctl.open} bind:value={ctl.value}>
	<Select.Trigger class="trigger" data-bench-trigger>
		{ctl.value === "" ? "open select" : ctl.value}
	</Select.Trigger>
	<Select.Portal>
		<Select.Content class="popup listbox" data-bench-content>
			{#each items as item (item.value)}
				<Select.Item class="item" value={item.value} label={item.label}>
					{item.label}
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Portal>
</Select.Root>
