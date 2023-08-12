<script lang="ts">
	import * as Select from "$lib/primitives/select";
	const fruits = [
		{ value: "apple", label: "Apple" },
		{ value: "banana", label: "Banana" },
		{ value: "blueberry", label: "Blueberry" },
		{ value: "grapes", label: "Grapes" },
		{ value: "pineapple", label: "Pineapple" }
	];
</script>

<div class="flex w-full p-8">
	<Select.Root>
		<Select.Trigger
			class="w-[180px] flex h-10 items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm  placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
		>
			<Select.Value placeholder="Select a fruit" />
		</Select.Trigger>
		<Select.Content
			class="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-green-300 shadow-md"
		>
			<Select.Group>
				<Select.Label>Fruits</Select.Label>
				{#each fruits as fruit}
					<Select.Item
						value={fruit.value}
						label={fruit.label}
						class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
						>{fruit.label}</Select.Item
					>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="favoriteFruit" />
	</Select.Root>
</div>
