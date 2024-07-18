<script lang="ts" context="module">
	import type { ListboxSingleRootProps } from "$lib/bits/listbox/types.js";
	import { Listbox } from "$lib/index.js";

	export type ListboxItemObj = {
		value: string;
		label: string;
		disabled: boolean;
	};

	export const defaultItems: ListboxItemObj[] = [
		{
			value: "1",
			label: "A",
			disabled: false,
		},
		{
			value: "2",
			label: "B",
			disabled: false,
		},
		{
			value: "3",
			label: "C",
			disabled: false,
		},
		{
			value: "4",
			label: "D",
			disabled: false,
		},
	];

	export type ListboxTestProps = Omit<ListboxSingleRootProps, "type"> & {
		items?: ListboxItemObj[];
	};
</script>

<script lang="ts">
	let { items = defaultItems, value: defaultValue, ...restProps }: ListboxTestProps = $props();

	let value = $state(defaultValue);
</script>

<div data-testid="value">
	{value}
</div>

<button tabindex="-1" data-testid="binding" onclick={() => (value = items[0]?.value ?? "")}>
	Binding
</button>

<Listbox.Root bind:value type="single" {...restProps}>
	<Listbox.Label data-testid="label">Label</Listbox.Label>
	<Listbox.Content data-testid="content">
		<Listbox.Group data-testid="group">
			<Listbox.GroupLabel data-testid="group-label">Options</Listbox.GroupLabel>
			{#each items as item}
				<Listbox.Item
					value={item.value}
					label={item.label}
					disabled={item.disabled}
					data-testid="item-{item.value}"
				>
					{item.label}
				</Listbox.Item>
			{/each}
		</Listbox.Group>
	</Listbox.Content>
</Listbox.Root>
