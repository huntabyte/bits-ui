<script lang="ts">
	import { Select } from "bits-ui";
	import "../../app.css";

	const menuItems = [
		{ value: "1", label: "A" },
		{ value: "2", label: "B" },
	];

	let { value = $bindable([]), open = $bindable(false) } = $props();
</script>

<main data-testid="main">
	<Select.Root bind:value bind:open type="multiple" items={[]}>
		<Select.Trigger data-testid="trigger">
			<Select.Value placeholder="Pick themes">
				{#snippet children({ selection, placeholder })}
					<span data-testid="selection-label">
						{selection.type === "multiple" && selection.selected.length > 0
							? selection.selected.map((v) => v.label).join(", ")
							: placeholder}
					</span>
				{/snippet}
			</Select.Value>
		</Select.Trigger>
		<Select.Portal>
			<Select.Content data-testid="content">
				{#each menuItems as item (item.value)}
					<Select.Item
						data-testid={item.value}
						value={item.value}
						label={item.label}
					>
						{item.label}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Portal>
	</Select.Root>
</main>
