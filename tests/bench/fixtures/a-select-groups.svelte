<script lang="ts">
	import { Select } from "bits-ui";
	let {
		groups,
		perGroup,
		open = false,
	}: { groups: number; perGroup: number; open?: boolean } = $props();
	const data = $derived(
		Array.from({ length: groups }, (_, g) => ({
			label: `Group ${g}`,
			items: Array.from({ length: perGroup }, (_, i) => ({
				value: `${g}-${i}`,
				label: `Item ${g}-${i}`,
			})),
		}))
	);
	const items = $derived(data.flatMap((g) => g.items));
</script>

<Select.Root type="single" bind:open {items}>
	<Select.Trigger data-bench="trigger">open</Select.Trigger>
	<Select.Portal>
		<Select.Content data-bench="content" style="max-height: 300px">
			<Select.Viewport>
				{#each data as group (group.label)}
					<Select.Group>
						<Select.GroupHeading>{group.label}</Select.GroupHeading>
						{#each group.items as item (item.value)}
							<Select.Item value={item.value} label={item.label} data-bench="item">
								{item.label}
							</Select.Item>
						{/each}
					</Select.Group>
				{/each}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
