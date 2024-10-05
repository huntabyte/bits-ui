<script lang="ts" module>
	import {
		Listbox,
		type ListboxSingleRootProps,
		type WithoutChildren,
		type WithoutChildrenOrChild,
	} from "bits-ui";
	export type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	export type ListboxForceMountTestProps = WithoutChildren<ListboxSingleRootProps> & {
		contentProps?: WithoutChildrenOrChild<Listbox.ContentProps>;
		portalProps?: WithoutChildrenOrChild<Listbox.PortalProps>;
		items: Item[];
		searchValue?: string;
		withOpenCheck?: boolean;
	};
</script>

<script lang="ts">
	let {
		contentProps,
		portalProps,
		items,
		value = "",
		open = false,
		searchValue = "",
		withOpenCheck = false,
		...restProps
	}: ListboxForceMountTestProps = $props();

	const filteredItems = $derived(
		searchValue === ""
			? items
			: items.filter((item) => item.label.includes(searchValue.toLowerCase()))
	);

	const selectedLabel = $derived(filteredItems.find((item) => item.value === value)?.label);
</script>

<main data-testid="main">
	<Listbox.Root bind:value bind:open {...restProps}>
		<Listbox.Trigger data-testid="trigger">
			{#if selectedLabel}
				{selectedLabel}
			{:else}
				Open combobox
			{/if}
		</Listbox.Trigger>
		<Listbox.Portal {...portalProps}>
			{#if withOpenCheck}
				<Listbox.Content data-testid="content" {...contentProps} forceMount>
					{#snippet child({ props, open })}
						{#if open}
							<div {...props}>
								<Listbox.Group data-testid="group">
									<Listbox.GroupHeading data-testid="group-label"
										>Options</Listbox.GroupHeading
									>
									{#each filteredItems as { value, label, disabled }}
										<Listbox.Item
											data-testid={value}
											{disabled}
											{value}
											{label}
										>
											{#snippet children({ selected })}
												{#if selected}
													<span data-testid="{value}-indicator">x</span>
												{/if}
												{label}
											{/snippet}
										</Listbox.Item>
									{/each}
								</Listbox.Group>
							</div>
						{/if}
					{/snippet}
				</Listbox.Content>
			{:else}
				<Listbox.Content data-testid="content" {...contentProps} forceMount>
					{#snippet child({ props })}
						<div {...props}>
							<Listbox.Group data-testid="group">
								<Listbox.GroupHeading data-testid="group-label"
									>Options</Listbox.GroupHeading
								>
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
						</div>
					{/snippet}
				</Listbox.Content>
			{/if}
		</Listbox.Portal>
	</Listbox.Root>
	<div data-testid="outside"></div>
	<button data-testid="open-binding" onclick={() => (open = !open)}>
		{open}
	</button>
	<button data-testid="value-binding" onclick={() => (value = "")}>
		{#if value === ""}
			empty
		{:else}
			{value}
		{/if}
	</button>
</main>
<div data-testid="portal-target" id="portal-target"></div>
