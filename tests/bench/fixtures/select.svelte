<script lang="ts">
	import { Select } from "bits-ui";
	let { count, open = false, value = "" }: { count: number; open?: boolean; value?: string } =
		$props();
	const items = $derived(Array.from({ length: count }, (_, i) => ({ value: `${i}`, label: `Item ${i}` })));
</script>

<Select.Root type="single" bind:open bind:value {items}>
	<Select.Trigger data-bench="trigger">open</Select.Trigger>
	<Select.Portal>
		<Select.Content data-bench="content" style="max-height: 300px">
			<Select.Viewport>
				{#each items as item (item.value)}
					<Select.Item value={item.value} label={item.label} data-bench="item">
						{#snippet children({ selected })}{selected ? "✓" : ""}{item.label}{/snippet}
					</Select.Item>
				{/each}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
