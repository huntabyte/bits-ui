<script lang="ts" module>
	import {
		Select,
		type SelectMultipleRootProps,
		type WithoutChildren,
		type WithoutChildrenOrChild,
	} from "bits-ui";

	export type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	export type SelectMultipleTestProps = WithoutChildren<SelectMultipleRootProps> & {
		contentProps?: WithoutChildrenOrChild<Select.ContentProps>;
		portalProps?: WithoutChildrenOrChild<Select.PortalProps>;
		items: Item[];
		searchValue?: string;
		onSelectedLabelChange?: (value: string) => void;
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
		onSelectedLabelChange,
		...restProps
	}: SelectMultipleTestProps = $props();

	const filteredItems = $derived(
		searchValue === ""
			? items
			: items.filter((item) => item.label.includes(searchValue.toLowerCase()))
	);

	const selectedLabels = $derived(
		filteredItems.filter((item) => value.includes(item.value)).map((item) => item.label)
	);

	const selectedLabel = $derived(
		selectedLabels.length > 0 ? selectedLabels.join(", ") : "Open combobox"
	);

	$effect(() => {
		onSelectedLabelChange?.(selectedLabel);
	});
</script>

<main data-testid="main">
	<Select.Root bind:value bind:open {...restProps} type="multiple">
		<Select.Trigger data-testid="trigger">
			{selectedLabel}
		</Select.Trigger>

		<Select.Portal {...portalProps}>
			<Select.Content data-testid="content" {...contentProps}>
				<Select.Group data-testid="group">
					<Select.GroupHeading data-testid="group-label">Options</Select.GroupHeading>
					{#each filteredItems as { value, label, disabled }}
						<Select.Item data-testid={value} {disabled} {value} {label}>
							{#snippet children({ selected, highlighted: _highlighted })}
								{#if selected}
									<span data-testid="{value}-indicator">x</span>
								{/if}
								{label}
							{/snippet}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Portal>
	</Select.Root>
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
