<script lang="ts">
	import { Combobox } from "bits-ui";
	import { CaretUpDown, Check, OrangeSlice } from "$icons/index.js";

	const fruits = [
		{ value: "mango", label: "Mango" },
		{ value: "watermelon", label: "Watermelon" },
		{ value: "apple", label: "Apple" },
		{ value: "pineapple", label: "Pineapple" },
		{ value: "orange", label: "Orange" },
	];

	let inputValue = $state("");

	const filteredFruits = $derived(
		inputValue === ""
			? fruits
			: fruits.filter((fruit) => fruit.value.includes(inputValue.toLowerCase()))
	);
</script>

<Combobox.Root
	type="multiple"
	name="favoriteFruit"
	onOpenChange={(o) => {
		if (!o) inputValue = "";
	}}
>
	<div class="relative">
		<OrangeSlice
			class="absolute start-3 top-1/2 size-6 -translate-y-1/2 text-muted-foreground"
		/>
		<Combobox.Input
			oninput={(e) => (inputValue = e.currentTarget.value)}
			class="inline-flex h-input w-[296px] truncate rounded-9px border border-border-input bg-background px-11 text-sm transition-colors placeholder:text-foreground-alt/50 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
			placeholder="Search a fruit"
			aria-label="Search a fruit"
		/>
		<Combobox.Trigger>
			<CaretUpDown
				class="absolute end-3 top-1/2 size-6 -translate-y-1/2 text-muted-foreground"
			/>
		</Combobox.Trigger>
	</div>

	<Combobox.Content
		class="w-[var(--bits-combobox-trigger-width)] min-w-[var(--bits-combobox-trigger-width)] rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-none"
		sideOffset={10}
	>
		{#each filteredFruits as fruit (fruit.value)}
			<Combobox.Item
				class="flex h-10 w-full select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none transition-all duration-75 data-[highlighted]:bg-muted"
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
			<span class="block px-5 py-2 text-sm text-muted-foreground"> No results found </span>
		{/each}
	</Combobox.Content>
</Combobox.Root>
