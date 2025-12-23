<script lang="ts">
	import { Combobox } from "bits-ui";
	import Check from "phosphor-svelte/lib/Check";
	import X from "phosphor-svelte/lib/X";
	import CaretDoubleUp from "phosphor-svelte/lib/CaretDoubleUp";
	import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";

	const fruits = [
		{ value: "mango", label: "Mango" },
		{ value: "watermelon", label: "Watermelon" },
		{ value: "apple", label: "Apple" },
		{ value: "pineapple", label: "Pineapple" },
		{ value: "orange", label: "Orange" },
		{ value: "grape", label: "Grape" },
		{ value: "strawberry", label: "Strawberry" },
		{ value: "banana", label: "Banana" },
	];

	let searchValue = $state("");
	let value = $state<string[]>([]);

	const filteredFruits = $derived(
		searchValue === ""
			? fruits
			: fruits.filter((fruit) =>
					fruit.label.toLowerCase().includes(searchValue.toLowerCase())
				)
	);
	let containerRef = $state<HTMLDivElement | null>(null);
</script>

<Combobox.Root
	type="multiple"
	bind:value
	items={fruits}
	onValueChange={() => {
		searchValue = "";
	}}
	onOpenChangeComplete={(o) => {
		if (!o) searchValue = "";
	}}
>
	<Combobox.Chips
		bind:ref={containerRef}
		class="rounded-9px border-border-input bg-background data-[focus-within]:ring-foreground data-[focus-within]:ring-offset-background flex min-h-[42px] w-[320px] flex-wrap items-center gap-1.5 border p-2 transition-colors data-[focus-within]:ring-2 data-[focus-within]:ring-offset-2"
	>
		{#snippet children({ selectedItems })}
			{#each selectedItems as item (item.value)}
				<Combobox.Chip
					value={item.value}
					class="bg-muted text-foreground data-highlighted:ring-foreground data-highlighted:ring-2 flex items-center gap-1 rounded-md px-2 py-0.5 text-sm"
				>
					{#snippet children({ label })}
						<span>{label}</span>
						<Combobox.ChipRemove
							aria-label="Remove {label}"
							class="hover:bg-muted-foreground/20 rounded-sm p-0.5 transition-colors"
						>
							<X class="size-3" />
						</Combobox.ChipRemove>
					{/snippet}
				</Combobox.Chip>
			{/each}
			<Combobox.Input
				oninput={(e) => (searchValue = e.currentTarget.value)}
				class="placeholder:text-foreground-alt/50 focus:outline-hidden min-w-[100px] flex-1 bg-transparent text-base sm:text-sm"
				placeholder={selectedItems.length === 0 ? "Select fruits..." : "Add more..."}
				aria-label="Search fruits"
			/>
		{/snippet}
	</Combobox.Chips>
	<Combobox.Portal>
		<Combobox.Content
			class="focus-override border-muted bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-hidden z-50 max-h-[var(--bits-combobox-content-available-height)] w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)] select-none rounded-xl border px-1 py-3 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
			sideOffset={10}
			customAnchor={containerRef}
		>
			<Combobox.ScrollUpButton class="flex w-full items-center justify-center py-1">
				<CaretDoubleUp class="size-3" />
			</Combobox.ScrollUpButton>
			<Combobox.Viewport class="p-1">
				{#each filteredFruits as fruit, i (i + fruit.value)}
					<Combobox.Item
						class="rounded-button data-highlighted:bg-muted outline-hidden flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 text-sm capitalize"
						value={fruit.value}
						label={fruit.label}
					>
						{#snippet children({ selected })}
							{fruit.label}
							{#if selected}
								<div class="ml-auto">
									<Check />
								</div>
							{/if}
						{/snippet}
					</Combobox.Item>
				{:else}
					<span class="text-muted-foreground block px-5 py-2 text-sm">
						No results found, try again.
					</span>
				{/each}
			</Combobox.Viewport>
			<Combobox.ScrollDownButton class="flex w-full items-center justify-center py-1">
				<CaretDoubleDown class="size-3" />
			</Combobox.ScrollDownButton>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
