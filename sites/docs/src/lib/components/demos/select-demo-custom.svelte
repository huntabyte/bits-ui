<script lang="ts">
	import { Select, type WithoutChildren } from "bits-ui";
	import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
	import Check from "phosphor-svelte/lib/Check";
	import Palette from "phosphor-svelte/lib/Palette";
	import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";
	import CaretDoubleUp from "phosphor-svelte/lib/CaretDoubleUp";

	let {
		value = $bindable(""),
		contentProps,
		...restProps
	}: WithoutChildren<Select.RootProps> & {
		contentProps?: WithoutChildren<Select.ContentProps>;
	} = $props();

	const themes = [
		{ value: "light-monochrome", label: "Light Monochrome" },
		{ value: "dark-green", label: "Dark Green" },
		{ value: "svelte-orange", label: "Svelte Orange" },
		{ value: "punk-pink", label: "Punk Pink" },
		{ value: "ocean-blue", label: "Ocean Blue" },
		{ value: "sunset-red", label: "Sunset Red" },
		{ value: "forest-green", label: "Forest Green" },
		{ value: "lavender-purple", label: "Lavender Purple" },
		{ value: "mustard-yellow", label: "Mustard Yellow" },
		{ value: "slate-gray", label: "Slate Gray" },
		{ value: "neon-green", label: "Neon Green" },
		{ value: "coral-reef", label: "Coral Reef" },
		{ value: "midnight-blue", label: "Midnight Blue" },
		{ value: "crimson-red", label: "Crimson Red" },
		{ value: "mint-green", label: "Mint Green" },
		{ value: "pastel-pink", label: "Pastel Pink" },
		{ value: "golden-yellow", label: "Golden Yellow" },
		{ value: "deep-purple", label: "Deep Purple" },
		{ value: "turquoise-blue", label: "Turquoise Blue" },
		{ value: "burnt-orange", label: "Burnt Orange" },
	];

	const selectedLabel = $derived(themes.find((theme) => theme.value === value)?.label);
</script>

<Select.Root name="hello" bind:value {...restProps}>
	<Select.Trigger
		class="inline-flex h-input w-[296px] select-none items-center rounded-9px border border-border-input bg-background px-[11px] text-sm transition-colors placeholder:text-foreground-alt/50"
		aria-label="Select a theme"
	>
		<Palette class="mr-[9px] size-6 text-muted-foreground" />
		{#if selectedLabel}
			<Select.Value class="text-sm">
				{selectedLabel}
			</Select.Value>
		{:else}
			<Select.Value class="text-sm" placeholder="Select a theme" />
		{/if}
		<CaretUpDown class="ml-auto size-6 text-muted-foreground" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			{...contentProps}
			class="focus-override z-50 max-h-96 w-full min-w-[296px] rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-none"
			sideOffset={8}
		>
			<Select.ScrollUpButton class="flex w-full items-center justify-center">
				<CaretDoubleUp class="size-3" />
			</Select.ScrollUpButton>
			<Select.Viewport class="p-1">
				{#each themes as theme}
					<Select.Item
						class="focus-override flex h-10 w-full select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm outline-none transition-all duration-75 focus:outline-none focus-visible:outline-none data-[highlighted]:bg-muted"
						value={theme.value}
					>
						{#snippet children({ selected })}
							<Select.ItemText>
								{theme.label}
							</Select.ItemText>
							{#if selected}
								<span class="ml-auto">
									<Check />
								</span>
							{/if}
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Viewport>
			<Select.ScrollDownButton class="flex w-full items-center justify-center py-1">
				<CaretDoubleDown class="size-3" />
			</Select.ScrollDownButton>
		</Select.Content>
	</Select.Portal>
</Select.Root>
