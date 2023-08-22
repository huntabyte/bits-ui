<script lang="ts">
	import * as Select from "@/components/ui/select";

	const fruits = [
		{ value: "apple", label: "Apple" },
		{ value: "banana", label: "Banana" },
		{ value: "blueberry", label: "Blueberry" },
		{ value: "grapes", label: "Grapes" },
		{ value: "pineapple", label: "Pineapple" }
	];
	let value: any;
</script>

<Select.Root bind:value>
	<Select.Trigger class="w-[180px]">
		<Select.Value placeholder="Select a fruit" />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Fruits</Select.Label>
			{#each fruits as fruit}
				<Select.Item value={fruit.value} label={fruit.label} on:m-click={() => console.log("click")}
					>{fruit.label}</Select.Item
				>
			{/each}
		</Select.Group>
	</Select.Content>
	<Select.Input name="favoriteFruit" />
</Select.Root>
