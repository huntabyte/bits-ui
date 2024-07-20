<script lang="ts" context="module">
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
		items: Item[];
		inputValue?: string;
	};
</script>

<script lang="ts">
	let {
		contentProps,
		portalProps,
		items,
		value = [],
		open,
		inputValue = "",
		onOpenChange,
		...restProps
	}: ComboboxMultipleTestProps = $props();

	const filteredItems = $derived(
		inputValue === ""
			? items
			: items.filter((item) => item.label.includes(inputValue.toLowerCase()))
	);
</script>

<main data-testid="main">
	<Combobox.Root
		bind:value
		bind:open
		{...restProps}
		onOpenChange={(v) => {
			onOpenChange?.(v);
			if (!v) inputValue = "";
		}}
	>
		<Combobox.Trigger data-testid="trigger">Open combobox</Combobox.Trigger>
		<Combobox.Input
			data-testid="input"
			aria-label="open combobox"
			oninput={(e) => (inputValue = e.currentTarget.value)}
			value={inputValue === "" ? undefined : inputValue}
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
	<button data-testid="input-binding" onclick={() => (inputValue = "")}>
		{#if inputValue === ""}
			empty
		{:else}
			{inputValue}
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
