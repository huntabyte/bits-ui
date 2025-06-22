<script lang="ts">
	import { Combobox, type WithoutChildrenOrChild, mergeProps } from "bits-ui";
	import ChevronUpDown from "phosphor-svelte/lib/CaretUpDown";
	type Item = { value: string; label: string };
	type Props = Combobox.RootProps & {
		items: Item[];
		inputProps?: WithoutChildrenOrChild<Combobox.InputProps>;
		contentProps?: WithoutChildrenOrChild<Combobox.ContentProps>;
	};
	let {
		items,
		value = $bindable(),
		open = $bindable(false),
		inputProps,
		contentProps,
		type,
		...restProps
	}: Props = $props();
	let searchValue = $state("");
	const filteredItems = $derived.by(() => {
		if (searchValue === "") return items;
		return items.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase()));
	});
	function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		searchValue = e.currentTarget.value;
	}
	function handleOpenChange(newOpen: boolean) {
		if (!newOpen) searchValue = "";
	}
	const mergedRootProps = $derived(mergeProps(restProps, { onOpenChange: handleOpenChange }));
	const mergedInputProps = $derived(mergeProps(inputProps, { oninput: handleInput }));

	let inputValue = $derived.by(() => {
		return items.find((item) => item.value === value)?.label;
	});
</script>

<Combobox.Root
	{inputValue}
	bind:value={value as never}
	bind:open
	{...mergedRootProps}
	{type}
	{items}
>
	<div class="relative">
		<Combobox.Input
			{...mergedInputProps}
			class="border-input bg-background placeholder:text-muted-foreground flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
		/>
		<Combobox.Trigger class="absolute end-3 top-1/2 size-6 -translate-y-1/2"
			><ChevronUpDown class="text-muted-foreground h-5 w-5" /></Combobox.Trigger
		>
	</div>
	<Combobox.Portal>
		<Combobox.Content
			{...contentProps}
			class="z-50  mt-2 w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)]  rounded-md border bg-white p-1 shadow-md outline-none"
		>
			{#each filteredItems as item (item.value)}
				<Combobox.Item
					value={item.value}
					label={item.label}
					class="relative flex w-full cursor-pointer select-none items-center rounded-sm p-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
				>
					{#snippet children({ selected })}
						<div class="flex w-full flex-col">
							<span class={selected ? "font-medium text-red-500" : ""}
								>{item.label}</span
							>
						</div>
					{/snippet}
				</Combobox.Item>
			{:else}
				<span> No results found </span>
			{/each}
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
