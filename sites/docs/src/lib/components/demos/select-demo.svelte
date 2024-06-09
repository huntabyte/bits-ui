<script lang="ts">
	import { Select } from "bits-ui";
	import { CaretUpDown, Check, Palette } from "$icons/index.js";

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
</script>

<div class="flex flex-col gap-4">
	<div>
		<Select.Root>
			<Select.Trigger
				class="inline-flex h-input w-[296px] items-center rounded-9px border border-border-input bg-background px-[11px] text-sm transition-colors placeholder:text-foreground-alt/50 "
				aria-label="Select a theme"
			>
				<Palette class="mr-[9px] size-6 text-muted-foreground" />
				<Select.Value class="text-sm" placeholder="Select a theme" />
				<CaretUpDown class="ml-auto size-6 text-muted-foreground" />
			</Select.Trigger>
			<Select.Portal>
				<Select.Content
					class="z-50 max-h-96 w-full min-w-[296px] rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-none"
					sideOffset={8}
					sameWidth={true}
				>
					<Select.ScrollUpButton class="flex w-full items-center justify-center"
						>up</Select.ScrollUpButton
					>
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
					<Select.ScrollDownButton class="flex w-full items-center justify-center"
						>down</Select.ScrollDownButton
					>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	</div>
</div>
