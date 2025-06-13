<script lang="ts">
	import { Select } from "bits-ui";
	import Check from "phosphor-svelte/lib/Check";
	import Palette from "phosphor-svelte/lib/Palette";
	import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
	import CaretDoubleUp from "phosphor-svelte/lib/CaretDoubleUp";
	import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";
	import { fly } from "svelte/transition";

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

	let value = $state<string>("");
	const selectedLabel = $derived(
		value ? themes.find((theme) => theme.value === value)?.label : "Select a theme"
	);
</script>

<Select.Root type="single" bind:value items={themes}>
	<Select.Trigger
		class="h-input rounded-9px border-border-input bg-background placeholder:text-foreground-alt/50 inline-flex w-[296px] touch-none select-none items-center border px-[11px] text-sm transition-colors"
		aria-label="Select a theme"
	>
		<Palette class="text-muted-foreground mr-[9px] size-6" />
		{selectedLabel}
		<CaretUpDown class="text-muted-foreground ml-auto size-6" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			class="focus-override border-muted bg-background shadow-popover outline-hidden z-50 h-96 max-h-[var(--bits-select-content-available-height)] w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-xl border px-1 py-3"
			sideOffset={10}
			forceMount
		>
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} transition:fly={{ duration: 300 }}>
							<Select.ScrollUpButton class="flex w-full items-center justify-center">
								<CaretDoubleUp class="size-3" />
							</Select.ScrollUpButton>
							<Select.Viewport class="p-1">
								{#each themes as theme, i (i + theme.value)}
									<Select.Item
										class="rounded-button data-highlighted:bg-muted outline-hidden flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 text-sm capitalize duration-75"
										value={theme.value}
										label={theme.label}
									>
										{#snippet children({ selected })}
											{theme.label}
											{#if selected}
												<div class="ml-auto">
													<Check />
												</div>
											{/if}
										{/snippet}
									</Select.Item>
								{/each}
							</Select.Viewport>
							<Select.ScrollDownButton
								class="flex w-full items-center justify-center"
							>
								<CaretDoubleDown class="size-3" />
							</Select.ScrollDownButton>
						</div>
					</div>
				{/if}
			{/snippet}
		</Select.Content>
	</Select.Portal>
</Select.Root>
