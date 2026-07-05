<script lang="ts">
	import { DropdownMenu } from "bits-ui";

	let {
		ctl,
		items,
	}: {
		ctl: { open: boolean };
		items: { value: string; label: string }[];
	} = $props();
</script>

<DropdownMenu.Root bind:open={ctl.open}>
	<DropdownMenu.Trigger class="trigger" data-bench-trigger>open menu</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content class="popup listbox" data-bench-content>
			{#each items as item (item.value)}
				<DropdownMenu.Item class="item">
					{item.label}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
