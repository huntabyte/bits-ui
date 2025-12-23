<script lang="ts" module>
	import {
		Combobox,
		type ComboboxMultipleRootProps,
		type WithoutChildren,
		type WithoutChildrenOrChild,
	} from "bits-ui";

	export type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	export type ComboboxChipsTestProps = Omit<
		WithoutChildren<ComboboxMultipleRootProps>,
		"type"
	> & {
		contentProps?: WithoutChildrenOrChild<Combobox.ContentProps>;
		portalProps?: WithoutChildrenOrChild<Combobox.PortalProps>;
		inputProps?: WithoutChildrenOrChild<Combobox.InputProps>;
		chipsProps?: WithoutChildrenOrChild<Combobox.ChipsProps>;
		items: Item[];
		searchValue?: string;
	};
</script>

<script lang="ts">
	let {
		contentProps,
		portalProps,
		chipsProps,
		items,
		value = $bindable([]),
		open = $bindable(false),
		searchValue = $bindable(""),
		inputProps,
		onOpenChange,
		...restProps
	}: ComboboxChipsTestProps = $props();

	const filteredItems = $derived(
		searchValue === ""
			? items
			: items.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase()))
	);
</script>

<main data-testid="main" class="flex flex-col gap-12">
	<Combobox.Root
		bind:value
		bind:open
		type="multiple"
		{items}
		{...restProps}
		onValueChange={() => {
			searchValue = "";
		}}
		onOpenChange={(v) => {
			onOpenChange?.(v);
			if (!v) searchValue = "";
		}}
	>
		<Combobox.Chips data-testid="chips-container" {...chipsProps}>
			{#snippet children({ selectedItems })}
				{#each selectedItems as item (item.value)}
					<Combobox.Chip data-testid="chip-{item.value}" value={item.value}>
						{#snippet children({ label })}
							<span data-testid="chip-label-{item.value}">{label}</span>
							<Combobox.ChipRemove
								data-testid="chip-remove-{item.value}"
								aria-label="Remove {label}"
							>
								×
							</Combobox.ChipRemove>
						{/snippet}
					</Combobox.Chip>
				{/each}
				<Combobox.Input
					data-testid="input"
					placeholder="Search..."
					aria-label="open combobox"
					oninput={(e) => (searchValue = e.currentTarget.value)}
					{...inputProps}
				/>
			{/snippet}
		</Combobox.Chips>
		<Combobox.Portal {...portalProps}>
			<Combobox.Content data-testid="content" {...contentProps}>
				<Combobox.Group data-testid="group">
					<Combobox.GroupHeading data-testid="group-label">Options</Combobox.GroupHeading>
					{#each filteredItems as { value: itemValue, label, disabled } (itemValue)}
						<Combobox.Item data-testid={itemValue} {disabled} value={itemValue} {label}>
							{#snippet children({ selected })}
								{#if selected}
									<span data-testid="{itemValue}-indicator">✓</span>
								{/if}
								{label}
							{/snippet}
						</Combobox.Item>
					{/each}
				</Combobox.Group>
			</Combobox.Content>
		</Combobox.Portal>
	</Combobox.Root>
	<div data-testid="outside" style="bottom: 0px; right: 10px; position: absolute;">outside</div>
	<button type="button" data-testid="value-binding" onclick={() => (value = [])}>
		{#if value.length === 0}
			empty
		{:else}
			{value.join(",")}
		{/if}
	</button>
	<div data-testid="focus-before">Focus Before</div>
</main>
<div data-testid="portal-target" id="portal-target"></div>
