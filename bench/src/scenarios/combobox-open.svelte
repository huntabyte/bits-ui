<script lang="ts">
	import { Combobox } from "bits-ui";

	let {
		ctl,
		items,
	}: {
		ctl: { open: boolean; value: string };
		items: { value: string; label: string }[];
	} = $props();
</script>

<Combobox.Root type="single" bind:open={ctl.open} bind:value={ctl.value}>
	<Combobox.Input class="trigger" data-bench-trigger aria-label="bench combobox" />
	<Combobox.Portal>
		<Combobox.Content class="popup listbox" data-bench-content>
			{#each items as item (item.value)}
				<Combobox.Item class="item" value={item.value} label={item.label}>
					{item.label}
				</Combobox.Item>
			{/each}
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
