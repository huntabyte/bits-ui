<script lang="ts">
	import { Combobox } from "$lib";
	import { flyAndScale } from "@/utils";
	import { Check, OrangeSlice, CaretUpDown } from "phosphor-svelte";

	const fruits = ["mango", "water melon", "apple", "pineapple", "orange"];
	let filteredFruits: string[] = [];

	let inputValue = "";

	$: if (inputValue !== "") {
		filteredFruits = fruits.filter((fruit) =>
			fruit.includes(inputValue.toLowerCase())
		);
	} else {
		filteredFruits = fruits;
	}
</script>

<Combobox.Root bind:inputValue>
	<Combobox.Content class="relative">
		<Combobox.Input
			placeholder="Select a fruit"
			class="inline-flex h-input w-[296px] items-center truncate rounded-9px border border-border-input bg-background px-12 text-sm transition-colors placeholder:text-foreground-alt/50  focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background "
		/>
		<OrangeSlice
			class="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground sq-6"
		/>
		<CaretUpDown
			class="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground sq-6"
		/>
	</Combobox.Content>

	<Combobox.Menu
		class="w-full rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-none"
		transition={flyAndScale}
		sideOffset={8}
	>
		{#if filteredFruits.length}
			{#each filteredFruits as fruit, index (fruit)}
				<Combobox.Item
					class="flex h-10 w-full select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none transition-all duration-75 data-[highlighted]:bg-muted"
					value={fruit}
				>
					{fruit}
					<Combobox.ItemIndicator class="ml-auto" asChild={false}>
						<Check />
					</Combobox.ItemIndicator>
				</Combobox.Item>
			{/each}
		{:else}
			<span class="block px-5 py-2 text-sm text-muted-foreground">
				No results found
			</span>
		{/if}
	</Combobox.Menu>
	<Combobox.HiddenInput name="favoriteFruit" />
</Combobox.Root>
