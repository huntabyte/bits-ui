<script lang="ts">
	import { Listbox } from "bits-ui";
	import { Check } from "$icons/index.js";

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

	let value = $state("dark-green");
</script>

<div class="flex flex-col gap-4">
	<Listbox.Root type="single" bind:value>
		<Listbox.Content
			class="max-h-80 w-full min-w-[296px] max-w-[296px] overflow-y-scroll rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-none"
		>
			{#each themes as item}
				<Listbox.Item
					value={item.value}
					label={item.label}
					class="flex h-10 w-full select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm outline-none transition-all duration-75 focus:outline-none focus-visible:outline-none data-[highlighted]:bg-muted"
				>
					{#snippet children({ selected })}
						{item.label}
						{#if selected}
							<span class="ml-auto">
								<Check />
							</span>
						{/if}
					{/snippet}
				</Listbox.Item>
			{/each}
		</Listbox.Content>
	</Listbox.Root>

	<div>
		Selected: {value}
	</div>
</div>
