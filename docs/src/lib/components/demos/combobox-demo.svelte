<script lang="ts">
	import { Combobox } from "bits-ui";
	import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
	import Check from "phosphor-svelte/lib/Check";
	import OrangeSlice from "phosphor-svelte/lib/OrangeSlice";
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

	let searchValue = $state("");

	const filteredFruits = $derived(
		searchValue === ""
			? fruits
			: fruits.filter((fruit) =>
					fruit.label.toLowerCase().includes(searchValue.toLowerCase())
				)
	);
</script>

<Combobox.Root
	type="multiple"
	name="favoriteFruit"
	onOpenChangeComplete={(o) => {
		if (!o) searchValue = "";
	}}
>
	<div class="relative">
		<OrangeSlice
			class="absolute start-3 top-1/2 size-6 -translate-y-1/2 text-muted-foreground"
		/>
		<Combobox.Input
			oninput={(e) => (searchValue = e.currentTarget.value)}
			class="inline-flex h-input w-[296px] touch-none truncate rounded-9px border border-border-input bg-background px-11 text-base transition-colors placeholder:text-foreground-alt/50 focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background focus:outline-hidden sm:text-sm"
			placeholder="Search a fruit"
			aria-label="Search a fruit"
		/>
		<Combobox.Trigger class="absolute end-3 top-1/2 size-6 -translate-y-1/2 touch-none">
			<CaretUpDown class="size-6 text-muted-foreground" />
		</Combobox.Trigger>
	</div>
	<Combobox.Portal>
		<Combobox.Content
			class="focus-override z-50 h-96 max-h-[var(--bits-combobox-content-available-height)] w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)] rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-hidden select-none data-[side=bottom]:translate-y-1 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:-translate-x-1 data-[side=left]:slide-in-from-right-2 data-[side=right]:translate-x-1 data-[side=right]:slide-in-from-left-2 data-[side=top]:-translate-y-1 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
			sideOffset={10}
		>
			<Combobox.ScrollUpButton class="flex w-full items-center justify-center py-1">
				<CaretDoubleUp class="size-3" />
			</Combobox.ScrollUpButton>
			<Combobox.Viewport class="p-1">
				{#each filteredFruits as fruit, i (i + fruit.value)}
					<Combobox.Item
						class="flex h-10 w-full items-center rounded-button py-3 pr-1.5 pl-5 text-sm capitalize outline-hidden select-none data-highlighted:bg-muted"
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
