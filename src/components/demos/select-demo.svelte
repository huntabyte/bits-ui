<script lang="ts">
	import { Select } from "$lib";
	import { flyAndScale } from "@/utils";

	const fruits = [
		{ value: "svelte", label: "Svelte" },
		{ value: "vue", label: "Vue" },
		{ value: "solid", label: "Solid" },
		{ value: "angular", label: "Angular" },
		{ value: "react", label: "React" }
	];
</script>

<Select.Root>
	<Select.Trigger
		class="inline-flex h-input w-[180px] items-center rounded-card-sm border border-dark-10 bg-background px-4 text-sm transition-colors placeholder:text-foreground-alt/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
	>
		<Select.Value
			class="text-sm font-medium"
			placeholder="Select a framework"
		/>
	</Select.Trigger>
	<Select.Content
		class="w-full rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none"
		transition={flyAndScale}
		sideOffset={8}
	>
		<Select.Group>
			<Select.Label class="py-1.5 pl-2 text-sm font-medium"
				>Frameworks</Select.Label
			>
			{#each fruits as fruit}
				<Select.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm outline-none transition-all duration-75 data-[selected]:bg-muted data-[highlighted]:hover:bg-muted/50"
					value={fruit.value}
					label={fruit.label}>{fruit.label}</Select.Item
				>
			{/each}
		</Select.Group>
	</Select.Content>
	<Select.Input name="favoriteFruit" />
</Select.Root>
