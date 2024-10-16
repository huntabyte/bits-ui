<script lang="ts">
	import { Listbox } from "bits-ui";
	import Check from "phosphor-svelte/lib/Check";
	import Palette from "phosphor-svelte/lib/Palette";
	import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
	import CaretDoubleUp from "phosphor-svelte/lib/CaretDoubleUp";
	import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";

	const states = [
		{ value: "MD", label: "Maryland" },
		{ value: "VA", label: "Virginia" },
		{ value: "VT", label: "Vermont" },
		{ value: "NY", label: "New York" },
		{ value: "NJ", label: "New Jersey" },
		{ value: "CT", label: "Connecticut" },
		{ value: "MA", label: "Massachusetts" },
		{ value: "HI", label: "Hawaii" },
		{ value: "WA", label: "Washington" },
		{ value: "OR", label: "Oregon" },
		{ value: "CA", label: "California" },
		{ value: "FL", label: "Florida" },
		{ value: "WV", label: "West Virginia" },
		{ value: "WY", label: "Wyoming" },
	];

	let value = $state<string>("");
	const selectedLabel = $derived(
		value
			? states.find((theme) => theme.value.toLowerCase() === value.toLowerCase())?.label
			: "State"
	);
</script>

<Listbox.Root type="single" bind:value items={states} name="state">
	<Listbox.Trigger
		class="inline-flex h-input w-[296px] select-none items-center rounded-9px border border-border-input bg-background px-[11px] text-sm transition-colors placeholder:text-foreground-alt/50"
		aria-label="Select a theme"
	>
		<Palette class="mr-[9px] size-6 text-muted-foreground" />
		{selectedLabel}
		<CaretUpDown class="ml-auto size-6 text-muted-foreground" />
	</Listbox.Trigger>
	<Listbox.Portal>
		<Listbox.Content
			class="max-h-96 w-[var(--bits-listbox-anchor-width)] min-w-[var(--bits-listbox-anchor-width)] rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-none"
			sideOffset={10}
		>
			<Listbox.ScrollUpButton class="flex w-full items-center justify-center">
				<CaretDoubleUp class="size-3" />
			</Listbox.ScrollUpButton>
			<Listbox.Viewport class="p-1">
				{#each states as state, i (i + state.value)}
					<Listbox.Item
						class="flex h-10 w-full select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none duration-75 data-[highlighted]:bg-muted"
						value={state.value}
						label={state.label}
					>
						{#snippet children({ selected })}
							{state.label}
							{#if selected}
								<div class="ml-auto">
									<Check />
								</div>
							{/if}
						{/snippet}
					</Listbox.Item>
				{/each}
			</Listbox.Viewport>
			<Listbox.ScrollDownButton class="flex w-full items-center justify-center">
				<CaretDoubleDown class="size-3" />
			</Listbox.ScrollDownButton>
		</Listbox.Content>
	</Listbox.Portal>
</Listbox.Root>
