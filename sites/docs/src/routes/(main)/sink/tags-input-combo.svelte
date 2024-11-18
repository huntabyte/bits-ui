<script lang="ts">
	import { Combobox, TagsInput } from "bits-ui";
	import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
	import Check from "phosphor-svelte/lib/Check";
	import OrangeSlice from "phosphor-svelte/lib/OrangeSlice";
	import CaretDoubleUp from "phosphor-svelte/lib/CaretDoubleUp";
	import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";
	import X from "phosphor-svelte/lib/X";

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

	let value = $state<string[]>([]);
	let inputValue = $state("");
	let comboboxOpen = $state(false);
</script>

<Combobox.Root
	type="multiple"
	{value}
	name="favoriteFruit"
	onOpenChange={(o) => {
		if (!o) searchValue = "";
	}}
	controlledValue
	onValueChange={(v) => {
		value = v;
	}}
	bind:open={comboboxOpen}
>
	<div class="flex items-center justify-center">
		<TagsInput.Root
			{value}
			controlledValue
			onValueChange={(v) => {
				value = v;
			}}
			class="flex flex-col gap-2"
			delimiters={[","]}
		>
			<div
				class="flex h-auto w-[330px] flex-col gap-4 rounded-card-sm border-border-input bg-background p-4 text-sm placeholder:text-foreground-alt/50"
			>
				<TagsInput.List class="flex min-h-5 flex-wrap gap-1.5">
					{#each value as tag, index}
						<TagsInput.Tag value={tag} {index} editMode="contenteditable">
							<TagsInput.TagContent
								class="flex items-center gap-1 rounded-[4px] bg-[#FCDAFE] text-[0.7rem] font-semibold leading-none text-[#2A266B] no-underline group-hover:no-underline"
							>
								<TagsInput.TagText class="py-1 pl-1.5">
									{tag}
								</TagsInput.TagText>
								<TagsInput.TagRemove
									class="flex items-center justify-center rounded-r-[4px] px-1 py-1 hover:bg-[#edc6f0]"
								>
									<X class="size-3" />
								</TagsInput.TagRemove>
							</TagsInput.TagContent>
							<!-- <TagsInput.TagEdit /> -->
						</TagsInput.Tag>
					{/each}
				</TagsInput.List>
				<div class="relative">
					<OrangeSlice
						class="absolute start-3 top-1/2 size-6 -translate-y-1/2 text-muted-foreground"
					/>
					<Combobox.Input
						oninput={(e) => (searchValue = e.currentTarget.value)}
						onblur={() => (comboboxOpen = false)}
						class="inline-flex h-input w-[296px] truncate rounded-9px border border-border-input bg-background px-11 text-sm transition-colors placeholder:text-foreground-alt/50 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
						placeholder="Search a fruit"
						aria-label="Search a fruit"
						bind:value={inputValue}
					>
						{#snippet child({ props })}
							<TagsInput.Input {...props} blurBehavior="none" />
						{/snippet}
					</Combobox.Input>
					<Combobox.Trigger class="absolute end-3 top-1/2 size-6 -translate-y-1/2">
						<CaretUpDown class="size-6 text-muted-foreground" />
					</Combobox.Trigger>
				</div>
			</div>
			<TagsInput.Clear
				class="inline-flex h-input w-full items-center justify-center rounded-input bg-muted text-[15px] font-medium shadow-mini transition-all hover:bg-dark-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
			>
				Clear Tags
			</TagsInput.Clear>
		</TagsInput.Root>
	</div>

	<Combobox.Portal>
		<Combobox.Content
			class="max-h-96 w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)] rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-none"
			sideOffset={10}
		>
			<Combobox.ScrollUpButton class="flex w-full items-center justify-center">
				<CaretDoubleUp class="size-3" />
			</Combobox.ScrollUpButton>
			<Combobox.Viewport class="p-1">
				{#each filteredFruits as fruit, i (i + fruit.value)}
					<Combobox.Item
						class="flex h-10 w-full select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none  data-[highlighted]:bg-muted"
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
			<Combobox.ScrollDownButton class="flex w-full items-center justify-center">
				<CaretDoubleDown class="size-3" />
			</Combobox.ScrollDownButton>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
