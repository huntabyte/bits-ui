<script lang="ts" module>
	import {
		Combobox,
		type ComboboxMultipleRootProps,
		type WithoutChildren,
		type WithoutChildrenOrChild,
	} from "$lib/index.js";

	export type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	export type ComboboxMultipleTestProps = WithoutChildren<ComboboxMultipleRootProps> & {
		contentProps?: WithoutChildrenOrChild<Combobox.ContentProps>;
		portalProps?: WithoutChildrenOrChild<Combobox.PortalProps>;
		inputProps?: WithoutChildrenOrChild<Combobox.InputProps>;
		items: Item[];
		searchValue?: string;
	};
</script>

<script lang="ts">
	let {
		contentProps,
		portalProps,
		items,
		value = [],
		open = false,
		searchValue = "",
		inputProps,
		onOpenChange,
		...restProps
	}: ComboboxMultipleTestProps = $props();

	const filteredItems = $derived(
		searchValue === ""
			? items
			: items.filter((item) => item.label.includes(searchValue.toLowerCase()))
	);
</script>

<main data-testid="main">
	<Combobox.Root
		bind:value
		bind:open
		{...restProps}
		onOpenChange={(v) => {
			onOpenChange?.(v);
			if (!v) searchValue = "";
		}}
	>
		<Combobox.Trigger data-testid="trigger">Open combobox</Combobox.Trigger>
		<Combobox.Input
			data-testid="input"
			aria-label="open combobox"
			oninput={(e) => (searchValue = e.currentTarget.value)}
			{...inputProps}
		/>
		<Combobox.Portal {...portalProps}>
			<Combobox.Content data-testid="content" {...contentProps}>
				<Combobox.Group data-testid="group">
					<Combobox.GroupLabel data-testid="group-label">Options</Combobox.GroupLabel>
					{#each filteredItems as { value, label, disabled }}
						<Combobox.Item data-testid={value} {disabled} {value} {label}>
							{#snippet children({ selected })}
								{#if selected}
									<span data-testid="{value}-indicator">x</span>
								{/if}
								{label}
							{/snippet}
						</Combobox.Item>
					{/each}
				</Combobox.Group>
			</Combobox.Content>
		</Combobox.Portal>
	</Combobox.Root>
	<div data-testid="outside"></div>
	<button data-testid="input-binding" onclick={() => (searchValue = "")}>
		{#if searchValue === ""}
			empty
		{:else}
			{searchValue}
		{/if}
	</button>
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
