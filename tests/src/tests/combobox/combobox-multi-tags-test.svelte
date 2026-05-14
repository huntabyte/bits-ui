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

	export type ComboboxMultiTagsTestProps = Omit<
		WithoutChildren<ComboboxMultipleRootProps>,
		"type"
	> & {
		contentProps?: WithoutChildrenOrChild<Combobox.ContentProps>;
		portalProps?: WithoutChildrenOrChild<Combobox.PortalProps>;
		inputProps?: WithoutChildrenOrChild<Combobox.InputProps>;
		items: Item[];
		onFormSubmit?: (fd: FormData) => void;
	};
</script>

<script lang="ts">
	let {
		contentProps,
		portalProps,
		items,
		value = $bindable([]),
		open = $bindable(false),
		inputValue = $bindable(""),
		inputProps,
		onOpenChange,
		onFormSubmit,
		...restProps
	}: ComboboxMultiTagsTestProps = $props();

	const filteredItems = $derived(
		inputValue === ""
			? items
			: items.filter((item) => item.label.toLowerCase().includes(inputValue.toLowerCase()))
	);
</script>

<main data-testid="main" class="flex flex-col gap-12">
	<form
		data-testid="form"
		method="POST"
		onsubmit={(e) => {
			e.preventDefault();
			const formData = new FormData(e.target as HTMLFormElement);
			onFormSubmit?.(formData);
		}}
	>
		<Combobox.Root
			bind:value
			bind:open
			bind:inputValue
			type="multiple"
			items={items.map((i) => ({ value: i.value, label: i.label }))}
			{...restProps}
			onOpenChange={(v) => {
				onOpenChange?.(v);
				if (!v) inputValue = "";
			}}
		>
			<Combobox.Tags data-testid="tags">
				{#each value as tagValue (tagValue)}
					<Combobox.Tag value={tagValue} data-testid="tag-{tagValue}">
						{#snippet children({ label })}
							<span data-testid="tag-label-{tagValue}">{label}</span>
							<Combobox.TagRemoveButton data-testid="tag-remove-{tagValue}">✕</Combobox.TagRemoveButton>
						{/snippet}
					</Combobox.Tag>
				{/each}
				<Combobox.Input
					data-testid="input"
					aria-label="open combobox"
					clearInputOnSelect
					removeOnBackspace
					{...inputProps}
				/>
			</Combobox.Tags>
			<Combobox.Trigger data-testid="trigger">Open combobox</Combobox.Trigger>
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
		<div data-testid="outside" style="bottom: 0px; right: 10px; position: absolute;">
			outside
		</div>
		<button type="button" data-testid="open-binding" onclick={() => (open = !open)}>
			{open}
		</button>
		<button type="button" data-testid="value-binding" onclick={() => (value = [])}>
			{#if value.length === 0}
				empty
			{:else}
				{value}
			{/if}
		</button>
		<button data-testid="submit" type="submit">Submit</button>
	</form>
</main>
<div data-testid="portal-target" id="portal-target"></div>
