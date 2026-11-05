<script lang="ts">
	import { Select } from "bits-ui";
	import Check from "phosphor-svelte/lib/Check";
	import Palette from "phosphor-svelte/lib/Palette";
	import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
	import CaretDoubleUp from "phosphor-svelte/lib/CaretDoubleUp";
	import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";
	import { cubicOut } from "svelte/easing";

	const themes = [
		{ value: "light-monochrome", label: "Light Monochrome" },
		{ value: "dark-green", label: "Dark Green" },
		{ value: "svelte-orange", label: "Svelte Orange" },
		{ value: "punk-pink", label: "Punk Pink" },
		{ value: "ocean-blue", label: "Ocean Blue", disabled: true },
		{ value: "sunset-orange", label: "Sunset Orange" },
		{ value: "sunset-red", label: "Sunset Red" },
		{ value: "forest-green", label: "Forest Green" },
		{ value: "lavender-purple", label: "Lavender Purple", disabled: true },
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

	// Duplicate the menu items a couple of times to show off scrolling a big list
	const baseThemes = [...themes];
	for (let i = 0; i < 10; i++) {
		for (let baseTheme of baseThemes) {
			themes.push({ ...baseTheme, value: baseTheme.value + i });
		}
	}

	function autoScrollDelay(tick: number) {
		const maxDelay = 200;
		const minDelay = 25;
		const steps = 30;

		const progress = Math.min(tick / steps, 1);
		// Use the cubicOut easing function from svelte/easing
		return maxDelay - (maxDelay - minDelay) * cubicOut(progress);
	}
</script>

<Select.Root type="single" items={themes}>
	<Select.Trigger
		class="inline-flex h-input w-[296px] touch-none items-center rounded-9px border border-border-input bg-background px-[11px] text-sm transition-colors select-none data-placeholder:text-foreground-alt/50"
		aria-label="Select a theme"
	>
		<Palette class="mr-[9px] size-6 text-muted-foreground" />
		<Select.Value placeholder="Select a theme" />
		<CaretUpDown class="ml-auto size-6 text-muted-foreground" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			class="focus-override z-50 h-96 max-h-[var(--bits-select-content-available-height)] w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-hidden select-none data-[side=bottom]:translate-y-1 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:-translate-x-1 data-[side=left]:slide-in-from-right-2 data-[side=right]:translate-x-1 data-[side=right]:slide-in-from-left-2 data-[side=top]:-translate-y-1 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
			sideOffset={10}
		>
			<Select.ScrollUpButton
				class="flex w-full items-center justify-center"
				delay={autoScrollDelay}
			>
				<CaretDoubleUp class="size-3" />
			</Select.ScrollUpButton>
			<Select.Viewport class="p-1">
				{#each themes as theme, i (i + theme.value)}
					<Select.Item
						class="flex h-10 w-full items-center rounded-button py-3 pr-1.5 pl-5 text-sm capitalize outline-hidden select-none data-disabled:opacity-50  data-highlighted:bg-muted"
						value={theme.value}
						label={theme.label}
						disabled={theme.disabled}
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
				delay={autoScrollDelay}
			>
				<CaretDoubleDown class="size-3" />
			</Select.ScrollDownButton>
		</Select.Content>
	</Select.Portal>
</Select.Root>
