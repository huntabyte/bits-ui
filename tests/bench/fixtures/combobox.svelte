<script lang="ts">
	import { Combobox } from "bits-ui";
	let {
		count,
		open = false,
		search = "",
	}: { count: number; open?: boolean; search?: string } = $props();
	const items = $derived(
		Array.from({ length: count }, (_, i) => ({ value: `${i}`, label: `Item ${i}` }))
	);
	const filtered = $derived(search ? items.filter((it) => it.label.includes(search)) : items);
</script>

<Combobox.Root type="single" bind:open {items}>
	<Combobox.Input data-bench="input" oninput={(e) => (search = e.currentTarget.value)} />
	<Combobox.Trigger>open</Combobox.Trigger>
	<Combobox.Portal>
		<Combobox.Content data-bench="content" style="max-height: 300px; overflow: auto">
			{#each filtered as item (item.value)}
				<Combobox.Item value={item.value} label={item.label} data-bench="item">
					{item.label}
				</Combobox.Item>
			{/each}
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
