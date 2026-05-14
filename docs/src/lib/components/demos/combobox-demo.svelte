<script lang="ts">
	import { Combobox } from "bits-ui";
	import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
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
		{ value: "kiwi", label: "Kiwi" },
		{ value: "peach", label: "Peach" },
		{ value: "cherry", label: "Cherry" },
		{ value: "blueberry", label: "Blueberry" },
		{ value: "raspberry", label: "Raspberry" },
		{ value: "blackberry", label: "Blackberry" },
		{ value: "plum", label: "Plum" },
		{ value: "apricot", label: "Apricot" },
		{ value: "pear", label: "Pear" },
		{ value: "grapefruit", label: "Grapefruit" },
	];

	let value = $state<string[]>([]);
	let inputValue = $state("");
	let chipsRef = $state<HTMLElement | null>(null);

	const filteredFruits = $derived(
		inputValue === ""
			? fruits
			: fruits.filter((fruit) => fruit.label.toLowerCase().includes(inputValue.toLowerCase()))
	);
</script>

<Combobox.Root
	type="multiple"
	name="favoriteFruit"
	bind:value
	bind:inputValue
	items={fruits.map((f) => ({ value: f.value, label: f.label }))}
	onOpenChange={(open) => {
		if (!open) inputValue = "";
	}}
>
	<div class="relative">
		<Combobox.Chips
			bind:ref={chipsRef}
			class="border-border-input bg-background focus-within:ring-foreground focus-within:ring-offset-background flex min-h-10 w-[296px] flex-wrap items-center gap-1.5 rounded-[9px] border px-2 py-1.5 pe-10 focus-within:ring-2 focus-within:ring-offset-2"
		>
			{#each value as chipValue (chipValue)}
				<Combobox.Chip
					value={chipValue}
					class="bg-muted text-foreground flex items-center gap-1 rounded-md px-2 py-0.5 text-sm"
				>
					{#snippet children({ label })}
						<span>{label}</span>
						<Combobox.ChipRemoveButton
							class="text-muted-foreground hover:text-foreground flex size-4 items-center justify-center"
						>
							<X class="size-3" />
						</Combobox.ChipRemoveButton>
					{/snippet}
				</Combobox.Chip>
			{/each}
			<Combobox.Input
				class="placeholder:text-foreground-alt/50 min-w-[80px] flex-1 bg-transparent text-sm outline-none"
				placeholder={value.length === 0 ? "Search a fruit" : ""}
				aria-label="Search a fruit"
				clearInputOnSelect
				removeOnBackspace
			/>
		</Combobox.Chips>
		<Combobox.Trigger class="absolute end-3 top-1/2 size-6 -translate-y-1/2 touch-none">
			<CaretUpDown class="text-muted-foreground size-6" />
		</Combobox.Trigger>
	</div>
	<Combobox.Portal>
		<Combobox.Content
			customAnchor={chipsRef}
			class="focus-override border-muted bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-hidden z-50 h-96 max-h-[var(--bits-combobox-content-available-height)] w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)] select-none rounded-xl border px-1 py-3 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
			sideOffset={10}
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
					<span class="block px-5 py-2 text-sm text-muted-foreground">
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
