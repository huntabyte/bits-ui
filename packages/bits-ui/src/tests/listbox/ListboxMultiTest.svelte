<script lang="ts" module>
	import {
		Listbox,
		type ListboxMultipleRootProps,
		type WithoutChildren,
		type WithoutChildrenOrChild,
	} from "$lib/index.js";

	export type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	export type ListboxMultipleTestProps = WithoutChildren<ListboxMultipleRootProps> & {
		contentProps?: WithoutChildrenOrChild<Listbox.ContentProps>;
		portalProps?: WithoutChildrenOrChild<Listbox.PortalProps>;
		items: Item[];
		searchValue?: string;
	};
</script>

<script lang="ts">
	let {
		contentProps,
		portalProps,
		items = [],
		value = [],
		open = false,
		searchValue = "",
		...restProps
	}: ListboxMultipleTestProps = $props();

	const filteredItems = $derived(
		searchValue === ""
			? items
			: items.filter((item) => item.label.includes(searchValue.toLowerCase()))
	);

	const selectedLabels = $derived(
		filteredItems.filter((item) => value.includes(item.value)).map((item) => item.label)
	);
</script>

<main data-testid="main">
	<Listbox.Root bind:value bind:open {...restProps}>
		<Listbox.Trigger data-testid="trigger">
			{#if selectedLabels && selectedLabels.length}
				{selectedLabels.join(", ")}
			{:else}
				Open combobox
			{/if}
		</Listbox.Trigger>

		<Listbox.Portal {...portalProps}>
			<Listbox.Content data-testid="content" {...contentProps}>
				<Listbox.Group data-testid="group">
					<Listbox.GroupLabel data-testid="group-label">Options</Listbox.GroupLabel>
					{#each filteredItems as { value, label, disabled }}
						<Listbox.Item data-testid={value} {disabled} {value} {label}>
							{#snippet children({ selected })}
								{#if selected}
									<span data-testid="{value}-indicator">x</span>
								{/if}
								{label}
							{/snippet}
						</Listbox.Item>
					{/each}
				</Listbox.Group>
			</Listbox.Content>
		</Listbox.Portal>
	</Listbox.Root>
	<div data-testid="outside"></div>
	<button data-testid="open-binding" onclick={() => (open = !open)}>
		{open}
	</button>
	<button data-testid="value-binding" onclick={() => (value = [])}>
		{#if value.length === 0}
			empty
		{:else}
			{value}
		{/if}
	</button>
</main>
<div data-testid="portal-target" id="portal-target"></div>
